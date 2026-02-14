import CrudManager from './CrudManager';
import { getExperiences, createExperience, updateExperience, deleteExperience, reorderExperiences } from '../../services/api';

const fields = [
  { name: 'role', label: 'Role / Title', type: 'text', required: true, placeholder: 'e.g. Intern - Web Development' },
  { name: 'period', label: 'Period', type: 'text', required: true, placeholder: 'e.g. 05/2024 - 06/2024' },
  { name: 'organization', label: 'Organization', type: 'text', required: true, placeholder: 'Company name' },
  { name: 'icon', label: 'Icon', type: 'icon_picker', defaultValue: '' },
  { name: 'accent', label: 'Accent Color', type: 'color', defaultValue: '#5ea0ff' },
  { name: 'points', label: 'Key Points', type: 'array' },
];

const renderCard = (exp) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
      <span style={{ width: '1.5rem', height: '1.5rem', color: '#639bff' }} dangerouslySetInnerHTML={{ __html: exp.icon || '' }} />
      <h3 style={{ margin: 0 }}>{exp.role}</h3>
    </div>
    <p style={{ margin: '0.25rem 0', color: '#94a3b8', fontSize: '0.875rem' }}>
      {exp.organization} • {exp.period}
    </p>
    <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem', fontSize: '0.875rem' }}>
      {(exp.points || []).slice(0, 2).map((p, i) => (
        <li key={i}>{p}</li>
      ))}
      {(exp.points || []).length > 2 && <li>+{exp.points.length - 2} more...</li>}
    </ul>
  </div>
);

export default function ManageExperiences() {
  return (
    <CrudManager
      entityName="Experience"
      fetchAll={getExperiences}
      createItem={createExperience}
      updateItem={updateExperience}
      deleteItem={deleteExperience}
      fields={fields}
      renderCard={renderCard}
      onReorder={reorderExperiences}
    />
  );
}
