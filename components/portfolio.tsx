"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import Image from "next/image";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import OfflineLink from "@/components/offline-link";
import { filters, projects, skills, technologies } from "@/data/projects";

const navItems = [
  ["Home", "home"],
  ["Work", "work"],
  ["About", "about"],
  ["Education", "education"],
  ["Contact", "contact"],
] as const;

const socialLinks = [
  { name: "GitHub", href: "https://github.com/Zyrus2k" },
  { name: "Facebook", href: "https://www.facebook.com/Zyrus.Miranda" },
  { name: "Instagram", href: "https://www.instagram.com/mrnda.zyr_/" },
];

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
  }

  return (
    <button className="icon-button" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} mode`} title={`Switch to ${dark ? "light" : "dark"} mode`}>
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="nav-wrap">
      <nav className="nav-bar site-width" aria-label="Main navigation">
        <a className="brand" href="#home" onClick={() => setMenuOpen(false)}>Zyrus<span style={{ color: "var(--green)" }}>.</span></a>
        <div className="nav-links">
          {navItems.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <button className="menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>
      {menuOpen && <div className="mobile-menu">
        <div className="site-width" style={{ display: "grid" }}>
          {navItems.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <button className="text-link" style={{ padding: "12px 0", border: 0, background: "transparent", justifySelf: "start" }} onClick={() => document.querySelector<HTMLButtonElement>(".icon-button")?.click()}>
            <Moon size={15} /> Toggle appearance
          </button>
        </div>
      </div>}
    </header>
  );
}

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return <article className="project-card">
    <div className="project-visual" style={{ "--visual-bg": project.color } as CSSProperties} aria-label={`${project.title} image placeholder`}>
      <div className="visual-kicker"><span>Academic work</span><span>0{index + 1} / 04</span></div>
      <span className="visual-monogram" aria-hidden="true">{project.mark}</span>
      <div className="visual-foot"><span>Replace with project image</span><span>2022 — 26</span></div>
    </div>
    <div className="project-content">
      <p className="project-category">{project.type}</p>
      <h3>{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <div className="tag-list">{project.technologies.map((technology) => <span className="tag" key={technology}>{technology}</span>)}</div>
      {project.href ? <OfflineLink className="text-link" href={project.href} offlineHref="case-study.html">View Case Study <ArrowRight size={15} /></OfflineLink> : <span className="text-link" aria-label="Project link can be added">Project details <ArrowRight size={15} /></span>}
    </div>
  </article>;
}

function ContactForm() {
  const [status, setStatus] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("Your message is ready, but this form is not connected to an email service yet.");
  }

  return <form className="contact-form" onSubmit={submit}>
    <div className="form-field"><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" required minLength={2} placeholder="Your name" /></div>
    <div className="form-field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></div>
    <div className="form-field"><label htmlFor="message">Message</label><textarea id="message" name="message" required minLength={10} placeholder="What would you like to talk about?" /></div>
    <button className="button-primary" type="submit">Send Message <ArrowUpRight size={16} /></button>
    <p className="form-status" role="status">{status || "Frontend form only. Connect an email service to receive submissions."}</p>
  </form>;
}

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [portraitLoaded, setPortraitLoaded] = useState(false);
  const shownProjects = activeFilter === "All" ? projects : projects.filter((project) => project.category === activeFilter);

  return <div className="page-shell">
    <Navigation />
    <main>
      <section className="hero site-width" id="home">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Portfolio · Cabuyao, Philippines</span>
            <h1 className="serif">Hi, I’m<br /><span>Zyrus.</span></h1>
            <p className="hero-role">BSIT Student &amp; Aspiring Web Developer</p>
            <p className="hero-description">I’m an Information Technology student who enjoys building practical web applications, exploring new technologies, and turning ideas into working systems.</p>
            <div className="hero-buttons">
              <a className="button-primary" href="#work">View My Work <ArrowDownRight size={16} /></a>
              <a className="button-outline" href="#contact">Let’s Connect <ArrowUpRight size={16} /></a>
            </div>
          </div>
          <div className="portrait-frame">
            <Image className="portrait-photo" src="images/profile/zyrus-portrait.jpg" alt="Zyrus at a computer" fill sizes="(max-width: 900px) 84vw, 390px" loading="eager" onLoad={() => setPortraitLoaded(true)} onError={(event) => { event.currentTarget.style.display = "none"; }} />
            {!portraitLoaded && <>
              <span className="portrait-mark">Z</span>
              <div className="portrait-note"><span>Portrait image</span><span>Add your photo</span></div>
            </>}
          </div>
        </div>
        <div className="ticker" aria-label="Technologies"><div className="ticker-track" aria-hidden="true">
          {[0, 1].map((copy) => <div className="ticker-group" key={copy}>{technologies.map((technology) => <span className="ticker-item" key={`${copy}-${technology}`}>{technology}</span>)}</div>)}
        </div></div>
      </section>

      <section className="section site-width intro-section" id="about">
        <div className="intro-title"><span className="eyebrow">01 / A short introduction</span><h2 className="serif">A little<br />about me</h2></div>
        <div className="intro-copy">
          <p>I’m currently pursuing a Bachelor of Science in Information Technology. Throughout my studies, I’ve worked on web-based systems and software projects that have helped me improve my skills in programming, database management, UI design, and system development.</p>
          <p>I enjoy creating systems that are functional and simple to use. Most projects I work on connect to real-world problems, which has helped me see how technology can make everyday processes more organized and efficient.</p>
          <p>I’m still learning, and I like that part of the work: trying new tools, asking better questions, and improving through academic projects and hands-on development.</p>
        </div>
      </section>

      <section className="section work-section" id="work"><div className="site-width">
        <div className="section-heading"><div><span className="eyebrow">02 / Projects I’ve worked on</span><h2 className="serif">Selected Work</h2></div><p>Academic systems and experiments built while learning how to make useful things for real people.</p></div>
        <div className="filter-row" aria-label="Filter projects">{filters.map((filter) => <button className="filter-button" type="button" key={filter} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
        <div className="project-list" aria-live="polite">{shownProjects.map((project) => <ProjectCard key={`${project.title}-${project.category}`} project={project} index={projects.indexOf(project)} />)}</div>
        <p className="academic-note">These are academic and personal projects, not commercial client work. Placeholder entries are marked for replacement.</p>
      </div></section>

      <section className="section site-width education-section" id="education">
        <div className="education-title"><span className="eyebrow">03 / Learning path</span><h2 className="serif">Education</h2></div>
        <div className="timeline">
          <article className="timeline-item"><span className="timeline-date">2022 – 2026</span><div><h3>Bachelor of Science in Information Technology</h3><p>University of Cabuyao<br />Focused on web development, software engineering, database systems, and information technology.</p></div></article>
          <article className="timeline-item"><span className="timeline-date">2019 – 2021</span><div><h3>Senior High School</h3><p>Camp Vicente Lim Integrated School<br />Information and Communications Technology strand.</p></div></article>
          <article className="timeline-item"><span className="timeline-date">2026</span><div><h3>JavaScript Essentials 1</h3><p>Certification</p></div></article>
        </div>
      </section>

      <section className="skills-section"><div className="site-width">
        <div className="skills-head"><div><span className="eyebrow">04 / Things I use</span><h2 className="serif">Tools &amp; skills</h2></div><p style={{ maxWidth: 320, color: "var(--muted)", lineHeight: 1.7 }}>A growing toolkit from coursework, experiments, and projects.</p></div>
        <div className="skills-grid">{skills.map((group) => <div className="skill-group" key={group.category}><h3>{group.category}</h3><p>{group.items.join(" · ")}</p></div>)}</div>
      </div></section>

      <section className="section site-width beyond-section">
        <div><span className="eyebrow">05 / Outside the checklist</span><div className="interest-list"><span>Learning new technologies</span><span>Building web systems</span><span>UI experiments</span><span>Problem solving</span></div></div>
        <div className="beyond-copy"><h2 className="serif">Beyond the Code</h2><p>I like the parts of building that happen before and after the code: figuring out what someone actually needs, sketching a clearer interface, and testing whether a system makes sense to use.</p><p>Most of my experience comes from academic projects, where the brief is a chance to explore and the finished system is a chance to learn what I would do better next time. I’m happy to keep asking questions and improving one project at a time.</p></div>
      </section>

      <section className="contact-section" id="contact"><div className="site-width contact-grid">
        <div className="contact-heading"><span className="eyebrow">06 / Say hello</span><h2 className="serif">Let’s work<br />together</h2><p>I’m always open to learning opportunities, collaborations, academic projects, and interesting web development ideas.</p><a className="email-link" href="mailto:cataloniazyrus328@gmail.com">cataloniazyrus328@gmail.com <ArrowUpRight size={15} /></a><div className="social-list">{socialLinks.map(({ name, href }) => <a key={name} href={href} target="_blank" rel="noreferrer">{name} <ArrowUpRight size={13} /></a>)}</div></div>
        <ContactForm />
      </div></section>
    </main>
    <footer className="site-footer"><div className="site-width"><div className="footer-top"><div className="footer-identity"><strong>Zyrus</strong><span>BSIT Student &amp; Aspiring Web Developer</span></div><nav className="footer-nav" aria-label="Footer navigation">{navItems.slice(1).map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav></div><div className="social-list footer-socials">{socialLinks.map(({ name, href }) => <a key={name} href={href} target="_blank" rel="noreferrer">{name} <ArrowUpRight size={13} /></a>)}</div><div className="footer-bottom"><span>© 2026 Zyrus. All rights reserved.</span><span>Made while learning.</span></div></div></footer>
  </div>;
}