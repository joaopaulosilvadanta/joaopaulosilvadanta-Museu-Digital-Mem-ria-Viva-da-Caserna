
import { Veterano, LinhaDoTempo, Historia, Contribuicao, Viatura, Armamento } from './types';

export const APP_TITLE = "Museu Digital da Memória Viva da Caserna";
export const DEVELOPER_SIG = "Desenvolvido por João Paulo Silva Dantas";

export const MOCK_VETERANOS: Veterano[] = [
  { id: 'v1', nome: 'Cap QOC João Paulo Silva Dantas', patente: 'Capitão', origem: 'Polícia Militar', bio: 'Oficial fundador e historiador militar.', foto_url: 'https://picsum.photos/seed/jp/400/400', data_ingresso: '2002-05-10' },
  { id: 'v2', nome: 'Sgt. Antônio Mendes', patente: 'Sargento', origem: 'Guarda Territorial', bio: 'Atuou no policiamento de fronteira nos anos 70.', foto_url: 'https://picsum.photos/seed/am/400/400', data_ingresso: '1972-03-01' },
  { id: 'v3', nome: 'Cb. Rosa Maria Silva', patente: 'Cabo', origem: 'Polícia Militar', bio: 'Primeira mulher a atuar no policiamento urbano da região.', foto_url: 'https://picsum.photos/seed/rm/400/400', data_ingresso: '1990-11-20' },
  { id: 'v4', nome: 'Ten. José Martins', patente: 'Tenente', origem: 'Guarda Territorial', bio: 'Veterano da formação da 1ª Companhia.', foto_url: 'https://picsum.photos/seed/jm/400/400', data_ingresso: '1969-07-15' },
  { id: 'v5', nome: 'Sd. Carlos Ferreira', patente: 'Soldado', origem: 'Polícia Militar', bio: 'Responsável pelo projeto social Patrulha da Paz.', foto_url: 'https://picsum.photos/seed/cf/400/400', data_ingresso: '2005-09-05' }
];

export const MOCK_VIATURAS: Viatura[] = [
  { id: 'vt1', modelo: 'Ford Rural Willys', ano: 1974, tipo: 'Histórico', status: 'Preservada', foto_url: 'https://picsum.photos/seed/rural/600/400', descricao: 'Viatura emblemática da Guarda Territorial utilizada em patrulhamentos rurais e missões de fronteira.' },
  { id: 'vt2', modelo: 'Chevrolet Veraneio', ano: 1982, tipo: 'Histórico', status: 'Preservada', foto_url: 'https://picsum.photos/seed/veraneio/600/400', descricao: 'Clássica viatura de policiamento ostensivo e transporte de guarnição da década de 80.' },
  { id: 'vt3', modelo: 'Volkswagen Fusca 1300', ano: 1978, tipo: 'Patrulhamento', status: 'Acervo', foto_url: 'https://picsum.photos/seed/fusca/600/400', descricao: 'Utilizado no policiamento urbano de Boa Vista, símbolo de agilidade nas ruas estreitas da época.' },
  { id: 'vt4', modelo: 'Toyota Hilux 4x4', ano: 2022, tipo: 'Especial', status: 'Ativa', foto_url: 'https://picsum.photos/seed/hilux/600/400', descricao: 'Viatura moderna equipada para operações de choque e patrulhamento em terrenos de difícil acesso.' },
  { id: 'vt5', modelo: 'Jeep Wrangler', ano: 1965, tipo: 'Histórico', status: 'Preservada', foto_url: 'https://picsum.photos/seed/jeep/600/400', descricao: 'Veículo de comando utilizado nos primeiros anos de estruturação da segurança territorial.' }
];

export const MOCK_ARMAMENTOS: Armamento[] = [
  { id: 'ar1', nome: 'Fuzil FN FAL', calibre: '7.62x51mm', tipo: 'Fuzil', fabricante: 'FN Herstal / IMBEL', status: 'Histórico', foto_url: 'https://picsum.photos/seed/fal/600/400', descricao: 'O "Braço Direito do Mundo Livre", utilizado por décadas pela PMRR e Guarda Territorial como fuzil padrão.' },
  { id: 'ar2', nome: 'Pistola Taurus PT-92', calibre: '9mm', tipo: 'Pistola', fabricante: 'Taurus', status: 'Acervo', foto_url: 'https://picsum.photos/seed/pt92/600/400', descricao: 'Pistola semiautomática de alta confiabilidade, herança do design Beretta, muito presente na história da força.' },
  { id: 'ar3', nome: 'Revólver Smith & Wesson .38', calibre: '.38 SPL', tipo: 'Revólver', fabricante: 'Smith & Wesson', status: 'Histórico', foto_url: 'https://picsum.photos/seed/revolver/600/400', descricao: 'Armamento padrão do policiamento ostensivo nos primeiros anos da Guarda Territorial de Roraima.' },
  { id: 'ar4', nome: 'Metralhadora Madsen', calibre: '7x57mm Mauser', tipo: 'Metralhadora', fabricante: 'Dansk Industri Syndikat', status: 'Acervo', foto_url: 'https://picsum.photos/seed/madsen/600/400', descricao: 'Relíquia histórica utilizada em postos fixos e fortificações de fronteira no início do século XX.' },
  { id: 'ar5', nome: 'Fuzil Taurus IA2', calibre: '5.56x45mm', tipo: 'Fuzil', fabricante: 'IMBEL', status: 'Moderno', foto_url: 'https://picsum.photos/seed/ia2/600/400', descricao: 'Armamento moderno de dotação atual da PMRR, representando a evolução tecnológica da infantaria.' }
];

