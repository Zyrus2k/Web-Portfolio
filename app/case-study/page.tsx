import { ArrowLeft, ArrowUpRight } from "lucide-react";
import OfflineLink from "@/components/offline-link";

const features = [
  "Pet owner registration", "Pet registration", "QR code generation", "QR-based record retrieval",
  "Vaccination history", "Consultation records", "Medication records", "Payment monitoring",
  "Request records", "Analytics and reports", "Announcements", "Activity and audit tracking",
  "Role-based access",
];

const technologies = ["React", "Laravel", "PHP", "MySQL", "JavaScript", "Tailwind CSS", "QR code technology"];

export default function CaseStudy() {
  return <main className="page-shell">
    <header className="nav-wrap"><nav className="nav-bar site-width" aria-label="Case study navigation"><OfflineLink className="brand" href="/" offlineHref="index.html#home">Zyrus<span style={{ color: "var(--green)" }}>.</span></OfflineLink><OfflineLink className="text-link" href="/#work" offlineHref="index.html#work"><ArrowLeft size={15} /> Back to work</OfflineLink></nav></header>
    <section className="case-hero site-width"><span className="eyebrow">Web Development / Capstone Project</span><h1 className="serif">Web-Based QR-Enabled Pet Registration, Vaccination, and Traceability Management System</h1><p>With Payment Monitoring and Data Analytics for the City Veterinary Animal Clinic in Cabuyao City, Laguna</p><p>A capstone project focused on making pet and veterinary records easier to manage, retrieve, and follow across common clinic workflows.</p></section>
    <div className="case-body site-width">
      <nav className="case-index" aria-label="Case study sections"><a href="#overview">Overview</a><a href="#problem">Problem</a><a href="#solution">Solution</a><a href="#features">Key features</a><a href="#roles">User roles</a><a href="#technology">Technology</a><a href="#screens">System screens</a></nav>
      <article className="case-content">
        <section id="overview"><span className="eyebrow">Project overview</span><h2>Records that are easier to follow.</h2><p>This web-based system was developed to support pet registration, vaccination, traceability, payment monitoring, and veterinary record management for the City Veterinary Animal Clinic in Cabuyao City, Laguna. QR-enabled pet records help make identification and record retrieval more organized.</p></section>
        <section id="problem"><span className="eyebrow">01 / The problem</span><h2>Keeping related records together</h2><p>Pet registration, owner details, vaccinations, consultations, medication, and payments create connected records that need to be easy for clinic staff to maintain and retrieve. When information is spread across separate records or processes, following a pet’s history and checking request status can take extra effort.</p></section>
        <section id="solution"><span className="eyebrow">02 / The approach</span><h2>A shared, QR-enabled workflow</h2><p>The system brings pet and owner registration together with vaccination and consultation histories, medication records, requests, and payment monitoring. QR codes provide a quicker path to a pet’s record, while role-based access and activity tracking support clearer day-to-day administration.</p></section>
        <section id="features"><span className="eyebrow">03 / What it includes</span><h2>Key features</h2><div className="feature-grid">{features.map((feature) => <div className="feature-item" key={feature}>{feature}</div>)}</div></section>
        <section id="roles"><span className="eyebrow">04 / Access</span><h2>User roles</h2><div className="roles-row"><span>Admin</span><span>Staff</span><span>Pet Owner</span></div></section>
        <section id="technology"><span className="eyebrow">05 / Built with</span><h2>Technology used</h2><div className="tag-list">{technologies.map((technology) => <span className="tag" key={technology}>{technology}</span>)}</div></section>
        <section id="screens"><span className="eyebrow">06 / Interface gallery</span><h2>System screens</h2><p>Actual project screenshots can be added to <code>public/images/projects/</code>. No screenshots were provided with the portfolio assets, so these slots are intentionally empty.</p><div className="gallery-grid">{["Dashboard", "Pet profile and QR record", "Vaccination history", "Payment monitoring"].map((caption) => <figure className="gallery-item" key={caption}><div className="gallery-placeholder">Add actual {caption.toLowerCase()} screenshot</div><figcaption>{caption}</figcaption></figure>)}</div></section>
        <OfflineLink className="text-link" href="/#work" offlineHref="index.html#work">Return to selected work <ArrowUpRight size={15} /></OfflineLink>
      </article>
    </div>
  </main>;
}