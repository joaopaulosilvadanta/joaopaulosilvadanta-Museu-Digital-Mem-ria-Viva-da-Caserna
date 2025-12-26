
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  History, 
  Map as MapIcon, 
  PlusCircle, 
  ShieldCheck, 
  Menu, 
  X,
  LogIn,
  LogOut,
  Settings,
  Search,
  Lock,
  Truck,
  Crosshair,
  Star
} from 'lucide-react';

import { APP_TITLE, DEVELOPER_SIG } from './constants';
import { AppRoute, Profile } from './types';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { MemoryBot } from './components/MemoryBot';
import { db } from './services/databaseService';

// Pages
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import MonthlyHistoryPage from './pages/MonthlyHistoryPage';
import VehiclesPage from './pages/VehiclesPage';
import WeaponsPage from './pages/WeaponsPage';
import TimelinePage from './pages/TimelinePage';
import MapPage from './pages/MapPage';
import SubmitPage from './pages/SubmitPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import AnalysisPage from './pages/AnalysisPage';

const Navbar = ({ user, onLogout }: { user: Profile | null, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const canAccessAnalysis = user && (user.role === 'admin' || user.role === 'curador');
  const canAccessSubmit = user && user.role !== 'visitante';
  const canAccessAdmin = user && (user.role === 'admin' || user.role === 'curador');

  const navItems = [
    { label: 'Início', path: AppRoute.HOME, icon: <Home size={18}/> },
    { label: 'Veteranos', path: AppRoute.GALLERY, icon: <Users size={18}/> },
    { label: 'Destaque', path: AppRoute.MONTHLY, icon: <Star size={18}/> },
    { label: 'Viaturas', path: AppRoute.VEHICLES, icon: <Truck size={18}/> },
    { label: 'Armamento', path: AppRoute.WEAPONS, icon: <Crosshair size={18}/> },
    { label: 'História', path: AppRoute.TIMELINE, icon: <History size={18}/> },
    { label: 'Mapa', path: AppRoute.MAP, icon: <MapIcon size={18}/> },
  ];

  if (canAccessAnalysis) {
    navItems.push({ label: 'IA', path: AppRoute.ANALYSIS, icon: <Search size={18}/> });
  }

  return (
    <nav className="bg-indigo-950 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-800 p-2 rounded-lg">
              <ShieldCheck className="text-amber-400" />
            </div>
            <Link to={AppRoute.HOME}>
              <h1 className="text-lg font-bold leading-tight">Memória da Caserna</h1>
              <p className="text-[10px] text-indigo-300 font-medium uppercase tracking-wider">Museu Digital da Memória Viva</p>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-indigo-900 text-amber-400' 
                    : 'hover:bg-indigo-900 text-slate-300'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-indigo-800 mx-2"></div>
            
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end mr-2">
                   <span className="text-[10px] font-bold text-white leading-none">{user.nome}</span>
                   <span className="text-[8px] uppercase tracking-tighter text-amber-400 font-black">{user.role}</span>
                </div>
                {canAccessAdmin && (
                  <Link to={AppRoute.ADMIN} className="p-2 bg-amber-500 text-indigo-950 rounded-lg hover:bg-amber-600 transition-all" title="Painel de Curadoria">
                    <Settings size={18} />
                  </Link>
                )}
                <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-950/30 rounded-md transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to={AppRoute.LOGIN} className="flex items-center gap-2 px-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-sm font-bold transition-all">
                <LogIn size={18} /> Entrar
              </Link>
            )}
          </div>

          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-indigo-900">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-indigo-950 border-t border-indigo-900 px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === item.path ? 'bg-indigo-900 text-amber-400' : 'hover:bg-indigo-900 text-slate-300'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          {user ? (
             <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full text-left block flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-red-400">
                <LogOut size={18} /> Sair
             </button>
          ) : (
            <Link to={AppRoute.LOGIN} onClick={() => setIsOpen(false)} className="block flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-amber-400">
              <LogIn size={18} /> Entrar
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    setUser(db.getCurrentUser());
  }, []);

  const handleLogout = () => {
    db.logout();
    setUser(null);
    window.location.hash = AppRoute.HOME;
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path={AppRoute.HOME} element={<HomePage />} />
            <Route path={AppRoute.GALLERY} element={<GalleryPage />} />
            <Route path={AppRoute.MONTHLY} element={<MonthlyHistoryPage />} />
            <Route path={AppRoute.VEHICLES} element={<VehiclesPage />} />
            <Route path={AppRoute.WEAPONS} element={<WeaponsPage />} />
            <Route path={AppRoute.TIMELINE} element={<TimelinePage />} />
            <Route path={AppRoute.MAP} element={<MapPage />} />
            <Route path={AppRoute.ANALYSIS} element={
              (user?.role === 'admin' || user?.role === 'curador') ? <AnalysisPage /> : <HomePage />
            } />
            <Route path={AppRoute.SUBMIT} element={<SubmitPage user={user} />} />
            <Route path={AppRoute.ADMIN} element={
              (user?.role === 'admin' || user?.role === 'curador') ? <AdminPage user={user} /> : <LoginPage onLogin={setUser} />
            } />
            <Route path={AppRoute.LOGIN} element={<LoginPage onLogin={setUser} />} />
          </Routes>
        </main>
        <footer className="bg-indigo-950 text-indigo-300 py-12 px-4 border-t border-indigo-900 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">{APP_TITLE}</h3>
              <p className="text-sm max-w-md italic">"Preservar o passado é garantir o futuro das instituições militares."</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">{DEVELOPER_SIG}</p>
              <p className="text-xs">© 2026 - Museu Digital da Memória Viva</p>
            </div>
          </div>
        </footer>
        <AccessibilityToolbar />
        <MemoryBot />
      </div>
    </HashRouter>
  );
};

export default App;
