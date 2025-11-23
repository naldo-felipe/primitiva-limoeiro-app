import React, { useState } from 'react';
import { Member, Visitor, Event, PrayerRequest, Role } from './types';

// Components
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Visitors from './components/Visitors';
import Events from './components/Events';
import Program from './components/Program';
import PrayerRequests from './components/PrayerRequests';
import Modal from './components/Modal';
import { FacebookIcon, InstagramIcon, YouTubeIcon } from './components/Icons';


// --- Initial Data ---
const getInitialDate = (dayOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().split('T')[0];
};

const initialMembersData: Member[] = [
  { id: 'm1', name: 'João da Silva', role: 'Pastor', status: 'Ativo', phone: '11987654321', birthDate: '1980-05-15' },
  { id: 'm2', name: 'Maria Oliveira', role: 'Diaconisa', status: 'Ativo', phone: '11912345678', birthDate: '1985-10-20' },
  { id: 'm3', name: 'Carlos Pereira', role: 'Membro', status: 'Inativo', phone: '11999998888', birthDate: '1992-03-30' },
];

const initialVisitorsData: Visitor[] = [
  { id: 'v1', name: 'Ana Costa', firstVisitDate: getInitialDate(-20), phone: '21988776655', notes: 'Veio com a família.' },
  { id: 'v2', name: 'Pedro Martins', firstVisitDate: getInitialDate(-5), phone: '31977665544', notes: 'Interessado no grupo de jovens.' },
];

const initialEventsData: Event[] = [
  { id: 'e1', name: 'Culto de Domingo', date: getInitialDate(7 - new Date().getDay()), time: '10:00', description: 'Nosso culto semanal de celebração e adoração.' },
  { id: 'e2', name: 'Estudo Bíblico', date: getInitialDate(2), time: '19:30', description: 'Estudo aprofundado do livro de Gênesis.' },
];

const initialPrayerRequestsData: PrayerRequest[] = [
  { id: 'p1', name: 'Família Souza', request: 'Oração pela saúde do nosso filho.', isAnonymous: false, date: getInitialDate(-2) },
  { id: 'p2', request: 'Peço oração por uma oportunidade de emprego.', isAnonymous: true, date: getInitialDate(-1) },
];

const initialProgramContent = `
**Domingo:**
- 10:00 - Culto de Adoração
- 18:00 - Culto da Família

**Quarta-feira:**
- 19:30 - Noite de Oração e Estudo

**Sexta-feira:**
- 20:00 - Reunião de Jovens
`.trim();


