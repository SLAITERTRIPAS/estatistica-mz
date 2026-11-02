import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { MOZAMBIQUE_EMBLEM } from '../constants/assets';
import { User, Institution } from '../types';

import TestUserList from './TestUserList';

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
    return 'Nível Central • Maputo Cidade';
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
        // Pequeno atraso para a animação completar visualmente antes da transição
        setTimeout(() => {
          onCompleteRef.current();
        }, 200);
      }
    }, 30);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-white overflow-y-auto p-4 sm:p-6 select-none"
      id="welcome-portal-overlay"
    >
      <style>{`
        @keyframes rgbFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .rgb-progress-bar-fill {
          background: linear-gradient(90deg, #ff4545, #ffee55, #44ff44, #33bbff, #ee44ff, #ff4545);
          background-size: 300% 300%;
          animation: rgbFlow 3.5s linear infinite;
        }
        .ambient-rgb-glow {
          box-shadow: 0 0 20px rgba(68, 255, 68, 0.4), 0 0 40px rgba(33, 187, 255, 0.2);
        }
      `}</style>
      
      {/* Background radial soft light for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.5)_0%,rgba(15,23,42,1)_100%)] z-0" />

      <motion.div 
        className="relative z-10 w-full max-w-xl flex flex-col items-center bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-4 sm:p-8 md:p-12 shadow-2xl space-y-4 sm:space-y-8"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* State/National Emblem Header */}
        <motion.div 
          className="flex flex-col items-center space-y-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="rounded-2xl p-2 w-32 h-32 flex items-center justify-center bg-transparent">
            <img 
              src={MOZAMBIQUE_EMBLEM} 
              alt="República de Moçambique" 
              className="w-full h-full object-contain mix-blend-multiply [filter:contrast(106%)_brightness(102%)]" 
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
          <p className="text-xs text-emerald-400 font-black tracking-[0.25em] uppercase text-center mt-2">
            REPÚBLICA DE MOÇAMBIQUE
          </p>
          <p className="text-xs text-slate-300 font-black tracking-[0.1em] uppercase text-center leading-none">
            MINISTÉRIO DE EDUCAÇÃO E CULTURA
          </p>
          <p className="text-xs text-slate-400 font-bold tracking-[0.05em] uppercase text-center leading-none mt-1">
            DIREÇÃO NACIONAL DE ENSINO SUPERIOR (DNES)
          </p>
        </motion.div>

        {/* Welcome greeting */}
        <div className="text-center space-y-4 w-full">
          <motion.h1 
            className="text-2xl md:text-3xl font-black  text-slate-100 tracking-tight leading-snug"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {user.name}, Bem-vindo à DNES ({anoEstatistico})
          </motion.h1>

          <motion.p 
            className="text-md font-mono text-emerald-400 uppercase tracking-widest font-black"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Província da IES: {getProvinceDisplay()}
          </motion.p>

          <motion.div 
            className="text-xs text-slate-400 uppercase tracking-widest font-bold font-mono block mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Perfil Homologado: {getRoleBadgeLabel()}
          </motion.div>
        </div>

        {/* Test User List */}
        <TestUserList accounts={registeredAccounts} onSelectAccount={() => {}} />

        {/* Progress Bar Container */}
        <motion.div 
          className="w-full space-y-4 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {/* Progress bar outer container */}
          <div className="relative w-full h-4 bg-slate-950 rounded-full overflow-hidden p-[2px] border border-slate-700/50">
            {/* The actual RGB filled sliding track */}
            <div 
              className="h-full rounded-full rgb-progress-bar-fill ambient-rgb-glow"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Reads percentage accompanying progress */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="uppercase tracking-widest font-black text-xs text-emerald-400">
              A carregar painel de recolha...
            </span>
            <span className="text-sm font-black text-slate-100 bg-slate-950 font-mono px-2.5 py-1 rounded-md border border-slate-800">
              {progress}%
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer Branding */}
      <motion.div 
        className="absolute bottom-6 z-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">
          SIGDE- ONLINE • Sistema Integrado de Gestão do Ensino Superior
        </p>
      </motion.div>
    </div>
  );
}
