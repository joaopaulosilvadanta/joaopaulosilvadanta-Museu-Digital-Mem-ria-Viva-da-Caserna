
import React, { useState, useEffect } from 'react';
import { db } from '../services/databaseService';
import { Viatura } from '../types';
import { Search, Truck, Calendar, Info, Volume2, Shield, ChevronRight, Filter } from 'lucide-react';
import { speakMemory } from '../services/geminiService';

const VehiclesPage: React.FC = () => {
  const [viaturas, setViaturas] = useState<Viatura[]>([]);
  const [filter, setFilter] = useState<string>('Todas');
  const [search, setSearch] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    db.getViaturas().then(setViaturas);
  }, []);

  const categories = ['Todas', 'Histórico', 'Patrulhamento', 'Especial', 'Logística'];

  const filteredVehicles = viaturas.filter(v => {
    const matchesFilter = filter === 'Todas' || v.tipo === filter;
    const searchTerm = search.toLowerCase();
    const matchesSearch = v.modelo.toLowerCase().includes(searchTerm) || 
                          v.descricao.toLowerCase().includes(searchTerm) ||
                          v.ano.toString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

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
          <Truck size={14} /> Acervo Automotivo
        </div>
        <h1 className="text-4xl font-bold text-indigo-950 serif-font mb-4">Galeria de Viaturas</h1>
        <p className="text-slate-600 max-w-2xl">A evolução dos meios de transporte da Caserna, do deserto de Roraima às patrulhas urbanas modernas.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar modelo, ano ou característica..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
                filter === cat ? 'bg-indigo-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVehicles.map(v => (
          <div key={v.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-md hover:shadow-2xl transition-all border border-slate-100 flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img src={v.foto_url} alt={v.modelo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-md text-white ${
                v.status === 'Ativa' ? 'bg-green-600/80' : v.status === 'Preservada' ? 'bg-amber-600/80' : 'bg-indigo-950/80'
              }`}>
                {v.status}
              </div>
              <div className="absolute bottom-4 right-6 bg-white/90 backdrop-blur text-indigo-950 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                Ano: {v.ano}
              </div>
            </div>
            
            <div className="p-8 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">{v.tipo}</span>
              </div>
              <h3 className="text-2xl font-bold text-indigo-950 serif-font mb-4 leading-tight">{v.modelo}</h3>
              <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow italic">
                "{v.descricao}"
              </p>

              <div className="mt-auto space-y-3">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSpeak(`${v.modelo}. Viatura do tipo ${v.tipo}. ${v.descricao}`)} 
                    disabled={isSpeaking} 
                    className="flex-1 p-3 bg-slate-100 text-indigo-950 rounded-xl hover:bg-amber-500 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
                  >
                    <Volume2 size={16} className={isSpeaking ? 'animate-pulse' : ''}/> Narrativa IA
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredVehicles.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <Truck size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">Nenhuma viatura encontrada para os critérios selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclesPage;
