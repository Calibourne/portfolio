import projectsData from "../data/projects.json";

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	visitUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
}

const projects: Project[] = projectsData as Project[];

export function getProjects(): Project[] {
	return projects;
}

export function getProjectStats() {
	const total = projects.length;
	const completed = projects.filter(
		(p) => p.status === "completed",
	).length;
	const inProgress = projects.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projects.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
}

export function getProjectsByCategory(category?: string): Project[] {
	if (!category || category === "all") {
		return projects;
	}
	return projects.filter((p) => p.category === category);
}

export function getFeaturedProjects(): Project[] {
	return projects.filter((p) => p.featured);
}

export function getAllTechStack(): string[] {
	const techSet = new Set<string>();
	projects.forEach((project) => {
		project.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
}

export function getTechFrequency(): { tech: string; count: number }[] {
	const counts = new Map<string, number>();
	for (const project of projects) {
		for (const tech of project.techStack) {
			counts.set(tech, (counts.get(tech) ?? 0) + 1);
		}
	}
	return Array.from(counts.entries())
		.map(([tech, count]) => ({ tech, count }))
		.sort((a, b) => b.count - a.count);
}
