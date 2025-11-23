
import React, { useState } from 'react';
import { PrayerRequest } from '../types';
import Modal from './Modal';
import PrayerRequestForm from './PrayerRequestForm';
import { HandsPrayingIcon, PencilIcon, TrashIcon } from './Icons';

interface PrayerRequestsProps {
  requests: PrayerRequest[];
  onAdd: (request: Omit<PrayerRequest, 'id'|'date'>) => void;
  onUpdate: (request: PrayerRequest) => void;
  onDelete: (id: string) => void;
}

const PrayerRequests: React.FC<PrayerRequestsProps> = ({ requests, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<PrayerRequest | null>(null);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  
  const sortedRequests = [...requests].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const openAddModal = () => {
    setEditingRequest(null);
    setIsModalOpen(true);
  };
  
  const openEditModal = (request: PrayerRequest) => {
    setEditingRequest(request);
    setIsModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (requestToDelete) {
      onDelete(requestToDelete);
      setRequestToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Mural de Oração</h2>
        <button onClick={openAddModal} className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 flex items-center gap-2 transition-colors">
          <HandsPrayingIcon className="w-5 h-5" />
          <span>Fazer um Pedido</span>
        </button>
      </div>

      <div className="space-y-4">
          {sortedRequests.length > 0 ? sortedRequests.map((req) => (
             <div key={req.id} className="bg-card p-4 rounded-lg shadow-md">
                 <p className="text-text-primary whitespace-pre-wrap">{req.request}</p>
                 <div className="text-xs text-text-secondary mt-3 pt-3 border-t flex justify-between items-center">
                    <div>
                        <span className="font-semibold">{req.isAnonymous ? 'Anônimo' : req.name || 'Pedido Público'}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(req.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button aria-label="Editar pedido de oração" onClick={() => openEditModal(req)} className="p-2 rounded-lg text-primary hover:bg-blue-100 hover:text-primary-hover"><PencilIcon className="w-4 h-4" /></button>
                        <button aria-label="Excluir pedido de oração" onClick={() => setRequestToDelete(req.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-800"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                 </div>
             </div>
          )) : (
             <div className="text-center text-text-secondary bg-card p-10 rounded-lg">
                <p>Nenhum pedido de oração no momento.</p>
                <p className="text-sm mt-2">Seja o primeiro a compartilhar um pedido.</p>
             </div>
          )}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
            <PrayerRequestForm
                requestToEdit={editingRequest}
                onSave={(data) => {
                    if (editingRequest) {
                        onUpdate({ ...editingRequest, ...data });
                    } else {
                        onAdd(data);
                    }
                    setIsModalOpen(false);
                }}
                onCancel={() => setIsModalOpen(false)}
            />
        </Modal>
      )}

      {requestToDelete && (
        <Modal onClose={() => setRequestToDelete(null)}>
          <div className="p-6 text-center space-y-4">
            <h2 className="text-xl font-bold text-text-primary">Excluir Pedido</h2>
            <p className="text-text-secondary">
              Tem certeza que deseja excluir este pedido de oração? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-center space-x-3 pt-2">
              <button 
                onClick={() => setRequestToDelete(null)} 
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete} 
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PrayerRequests;
