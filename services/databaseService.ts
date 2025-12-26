
import { Veterano, Historia, LinhaDoTempo, Contribuicao, Profile, Viatura, Armamento } from '../types';
import { MOCK_VETERANOS, MOCK_HISTORIAS, MOCK_LINHA_TEMPO, MOCK_CONTRIBUICOES, MOCK_VIATURAS, MOCK_ARMAMENTOS } from '../constants';

class DatabaseService {
  private veteranos: Veterano[] = [...MOCK_VETERANOS];
  private viaturas: Viatura[] = [...MOCK_VIATURAS];
  private armamentos: Armamento[] = [...MOCK_ARMAMENTOS];
  private historias: Historia[] = [...MOCK_HISTORIAS.map(h => ({...h, autorizado_publicacao: true}))];
  private linhaDoTempo: LinhaDoTempo[] = [...MOCK_LINHA_TEMPO];
  private contribuicoes: Contribuicao[] = [...MOCK_CONTRIBUICOES];
  private profiles: Profile[] = [
    { id: 'admin-1', nome: 'Cap João Paulo (TI/Admin)', email: 'admin@pm.rr.gov.br', role: 'admin' },
    { id: 'curador-1', nome: 'Ten Dra. Márcia (História)', email: 'curador@pm.rr.gov.br', role: 'curador' },
    { id: 'colab-1', nome: 'Sgt. Silva (Veterano)', email: 'colaborador@pm.rr.gov.br', role: 'colaborador' }
  ];
  private currentUser: Profile | null = null;

  async login(email: string, password: string): Promise<Profile | null> {
    const existing = this.profiles.find(p => p.email === email);
    if (existing) {
      this.currentUser = existing;
      return existing;
    }

    let role: Profile['role'] = 'visitante';
    if (email.includes('admin')) role = 'admin';
    else if (email.includes('curador')) role = 'curador';
    else if (email.includes('colab')) role = 'colaborador';

    const newProfile: Profile = {
      id: crypto.randomUUID(),
      nome: email.split('@')[0].toUpperCase(),
      email: email,
      role: role
    };
    this.profiles.push(newProfile);
    this.currentUser = newProfile;
    return newProfile;
  }

  async logout() {
    this.currentUser = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async uploadFile(file: File): Promise<string> {
    return URL.createObjectURL(file);
  }
  
  async getVeteranos() { return this.veteranos; }
  async getViaturas() { return this.viaturas; }
  async getArmamentos() { return this.armamentos; }
  async getHistorias() { return this.historias; }
  async getHistoriasAprovadas() { return this.historias.filter(h => h.aprovado); }

  async getHistoriaDoMes(): Promise<Historia | null> {
    return this.historias.find(h => h.id === 'h3') || this.historias[0] || null;
  }

  async getAnterioresDestaque(): Promise<Historia[]> {
    return this.historias.filter(h => h.aprovado && h.id !== 'h3').slice(0, 3);
  }

  async getHistoriasByVeterano(veteranoId: string) {
    return this.historias.filter(h => h.veterano_id === veteranoId && h.aprovado);
  }

  async getHistoriasPendentes() {
    return this.historias.filter(h => !h.aprovado);
  }

  async addHistoria(h: Omit<Historia, 'id' | 'created_at' | 'aprovado'>) {
    const newH: Historia = {
      ...h,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      aprovado: false, 
      autorizado_publicacao: h.autorizado_publicacao,
      user_id: this.currentUser?.id
    };
    this.historias.push(newH);
    return newH;
  }

  async aprovarHistoria(id: string) {
    this.historias = this.historias.map(h => h.id === id ? { ...h, aprovado: true } : h);
  }

  async rejeitarHistoria(id: string) {
    this.historias = this.historias.filter(h => h.id !== id);
  }

  async getContribuicoes() { return this.contribuicoes; }

  async addContribuicao(c: Omit<Contribuicao, 'id' | 'data_envio' | 'aprovado'>) {
    const newC: Contribuicao = { 
      ...c, 
      id: crypto.randomUUID(), 
      data_envio: new Date().toISOString(), 
      aprovado: false 
    };
    this.contribuicoes.push(newC);
    return newC;
  }

  async aprovarContribuicao(id: string) {
    this.contribuicoes = this.contribuicoes.map(c => c.id === id ? { ...c, aprovado: true } : c);
  }

  async excluirContribuicao(id: string) {
    this.contribuicoes = this.contribuicoes.filter(c => c.id !== id);
  }

  async getLinhaDoTempo() { 
    return this.linhaDoTempo.sort((a, b) => a.ano - b.ano); 
  }
}

export const db = new DatabaseService();
