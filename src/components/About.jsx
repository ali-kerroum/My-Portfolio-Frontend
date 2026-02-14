const skills = [
  {
    category: 'Data Analysis & Statistics',
    icon: '📊',
    accent: '#5ea0ff',
    items: [
      'Data Analysis',
      'Statistics & Probability',
      'Data Cleaning',
      'Predictive Modeling',
      'Data Visualization'
    ],
  },
  {
    category: 'Programming Languages',
    icon: '💻',
    accent: '#a78bfa',
    items: [
      'Python',
      'Java',
      'C',
      'PHP',
      'JavaScript'
    ],
  },
  {
    category: 'Databases & Data Management',
    icon: '🗄️',
    accent: '#34d399',
    items: [
      'SQL',
      'NoSQL',
      'MongoDB',
      'Redis',
      'HBase'
    ],
  },
  {
    category: 'Data Science & Big Data',
    icon: '🧠',
    accent: '#f472b6',
    items: [
      'Data Mining',
      'Machine Learning',
      'Deep Learning',
      'Big Data Fundamentals',
      'ETL',
      'Hadoop',
      'Spark',
      'Cloud (in progress)'
    ],
  },
  {
    category: 'Web Development',
    icon: '🌐',
    accent: '#38bdf8',
    items: [
      'React',
      'Laravel',
      'HTML5',
      'CSS3',
      'Tailwind CSS'
    ],
  },
  {
    category: 'Design & Creative Skills',
    icon: '🎨',
    accent: '#fb923c',
    items: [
      'Graphic Design',
      'Logo Design',
      'Brand Identity',
      'UI/UX Design',
      'Social Media Design',
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Canva'
    ],
  },
  {
    category: 'Tools & Environments',
    icon: '⚙️',
    accent: '#c4b5fd',
    items: [
      'Jupyter Notebook',
      'Pandas',
      'NumPy',
      'Matplotlib',
      'Seaborn',
      'Power BI',
      'Git',
      'GitHub'
    ],
  },
  {
    category: 'Soft Skills',
    icon: '🤝',
    accent: '#fbbf24',
    items: [
      'Analytical Thinking',
      'Problem Solving',
      'Curiosity & Continuous Learning',
      'Time Management',
      'Teamwork',
      'Communication',
      'Leadership'
    ],
  },
];

const education = [
  {
    year: '2025 – Present',
    degree: 'Bachelor Degree in Data Science and Big Data',
    institution: 'EST Fquih Ben Saleh',
    icon: '🎓',
    current: true,
  },
  {
    year: '2023 – 2025',
    degree: 'Higher Technician Diploma (BTS)',
    institution: 'Multimedia and Web Design',
    icon: '💻',
    current: false,
  },
  {
    year: '2021 – 2022',
    degree: 'High School Diploma',
    institution: 'Physical Sciences — ABOO AL ABASS ESSABTI',
    icon: '📚',
    current: false,
  },
];

const strengths = [
  'Structured problem solving and analytical thinking',
  'Production-focused implementation with maintainable code',
  'Clear communication and reliable project execution',
];

const profileFacts = [
  { label: 'Current focus', value: 'Data Science and Big Data internship opportunities' },
  { label: 'Primary stack', value: 'Python, React, Laravel, SQL' },
  { label: 'Working style', value: 'Quality-first delivery with measurable outcomes' },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">About</p>
          <h2>Professional profile and technical capabilities</h2>
          <p>I combine data analytics and software engineering to deliver dependable digital products.</p>
        </div>

        <div className="about-main">
          <div className="about-main-left">
            <article className="panel about-summary about-summary--main">
              <h3>Professional summary</h3>
              <p>
                I design and build practical digital solutions by combining machine learning, data analysis, and
                full-stack development.
              </p>
              <p>
                My approach is centered on clean architecture, performance, and reliable collaboration throughout the
                delivery lifecycle.
              </p>
              <div className="about-strengths">
                {strengths.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>

            <article className="panel about-summary about-summary--side">
              <h3>Profile highlights</h3>
              <div className="about-facts">
                {profileFacts.map((fact) => (
                  <div key={fact.label} className="about-fact-item">
                    <span>{fact.label}</span>
                    <p>{fact.value}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel education-panel">
              <h3>Education</h3>
              <div className="education-timeline">
                {education.map((item, index) => (
                  <div key={item.degree} className={`education-timeline-item${item.current ? ' education-timeline-item--current' : ''}`}>
                    <div className="education-timeline-marker">
                      <span className="education-timeline-dot">{item.icon}</span>
                      {index < education.length - 1 && <span className="education-timeline-line" />}
                    </div>
                    <div className="education-timeline-content">
                      <span className="education-timeline-year">{item.year}</span>
                      <h4>{item.degree}</h4>
                      <p>{item.institution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <article className="panel skills-panel about-main-right">
            <h3>Capability matrix</h3>
            <p className="skills-intro">
              Core engineering and analytics competencies supported by creative, tooling, and collaboration strengths.
            </p>

            <div className="skills-constellation">
              {skills.map((group, index) => (
                <div
                  key={group.category}
                  className="skill-card"
                  style={{ '--card-accent': group.accent, '--card-index': index }}
                >
                  <div className="skill-card__header">
                    <span className="skill-card__icon">{group.icon}</span>
                    <div className="skill-card__title-wrap">
                      <h5 className="skill-card__title">{group.category}</h5>
                      <span className="skill-card__count">{group.items.length} skills</span>
                    </div>
                  </div>
                  <div className="skill-card__bar">
                    <div className="skill-card__bar-fill" />
                  </div>
                  <div className="skill-card__tags">
                    {group.items.map((item) => (
                      <span key={item} className="skill-card__tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
