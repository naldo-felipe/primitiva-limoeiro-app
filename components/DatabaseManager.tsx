
import React from 'react';
import { DownloadIcon, DatabaseIcon } from './Icons';

interface DatabaseManagerProps {
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
}

const DatabaseManager: React.FC<DatabaseManagerProps> = ({ onExport }) => {
  
  return (
    <div>
       <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary p-2 rounded-lg">
                <DatabaseIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Gerenciamento de Dados</h2>
       </div>
       
       <div className="bg-card p-6 rounded-lg shadow-md space-y-6">
          <p className="text-text-secondary">
            Os dados agora estão salvos de forma segura na nuvem (Google Cloud). As alterações são sincronizadas automaticamente em todos os dispositivos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
             {/* Export */}
             <div className="border border-gray-200 p-6 rounded-lg flex flex-col items-center text-center space-y-4 hover:border-blue-300 transition-colors bg-white">
                <div className="bg-blue-100 p-4 rounded-full">
                   <DownloadIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-text-primary">Backup de Segurança</h3>
                    <p className="text-sm text-text-secondary mt-1">Baixe uma cópia dos dados atuais para seu computador.</p>
                </div>
                <button onClick={onExport} className="mt-auto w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                   <DownloadIcon className="w-4 h-4" />
                   Baixar Dados JSON
                </button>
             </div>

             {/* Info Card */}
             <div className="border border-gray-200 p-6 rounded-lg flex flex-col items-center text-center space-y-4 bg-gray-50">
                <div className="bg-gray-200 p-4 rounded-full">
                   <DatabaseIcon className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-text-primary">Status da Nuvem</h3>
                    <p className="text-sm text-text-secondary mt-1">Conectado e Sincronizado.</p>
                </div>
                 <div className="mt-auto w-full text-xs text-text-secondary">
                   Para restaurar backups ou limpar o banco de dados, utilize o Console do Firebase.
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default DatabaseManager;
