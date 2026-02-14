import CrudManager from './CrudManager';
import { getContactLinks, createContactLink, updateContactLink, deleteContactLink, reorderContactLinks } from '../../services/api';

const fields = [
  { name: 'label', label: 'Label', type: 'text', required: true, placeholder: 'e.g. GitHub' },
  { name: 'href', label: 'URL', type: 'text', required: true, placeholder: 'https://...' },
  { name: 'icon_svg', label: 'Icon SVG', type: 'textarea', placeholder: '<svg ...>...</svg>' },
];

const renderCard = (link) => (
  <div>
    <h3 style={{ margin: '0 0 0.25rem' }}>{link.label}</h3>
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      style={{ color: '#5ea0ff', fontSize: '0.875rem', wordBreak: 'break-all' }}
    >
      {link.href}
    </a>
  </div>
);

export default function ManageContactLinks() {
  return (
    <CrudManager
      entityName="Contact Link"
      fetchAll={getContactLinks}
      createItem={createContactLink}
      updateItem={updateContactLink}
      deleteItem={deleteContactLink}
      fields={fields}
      renderCard={renderCard}
      onReorder={reorderContactLinks}
    />
  );
}
