import React, { useState } from 'react';
import { X, Upload, Check, Image as ImageIcon, Sparkles, Building2, ShieldCheck, RefreshCw } from 'lucide-react';
import { User, Institution } from '../types';
import { PREDEFINED_LOGOS, resolveUserHeaderBranding } from '../constants/institutionLogos';
import { SYSTEM_LOGO } from '../constants/assets';

interface LogoCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  institutions: Institution[];
  onSaveLogo: (newLogoUrl: string) => Promise<void>;
}

export default function LogoCustomizerModal({
  isOpen,
  onClose,
  currentUser,
  institutions,
  onSaveLogo
}: LogoCustomizerModalProps) {
  const currentBranding = resolveUserHeaderBranding(currentUser, institutions);
  const [selectedLogo, setSelectedLogo] = useState<string>(currentUser.logoUrl || currentBranding.logoUrl);
  const [urlInput, setUrlInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('O arquivo selecionado é muito grande. O limite máximo é 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedLogo(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setSelectedLogo(urlInput.trim());
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveLogo(selectedLogo);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      alert('Erro ao guardar logotipo personalizado.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setSelectedLogo(SYSTEM_LOGO);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border-2 border-[#1e1e4a] rounded-2xl max-w-2xl w-full text-white shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#1e1e4a] flex items-center justify-between bg-[#07071e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#fec107]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                Personalizar Logotipo do Cabeçalho
              </h3>
              <p className="text-xs text-slate-400">
                Defina o logotipo que identificará a sua instituição e conta no cabeçalho do SIGDE.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Preview Header Card */}
        <div className="p-4 sm:p-6 bg-slate-950/60 border-b border-[#1e1e4a]">
          <label className="text-xs font-black tracking-widest uppercase text-slate-400 block mb-2">
            Pré-visualização do Seu Cabeçalho Personalizado:
          </label>
          <div className="bg-[#0b0b29] border border-[#1e1e4a] rounded-xl p-3 sm:p-4 flex items-center justify-between gap-4 shadow-inner">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 shrink-0 bg-white rounded-xl border-2 border-[#fec107] flex items-center justify-center p-1 overflow-hidden shadow-md">
                <img
                  src={selectedLogo}
                  alt="Pré-visualização do Logotipo"
                  className="w-full h-full object-contain mix-blend-multiply"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${currentBranding.badgeBg} ${currentBranding.badgeTextColor}`}>
                    {currentBranding.badgeText}
                  </span>
                  {currentBranding.provinceOrRegion && (
                    <span className="text-[10px] font-mono text-slate-400">
                      • {currentBranding.provinceOrRegion}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-black text-white truncate mt-1">
                  {currentBranding.entityName}
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  {currentUser.name} • {currentBranding.entitySubtitle}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[11px] font-black text-[#fec107] uppercase tracking-widest">PERSONALIZADO</span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Ativo no Cabeçalho
              </span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-4 sm:px-6 pt-4 flex gap-2 border-b border-[#1e1e4a]">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'presets'
                ? 'border-[#fec107] text-[#fec107]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Logotipos Oficiais (IES & Províncias)
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-[#fec107] text-[#fec107]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Carregar Imagem (Upload)
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'url'
                ? 'border-[#fec107] text-[#fec107]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Endereço Web (URL)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[320px]">
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 mb-3">
                Selecione o emblema oficial da sua universidade, direcção provincial ou órgão central:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PREDEFINED_LOGOS.map((item) => {
                  const isSelected = selectedLogo === item.svgDataUri;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedLogo(item.svgDataUri)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-[#fec107] bg-[#fec107]/10 ring-2 ring-[#fec107]/30'
                          : 'border-[#1e1e4a] bg-slate-800/40 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="w-10 h-10 shrink-0 bg-white rounded-lg p-1 flex items-center justify-center overflow-hidden border border-slate-700">
                        <img
                          src={item.svgDataUri}
                          alt={item.shortName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-white truncate">
                          {item.shortName}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {item.name}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-[#fec107] ml-auto shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4 text-center py-4">
              <label
                htmlFor="modal-logo-upload"
                className="border-2 border-dashed border-[#1e1e4a] hover:border-[#fec107] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-slate-800/20 hover:bg-slate-800/40 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-[#fec107] group-hover:scale-110 transition-transform flex items-center justify-center">
                  <Upload className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-sm font-black text-white block">
                    Clique para selecionar imagem ou arraste até aqui
                  </span>
                  <span className="text-xs text-slate-400 block mt-1">
                    Formatos suportados: PNG, JPG, SVG, WebP (Máx. 2MB)
                  </span>
                </div>
                <input
                  id="modal-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Endereço público da imagem (URL HTTPS):
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://exemplo.gov.mz/logo.png"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-[#fec107]"
                  />
                  <button
                    onClick={handleApplyUrl}
                    className="bg-[#fec107] hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs uppercase cursor-pointer"
                  >
                    Carregar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-6 border-t border-[#1e1e4a] flex items-center justify-between bg-[#07071e]">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Restaurar Logotipo Padrão
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#fec107] hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="h-4 w-4" /> Gravado com Sucesso!
                </>
              ) : isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> A guardar...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Aplicar ao Cabeçalho
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
