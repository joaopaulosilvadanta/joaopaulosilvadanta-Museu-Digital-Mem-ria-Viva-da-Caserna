
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Search, ChevronRight, Building2, History as HistoryIcon } from 'lucide-react';
import { db } from '../services/databaseService';
import { UnidadePMRR, AppRoute, SearchFilters } from '../types';
import { SearchFilterBar } from '../components/SearchFilterBar';

const UnitsPage: React.FC = () => {
  const [unidades, setUnidades] = useState<UnidadePMRR[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});

  useEffect(() => {
    const fetchUnidades = async () => {
      const data = await db.getUnidades();
      setUnidades(data);
    };
    fetchUnidades();
  }, []);

  const filteredUnidades = useMemo(() => {
    return unidades.filter(u => {
      const matchesSearch = !filters.query || 
        u.nome.toLowerCase().includes(filters.query.toLowerCase()) || 
        u.sigla.toLowerCase().includes(filters.query.toLowerCase());
      
      const matchesBloco = !filters.bloco_hierarquico || u.bloco_hierarquico === filters.bloco_hierarquico;
      const matchesSubgrupo = !filters.subgrupo_navegacao || u.subgrupo_navegacao === filters.subgrupo_navegacao;
      
      return matchesSearch && matchesBloco && matchesSubgrupo;
    });
  }, [unidades, filters]);

  const blocos = Array.from(new Set(unidades.map(u => u.bloco_hierarquico))).filter(Boolean);
  const subgrupos = Array.from(new Set(unidades.map(u => u.subgrupo_navegacao))).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-indigo-950 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-amber-500 p-3 rounded-xl text-indigo-950">
              <Building2 size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Unidades Institucionais</h1>
              <p className="text-indigo-300 font-medium">Conheça a estrutura e a história das unidades da PMRR</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter */}
        <SearchFilterBar 
          filters={filters}
          onFilterChange={setFilters}
          availableFilters={['query', 'bloco_hierarquico', 'subgrupo_navegacao']}
          filterOptions={{
            bloco_hierarquico: blocos,
            subgrupo_navegacao: subgrupos
          }}
          placeholder="Buscar por nome ou sigla..."
        />

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUnidades.map((unidade) => (
            <Link 
              key={unidade.id} 
              to={AppRoute.UNIT_DETAIL.replace(':id', unidade.id)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={unidade.foto_url || 'https://picsum.photos/seed/pmrr/800/600'} 
                  alt={unidade.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                    unidade.nivel_organizacional === 'Estratégico' ? 'bg-amber-500 text-indigo-950' :
                    unidade.nivel_organizacional === 'Operacional' ? 'bg-indigo-600 text-white' :
                    'bg-slate-700 text-white'
                  }`}>
                    {unidade.nivel_organizacional}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                    {unidade.nome}
                  </h3>
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold ml-2">
                    {unidade.sigla}
                  </span>
                </div>
                <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow">
                  {unidade.texto_historico}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400">
                    <HistoryIcon size={14} />
                    <span className="text-[10px] uppercase font-bold tracking-tighter">Memória Viva</span>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-600 font-bold text-sm">
                    Ver detalhes <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredUnidades.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Nenhuma unidade encontrada</h3>
            <p className="text-slate-500">Tente ajustar seus termos de busca ou filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitsPage;
