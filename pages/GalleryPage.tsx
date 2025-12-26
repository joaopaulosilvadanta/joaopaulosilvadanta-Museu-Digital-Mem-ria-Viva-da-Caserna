
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../services/databaseService';
import { Veterano, Historia, AppRoute } from '../types';
import { 
  Search, Volume2, Info, X, Play, Pause, History, Calendar, 
  FileText, Video, Mic, MapPin, ZoomIn, ZoomOut, 
  ChevronRight, Share2, Check, ImageIcon, ArrowUpDown, Shield,
  Filter
} from 'lucide-react';
import { speakMemory } from '../services/geminiService';

const MiniStoryMap: React.FC<{ location: string }> = ({ location }) => {
  const [zoom, setZoom] = useState(1);
  return (
    <div className="mt-4 rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 relative h-40 group">
      <div className="absolute inset-0 transition-transform duration-500 flex items-center justify-center grayscale opacity-40 group-hover:grayscale-0" style={{ transform: `scale(${zoom})` }}>
        <img src={`https://picsum.photos/seed/${location}/800/400?blur=2`} alt="Mapa" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-amber-500 p-1.5 rounded-full shadow-2xl ring-4 ring-amber-500/30">
          <MapPin size={16} className="text-indigo-950" />
        </div>
      </div>
    </div>
  );
};

