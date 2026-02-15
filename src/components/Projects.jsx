import { useMemo, useState, useEffect } from 'react';
import localProjects from '../data/projectsData';
import { getProjects } from '../services/api';

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(localProjects);
  const [layout, setLayout] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const PROJECTS_PER_PAGE = 5;

  // Try fetching from API, fallback to local data
  useEffect(() => {
    getProjects()
      .then((res) => {
        if (res.data && res.data.length > 0) setProjects(res.data);
      })
      .catch(() => {
        // keep local data
      });
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((project) => project.category).filter(Boolean)));
    return ['all', ...unique];
  }, [projects]);

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const categoryLabels = {
    all: 'All Projects',
    web: 'Web Development',
    data: 'Data Science',
    'data-analysis': 'Data Analysis',
    'deep-learning': 'Deep Learning',
    mobile: 'Mobile Development',
    ai: 'AI / Machine Learning',
    devops: 'DevOps / Cloud',
    cybersecurity: 'Cybersecurity',
    blockchain: 'Blockchain',
    iot: 'IoT',
    game: 'Game Development',
    desktop: 'Desktop Application',
    api: 'API / Backend',
    ui: 'UI / UX Design',
    automation: 'Automation / Scripting',
    design: 'Design',
    other: 'Other',
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      
      // Close modal on Escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setSelectedProject(null);
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedProject]);

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Projects</p>
          <h2>Case studies and delivery outcomes</h2>
          <p className="section-subtitle">
            Selected work in web development and applied data science.
          </p>
        </div>

        <div className="projects-toolbar">
          <div className="projects-filter">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`projects-filter__btn ${activeCategory === category ? 'projects-filter__btn--active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                <span className="projects-filter__label">{categoryLabels[category] || category.toUpperCase()}</span>
                <span className="projects-filter__count">
                  {category === 'all' 
                    ? projects.length 
                    : projects.filter(p => p.category === category).length}
                </span>
              </button>
            ))}
          </div>

          <div className="projects-layout-toggle">
            <button
              type="button"
              className={`projects-layout-btn ${layout === 'list' ? 'projects-layout-btn--active' : ''}`}
              onClick={() => setLayout('list')}
              title="List view"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </button>
            <button
              type="button"
              className={`projects-layout-btn ${layout === 'grid' ? 'projects-layout-btn--active' : ''}`}
              onClick={() => setLayout('grid')}
              title="Grid view"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className={`projects-showcase ${layout === 'grid' ? 'projects-showcase--grid' : ''}`}>
          {paginatedProjects.map((project, index) => (
            <article key={project.id} className="project-item">
              <div className="project-item__visual">
                <div className="project-item__image-wrapper">
                  <img src={project.image} alt={project.title} className="project-item__image" />
                  <div className="project-item__overlay">
                    <div className="project-item__badge">{project.category.toUpperCase()}</div>
                    {project.stats && Object.keys(project.stats).length > 0 && (
                      <div className="project-item__stats">
                        {Object.entries(project.stats).map(([key, value]) => (
                          <div key={key} className="project-stat">
                            <div className="project-stat__value">{value}</div>
                            <div className="project-stat__label">{key}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="project-item__body">
                <div className="project-item__header">
                  <h3 className="project-item__title">{project.title}</h3>
                  <div className="project-item__index">
                    {String((currentPage - 1) * PROJECTS_PER_PAGE + index + 1).padStart(2, '0')}
                  </div>
                </div>

                <p className="project-item__description">{project.description}</p>

                <div className="project-item__tech">
                  {project.technologies.map((technology) => (
                    <span key={technology} className="project-tech-tag">
                      {technology}
                    </span>
                  ))}
                </div>

                <div className="project-item__actions">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" className="project-action-btn project-action-btn--primary">
                      <svg className="project-action-btn__icon" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                      Source Code
                    </a>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer" className="project-action-btn">
                      <svg className="project-action-btn__icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {(project.images?.length || project.videos?.length) && (
                    <button type="button" className="project-action-btn" onClick={() => setSelectedProject(project)}>
                      <svg className="project-action-btn__icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="projects-pagination">
            <button
              type="button"
              className="projects-pagination__btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`projects-pagination__btn projects-pagination__num ${currentPage === page ? 'projects-pagination__num--active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              className="projects-pagination__btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {selectedProject && (
        <div className="project-modal" onClick={() => setSelectedProject(null)}>
          <div className="project-modal__container" onClick={(event) => event.stopPropagation()}>
            

            <div className="project-modal__header">
              <button type="button" className="project-modal__close" onClick={() => setSelectedProject(null)}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
            </div>

            <p className="project-modal__description">{selectedProject.description}</p>

            {selectedProject.problem && (
              <div className="project-modal__section">
                <h4 className="project-modal__section-title">Problem</h4>
                <p className="project-modal__section-text">{selectedProject.problem}</p>
              </div>
            )}

            {selectedProject.solution?.length > 0 && (
              <div className="project-modal__section">
                <h4 className="project-modal__section-title">Solution</h4>
                <ul className="project-modal__list">
                  {selectedProject.solution.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedProject.benefits?.length > 0 && (
              <div className="project-modal__section">
                <h4 className="project-modal__section-title">Key Benefits</h4>
                <ul className="project-modal__list">
                  {selectedProject.benefits.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedProject.sections?.length > 0 && selectedProject.sections.map((section, idx) => (
              <div key={idx} className="project-modal__section">
                <h4 className="project-modal__section-title">{section.name}</h4>
                {section.type === 'list' && Array.isArray(section.content) ? (
                  <ul className="project-modal__list">
                    {section.content.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="project-modal__section-text">{section.content}</p>
                )}
              </div>
            ))}

            {selectedProject.videos?.length > 0 && (
              <div className="project-modal__media">
                <h4 className="project-modal__media-title">Video Demonstrations</h4>
                <div className="project-modal__media-grid">
                  {selectedProject.videos.map((video) => (
                    <video key={video} controls className="project-modal__video">
                      <source src={video} type="video/mp4" />
                    </video>
                  ))}
                </div>
              </div>
            )}

            {selectedProject.images?.length > 0 && (
              <div className="project-modal__media">
                <h4 className="project-modal__media-title">Screenshots</h4>
                <div className="project-modal__media-grid">
                  {selectedProject.images.map((image, index) => (
                    <img 
                      key={`${image}-${index}`} 
                      src={image} 
                      alt={`${selectedProject.title} preview ${index + 1}`} 
                      className="project-modal__image" 
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="project-modal__footer">
              <div className="project-modal__tech">
                {selectedProject.technologies.map((technology) => (
                  <span key={technology} className="project-tech-tag project-tech-tag--large">
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
