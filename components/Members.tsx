
import React, { useState } from 'react';
import { Member } from '../types';
import Modal from './Modal';
import MemberForm from './MemberForm';
import { PencilIcon, TrashIcon, UserPlusIcon, ChatBubbleIcon } from './Icons';

interface MembersProps {
  members: Member[];
  onAdd: (member: Omit<Member, 'id'>) => void;
  onUpdate: (member: Member) => void;
  onDelete: (id: string) => void;
}

const Members: React.FC<MembersProps> = ({ members, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openAddModal = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este membro?')) {
      onDelete(id);
    }
  };

  const handleSendMessage = (phone: string) => {
    if (!phone) {
      alert('Este membro não possui um número de telefone cadastrado.');
      return;
    }
    // Remove non-numeric characters and assume it's a Brazilian number
    const sanitizedPhone = phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${sanitizedPhone}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-text-primary">Membros</h2>
        <div className="flex items-center gap-4">
           <input
            type="text"
            placeholder="Buscar membro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          <button onClick={openAddModal} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover flex items-center gap-2 transition-colors">
            <UserPlusIcon className="w-5 h-5" />
            <span>Adicionar Membro</span>
          </button>
        </div>
      </div>

      <div className="bg-card shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Nome</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Função</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Telefone</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Aniversário</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.length > 0 ? filteredMembers.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-text-primary">{member.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-secondary">{member.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{member.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {member.birthDate ? new Date(member.birthDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long'}) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button aria-label={`Editar ${member.name}`} onClick={() => openEditModal(member)} className="text-primary hover:text-primary-hover"><PencilIcon className="w-5 h-5" /></button>
                  <button aria-label={`Enviar WhatsApp para ${member.name}`} onClick={() => handleSendMessage(member.phone)} className="text-green-600 hover:text-green-800" title="Enviar WhatsApp"><ChatBubbleIcon className="w-5 h-5" /></button>
                  <button aria-label={`Excluir ${member.name}`} onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-text-secondary">Nenhum membro encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <MemberForm
            member={editingMember}
            onSave={(data) => {
              if (editingMember) {
                onUpdate({ ...editingMember, ...data });
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

export default Members;