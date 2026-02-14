import { useState, useEffect } from 'react';
import { getExperiences } from '../services/api';

const localExperiences = [
  {
    role: 'Intern - Web Development & Graphic Design',
    period: '05/2024 - 06/2024',
    organization: 'Onclick Company',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.1-.7-.4-1-.3-.3-.4-.7-.4-1.1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5.5-4.5-9.9-10-10z"/></svg>',
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
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    accent: '#5ea0ff',
    points: [
      'Implemented web development features using HTML, CSS, JavaScript, PHP, and Laravel.',
      'Assisted in designing and enhancing web applications.',
      'Tested and validated features with the team.',
    ],
  },
];

export default function Experience() {
  const [experiences, setExperiences] = useState(localExperiences);

  useEffect(() => {
    getExperiences()
      .then((res) => {
        if (res.data && res.data.length > 0) setExperiences(res.data);
      })
      .catch(() => {
        // keep local data
      });
  }, []);
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
                <span className="exp-timeline__dot">
                  {experience.icon && experience.icon.startsWith('<svg')
                    ? <span dangerouslySetInnerHTML={{ __html: experience.icon }} />
                    : experience.icon
                  }
                </span>
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
