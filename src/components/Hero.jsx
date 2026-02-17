import { useState, useEffect } from 'react';
import { getHeroContent } from '../services/api';

const linkIcons = {
  github: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  twitter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  dribbble: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308a10.174 10.174 0 004.392-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4a10.143 10.143 0 006.29 2.166c1.42 0 2.77-.29 4.006-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702A10.094 10.094 0 0012 1.83c-.83 0-1.634.1-2.4.222zM20.063 5.7c-.21.285-1.908 2.478-5.69 3.97.24.49.47.985.68 1.486.075.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.35-6.316z"/>
    </svg>
  ),
  youtube: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  email: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M22 7l-10 6L2 7"/>
    </svg>
  ),
  website: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  ),
};

const getLinkIcon = (link) => {
  if (link.icon && linkIcons[link.icon]) return linkIcons[link.icon];
  const key = link.label.toLowerCase().trim();
  for (const [name, icon] of Object.entries(linkIcons)) {
    if (key.includes(name)) return icon;
  }
  return linkIcons.website;
};

const defaultData = {
  eyebrow: 'Data Science Student · Full-Stack Developer',
  title: 'Professional digital solutions',
  subtitle: 'From analysis to deployable applications.',
  description:
    'I am a Bachelor student in Data Science & Analytics with strong full-stack engineering experience. I design and build maintainable products that turn data into measurable outcomes.',
  highlights: [
    'Machine Learning & Data Analytics',
    'Database Design & SQL Optimization',
    'Full-Stack Development with React and Laravel',
  ],
  cta_primary_label: 'Review Projects',
  cta_primary_section: 'projects',
  cta_secondary_label: 'Contact',
  cta_secondary_section: 'contact',
  links: [
    { label: 'GitHub', href: 'https://github.com/ali-kerroum', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ali-kerroum-b203332ab', icon: 'linkedin' },
  ],
  profile_image: '/images/profile_pic.jpg',
  image_position_x: 50,
  image_position_y: 54,
  image_zoom: 100,
  name: 'Ali Kerroum',
  bio: 'Focused on reliable engineering, data-driven thinking, and practical business value.',
  status_text: 'Open to internship opportunities',
  role_text: 'Seeking Data Science / Big Data internship positions',
  metrics: [
    { value: 'Applied', label: 'Data & Web Projects' },
    { value: '3+', label: 'Years in Tech & Development' },
    { value: '2', label: 'Core tracks: Data and Web' },
  ],
};

const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (!section) return;
  const top = section.getBoundingClientRect().top + window.scrollY - 84;
  window.scrollTo({ top, behavior: 'smooth' });
};

export default function Hero() {
  const [hero, setHero] = useState(defaultData);

  useEffect(() => {
    getHeroContent()
      .then((res) => {
        if (res.data && typeof res.data === 'object' && Object.keys(res.data).length > 0) {
          setHero({ ...defaultData, ...res.data });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="hero" className="hero">
      <div className="hero__background" aria-hidden="true">
        <span className="hero__glow hero__glow--one" />
        <span className="hero__glow hero__glow--two" />
        <span className="hero__grid" />
      </div>

      <div className="container hero-grid">
        <div className="hero-content">
          <p className="eyebrow hero__eyebrow">{hero.eyebrow}</p>
          <h1>
            {hero.title}
            <span>{hero.subtitle}</span>
          </h1>
          <p className="hero-description">{hero.description}</p>

          <div className="hero-highlights">
            {(hero.highlights || []).map((item) => (
              <span key={item} className="hero-highlight-item">
                {item}
              </span>
            ))}
          </div>

          <div className="hero-actions">
            {hero.cta_primary_label && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => scrollToSection(hero.cta_primary_section || 'projects')}
              >
                {hero.cta_primary_label}
              </button>
            )}
            {hero.cta_secondary_label && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => scrollToSection(hero.cta_secondary_section || 'contact')}
              >
                {hero.cta_secondary_label}
              </button>
            )}
          </div>

          <div className="hero-links">
            {(hero.links || []).map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="link-pill hero-link-pill"
              >
                {getLinkIcon(link)}
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <aside className="hero-card panel">
          <div className="hero-card-top">
            <img
              src={hero.profile_image}
              alt={hero.name}
              className="hero-image"
              style={{
                objectPosition: `${hero.image_position_x ?? 50}% ${hero.image_position_y ?? 54}%`,
                transform: `scale(${(hero.image_zoom ?? 100) / 100})`,
              }}
            />
            <span className="hero-status">{hero.status_text}</span>
          </div>

          <div className="hero-card-body">
            <h2>{hero.name}</h2>
            <p>{hero.bio}</p>
            <p className="hero-card-role">{hero.role_text}</p>

            <div className="metrics">
              {(hero.metrics || []).map((metric) => (
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
