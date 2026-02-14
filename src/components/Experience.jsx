const experiences = [
  {
    role: 'Intern - Web Development & Graphic Design',
    period: '05/2024 - 06/2024',
    organization: 'Onclick Company',
    icon: '🎨',
    accent: '#fb923c',
    points: [
      'Designed and maintained websites using WordPress.',
      'Designed logos, Instagram posts, posters, and catalogs.',
      'Worked with the team to complete client projects on time.',
    ],
  },
  {
    role: 'Intern - Web Development',
    period: '05/2025 - 06/2025',
    organization: 'Onclick Company',
    icon: '💻',
    accent: '#5ea0ff',
    points: [
      'Implemented web development features using HTML, CSS, JavaScript, PHP, and Laravel.',
      'Assisted in designing and enhancing web applications.',
      'Tested and validated features with the team.',
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section section-muted">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Experience</p>
          <h2>Practical experience and delivery background</h2>
          <p>Hands-on work across full-stack engineering, data science, and product implementation.</p>
        </div>

        <div className="exp-timeline">
          {experiences.map((experience, index) => (
            <article
              key={`${experience.role}-${experience.period}`}
              className="exp-timeline__item"
              style={{ '--exp-accent': experience.accent, '--exp-index': index }}
            >
              <div className="exp-timeline__rail">
                <span className="exp-timeline__dot">{experience.icon}</span>
                {index < experiences.length - 1 && <span className="exp-timeline__connector" />}
              </div>

              <div className="exp-timeline__card panel">
                <div className="exp-timeline__header">
                  <div className="exp-timeline__title-group">
                    <h3 className="exp-timeline__role">{experience.role}</h3>
                    <p className="exp-timeline__org">{experience.organization}</p>
                  </div>
                  <span className="exp-timeline__period">{experience.period}</span>
                </div>

                <ul className="exp-timeline__points">
                  {experience.points.map((point) => (
                    <li key={point} className="exp-timeline__point">
                      <span className="exp-timeline__bullet" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
