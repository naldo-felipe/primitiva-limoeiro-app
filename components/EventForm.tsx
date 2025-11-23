import React, { useState, useRef } from 'react';
import { Event } from '../types';
import { CameraIcon, TrashIcon } from './Icons';

interface EventFormProps {
  event: Event | null;
  onSave: (data: Omit<Event, 'id'>) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: event?.name || '',
    date: event?.date || '',
    time: event?.time || '',
    description: event?.description || '',
    imageDataUrl: event?.imageDataUrl || '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageDataUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
        alert("Por favor, selecione um arquivo de imagem válido.");
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if(file) {
            handleImageFile(file);
        }
        return; // handle first image found
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };
  
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const removeImage = () => {
    setFormData(prev => ({...prev, imageDataUrl: ''}));
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.time) {
        alert("Nome, data e hora são obrigatórios.");
        return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-text-primary">{event ? 'Editar Evento' : 'Adicionar Evento'}</h2>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Nome do Evento</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-text-secondary">Data</label>
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-text-secondary">Hora</label>
          <input
            type="time"
            name="time"
            id="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>
       <div>
        <label className="block text-sm font-medium text-text-secondary">Imagem do Evento</label>
        {formData.imageDataUrl ? (
          <div className="mt-1 relative group">
            <img src={formData.imageDataUrl} alt="Pré-visualização do evento" className="w-full h-48 object-cover rounded-md border border-gray-200" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-white/70 hover:bg-white p-1.5 rounded-full text-red-600 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Remover Imagem"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div
            onPaste={handlePaste}
            onClick={triggerFileSelect}
            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); triggerFileSelect() } }}
            tabIndex={0}
            role="button"
            aria-label="Adicionar imagem do evento"
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            <div className="space-y-1 text-center">
              <CameraIcon className="mx-auto h-12 w-12 text-gray-400" /> 
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-primary">Clique para enviar</span> ou cole uma imagem
              </p>
              <p className="text-xs text-text-secondary">PNG, JPG, GIF</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleFileSelect}
              className="sr-only"
            />
          </div>
        )}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Descrição</label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancelar</button>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover">Salvar</button>
      </div>
    </form>
  );
};

export default EventForm;