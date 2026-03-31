
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  History as HistoryIcon, 
  MapPin, 
  Shield, 
  ChevronLeft, 
  BookOpen, 
  FileText, 
  Info, 
  Tag, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star
} from 'lucide-react';
import { db } from '../services/databaseService';
import { UnidadePMRR, AppRoute } from '../types';

const UnitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [unidade, setUnidade] = useState<UnidadePMRR | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnidade = async () => {
      if (id) {
        const data = await db.getUnidadeById(id);
        setUnidade(data);
      }
      setLoading(false);
    };
    fetchUnidade();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!unidade) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <AlertCircle size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Unidade não encontrada</h1>
        <p className="text-slate-500 mb-8">A unidade que você está procurando não existe ou foi removida.</p>
        <button 
          onClick={() => navigate(AppRoute.UNITS)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <ChevronLeft size={20} /> Voltar para Unidades
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-indigo-950 text-white pt-12 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <button 
            onClick={() => navigate(AppRoute.UNITS)}
            className="flex items-center gap-2 text-indigo-300 hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <ChevronLeft size={16} /> Voltar para Unidades
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-amber-500 text-indigo-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                  {unidade.nivel_organizacional}
                </span>
                <span className="bg-indigo-800 text-indigo-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {unidade.sigla}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
                {unidade.nome}
              </h1>
              <div className="flex items-center gap-4 text-indigo-300">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span className="text-sm font-medium">{unidade.localizacao}</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${unidade.status_revisao === 'Aprovado' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {unidade.status_revisao === 'Aprovado' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-300 leading-none mb-1">Status de Revisão</p>
                    <p className="text-sm font-bold text-white">{unidade.status_revisao}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
              <img 
                src={unidade.foto_url || 'https://picsum.photos/seed/pmrr/1200/800'} 
                alt={unidade.nome}
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Ficha de Catalogação - Texto Histórico */}
            <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  <HistoryIcon size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Texto Histórico Institucional</h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
                {unidade.texto_historico.split('\n').map((para, i) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>
            </section>

            {/* Atribuições e Relevância */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                    <Shield size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Atribuições Gerais</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {unidade.atribuicoes_gerais}
                </p>
              </section>

              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                    <Star size={20} className="fill-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Relevância Institucional</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {unidade.relevancia_institucional}
                </p>
              </section>
            </div>

            {/* Memória Institucional */}
            <section className="bg-indigo-900 text-white p-8 md:p-10 rounded-3xl shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/10 p-2 rounded-lg text-amber-400">
                  <BookOpen size={24} />
                </div>
                <h2 className="text-2xl font-bold">Relação com a Memória</h2>
              </div>
              <p className="text-indigo-100 leading-relaxed text-lg italic">
                "{unidade.relacao_memoria}"
              </p>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Ficha Técnica Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info size={18} className="text-indigo-600" /> Ficha Técnica
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Vinculação Hierárquica</p>
                  <p className="text-sm font-bold text-slate-700">{unidade.vinculacao_hierarquica}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Tipo de Unidade</p>
                  <p className="text-sm font-bold text-slate-700">{unidade.tipo_unidade}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Área de Atuação</p>
                  <p className="text-sm font-bold text-slate-700">{unidade.area_atuacao}</p>
                </div>
                
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3">Marcos Históricos</p>
                  <ul className="space-y-2">
                    {unidade.marcos_historicos.map((marco, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                        {marco}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3">Palavras-Chave</p>
                  <div className="flex flex-wrap gap-2">
                    {unidade.palavras_chave.map((tag, i) => (
                      <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3">Fontes de Referência</p>
                  <ul className="space-y-2">
                    {unidade.fontes.map((fonte, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-indigo-600 font-medium">
                        <ExternalLink size={12} />
                        {typeof fonte === 'string' ? fonte : fonte.referencia}
                      </li>
                    ))}
                  </ul>
                </div>

                {unidade.observacoes && (
                  <div className="pt-6 border-t border-slate-100">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Observações</p>
                    <p className="text-xs text-slate-500 italic">{unidade.observacoes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer Signature */}
      <div className="max-w-5xl mx-auto px-4 mt-12 text-center">
        <p className="text-[10px] uppercase tracking-widest font-black text-slate-300">
          Documento gerado pelo APP FESP – Desenvolvido por João Paulo Silva Dantas
        </p>
      </div>
    </div>
  );
};

export default UnitDetailPage;
