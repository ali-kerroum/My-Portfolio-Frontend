import { useState, useEffect } from 'react';
import { getServices } from '../services/api';

const localServices = [
  {
    number: '01',
    title: 'Data Analysis & Visualization',
    description:
      'Transform raw data into meaningful insights using statistical analysis and clear visual storytelling.',
    items: [
      'Exploratory Data Analysis (EDA)',
      'Data Cleaning & Preparation',
      'Dashboard Creation (Power BI / Matplotlib)',
      'KPI Analysis & Interpretation',
    ],
    icon: '📊',
  },
  {
    number: '02',
    title: 'Machine Learning Projects',
    description:
      'Develop and evaluate predictive models for classification, regression, and data-driven decision support.',
    items: [
      'Feature Engineering',
      'Model Training & Validation',
      'Performance Optimization',
      'Scikit-learn & Python Workflows',
    ],
    icon: '🤖',
  },
  {
    number: '03',
    title: 'Full-Stack Web Development',
    description:
      'Build responsive and scalable web applications using modern frontend and backend technologies.',
    items: [
      'React Frontend Development',
      'Laravel REST APIs',
      'SQL & NoSQL Database Integration',
      'Clean & Maintainable Architecture',
    ],
    icon: '💻',
  },
];

export default function Services() {
  const [services, setServices] = useState(localServices);

  useEffect(() => {
    getServices()
      .then((res) => {
        if (res.data && res.data.length > 0) setServices(res.data);
      })
      .catch(() => {
        // keep local data
      });
  }, []);
  return (
    <section id="services" className="section services-section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Services</p>
          <h2>What I Can Contribute</h2>
          <p className="section-subtitle">
            Practical technical solutions combining data analysis, machine learning, and modern web development.
          </p>
        </div>

        <div className="services-showcase">
          {services.map((service) => (
            <article key={service.title} className="service-item">
              <div className="service-item__header">
                <div className="service-item__number">{service.number}</div>
                <div className="service-item__icon">{service.icon && service.icon.startsWith('<svg') ? <span dangerouslySetInnerHTML={{ __html: service.icon }} /> : service.icon}</div>
              </div>
              
              <div className="service-item__content">
                <h3 className="service-item__title">{service.title}</h3>
                <p className="service-item__description">{service.description}</p>
                
                <div className="service-item__capabilities">
                  {service.items.map((item) => (
                    <div key={item} className="service-capability">
                      <svg className="service-capability__check" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="service-item__footer">
                <div className="service-item__gradient"></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
