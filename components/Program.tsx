import React, { useState, useEffect } from 'react';
import { Role } from '../types';
import { PencilIcon } from './Icons';

interface ProgramProps {
    content: string;
    onSave: (newContent: string) => void;
    role: Role;
}

const Program: React.FC<ProgramProps> = ({ content, onSave, role }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleSave = () => {
    onSave(editedContent);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Programa da Igreja</h2>
        {role === 'admin' && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover flex items-center gap-2 transition-colors">
                <PencilIcon className="w-5 h-5" />
                <span>Editar</span>
            </button>
        )}
      </div>

      <div className="bg-card shadow-md rounded-lg p-6">
        {isEditing ? (
            <div className="space-y-4">
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={10}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
                <div className="flex justify-end space-x-3">
                    <button onClick={handleCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover">
                        Salvar
                    </button>
                </div>
            </div>
        ) : (
            <div className="text-text-secondary whitespace-pre-wrap">{content}</div>
        )}
      </div>
    </div>
  );
};

export default Program;
