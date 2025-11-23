
import React, { useState, useEffect } from 'react';
import { Member, Visitor, Event, PrayerRequest, Role } from './types';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import * as dbService from "./services/firebase";

// Components
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Visitors from './components/Visitors';
import Events from './components/Events';
import Program from './components/Program';
import PrayerRequests from './components/PrayerRequests';
import DatabaseManager from './components/DatabaseManager';
import Modal from './components/Modal';
import { FacebookIcon, InstagramIcon, YouTubeIcon } from './components/Icons';

// --- Main App Component ---
const App: React.FC = () => {
  const [role, setRole] = useState<Role>('public');
  const [view, setView] = useState('dashboard');
  
  const [members, setMembers] = useState<Member[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [programContent, setProgramContent] = useState<string>('');

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // --- Auth & Data Listeners ---
  useEffect(() => {
    // Auth Listener
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setRole('admin');
      } else {
        setRole('public');
      }
    });

    // Data Listeners (Real-time sync)
    const unsubMembers = dbService.subscribeToMembers(setMembers);
    const unsubVisitors = dbService.subscribeToVisitors(setVisitors);
    const unsubEvents = dbService.subscribeToEvents(setEvents);
    const unsubPrayer = dbService.subscribeToPrayerRequests(setPrayerRequests);
    const unsubProgram = dbService.subscribeToProgram(setProgramContent);

    return () => {
      unsubscribeAuth();
      unsubMembers();
      unsubVisitors();
      unsubEvents();
      unsubPrayer();
      unsubProgram();
    };
  }, []);


  const handleAdminLogin = () => {
    setAuthError('');
    setIsPasswordModalOpen(true);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      setIsPasswordModalOpen(false);
      setEmailInput('');
      setPasswordInput('');
    } catch (error: any) {
      console.error(error);
      setAuthError("Erro ao entrar. Verifique email e senha.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setView('dashboard');
  };

  // --- CRUD Handlers (Connected to Firebase) ---
  const handleAddMember = async (member: Omit<Member, 'id'>) => {
    try { await dbService.addMember(member); } catch(e) { console.error(e); alert("Erro ao salvar"); }
  };
  const handleUpdateMember = async (updatedMember: Member) => {
    try { await dbService.updateMember(updatedMember); } catch(e) { console.error(e); alert("Erro ao atualizar"); }
  };
  const handleDeleteMember = async (id: string) => {
    try { await dbService.deleteMember(id); } catch(e) { console.error(e); alert("Erro ao deletar"); }
  };

  const handleAddVisitor = async (visitor: Omit<Visitor, 'id'>) => {
    try { await dbService.addVisitor(visitor); } catch(e) { console.error(e); alert("Erro ao salvar"); }
  };
  const handleUpdateVisitor = async (updatedVisitor: Visitor) => {
    try { await dbService.updateVisitor(updatedVisitor); } catch(e) { console.error(e); alert("Erro ao atualizar"); }
  };
  const handleDeleteVisitor = async (id: string) => {
    try { await dbService.deleteVisitor(id); } catch(e) { console.error(e); alert("Erro ao deletar"); }
  };

  const handleConvertToMember = async (visitorId: string) => {
    const visitor = visitors.find(v => v.id === visitorId);
    if (visitor) {
      const newMember: Omit<Member, 'id'> = {
        name: visitor.name,
        phone: visitor.phone,
        role: 'Membro',
        status: 'Ativo',
        birthDate: '',
      };
      await handleAddMember(newMember);
      await handleDeleteVisitor(visitorId);
      alert(`${visitor.name} foi convertido(a) para membro!`);
      setView('members');
    }
  };
  
  const handleAddEvent = async (event: Omit<Event, 'id'>) => {
    try { await dbService.addEvent(event); } catch(e) { console.error(e); alert("Erro ao salvar"); }
  };
  const handleUpdateEvent = async (updatedEvent: Event) => {
    try { await dbService.updateEvent(updatedEvent); } catch(e) { console.error(e); alert("Erro ao atualizar"); }
  };
  const handleDeleteEvent = async (id: string) => {
    try { await dbService.deleteEvent(id); } catch(e) { console.error(e); alert("Erro ao deletar"); }
  };
  
  const handleAddPrayerRequest = async (request: Omit<PrayerRequest, 'id' | 'date'>) => {
    const newRequest = { ...request, date: new Date().toISOString().split('T')[0] };
    try { await dbService.addPrayerRequest(newRequest); } catch(e) { console.error(e); alert("Erro ao salvar"); }
  };
  const handleUpdatePrayerRequest = async (updatedRequest: PrayerRequest) => {
    try { await dbService.updatePrayerRequest(updatedRequest); } catch(e) { console.error(e); alert("Erro ao atualizar"); }
  };
  const handleDeletePrayerRequest = async (id: string) => {
    try { await dbService.deletePrayerRequest(id); } catch(e) { console.error(e); alert("Erro ao deletar"); }
  };

  const handleSaveProgram = async (newContent: string) => {
    try { await dbService.saveProgram(newContent); } catch(e) { console.error(e); alert("Erro ao salvar programa"); }
  };

  // --- Database Handlers ---
  const handleExportData = () => {
    const data = {
        members,
        visitors,
        events,
        prayerRequests,
        programContent,
        version: '1.0',
        exportDate: new Date().toISOString(),
        source: 'firebase-backup'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ipf-limoeiro-cloud-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (file: File) => {
    alert("A importação direta não está disponível na versão Cloud por segurança. Contate o suporte técnico.");
  };

  const handleResetData = () => {
    alert("O reset global está desativado na versão Cloud para evitar perda de dados.");
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
      case 'database':
        if (role !== 'admin') return <div className="text-center p-8 bg-card rounded-lg shadow-md"><p>Acesso restrito à administração.</p></div>;
        return <DatabaseManager onExport={handleExportData} onImport={handleImportData} onReset={handleResetData} />;
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
               <NavButton currentView={view} targetView="database" text="Dados" />
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
            <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-text-primary">Acesso Administrativo</h2>
                
                {authError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{authError}</div>}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-text-primary"
                        placeholder="admin@igreja.com"
                        required
                    />
                </div>
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary">Senha</label>
                <input
                    type="password"
                    id="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-text-primary"
                    required
                />
                </div>
                
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
