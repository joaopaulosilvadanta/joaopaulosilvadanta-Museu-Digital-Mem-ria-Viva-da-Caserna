
import React, { useState, useRef } from 'react';
import { Camera, Upload, Search, ShieldCheck, RefreshCcw, FileText, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { analyzeMemoryImage } from '../services/geminiService';

const AnalysisPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSelectedImage(base64String);
        setMimeType(file.type);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!selectedImage || isAnalyzing) return;
    setIsAnalyzing(true);
    const analysisResult = await analyzeMemoryImage(selectedImage, mimeType);
    setResult(analysisResult);
    setIsAnalyzing(false);
  };

  const reset = () => {
    setSelectedImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-900 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          <Search size={14} /> Laboratório de Perícia Digital
        </div>
        <h1 className="text-4xl font-bold text-indigo-950 serif-font mb-4">Análise de Acervo por IA</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Utilize nossa tecnologia de visão computacional para identificar uniformes, insígnias e contextos históricos em suas fotos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload/Preview Area */}
        <div className="space-y-6">
          <div 
            className={`relative rounded-[2.5rem] border-2 border-dashed transition-all overflow-hidden flex items-center justify-center min-h-[400px] bg-slate-50 ${
              selectedImage ? 'border-indigo-200' : 'border-slate-200 hover:border-indigo-400 cursor-pointer'
            }`}
            onClick={() => !selectedImage && fileInputRef.current?.click()}
          >
            {selectedImage ? (
              <>
                <img 
                  src={`data:${mimeType};base64,${selectedImage}`} 
                  alt="Preview da Perícia" 
                  className="w-full h-full object-contain p-4"
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <RefreshCcw size={18} />
                </button>
              </>
            ) : (
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <ImageIcon size={40} />
                </div>
                <p className="font-bold text-indigo-950 mb-2">Selecione uma Imagem</p>
                <p className="text-xs text-slate-500">Arraste ou clique para carregar fotos de uniformes, medalhas ou documentos históricos.</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          <button
            onClick={runAnalysis}
            disabled={!selectedImage || isAnalyzing}
            className="w-full py-5 bg-indigo-900 text-white font-bold rounded-3xl flex items-center justify-center gap-3 hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <RefreshCcw className="animate-spin" size={20} /> Processando Perícia...
              </>
            ) : (
              <>
                <ShieldCheck size={20} /> Iniciar Análise Técnica
              </>
            )}
          </button>
        </div>

        {/* Result Area */}
        <div className="flex flex-col">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex-grow p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-900/10"></div>
            
            <h3 className="text-xl font-bold text-indigo-950 serif-font mb-6 flex items-center gap-2">
              <FileText className="text-amber-500" /> Relatório de Perícia
            </h3>

            {result ? (
              <div className="prose prose-slate animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {result}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                <Search size={48} className="mb-4 text-slate-300" />
                <p className="text-sm font-medium">Aguardando processamento da imagem...</p>
                <p className="text-[10px] uppercase tracking-widest mt-2">Modelo: Gemini 3 Pro Preview</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-black uppercase tracking-widest text-indigo-900 animate-pulse">Cruzando dados históricos...</p>
              </div>
            )}
          </div>

          <div className="mt-6 bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
            <AlertTriangle className="text-amber-600 flex-shrink-0" size={20} />
            <div className="text-[11px] text-amber-800 leading-relaxed">
              <b>Nota de Precisão:</b> Esta análise é baseada em modelos de inteligência artificial. Verifique sempre com historiadores militares ou com a Seção de Memória para confirmações oficiais de datas e patentes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
