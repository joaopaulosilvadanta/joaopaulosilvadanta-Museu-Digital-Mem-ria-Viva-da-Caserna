
import React, { useState, useRef, useEffect } from 'react';
import { db } from '../services/databaseService';
import { Profile, Veterano } from '../types';
import { 
  Upload, Mic, Send, CheckCircle, StopCircle, LogIn, 
  FileAudio, FileVideo, FileText, User, ShieldCheck, 
  Clock, Eye, Image as ImageIcon, X, File as FileIcon,
  ShieldAlert, CheckSquare, Square, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppRoute } from '../types';

interface SubmitPageProps {
  user: Profile | null;
}

const SubmitPage: React.FC<SubmitPageProps> = ({ user }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [titulo, setTitulo] = useState('');
  const [nomeVeterano, setNomeVeterano] = useState('');
  const [tipo, setTipo] = useState<'texto' | 'áudio' | 'vídeo' | 'imagem'>('texto');
  const [veteranos, setVeteranos] = useState<Veterano[]>([]);
  const [selectedVeteranoId, setSelectedVeteranoId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    db.getVeteranos().then(setVeteranos);
  }, []);

  const validateFileType = (selectedFile: File, selectedType: string) => {
    const mime = selectedFile.type;
    setErrorMessage(null);

    switch (selectedType) {
      case 'imagem':
        if (!mime.startsWith('image/')) return 'O arquivo enviado deve ser uma imagem (JPG, PNG, etc).';
        break;
      case 'áudio':
        if (!mime.startsWith('audio/')) return 'O arquivo enviado deve ser um áudio (MP3, WAV, etc).';
        break;
      case 'vídeo':
        if (!mime.startsWith('video/')) return 'O arquivo enviado deve ser um vídeo (MP4, MOV, etc).';
        break;
      case 'texto':
        const validDocs = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validDocs.includes(mime) && !mime.startsWith('image/')) return 'Para relatos em texto, anexe documentos (PDF, DOC) ou fotos comprobatórias.';
        break;
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile) {
      const error = validateFileType(selectedFile, tipo);
      if (error) {
        setErrorMessage(error);
        setFile(null);
        setFilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setFilePreview(url);
      } else {
        setFilePreview(null);
      }
    } else {
      setFile(null);
      setFilePreview(null);
    }
  };

  const handleTypeChange = (newType: 'texto' | 'áudio' | 'vídeo' | 'imagem') => {
    setTipo(newType);
    setErrorMessage(null);
    // Se já houver um arquivo, re-validar
    if (file) {
      const error = validateFileType(file, newType);
      if (error) {
        setErrorMessage(`Arquivo anterior incompatível com o novo tipo: ${error}`);
        setFile(null);
        setFilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setFilePreview(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startTranscription = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.onresult = (event: any) => {
        let currentTranscription = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) currentTranscription += event.results[i][0].transcript;
        }
        if (currentTranscription) setTranscription(prev => prev + ' ' + currentTranscription.trim());
      };
      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !hasConsent || errorMessage) return;
    
    setUploading(true);
    let arquivoUrl = '';
    
    if (file) {
      arquivoUrl = await db.uploadFile(file);
    }

    const nomeFinal = selectedVeteranoId 
      ? (veteranos.find(v => v.id === selectedVeteranoId)?.nome || nomeVeterano)
      : nomeVeterano;

    await db.addHistoria({
      titulo,
      nome_veterano: nomeFinal,
      descricao: transcription,
      tipo,
      veterano_id: selectedVeteranoId || null,
      arquivo_url: arquivoUrl,
      autorizado_publicacao: true,
      data: new Date().toISOString().split('T')[0]
    });

    setUploading(false);
    setSubmitted(true);
  };

  if (!user) {
    return (
      <div className="py-20 px-4 max-w-2xl mx-auto text-center animate-in fade-in">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-indigo-50">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn size={40} />
          </div>
          <h1 className="text-3xl font-bold text-indigo-950 serif-font mb-4">Identificação Militar</h1>
          <p className="text-slate-600 mb-8">O envio de memórias é restrito a militares e colaboradores identificados para garantir a fidedignidade histórica.</p>
          <Link to={AppRoute.LOGIN} className="inline-flex items-center gap-2 bg-indigo-900 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-800 transition-all">
            Acessar com Credenciais
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="py-20 px-4 max-w-3xl mx-auto text-center animate-in zoom-in">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-indigo-50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-950"></div>
          
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-lg">
            <ShieldCheck size={48} />
          </div>
          
          <h1 className="text-3xl font-bold text-indigo-950 serif-font mb-4">Relato Recebido com Sucesso</h1>
          <p className="text-slate-600 mb-12 max-w-md mx-auto">Sua história foi protocolada e agora passará pelo processo rigoroso de curadoria e verificação de autorização.</p>
          
          <button onClick={() => { setSubmitted(false); setFile(null); setFilePreview(null); setHasConsent(false); setErrorMessage(null); }} className="bg-indigo-900 text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-indigo-900/20 hover:bg-indigo-800 transition-all">
            Enviar Outra Memória
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto animate-in fade-in">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          <ShieldCheck size={14} /> Canal Oficial de Contribuição
        </div>
        <h1 className="text-4xl font-bold text-indigo-950 serif-font mb-4">Eternize uma Memória</h1>
        <p className="text-slate-500 max-w-lg mx-auto italic">"O valor de uma instituição reside nas histórias que seus membros preservam."</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-900 uppercase tracking-widest px-1">Título da Memória</label>
              <input 
                required 
                type="text" 
                value={titulo} 
                onChange={e => setTitulo(e.target.value)} 
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                placeholder="Ex: Patrulhamento na Fronteira 1985"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-900 uppercase tracking-widest px-1">Nome do Veterano</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={nomeVeterano} 
                  onChange={e => { setNomeVeterano(e.target.value); setSelectedVeteranoId(''); }} 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  placeholder="Nome completo ou alcunha"
                  disabled={!!selectedVeteranoId}
                />
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-900 uppercase tracking-widest px-1">Vincular ao Cadastro de Veteranos (Opcional)</label>
            <select 
              value={selectedVeteranoId}
              onChange={e => setSelectedVeteranoId(e.target.value)}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Buscar na Galeria de Veteranos...</option>
              {veteranos.map(v => (
                <option key={v.id} value={v.id}>{v.patente} {v.nome}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-900 uppercase tracking-widest px-1">Natureza do Relato</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['texto', 'áudio', 'vídeo', 'imagem'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTypeChange(t)}
                  className={`py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                    tipo === t ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {t === 'texto' && <FileText size={20} />}
                  {t === 'áudio' && <Mic size={20} />}
                  {t === 'vídeo' && <FileVideo size={20} />}
                  {t === 'imagem' && <ImageIcon size={20} />}
                  <span className="text-[10px] font-black uppercase tracking-tighter">{t}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-900 uppercase tracking-widest px-1">Transcrição ou Contextualização</label>
            <div className="relative">
              <textarea 
                rows={6} 
                value={transcription} 
                onChange={e => setTranscription(e.target.value)} 
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all" 
                placeholder="Descreva o evento com o máximo de detalhes..."
              />
              <button 
                type="button" 
                onClick={startTranscription} 
                className={`absolute right-4 bottom-4 p-3 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
                title="Ditado por Voz"
              >
                {isRecording ? <StopCircle size={24} /> : <Mic size={24} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-900 uppercase tracking-widest px-1">Comprovação ou Complemento (Foto/Doc/Mídia)</label>
            
            {errorMessage && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
                <AlertCircle size={18} />
                {errorMessage}
              </div>
            )}

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all bg-slate-50 group relative overflow-hidden ${
                errorMessage ? 'border-red-200 bg-red-50/30' : 
                file ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400 cursor-pointer'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept={
                  tipo === 'imagem' ? 'image/*' : 
                  tipo === 'áudio' ? 'audio/*' : 
                  tipo === 'vídeo' ? 'video/*' : 
                  'image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                } 
              />
              
              {filePreview ? (
                <div className="relative inline-block">
                  <img src={filePreview} alt="Preview" className="h-32 rounded-xl border-4 border-white shadow-md mb-2" />
                  <button onClick={removeFile} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600"><X size={14} /></button>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl relative">
                    {tipo === 'áudio' ? <FileAudio size={32} /> : tipo === 'vídeo' ? <FileVideo size={32} /> : <FileIcon size={32} />}
                    <button onClick={removeFile} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"><X size={12} /></button>
                  </div>
                  <p className="text-xs font-bold text-indigo-900 truncate max-w-xs">{file.name}</p>
                </div>
              ) : (
                <>
                  <Upload className={`mx-auto mb-4 transition-colors ${errorMessage ? 'text-red-300' : 'text-slate-300 group-hover:text-indigo-500'}`} size={40} />
                  <p className={`text-sm font-medium ${errorMessage ? 'text-red-400' : 'text-slate-500'}`}>
                    {tipo === 'imagem' ? 'Clique para anexar a Foto histórica' : 
                     tipo === 'áudio' ? 'Anexe o Relato em Áudio' : 
                     tipo === 'vídeo' ? 'Anexe o Registro em Vídeo' : 
                     'Anexe Documento ou Foto de comprovação'}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* TERMO DE AUTORIZAÇÃO JURÍDICA */}
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldAlert size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-amber-500" size={24} />
                <h3 className="text-lg font-bold serif-font">Termo de Autorização e Responsabilidade</h3>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 max-h-40 overflow-y-auto text-[11px] leading-relaxed text-slate-300 custom-scrollbar">
                <p className="mb-3">Eu, <b>{user.nome}</b>, devidamente identificado(a) neste sistema, declaro para os devidos fins que:</p>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>Autorizo a <b>Polícia Militar de Roraima (PMRR)</b>, através de sua Seção de Engenharia e Curadoria do Museu Digital, a publicar e divulgar o relato, imagem ou áudio ora enviado, em caráter permanente e gratuito.</li>
                  <li>As informações aqui prestadas são de minha inteira responsabilidade e condizem com a verdade histórica, isentando os gestores do Museu e a PMRR de qualquer responsabilização civil ou criminal por eventuais imprecisões ou violação de direitos de terceiros.</li>
                  <li>Tenho ciência de que este material passará por curadoria técnica e poderá ser editado para fins de padronização institucional, preservando-se o núcleo histórico.</li>
                  <li>Autorizo o uso do material em exposições, publicações acadêmicas, redes sociais oficiais e materiais de divulgação institucional da PMRR.</li>
                </ol>
                <p className="mt-3 font-bold text-amber-400">Ao marcar a caixa abaixo, registro minha assinatura digital irrevogável para este protocolo.</p>
              </div>

              <label className="flex items-center gap-4 cursor-pointer group select-none">
                <div 
                  onClick={() => setHasConsent(!hasConsent)}
                  className={`p-1 rounded-lg transition-all ${hasConsent ? 'bg-amber-500 text-indigo-950' : 'bg-white/10 text-white/40 group-hover:bg-white/20'}`}
                >
                  {hasConsent ? <CheckSquare size={24} /> : <Square size={24} />}
                </div>
                <span className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">
                  Li e aceito os termos de autorização e assumo total responsabilidade pelo conteúdo enviado.
                </span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={uploading || !hasConsent || !!errorMessage}
            className={`w-full py-5 font-bold rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl ${
              (hasConsent && !errorMessage)
                ? 'bg-indigo-900 text-white hover:bg-indigo-800 shadow-indigo-900/20' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {uploading ? 'Processando Documentação...' : 'Protocolar Memória'} <Send size={20} />
          </button>
        </form>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default SubmitPage;
