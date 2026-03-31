
export type TipoFonte = 
  | 'fonte_primaria' 
  | 'fonte_secundaria' 
  | 'normativa' 
  | 'oral' 
  | 'institucional' 
  | 'hemerografica';

export type StatusValidacao = 
  | 'confirmada' 
  | 'parcial' 
  | 'em_validacao' 
  | 'inconsistente';

export type StatusConteudo = 'mockado' | 'em_validacao' | 'real_publicado';

export interface FonteMuseologica {
  id: string;
  tipo: TipoFonte;
  referencia: string;
  autoria?: string;
  data?: string;
  url?: string;
  observacoes?: string;
  status_validacao: StatusValidacao;
}

export interface MetadadosCuradoria {
  codigo_patrimonial?: string;
  data_curadoria: string;
  curador_responsavel_id: string;
  fontes: FonteMuseologica[];
  metodo_validacao: string;
  status_geral: StatusValidacao;
}

export interface DireitosPropriedade {
  autorizado_publicacao: boolean;
  detentor_original?: string;
  tipo_licenca: 'CC-BY-NC-ND' | 'DOMINIO_PUBLICO' | 'COPYRIGHT_SENG' | 'RESTRITO';
  credito_obrigatorio: string;
  termo_doacao_url?: string;
  observacao_juridica?: string;
}

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
  registro_funcional?: string;
  origem: 'Guarda Territorial' | 'Polícia Militar';
  bio?: string;
  foto_url?: string;
  data_ingresso?: string;
  medalhas?: string[];
  created_at?: string;
  status_conteudo?: StatusConteudo;

  autorizado_publicacao?: boolean;
  credito_institucional?: string;
  origem_midia?: string;
  licenca_uso?: string;
  fontes?: FonteMuseologica[];

  curadoria?: MetadadosCuradoria;
  direitos?: DireitosPropriedade;
}

export interface Viatura {
  id: string;
  modelo: string;
  ano: number;
  prefixo?: string;
  placa_original?: string;
  tipo: 'Patrulhamento' | 'Especial' | 'Histórico' | 'Logística';
  descricao: string;
  foto_url: string;
  status: 'Ativa' | 'Preservada' | 'Acervo';
  status_conteudo?: StatusConteudo;

  autorizado_publicacao?: boolean;
  credito_institucional?: string;
  origem_midia?: string;
  licenca_uso?: string;
  fontes?: FonteMuseologica[];

  curadoria?: MetadadosCuradoria;
  direitos?: DireitosPropriedade;
}

export interface Armamento {
  id: string;
  nome: string;
  calibre: string;
  numero_serie?: string;
  tipo: 'Pistola' | 'Fuzil' | 'Metralhadora' | 'Revólver' | 'Especial';
  fabricante: string;
  descricao: string;
  foto_url: string;
  status: 'Histórico' | 'Acervo' | 'Moderno';
  status_conteudo?: StatusConteudo;

  autorizado_publicacao?: boolean;
  credito_institucional?: string;
  origem_midia?: string;
  licenca_uso?: string;
  fontes?: FonteMuseologica[];

  curadoria?: MetadadosCuradoria;
  direitos?: DireitosPropriedade;
}

export interface Historia {
  id: string;
  veterano_id: string | null;
  nome_veterano?: string;
  titulo: string;
  subtitulo?: string;
  descricao?: string;
  conteudo_editorial?: string;
  tipo: 'texto' | 'áudio' | 'vídeo' | 'imagem';
  arquivo_url?: string;
  localizacao?: string;
  data?: string;
  aprovado: boolean;
  autorizado_publicacao: boolean;
  credito_institucional?: string;
  licenca_uso?: string;
  restricao_uso?: string;
  observacao_juridica?: string;
  fontes?: FonteMuseologica[];
  user_id?: string;
  created_at?: string;
  status_conteudo?: StatusConteudo;
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
  status_conteudo?: StatusConteudo;
}

export interface UnidadePMRR {
  id: string;
  nome: string;
  sigla: string;
  bloco_hierarquico: string;
  subgrupo_navegacao: string;
  nivel_organizacional?: string;
  titulo_exibicao: string;
  resumo_card: string;
  descricao_institucional: string;
  texto_historico: string;
  atribuicoes_gerais: string;
  relevancia_institucional: string;
  relacao_memoria: string;
  palavras_chave: string[];
  slug_url: string;
  ordem_exibicao: number;
  unidade_relacionada_id?: string;
  status_texto: 'Pronto para publicação' | 'Necessita validação';
  foto_url?: string;
  marcos_historicos?: string[];
  status_conteudo?: StatusConteudo;
  
