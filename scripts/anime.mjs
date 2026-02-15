/**
 * Anime list management CLI.
 *
 * Usage:
 *   pnpm anime add <anilistId> [feeling] [status] [episode]
 *   pnpm anime update <anilistId> [feeling] [status] [episode]
 *   pnpm anime remove <anilistId>
 *   pnpm anime list
 *
 * Examples:
 *   pnpm anime add 9253 masterpiece completed
 *   pnpm anime add 9253 loved watching 5
 *   pnpm anime add 9253 loved             # defaults to watching
 *   pnpm anime update 9253 masterpiece completed
 *   pnpm anime update 9253 loved watching 12
 *   pnpm anime remove 9253
 *   pnpm anime list
 *
 * Valid feelings: masterpiece, loved, okay, not_for_me, disliked
 * Valid statuses: watching, completed, planned, onhold, dropped
 *
 * When status is "watching", pass an episode number as the last arg to set progress.
 * When status is "completed", progress is auto-set to totalEpisodes.
 */

import fs from "fs";
import path from "path";

const VALID_FEELINGS = ["masterpiece", "loved", "okay", "not_for_me", "disliked"];
const VALID_STATUSES = ["watching", "completed", "planned", "onhold", "dropped"];
const YEAR_CUTOFF = 2018;
const ANIME_DIR = path.resolve("src/data/anime");

// ── helpers ──────────────────────────────────────────────

function getAllFiles() {
	if (!fs.existsSync(ANIME_DIR)) return [];
	return fs
		.readdirSync(ANIME_DIR)
		.filter((f) => f.endsWith(".json"))
		.map((f) => path.join(ANIME_DIR, f));
}

function readAnimeFile(filePath) {
	try {
		return JSON.parse(fs.readFileSync(filePath, "utf-8"));
	} catch {
		return [];
	}
}

function writeAnimeFile(filePath, data) {
	const json = JSON.stringify(data, null, "\t").replace(
		/"genre": \[\s+([^\]]+?)\s+\]/g,
		(_, inner) => `"genre": [${inner.replace(/\n\s+/g, " ")}]`,
	);
	fs.writeFileSync(filePath, json + "\n");
}

function findEntry(anilistId) {
	for (const filePath of getAllFiles()) {
		const entries = readAnimeFile(filePath);
		const index = entries.findIndex((e) => e.anilistId === anilistId);
		if (index !== -1) {
			return { filePath, entries, index, entry: entries[index] };
		}
	}
	return null;
}

function getTargetFile(year) {
	if (!year || year <= YEAR_CUTOFF) return "older.json";
	return `${year}.json`;
}

async function fetchFromAniList(id) {
	const query = `
		query ($id: Int) {
			Media(id: $id, type: ANIME) {
				id
				siteUrl
				title { romaji english native }
				startDate { year }
				genres
				studios(isMain: true) { nodes { name } }
				episodes
				format
				description(asHtml: false)
			}
		}
	`;

	const res = await fetch("https://graphql.anilist.co", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ query, variables: { id } }),
	});

	if (!res.ok) {
		throw new Error(`AniList API returned ${res.status} ${res.statusText}`);
	}

	const json = await res.json();
	const media = json?.data?.Media;
	if (!media) {
		throw new Error(`No anime found with AniList ID ${id}`);
	}

	return media;
}

function formatTitle(titleObj) {
	if (titleObj.english && titleObj.romaji && titleObj.english !== titleObj.romaji) {
		return `${titleObj.english} (${titleObj.romaji})`;
	}
	return titleObj.english || titleObj.romaji || titleObj.native || "Unknown";
}

