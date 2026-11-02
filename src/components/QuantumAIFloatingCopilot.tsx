import React, { useState, useEffect, useRef } from 'react';
import { 
  Atom, Sparkles, X, Minimize2, Maximize2, Send, RefreshCw, 
  CheckCircle2, AlertTriangle, Cpu, TrendingUp, ShieldCheck, 
  HelpCircle, ChevronRight, Copy, Check, BarChart2, Layers
} from 'lucide-react';
import { 
  sendQuantumChatMessage, 
  requestQuantumAnalysis, 
  calculateQuantumCoherence,
  QuantumMetrics 
} from '../services/quantumAiService';
import { Submission, Institution, User } from '../types';

interface QuantumAIFloatingCopilotProps {
  currentView: string;
  submissions: Submission[];
  institutions: Institution[];
  currentUser: User | null;
  onNavigateToTab?: (tab: any) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function QuantumAIFloatingCopilot({
  currentView,
  submissions,
  institutions,
  currentUser,
  onNavigateToTab
}: QuantumAIFloatingCopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'audit' | 'metrics'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Olá! Sou o **Núcleo de IA Quântica do SIGDE**. Estou sincronizado com o censo do Ensino Superior de Moçambique. Atualmente você está visualizando: **${currentView}**. Posso auditar dados em superposição, prever cenários 2026-2030 ou tirar dúvidas estatísticas. Como posso ajudar?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [quantumMetrics, setQuantumMetrics] = useState<QuantumMetrics>(() => calculateQuantumCoherence(submissions, institutions));
  const [copied, setCopied] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuantumMetrics(calculateQuantumCoherence(submissions, institutions));
  }, [submissions, institutions]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText.trim();
    if (!textToSend || isThinking) return;

    const userMsg: Message = {
      id: String(Date.now()),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setIsThinking(true);

    try {
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const reply = await sendQuantumChatMessage(chatHistory, currentView, {
        totalSubmissions: submissions.length,
        totalInstitutions: institutions.length,
        userRole: currentUser?.role,
        province: currentUser?.province
      });

      const aiMsg: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  const handleRunInstantAudit = async () => {
    setIsThinking(true);
    setActiveTab('chat');
    const prompt = `Execute uma auditoria quântica de integridade para a área atual: ${currentView}. Analise o emaranhamento entre discentes, docentes e infraestrutura.`;
    
    const userMsg: Message = {
      id: String(Date.now()),
      role: 'user',
      content: `⚛️ [AÇÃO RÁPIDA]: Executar Auditoria Quântica em "${currentView}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    const res = await requestQuantumAnalysis({
      prompt,
      type: 'audit',
      context: {
        currentView,
        totalSubmissions: submissions.length,
        totalInstitutions: institutions.length,
        metrics: quantumMetrics
      }
    });

    const aiMsg: Message = {
      id: String(Date.now() + 1),
      role: 'assistant',
      content: res.result,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsThinking(false);
  };

  const copyLastResponse = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Botão Flutuante Universal */}
      <div className="fixed bottom-5 right-5 z-50 no-print">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-white rounded-full shadow-2xl border border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40">
              <Atom className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            </div>
            
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wider uppercase text-emerald-300">IA Quântica</span>
                <span className="text-xs px-1.5 py-0.2 bg-emerald-500/30 text-emerald-200 rounded font-mono font-bold">
                  {quantumMetrics.coherenceScore}%
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">Copiloto Inteligente</p>
            </div>
          </button>
        ) : null}
      </div>

      {/* Painel do Copiloto Flutuante */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 no-print flex flex-col bg-slate-950/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl rounded-2xl overflow-hidden ${
            isExpanded 
              ? 'inset-4 md:inset-10' 
              : 'bottom-5 right-5 w-[92vw] sm:w-[440px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header Quântico */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border-b border-emerald-500/30">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50">
                <Atom className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black tracking-wide uppercase text-white">IA Quântica SIGDE</h3>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                    v3.8 Gemini & Heurística
                  </span>
                </div>
                <p className="text-xs text-emerald-400 font-mono">
                  Coerência: {quantumMetrics.coherenceScore}% • Superposição: {quantumMetrics.superpositionStates} estados
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                title={isExpanded ? 'Restaurar tamanho' : 'Expandir tela cheia'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                title="Fechar Copiloto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader de Navegação de Abas */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/60 border-b border-slate-800 text-sm font-medium">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'chat' 
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Chat Quântico
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('audit')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'audit' 
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Auditoria ({currentView})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('metrics')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'metrics' 
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Vetores e Fase
              </button>
            </div>

            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigateToTab('ia_quantica');
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold underline"
              >
                Abrir Centro Quântico <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeTab === 'chat' && (
              <>
                {/* Ações Rápidas Contextuais */}
                <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-800/80">
                  <button
                    type="button"
                    onClick={handleRunInstantAudit}
                    className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Auditar {currentView}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage('Simule a projeção do número de estudantes do ensino superior em Moçambique até 2030.')}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors"
                  >
                    <TrendingUp className="w-3 h-3 text-cyan-400" />
                    Projeção 2026–2030
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage('Qual o estado do rácio pedagógico docente por discente e a proporção de doutores no país?')}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors"
                  >
                    <Cpu className="w-3 h-3 text-amber-400" />
                    Rácio Docente / Aluno
                  </button>
                </div>

                {/* Lista de Mensagens */}
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[90%] rounded-xl p-3 text-xs leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                            : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-md'
                        }`}
                      >
                        {m.role === 'assistant' && (
                          <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-800 text-xs text-emerald-400 font-mono font-semibold">
                            <span className="flex items-center gap-1">
                              <Atom className="w-3 h-3" /> SIGDE Quantum Core
                            </span>
                            <button
                              type="button"
                              onClick={() => copyLastResponse(m.content)}
                              className="text-slate-400 hover:text-white"
                              title="Copiar resposta"
                            >
                              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        )}
                        <div className="whitespace-pre-wrap ">{m.content}</div>
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 px-1 font-mono">
                        {m.timestamp}
                      </span>
                    </div>
                  ))}

