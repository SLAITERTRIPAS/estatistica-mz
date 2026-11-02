import React, { useState, useEffect } from 'react';
import { MOZAMBIQUE_EMBLEM } from '../constants/assets';
import { Calendar, ChevronRight, LogOut, AlertTriangle, X } from 'lucide-react';
import { motion } from 'motion/react';

interface YearSelectionModalProps {
  onSelect: (year: number) => void;
  onBack: () => void;
}

export default function YearSelectionModal({ onSelect, onBack }: YearSelectionModalProps) {
  const [selected, setSelected] = useState<number | null>(new Date().getFullYear());
  const [message, setMessage] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventDetail, setSelectedEventDetail] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('stat_calendar_events');
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  }, []);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); 

  const handleConfirm = () => {
    if (selected === currentYear - 1) { 
        if (currentMonth < 5) { 
            setMessage("Sem dados preenchidos para este período, selecione o ano atual para preencher novos dados ou o ano de 2024 para consulta.");
            return;
        }
    }
    if (selected) {
        onSelect(selected);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col ">
      {/* Mini Header */}
      <header className="p-6 flex items-center justify-between border-b border-slate-200 bg-white shadow-sm z-10">
        <div className="flex items-center gap-3">
          <img 
            src={MOZAMBIQUE_EMBLEM} 
            alt="Moçambique" 
            className="w-12 h-12 object-contain mix-blend-multiply [filter:contrast(106%)_brightness(102%)]" 
            style={{ mixBlendMode: 'multiply' }}
          />
          <span className=" font-black text-slate-800 tracking-tight uppercase text-lg">SIGDE- ONLINE • Estatística</span>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
        >
          <LogOut className="w-4 h-4" />
          Sair do Sistema
        </button>
      </header>

      <main className="flex-1 flex items-start justify-start p-2 sm:p-5 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] overflow-auto">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-7xl mx-auto pb-10">
          
          {/* Important Info Sidebar (MOVED FROM COVER) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 bg-amber-50 border-2 border-amber-500 shadow-2xl rounded-2xl p-4 sm:p-6 space-y-4 ring-4 ring-amber-500/10 flex flex-col h-fit lg:max-h-[75vh]"
          >
            <div className="flex items-center gap-4 border-b border-amber-200 pb-4 shrink-0">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-200 animate-pulse">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-amber-900 uppercase tracking-tighter leading-none">
                  ALERTA: INFORMAÇÃO CRÍTICA
                </h3>
                <p className="text-xs text-amber-700 font-bold uppercase mt-1 tracking-widest">Atenção obrigatória do utilizador</p>
              </div>
            </div>

            <p className="text-sm sm:text-xs text-amber-900 font-bold leading-relaxed shrink-0">
              Verifique os prazos e requisitos oficiais antes de prosseguir com a abertura do exercício estatístico:
            </p>

            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 -mr-2 min-h-[200px] lg:min-h-0">
              {events.length > 0 ? (
                events.map((evt) => (
                  <div 
                    key={evt.id} 
                    onClick={() => setSelectedEventDetail(evt)}
                    className="p-4 bg-white/80 border border-amber-200 rounded-xl space-y-1.5 shadow-sm group hover:border-amber-400 transition-colors cursor-pointer hover:shadow-md"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-sm font-black text-slate-900 leading-tight block uppercase tracking-tight group-hover:text-amber-700 transition-colors">
                        {evt.title}
                      </span>
                      <span className="text-xs font-mono font-black text-white shrink-0 bg-amber-600 px-2 py-0.5 rounded shadow-sm">
                        {evt.date.split('-').reverse().join('/')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {evt.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-amber-600/50 italic text-xs font-bold">
                  Sincronizando cronograma ministerial...
                </div>
              )}
            </div>
            
            <div className="p-4 bg-red-600 border border-red-700 rounded-xl text-sm text-white font-black leading-relaxed shadow-lg shrink-0">
              AVISO: O preenchimento fora de prazo ou com dados inconsistentes poderá resultar na suspensão da homologação administrativa da IES.
            </div>
          </motion.div>

          {/* Year Selection Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-7 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden h-fit"
          >
            <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
              <Calendar className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12" />
              <h2 className="text-2xl  font-bold mb-2 relative z-10">Qual é o ano de trabalho?</h2>
              <p className="text-slate-400 text-sm font-medium relative z-10">
                Selecione o ano estatístico que deseja gerir ou consultar.
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                  Selecione o Ano Estatístico:
                </label>
                <div className="relative group">
                  <select
                    value={selected || ''}
                    onChange={(e) => { 
                      setSelected(Number(e.target.value)); 
                      setMessage(null); 
                    }}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-black text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Escolha o ano de trabalho...</option>
                    {Array.from(new Set([currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4, 2024, 2023, 2022])).map((year) => (
                      <option key={year} value={year}>
                        {year} {year === currentYear ? ' (Ano Atual)' : year === currentYear - 1 ? ' (Consolidação)' : ''}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-600">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </div>
                </div>

                {selected && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 3 }}
                    className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3"
                  >
                    <div className="p-2 bg-indigo-600 text-white rounded-lg">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-black text-indigo-900">Ano de Trabalho: {selected}</span>
                      <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 opacity-80">
                        {selected === currentYear ? 'Exercício Estatístico em Curso' : selected === currentYear - 1 ? 'Dados em Fase de Homologação' : 'Consulta de Histórico Administrativo'}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {message && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-medium flex gap-2"
                >
                  <span className="shrink-0">⚠️</span>
                  <span>{message}</span>
                </motion.div>
              )}

              <button 
                onClick={handleConfirm}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 group shadow-lg shadow-slate-200"
              >
                Confirmar e Entrar no Sistema
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="p-6 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
        Sistema Nacional de Gestão de Dados Estatísticos • MEC
      </footer>

      {/* Full-Screen Event Detail Modal */}
      {selectedEventDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-amber-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-md">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-amber-900 uppercase tracking-tighter">
                    Detalhes do Evento
                  </h3>
                  <span className="text-xs font-mono font-black text-white bg-amber-600 px-2 py-0.5 rounded mt-1 inline-block shadow-sm">
                    {selectedEventDetail.date.split('-').reverse().join('/')}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEventDetail(null)}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-white rounded-xl transition-colors shadow-sm border border-transparent hover:border-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar flex-1 bg-white">
              <h2 className="text-2xl sm:text-3xl  font-black text-slate-900 mb-6 leading-tight">
                {selectedEventDetail.title}
              </h2>
              
              <div className="prose prose-sm sm:prose-base max-w-none prose-slate">
                <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-xl mb-8">
                  <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed whitespace-pre-wrap m-0">
                    {selectedEventDetail.description}
                  </p>
                </div>
                
                {/* Additional contextual information for the event */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Informações Adicionais</h4>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex gap-2">
                      <span className="font-bold text-slate-900 min-w-[120px]">Tipo de Alerta:</span>
                      <span className="uppercase text-amber-600 font-bold">Crítico (Atenção Obrigatória)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-slate-900 min-w-[120px]">Status:</span>
                      <span className="uppercase text-emerald-600 font-bold">Oficial • Publicado</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedEventDetail(null)}
                className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
              >
                Fechar Detalhes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
