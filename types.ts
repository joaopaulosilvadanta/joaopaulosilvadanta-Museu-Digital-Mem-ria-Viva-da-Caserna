
export interface Profile {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'curador' | 'colaborador' | 'visitante';
  avatar_url?: string;
  bio?: string;
  created_at?: string;
}

export interface Veterano {
  id: string;
  nome: string;
  patente?: string;
  origem: 'Guarda Territorial' | 'Polícia Militar';
  bio?: string;
  foto_url?: string;
  data_ingresso?: string;
  created_at?: string;
}

export interface Viatura {
  id: string;
  modelo: string;
  ano: number;
  tipo: 'Patrulhamento' | 'Especial' | 'Histórico' | 'Logística';
  descricao: string;
  foto_url: string;
  status: 'Ativa' | 'Preservada' | 'Acervo';
}

export interface Armamento {
  id: string;
  nome: string;
  calibre: string;
  tipo: 'Pistola' | 'Fuzil' | 'Metralhadora' | 'Revólver' | 'Especial';
  fabricante: string;
  descricao: string;
  foto_url: string;
  status: 'Histórico' | 'Acervo' | 'Moderno';
}

export interface Historia {
  id: string;
  veterano_id: string | null;
  nome_veterano?: string;
  titulo: string;
  descricao?: string;
  tipo: 'texto' | 'áudio' | 'vídeo' | 'imagem';
  arquivo_url?: string;
  localizacao?: string;
  data?: string;
  aprovado: boolean;
  autorizado_publicacao: boolean; // Novo campo para conformidade jurídica
  user_id?: string;
  created_at?: string;
}

export interface Contribuicao {
  id: string;
  nome?: string;
  email?: string;
  relato?: string;
  arquivo_url?: string;
  aprovado: boolean;
  data_envio?: string;
}

export interface LinhaDoTempo {
  id: string;
  ano: number;
  titulo?: string;
  descricao?: string;
  historia_id?: string;
}

export enum AppRoute {
  HOME = '/',
  GALLERY = '/gallery',
  MONTHLY = '/monthly-story',
  VEHICLES = '/vehicles',
  WEAPONS = '/weapons',
  TIMELINE = '/timeline',
  MAP = '/map',
  SUBMIT = '/submit',
  ADMIN = '/admin',
  LOGIN = '/login',
  ANALYSIS = '/analysis'
}
