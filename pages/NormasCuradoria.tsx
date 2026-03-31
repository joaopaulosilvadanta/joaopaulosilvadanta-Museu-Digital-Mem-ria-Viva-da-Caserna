import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  FileText, 
  History, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Scale,
  BookOpen,
  UserCheck,
  Copyright
} from 'lucide-react';

const NormasCuradoria = () => {
  const sections = [
    {
      title: "1. Diretrizes de Revisão",
      icon: ShieldCheck,
      content: "A revisão deve ser pautada pela triangulação de evidências. Nenhum documento ou relato deve ser publicado sem que sua origem seja rastreável e contextualizada."
    },
    {
      title: "2. Classificação de Fontes",
      icon: BookOpen,
      content: "Fontes Primárias (documentos originais), Secundárias (livros e artigos) e Orais (depoimentos de veteranos com termo de consentimento)."
    },
    {
      title: "3. Validação Histórica",
      icon: History,
      content: "A informação é considerada validada quando há conformidade documental (Boletins), consonância oral (múltiplos relatos) ou evidência material."
    },
    {
      title: "4. Regras de Crédito",
      icon: Copyright,
      content: "Padrão obrigatório: 'Crédito: Acervo SENG/PMRR' para acervo próprio ou 'Coleção [Nome]' para doações de terceiros."
    },
    {
      title: "5. Licenças de Uso",
      icon: Scale,
      content: "Uso educacional e institucional permitido com citação. Uso comercial proibido sem autorização expressa do Comando Geral."
    },
    {
      title: "6. Restrições e Sigilo",
      icon: Lock,
      content: "Conteúdos que firam a LGPD, a segurança orgânica das unidades ou possuam autoria incerta devem permanecer em status 'Restrito'."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f2ed] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-2 block">
            Gestão de Acervo
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-[#1a1a1a] mb-4">
            Normas de Curadoria
          </h1>
          <p className="text-[#4a4a4a] max-w-2xl mx-auto italic">
            Política prática e segura para a publicação de conteúdos históricos, institucionais e documentais no Museu Digital Memória Viva da Caserna.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5e5e5]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#f5f2ed] rounded-lg">
                  <section.icon className="w-5 h-5 text-[#5A5A40]" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1a1a1a]">{section.title}</h3>
              </div>
              <p className="text-sm text-[#4a4a4a] leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1a1a1a] text-white p-8 rounded-3xl mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-6 h-6 text-[#00FF00]" />
            <h2 className="text-2xl font-serif font-light">Checklist Pré-Publicação</h2>
          </div>
          <ul className="space-y-4">
            {[
              "A fonte foi devidamente classificada e rastreada?",
              "O crédito institucional está preenchido corretamente?",
              "Existe autorização de uso de imagem (para pessoas vivas)?",
              "O conteúdo respeita a LGPD e a segurança orgânica?",
              "A imagem possui descrição de acessibilidade (Alt Text)?",
              "A revisão técnica por oficial superior foi concluída?"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <div className="mt-1 w-4 h-4 rounded border border-gray-600 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="bg-white p-8 rounded-3xl border border-[#e5e5e5]">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-[#5A5A40]" />
            <h2 className="text-2xl font-serif font-light text-[#1a1a1a]">Campos Obrigatórios no Sistema</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "ID do Item", "Título de Exibição", "Data do Registro",
              "Classificação da Fonte", "Status de Validação", "Crédito Institucional",
              "Licença de Uso", "Autorizado por (Oficial)", "Resumo Histórico"
            ].map((field, i) => (
              <div key={i} className="p-3 bg-[#f5f2ed] rounded-xl text-xs font-medium text-[#5A5A40] text-center">
                {field}
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-[#9e9e9e] uppercase tracking-widest">
          Documento Interno SENG/PMRR • Versão 1.0 • 2026
        </footer>
      </div>
    </div>
  );
};

export default NormasCuradoria;
