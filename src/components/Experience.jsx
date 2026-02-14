const experiences = [
  {
    role: 'Intern - Web Development & Graphic Design',
    period: '05/2024 - 06/2024',
    organization: 'Onclick Company',
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

        <div className="experience-list">
          {experiences.map((experience) => (
            <article key={`${experience.role}-${experience.period}`} className="panel experience-card">
              <div className="experience-head">
                <div>
                  <h3>{experience.role}</h3>
                  <p>{experience.organization}</p>
                </div>
                <span className="experience-period">{experience.period}</span>
              </div>

              <ul>
                {experience.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
