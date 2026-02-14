import CrudManager from './CrudManager';
import { getSkills, createSkill, updateSkill, deleteSkill, reorderSkills } from '../../services/api';

const fields = [
  { name: 'category', label: 'Category Name', type: 'text', required: true, placeholder: 'e.g. Web Development' },
  { name: 'icon', label: 'Icon', type: 'icon_picker', defaultValue: '💻' },
  { name: 'accent', label: 'Accent Color', type: 'color', defaultValue: '#5ea0ff' },
  { name: 'items', label: 'Skills', type: 'tags' },
];

const renderCard = (skill) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <span style={{ fontSize: '1.5rem' }}>{skill.icon && skill.icon.startsWith('<svg') ? <span dangerouslySetInnerHTML={{ __html: skill.icon }} style={{ display: 'inline-flex', width: '1.5rem', height: '1.5rem' }} /> : skill.icon}</span>
      <h3 style={{ margin: 0 }}>{skill.category}</h3>
    </div>
    <div className="admin-tags">
      {(skill.items || []).map((item) => (
        <span key={item} className="admin-tag" style={{ borderColor: skill.accent }}>
          {item}
        </span>
      ))}
    </div>
  </div>
);

export default function ManageSkills() {
  return (
    <CrudManager
      entityName="Skill"
      fetchAll={getSkills}
      createItem={createSkill}
      updateItem={updateSkill}
      deleteItem={deleteSkill}
      fields={fields}
      renderCard={renderCard}
      onReorder={reorderSkills}
    />
  );
}