// --- Custom hook for localStorage ---
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// --- Main App Compon vient ---
const App: React.FC = () => {
  const [role, setRole] = useLocalStorage<Role>('app-role', 'public');
  const [view, setView] = useState('dashboard');
  
  const [members, setMembers] = useLocalStorage<Member[]>('app-members', initialMembersData);
  const [visitors, setVisitors] = useLocalStorage<Visitor[]>('app-visitors', initialVisitorsData);
  const [events, setEvents] = useLocalStorage<Event[]>('app-events', initialEventsData);
  const [prayerRequests, setPrayerRequests] = useLocalStorage<PrayerRequest[]>('app-prayer-requests', initialPrayerRequestsData);
  const [programContent, setProgramContent] = useLocalStorage<string>('app-program', initialProgramContent);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleAdminLogin = () => {
    setPasswordInput('');
    setPasswordError('');
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "admin123") {
      setRole('admin');
      setView('dashboard');
      setIsPasswordModalOpen(false);
    } else {
      setPasswordError("Senha incorreta!");
    }
  };

  const handleLogout = () => {
    setRole('public');
    setView('dashboard');
  };

  // --- CRUD Handlers ---
  const handleAddMember = (member: Omit<Member, 'id'>) => {
    setMembers(prev => [...prev, { ...member, id: new Date().toISOString() }]);
  };
  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  };
  const handleDeleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleAddVisitor = (visitor: Omit<Visitor, 'id'>) => {
    setVisitors(prev => [...prev, { ...visitor, id: new Date().toISOString() }]);
  };
  const handleUpdateVisitor = (updatedVisitor: Visitor) => {
    setVisitors(prev => prev.map(v => v.id === updatedVisitor.id ? updatedVisitor : v));
  };
  const handleDeleteVisitor = (id: string) => {
    setVisitors(prev => prev.filter(v => v.id !== id));
  };
  const handleConvertToMember = (visitorId: string) => {
    const visitor = visitors.find(v => v.id === visitorId);
    if (visitor) {
      const newMember: Omit<Member, 'id'> = {
        name: visitor.name,
        phone: visitor.phone,
        role: 'Membro',
        status: 'Ativo',
        birthDate: '',
      };
      handleAddMember(newMember);
      handleDeleteVisitor(visitorId);
      alert(`${visitor.name} foi convertido(a) para membro!`);
      setView('members');
    }
  };
  
  const handleAddEvent = (event: Omit<Event, 'id'>) => {
    setEvents(prev => [...prev, { ...event, id: new Date().toISOString() }]);
  };
  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };
  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };
  
  const handleAddPrayerRequest = (request: Omit<PrayerRequest, 'id' | 'date'>) => {
    const newRequest = { ...request, id: new Date().toISOString(), date: new Date().toISOString().split('T')[0] };
    setPrayerRequests(prev => [newRequest, ...prev]);
  };
  const handleUpdatePrayerRequest = (updatedRequest: PrayerRequest) => {
      setPrayerRequests(prev => prev.map(r => r.id === updatedRequest.id ? updatedRequest : r));
  };
  const handleDeletePrayerRequest = (id: string) => {
      setPrayerRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleSaveProgram = (newContent: string) => {
    setProgramContent(newContent);
  };

  // --- Render Logic ---
  const NavButton: React.FC<{ currentView: string; targetView: string; text: string; }> = ({ currentView, targetView, text }) => (
     <button
        onClick={() => setView(targetView)}
        className={`px-3 py-2 text-sm sm:text-base rounded-lg font-medium transition-colors ${
          currentView === targetView
            ? 'bg-primary text-white shadow'
            : 'bg-transparent text-text-secondary hover:bg-gray-200'
        }`}
      >
        {text}
      </button>
  );

  const renderView = () => {
    switch(view) {
      case 'dashboard':
        return <Dashboard members={members} visitors={visitors} events={events} prayerRequestsCount={prayerRequests.length} setView={setView} role={role} />;
      case 'members':
        if (role !== 'admin') return <div className="text-center p-8 bg-card rounded-lg shadow-md"><p>Acesso restrito à administração.</p></div>;
        return <Members members={members} onAdd={handleAddMember} onUpdate={handleUpdateMember} onDelete={handleDeleteMember} />;
      case 'visitors':
        if (role !== 'admin') return <div className="text-center p-8 bg-card rounded-lg shadow-md"><p>Acesso restrito à administração.</p></div>;
        return <Visitors visitors={visitors} onAdd={handleAddVisitor} onUpdate={handleUpdateVisitor} onDelete={handleDeleteVisitor} onConvertToMember={handleConvertToMember} />;
      case 'events':
        return <Events events={events} onAdd={handleAddEvent} onUpdate={handleUpdateEvent} onDelete={handleDeleteEvent} role={role} />;
      case 'program':
        return <Program content={programContent} onSave={handleSaveProgram} role={role} />;
      case 'prayer':
        return <PrayerRequests requests={prayerRequests} onAdd={handleAddPrayerRequest} onUpdate={handleUpdatePrayerRequest} onDelete={handleDeletePrayerRequest} />;
      default:
        return <Dashboard members={members} visitors={visitors} events={events} prayerRequestsCount={prayerRequests.length} setView={setView} role={role} />;
    }
  }

  return (
    <div className="bg-background min-h-screen text-text-primary font-sans flex flex-col">
      <Header role={role} onAdminLogin={handleAdminLogin} onLogout={handleLogout} />
      <main className="container mx-auto p-4 md:p-6 flex-grow">
        <nav className="mb-6 p-2 bg-card rounded-lg shadow-md flex flex-wrap items-center justify-center gap-1 sm:gap-2">
           <NavButton currentView={view} targetView="dashboard" text="Painel" />
           <NavButton currentView={view} targetView="events" text="Eventos" />
           <NavButton currentView={view} targetView="program" text="Programa" />
           <NavButton currentView={view} targetView="prayer" text="Mural de Oração" />
           {role === 'admin' && (
             <>
               <div className="h-6 w-px bg-gray-300 mx-1 sm:mx-2 hidden sm:block"></div>
               <NavButton currentView={view} targetView="members" text="Membros" />
               <NavButton currentView={view} targetView="visitors" text="Visitantes" />
             </>
           )}
        </nav>
        
        {renderView()}

      </main>
       <footer className="border-t border-gray-200 mt-8">
          <div className="container mx-auto p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-text-secondary">
                Igreja Primitiva da Fé &copy; {new Date().getFullYear()}
              </p>
              <div className="flex items-center space-x-4">
                  <a href="https://www.facebook.com/share/1Gr8NzADBW/" target="_blank" rel="noopener noreferrer" title="Facebook" className="text-text-secondary hover:text-primary transition-colors">
                      <FacebookIcon className="w-6 h-6" />
                  </a>
                  <a href="https://www.instagram.com/primitiva.limoeiro?igsh=MTdyaDUwcGRybjJzaA==" target="_blank" rel="noopener noreferrer" title="Instagram" className="text-text-secondary hover:text-primary transition-colors">
                      <InstagramIcon className="w-6 h-6" />
                  </a>
                  <a href="https://youtube.com/@primitivalimoeiro?si=Wb7LpHbAYamN038X" target="_blank" rel="noopener noreferrer" title="YouTube" className="text-text-secondary hover:text-primary transition-colors">
                      <YouTubeIcon className="w-6 h-6" />
                  </a>
              </div>
          </div>
       </footer>

        {isPasswordModalOpen && (
            <Modal onClose={() => setIsPasswordModalOpen(false)}>
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-text-primary">Acesso de Administrador</h2>
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary">Senha</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={passwordInput}
                    onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError('');
                    }}
                    autoFocus
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-text-primary"
                />
                </div>
                {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover">Entrar</button>
                </div>
            </form>
            </Modal>
        )}
    </div>
  );
}

export default App;