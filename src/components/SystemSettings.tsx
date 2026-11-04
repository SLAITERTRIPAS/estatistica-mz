import React, { useState } from 'react';
import { Save, Image as ImageIcon, Trash2, Sparkles, HardDrive, ShieldCheck } from 'lucide-react';
import FullscreenImageModal from './FullscreenImageModal';

interface SystemSettingsProps {
  currentLogo: string;
  onUpdateLogo: (newLogo: string) => void;
  onOpenLimpezaGeral?: () => void;
}

export default function SystemSettings({ currentLogo, onUpdateLogo, onOpenLimpezaGeral }: SystemSettingsProps) {
  const [newLogo, setNewLogo] = useState<string>(currentLogo);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
      <FullscreenImageModal 
        isOpen={!!fullscreenImage} 
        onClose={() => setFullscreenImage(null)} 
        imageSrc={fullscreenImage} 
      />
      
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
          Configurações e Manutenção do Sistema
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Personalização de identidade visual, gestão de integridade de dados e limpeza geral
        </p>
      </div>
      
      {/* 1. Logotipo */}
      <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase tracking-wide">
          <ImageIcon className="w-4 h-4 text-emerald-600" />
          <span>Alterar Logotipo Oficial do Sistema</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Defina o emblema ou logomarca exibida no cabeçalho central do SIGDE-ONLINE.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div 
            className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden border-2 border-slate-200 cursor-pointer hover:scale-105 transition-transform p-1 shadow-sm"
            onClick={() => setNewLogo && setNewLogo !== '' && setFullscreenImage(newLogo)}
            title="Clique para ver em tela cheia"
          >
            {newLogo ? (
              <img src={newLogo} alt="Logo" className="w-full h-full object-contain mix-blend-multiply" style={{ mixBlendMode: 'multiply' }} />
            ) : (
              <ImageIcon className="text-slate-400" />
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-sm">
              Carregar Nova Imagem
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            <button
              onClick={() => onUpdateLogo(newLogo)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Guardar Logotipo
            </button>
          </div>
        </div>
      </div>

      {/* 2. Centro de Limpeza Geral */}
      <div className="space-y-4 bg-amber-50/50 p-6 rounded-2xl border-2 border-amber-200/80">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-950 font-black text-sm uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Centro de Limpeza Geral e Otimização</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed max-w-xl">
              Execute a varredura completa de armazenamento, purga de autosaves residuais, sanitização de contas corrompidas e higienização de cache local do SIGDE-ONLINE.
            </p>
          </div>

          {onOpenLimpezaGeral && (
            <button
              type="button"
              onClick={onOpenLimpezaGeral}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              Abrir Limpeza Geral
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center gap-2.5">
            <HardDrive className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-slate-700 font-bold">Purga de ficheiros temporários</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-700 font-bold">Sanitização de contas e perfis</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="text-slate-700 font-bold">Otimização de memória e cache</span>
          </div>
        </div>
      </div>
    </div>
  );
}
