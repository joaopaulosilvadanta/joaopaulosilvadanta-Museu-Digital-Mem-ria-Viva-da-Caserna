
import React, { useState, useEffect } from 'react';
import { db } from '../services/databaseService';
import { Contribuicao, Historia, Profile } from '../types';
import { Check, ShieldAlert, Trash2, MessageSquare, History, FileText, UserCheck, Eye, EyeOff, AlertCircle, Clock, Shield } from 'lucide-react';

interface AdminPageProps {
    user?: Profile | null;
}

const AdminPage: React.FC<AdminPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'moderacao' | 'acervo' | 'contribuicoes'>('moderacao');
  const [contribuicoes, setContribuicoes] = useState<Contribuicao[]>([]);
  const [historiasPendentes, setHistoriasPendentes] = useState<Historia[]>([]);
  const [historiasAprovadas, setHistoriasAprovadas] = useState<Historia[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [cData, hPendentes, hAprovadas] = await Promise.all([
      db.getContribuicoes(),
      db.getHistoriasPendentes(),
      db.getHistoriasAprovadas()
    ]);
    setContribuicoes(cData);
    setHistoriasPendentes(hPendentes);
    setHistoriasAprovadas(hAprovadas);
    setLoading(false);
  };

  const handleApproveContribuicao = async (id: string) => {
    await db.aprovarContribuicao(id);
    loadData();
  };

  const handleApproveHistoria = async (id: string) => {
    await db.aprovarHistoria(id);
    loadData();
  };

  const handleDeleteContribuicao = async (id: string) => {
    if (!isAdmin) {
        alert("Apenas Administradores podem excluir registros permanentemente.");
        return;
    }
    if (confirm('Deseja excluir definitivamente esta contribuição?')) {
      await db.excluirContribuicao(id);
      loadData();
    }
  };

  const handleDeleteHistoria = async (id: string) => {
    if (!isAdmin) {
        alert("Apenas Administradores podem remover histórias do painel público.");
        return;
    }
    if (confirm('Deseja remover esta história do acervo?')) {
      await db.rejeitarHistoria(id);
      loadData();
    }
  };

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-900 p-3 rounded-2xl text-amber-400">
            {isAdmin ? <ShieldAlert size={32} /> : <Shield size={32} />}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-indigo-950 serif-font">
                {isAdmin ? 'Gestão de Curadoria (Master)' : 'Módulo de Verificação Técnica'}
            </h1>
            <p className="text-slate-500 font-medium">
                Sessão ativa como: <span className="text-indigo-600 font-bold uppercase">{user?.role}</span>
            </p>
          </div>
        </div>

        {/* Stats Row - Somente Admin vê o status completo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="bg-amber-50 p-4 rounded-2xl text-amber-600"><Clock /></div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendentes</p>
                    <p className="text-2xl font-bold text-indigo-950">{historiasPendentes.length}</p>
                </div>
            </div>
            {isAdmin && (
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-green-50 p-4 rounded-2xl text-green-600"><Check /></div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Publicadas</p>
                        <p className="text-2xl font-bold text-indigo-950">{historiasAprovadas.length}</p>
                    </div>
                </div>
            )}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600"><MessageSquare /></div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Relatos</p>
                    <p className="text-2xl font-bold text-indigo-950">{contribuicoes.length}</p>
                </div>
            </div>
            <div className="bg-indigo-950 p-6 rounded-3xl shadow-xl flex items-center gap-4 text-white">
                <div className="bg-white/10 p-4 rounded-2xl"><UserCheck /></div>
                <div>
                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Identidade</p>
                    <p className="text-sm font-bold truncate max-w-[120px]">{user?.nome}</p>
                </div>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
            <button 
                onClick={() => setActiveTab('moderacao')}
                className={`flex items-center gap-2 px-6 py-4 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'moderacao' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
                <AlertCircle size={18} /> Moderação Pendente
            </button>
            <button 
                onClick={() => setActiveTab('acervo')}
                className={`flex items-center gap-2 px-6 py-4 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'acervo' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
                <FileText size={18} /> Histórias Publicadas
            </button>
            <button 
                onClick={() => setActiveTab('contribuicoes')}
                className={`flex items-center gap-2 px-6 py-4 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'contribuicoes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
                <MessageSquare size={18} /> Relatos de Terceiros
            </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b">
                            <th className="px-8 py-5">Identificação</th>
                            <th className="px-8 py-5">Tipo / Origem</th>
                            <th className="px-8 py-5">Conteúdo do Relato</th>
                            <th className="px-8 py-5 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {activeTab === 'moderacao' && (
                            historiasPendentes.map(h => (
                                <tr key={h.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-indigo-950 text-sm mb-1">{h.titulo}</p>
                                        <p className="text-[10px] text-amber-600 font-black uppercase tracking-tight flex items-center gap-1">
                                            <Clock size={10} /> Aguardando Inserção
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase border w-fit ${h.tipo === 'áudio' ? 'bg-blue-50 text-blue-600 border-blue-100' : h.tipo === 'vídeo' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                            {h.tipo}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 max-w-xs">
                                        <p className="text-xs text-slate-500 line-clamp-2 italic">"{h.descricao}"</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button 
                                                onClick={() => handleApproveHistoria(h.id)}
                                                className="bg-green-600 text-white p-3 rounded-2xl hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all"
                                                title="Aprovar e Publicar"
                                            >
                                                <Check size={18} />
                                            </button>
                                            {isAdmin && (
                                                <button 
                                                    onClick={() => handleDeleteHistoria(h.id)}
                                                    className="bg-red-50 text-red-600 p-3 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                                                    title="Rejeitar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}

                        {activeTab === 'acervo' && (
                            historiasAprovadas.map(h => (
                                <tr key={h.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-indigo-950 text-sm mb-1">{h.titulo}</p>
                                        <p className="text-[10px] text-green-600 font-black uppercase tracking-tight flex items-center gap-1">
                                            <Eye size={10} /> Live no Painel
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase border w-fit bg-indigo-50 text-indigo-600 border-indigo-100`}>
                                            {h.tipo}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 max-w-xs">
                                        <p className="text-xs text-slate-500 line-clamp-2">"{h.descricao}"</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {isAdmin && (
                                            <button 
                                                onClick={() => handleDeleteHistoria(h.id)}
                                                className="bg-slate-100 text-slate-600 p-3 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                                                title="Remover do Painel"
                                            >
                                                <EyeOff size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}

                        {activeTab === 'contribuicoes' && (
                            contribuicoes.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50/50 transition-all">
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-indigo-950 text-sm">{c.nome}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{c.email}</p>
                                    </td>
                                    <td className="px-8 py-6 max-w-sm">
                                        <p className="text-xs text-slate-500 line-clamp-2 italic">"{c.relato}"</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase ${c.aprovado ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {c.aprovado ? 'Publicado' : 'Aguardando'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {!c.aprovado && (
                                                <button 
                                                    onClick={() => handleApproveContribuicao(c.id)}
                                                    className="bg-green-600 text-white p-3 rounded-2xl hover:bg-green-700 transition-all"
                                                >
                                                    <Check size={18} />
                                                </button>
                                            )}
                                            {isAdmin && (
                                                <button 
                                                    onClick={() => handleDeleteContribuicao(c.id)}
                                                    className="bg-red-50 text-red-600 p-3 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
