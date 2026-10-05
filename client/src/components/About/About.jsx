import { useEffect, useRef } from "react";
import "./About.css";
import { profile } from "../../data/profile";

const interests = [
  { number: "01", title: "Agentic AI", description: "Exploring AI through agents and interactive experiences." },
  { number: "02", title: "Algorithms, at play", description: "Turning data structures and algorithms into games you can learn from." },
  { number: "03", title: "Learning in public", description: "Making space for computer science notes, ideas, and lessons from building." },
];

function About() {
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current.focus();
  }, []);

  function jumpToSection(id) {
    const heading = document.getElementById(id);
    heading?.focus();
    heading?.scrollIntoView({ behavior: "auto", block: "start" });
  }

  return (
    <main className="home-main about-main">
      <div className="about-path"><span>workspace / about</span><span>THE PERSON BEHIND THE CODE</span></div>
      <div className="about-layout">
      <nav className="about-index" aria-label="About sections">
        <p>ON THIS PAGE</p>
        <button onClick={() => jumpToSection("experience-heading")}>01 <span>Experience</span> ↓</button>
        <button onClick={() => jumpToSection("skills-heading")}>02 <span>Toolkit</span> ↓</button>
        <button onClick={() => jumpToSection("education-heading")}>03 <span>Education</span> ↓</button>
        <button onClick={() => jumpToSection("interests-heading")}>04 <span>Exploring</span> ↓</button>
        <button onClick={() => jumpToSection("contact-heading")}>05 <span>Contact me</span> ↓</button>
        <a href="#home">← Back to workspace</a>
      </nav>
      <div className="about-content">
      <p className="home-eyebrow">&gt; whoami</p>
      <h1 ref={headingRef} tabIndex={-1}>The builder behind<br /><span className="about-accent">codeNcraft.</span></h1>
      <p className="about-lead">From enterprise applications to AI workflows.</p>
      <div className="about-intro">
        <div>
          <p className="about-role">{profile.name} / {profile.title}</p>
          <p className="home-description">{profile.summary}</p>
        </div>
        <aside className="about-current" aria-label="Current project">
          <p className="home-eyebrow">Currently building</p>
          <strong>Shubham OS</strong>
          <p>A personal workspace, starting with a terminal and growing one feature at a time.</p>
          <span className="about-badge">In progress</span>
        </aside>
      </div>
      <div className="about-snapshot" aria-label="Career snapshot">
        <div><strong>Annaly + Jio</strong><span>Software engineering experience</span></div>
        <div><strong>Northeastern</strong><span>MS in Information Systems</span></div>
        <div><strong>AI · APIs · Cloud</strong><span>Where my work connects</span></div>
      </div>
      <section className="about-section" aria-labelledby="experience-heading">
        <p className="home-eyebrow">&gt; experience</p>
        <h2 id="experience-heading" tabIndex={-1}>Where I've built</h2>
        <p className="about-section-hint">Open a role to explore the work and its impact.</p>
        <div className="experience-list">
          {profile.experience.map((job, index) => (
            <details className="experience-item" open={index === 0} key={`${job.company}-${job.role}`}>
              <summary>
                <span className="experience-heading"><strong>{job.role}</strong><span>{job.company}</span></span>
                <span className="experience-meta">{job.dates}<span>{job.location}</span></span>
                <span className="experience-toggle" aria-hidden="true" />
              </summary>
              <div className="experience-body">
                <p>{job.summary}</p>
                <ul>{job.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
              </div>
            </details>
          ))}
        </div>
      </section>
      <section className="about-section" aria-labelledby="skills-heading">
        <p className="home-eyebrow">&gt; toolkit</p>
        <h2 id="skills-heading" tabIndex={-1}>What I work with</h2>
        <div className="skills-grid">
          {profile.skills.map((group) => (
            <div className="skill-group" key={group.category}>
              <h3>{group.category}</h3>
              <ul className="skill-tags">{group.items.map((skill) => <li key={skill}>{skill}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>
      <section className="about-section" aria-labelledby="education-heading">
        <p className="home-eyebrow">&gt; education</p>
        <h2 id="education-heading" tabIndex={-1}>The foundations</h2>
        <div className="education-grid">
          {profile.education.map((school) => (
            <article className="education-card" key={school.school}>
              <h3>{school.school}</h3>
              <p className="education-degree">{school.degree}</p>
              <p>{school.dates} · {school.location}</p>
              <span className="about-badge">GPA {school.gpa}</span>
            </article>
          ))}
        </div>
      </section>
      <section className="about-interests" aria-labelledby="interests-heading">
        <h2 id="interests-heading" tabIndex={-1}>What I'm exploring</h2>
        <div className="interest-grid">
          {interests.map((interest) => (
            <article className="interest-card" key={interest.number}>
              <span className="home-eyebrow" aria-hidden="true">/{interest.number}</span>
              <h3>{interest.title}</h3>
              <p>{interest.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="about-contact" aria-labelledby="contact-heading">
        <p className="home-eyebrow">&gt; connect</p>
        <h2 id="contact-heading" tabIndex={-1}>Let’s build something useful.</h2>
        <p>Have an opportunity, a project idea, or a question about my work? Let’s talk.</p>
        <div className="about-contact-links">
          <a href="mailto:lakhotia.shubham06@gmail.com">Email me <span aria-hidden="true">↗</span></a>
          <a href="https://linkedin.com/in/shubham619" target="_blank" rel="noopener noreferrer">LinkedIn <span className="contact-link-note">(opens in a new tab)</span> <span aria-hidden="true">↗</span></a>
        </div>
      </section>
      <a className="page-link" href="#home"><span aria-hidden="true">←</span> Back to workspace</a>
      </div>
      </div>
    </main>
  );
}

export default About;
