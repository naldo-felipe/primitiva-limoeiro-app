import React, { useState } from 'react';
import { Visitor } from '../types';
import { generateWelcomeMessage } from '../services/geminiService';
import { SparklesIcon, ClipboardIcon, CheckIcon } from './Icons';

interface VisitorFormProps {
  visitor: Visitor | null;
  onSave: (data: Omit<Visitor, 'id'>) => void;
  onCancel: () => void;
}

const VisitorForm: React.FC<VisitorFormProps> = ({ visitor, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: visitor?.name || '',
    firstVisitDate: visitor?.firstVisitDate || new Date().toISOString().split('T')[0],
    phone: visitor?.phone || '',
    notes: visitor?.notes || '',
  });
  const [step, setStep] = useState(1); // 1 for form, 2 for welcome message
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!formData.name) {
        alert("O nome é obrigatório.");
        return;
    }
    
    onSave(formData);
    
    if (visitor) { // If editing, just close the modal.
      onCancel();
      return;
    }

    // If new visitor, generate welcome message and show it.
    setIsGenerating(true);
    setStep(2); // Move to step 2 immediately to show loading state
    const message = await generateWelcomeMessage(formData.name);
    setWelcomeMessage(message);
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(welcomeMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  if (step === 2) {
    return (
      <div className="p-6 text-center space-y-4">
        <SparklesIcon className="w-12 h-12 mx-auto text-yellow-500" />
        <h2 className="text-xl font-bold text-text-primary">Visitante Adicionado!</h2>
        <p className="text-text-secondary">
          Aqui está uma mensagem de boas-vindas para <span className="font-semibold text-text-primary">{formData.name}</span>. Você pode copiar e enviar.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg text-left text-sm text-text-secondary relative min-h-[100px] flex items-center justify-center">
          {isGenerating ? (
            <p className="text-text-secondary italic">Gerando mensagem personalizada...</p>
          ) : (
             <>
              <blockquote className="italic">"{welcomeMessage}"</blockquote>
              <button aria-label="Copiar mensagem" onClick={copyToClipboard} className="absolute top-2 right-2 p-1.5 bg-white rounded-full hover:bg-gray-200" title="Copiar">
                 {copied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <ClipboardIcon className="w-4 h-4 text-text-secondary"/>}
              </button>
            </>
          )}
        </div>
        <button onClick={onCancel} className="w-full bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600">Fechar</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-text-primary">{visitor ? 'Editar Visitante' : 'Adicionar Visitante'}</h2>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Nome</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm bg-white text-text-primary"
        />
      </div>
      <div>
        <label htmlFor="firstVisitDate" className="block text-sm font-medium text-text-secondary">Data da Primeira Visita</label>
        <input
          type="date"
          name="firstVisitDate"
          id="firstVisitDate"
          value={formData.firstVisitDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm bg-white text-text-primary"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-text-secondary">Telefone</label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm bg-white text-text-primary"
        />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-text-secondary">Notas</label>
        <textarea
          name="notes"
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm bg-white text-text-primary"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancelar</button>
        <button type="submit" className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600">
            {visitor ? 'Salvar' : 'Adicionar e Gerar Mensagem'}
        </button>
      </div>
    </form>
  );
};

export default VisitorForm;