// Added missing 'autorizado_publicacao: true' to mock data to comply with Historia interface
export const MOCK_HISTORIAS: Historia[] = [
  { id: 'h1', titulo: 'A fundação da Polícia Militar', descricao: 'Como a Guarda Territorial virou Polícia Militar', tipo: 'texto', veterano_id: 'v1', aprovado: true, autorizado_publicacao: true, data: '1997-01-01', localizacao: 'Quartel do Comando Geral' },
  { id: 'h2', titulo: 'Fronteira e dever', descricao: 'Relato da patrulha na fronteira em 1975', tipo: 'áudio', arquivo_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', veterano_id: 'v2', aprovado: true, autorizado_publicacao: true, data: '1975-08-22' },
  { id: 'h3', titulo: 'Policiamento feminino', descricao: 'Minha experiência como a primeira mulher da força nas ruas. Foi um desafio quebrar barreiras institucionais e ganhar o respeito da comunidade.', tipo: 'vídeo', arquivo_url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', veterano_id: 'v3', aprovado: true, autorizado_publicacao: true, data: '1991-04-12', localizacao: 'Centro de Boa Vista' },
  { id: 'h4', titulo: 'Primeira Companhia', descricao: 'Como foi ser designado ao primeiro destacamento armado do território', tipo: 'texto', veterano_id: 'v4', aprovado: true, autorizado_publicacao: true, data: '1970-01-10', localizacao: 'Fronteira Norte' },
  { id: 'h5', titulo: 'Patrulha da Paz', descricao: 'Projeto que envolvia jovens em esportes e cultura', tipo: 'texto', veterano_id: 'v5', aprovado: true, autorizado_publicacao: true, data: '2010-06-15', localizacao: 'Escola Militar' },
  { id: 'h6', titulo: 'Formação nos anos 60', descricao: 'Relato da academia militar da época do território', tipo: 'áudio', arquivo_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', veterano_id: 'v4', aprovado: true, autorizado_publicacao: true, data: '1968-09-01' },
  { id: 'h7', titulo: 'Missão indígena', descricao: 'Primeira interação oficial da Guarda com comunidades locais', tipo: 'texto', veterano_id: 'v2', aprovado: true, autorizado_publicacao: true, data: '1973-03-22', localizacao: 'Terra Indígena Yanomami' },
  { id: 'h8', titulo: 'Expansão de quartéis', descricao: 'Construção das primeiras bases no interior', tipo: 'texto', veterano_id: 'v1', aprovado: true, autorizado_publicacao: true, data: '2003-02-10', localizacao: 'Posto Avançado de Rorainópolis' },
  { id: 'h9', titulo: 'Desfile de 7 de setembro', descricao: 'Participação marcante em 2001, celebrando a consolidação da força.', tipo: 'vídeo', arquivo_url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', veterano_id: 'v5', aprovado: true, autorizado_publicacao: true, data: '2001-09-07', localizacao: 'Avenida Ene Garcez' },
  { id: 'h10', titulo: 'Missão de paz', descricao: 'Relato sobre a ajuda humanitária no sul do estado', tipo: 'texto', veterano_id: 'v3', aprovado: true, autorizado_publicacao: true, data: '2007-11-20', localizacao: 'Vila do Equador' }
];

export const MOCK_LINHA_TEMPO: LinhaDoTempo[] = [
  { id: 'l1', ano: 1944, titulo: 'Criação da Guarda Territorial', descricao: 'Fundação oficial como força de segurança do Território', historia_id: 'h1' },
  { id: 'l2', ano: 1997, titulo: 'Transformação em Polícia Militar', descricao: 'Transição oficial da Guarda para Polícia Militar', historia_id: 'h1' },
  { id: 'l3', ano: 2001, titulo: 'Participação no desfile', descricao: 'Evento cívico com maior presença da força na história recente', historia_id: 'h9' }
];

export const MOCK_CONTRIBUICOES: Contribuicao[] = [
  { id: 'c1', nome: 'Maria dos Santos', email: 'maria@gmail.com', relato: 'Meu pai atuou na Guarda Territorial, tenho fotos e documentos.', aprovado: true, data_envio: '2023-10-01T10:00:00Z' },
  { id: 'c2', nome: 'Carlos Junior', email: 'cjunior@gmail.com', relato: 'Vídeo da primeira formatura dos cadetes em 1995.', aprovado: true, data_envio: '2023-10-05T15:30:00Z' }
];
