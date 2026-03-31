import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchFilterBarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  availableFilters: (keyof SearchFilters)[];
  filterOptions?: {
    [key: string]: string[] | number[];
  };
  placeholder?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filters,
  onFilterChange,
  availableFilters,
  filterOptions = {},
  placeholder = "Pesquisar no acervo..."
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, query: e.target.value });
  };

  const handleSelectChange = (key: keyof SearchFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value || undefined });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
            value={filters.query || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Filter Selects */}
        <div className="flex flex-wrap gap-2">
          {availableFilters.map((filterKey) => {
            if (filterKey === 'query') return null;
            const options = filterOptions[filterKey];
            if (!options) return null;

            return (
              <select
                key={filterKey}
                className="px-4 py-3 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-900 text-sm font-medium text-slate-700 cursor-pointer hover:border-slate-400 transition-all"
                value={filters[filterKey] || ''}
                onChange={(e) => handleSelectChange(filterKey, e.target.value)}
              >
                <option value="">{getFilterLabel(filterKey)}</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            );
          })}
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
              Limpar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function getFilterLabel(key: keyof SearchFilters): string {
  switch (key) {
    case 'bloco_hierarquico': return 'Bloco Hierárquico';
    case 'subgrupo_navegacao': return 'Subgrupo';
    case 'origem': return 'Origem';
    case 'tipo': return 'Tipo';
    case 'status': return 'Status';
    case 'ano': return 'Ano';
    case 'fabricante': return 'Fabricante';
    case 'calibre': return 'Calibre';
    case 'colecao': return 'Coleção';
    default: return key;
  }
}
