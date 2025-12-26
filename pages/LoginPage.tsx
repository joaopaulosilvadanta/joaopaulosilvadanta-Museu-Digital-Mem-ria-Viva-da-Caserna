
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, User, Key, Shield } from 'lucide-react';
import { APP_TITLE, DEVELOPER_SIG } from '../constants';
import { AppRoute, Profile } from '../types';
import { db } from '../services/databaseService';

interface LoginPageProps {
  onLogin: (user: Profile) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await db.login(email, password);
    if (user) {
      onLogin(user);
      if (user.role === 'admin' || user.role === 'curador') {
        navigate(AppRoute.ADMIN);
      } else {
        navigate(AppRoute.HOME);
      }
    }
  };

  const fastLogin = (roleEmail: string) => {
      setEmail(roleEmail);
      setPassword('123456');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50 animate-in fade-in">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="bg-indigo-900 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-900/20">
            <ShieldCheck className="text-amber-400" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-indigo-950 serif-font mb-2">Identificação de Serviço</h1>
          <p className="text-slate-500 text-sm">Acesse conforme seu perfil de atribuição</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-900 uppercase tracking-widest px-1">Credencial (E-mail)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="exemplo@pm.rr.gov.br"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-900 uppercase tracking-widest px-1">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-900 text-white font-bold rounded-2xl hover:bg-indigo-800 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-900/10"
            >
              Iniciar Sessão <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="mt-8 space-y-3">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">Atalhos de Simulação para Teste:</p>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => fastLogin('admin@pm.rr.gov.br')} className="p-2 text-[9px] bg-amber-50 text-amber-800 border border-amber-200 rounded-xl flex items-center gap-2 hover:bg-amber-100 transition-colors">
                    <Shield size={12} /> Administrador
                </button>
                <button onClick={() => fastLogin('curador@pm.rr.gov.br')} className="p-2 text-[9px] bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-xl flex items-center gap-2 hover:bg-indigo-100 transition-colors">
                    <Key size={12} /> Curador IA
                </button>
                <button onClick={() => fastLogin('colaborador@pm.rr.gov.br')} className="p-2 text-[9px] bg-slate-50 text-slate-800 border border-slate-200 rounded-xl flex items-center gap-2 hover:bg-slate-100 transition-colors">
                    <User size={12} /> Colaborador
                </button>
                <button onClick={() => fastLogin('visitante@externo.com')} className="p-2 text-[9px] bg-white text-slate-400 border border-slate-100 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-colors">
                    <User size={12} /> Visitante
                </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
           <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{DEVELOPER_SIG}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
