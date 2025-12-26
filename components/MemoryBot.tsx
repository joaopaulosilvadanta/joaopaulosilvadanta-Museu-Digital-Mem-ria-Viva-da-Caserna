
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Trash2 } from 'lucide-react';
import { chatWithMemoryBot } from '../services/geminiService';

export const MemoryBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string}[]>([
    { role: 'bot', text: 'Olá! Sou o Bot da Memória. O que você gostaria de saber sobre a nossa Caserna?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => `${m.role}: ${m.text}`);
    const botResponse = await chatWithMemoryBot(history, userMsg);
    
    setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([{ role: 'bot', text: 'Conversa reiniciada. Como posso ajudar agora?' }]);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      {!isOpen ? (
        <div className="relative group">
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-indigo-900 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-800 transition-all flex items-center gap-2 pr-6"
            aria-label="Abrir Bot da Memória"
          >
            <Bot size={24} />
            <span className="font-semibold hidden md:inline">Bot da Memória</span>
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            title="Ocultar Assistente"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="bg-white w-[350px] md:w-[400px] h-[500px] rounded-2xl shadow-2xl flex flex-col border border-indigo-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-indigo-900 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-bold">Memória Viva AI</h3>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearChat}
                className="p-1.5 hover:bg-indigo-800 rounded-lg transition-colors text-indigo-300"
                title="Limpar Conversa"
              >
                <Trash2 size={16} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 hover:bg-indigo-800 rounded-lg transition-colors"
                title="Minimizar Chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-indigo-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl flex gap-2 ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 shadow-sm rounded-tl-none border border-indigo-100'
                }`}>
                  <div className="mt-1 flex-shrink-0">
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-indigo-100 shadow-sm">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pergunte sobre a história..."
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
