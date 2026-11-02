import React, { useState, useEffect } from 'react';
import { Landmark, ArrowRight, CheckCircle2, GraduationCap, Award, FileText, Calendar, ShieldCheck, Check, Clock, AlertTriangle, Link, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { MOZAMBIQUE_EMBLEM } from '../constants/assets';

import TestUserList from './TestUserList';
interface CoverPageProps {
  onEnterLogin: () => void;
  onEnterRegister: () => void;
  onViewProject?: () => void;
  registeredAccounts: any[];
  onAutoLogin: (account: any) => void;
}

export default function CoverPage({ onEnterLogin, onEnterRegister, onViewProject, registeredAccounts, onAutoLogin }: CoverPageProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('stat_calendar_events');
    const loadedEvents = saved ? JSON.parse(saved) : [];
    const hasConvite = loadedEvents.some((e: any) => e.type === 'convite');
    if (saved && hasConvite) {
      setEvents(loadedEvents);
    } else {
      const initial = [
        {
          id: "evt-1",
          title: "Workshop de Apoio Técnico SIGDE- ONLINE 2026",
          type: "seminario",
          date: "2026-06-15",
          description: "Seminário de esclarecimento técnico sobre o preenchimento dos 8 eixos de coleta para todas as IES.",
          location: "Virtual (Teams / Zoom)",
          createdBy: "Dra. Maria Helena (Central Auditor)",
          createdAt: "2026-06-10"
        },
        {
          id: "evt-2",
          title: "Encontro de Saneamento Provincial de Gaza",
          type: "encontro",
          date: "2026-06-20",
          description: "Reunião de auditoria com os pontos focais das IES da Província de Gaza.",
          location: "Geralda Hotel, Xai-Xai",
          createdBy: "Dr. Afonso Muchanga (Gabinete de Gaza)",
          createdAt: "2026-06-11"
        },
        {
          id: "evt-3",
          title: "Prazo Limite de Entrega - Estatística Moçambique 2026",
          type: "coleta",
          date: "2026-06-30",
          description: "Data limite absoluta para homologação reitoral e submissão dos dados estatísticos na plataforma online.",
          location: "Nacional (Portal SIGDE- ONLINE)",
          createdBy: "Direcção Nacional MEC",
          createdAt: "2026-06-08"
        },
        {
          id: "evt-4",
          title: "Convite para Gala de Premiação Académica 2026",
          type: "convite",
          date: "2026-07-05",
          description: "Cerimónia nacional de premiação das instituições de ensino superior com melhores índices de desempenho e conformidade estatística.",
          location: "Centro de Conferências Joaquim Chissano, Maputo",
          createdBy: "Ministro do MEC",
          createdAt: "2026-06-12"
        }
      ];
      const finalEvents = saved ? [...loadedEvents, initial[3]] : initial;
      setEvents(finalEvents);
      localStorage.setItem('stat_calendar_events', JSON.stringify(finalEvents));
    }
  }, []);

  const [simulatedDate, setSimulatedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const today = simulatedDate;

  // Filter events based on:
  // - Show on the actual scheduled date matches today (dia de execução inicial / dia agendado)
  // - Fixed/pinned if it's a collection deadline (coleta) and there are 3 days or less remaining to the deadline
  const filteredEvents = events.filter((evt) => {
    // Critical Information: shown for 48h after creation
    if (evt.type === 'critica' && evt.createdAt) {
      const created = new Date(evt.createdAt).getTime();
      const now = new Date().getTime();
      const diffHours = (now - created) / (1000 * 60 * 60);
      if (diffHours <= 48) return true;
    }

    if (!evt.date) return false;
    
    // Exact match on standard date format YYYY-MM-DD
    if (evt.date === today) {
      return true;
    }

    // Only "coleta" representing "fim do prazo" gets pinned 3 days before
    const isDeadline = evt.type === 'coleta';
    if (isDeadline) {
      const eventDateObj = new Date(evt.date + 'T00:00:00');
      const todayDateObj = new Date(today + 'T00:00:00');
      const timeDiff = eventDateObj.getTime() - todayDateObj.getTime();
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // Pin permanently during the final 5 days leading to the event/deadline
      if (diffDays >= 0 && diffDays <= 5) {
        return true;
      }
    }

    return false;
  });

  if (activeEventId) {
    const selectedEvent = events.find(e => e.id === activeEventId);
    if (selectedEvent) {
      return (
        <div id="independent-event-page" className="min-h-[calc(100vh-80px)] w-full bg-[#f1f5f9] text-slate-800 p-4 sm:p-8 flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl w-full bg-white border-2 border-black rounded-2xl p-6 sm:p-12 shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-8 flex-1 flex flex-col justify-between"
          >
            {/* Top Back navigation */}
            <div className="flex justify-between items-center border-b-2 border-dashed border-slate-200 pb-6 w-full">
              <button
                onClick={() => setActiveEventId(null)}
                className="inline-flex items-center gap-2 bg-[#009E60] hover:bg-[#008751] text-white font-black text-sm px-4 py-2.5 rounded-xl border-2 border-black active:translate-y-[1px] transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              >
                <span>← Voltar à Capa</span>
              </button>
              
              <div className="text-right text-xs font-mono text-slate-500 font-extrabold">
                COMUNICADO: {selectedEvent.id.toUpperCase()}
              </div>
            </div>

            {/* Ministry Brand Header */}
          <div className="text-center space-y-3 pt-4">
              <div className="relative flex items-center justify-center w-16 h-16 mx-auto bg-transparent">
                <img 
                  src={MOZAMBIQUE_EMBLEM}
                  alt="Emblema de Moçambique" 
                  className="w-full h-full object-contain mix-blend-multiply [filter:contrast(106%)_brightness(102%)]"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-black tracking-widest text-slate-900 uppercase">
                  REPÚBLICA DE MOÇAMBIQUE
                </h3>
                <h5 className="text-xs font-black tracking-wider text-slate-900 uppercase leading-snug">
                  MINISTÉRIO DE EDUCAÇÃO E CULTURA
                </h5>
                <p className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                  DIREÇÃO NACIONAL DE ENSINO SUPERIOR
                </p>
              </div>
            </div>

            {/* Event Title Card */}
            <div className="space-y-6 flex-1 py-4 text-center sm:text-left">
              <div className="inline-block">
                <span className={`text-xs font-black tracking-widest uppercase border-2 border-black px-4 py-1.5 rounded-full inline-block  shadow-[1px_1px_0px_rgba(0,0,0,1)] ${
                  selectedEvent.type === 'encontro' ? 'bg-indigo-50 text-indigo-900' :
                  selectedEvent.type === 'seminario' ? 'bg-amber-100 text-[#b45309]' :
                  selectedEvent.type === 'coleta' ? 'bg-red-100 text-red-900' :
                  selectedEvent.type === 'critica' ? 'bg-red-600 text-white border-red-800' :
                  selectedEvent.type === 'convite' ? 'bg-emerald-50 text-emerald-900' : 'bg-slate-100 text-slate-900'
                }`}>
                  Circular Estatística • {
                    selectedEvent.type === 'encontro' ? 'Encontro de Trabalho' :
                    selectedEvent.type === 'seminario' ? 'Seminário de Capacitação' :
                    selectedEvent.type === 'coleta' ? 'Aviso Crítico de Prazo' :
                    selectedEvent.type === 'critica' ? 'ALERTA: INFORMAÇÃO CRÍTICA' :
                    selectedEvent.type === 'convite' ? 'Convite Oficial' : 'Informativo Geral'
                  }
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-black text-slate-950 leading-tight">
                {selectedEvent.title}
              </h1>

              {/* Grid of coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="border-2 border-black bg-slate-50 p-4 rounded-xl flex items-start gap-3 shadow-[2px_2px_0px_rgba(0,0,0,1)] text-left">
                  <span className="text-lg mt-0.5">📅</span>
                  <div>
                    <span className="text-xs text-slate-400 font-extrabold block uppercase tracking-wider">DATA AGENDADA</span>
                    <span className="text-sm font-mono font-black text-slate-900">
                      {selectedEvent.date.split('-').reverse().join('/')}
                    </span>
                  </div>
                </div>

                <div className="border-2 border-black bg-slate-50 p-4 rounded-xl flex items-start gap-3 shadow-[2px_2px_0px_rgba(0,0,0,1)] text-left">
                  <span className="text-lg mt-0.5">📍</span>
                  <div>
                    <span className="text-xs text-slate-400 font-extrabold block uppercase tracking-wider">LOCALIZAÇÃO / MEIO</span>
                    <span className="text-sm font-black text-slate-900 leading-tight block">
                      {selectedEvent.location || 'Não especificado'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Body Description */}
              <div className="border-l-4 border-[#009E60] pl-4 py-1.5 text-justify space-y-3">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedEvent.description}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Este comunicado oficial serve de notificação direta para os todos os órgãos provinciais de recolha bem como as lideranças e pontos focais institucionais para garantia absoluta da integridade estatística do projeto SIGDE- ONLINE.
                </p>
              </div>

              {/* Technical guidance panel */}
              <div className="bg-[#e6f4ea] border-2 border-black rounded-xl p-4 text-sm text-slate-800 leading-relaxed shadow-[2px_2px_0px_rgba(0,0,0,1)] space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-base">💡</span>
                  <span className="font-black text-xs uppercase tracking-wider">Orientação aos Integrantes do Sistema</span>
                </div>
                <p>
                  Sugerimos que as equipas confiram semanalmente o estado das fichas de resposta e rascunhos. Recomendamos assegurar reuniões de alinhamento com a nossa equipa central de validação para mitigar inconsistências estruturais.
                </p>
              </div>
            </div>

            {/* Official Signature block replica */}
            <div className="border-t-2 border-dashed border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-6 w-full">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider block">Emitido por:</span>
                <p className="text-sm font-black text-slate-900">
                  {selectedEvent.createdBy || 'Direcção de Estatística'}
                </p>
                <p className="text-xs text-slate-500 leading-none uppercase tracking-wider font-semibold">
                  Minedh • Moçambique
                </p>
              </div>

              <div className="text-center border-2 border-black rounded-lg py-2 px-4 bg-slate-50 font-mono text-sm font-bold text-slate-700 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                ⭐ Homologação SIGDE- ONLINE Central
              </div>
            </div>

          </motion.div>
        </div>
      );
    }
  }

  return (
    <div id="cover-outer-container" className="py-8 px-4 sm:px-8 lg:px-12 w-full min-h-[calc(100vh-80px)] flex flex-col justify-center max-w-7xl mx-auto">
      
      {/* High-Fidelity Cover Design centered */}
      <div className="w-full flex flex-col justify-center items-center py-6">
        <motion.div
          id="brand-cover-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-2xl mx-auto flex flex-col justify-center gap-6 sm:gap-12 text-slate-800 min-h-[auto] sm:min-h-[500px] flex-1 text-center select-none py-4"
        >
          {/* Section 1: Official Headings & Logo */}
          <div className="space-y-4 text-center pt-2">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="flex items-center justify-center mb-1">
                {/* National Emblem - Centered and responsive, background completely removed */}
                <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 bg-transparent">
                  <img
                    src={MOZAMBIQUE_EMBLEM}
                    alt="Emblema da República de Moçambique"
                    className="w-full h-full object-contain mix-blend-multiply [filter:contrast(106%)_brightness(102%)] select-none pointer-events-none"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </div>
              </div>
            
              <div className="space-y-1 text-center">
                <h3 className="text-sm sm:text-base font-black tracking-widest text-slate-900 uppercase">
                  REPÚBLICA DE MOÇAMBIQUE
                </h3>
                <h4 className="text-xs sm:text-sm font-black tracking-wider text-slate-900 uppercase leading-snug">
                  MINISTÉRIO DE EDUCAÇÃO E CULTURA
                </h4>
                <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-[#009E60] mx-auto my-2 sm:my-3"></div>
                <p className="text-xs sm:text-sm font-black tracking-wider text-slate-800 uppercase">
                  DIREÇÃO NACIONAL DE ENSINO SUPERIOR
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Main Document Titles (Centered) */}
          <div className="my-auto space-y-4 text-center py-4">
            <div className="space-y-2">                
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-tight space-y-1">
                <span className="block text-slate-900 font-extrabold uppercase">SISTEMA INTEGRADO</span>
                <span className="block text-[#009E60] font-extrabold uppercase">DE GESTÃO DE DADOS ESTATÍSTICOS</span>
              </h1>
              
              <div className="text-sm sm:text-lg font-bold text-slate-700 font-mono tracking-widest pt-1 uppercase">
                (SIGDE- ONLINE MOÇAMBIQUE)
              </div>
            </div>
          </div>

          {/* Section: Dynamic Alerts/Events */}
          {filteredEvents.length > 0 && (
            <div className="w-full max-w-xl mx-auto space-y-3 pt-2 no-print">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="h-[2px] bg-red-600 w-6"></div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Informações & Prazos</span>
                <div className="h-[2px] bg-red-600 w-6"></div>
              </div>
              <div className="space-y-3">
                {filteredEvents.map(evt => (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setActiveEventId(evt.id)}
                    className="group bg-white border-2 border-black p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] ${
                        evt.type === 'critica' ? 'bg-red-600 text-white' : 
                        evt.type === 'coleta' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {evt.type === 'critica' ? <AlertTriangle className="h-5 w-5" /> : 
                         evt.type === 'coleta' ? <Clock className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                      </div>
                      <div className="text-left space-y-0.5">
                        <div className="flex items-center gap-2">
                           <span className={`text-xs font-black uppercase px-2 py-0.5 rounded border border-black ${
                             evt.type === 'critica' ? 'bg-red-100 text-red-900 border-red-950' : 'bg-slate-50 text-slate-600'
                           }`}>
                             {evt.type === 'critica' ? 'Urgente' : 'Informativo'}
                           </span>
                        </div>
                        <h4 className="text-sm font-black tracking-tight text-slate-900 uppercase line-clamp-1">{evt.title}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {evt.type === 'critica' ? 'Disponível por 48h' : (evt.date ? evt.date.split('-').reverse().join('/') : '---')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                       <span className="text-sm font-black uppercase tracking-tighter">Detalhes</span>
                       <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Call-to-Action Interactive Buttons */}
          <div className="space-y-4 pt-2 text-center">
            <div className="w-full relative z-10">
              <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
                <button
                  onClick={onEnterLogin}
                  className="w-full sm:w-80 max-w-full inline-flex items-center justify-center gap-2 bg-[#009E60] hover:bg-[#008751] text-white font-black text-sm px-6 py-3 sm:py-3.5 rounded-xl border-2 border-black hover:translate-y-[-1px] transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] group"
                >
                  <span className="text-sm">☰</span>
                  <span>Aceder ao Sistema (Login)</span>
                  <span className="text-sm group-hover:translate-x-1 transition-transform ml-1">➔</span>
                </button>

                <button
                  onClick={onEnterRegister}
                  className="w-full sm:w-80 max-w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-black text-sm px-6 py-3 sm:py-3.5 rounded-xl border-2 border-black hover:translate-y-[-1px] transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                >
                  <span>➕</span>
                  <span>Novo Registo / Criar Conta</span>
                </button>

                {onViewProject && (
                  <button
                    onClick={onViewProject}
                    className="w-full sm:w-80 max-w-full inline-flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-black text-sm px-6 py-3 sm:py-3.5 rounded-xl border-2 border-indigo-200 hover:translate-y-[-1px] transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  >
                    <span>📖</span>
                    <span>Ver Projeto Teórico (SIGDE- ONLINE)</span>
                  </button>
                )}

                {/* Botão de Partilha de Link */}
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
                  className={`w-full sm:w-80 max-w-full inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                    copiedLink
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-600 shadow-[2px_2px_0px_rgba(16,185,129,1)]'
                      : 'bg-amber-50/80 hover:bg-amber-100/90 text-amber-950 border-amber-300 hover:border-amber-400 shadow-[2px_2px_0px_rgba(217,119,6,0.5)]'
                  }`}
                  title="Copiar link partilhado oficial para partilhar com equipas"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600 animate-in zoom-in-75 duration-200" />
                      <span>Link Oficial Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Link className="h-4 w-4 text-amber-700" />
                      <span>Copiar Link Partilhado do Sistema</span>
                      <Copy className="h-3.5 w-3.5 text-amber-600 ml-auto opacity-70" />
                    </>
                  )}
                </button>

                {/* Botão de Usuário de Teste */}
                <TestUserList 
                  accounts={registeredAccounts}
                  onSelectAccount={onAutoLogin}
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-3 text-center">
                Selecione uma das opções acima para aceder ao portal seguro do SIGDE- ONLINE
              </p>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}


