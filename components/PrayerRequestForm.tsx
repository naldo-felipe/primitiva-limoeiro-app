import React, { useState, useEffect } from 'react';
import { PrayerRequest } from '../types';

interface PrayerRequestFormProps {
  requestToEdit: PrayerRequest | null;
  onSave: (data: Omit<PrayerRequest, 'id' | 'date'>) => void;
  onCancel: () => void;
}

const PrayerRequestForm: React.FC<PrayerRequestFormProps> = ({ requestToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
      name: requestToEdit?.name || '',
      request: requestToEdit?.request || '',
      isAnonymous: requestToEdit?.isAnonymous || false,
  });

  useEffect(() => {
    // If anonymous is checked, clear the name
    if (formData.isAnonymous) {
        setFormData(prev => ({ ...prev, name: '' }));
    }
  }, [formData.isAnonymous]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData(prev => ({
        ...prev,
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.request.trim()) {
        alert("Por favor, escreva seu pedido de oração.");
        return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-text-primary">{requestToEdit ? 'Editar Pedido' : 'Fazer um Pedido de Oração'}</h2>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Seu Nome (Opcional)</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          disabled={formData.isAnonymous}
          placeholder={formData.isAnonymous ? 'Anônimo' : 'Seu nome ou da família'}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm disabled:bg-gray-100"
        />
      </div>
       <div className="flex items-center">
        <input
            id="isAnonymous"
            name="isAnonymous"
            type="checkbox"
            checked={formData.isAnonymous}
            onChange={handleChange}
            className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
        />
        <label htmlFor="isAnonymous" className="ml-2 block text-sm text-text-secondary">
            Manter anônimo
        </label>
      </div>
      <div>
        <label htmlFor="request" className="block text-sm font-medium text-text-secondary">Seu pedido</label>
        <textarea
          name="request"
          id="request"
          rows={5}
          value={formData.request}
          onChange={handleChange}
          required
          placeholder="Descreva seu pedido aqui..."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancelar</button>
        <button type="submit" className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600">{requestToEdit ? 'Salvar Alterações' : 'Enviar Pedido'}</button>
      </div>
    </form>
  );
};

export default PrayerRequestForm;