  autorizado_publicacao?: boolean;
  credito_institucional?: string;
  origem_midia?: string;
  licenca_uso?: string;
  fontes?: FonteMuseologica[];

  curadoria?: MetadadosCuradoria;
  direitos?: DireitosPropriedade;
}

/**
 * Ficha museológica e documental completa para registro de unidades da PMRR.
 * Projetada para preservação da memória institucional e expansão do acervo.
 */
export interface UnidadePMRRFicha {
  id: string;
  codigo_registro: string; // Código museológico (ex: PMRR-UNI-001)
  nome: string;
  sigla: string;
  titulo_exibicao: string;
  slug_url: string;

  // Estrutura e Hierarquia
  bloco_hierarquico: string;
  subgrupo_navegacao: string;
  tipo_unidade: string; // Batalhão, Companhia, Seção, etc.
  nivel_organizacional: string; // Direção, Execução, etc.
  vinculacao_superior?: string;
  unidades_subordinadas?: string[];
  colecao?: string;

  // Conteúdo Narrativo
  resumo_card: string;
  descricao_institucional: string;
  texto_historico: string;
  atribuicoes_gerais: string;
  relevancia_institucional: string;
  relacao_memoria: string;

  // Histórico e Validação
  periodo_referencia?: string;
  marcos_historicos?: string[];
  observacoes_historicas?: string;
  status_validacao_historica: 'confirmada' | 'parcial' | 'em_validacao';

  // Localização
  sede?: string;
  municipio?: string;
  area_atuacao?: string;
  abrangencia?: string;

  // Taxonomia
  palavras_chave: string[];
  temas_relacionados?: string[];
  unidades_relacionadas?: string[];

  // Pesquisa e Documentação
  fontes?: FonteMuseologica[];
  referencias_normativas?: string[];
  documentos_relacionados?: string[];

  // Gestão da Ficha
  status_texto: 'Pronto para publicação' | 'Necessita validação';
  autor_ficha?: string;
  revisor_historico?: string;
  data_criacao_registro?: string;
  data_ultima_revisao?: string;
  observacoes_internas?: string;
  status_conteudo?: StatusConteudo;

  // Direitos e Uso
  curadoria?: MetadadosCuradoria;
  direitos?: DireitosPropriedade;
  autorizado_publicacao?: boolean;
  credito_institucional?: string;
  licenca_uso?: string;
  restricao_uso?: string;
  observacao_juridica?: string;

  // Mídia e Anexos
  foto_url?: string;
  galeria_urls?: string[];
  anexos?: string[];
}

export interface Colecao {
  id: string;
  nome: string;
  titulo_exibicao: string;
  resumo_card: string;
  descricao: string;
  objetivo: string;
  tipos_itens: string[];
  relacao_memoria: string;
  palavras_chave: string[];
  slug_url: string;
  ordem_exibicao: number;
  foto_url?: string;
  icon?: string; // Mantendo para compatibilidade visual com Lucide
  categoria?: 'Operacional' | 'Administrativa' | 'Cultural' | 'Humana'; // Mantendo para filtros
  item_count?: number; // Mantendo para exibição de estatísticas
  
  fontes?: FonteMuseologica[];
  autorizado_publicacao?: boolean;
  credito_institucional?: string;
  licenca_uso?: string;
  restricao_uso?: string;
  observacao_juridica?: string;
  status_conteudo?: StatusConteudo;
}

export interface DireitosUso {
  autorizado_publicacao: boolean;
  credito?: string;
  origem_midia?: string;
  licenca_uso?: string;
  dominio_publico?: boolean;
  restricao_uso?: string;
  termo_autorizacao?: string;
  observacao_juridica?: string;
}

export enum AppRoute {
  HOME = '/',
  UNITS = '/unidades',
  UNIT_DETAIL = '/unidades/:id',
  GALLERY = '/gallery',
  MONTHLY = '/monthly-story',
  VEHICLES = '/vehicles',
  WEAPONS = '/weapons',
  TIMELINE = '/timeline',
  MAP = '/map',
  SUBMIT = '/submit',
  ADMIN = '/admin',
  LOGIN = '/login',
  ANALYSIS = '/analysis',
  COLLECTIONS = '/colecoes',
  NORMAS = '/normas'
}

export interface SearchFilters {
  query?: string;
  bloco_hierarquico?: string;
  subgrupo_navegacao?: string;
  origem?: string;
  tipo?: string;
  categoria?: string;
  status?: string;
  ano?: number | string;
  fabricante?: string;
  calibre?: string;
  colecao?: string;
}
