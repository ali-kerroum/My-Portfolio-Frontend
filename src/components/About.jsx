const skills = [
  {
    category: 'Data Analysis & Statistics',
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
  },
  {
    year: '2023 – 2025',
    degree: 'Higher Technician Diploma (BTS)',
    institution: 'Multimedia and Web Design',
  },
  {
    year: '2021 – 2022',
    degree: 'High School Diploma',
    institution: 'Physical Sciences — ABOO AL ABASS ESSABTI',
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

const coreSkills = skills.slice(0, 5);
const supportingSkills = skills.slice(5);

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

            <article className="panel education-panel education-panel--timeline">
              <h3>Education</h3>
              <div className="education-list education-list--timeline">
                {education.map((item) => (
                  <div key={item.degree} className="education-item education-item--timeline">
                    <span className="education-year">{item.year}</span>
                    <h4>{item.degree}</h4>
                    <p>{item.institution}</p>
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

            <div className="about-skills-layout">
              <section className="skill-cluster">
                <h4>Core domains</h4>
                <div className="skill-cluster-grid">
                  {coreSkills.map((group) => (
                    <div key={group.category} className="skill-group skill-group--card">
                      <h5>{group.category}</h5>
                      <div className="tags">
                        {group.items.map((item) => (
                          <span key={item} className="tag">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="skill-cluster">
                <h4>Supporting strengths</h4>
                <div className="skill-cluster-grid">
                  {supportingSkills.map((group) => (
                    <div key={group.category} className="skill-group skill-group--card">
                      <h5>{group.category}</h5>
                      <div className="tags">
                        {group.items.map((item) => (
                          <span key={item} className="tag">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
