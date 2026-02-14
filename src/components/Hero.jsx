const metrics = [
  { value: 'Applied', label: 'Data & Web Projects' },
  { value: '3+', label: 'Years in Tech & Development' },
  { value: '2', label: 'Core tracks: Data and Web' },
];

const links = [
  { label: 'GitHub', href: 'https://github.com/ali-kerroum' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ali-kerroum-b203332ab' },
];

const highlights = [
  'Machine Learning & Data Analytics',
  'Database Design & SQL Optimization',
  'Full-Stack Development with React and Laravel',
];

const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (!section) {
    return;
  }

  const top = section.getBoundingClientRect().top + window.scrollY - 84;
  window.scrollTo({ top, behavior: 'smooth' });
};

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero__background" aria-hidden="true">
        <span className="hero__glow hero__glow--one" />
        <span className="hero__glow hero__glow--two" />
        <span className="hero__grid" />
      </div>

      <div className="container hero-grid">
        <div className="hero-content">
          <p className="eyebrow hero__eyebrow">Data Science Student · Full-Stack Developer</p>
          <h1>
            Professional digital solutions
            <span>From analysis to deployable applications.</span>
          </h1>
          <p className="hero-description">
            I am a Bachelor student in Data Science & Analytics with strong full-stack engineering experience. I design
            and build maintainable products that turn data into measurable outcomes.
          </p>

          <div className="hero-highlights">
            {highlights.map((item) => (
              <span key={item} className="hero-highlight-item">
                {item}
              </span>
            ))}
          </div>

          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => scrollToSection('projects')}>
              Review Projects
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => scrollToSection('contact')}>
               Contact
            </button>
          </div>

          <div className="hero-links">
            
            {links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="link-pill hero-link-pill">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <aside className="hero-card panel">
          <div className="hero-card-top">
            <img src="/images/profile_pic.jpg" alt="Ali Kerroum" className="hero-image" />
            <span className="hero-status">Open to internship opportunities</span>
          </div>

          <div className="hero-card-body">
            <h2>Ali Kerroum</h2>
            <p>Focused on reliable engineering, data-driven thinking, and practical business value.</p>
            <p className="hero-card-role">Seeking Data Science / Big Data internship positions</p>

            <div className="metrics">
              {metrics.map((metric) => (
                <article key={metric.label} className="metric">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
