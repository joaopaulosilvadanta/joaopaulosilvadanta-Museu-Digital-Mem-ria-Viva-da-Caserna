
import React, { useState, useEffect } from 'react';
import { Type, Moon, Sun, Plus, Minus, Eye } from 'lucide-react';

export const AccessibilityToolbar: React.FC = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle('high-contrast');
  };

  const adjustFont = (amount: number) => {
    const newSize = Math.min(Math.max(fontSize + amount, 80), 150);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${(newSize / 100) * 16}px`;
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-xl border border-slate-200 flex flex-col gap-2 group">
        <button 
          onClick={toggleContrast}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          title="Alternar Alto Contraste"
          aria-label="Alternar Alto Contraste"
        >
          {highContrast ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button 
          onClick={() => adjustFont(10)}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          title="Aumentar Fonte"
          aria-label="Aumentar Fonte"
        >
          <Plus size={20} />
        </button>
        <button 
          onClick={() => adjustFont(-10)}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          title="Diminuir Fonte"
          aria-label="Diminuir Fonte"
        >
          <Minus size={20} />
        </button>
        <div className="p-3 bg-slate-900 text-white rounded-full flex items-center justify-center">
            <Eye size={20} />
        </div>
      </div>
    </div>
  );
};
