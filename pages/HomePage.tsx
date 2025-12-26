
import React from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from '../types';
import { PlayCircle, Users, Map as MapIcon, History, ArrowRight, Quote } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/police-history/1920/1080?grayscale" 
            alt="História da Caserna" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="text-amber-400 uppercase tracking-[0.3em] font-bold text-sm mb-4 block">Memória Viva da Caserna</span>
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 serif-font leading-tight">
            Cada uniforme guarda <br className="hidden md:block"/> uma história de honra.
          </h1>
          <p className="text-lg md:text-xl text-indigo-100/90 mb-10 max-w-2xl mx-auto font-light">
            O Museu Digital da Memória Viva da Caserna é um espaço dedicado aos veteranos militares e da antiga Guarda Territorial.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to={AppRoute.GALLERY} 
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-indigo-950 font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-105"
            >
              Conhecer Veteranos <ArrowRight size={20}/>
            </Link>
            <Link 
              to={AppRoute.SUBMIT} 
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all backdrop-blur-sm border border-white/30 flex items-center justify-center gap-2"
            >
              Contar sua História
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-950 mb-4 serif-font">Explore o Museu Digital</h2>
          <div className="h-1 w-20 bg-amber-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Users className="text-amber-500"/>}
            title="Galeria de Honra"
            desc="Perfis detalhados dos homens e mulheres que construíram a segurança institucional."
            link={AppRoute.GALLERY}
          />
          <FeatureCard 
            icon={<History className="text-amber-500"/>}
            title="Linha do Tempo"
            desc="Dos primeiros passos da Guarda Territorial aos desafios modernos das forças militares."
            link={AppRoute.TIMELINE}
          />
          <FeatureCard 
            icon={<MapIcon className="text-amber-500"/>}
            title="Mapa de Atuação"
            desc="Onde a história aconteceu. Navegue pelos pontos históricos de policiamento."
            link={AppRoute.MAP}
          />
        </div>
      </section>

      {/* Testimonial Highlight */}
      <section className="bg-indigo-950 py-20 px-4 text-white overflow-hidden relative">
        <Quote className="absolute top-10 left-10 text-white/5 w-64 h-64" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-2xl md:text-3xl italic serif-font mb-8 leading-relaxed">
            "Não éramos apenas policiais; éramos os olhos do estado no meio da selva. Cada quilômetro percorrido era uma promessa cumprida."
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500">
                <img src="https://picsum.photos/seed/v1/100/100" alt="Sgt. Sebastião" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">Sgt. Sebastião da Silva</p>
              <p className="text-amber-400 text-sm">Reserva da Guarda Territorial</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, link }: { icon: React.ReactNode, title: string, desc: string, link: string }) => (
  <Link to={link} className="group bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:border-amber-200 transition-all hover:shadow-2xl">
    <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-50 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-indigo-950 mb-3 serif-font">{title}</h3>
    <p className="text-slate-600 leading-relaxed mb-6">{desc}</p>
    <div className="text-amber-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
      Explorar <ArrowRight size={16}/>
    </div>
  </Link>
);

export default HomePage;