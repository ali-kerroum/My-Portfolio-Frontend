import CrudManager from './CrudManager';
import { getServices, createService, updateService, deleteService, reorderServices } from '../../services/api';

const fields = [
  { name: 'number', label: 'Number', type: 'text', required: true, placeholder: '01' },
  { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Service title' },
  { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Describe the service...' },
  { name: 'icon', label: 'Icon', type: 'icon_picker', defaultValue: '💻' },
  { name: 'items', label: 'Capabilities', type: 'array' },
];

const renderCard = (service) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
      <span style={{ fontSize: '1.5rem' }}>{service.icon && service.icon.startsWith('<svg') ? <span dangerouslySetInnerHTML={{ __html: service.icon }} style={{ display: 'inline-flex', width: '1.5rem', height: '1.5rem' }} /> : service.icon}</span>
      <h3 style={{ margin: 0 }}>
        <span style={{ color: '#94a3b8', marginRight: '0.5rem' }}>{service.number}</span>
        {service.title}
      </h3>
    </div>
    <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>{service.description?.substring(0, 100)}...</p>
  </div>
);

export default function ManageServices() {
  return (
    <CrudManager
      entityName="Service"
      fetchAll={getServices}
      createItem={createService}
      updateItem={updateService}
      deleteItem={deleteService}
      fields={fields}
      renderCard={renderCard}
      onReorder={reorderServices}
    />
  );
}