function formatDescription(raw) {
	if (!raw) return "";
	return raw
		.replace(/<br\s*\/?>/gi, " ")
		.replace(/<[^>]+>/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

function formatEpisodes(media) {
	const formatMap = {
		TV: "TV",
		TV_SHORT: "TV Short",
		MOVIE: "Movie",
		SPECIAL: "Special",
		OVA: "OVA",
		ONA: "ONA",
		MUSIC: "Music",
	};
	const fmt = formatMap[media.format] || media.format || "TV";
	const eps = media.episodes || "?";
	return `${fmt} · ${eps} eps`;
}

function resolveProgress(status, episode, totalEpisodes) {
	if (status === "completed") return totalEpisodes || 0;
	if (episode !== undefined) return episode;
	return 0;
}

function validateFeeling(feeling) {
	if (feeling && !VALID_FEELINGS.includes(feeling)) {
		console.error(
			`Error: "${feeling}" is not a valid feeling.\nValid options: ${VALID_FEELINGS.join(", ")}`,
		);
		process.exit(1);
	}
}

function validateStatus(status) {
	if (!VALID_STATUSES.includes(status)) {
		console.error(
			`Error: "${status}" is not a valid status.\nValid options: ${VALID_STATUSES.join(", ")}`,
		);
		process.exit(1);
	}
}

function parseId(raw) {
	const id = parseInt(raw, 10);
	if (isNaN(id)) {
		console.error(`Error: "${raw}" is not a valid AniList ID`);
		process.exit(1);
	}
	return id;
}

// ── commands ─────────────────────────────────────────────

async function cmdAdd(args) {
	if (args.length === 0) {
		console.error("Usage: pnpm anime add <anilistId> [feeling] [status] [episode]");
		process.exit(1);
	}

	const anilistId = parseId(args[0]);
	const feeling = args[1] || "";
	const status = args[2] || "watching";
	const episode = args[3] !== undefined ? parseInt(args[3], 10) : undefined;

	validateFeeling(feeling);
	validateStatus(status);

	if (episode !== undefined && isNaN(episode)) {
		console.error(`Error: "${args[3]}" is not a valid episode number`);
		process.exit(1);
	}

	const existing = findEntry(anilistId);
	if (existing) {
		console.error(
			`Error: "${existing.entry.title}" (ID ${anilistId}) already exists in ${path.basename(existing.filePath)}`,
		);
		process.exit(1);
	}

	console.log(`Fetching AniList ID ${anilistId}...`);
	const media = await fetchFromAniList(anilistId);

	const year = media.startDate?.year;
	const title = formatTitle(media.title);
	const studios = (media.studios?.nodes || []).map((s) => s.name).join(", ");
	const totalEpisodes = media.episodes || 0;

	const entry = {
		anilistId: media.id,
		title,
		status,
		...(feeling ? { feeling } : {}),
		description: formatDescription(media.description),
		episodes: formatEpisodes(media),
		year: year ? String(year) : "",
		genre: media.genres || [],
		studio: studios,
		link: media.siteUrl || `https://anilist.co/anime/${media.id}/`,
		progress: resolveProgress(status, episode, totalEpisodes),
		totalEpisodes,
		startDate: "",
		endDate: "",
	};

	const targetFile = getTargetFile(year);
	const targetPath = path.join(ANIME_DIR, targetFile);

	if (!fs.existsSync(ANIME_DIR)) {
		fs.mkdirSync(ANIME_DIR, { recursive: true });
	}

	const fileEntries = fs.existsSync(targetPath) ? readAnimeFile(targetPath) : [];
	fileEntries.push(entry);
	writeAnimeFile(targetPath, fileEntries);

	console.log(`\n✓ Added "${title}" to ${targetFile}`);
	console.log(`  Year: ${year || "unknown"} | Studio: ${studios || "unknown"} | Episodes: ${totalEpisodes || "?"}`);
	console.log(`  Status: ${status} | Progress: ${entry.progress}/${totalEpisodes}`);
	if (feeling) console.log(`  Feeling: ${feeling}`);
	console.log(`  Link: ${entry.link}`);
}

function cmdUpdate(args) {
	if (args.length < 2) {
		console.error("Usage: pnpm anime update <anilistId> [feeling] [status] [episode]");
		process.exit(1);
	}

	const anilistId = parseId(args[0]);
	const feeling = args[1] || "";
	const status = args[2] || "";
	const episode = args[3] !== undefined ? parseInt(args[3], 10) : undefined;

	if (feeling) validateFeeling(feeling);
	if (status) validateStatus(status);

	if (episode !== undefined && isNaN(episode)) {
		console.error(`Error: "${args[3]}" is not a valid episode number`);
		process.exit(1);
	}

	const found = findEntry(anilistId);
	if (!found) {
		console.error(`Error: No anime with AniList ID ${anilistId} found in any data file`);
		process.exit(1);
	}

	const { filePath, entries, index, entry } = found;
	const changes = [];

	if (feeling) {
		entry.feeling = feeling;
		changes.push(`feeling → ${feeling}`);
	}

	if (status) {
		entry.status = status;
		changes.push(`status → ${status}`);

		if (status === "completed") {
			entry.progress = entry.totalEpisodes || 0;
			changes.push(`progress → ${entry.progress}`);
		}
	}

	if (episode !== undefined) {
		entry.progress = episode;
		changes.push(`progress → ${episode}`);
	}

	entries[index] = entry;
	writeAnimeFile(filePath, entries);

	console.log(`\n✓ Updated "${entry.title}" in ${path.basename(filePath)}`);
	changes.forEach((c) => console.log(`  ${c}`));
}

function cmdRemove(args) {
	if (args.length === 0) {
		console.error("Usage: pnpm anime remove <anilistId>");
		process.exit(1);
	}

	const anilistId = parseId(args[0]);
	const found = findEntry(anilistId);

	if (!found) {
		console.error(`Error: No anime with AniList ID ${anilistId} found in any data file`);
		process.exit(1);
	}

	const { filePath, entries, index, entry } = found;
	entries.splice(index, 1);

	if (entries.length === 0) {
		fs.unlinkSync(filePath);
		console.log(`\n✓ Removed "${entry.title}" — ${path.basename(filePath)} was empty and deleted`);
	} else {
		writeAnimeFile(filePath, entries);
		console.log(`\n✓ Removed "${entry.title}" from ${path.basename(filePath)}`);
	}
}

function cmdList() {
	const allEntries = [];
	for (const filePath of getAllFiles()) {
		const entries = readAnimeFile(filePath);
		for (const e of entries) {
			allEntries.push({ ...e, _file: path.basename(filePath) });
		}
	}

	if (allEntries.length === 0) {
		console.log("No anime entries found.");
		return;
	}

	// Group by feeling
	const groups = {};
	const order = ["masterpiece", "loved", "okay", "not_for_me", "disliked", "_unrated"];
	for (const e of allEntries) {
		const key = e.feeling && VALID_FEELINGS.includes(e.feeling) ? e.feeling : "_unrated";
		if (!groups[key]) groups[key] = [];
		groups[key].push(e);
	}

	console.log(`\n${allEntries.length} titles total\n`);

	for (const key of order) {
		const items = groups[key];
		if (!items || items.length === 0) continue;

		const label = {
			masterpiece: "★ Personal picks",
			loved: "♥ Highly recommend",
			okay: "— If you're up to it",
			not_for_me: "~ Didn't click",
			disliked: "✗ Avoid these",
			_unrated: "? Unrated",
		}[key];

		console.log(`${label} (${items.length})`);
		items
			.sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0))
			.forEach((e) => {
				const statusIcon = { watching: "▶", completed: "✓", planned: "❤", onhold: "⏸", dropped: "✗" }[e.status] || "?";
				const progress = e.status === "watching" ? ` [${e.progress}/${e.totalEpisodes}]` : "";
				console.log(`  ${statusIcon} ${e.title} (${e.year || "?"})${progress}  #${e.anilistId}`);
			});
		console.log();
	}
}

// ── main ─────────────────────────────────────────────────

const COMMANDS = { add: cmdAdd, update: cmdUpdate, remove: cmdRemove, list: cmdList };

const args = process.argv.slice(2);
const command = args[0];

if (!command || !COMMANDS[command]) {
	console.error(`Usage: pnpm anime <command> [args]

Commands:
  add <id> [feeling] [status] [episode]     Add a new anime by AniList ID
  update <id> [feeling] [status] [episode]  Update feeling/status/progress
  remove <id>                               Remove an anime entry
  list                                      List all entries grouped by feeling

Valid feelings: ${VALID_FEELINGS.join(", ")}
Valid statuses: ${VALID_STATUSES.join(", ")}`);
	process.exit(1);
}

const runner = COMMANDS[command];
const result = runner(args.slice(1));

if (result instanceof Promise) {
	result.catch((err) => {
		console.error("\n✘ Error:", err.message);
		process.exit(1);
	});
}
