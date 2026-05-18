export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  github: string;
  demo: string | null;
  imagePlaceholder: string;
  accentColor: string;
  tags: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  type: "Intern" | "Full-time" | "Part-time" | "Contract";
  description: [string, string];
  techStack: string[];
}

export interface SkillCategory {
  label: string;
  items: string[];
}

export interface Skills {
  Languages: string[];
  Databases: string[];
  Frameworks: string[];
  Tools: string[];
  Coursework: string[];
}

export interface PersonalInfo {
  name: string;
  title: string;
  taglines: [string, string, string];
  email: string;
  github: string;
  linkedin: string;
  location: string;
  college: string;
  degree: string;
}
