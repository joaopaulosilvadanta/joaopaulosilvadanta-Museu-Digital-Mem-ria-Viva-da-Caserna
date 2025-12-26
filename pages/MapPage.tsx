
import React, { useState, useMemo } from 'react';
import { MOCK_VETERANOS } from '../constants';
import { MapPin, Info, ArrowRight, Navigation, Search, ZoomIn, ZoomOut, Layers } from 'lucide-react';

const MapPage: React.FC = () => {
  const [activePin, setActivePin] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPanning, setIsPanning] = useState(false);

  // Filtro de busca indexada por nome, patente ou bio
  const filteredPins = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return MOCK_VETERANOS.filter(v => 
      v.nome.toLowerCase().includes(term) || 
      v.patente?.toLowerCase().includes(term) || 
      v.bio?.toLowerCase().includes(term) ||
      v.origem.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(Math.max(prev + delta, 0.5), 2));
    // Simulação de feedback visual de carregamento/processamento ao zoom
    setIsPanning(true);
    setTimeout(() => setIsPanning(false), 400);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row animate-in fade-in duration-500 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-full md:w-96 bg-white border-r border-slate-200 overflow-y-auto p-6 order-2 md:order-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-indigo-950 serif-font mb-2">Mapa da Memória</h1>
          <p className="text-sm text-slate-500 mb-6">Navegue pelos locais onde a história de nossos veteranos foi escrita.</p>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar local ou veterano..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex-grow space-y-4">
          <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 px-1">
            <span>Resultados: {filteredPins.length}</span>
            <Layers size={14} />
          </div>
          
          {filteredPins.length > 0 ? (
            filteredPins.map(v => (
              <button
                key={v.id}
                onClick={() => setActivePin(v.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all border group ${
                  activePin === v.id 
                    ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-200' 
                    : 'bg-white border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl transition-colors ${activePin === v.id ? 'bg-indigo-900 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                    <MapPin size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-indigo-950 text-sm truncate">{v.nome}</p>
                    <p className="text-xs text-slate-500 truncate">{v.patente} • {v.origem}</p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <Search className="mx-auto text-slate-300 mb-3" size={32} />
              <p className="text-sm text-slate-400">Nenhum ponto encontrado para sua busca.</p>
            </div>
          )}
        </div>

        <div className="mt-8 p-6 bg-indigo-950 rounded-3xl text-white shadow-xl">
            <Navigation className="text-amber-400 mb-4 animate-pulse" />
            <h3 className="font-bold mb-2 text-sm">Georreferenciamento Afetivo</h3>
            <p className="text-[11px] text-indigo-200 leading-relaxed">
                As coordenadas destacam postos avançados da Guarda Territorial e marcos operacionais preservados na memória.
            </p>
        </div>
      </div>

      {/* Main Map Area (Mock) */}
      <div className="flex-grow bg-indigo-50 relative overflow-hidden order-1 md:order-2 flex items-center justify-center">
        {/* Background Map Simulation */}
        <div 
          className="absolute inset-0 z-0 transition-transform duration-700 ease-out"
          style={{ 
            transform: `scale(${zoomLevel})`,
            opacity: isPanning ? 0.6 : 1
          }}
        >
          <img 
            src="https://picsum.photos/seed/roraima-topography/1920/1080?blur=5" 
            alt="Fundo do Mapa" 
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          {/* Map Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#4338ca 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        </div>

        {/* Feedback de Pan/Zoom */}
        {isPanning && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-indigo-900/5 backdrop-blur-[1px]">
             <div className="bg-white/90 px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in zoom-in">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900">Atualizando coordenadas...</span>
             </div>
          </div>
        )}

        {/* Map UI Elements */}
        <div className="absolute top-6 left-6 z-10 flex gap-2">
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-lg border border-white/50 flex items-center gap-4">
              <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter">Pontos Ativos</span>
              </div>
              <div className="h-4 w-px bg-slate-200"></div>
              <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter">Memórias</span>
              </div>
          </div>
          <div className="bg-indigo-900/90 backdrop-blur text-white px-4 py-2 rounded-2xl shadow-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Layers size={14} /> Vista: {zoomLevel.toFixed(1)}x
          </div>
        </div>

        {/* Mock Pins Container */}
        <div 
          className="absolute inset-0 transition-all duration-700 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {filteredPins.map((v, idx) => {
            // Posicionamento determinístico para o mock
            const top = 25 + (idx * 15) % 60;
            const left = 20 + (idx * 22) % 65;
            
            return (
              <div 
                key={v.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500"
                style={{ 
                  top: `${top}%`, 
                  left: `${left}%`,
                  zIndex: activePin === v.id ? 30 : 20,
                  opacity: isPanning ? 0 : 1
                }}
                onClick={() => {
                  setActivePin(v.id);
                  // Feedback visual ao clicar
                  setIsPanning(true);
                  setTimeout(() => setIsPanning(false), 200);
                }}
              >
                <div className="relative group">
                  <div className={`p-2.5 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${
                    activePin === v.id 
                      ? 'bg-amber-500 ring-4 ring-amber-200 scale-125' 
                      : 'bg-white hover:bg-indigo-600 hover:text-white hover:scale-110'
                  }`}>
                    <MapPin size={24} className={activePin === v.id ? 'text-indigo-950' : 'text-indigo-600 group-hover:text-white'} />
                  </div>

                  {/* Tooltip Card - Customizado para o Mapa */}
                  {activePin === v.id && (
                    <div className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 w-64 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden border border-indigo-100 animate-in zoom-in slide-in-from-bottom-6 z-50">
                      <div className="relative h-28">
                        <img src={v.foto_url} alt={v.nome} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 to-transparent"></div>
                        <span className="absolute bottom-3 left-4 text-[9px] text-amber-400 font-black uppercase tracking-widest">{v.patente}</span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-indigo-950 mb-1 text-sm">{v.nome}</h3>
                        <p className="text-[10px] text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                          {v.bio}
                        </p>
                        <button className="w-full bg-indigo-900 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-800 transition-colors">
                          Ver História <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Map Controls */}
        <div className="absolute bottom-8 right-8 z-10 flex flex-col gap-3">
            <button 
              onClick={() => handleZoom(0.2)}
              className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-slate-100 text-indigo-900 hover:bg-indigo-900 hover:text-white transition-all active:scale-90"
              title="Aumentar Zoom"
            >
              <ZoomIn size={24} />
            </button>
            <button 
              onClick={() => handleZoom(-0.2)}
              className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-slate-100 text-indigo-900 hover:bg-indigo-900 hover:text-white transition-all active:scale-90"
              title="Diminuir Zoom"
            >
              <ZoomOut size={24} />
            </button>
        </div>

        {/* Coords Status Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-indigo-950/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 shadow-2xl flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[8px] text-indigo-400 font-black uppercase tracking-widest">Longitude</span>
              <span className="text-[10px] text-white font-mono">-60.67{zoomLevel.toFixed(2)}</span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-[8px] text-indigo-400 font-black uppercase tracking-widest">Latitude</span>
              <span className="text-[10px] text-white font-mono">2.82{zoomLevel.toFixed(2)}</span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="text-[9px] text-amber-400 font-black uppercase">
              {filteredPins.length} pontos na área
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
