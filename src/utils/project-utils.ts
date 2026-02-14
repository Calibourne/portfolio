import { getCollection } from "astro:content";

export type Project = Awaited<
	ReturnType<typeof getCollection<"projects">>
>[number];

export async function getProjects() {
	return await getCollection("projects");
}

export async function getProjectStats() {
	const projects = await getCollection("projects");
	const total = projects.length;
	const completed = projects.filter(
		(p) => p.data.status === "completed",
	).length;
	const inProgress = projects.filter(
		(p) => p.data.status === "in-progress",
	).length;
	const planned = projects.filter(
		(p) => p.data.status === "planned",
	).length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
}

export async function getProjectsByCategory(category?: string) {
	const projects = await getCollection("projects");
	if (!category || category === "all") {
		return projects;
	}
	return projects.filter((p) => p.data.category === category);
}

export async function getFeaturedProjects() {
	const projects = await getCollection("projects");
	return projects.filter((p) => p.data.featured);
}

export async function getAllTechStack() {
	const projects = await getCollection("projects");
	const techSet = new Set<string>();
	projects.forEach((project) => {
		project.data.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
}

export async function getTechFrequency(): Promise<
	{ tech: string; count: number }[]
> {
	const projects = await getCollection("projects");
	const counts = new Map<string, number>();
	for (const project of projects) {
		for (const tech of project.data.techStack) {
			counts.set(tech, (counts.get(tech) ?? 0) + 1);
		}
	}
	return Array.from(counts.entries())
		.map(([tech, count]) => ({ tech, count }))
		.sort((a, b) => b.count - a.count);
}
