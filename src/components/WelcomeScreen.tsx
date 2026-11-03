import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { MOZAMBIQUE_EMBLEM } from '../constants/assets';
import { User, Institution } from '../types';

import TestUserList from './TestUserList';
import FullscreenImageModal from './FullscreenImageModal';

interface WelcomeScreenProps {
  user: User;
  institutions: Institution[];
  year: number;
  onComplete: () => void;
  registeredAccounts: any[];
}

export default function WelcomeScreen({ user, institutions, year, onComplete, registeredAccounts }: WelcomeScreenProps) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Find the province of the user's IES if applicable
  const getProvinceDisplay = () => {
    if (user.province) {
      return user.province;
    }
    if (user.institutionId) {
      const inst = institutions.find(i => i.id === user.institutionId);
      if (inst?.province) return inst.province;
    }
    return 'Gaza';
  };

  const getRoleBadgeLabel = () => {
    switch (user.role) {
      case 'sistema': return 'Administrador do Sistema';
      case 'Ministerial': return 'Representante do Ministério';
      case 'RepresentanteRegional': return 'Representante Regional';
      case 'RepresentanteProvincial': return 'Representante Provincial';
      case 'OrgaoMaximoIES': return 'Órgão Máximo da IES';
      case 'FocalPoint': return 'Focal Point Institucional';
      case 'ies': return 'Representante IES';
      default: return 'Utilizador Homologado';
    }
  };

  const anoEstatistico = year;

  useEffect(() => {
    const duration = 3000; // 3 segundos
    const startTime = Date.now();

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressValue = Math.min((elapsed / duration) * 100, 100);
      
      const currentVal = progressValue >= 99.5 ? 100 : Math.floor(progressValue);
      setProgress(currentVal);
      
      if (progressValue >= 100) {
        clearInterval(intervalId);
        setTimeout(() => {
          onCompleteRef.current();
        }, 200);
      }
    }, 30);

    return () => clearInterval(intervalId);
  }, []);

  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#090e1a] text-white p-4 select-none overflow-y-auto"
      id="welcome-portal-overlay"
    >
      <FullscreenImageModal 
        isOpen={!!fullscreenImage} 
        onClose={() => setFullscreenImage(null)} 
        imageSrc={fullscreenImage} 
      />

      <motion.div 
        className="w-full max-w-[460px] bg-[#152033] border border-[#1f2d47] rounded-[28px] p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center text-center select-none relative z-10 welcome-screen-reset"
        style={{ textAlign: 'center' }}
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <style>{`
          .welcome-screen-reset p, 
          .welcome-screen-reset h1, 
          .welcome-screen-reset h2, 
          .welcome-screen-reset h3 {
            text-align: center !important;
            justify-content: center !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
        `}</style>
        {/* 1. National Emblem - Vivid foreground, perfectly crisp and bright as in original */}
        <div 
          className="w-[9rem] h-[9rem] flex items-center justify-center bg-transparent cursor-pointer hover:scale-105 transition-transform relative z-20"
          onClick={() => setFullscreenImage(MOZAMBIQUE_EMBLEM)}
          title="Clique para ver em tela cheia"
        >
          <img 
            src="/emblem_transparent_vivid.png" 
            alt="República de Moçambique" 
            className="w-full h-full object-contain [image-rendering:high-quality] drop-shadow-md select-none" 
          />
        </div>

        {/* 2. Official Institutional Titles - 100% Centered */}
        <div className="w-full text-center mt-3 space-y-1 flex flex-col items-center justify-center">
          <p className="text-[11px] sm:text-xs text-[#00df82] font-black tracking-[0.2em] uppercase leading-none w-full !text-center">
            REPÚBLICA DE MOÇAMBIQUE
          </p>
          <p className="text-[10px] sm:text-[11px] text-white font-black tracking-[0.08em] uppercase leading-none pt-0.5 w-full !text-center">
            MINISTÉRIO DE EDUCAÇÃO E CULTURA
          </p>
          <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold tracking-[0.05em] uppercase leading-none pt-0.5 w-full !text-center">
            DIREÇÃO NACIONAL DE ENSINO SUPERIOR (DNES)
          </p>
        </div>

        {/* 3. Welcome Heading - 100% Centered */}
        <h1 className="text-2xl sm:text-[28px] font-black text-white tracking-tight !text-center leading-tight mt-6 w-full">
          {user.name}, Bem-vindo<br />à DNES ({anoEstatistico})
        </h1>

        {/* 4. Province Badge - 100% Centered */}
        <div className="w-full !text-center mt-2.5">
          <p className="text-sm font-black text-[#00df82] uppercase tracking-wider !text-center font-mono w-full">
            PROVÍNCIA DA IES: {getProvinceDisplay()}
          </p>
        </div>

        {/* 5. Role Badge - 100% Centered */}
        <div className="w-full !text-center mt-3">
          <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-[0.18em] font-black !text-center font-mono w-full">
            PERFIL HOMOLOGADO: {getRoleBadgeLabel().toUpperCase()}
          </p>
        </div>

        {/* 6. Test User Selector Button */}
        <div className="w-full mt-6">
          <TestUserList accounts={registeredAccounts} onSelectAccount={() => {}} />
        </div>

        {/* 7. Progress Bar */}
        <div className="w-full space-y-3 mt-6">
          <div className="w-full h-2.5 sm:h-3 bg-[#060b17] rounded-full overflow-hidden border border-slate-800 p-[1px]">
            <div 
              className="h-full rounded-full transition-all duration-75 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #22c55e 0%, #06b6d4 55%, #818cf8 100%)',
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.4)'
              }}
            />
          </div>

          {/* 8. Progress label and percentage - 100% Centered */}
          <div className="flex flex-col items-center justify-center gap-1.5 text-xs font-mono text-center w-full mt-2" style={{ textAlign: 'center' }}>
            <span className="uppercase tracking-wider font-black text-[11px] text-[#00df82] text-center w-full" style={{ textAlign: 'center' }}>
              A CARREGAR PAINEL DE RECOLHA... ({progress}%)
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
