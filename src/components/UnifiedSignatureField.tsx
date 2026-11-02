import React, { useState, useEffect, useRef } from 'react';
import { Upload, PenTool, Check, X, RefreshCw, Trash2, ShieldCheck, Download, Sparkles, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface UnifiedSignatureFieldProps {
  title: string;
  defaultSignerName: string;
  signerRoleDescription?: string;
  currentUser?: User | null;
  savedSignatureValue?: string | null;
  onApplySignature?: (signatureBase64: string | null, signerName: string) => void;
  readOnly?: boolean;
}

// Helper to remove white paper background using canvas pixel manipulation
export const processSignatureTransparent = (
  base64Str: string,
  thresholdVal: number = 225
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a === 0) continue;

        // If pixels are bright white or light gray/paper background
        if (r >= thresholdVal && g >= thresholdVal && b >= thresholdVal) {
          data[i + 3] = 0; // Transparent
        } else if (r > thresholdVal - 25 && g > thresholdVal - 25 && b > thresholdVal - 25) {
          const minVal = Math.min(r, g, b);
          const ratio = (minVal - (thresholdVal - 25)) / 25;
          data[i + 3] = Math.max(0, Math.min(255, Math.round((1 - ratio) * 255)));
        }
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(base64Str);
  });
};

export default function UnifiedSignatureField({
  title,
  defaultSignerName,
  signerRoleDescription,
  currentUser,
  savedSignatureValue,
  onApplySignature,
  readOnly = false
}: UnifiedSignatureFieldProps) {
  // Current signature applied to this field
  const [currentSignature, setCurrentSignature] = useState<string | null>(savedSignatureValue || null);
  const [signerName, setSignerName] = useState<string>(defaultSignerName);
  
  // Modal / drawer for uploading or creating a signature
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'draw'>('upload');
  
  // System-stored signature of the logged-in user
  const [userSavedSystemSignature, setUserSavedSystemSignature] = useState<string | null>(null);
  
  // Pending signature inside the modal
  const [previewSignature, setPreviewSignature] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(225);
  const [rawUpload, setRawUpload] = useState<string | null>(null);
  const [isSavingToSystem, setIsSavingToSystem] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Drawing canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Check and sync logged-in user's system signature
  useEffect(() => {
    let foundSig: string | null = null;
    if (currentUser) {
      if (currentUser.signatureUrl) {
        foundSig = currentUser.signatureUrl;
      } else {
        const fromLocalUser = localStorage.getItem(`stat_user_signature_${currentUser.id}`);
        if (fromLocalUser) {
          foundSig = fromLocalUser;
        }
      }
    }
    if (!foundSig) {
      const globalProcSig = localStorage.getItem('stat_processed_signature');
      if (globalProcSig) foundSig = globalProcSig;
    }
    setUserSavedSystemSignature(foundSig);
  }, [currentUser]);

  // Sync external value
  useEffect(() => {
    if (savedSignatureValue !== undefined) {
      setCurrentSignature(savedSignatureValue);
    }
  }, [savedSignatureValue]);

  // Automatically apply the stored system signature if available and none is currently applied
  useEffect(() => {
    if (!currentSignature && userSavedSystemSignature && currentUser) {
      // Determine if this field matches the current user's role to apply automatically
      let shouldAutoApply = false;
      
      const isRectorField = title.toLowerCase().includes('chefe') || title.toLowerCase().includes('reitor') || title.toLowerCase().includes('diretor') || title.toLowerCase().includes('máximo');
      const isFocalField = title.toLowerCase().includes('elaborado') || title.toLowerCase().includes('focal') || title.toLowerCase().includes('ponto') || title.toLowerCase().includes('técnico');
      
      if (isRectorField && currentUser.role === 'OrgaoMaximoIES') {
        shouldAutoApply = true;
      } else if (isFocalField && ['FocalPoint', 'ies', 'ies_interno'].includes(currentUser.role)) {
        shouldAutoApply = true;
      } else if (!isRectorField && !isFocalField) {
        // If it's a generic field, auto-apply it
        shouldAutoApply = true;
      }

      if (shouldAutoApply) {
        setCurrentSignature(userSavedSystemSignature);
        setSignerName(currentUser.name);
        if (onApplySignature) {
          onApplySignature(userSavedSystemSignature, currentUser.name);
        }
      }
    }
  }, [userSavedSystemSignature, currentSignature, currentUser, onApplySignature, title]);

  // Handle uploading file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito pesado. O tamanho máximo permitido é 5MB.');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const raw = evt.target?.result as string;
      setRawUpload(raw);
      const transparent = await processSignatureTransparent(raw, threshold);
      setPreviewSignature(transparent);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  // Re-process when threshold slider adjusts
  const handleThresholdChange = async (val: number) => {
    setThreshold(val);
    if (rawUpload) {
      setIsProcessing(true);
      const transparent = await processSignatureTransparent(rawUpload, val);
      setPreviewSignature(transparent);
      setIsProcessing(false);
    }
  };

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#0f172a'; // Deep pen ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setPreviewSignature(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPreviewSignature(null);
  };

  // 1. CARREGAR ASSINATURA EXISTENTE DO LOGADO NO SISTEMA
  const handleApplyUserSystemSignature = () => {
    if (!userSavedSystemSignature) return;
    setCurrentSignature(userSavedSystemSignature);
    if (currentUser?.name) {
      setSignerName(currentUser.name);
    }
    if (onApplySignature) {
      onApplySignature(userSavedSystemSignature, currentUser?.name || signerName);
    }
  };

  // 2. GUARDAR NO SISTEMA E APLICAR
  const handleSaveToSystemAndApply = async () => {
    if (!previewSignature) {
      alert('Por favor, carregue uma imagem ou desenhe a sua assinatura antes de guardar.');
      return;
    }

    setIsSavingToSystem(true);
    try {
      // Save locally
      localStorage.setItem('stat_processed_signature', previewSignature);
      if (rawUpload) {
        localStorage.setItem('stat_raw_signature', rawUpload);
      }
      localStorage.setItem('stat_signature_threshold', String(threshold));

      if (currentUser?.id) {
        localStorage.setItem(`stat_user_signature_${currentUser.id}`, previewSignature);

        // Update currentUser object in localStorage
        const storedUser = localStorage.getItem('stat_current_user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            parsed.signatureUrl = previewSignature;
            localStorage.setItem('stat_current_user', JSON.stringify(parsed));
          } catch (e) {
            console.error(e);
          }
        }

        // Sync with Firestore
        try {
          await updateDoc(doc(db, 'users', currentUser.id), {
            signatureUrl: previewSignature
          });
        } catch (e) {
          console.warn('Firestore update warning (offline/fallback active):', e);
        }
      }

      // Update state
      setUserSavedSystemSignature(previewSignature);
      setCurrentSignature(previewSignature);
      if (currentUser?.name) {
        setSignerName(currentUser.name);
      }
      if (onApplySignature) {
        onApplySignature(previewSignature, currentUser?.name || signerName);
      }

      setSaveSuccessMsg('Assinatura guardada no sistema com sucesso!');
      setTimeout(() => {
        setSaveSuccessMsg(null);
        setIsOpenModal(false);
      }, 900);
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao guardar a assinatura.');
    } finally {
      setIsSavingToSystem(false);
    }
  };

  // Remove applied signature
  const handleRemoveSignature = () => {
    setCurrentSignature(null);
    if (onApplySignature) {
      onApplySignature(null, defaultSignerName);
    }
  };

  return (
    <div className="flex flex-col items-center text-center p-3 relative group">
      {/* Signature Render Box (Visualizes signature or manual rubric prompt) */}
      <div className="w-full h-24 flex items-end justify-center pb-1 relative">
        {currentSignature ? (
          <div className="relative flex flex-col items-center justify-end w-full h-full">
            <img 
              src={currentSignature} 
              alt="Assinatura Oficial" 
              className="max-h-20 max-w-full object-contain mix-blend-multiply [filter:contrast(115%)] drop-shadow-xs"
              style={{ mixBlendMode: 'multiply' }}
            />
            {!readOnly && (
              <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(true)}
                  title="Alterar Assinatura"
                  className="p-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 text-[10px] shadow-xs cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={handleRemoveSignature}
                  title="Remover Assinatura"
                  className="p-1 bg-white hover:bg-red-50 border border-red-200 rounded text-red-600 text-[10px] shadow-xs cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <PenTool className="h-5 w-5 mb-1 opacity-30 stroke-1" />
            <p className="text-[10px] italic">Espaço para assinatura / rubrica oficial</p>
          </div>
        )}
      </div>

      {/* Official Sign Line */}
      <div className="border-t border-slate-900 mx-auto w-4/5 my-1"></div>

      {/* Signer Title & Name */}
      <p className="text-xs font-black uppercase mt-1 text-slate-800 tracking-tight">{title}</p>
      <p className="text-[11px] text-slate-600 italic">({signerName || 'Assinatura Autorizada'})</p>
      {signerRoleDescription && (
        <span className="text-[9px] text-slate-400 block mt-0.5">{signerRoleDescription}</span>
      )}

      {/* Interactive Controls (Hidden during print) */}
      {!readOnly && (
        <div className="mt-3 flex flex-col gap-1.5 w-full max-w-[240px] no-print">
          {/* Option A: Apply existing signature of current user if found in system */}
          {userSavedSystemSignature ? (
            <button
              type="button"
              onClick={handleApplyUserSystemSignature}
              className={`w-full py-1.5 px-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer border ${
                currentSignature === userSavedSystemSignature
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 hover:shadow-md'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {currentSignature === userSavedSystemSignature 
                ? '✓ Assinatura do Logado Aplicada' 
                : 'Carregar Assinatura do Logado no Sistema'}
            </button>
          ) : (
            currentUser && (
              <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 flex items-center justify-center gap-1">
                <span>Nenhuma assinatura guardada no sistema</span>
              </div>
            )
          )}

          {/* Option B: Upload, draw and save signature to system */}
          <button
            type="button"
            onClick={() => {
              setPreviewSignature(userSavedSystemSignature || null);
              setIsOpenModal(true);
            }}
            className="w-full py-1.5 px-2.5 rounded-lg text-[10px] font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Upload className="h-3 w-3" />
            {userSavedSystemSignature ? 'Substituir ou Carregar Nova' : 'Carregar, Guardar e Aplicar'}
          </button>
        </div>
      )}

      {/* MODAL: CARREGAR, GUARDAR E APLICAR ASSINATURA */}
      {isOpenModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpenModal(false);
          }}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full text-left shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-fade-in">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                  <PenTool className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Assinatura Digital do Utilizador
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentUser?.name 
                      ? `Utilizador: ${currentUser.name} (${currentUser.role})`
                      : `Campo: ${title}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpenModal(false)}
                title="Fechar"
                aria-label="Fechar"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-5">
              {/* Tabs: Upload Scanned Image vs Draw on Canvas */}
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-colors cursor-pointer ${
                    activeTab === 'upload'
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  📁 Carregar Imagem / Digitalização
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('draw')}
                  className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-colors cursor-pointer ${
                    activeTab === 'draw'
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ✍️ Desenhar / Rubrica Manual
                </button>
              </div>

              {/* Tab 1: Upload */}
              {activeTab === 'upload' && (
                <div className="space-y-4">
                  <div 
                    onClick={() => document.getElementById(`sig-upload-input-${title}`)?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-xl p-5 text-center bg-slate-50 hover:bg-white cursor-pointer transition-colors space-y-2"
                  >
                    <input 
                      type="file" 
                      id={`sig-upload-input-${title}`}
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                    <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-800">
                      Clique para carregar foto ou scan da assinatura
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Formatos suportados: PNG, JPG, JPEG (O sistema remove automaticamente o fundo de papel branco)
                    </p>
                  </div>

                  {rawUpload && (
                    <div className="space-y-2 pt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>Ajustar Sensibilidade do Fundo</span>
                        <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                          {threshold} / 255
                        </span>
                      </div>
                      <input 
                        type="range"
                        min="140"
                        max="255"
                        value={threshold}
                        onChange={(e) => handleThresholdChange(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-300 rounded appearance-none cursor-pointer accent-slate-900"
                      />
                      <p className="text-[10px] text-slate-500">
                        Valores maiores removem tons de papel escaneado ou sombras de câmara.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Draw */}
              {activeTab === 'draw' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Assine com o rato ou dedo no ecrã:</span>
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="text-[11px] text-red-600 hover:underline font-bold"
                    >
                      Limpar Desenho
                    </button>
                  </div>
                  <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-inner">
                    <canvas
                      ref={canvasRef}
                      width={440}
                      height={150}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-36 touch-none cursor-crosshair bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Preview Box */}
              <div className="space-y-1.5">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Pré-visualização da Assinatura:
                </span>
                <div 
                  className="border border-slate-200 rounded-xl p-3 h-24 flex items-center justify-center overflow-hidden relative"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #f1f5f9 25%, transparent 25%), 
                      linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #f1f5f9 75%), 
                      linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)
                    `,
                    backgroundSize: '12px 12px',
                    backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0'
                  }}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <RefreshCw className="h-4 w-4 animate-spin text-emerald-600" />
                      <span>Removendo fundo do papel...</span>
                    </div>
                  ) : previewSignature ? (
                    <img 
                      src={previewSignature} 
                      alt="Pré-visualização" 
                      className="max-h-20 max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Nenhuma assinatura carregada ainda.
                    </span>
                  )}
                </div>
              </div>

              {saveSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2 animate-fade-in">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpenModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveToSystemAndApply}
                disabled={!previewSignature || isProcessing || isSavingToSystem}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isSavingToSystem ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>A Guardar no Perfil...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Guardar no Sistema e Aplicar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