                  {isThinking && (
                    <div className="flex items-center gap-2 p-3 bg-slate-900/80 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                      <Atom className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Processando emaranhamento quântico e gerando síntese...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-4">
                <div className="p-3 bg-slate-900/90 rounded-xl border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Diagnóstico Quântico da Vista
                    </h4>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {quantumMetrics.coherenceScore}% de Coerência
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Avaliando a área ativa: <strong className="text-white">{currentView}</strong>. O sistema processou {submissions.length} submissões de dados e {institutions.length} instituições cadastradas.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-400 block font-mono">Superposição</span>
                    <span className="text-sm font-black text-emerald-400">{quantumMetrics.superpositionStates} Vetores</span>
                    <p className="text-xs text-slate-500 mt-0.5">Cruzamento de A1 até B4</p>
                  </div>
                  <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-400 block font-mono">Risco de Decadência</span>
                    <span className="text-sm font-black text-emerald-300">{quantumMetrics.decoherenceRisk}</span>
                    <p className="text-xs text-slate-500 mt-0.5">Estabilidade estatística</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-bold text-slate-300 uppercase tracking-wide">
                    Eixos de Emaranhamento Ativos:
                  </h5>
                  {quantumMetrics.entangledVariables.map((v, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-slate-900/40 rounded-lg border border-slate-800/80 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{v}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleRunInstantAudit}
                  disabled={isThinking}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isThinking ? 'animate-spin' : ''}`} />
                  Recalcular Diagnóstico Quântico
                </button>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-emerald-400 mb-1">Estado Quântico Fundamental</h4>
                  <p className="text-sm text-slate-300">
                    Fórmula de coerência probabilística ajustada à densidade discente e distribuição territorial de Moçambique.
                  </p>
                  <div className="mt-3 space-y-2 font-mono text-sm">
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-400">Ângulo de Fase (θ):</span>
                      <span className="text-emerald-300 font-bold">{quantumMetrics.phaseAngleDeg}°</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-400">Índice de Entropia (S):</span>
                      <span className="text-emerald-300 font-bold">{quantumMetrics.entropyIndex}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-400">Última Amostragem:</span>
                      <span className="text-slate-300">{new Date(quantumMetrics.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/20 text-sm text-emerald-200 leading-relaxed">
                  💡 <strong>Princípio da Incerteza Aplicado:</strong> Quanto maior o detalhamento na coleta provincial, menor a incerteza agregada nas deliberações ministeriais do Ensino Superior.
                </div>
              </div>
            )}
          </div>

          {/* Rodapé de Entrada de Texto (Somente na aba Chat) */}
          {activeTab === 'chat' && (
            <div className="p-3 bg-slate-900/90 border-t border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Pergunte à IA Quântica sobre indicadores, IES ou previsões..."
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isThinking}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer"
                  title="Enviar mensagem"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
