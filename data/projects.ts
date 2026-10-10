export type ProjectCategory =
  | "Web Development"
  | "Academic Projects"
  | "UI/UX"
  | "Database Systems";

export type Project = {
  title: string;
  category: ProjectCategory;
  type: string;
  description: string;
  technologies: string[];
  mark: string;
  color: string;
  image?: string;
  imageAlt?: string;
  href?: string;
};

export const projects: Project[] = [
  {
    title: "Web-Based QR-Enabled Pet Registration, Vaccination, and Traceability Management System",
    category: "Web Development",
    type: "Web Development / Capstone Project",
    description:
      "A web-based system developed to help improve the management of pet registration, vaccination, traceability, payment monitoring, and veterinary records. QR-enabled pet records make identification and record retrieval more organized.",
    technologies: ["React", "Laravel", "PHP", "MySQL", "Tailwind CSS", "QR codes"],
    mark: "P+",
    color: "#314936",
    image: "/images/projects/dashboard.jpg",
    imageAlt: "Homepage of the Cabuyao City Veterinary Office pet registration system",
    href: "/case-study",
  },
  {
    title: "DepEd Loan Management System",
    category: "Academic Projects",
    type: "Web Development / Academic Project",
    description:
      "A web-based loan management system created for DepEd Cabuyao to organize employee loan applications, approvals, loan records, and payment tracking.",
    technologies: ["Laravel", "PHP", "MySQL", "JavaScript", "HTML", "CSS"],
    mark: "LM",
    color: "#536b77",
  },
  {
    title: "Project Title",
    category: "Database Systems",
    type: "Academic Project",
    description:
      "Short project description. Replace this entry with another database or systems project from your coursework.",
    technologies: ["Database Design", "MySQL"],
    mark: "DB",
    color: "#74654a",
  },
  {
    title: "Project Title",
    category: "UI/UX",
    type: "Academic Project",
    description:
      "Short project description. Add a class or personal interface project here when you are ready.",
    technologies: ["Figma", "UI/UX"],
    mark: "UX",
    color: "#5d5d4e",
  },
];

export const filters = [
  "All",
  "Web Development",
  "Academic Projects",
  "UI/UX",
  "Database Systems",
] as const;

export const skills = [
  { category: "FRONTEND", items: ["HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { category: "BACKEND", items: ["PHP", "Laravel", "Node.js"] },
  { category: "DATABASE", items: ["MySQL", "Database Design"] },
  { category: "TOOLS", items: ["Git", "GitHub", "VS Code", "Figma"] },
];

export const technologies = [
  "HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript",
  "Laravel", "PHP", "MySQL", "Git", "GitHub", "Tailwind CSS",
];