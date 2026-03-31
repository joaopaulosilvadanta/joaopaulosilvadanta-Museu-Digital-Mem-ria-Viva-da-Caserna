import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Library, 
  Search, 
  Filter, 
  Building2, 
  Users, 
  History, 
  Calendar, 
  Truck, 
  Sword, 
  Music, 
  HeartPulse, 
  GraduationCap, 
  FileText,
  ArrowRight,
  Info,
  Tag
} from 'lucide-react';
import { MOCK_COLECOES } from '../constants';
import { Colecao, SearchFilters } from '../types';
import { SearchFilterBar } from '../components/SearchFilterBar';

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  History: <History className="w-6 h-6" />,
  Calendar: <Calendar className="w-6 h-6" />,
  Truck: <Truck className="w-6 h-6" />,
  Sword: <Sword className="w-6 h-6" />,
  Music: <Music className="w-6 h-6" />,
  HeartPulse: <HeartPulse className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
};

const CollectionsPage: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({});

  const filteredColecoes = useMemo(() => {
    return MOCK_COLECOES
      .filter(c => {
        const searchTerm = (filters.query || '').toLowerCase();
        const matchesSearch = !searchTerm || 
                             c.titulo_exibicao.toLowerCase().includes(searchTerm) || 
                             c.descricao.toLowerCase().includes(searchTerm) ||
                             c.palavras_chave.some(p => p.toLowerCase().includes(searchTerm));
        
        const matchesCategory = !filters.categoria || c.categoria === filters.categoria;
        
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => a.ordem_exibicao - b.ordem_exibicao);
  }, [filters]);

  const priorityColecoes = filteredColecoes.slice(0, 3);
  const otherColecoes = filteredColecoes.slice(3);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/military-museum/1920/1080?grayscale&blur=3" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-8">
              <Library className="w-3 h-3" /> Acervo Institucional
            </div>
            <h1 className="text-6xl md:text-7xl font-serif font-bold mb-8 tracking-tight leading-tight">
              Coleções do <span className="text-amber-500">Museu Digital</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto">
              Explore os núcleos temáticos que narram a trajetória, os valores e a identidade da Polícia Militar de Roraima.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="sticky top-16 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <SearchFilterBar 
            filters={filters}
            onFilterChange={setFilters}
            availableFilters={['query', 'categoria']}
            filterOptions={{
              categoria: ['Operacional', 'Administrativa', 'Cultural', 'Humana']
            }}
            placeholder="Pesquisar no acervo..."
            dark
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-20">
        {/* Priority Collections */}
        {!filters.categoria && !filters.query && priorityColecoes.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center gap-3 mb-12">
              <div className="h-px flex-grow bg-gradient-to-r from-transparent to-white/10" />
              <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-gray-500 whitespace-nowrap">Coleções em Destaque</h2>
              <div className="h-px flex-grow bg-gradient-to-l from-transparent to-white/10" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {priorityColecoes.map((colecao, index) => (
                <CollectionCard key={colecao.id} colecao={colecao} index={index} priority />
              ))}
            </div>
          </section>
        )}

        {/* All Collections */}
        <section>
          {(filters.categoria || filters.query) && (
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold">Resultados da Busca</h2>
              <p className="text-gray-500 text-sm mt-2">Exibindo {filteredColecoes.length} coleções encontradas.</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(!filters.categoria && !filters.query ? otherColecoes : filteredColecoes).map((colecao, index) => (
              <CollectionCard key={colecao.id} colecao={colecao} index={index} />
            ))}
          </div>
        </section>

        {filteredColecoes.length === 0 && (
          <div className="text-center py-32 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
            <Library className="w-16 h-16 text-gray-800 mx-auto mb-6 opacity-20" />
            <h3 className="text-2xl font-serif font-bold text-gray-400">Nenhum núcleo encontrado</h3>
            <p className="text-gray-600 mt-2 max-w-md mx-auto">Tente ajustar seus termos de busca ou selecione outra categoria temática.</p>
            <button 
              onClick={() => { setFilters({}); }}
              className="mt-8 text-amber-500 font-bold uppercase tracking-widest text-[10px] hover:text-amber-400 transition-colors"
            >
              Resetar Filtros
            </button>
          </div>
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="bg-[#050505] border-t border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <Library className="w-8 h-8 text-amber-500" />
                <h3 className="text-2xl font-serif font-bold tracking-tight">Curadoria de Memória</h3>
              </div>
              <p className="text-gray-500 leading-relaxed max-w-xl">
                O Museu Digital Memória Viva da Caserna utiliza critérios museológicos rigorosos para a organização de seu acervo. 
                Cada coleção é fruto de pesquisa histórica e documental, visando a preservação da identidade da Polícia Militar de Roraima.
              </p>
            </div>
            
            <div>
              <h4 className="text-amber-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-8">Diretrizes</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-amber-500/50 mt-0.5" />
                  <span>Acesso público e gratuito para fins educacionais e de pesquisa.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-amber-500/50 mt-0.5" />
                  <span>Atualização contínua conforme novos registros são digitalizados.</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-amber-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-8">Contato</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Seção de Engenharia e Memória Institucional<br />
                PMRR - Comando Geral<br />
                Boa Vista, Roraima
              </p>
            </div>
          </div>
          
          <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">© 2026 Museu Digital Memória Viva da Caserna</p>
            <div className="flex gap-8">
              <a href="#" className="text-[10px] text-gray-600 uppercase tracking-widest hover:text-amber-500 transition-colors">Termos de Uso</a>
              <a href="#" className="text-[10px] text-gray-600 uppercase tracking-widest hover:text-amber-500 transition-colors">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const CollectionCard: React.FC<{ colecao: Colecao, index: number, priority?: boolean }> = ({ colecao, index, priority }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative flex flex-col bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-700 ${
        priority ? 'lg:scale-105 lg:z-10 shadow-2xl shadow-black' : ''
      }`}
    >
      {/* Image Header */}
      <div className={`relative overflow-hidden ${priority ? 'h-64' : 'h-48'}`}>
        <img 
          src={colecao.foto_url} 
          alt={colecao.titulo_exibicao}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-40 group-hover:opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-amber-500">
            {colecao.icon && iconMap[colecao.icon]}
          </div>
          {colecao.categoria && (
            <div className="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 px-3 py-2 rounded-lg flex items-center">
              <span className="text-[9px] uppercase tracking-widest text-amber-500 font-bold">
                {colecao.categoria}
              </span>
            </div>
          )}
        </div>

        {colecao.item_count && (
          <div className="absolute bottom-4 right-4 text-right">
            <span className="block text-[8px] uppercase tracking-tighter text-gray-500 font-bold">Documentos</span>
            <span className="text-xl font-mono font-bold text-white/80">{colecao.item_count}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8 flex-grow flex flex-col">
        <h3 className="text-2xl font-serif font-bold mb-4 group-hover:text-amber-500 transition-colors leading-tight">
          {colecao.titulo_exibicao}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3 font-light">
          {colecao.resumo_card}
        </p>
        
        <div className="mt-auto space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {colecao.palavras_chave.slice(0, 3).map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 text-[9px] text-gray-600 uppercase tracking-tighter">
                <Tag className="w-2 h-2" /> {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Acervo Aberto
            </div>
            
            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500 group-hover:gap-4 transition-all">
              Explorar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hover Overlay Detail */}
      <div className="absolute top-0 right-0 w-1 h-0 bg-amber-500 group-hover:h-full transition-all duration-700" />
    </motion.div>
  );
};

export default CollectionsPage;
