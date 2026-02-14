import projects from '../data/projectsData';

const backToPortfolio = () => {
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
};

export default function Gallery({ projectId }) {
  const id = typeof projectId === 'number' ? projectId : Number(projectId);
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return (
      <section className="section gallery-section">
        <div className="container">
          <div className="gallery-empty">
            <div className="gallery-empty__icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="gallery-empty__title">Project not found</h2>
            <p className="gallery-empty__message">The project you're looking for doesn't exist or has been removed.</p>
            <button type="button" className="btn-gallery-back" onClick={backToPortfolio}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
              Back to Portfolio
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section gallery-section">
      <div className="container">
        <div className="gallery-nav">
          <button type="button" className="btn-gallery-back" onClick={backToPortfolio}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Projects
          </button>
        </div>

        <div className="gallery-header">
          <div className="gallery-header__badge">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
            </svg>
            Gallery
          </div>
          <h2 className="gallery-header__title">{project.title}</h2>
          <p className="gallery-header__description">{project.description}</p>
          
          {project.technologies && project.technologies.length > 0 && (
            <div className="gallery-header__tech">
              {project.technologies.map((tech) => (
                <span key={tech} className="gallery-tech-tag">{tech}</span>
              ))}
            </div>
          )}
        </div>

        {project.videos?.length > 0 && (
          <div className="gallery-section-block">
            <h3 className="gallery-section-block__title">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
              </svg>
              Video Demonstrations
              <span className="gallery-section-block__count">{project.videos.length}</span>
            </h3>
            <div className="gallery-grid gallery-grid--videos">
              {project.videos.map((video, index) => (
                <div key={video} className="gallery-item gallery-item--video">
                  <video controls className="gallery-video">
                    <source src={video} type="video/mp4" />
                  </video>
                  <div className="gallery-item__label">Video {index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.images?.length > 0 ? (
          <div className="gallery-section-block">
            <h3 className="gallery-section-block__title">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
              </svg>
              Screenshots & Images
              <span className="gallery-section-block__count">{project.images.length}</span>
            </h3>
            <div className="gallery-grid">
              {project.images.map((image, index) => (
                <div key={`${image}-${index}`} className="gallery-item">
                  <img 
                    src={image} 
                    alt={`${project.title} ${index + 1}`} 
                    className="gallery-image" 
                  />
                  <div className="gallery-item__label">Screenshot {index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !project.videos?.length && (
            <div className="gallery-empty-state">
              <div className="gallery-empty-state__icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                </svg>
              </div>
              <p className="gallery-empty-state__text">No images are available for this project.</p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
