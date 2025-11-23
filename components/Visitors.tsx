
import React, { useState } from 'react';
import { Visitor } from '../types';
import Modal from './Modal';
import VisitorForm from './VisitorForm';
import { PencilIcon, TrashIcon, UserPlusIcon, ChatBubbleIcon } from './Icons';

interface VisitorsProps {
  visitors: Visitor[];
  onAdd: (visitor: Omit<Visitor, 'id'>) => void;
  onUpdate: (visitor: Visitor) => void;
  onDelete: (id: string) => void;
  onConvertToMember: (id: string) => void;
}

const Visitors: React.FC<VisitorsProps> = ({ visitors, onAdd, onUpdate, onDelete, onConvertToMember }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);

  const openAddModal = () => {
    setEditingVisitor(null);
    setIsModalOpen(true);
  };

  const openEditModal = (visitor: Visitor) => {
    setEditingVisitor(visitor);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este visitante?')) {
      onDelete(id);
    }
  };

  const handleConvert = (id: string) => {
    if (window.confirm('Tem certeza que deseja converter este visitante em membro? Esta ação removerá o registro de visitante.')) {
        onConvertToMember(id);
    }
  };
  
  const handleSendMessage = (phone: string) => {
    if (!phone) {
      alert('Este visitante não possui um número de telefone cadastrado.');
      return;
    }
    // Remove non-numeric characters and assume it's a Brazilian number
    const sanitizedPhone = phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${sanitizedPhone}`;
    window.open(whatsappUrl, '_blank');
  };

  const sortedVisitors = [...visitors].sort((a,b) => new Date(b.firstVisitDate).getTime() - new Date(a.firstVisitDate).getTime());

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Visitantes</h2>
        <button onClick={openAddModal} className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 flex items-center gap-2 transition-colors">
          <UserPlusIcon className="w-5 h-5" />
          <span>Adicionar Visitante</span>
        </button>
      </div>

      <div className="bg-card shadow-md rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {sortedVisitors.length > 0 ? sortedVisitors.map((visitor) => (
            <li key={visitor.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex-1 mb-4 sm:mb-0">
                  <p className="text-lg font-bold text-text-primary">{visitor.name}</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Primeira visita em: {new Date(visitor.firstVisitDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </p>
                  {visitor.phone && <p className="text-sm text-text-secondary">Telefone: {visitor.phone}</p>}
                  {visitor.notes && <p className="mt-2 text-sm text-text-secondary bg-gray-50 p-2 rounded-md whitespace-pre-wrap">Notas: {visitor.notes}</p>}
                </div>
                <div className="flex-shrink-0 flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button onClick={() => handleConvert(visitor.id)} className="text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-full font-semibold transition-colors">
                    Converter em Membro
                  </button>
                  <button aria-label={`Editar ${visitor.name}`} onClick={() => openEditModal(visitor)} className="text-primary hover:text-primary-hover"><PencilIcon className="w-5 h-5" /></button>
                  <button aria-label={`Enviar WhatsApp para ${visitor.name}`} onClick={() => handleSendMessage(visitor.phone)} className="text-green-600 hover:text-green-800" title="Enviar WhatsApp"><ChatBubbleIcon className="w-5 h-5" /></button>
                  <button aria-label={`Excluir ${visitor.name}`} onClick={() => handleDelete(visitor.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
                </div>
              </div>
            </li>
          )) : (
            <li className="p-6 text-center text-text-secondary">Nenhum visitante cadastrado.</li>
          )}
        </ul>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <VisitorForm
            visitor={editingVisitor}
            onSave={(data) => {
              if (editingVisitor) {
                onUpdate({ ...editingVisitor, ...data });
              } else {
                onAdd(data);
              }
              // VisitorForm handles its own closing logic for new visitors, so only close here for edits.
              if (editingVisitor) {
                setIsModalOpen(false);
              }
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Visitors;