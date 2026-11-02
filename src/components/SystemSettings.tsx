import React, { useState } from 'react';
import { Upload, Save, Sparkles, Image as ImageIcon } from 'lucide-react';

import FullscreenImageModal from './FullscreenImageModal';

interface SystemSettingsProps {
  currentLogo: string;
  onUpdateLogo: (newLogo: string) => void;
}

export default function SystemSettings({ currentLogo, onUpdateLogo }: SystemSettingsProps) {
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
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <FullscreenImageModal 
        isOpen={!!fullscreenImage} 
        onClose={() => setFullscreenImage(null)} 
        imageSrc={fullscreenImage} 
      />
      <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Configurações do Sistema</h2>
      
      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-600">Alterar Logotipo do Sistema</label>
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 bg-transparent rounded-xl flex items-center justify-center overflow-hidden border-2 border-slate-200 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setNewLogo && setNewLogo !== '' && setFullscreenImage(newLogo)}
            title="Clique para ver em tela cheia"
          >
            {newLogo ? <img src={newLogo} alt="Logo" className="w-full h-full object-contain mix-blend-multiply" style={{ mixBlendMode: 'multiply' }} /> : <ImageIcon className="text-slate-400" />}
          </div>
          <label className="cursor-pointer bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors">
            Carregar Imagem
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </div>

      <button
        onClick={() => onUpdateLogo(newLogo)}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-6 rounded-xl text-sm transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
      >
        <Save className="h-4 w-4" />
        Guardar Alterações
      </button>
    </div>
  );
}
