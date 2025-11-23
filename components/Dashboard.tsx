import React from 'react';
import { Member, Visitor, Event, Role } from '../types';
import { UserGroupIcon, CalendarDaysIcon, HandsPrayingIcon } from './Icons';

interface DashboardProps {
  members: Member[];
  visitors: Visitor[];
  events: Event[];
  prayerRequestsCount: number;
  setView: (view: string) => void;
  role: Role;
}

const Dashboard: React.FC<DashboardProps> = ({ members, visitors, events, prayerRequestsCount, setView, role }) => {
    const upcomingEvents = events
        .filter(e => new Date(e.date) >= new Date(new Date().toDateString()))
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-text-primary">Painel de Controle</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {role === 'admin' && (
          <>
            <div className="bg-card p-6 rounded-lg shadow-md flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                    <UserGroupIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm text-text-secondary">Membros Ativos</p>
                    <p className="text-2xl font-bold text-text-primary">{members.filter(m => m.status === 'Ativo').length}</p>
                </div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                    <UserGroupIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                    <p className="text-sm text-text-secondary">Total de Visitantes</p>
                    <p className="text-2xl font-bold text-text-primary">{visitors.length}</p>
                </div>
            </div>
          </>
        )}
        <div className="bg-card p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
                <CalendarDaysIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
                <p className="text-sm text-text-secondary">Próximos Eventos</p>
                <p className="text-2xl font-bold text-text-primary">{upcomingEvents.length}</p>
            </div>
        </div>
         <div className="bg-card p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
                <HandsPrayingIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
                <p className="text-sm text-text-secondary">Pedidos de Oração</p>
                <p className="text-2xl font-bold text-text-primary">{prayerRequestsCount}</p>
            </div>
        </div>
      </div>

      {/* Upcoming Events Banners */}
      <div>
        <h3 className="text-xl font-semibold text-text-primary mb-4">Próximos Eventos</h3>
        {upcomingEvents.length > 0 ? (
          <div className="flex overflow-x-auto space-x-6 pb-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="flex-shrink-0 w-80 bg-card rounded-lg shadow-md overflow-hidden relative">
                 {event.imageDataUrl ? 
                    <img src={event.imageDataUrl} alt={event.name} className="w-full h-40 object-cover"/> :
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                        <CalendarDaysIcon className="w-12 h-12 text-gray-400" />
                    </div>
                 }
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="p-4 absolute bottom-0 left-0 text-white">
                  <p className="text-sm font-semibold">{new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} - {event.time}</p>
                  <h4 className="font-bold text-lg">{event.name}</h4>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card p-6 text-center text-text-secondary rounded-lg shadow-md">
            Nenhum evento futuro cadastrado.
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;