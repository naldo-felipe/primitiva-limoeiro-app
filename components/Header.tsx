
import React from 'react';
import { Role } from '../types';
import { ChurchBuildingIcon } from './Icons';

interface HeaderProps {
    role: Role;
    onAdminLogin: () => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ role, onAdminLogin, onLogout }) => {
  return (
    <header className="bg-card shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-primary p-2 rounded-lg">
             <ChurchBuildingIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div>
            <h1 className="text-md sm:text-xl font-bold text-text-primary leading-tight">
              Igreja Primitiva da Fé
            </h1>
            <p className="text-sm text-text-secondary">Limoeiro</p>
          </div>
        </div>

        <div>
          {role === 'admin' ? (
            <button onClick={onLogout} className="bg-red-500 text-white px-3 py-2 text-sm rounded-lg font-semibold hover:bg-red-600 transition-colors">
              Sair
            </button>
          ) : (
            <button onClick={onAdminLogin} className="bg-primary text-white px-3 py-2 text-sm rounded-lg font-semibold hover:bg-primary-hover transition-colors">
              Login Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
