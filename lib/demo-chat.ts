import { projects, skills } from "@/data/projects";
import { contactEmail, socialLinks } from "@/data/portfolio-profile";

const capstone = projects[0];

function projectList() {
  return projects
    .map((project) => `${project.title} (${project.type})\n${project.description}\nTechnologies: ${project.technologies.join(", ")}.`)
    .join("\n\n");
}

function skillList() {
  return skills.map((group) => `${group.category}: ${group.items.join(", ")}`).join("\n");
}

export function generateDemoReply(question: string) {
  const text = question.toLowerCase();
  const taglish = /\b(sino|ano|paano|saan|kamusta|kumusta|po|ba|kanya|niya|gamit|ginawa|paaralan|proyekto|teknolohiya)\b/i.test(text);
  const lead = taglish ? "Sige! Sa portfolio demo na ito, ito ang impormasyong nakalista tungkol kay Zyrus: " : "";

  if (/\b(contact|email|reach|social|github|facebook|instagram|message)\b/i.test(text)) {
    const socials = socialLinks.map((social) => `${social.name}: [${social.name}](${social.href})`).join("\n");
    return `${lead}You can reach Zyrus at [${contactEmail}](mailto:${contactEmail}). His configured social profiles are:\n${socials}\n\n[Contact Zyrus](/#contact)`;
  }

  if (/\b(capstone|pet|qr|vaccinat|traceab|payment|analytics|veterinar|clinic)\b/i.test(text)) {
    return `${lead}The capstone is titled "Web-Based QR-Enabled Pet Registration, Vaccination, and Traceability Management System with Payment Monitoring and Data Analytics for the City Veterinary Animal Clinic in Cabuyao City, Laguna." It is an academic project intended to organize pet and owner registration, vaccination and veterinary histories, traceability, payment monitoring, and analytics. The case study describes the problem as keeping connected records easy for clinic staff to maintain and retrieve.\n\nIts listed roles are Admin, Staff, and Pet Owner. Features include QR generation and record retrieval, vaccination, consultation and medication records, payment monitoring, requests, reports, announcements, activity tracking, and role-based access. A QR code provides a quicker path to a pet's record.\n\nTechnologies: ${capstone.technologies.join(", ")}. [Read Capstone Case Study](/case-study)`;
  }

  if (/\b(education|educational|school|university|degree|study|studied|background in school|paaralan|aral)\b/i.test(text)) {
    return `${lead}Zyrus is pursuing a Bachelor of Science in Information Technology at the University of Cabuyao (2022-2026). He completed Senior High School at Camp Vicente Lim Integrated School in the Information and Communications Technology strand (2019-2021). The portfolio also lists JavaScript Essentials 1 (2026) as a certification. [View Education](/#education)`;
  }

  if (/\b(technolog(?:y|ies)|tech|skill|stack|language|framework|tool|react|laravel|php|mysql|javascript|typescript|next\.js|tailwind|figma|prototyp)\b/i.test(text)) {
    return `${lead}Zyrus describes these as a growing toolkit from coursework and projects, rather than claiming a particular proficiency level:\n${skillList()}\nThe portfolio also mentions UI design, interface experiments, and Figma. For example, React, Laravel, PHP, and MySQL are listed on the pet-registration capstone and DepEd loan system. [Explore Skills](/#skills) [View Selected Work](/#work)`;
  }

  if (/\b(project|built|work|system|deped|loan|academic)\b/i.test(text)) {
    return `${lead}The portfolio lists these projects:\n\n${projectList()}\n\nThe entries named "Project Title" are placeholders and do not have more details yet. [View Selected Work](/#work)`;
  }

  if (/\b(who|about|background|zyrus|person|career|aspir)\b/i.test(text)) {
    return `${lead}Zyrus is a Bachelor of Science in Information Technology student at the University of Cabuyao and an aspiring web developer interested in web and software development. He enjoys building practical web applications, exploring technologies, and working on academic systems. The portfolio focuses on academic and personal work, not commercial client projects. [View Education](/#education) [View Selected Work](/#work)`;
  }

  return `${lead}I can share details that are present in Zyrus's portfolio: his background, education, technical toolkit, academic projects, or contact links. This clearly labeled demo uses portfolio facts only; configure OPENAI_API_KEY to enable generated AI replies. [View Selected Work](/#work)`;
}
