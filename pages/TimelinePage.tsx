
import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../services/databaseService';
import { LinhaDoTempo, Historia, AppRoute, SearchFilters } from '../types';
import { Shield, History, ArrowRight, ExternalLink, MapPin, FileText, Mic, Video, Share2, Check, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SearchFilterBar } from '../components/SearchFilterBar';

const TimelinePage: React.FC = () => {
  const [timeline, setTimeline] = useState<LinhaDoTempo[]>([]);
  const [historias, setHistorias] = useState<Historia[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [tData, hData] = await Promise.all([
        db.getLinhaDoTempo(),
        db.getHistoriasAprovadas()
      ]);
      setTimeline(tData);
      setHistorias(hData);
    };
    loadData();
  }, []);

  const filteredTimeline = useMemo(() => {
    return timeline.filter(event => {
      const searchTerm = (filters.query || '').toLowerCase();
      const matchesSearch = !searchTerm || 
                            event.titulo.toLowerCase().includes(searchTerm) || 
                            event.descricao.toLowerCase().includes(searchTerm) ||
                            event.ano.toString().includes(searchTerm);
      
      const matchesYear = !filters.ano || event.ano.toString() === filters.ano.toString();
      
      return matchesSearch && matchesYear;
    }).sort((a, b) => a.ano - b.ano);
  }, [timeline, filters]);

  const availableYears = Array.from(new Set(timeline.map(t => t.ano.toString()))).sort();

  const getHistoriaForMarco = (historiaId?: string) => {
    return historias.find(h => h.id === historiaId);
  };

  const handleShareStory = (vId: string, sId: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}#${AppRoute.GALLERY}?veteran=${vId}&story=${sId}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopyFeedback(sId);
      setTimeout(() => setCopyFeedback(null), 3000);
    });
  };

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-900 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          <History size={14} /> Cronologia Institucional
        </div>
        <h1 className="text-4xl font-bold text-indigo-950 serif-font mb-4">A Linha do Tempo da Caserna</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">Dos primeiros passos da Guarda Territorial à consolidação da Polícia Militar, conectando fatos a memórias reais.</p>
      </div>

      <div className="mb-12 max-w-2xl mx-auto">
        <SearchFilterBar 
          filters={filters}
          onFilterChange={setFilters}
          availableFilters={['query', 'ano']}
          filterOptions={{
            ano: availableYears
          }}
          placeholder="Pesquisar fatos, anos ou descrições..."
        />
      </div>

      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-indigo-100 hidden md:block"></div>

        <div className="space-y-12 md:space-y-20">
          {filteredTimeline.map((event, idx) => {
            const h = getHistoriaForMarco(event.historia_id);
            return (
              <div key={event.id} className={`flex flex-col md:flex-row items-center w-full relative ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="hidden md:block w-1/2"></div>
                
                <div className="z-10 bg-indigo-900 border-4 border-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl mb-6 md:mb-0 transform hover:scale-110 transition-transform">
                  <span className="text-amber-400 font-bold text-xs">{event.ano}</span>
                </div>

                <div className="w-full md:w-1/2 px-4 md:px-12">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 hover:shadow-2xl transition-all relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
                    
                    <h3 className="text-2xl font-bold text-indigo-950 serif-font mb-3 leading-tight">{event.titulo}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm mb-6">{event.descricao}</p>
                    
                    {h && (
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-3 group/story">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                                    {h.tipo === 'áudio' ? <Mic size={14} /> : 
                                     h.tipo === 'vídeo' ? <Video size={14} /> : 
                                     <FileText size={14} />}
                                </div>
                                <span className="text-[10px] font-black text-indigo-900 uppercase tracking-tighter">Relato Vinculado</span>
                            </div>
                            <button 
                              onClick={() => handleShareStory(h.veterano_id || '', h.id)}
                              className={`p-2 rounded-lg transition-all ${
                                copyFeedback === h.id ? 'bg-green-600 text-white' : 'bg-white text-indigo-900 border border-slate-200 hover:bg-indigo-900 hover:text-white'
                              }`}
                              title="Compartilhar Memória"
                            >
                              {copyFeedback === h.id ? <Check size={14} /> : <Share2 size={14} />}
                            </button>
                        </div>
                        
                        <p className="text-xs text-slate-500 italic line-clamp-2 leading-relaxed">
                          "{h.descricao}"
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                           {h.localizacao && (
                             <div className="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase">
                               <MapPin size={10} /> {h.localizacao}
                             </div>
                           )}
                           <Link 
                            to={`${AppRoute.GALLERY}?veteran=${h.veterano_id}&story=${h.id}`} 
                            className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-800 transition-colors"
                          >
                            Ver Acervo <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTimeline.length === 0 && (
            <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
               <Filter size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 font-medium">Nenhum evento encontrado para os critérios selecionados.</p>
               <button onClick={() => setFilters({})} className="mt-4 text-indigo-600 font-bold hover:underline">Limpar Filtros</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
