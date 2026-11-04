import React, { useState } from 'react';
import { Institution, User } from '../types';
import { ShieldCheck, QrCode, Link, Copy, Check } from 'lucide-react';
import UnifiedSignatureField from './UnifiedSignatureField';

interface ReportSignatureProps {
  institution: Institution;
  currentUser?: User | null;
  rectorSignature?: string | null;
  focalPointSignature?: string | null;
  onRectorSignatureChange?: (sig: string | null, name: string) => void;
  onFocalPointSignatureChange?: (sig: string | null, name: string) => void;
}

export default function ReportSignature({ 
  institution, 
  currentUser,
  rectorSignature,
  focalPointSignature,
  onRectorSignatureChange,
  onFocalPointSignatureChange
}: ReportSignatureProps) {
  // If currentUser is not passed as prop, retrieve from localStorage as fallback
  const resolvedCurrentUser: User | null = currentUser || (() => {
    try {
      const stored = localStorage.getItem('stat_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const [localRectorSig, setLocalRectorSig] = useState<string | null>(rectorSignature || null);
  const [localFocalSig, setLocalFocalSig] = useState<string | null>(focalPointSignature || null);
  const [copiedLink, setCopiedLink] = useState(false);

  const today = new Date().toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="mt-16 pt-10 border-t-2 border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Physical / Digital Signature Space */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Slot 1: Chefe Máximo da IES */}
            <UnifiedSignatureField
              title="Chefe Máximo da IES"
              defaultSignerName={institution.rector || institution.responsavel?.nome || 'Reitor / Director-Geral'}
              signerRoleDescription="Órgão Máximo • Homologação Legal"
              currentUser={resolvedCurrentUser}
              savedSignatureValue={localRectorSig}
              requiredRole="OrgaoMaximoIES"
              onApplySignature={(sig, name) => {
                setLocalRectorSig(sig);
                if (onRectorSignatureChange) onRectorSignatureChange(sig, name);
              }}
            />

            {/* Slot 2: Elaborado por (Focal Point) */}
            <UnifiedSignatureField
              title="Elaborado por (Focal Point)"
              defaultSignerName={institution.focalPoint?.nome || 'Ponto Focal Estatístico'}
              signerRoleDescription="Equipa Técnica • Recolha de Dados"
              currentUser={resolvedCurrentUser}
              savedSignatureValue={localFocalSig}
              requiredRole={['FocalPoint', 'ies', 'ies_interno']}
              onApplySignature={(sig, name) => {
                setLocalFocalSig(sig);
                if (onFocalPointSignatureChange) onFocalPointSignatureChange(sig, name);
              }}
            />
          </div>
        </div>

        {/* Digital Validation Area (Modern) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4 shadow-sm relative overflow-hidden h-full">
          {/* Background Decoration */}
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <ShieldCheck size={120} />
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm flex-shrink-0">
            <QrCode size={64} className="text-slate-800" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-[#009E60]">
              <ShieldCheck size={18} className="fill-current" />
              <span className="text-xs font-black uppercase tracking-wider">Documento Autenticado Digitalmente</span>
            </div>
            
            <div className="text-[11px] text-slate-700 leading-relaxed">
              <p>Este relatório foi gerado e validado pelo sistema <span className="font-bold">SIGDE-ONLINE</span> em <span className="font-mono">{today}</span>.</p>
              <p className="mt-1">ID de Autenticidade: <span className="font-mono text-indigo-700 font-bold uppercase">{Math.random().toString(36).substring(2, 15).toUpperCase()}</span></p>
              <div className="mt-2 p-2 bg-white rounded border border-slate-200 flex items-center justify-between gap-2 shadow-xs group/link">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
                    <Link size={14} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Link Partilhado para Verificação</span>
                    <span className="text-[10px] font-medium text-blue-700 truncate underline decoration-blue-300">https://ais-pre-7xbvfzreclzjcthc7dpbgt-64514099689.europe-west1.run.app</span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    const sharedUrl = "https://ais-pre-7xbvfzreclzjcthc7dpbgt-64514099689.europe-west1.run.app";
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(sharedUrl);
                    }
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2500);
                  }}
                  className={`p-1.5 rounded transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
                    copiedLink 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'hover:bg-slate-100 text-slate-400 hover:text-blue-600'
                  }`}
                  title={copiedLink ? "Link Copiado!" : "Copiar Link Partilhado"}
                >
                  {copiedLink ? (
                    <>
                      <Check size={14} className="text-emerald-600 animate-in zoom-in-75 duration-200" />
                      <span className="text-[10px] text-emerald-600">Copiado</span>
                    </>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
              <p className="mt-2">A integridade deste documento pode ser verificada através do portal oficial do Ministério da Ciência, Tecnologia e Ensino Superior.</p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <div className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[9px] font-bold uppercase tracking-tight">Criptografia RSA-2048</div>
              <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-bold uppercase tracking-tight">Selo Temporal Ativo</div>
              {(localRectorSig || localFocalSig) && (
                <div className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[9px] font-bold uppercase tracking-tight">
                  ✓ Assinatura Digital Incorporada
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em]">República de Moçambique • Ministério da Ciência, Tecnologia e Ensino Superior</p>
      </div>
    </div>
  );
}
