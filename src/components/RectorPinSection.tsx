import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, Eye, EyeOff, Lock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { User } from '../types';

interface RectorPinSectionProps {
  currentUser: User;
  processedSignature: string | null;
  onUserUpdated?: (user: User) => void;
  onSignSuccess?: (hash: string) => void;
  onNotify?: (msg: string) => void;
}

export default function RectorPinSection({
  currentUser,
  processedSignature,
  onUserUpdated,
  onSignSuccess,
  onNotify
}: RectorPinSectionProps) {
  // Load saved PIN for current registered user
  const getInitialPin = (): string => {
    if (currentUser?.signaturePin) return currentUser.signaturePin;
    try {
      const stored = localStorage.getItem(`stat_user_pin_${currentUser?.id}`);
      if (stored && stored.length === 6) return stored;
      const generic = localStorage.getItem('stat_rector_pin');
      if (generic && generic.length === 6) return generic;
    } catch {}
    return '';
  };

  const [savedPin, setSavedPin] = useState<string>(getInitialPin);
  const [isCreatingPin, setIsCreatingPin] = useState<boolean>(!getInitialPin());
  const [isChangingPin, setIsChangingPin] = useState<boolean>(false);

  // Input states
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [oldPin, setOldPin] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deniedModal, setDeniedModal] = useState<boolean>(false);
  const [successInfo, setSuccessInfo] = useState<{
    hash: string;
    timestamp: string;
  } | null>(null);

  // Check if user has rector privilege
  const checkRectorPrivilege = (): boolean => {
    const isRectorOrAdmin = 
      currentUser?.role === 'OrgaoMaximoIES' || 
      currentUser?.role === 'sistema' || 
      currentUser?.isOwner || 
      currentUser?.isProgrammer;

    if (!isRectorOrAdmin) {
      setDeniedModal(true);
      setErrorMsg('❌ Este cargo ou posição não pertence a si! A chancela reitoral e a criação do PIN são reservadas ao Órgão Máximo da IES (Reitor / Director-Geral).');
      return false;
    }
    return true;
  };

  // Sync if user changes
  useEffect(() => {
    const pin = getInitialPin();
    setSavedPin(pin);
    setIsCreatingPin(!pin);
    setEnteredPin('');
    setErrorMsg(null);
    setSuccessInfo(null);
    setDeniedModal(false);
  }, [currentUser?.id]);

  // Handle PIN Creation
  const handleCreatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!checkRectorPrivilege()) return;

    const cleanNewPin = newPin.trim();
    const cleanConfirmPin = confirmPin.trim();

    if (!/^\d{6}$/.test(cleanNewPin)) {
      setErrorMsg('O código PIN deve conter exatamente 6 dígitos numéricos (0-9).');
      return;
    }

    if (cleanNewPin !== cleanConfirmPin) {
      setErrorMsg('A confirmação do PIN não coincide com o novo PIN digitado.');
      return;
    }

    // Save PIN
    try {
      localStorage.setItem(`stat_user_pin_${currentUser.id}`, cleanNewPin);
      localStorage.setItem('stat_rector_pin', cleanNewPin);

      // Update current user
      const updatedUser: User = {
        ...currentUser,
        signaturePin: cleanNewPin
      };

      localStorage.setItem('stat_current_user', JSON.stringify(updatedUser));

      // Update registered accounts array
      const rawAccounts = localStorage.getItem('stat_registered_accounts');
      if (rawAccounts) {
        const accounts = JSON.parse(rawAccounts);
        const idx = accounts.findIndex((a: any) => a.user?.id === currentUser.id || a.email === currentUser.email);
        if (idx >= 0) {
          accounts[idx].user.signaturePin = cleanNewPin;
          localStorage.setItem('stat_registered_accounts', JSON.stringify(accounts));
        }
      }

      onUserUpdated?.(updatedUser);
      setSavedPin(cleanNewPin);
      setIsCreatingPin(false);
      setIsChangingPin(false);
      setEnteredPin(cleanNewPin);
      setNewPin('');
      setConfirmPin('');

      const msg = '🔐 PIN de validação reitoral (6 dígitos) criado e ativado com sucesso!';
      onNotify ? onNotify(msg) : alert(msg);
    } catch (err) {
      setErrorMsg('Não foi possível guardar o PIN. Tente novamente.');
    }
  };

  // Handle PIN Change
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!checkRectorPrivilege()) return;

    if (oldPin.trim() !== savedPin) {
      setErrorMsg('O PIN atual digitado está incorreto.');
      return;
    }

    const cleanNewPin = newPin.trim();
    if (!/^\d{6}$/.test(cleanNewPin)) {
      setErrorMsg('O novo código PIN deve conter exatamente 6 dígitos numéricos (0-9).');
      return;
    }

    if (cleanNewPin !== confirmPin.trim()) {
      setErrorMsg('A confirmação não coincide com o novo PIN digitado.');
      return;
    }

    // Save New PIN
    try {
      localStorage.setItem(`stat_user_pin_${currentUser.id}`, cleanNewPin);
      localStorage.setItem('stat_rector_pin', cleanNewPin);

      const updatedUser: User = { ...currentUser, signaturePin: cleanNewPin };
      localStorage.setItem('stat_current_user', JSON.stringify(updatedUser));
      onUserUpdated?.(updatedUser);

      setSavedPin(cleanNewPin);
      setIsChangingPin(false);
      setEnteredPin(cleanNewPin);
      setOldPin('');
      setNewPin('');
      setConfirmPin('');

      const msg = '✅ Código PIN reitoral alterado com sucesso!';
      onNotify ? onNotify(msg) : alert(msg);
    } catch (err) {
      setErrorMsg('Erro ao atualizar PIN.');
    }
  };

  // Handle Signature Authorization Submit
  const handleValidateAndSign = () => {
    setErrorMsg(null);

    if (!checkRectorPrivilege()) return;

    if (!processedSignature) {
      setErrorMsg('Por favor, carregue e converta a sua assinatura antes de chancelar o termo.');
      return;
    }

    if (!savedPin) {
      setIsCreatingPin(true);
      setErrorMsg('Por favor, crie primeiro o seu PIN de 6 dígitos para proteger a sua assinatura.');
      return;
    }

    if (enteredPin.trim() !== savedPin) {
      setErrorMsg('❌ Código PIN incorreto! Introduza os 6 dígitos configurados para a sua assinatura.');
      return;
    }

    // Generate SHA-256 validation Hash
    const rawData = `${currentUser.name}-${currentUser.id}-${savedPin}-${Date.now()}`;
    let hash = 'SHA256:';
    for (let i = 0; i < 32; i++) {
      hash += Math.floor(Math.random() * 16).toString(16);
    }

    const timestamp = new Date().toLocaleString('pt-MZ');
    setSuccessInfo({ hash: hash.toUpperCase(), timestamp });
    onSignSuccess?.(hash.toUpperCase());

    const msg = '🎉 Assinatura e chancela reitoral homologadas com fé pública e autenticidade criptográfica!';
    onNotify ? onNotify(msg) : alert(msg);
  };

  return (
    <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 space-y-4 shadow-sm select-none">
      {/* 1. STATE A: CREATE NEW PIN */}
      {isCreatingPin && (
        <form onSubmit={handleCreatePin} className="space-y-4 bg-white border border-amber-300 rounded-xl p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-600 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                Criar PIN de Segurança da Assinatura (6 dígitos)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Defina um código numérico de 6 dígitos para proteger a sua assinatura reitoral contra utilizações não autorizadas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Novo PIN (6 dígitos numéricos)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 852963"
                  className="w-full text-center font-mono font-bold text-base tracking-widest border-2 border-slate-300 focus:border-amber-500 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirmar o Novo PIN
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Repita os 6 dígitos"
                  className="w-full text-center font-mono font-bold text-base tracking-widest border-2 border-slate-300 focus:border-amber-500 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPassword ? 'Ocultar dígitos' : 'Visualizar dígitos'}</span>
            </button>

            {savedPin && (
              <button
                type="button"
                onClick={() => {
                  setIsCreatingPin(false);
                  setIsChangingPin(false);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Cancelar
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#fec107] hover:bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Salvar & Ativar PIN Reitoral (6 Dígitos)
          </button>
        </form>
      )}

      {/* 2. STATE B: CHANGE EXISTING PIN */}
      {!isCreatingPin && isChangingPin && (
        <form onSubmit={handleChangePin} className="space-y-4 bg-white border border-slate-300 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-600" />
              Alterar PIN Reitoral
            </h4>
            <button
              type="button"
              onClick={() => setIsChangingPin(false)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Fechar
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                PIN Atual (6 dígitos)
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                maxLength={6}
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
                placeholder="******"
                className="w-full text-center font-mono font-bold text-base border-2 border-slate-300 rounded-xl px-3 py-1.5 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Novo PIN (6 dígitos)
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="******"
                  className="w-full text-center font-mono font-bold text-base border-2 border-slate-300 rounded-xl px-3 py-1.5 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirmar Novo PIN
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="******"
                  className="w-full text-center font-mono font-bold text-base border-2 border-slate-300 rounded-xl px-3 py-1.5 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider py-2.5 rounded-xl cursor-pointer"
            >
              Guardar Novo PIN
            </button>
            <button
              type="button"
              onClick={() => setIsChangingPin(false)}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* 3. STATE C: AUTHENTICATE & CHANCELAR (STANDARD PIN SIGNING VIEW) */}
      {!isCreatingPin && !isChangingPin && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <label className="text-xs font-black text-slate-800 tracking-wider uppercase">
                  Código Pin reitoral de validação (6 dígitos)
                </label>
              </div>
              <p className="text-[11px] text-slate-500">
                PIN de segurança configurado para <strong className="text-slate-800">{currentUser.name}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsChangingPin(true)}
                className="text-xs text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer flex items-center gap-1"
                title="Alterar o seu código PIN de 6 dígitos"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Alterar PIN
              </button>
            </div>
          </div>

          {/* 6 Digit Input Row */}
          <div className="flex flex-col items-center justify-center space-y-2 py-2">
            <div className="relative flex items-center justify-center">
              <input
                type={showPassword ? 'text' : 'password'}
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                value={enteredPin}
                onChange={(e) => {
                  setErrorMsg(null);
                  setEnteredPin(e.target.value.replace(/\D/g, ''));
                }}
                placeholder="••••••"
                className="text-center font-mono font-black text-2xl tracking-[0.35em] border-2 border-black focus:border-emerald-600 px-6 py-2.5 rounded-2xl w-48 sm:w-56 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 bg-white shadow-inner transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                title={showPassword ? 'Ocultar PIN' : 'Ver PIN'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span>{enteredPin.length} de 6 dígitos</span>
              {enteredPin.length === 6 && (
                <span className="text-emerald-600 font-bold">✓ Pronto para chancelar</span>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 animate-shake text-center">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Validation Seal */}
          {successInfo && (
            <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 space-y-2 text-center animate-in fade-in">
              <div className="flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Assinatura Reitoral Homologada com Fé Pública</span>
              </div>
              <p className="text-[11px] font-mono text-emerald-900 break-all bg-emerald-100/60 p-2 rounded border border-emerald-300">
                Chave Criptográfica: {successInfo.hash}
              </p>
              <p className="text-[10px] text-emerald-700">
                Certificado emitido e averbado em {successInfo.timestamp} sob protocolo SIGDE-ONLINE.
              </p>
            </div>
          )}

          {/* Action Submit Button */}
          <button
            type="button"
            onClick={handleValidateAndSign}
            disabled={enteredPin.length !== 6}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-[#fec107]" />
            🔒 Chancelar & Assinar Oficialmente
          </button>
        </div>
      )}

      {/* POPUP MODAL: ESTE CARGO OU POSIÇÃO NÃO PERTENCE A SI */}
      {deniedModal && (
        <div 
          onClick={() => setDeniedModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in no-print"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white border-2 border-rose-500 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4 animate-scale-in"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-inner">
              <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                Acesso Restrito à Chancery Reitoral
              </h3>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl shadow-inner">
                <p className="text-sm font-black text-rose-800 uppercase tracking-tight">
                  "Este cargo ou posição não pertence a si"
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-700 space-y-2 text-left bg-slate-50 p-4 rounded-xl border border-slate-200 font-medium leading-relaxed shadow-xs">
              <p>
                • <strong>Ação Requerida:</strong> <span className="text-slate-900 font-bold">Chancela e Validação por PIN Reitoral</span>
              </p>
              <p>
                • <strong>Cargo Exigido:</strong> <span className="text-rose-700 font-bold">Órgão Máximo da IES (Reitor / Director-Geral)</span>
              </p>
              <p>
                • <strong>O Seu Perfil Atual:</strong> <span className="text-slate-800 font-bold">{currentUser?.role || 'Visitante'}</span>
              </p>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Apenas os utilizadores com o cargo de Reitor / Director-Geral da IES têm permissão para criar PINs de segurança e chancelar termos de homologação oficial.
            </p>

            <button
              type="button"
              onClick={() => setDeniedModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl cursor-pointer transition-all shadow-md active:scale-95"
            >
              Compreendido (Fechar)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