const GalleryPage: React.FC = () => {
  const [veteranos, setVeteranos] = useState<Veterano[]>([]);
  const [historias, setHistorias] = useState<{[key: string]: Historia[]}>({});
  const [filter, setFilter] = useState<string>('Todos');
  const [mediaFilter, setMediaFilter] = useState<string>('Todas');
  const [sortBy, setSortBy] = useState<string>('nome-asc');
  const [search, setSearch] = useState('');
  const [selectedVeteran, setSelectedVeteran] = useState<Veterano | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const vs = await db.getVeteranos();
      setVeteranos(vs);
      const hMap: {[key: string]: Historia[]} = {};
      for (const v of vs) { 
        hMap[v.id] = await db.getHistoriasByVeterano(v.id); 
      }
      setHistorias(hMap);
    };
    loadData();
  }, []);

  const filteredAndSortedVeterans = [...veteranos]
    .filter((v: Veterano) => {
      const matchesFilter = filter === 'Todos' || v.origem === filter;
      
      // Filtro por tipo de mídia no acervo do veterano
      const veteranStories = historias[v.id] || [];
      const matchesMedia = mediaFilter === 'Todas' || 
        veteranStories.some(h => h.tipo.toLowerCase() === mediaFilter.toLowerCase());

      const searchTerm = search.toLowerCase();
      const matchesBasic = v.nome.toLowerCase().includes(searchTerm) || 
                          (v.patente || '').toLowerCase().includes(searchTerm);
      
      return matchesFilter && matchesMedia && matchesBasic;
    })
    .sort((a: Veterano, b: Veterano) => {
      if (sortBy === 'nome-asc') return a.nome.localeCompare(b.nome);
      if (sortBy === 'nome-desc') return b.nome.localeCompare(a.nome);
      const dateA = a.data_ingresso ? new Date(a.data_ingresso).getTime() : 0;
      const dateB = b.data_ingresso ? new Date(b.data_ingresso).getTime() : 0;
      if (sortBy === 'date-desc') return dateB - dateA;
      if (sortBy === 'date-asc') return dateA - dateB;
      return 0;
    });

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
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
      source.onended = () => {
        setIsSpeaking(false);
        ctx.close();
      };
      source.start();
    } else { setIsSpeaking(false); }
  };

  const toggleAudio = (id: string) => {
    const audio = audioRefs.current[id];
    if (playingAudioId === id) { audio?.pause(); setPlayingAudioId(null); }
    else { audio?.play(); setPlayingAudioId(id); }
  };

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-indigo-950 serif-font mb-4">Galeria de Veteranos</h1>
        <p className="text-slate-600 max-w-2xl">Preservando os rostos e as vozes daqueles que serviram ao Território e ao Estado.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou patente..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Filtro de Instituição */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <Shield size={16} className="text-indigo-600" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none cursor-pointer">
              <option value="Todos">Todas Instituições</option>
              <option value="Guarda Territorial">Guarda Territorial</option>
              <option value="Polícia Militar">Polícia Militar</option>
            </select>
          </div>

          {/* NOVO: Filtro de Mídia */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <Filter size={16} className="text-amber-500" />
            <select value={mediaFilter} onChange={(e) => setMediaFilter(e.target.value)} className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none cursor-pointer">
              <option value="Todas">Todos Arquivos</option>
              <option value="Texto">Apenas Texto</option>
              <option value="Áudio">Apenas Áudio</option>
              <option value="Vídeo">Apenas Vídeo</option>
              <option value="Imagem">Apenas Imagem</option>
            </select>
          </div>

          {/* Ordenação */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <ArrowUpDown size={16} className="text-slate-400" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none cursor-pointer">
              <option value="nome-asc">Nome (A-Z)</option>
              <option value="nome-desc">Nome (Z-A)</option>
              <option value="date-desc">Recentes</option>
              <option value="date-asc">Antigos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAndSortedVeterans.map((v: Veterano) => (
          <div key={v.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-md hover:shadow-2xl transition-all border border-slate-100 flex flex-col relative">
            <div className="relative h-72 overflow-hidden">
              <img src={v.foto_url} alt={v.nome} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute top-6 right-6 bg-indigo-950/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{v.origem}</div>
              
              {/* Badges de mídia disponíveis */}
              <div className="absolute bottom-4 left-6 flex gap-1">
                {historias[v.id]?.some(h => h.tipo === 'vídeo') && <div className="p-1.5 bg-indigo-600/90 text-white rounded-lg backdrop-blur-sm shadow-lg"><Video size={14}/></div>}
                {historias[v.id]?.some(h => h.tipo === 'áudio') && <div className="p-1.5 bg-amber-500/90 text-white rounded-lg backdrop-blur-sm shadow-lg"><Mic size={14}/></div>}
                {historias[v.id]?.some(h => h.tipo === 'imagem') && <div className="p-1.5 bg-slate-100/90 text-slate-900 rounded-lg backdrop-blur-sm shadow-lg"><ImageIcon size={14}/></div>}
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <span className="text-amber-600 font-black text-[10px] uppercase tracking-[0.2em]">{v.patente}</span>
              <h3 className="text-2xl font-bold text-indigo-950 serif-font mb-4 leading-tight">{v.nome}</h3>
              <p className="text-slate-600 text-sm line-clamp-3 mb-6 italic">"{v.bio}"</p>
              <div className="mt-auto space-y-3">
                <button onClick={() => setSelectedVeteran(v)} className="w-full bg-indigo-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-800 transition-all flex items-center justify-center gap-2 group/btn">
                  Ver Acervo <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => handleSpeak(`${v.nome}. ${v.bio}`)} disabled={isSpeaking} className="w-full p-3 bg-slate-100 text-indigo-950 rounded-xl hover:bg-amber-500 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase">
                  <Volume2 size={16} className={isSpeaking ? 'animate-pulse' : ''}/> Narrativa IA
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredAndSortedVeterans.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
             <Filter size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-medium">Nenhum veterano encontrado com os filtros selecionados.</p>
             <button onClick={() => { setFilter('Todos'); setMediaFilter('Todas'); setSearch(''); }} className="mt-4 text-indigo-600 font-bold hover:underline">Limpar Filtros</button>
          </div>
        )}
      </div>

      {selectedVeteran && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/90 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl relative my-8 animate-in zoom-in duration-300">
            <button onClick={() => setSelectedVeteran(null)} className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-red-500 hover:text-white rounded-full z-20"><X size={24} /></button>
            <div className="flex flex-col lg:flex-row h-full">
              <div className="lg:w-2/5 min-h-[400px]">
                <img src={selectedVeteran.foto_url} alt={selectedVeteran.nome} className="w-full h-full object-cover" />
              </div>
              <div className="lg:w-3/5 p-8 lg:p-12 overflow-y-auto max-h-[90vh]">
                <div className="mb-12">
                  <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-6 border-b pb-2">Biografia Institucional</h4>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-6">
                    <Calendar size={14}/> {selectedVeteran.data_ingresso ? new Date(selectedVeteran.data_ingresso).getFullYear() : 'S/D'} • <Shield size={14}/> {selectedVeteran.origem}
                  </div>
                  <p className="text-slate-700 leading-relaxed text-lg serif-font italic">"{selectedVeteran.bio}"</p>
                </div>
                <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-6 border-b pb-2">Memórias e Registros ({historias[selectedVeteran.id]?.length || 0})</h4>
                <div className="space-y-6">
                  {(historias[selectedVeteran.id] || []).map(h => (
                    <div key={h.id} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                          {h.tipo === 'áudio' ? <Mic size={18}/> : h.tipo === 'vídeo' ? <Video size={18}/> : h.tipo === 'imagem' ? <ImageIcon size={18}/> : <FileText size={18}/>}
                        </div>
                        <h5 className="font-bold text-indigo-950">{h.titulo}</h5>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{h.descricao}</p>
                      {h.arquivo_url && h.tipo === 'imagem' && <img src={h.arquivo_url} className="w-full rounded-2xl shadow-sm"/>}
                      {h.arquivo_url && h.tipo === 'vídeo' && (
                        <div className="relative group/video">
                          <video 
                            src={h.arquivo_url} 
                            controls 
                            className="w-full rounded-2xl shadow-md border border-slate-200 bg-black aspect-video"
                            poster={`https://picsum.photos/seed/${h.id}/800/450?grayscale`}
                          />
                        </div>
                      )}
                      {h.arquivo_url && h.tipo === 'áudio' && (
                        <button onClick={() => toggleAudio(h.id)} className="flex items-center gap-3 bg-indigo-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-800 transition-colors">
                          {playingAudioId === h.id ? <Pause size={14}/> : <Play size={14}/>} Ouvir Relato
                          <audio ref={el => audioRefs.current[h.id] = el} src={h.arquivo_url} onEnded={() => setPlayingAudioId(null)} className="hidden"/>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
