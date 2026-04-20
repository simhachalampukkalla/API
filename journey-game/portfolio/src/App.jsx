import './App.css'

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Experience', href: '#experience' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
]

const EXPERIENCE = [
  {
    role: 'Application Developer',
    company: 'Conferro Software Solutions Pvt. Ltd.',
    period: 'Aug 2017 – Present',
    description:
      'Built modern web applications using React, Angular, HTML5, CSS3, JavaScript, and REST APIs.',
  },
  {
    role: 'Salesforce Developer',
    company: 'Salesforce Implementation Team',
    period: 'Feb 2018 – Oct 2020',
    description:
      'Designed dashboards, data integrations, and analytics solutions for enterprise teams.',
  },
]

const PROJECTS = [
  {
    title: 'Portfolio Website',
    description: 'A polished portfolio presentation showcasing design and development work.',
  },
  {
    title: 'Automation Dashboard',
    description: 'A modern dashboard experience that highlights data insights and workflows.',
  },
]

function App() {
  return (
    <div className="portfolio-shell" id="home">
      <header className="top-bar">
        <div className="brand">R</div>
        <nav className="nav-links">
          {NAV_ITEMS.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="hero-label">UX/UI DESIGNER & WEB</p>
          <h1 className="hero-title">
            <span>I&apos;M</span>
            <span>SIMHACHALAM</span>
            <span>
              PUKKALLA<span className="hero-dot">.</span>
            </span>
          </h1>
          <p className="hero-text">
            Full Stack Developer with a strong focus on elegant web design, user experience, and scalable
            frontend engineering.
          </p>
        </div>

        <div className="hero-image-panel">
          <div className="hero-image" aria-hidden="true" />
          <div className="hero-overlay" />
        </div>
      </section>

      <section className="summary-grid">
        <article className="summary-card">
          <h2>Experience</h2>
          <p>8+ years building enterprise web applications, dashboards, and user-facing portals.</p>
        </article>
        <article className="summary-card">
          <h2>Skills</h2>
          <p>React, Angular, JavaScript, TypeScript, HTML, CSS, AWS, Salesforce, UX, CI/CD.</p>
        </article>
        <article className="summary-card contact-card" id="contact">
          <h2>Contact</h2>
          <p>Email: simhachalam@example.com</p>
          <p>Phone: +91 12345 67890</p>
        </article>
      </section>

      <section className="section-block" id="portfolio">
        <h2>Portfolio</h2>
        <div className="project-grid">
          {PROJECTS.map((project) => (
            <article key={project.title} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block" id="experience">
        <h2>Work Experience</h2>
        <div className="experience-grid">
          {EXPERIENCE.map((item) => (
            <article key={item.role} className="experience-card">
              <div className="experience-top">
                <div>
                  <h3>{item.role}</h3>
                  <p>{item.company}</p>
                </div>
                <span>{item.period}</span>
              </div>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App
