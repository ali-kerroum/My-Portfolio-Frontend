import CrudManager from './CrudManager';
import { getProjects, createProject, updateProject, deleteProject, uploadFile, reorderProjects } from '../../services/api';

const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Project title' },
  { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Describe the project...' },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'web', label: 'Web Development' },
      { value: 'data', label: 'Data Science' },
    ],
    defaultValue: 'web',
  },
  { name: 'image', label: 'Cover Image', type: 'image_upload' },
  { name: 'github', label: 'GitHub URL', type: 'text', placeholder: 'https://github.com/...' },
  { name: 'link', label: 'Live Demo URL', type: 'text', placeholder: 'https://...' },
  { name: 'technologies', label: 'Technologies', type: 'tags' },
  { name: 'skills', label: 'Skills', type: 'tags' },
  { name: 'problem', label: 'Problem Statement', type: 'textarea', placeholder: 'What problem does this solve?' },
  { name: 'solution', label: 'Solution Points', type: 'array' },
  { name: 'benefits', label: 'Benefits', type: 'array' },
  { name: 'videos', label: 'Videos', type: 'file_uploads', accept: 'video/*' },
  { name: 'images', label: 'Images', type: 'file_uploads', accept: 'image/*' },
  { name: 'sections', label: 'Sections', type: 'sections' },
];

const renderCard = (project) => (
  <div className="admin-project-card">
    <div className="admin-project-card__badge">{project.category}</div>
    <h3>{project.title}</h3>
    <p>{project.description?.substring(0, 120)}...</p>
    <div className="admin-tags">
      {(project.technologies || []).map((t) => (
        <span key={t} className="admin-tag">{t}</span>
      ))}
    </div>
  </div>
);

export default function ManageProjects() {
  return (
    <CrudManager
      entityName="Project"
      fetchAll={getProjects}
      createItem={createProject}
      updateItem={updateProject}
      deleteItem={deleteProject}
      fields={fields}
      renderCard={renderCard}
      onUploadFile={uploadFile}
      onReorder={reorderProjects}
    />
  );
}
