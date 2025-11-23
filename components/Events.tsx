import React, { useState } from 'react';
import { Event, Role } from '../types';
import Modal from './Modal';
import EventForm from './EventForm';
import { PencilIcon, TrashIcon, UserPlusIcon } from './Icons';

interface EventsProps {
  events: Event[];
  onAdd: (event: Omit<Event, 'id'>) => void;
  onUpdate: (event: Event) => void;
  onDelete: (id: string) => void;
  role: Role;
}

const Events: React.FC<EventsProps> = ({ events, onAdd, onUpdate, onDelete, role }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const openAddModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      onDelete(id);
    }
  };
  
  const sortedEvents = [...events].sort((a,b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Eventos</h2>
        {role === 'admin' && (
          <button onClick={openAddModal} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover flex items-center gap-2 transition-colors">
              <UserPlusIcon className="w-5 h-5" />
              <span>Adicionar Evento</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedEvents.length > 0 ? sortedEvents.map((event) => (
          <div key={event.id} className="bg-card rounded-lg shadow-md overflow-hidden flex flex-col">
            {event.imageDataUrl ? 
              <img src={event.imageDataUrl} alt={event.name} className="w-full h-40 object-cover" /> :
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">Sem Imagem</div>
            }
            <div className="p-4 flex-grow flex flex-col">
              <p className="text-sm font-semibold text-primary">
                 {new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} - {event.time}
              </p>
              <h3 className="text-lg font-bold text-text-primary mt-1">{event.name}</h3>
              <p className="text-sm text-text-secondary mt-2 flex-grow">{event.description}</p>
            </div>
            {role === 'admin' && (
              <div className="p-4 bg-gray-50 flex justify-end space-x-2">
                <button aria-label={`Editar evento ${event.name}`} onClick={() => openEditModal(event)} className="text-primary hover:text-primary-hover"><PencilIcon className="w-5 h-5" /></button>
                <button aria-label={`Excluir evento ${event.name}`} onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
              </div>
            )}
          </div>
        )) : (
            <p className="col-span-full text-center text-text-secondary py-10">Nenhum evento cadastrado.</p>
        )}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <EventForm
            event={editingEvent}
            onSave={(data) => {
              if (editingEvent) {
                onUpdate({ ...editingEvent, ...data });
              } else {
                onAdd(data);
              }
              setIsModalOpen(false);
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Events;