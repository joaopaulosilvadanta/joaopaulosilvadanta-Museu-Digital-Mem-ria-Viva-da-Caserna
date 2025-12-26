
import React, { useState, useEffect } from 'react';
import { db } from '../services/databaseService';
import { Historia, Veterano, AppRoute } from '../types';
import { Star, Volume2, Share2, Calendar, MapPin, Quote, ArrowRight, History, ChevronRight, Play, Pause } from 'lucide-react';
import { speakMemory } from '../services/geminiService';
import { Link } from 'react-router-dom';

const MonthlyHistoryPage: React.FC = () => {
  const [featuredStory, setFeaturedStory] = useState<Historia | null>(null);
  const [veteran, setVeteran] = useState<Veterano | null>(null);
  const [pastStories, setPastStories] = useState<Historia[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      const story = await db.getHistoriaDoMes();
      if (story) {
        setFeaturedStory(story);
        if (story.veterano_id) {
          const vs = await db.getVeteranos();
          setVeteran(vs.find(v => v.id === story.veterano_id) || null);
        }
      }
      const past = await db.getAnterioresDestaque();
      setPastStories(past);
    };
    load();
  }, []);

  const handleSpeak = async () => {
    if (!featuredStory || isSpeaking) return;
    setIsSpeaking(true);
    const audioData = await speakMemory(featuredStory.descricao || '');
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
    } else {
      setIsSpeaking(false);
    }
  };

  const handleShare = () => {
    if (!featuredStory) return;
    const url = `${window.location.origin}${window.location.pathname}#${AppRoute.GALLERY}?veteran=${featuredStory.veterano_id}&story=${featuredStory.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!featuredStory) return <div className="p-20 text-center">Carregando destaque...</div>;

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-700">
      {/* Editorial Header */}
      <section className="relative h-[70vh] flex items-end">
        <div className="absolute inset-0">
          <img 
            src={veteran?.foto_url || 'https://picsum.photos/seed/history/1920/1080'} 
            alt="Destaque do Mês" 
            className="w-full h-full object-cover grayscale opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-12 w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-500 p-2 rounded-lg text-indigo-950 shadow-lg">
              <Star size={24} fill="currentColor" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.4em] text-indigo-950">História do Mês • Janeiro 2026</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-indigo-950 serif-font mb-6 leading-tight max-w-3xl">
            {featuredStory.titulo}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-amber-500" /> Publicado em {featuredStory.data}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-amber-500" /> {featuredStory.localizacao}
            </div>
            <div className="h-4 w-px bg-slate-300 hidden md:block"></div>
            <div className="text-indigo-900 font-bold uppercase tracking-widest text-[10px]">
              Relato de: {veteran?.patente} {veteran?.nome}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-2/3">
            <div className="flex gap-4 mb-10">
              <button 
                onClick={handleSpeak}
                disabled={isSpeaking}
                className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                  isSpeaking ? 'bg-amber-100 text-amber-700' : 'bg-indigo-900 text-white hover:bg-indigo-800 shadow-xl shadow-indigo-900/20'
                }`}
              >
                {isSpeaking ? <Pause size={20} /> : <Volume2 size={20} />}
                {isSpeaking ? 'Narrando História...' : 'Ouvir Relato Solene'}
              </button>
              <button 
                onClick={handleShare}
                className="px-6 py-4 bg-slate-100 text-indigo-900 rounded-2xl hover:bg-indigo-900 hover:text-white transition-all font-bold flex items-center gap-2"
              >
                {copied ? 'Copiado!' : <Share2 size={20} />}
              </button>
            </div>

            <div className="relative mb-12">
              <Quote className="absolute -top-6 -left-10 text-indigo-50 w-32 h-32 -z-10" />
              <div className="serif-font text-xl md:text-2xl text-slate-700 leading-relaxed first-letter:text-7xl first-letter:font-bold first-letter:text-indigo-950 first-letter:mr-3 first-letter:float-left drop-cap whitespace-pre-wrap">
                {featuredStory.descricao}
              </div>
            </div>

            <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 italic text-slate-500 serif-font">
              "A memória não é apenas o que lembramos, mas o que escolhemos não esquecer. Este relato faz parte do projeto de preservação da Seção de Engenharia e Memória Institucional da PMRR."
            </div>
          </div>

          <div className="lg:w-1/3 space-y-12">
            {/* Veteran Card */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-indigo-50 p-8 sticky top-24">
               <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-6">Personagem Central</h4>
               <div className="flex items-center gap-4 mb-6">
                 <img src={veteran?.foto_url} alt={veteran?.nome} className="w-20 h-20 rounded-2xl object-cover shadow-md" />
                 <div>
                   <p className="font-bold text-indigo-950 text-lg leading-tight">{veteran?.nome}</p>
                   <p className="text-xs text-slate-500">{veteran?.patente} • {veteran?.origem}</p>
                 </div>
               </div>
               <p className="text-sm text-slate-600 mb-8 italic leading-relaxed line-clamp-4">
                 "{veteran?.bio}"
               </p>
               <Link 
                to={`${AppRoute.GALLERY}?veteran=${veteran?.id}`}
                className="w-full py-4 border-2 border-indigo-900 text-indigo-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-900 hover:text-white transition-all group"
               >
                 Ver Acervo Completo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Archives of the Month */}
      <section className="py-20 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-indigo-950 serif-font">Destaques Anteriores</h2>
              <p className="text-slate-500">Explore as histórias que marcaram os meses passados.</p>
            </div>
            <Link to={AppRoute.GALLERY} className="text-indigo-600 font-bold flex items-center gap-2 hover:underline">
              Ver Toda a Galeria <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pastStories.map(story => (
              <Link 
                key={story.id} 
                to={`${AppRoute.GALLERY}?veteran=${story.veterano_id}&story=${story.id}`}
                className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                   <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
                     <History size={16} />
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{story.data}</span>
                </div>
                <h3 className="text-xl font-bold text-indigo-950 serif-font mb-3 group-hover:text-amber-600 transition-colors">{story.titulo}</h3>
                <p className="text-sm text-slate-500 line-clamp-3 mb-6 leading-relaxed italic">
                  "{story.descricao}"
                </p>
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-widest">
                  Explorar Relato <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MonthlyHistoryPage;
