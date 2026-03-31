
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../services/databaseService';
import { Armamento, SearchFilters } from '../types';
import { Search, Crosshair, Calendar, Info, Volume2, Shield, Target, Filter } from 'lucide-react';
import { speakMemory } from '../services/geminiService';
import { LazyImage } from '../components/LazyImage';
import { SearchFilterBar } from '../components/SearchFilterBar';

const WeaponsPage: React.FC = () => {
  const [armamentos, setArmamentos] = useState<Armamento[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    db.getArmamentos().then(setArmamentos);
  }, []);

  const filteredWeapons = useMemo(() => {
    return armamentos.filter(a => {
      const matchesType = !filters.tipo || a.tipo === filters.tipo;
      const matchesStatus = !filters.status || a.status === filters.status;
      const matchesCalibre = !filters.calibre || a.calibre === filters.calibre;
      const matchesFabricante = !filters.fabricante || a.fabricante === filters.fabricante;
      
      const searchTerm = (filters.query || '').toLowerCase();
      const matchesSearch = !searchTerm || 
                            a.nome.toLowerCase().includes(searchTerm) || 
                            a.calibre.toLowerCase().includes(searchTerm) ||
                            a.fabricante.toLowerCase().includes(searchTerm) ||
                            a.descricao.toLowerCase().includes(searchTerm);
      return matchesType && matchesStatus && matchesSearch && matchesCalibre && matchesFabricante;
    });
  }, [armamentos, filters]);

  const calibres = Array.from(new Set(armamentos.map(a => a.calibre))).filter(Boolean);
  const fabricantes = Array.from(new Set(armamentos.map(a => a.fabricante))).filter(Boolean);

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioData = await speakMemory(text);
      if (audioData) {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const dataInt16 = new Int16Array(audioData.buffer, audioData.byteOffset, audioData.length / 2);
        const frameCount = dataInt16.length;
        const buffer = ctx.createBuffer(1, frameCount, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i] / 32768.0;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => { setIsSpeaking(false); ctx.close(); };
        source.start();
      } else { setIsSpeaking(false); }
    } catch (error) { console.error(error); setIsSpeaking(false); }
  };

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-900 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          <Crosshair size={14} /> Acervo Bélico
        </div>
        <h1 className="text-4xl font-bold text-indigo-950 serif-font mb-4">Galeria de Armamento</h1>
        <p className="text-slate-600 max-w-2xl">A evolução tecnológica do poder de fogo e defesa institucional, desde os calibres clássicos aos sistemas modernos.</p>
      </div>

      <SearchFilterBar 
        filters={filters}
        onFilterChange={setFilters}
        availableFilters={['query', 'tipo', 'status', 'calibre', 'fabricante']}
        filterOptions={{
          tipo: ['Pistola', 'Fuzil', 'Metralhadora', 'Revólver', 'Especial'],
          status: ['Histórico', 'Acervo', 'Moderno'],
          calibre: calibres,
          fabricante: fabricantes
        }}
        placeholder="Pesquisar armamento, calibre ou fabricante..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredWeapons.map(a => (
          <div key={a.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-md hover:shadow-2xl transition-all border border-slate-100 flex flex-col">
            <div className="relative h-64 bg-slate-100">
              <LazyImage 
                src={a.foto_url} 
                alt={a.nome} 
                className="w-full h-full transition-transform duration-700 group-hover:scale-110" 
              />
              <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-md text-white z-10 ${
                a.status === 'Histórico' ? 'bg-amber-600/80' : a.status === 'Acervo' ? 'bg-indigo-950/80' : 'bg-green-600/80'
              }`}>
                {a.status}
              </div>
              <div className="absolute bottom-4 right-6 bg-white/90 backdrop-blur text-indigo-950 px-3 py-1 rounded-lg text-xs font-bold shadow-sm z-10">
                {a.calibre}
              </div>
            </div>
            
            <div className="p-8 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">{a.tipo} • {a.fabricante}</span>
              </div>
              <h3 className="text-2xl font-bold text-indigo-950 serif-font mb-4 leading-tight">{a.nome}</h3>
              <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow italic">
                "{a.descricao}"
              </p>

              <div className="mt-auto space-y-3">
                <button 
                  onClick={() => handleSpeak(`${a.nome}. Calibre ${a.calibre}. Fabricado por ${a.fabricante}. ${a.descricao}`)} 
                  disabled={isSpeaking} 
                  className="w-full p-4 bg-slate-100 text-indigo-950 rounded-2xl hover:bg-amber-500 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
                >
                  <Volume2 size={16} className={isSpeaking ? 'animate-pulse' : ''}/> Narrativa IA Solene
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredWeapons.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <Target size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">Nenhum armamento encontrado para os critérios selecionados.</p>
          </div>
        )}
      </div>

      <div className="mt-16 bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 shadow-inner">
            <Shield size={64} className="text-amber-500" />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-2xl font-bold serif-font mb-4">Controle e Preservação Bélica</h2>
            <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
              O acervo histórico de armamento do Museu Digital é composto por peças desativadas ou em carga controlada. 
              A preservação destes itens permite o estudo da evolução da balística militar e dos protocolos de segurança 
              utilizados pela corporação ao longo das décadas.
            </p>
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-500 tracking-tighter">
                 <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div> Peças Catalogadas: {armamentos.length}
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-400 tracking-tighter">
                 <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div> Revisão de Curadoria: 2026
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeaponsPage;
