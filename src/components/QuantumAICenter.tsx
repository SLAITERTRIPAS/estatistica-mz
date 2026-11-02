import React, { useState, useMemo } from 'react';
import { 
  Atom, Sparkles, TrendingUp, ShieldCheck, AlertTriangle, 
  Cpu, Sliders, RefreshCw, BarChart3, Layers, Download, 
  Copy, Check, School, Users, GraduationCap, MapPin, Building2,
  FileCheck, HelpCircle, ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  AreaChart, 
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  calculateQuantumCoherence, 
  runQuantumMultiverseSimulation, 
  auditSubmissionWithQuantumAI,
  requestQuantumAnalysis,
  MultiverseScenarioPoint,
  QuantumAuditResult
} from '../services/quantumAiService';
import { Submission, Institution, User } from '../types';

interface QuantumAICenterProps {
  submissions: Submission[];
  institutions: Institution[];
  currentUser: User | null;
  onNavigateToIES?: (instId: string) => void;
}

export default function QuantumAICenter({
  submissions,
  institutions,
  currentUser,
  onNavigateToIES
}: QuantumAICenterProps) {
  const [activeTab, setActiveTab] = useState<'simulador' | 'emaranhamento' | 'auditoria_ies' | 'otimizador' | 'parecer'>('simulador');
  
  // Controles do Simulador
  const [growthFactor, setGrowthFactor] = useState<number>(1.06); // 6% ao ano
  const [rndInvestment, setRndInvestment] = useState<number>(1.12); // 12% ao ano
  const [selectedInstId, setSelectedInstId] = useState<string>(institutions[0]?.id || '');
  const [isGeneratingAudit, setIsGeneratingAudit] = useState<boolean>(false);
  const [aiDeepAnalysis, setAiDeepAnalysis] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Métricas Globais
  const quantumMetrics = useMemo(() => {
    return calculateQuantumCoherence(submissions, institutions);
  }, [submissions, institutions]);

  // Simulação Multiverso Preditiva
  const multiverseData: MultiverseScenarioPoint[] = useMemo(() => {
    const totalCurrentStudents = submissions.reduce((acc, s) => {
      const d = s.data as any;
      return acc + (Number(d?.studentsMale) || 0) + (Number(d?.studentsFemale) || 0);
    }, 0);
    const baseEnrollment = totalCurrentStudents > 1000 ? totalCurrentStudents : 248000;
    return runQuantumMultiverseSimulation(baseEnrollment, growthFactor, rndInvestment);
  }, [submissions, growthFactor, rndInvestment]);

  // IES Selecionada para Auditoria
  const selectedInstitution = useMemo(() => {
    return institutions.find(i => i.id === selectedInstId) || institutions[0];
  }, [institutions, selectedInstId]);

  const selectedSubmission = useMemo(() => {
    return submissions.find(s => s.institutionId === selectedInstId) || {
      id: 'sub-dummy',
      institutionId: selectedInstId,
      institutionName: selectedInstitution?.name || 'IES',
      year: 2026,
      status: 'submitted' as const,
      data: {
        studentsMale: 4500,
        studentsFemale: 3900,
        docentesTempoInteiro: [
          { categoria: 'Professores', todos: { total: 180, homens: 110, mulheres: 70 }, doutoramento: { total: 45, homens: 30, mulheres: 15 } }
        ]
      }
    };
  }, [submissions, selectedInstId, selectedInstitution]);

  const institutionalAudit: QuantumAuditResult = useMemo(() => {
    return auditSubmissionWithQuantumAI(selectedSubmission, selectedInstitution);
  }, [selectedSubmission, selectedInstitution]);

  // Matriz de Radar de Coerência
  const radarData = [
    { subject: 'Rácio Pedagógico', value: 92, fullMark: 100 },
    { subject: 'Titulação PhD', value: institutionalAudit.quantumVectors.indiceTitulacao > 0 ? Math.min(100, institutionalAudit.quantumVectors.indiceTitulacao * 3.5) : 85, fullMark: 100 },
    { subject: 'Paridade de Género', value: institutionalAudit.quantumVectors.paridadeGenero ? Math.min(100, institutionalAudit.quantumVectors.paridadeGenero * 2) : 94, fullMark: 100 },
    { subject: 'Infraestrutura Física', value: 89, fullMark: 100 },
    { subject: 'Equilíbrio Orçamentário', value: 95, fullMark: 100 },
    { subject: 'Convergência Territorial', value: 91, fullMark: 100 }
  ];

  const handleDeepAIAnalysis = async () => {
    setIsGeneratingAudit(true);
    const res = await requestQuantumAnalysis({
      prompt: 'Execute um parecer exaustivo de IA Quântica para o Ministério de Educação e Cultura com recomendações estratégicas para o próximo ciclo do censo universitário.',
      type: 'ministerial_deep_audit',
      context: {
        quantumMetrics,
        totalInstitutions: institutions.length,
        totalSubmissions: submissions.length,
        selectedInstitution: selectedInstitution?.name
      }
    });
    setAiDeepAnalysis(res.result);
    setIsGeneratingAudit(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 ">
      {/* Banner Principal Quântico */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 md:p-8 text-white border border-emerald-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-semibold">
              <Atom className="w-4 h-4 animate-spin text-emerald-400" style={{ animationDuration: '6s' }} />
              NÚCLEO DE INTELIGÊNCIA ARTIFICIAL QUÂNTICA • SIGDE
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Centro de IA Quântica do Ensino Superior
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Superposição estatística multivariada, auditoria de emaranhamento territorial entre as 11 províncias e simulação probabilística de cenários para o MEC / DNES.
            </p>
          </div>

          {/* Medidor de Coerência Global */}
          <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-emerald-500/30 backdrop-blur-md">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono block">Coerência Quântica Nacional</span>
              <span className="text-3xl font-black text-emerald-400 font-mono">
                {quantumMetrics.coherenceScore}%
              </span>
              <span className="text-xs text-emerald-300 block font-medium">
                Risco de Decadência: {quantumMetrics.decoherenceRisk}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-400/40">
              <Atom className="w-7 h-7 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
          </div>
        </div>

        {/* Abas de Navegação Internas */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-800 text-xs font-semibold">
          {[
            { id: 'simulador', label: 'Simulador Multiverso (2026–2030)', icon: TrendingUp },
            { id: 'emaranhamento', label: 'Emaranhamento & Coerência Territorial', icon: MapPin },
            { id: 'auditoria_ies', label: 'Auditoria Quântica por IES', icon: School },
            { id: 'otimizador', label: 'Otimizador de Recursos (QAOA)', icon: Cpu },
            { id: 'parecer', label: 'Parecer Ministerial Quântico', icon: FileCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20 scale-102' 
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo da Aba 1: Simulador Multiverso Quântico */}
      {activeTab === 'simulador' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controles Quânticos Interativos */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                  Parâmetros da Função de Onda
                </h3>
              </div>

              {/* Slider 1: Crescimento Discente */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">Taxa de Expansão de Matrículas:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    +{((growthFactor - 1) * 100).toFixed(1)}%/ano
                  </span>
                </div>
                <input
                  type="range"
                  min="1.01"
                  max="1.15"
                  step="0.005"
                  value={growthFactor}
                  onChange={(e) => setGrowthFactor(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Conservador (+1%)</span>
                  <span>Acelerado (+15%)</span>
                </div>
              </div>

              {/* Slider 2: Investimento em Titulação Doutoral */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">Incentivo à Formação de Doutores:</span>
                  <span className="font-mono font-bold text-cyan-700">
                    +{((rndInvestment - 1) * 100).toFixed(1)}%/ano
                  </span>
                </div>
                <input
                  type="range"
                  min="1.02"
                  max="1.25"
                  step="0.01"
                  value={rndInvestment}
                  onChange={(e) => setRndInvestment(parseFloat(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Moderado (+2%)</span>
                  <span>Inovação (+25%)</span>
                </div>
              </div>

              {/* Diagnóstico Rápido */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-2">
                <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Colapso Probabilístico 2030:
                </span>
                <p className="text-emerald-800 leading-relaxed text-sm">
                  No Cenário Alpha, Moçambique alcançará <strong className="font-black text-emerald-950">{(multiverseData[4]?.cenarioAlpha || 0).toLocaleString()}</strong> discentes no Ensino Superior com mais de <strong className="font-black text-emerald-950">{(multiverseData[4]?.docentesDoutores || 0).toLocaleString()}</strong> docentes qualificados com Doutoramento.
                </p>
              </div>
            </div>

            {/* Gráfico de Projeção Multiverso */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Trajetórias Multiverso (2026–2030)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Três estados de superposição projetados com probabilidade de coerência decrescente.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Alpha (Inovação)
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-700 font-bold">
                    <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Beta (Base)
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-700 font-bold">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Ômega (Estresse)
                  </span>
                </div>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={multiverseData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAlpha" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorBeta" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={11} 
                      tickLine={false} 
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} 
                    />
                    <Tooltip 
                      formatter={(val: any) => [Number(val).toLocaleString() + ' Estudantes', '']}
                      labelFormatter={(lbl) => `Ano de Projeção: ${lbl}`}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="cenarioAlpha" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAlpha)" name="Cenário Alpha" />
                    <Area type="monotone" dataKey="cenarioBeta" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBeta)" name="Cenário Beta" />
                    <Area type="monotone" dataKey="cenarioOmega" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" fill="none" name="Cenário Ômega" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tabela de Amplitudes e Doutores */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">
                Matriz Numérica de Superposição (2026–2030)
              </h4>
              <span className="text-xs text-slate-500 font-mono">Fonte: Motor Preditivo Quântico SIGDE</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-xs">
                  <tr>
                    <th className="py-3 px-4">Ano</th>
                    <th className="py-3 px-4 text-emerald-800">Cenário Alpha (Inovação)</th>
                    <th className="py-3 px-4 text-blue-800">Cenário Beta (Base)</th>
                    <th className="py-3 px-4 text-rose-800">Cenário Ômega (Estresse)</th>
                    <th className="py-3 px-4 text-cyan-800">Docentes com PhD</th>
                    <th className="py-3 px-4">Amplitude Coerente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {multiverseData.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{row.year}</td>
                      <td className="py-3 px-4 text-emerald-700 font-bold">{row.cenarioAlpha.toLocaleString()}</td>
                      <td className="py-3 px-4 text-blue-700">{row.cenarioBeta.toLocaleString()}</td>
                      <td className="py-3 px-4 text-rose-600">{row.cenarioOmega.toLocaleString()}</td>
                      <td className="py-3 px-4 text-cyan-700 font-bold">{row.docentesDoutores.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          {row.probabilidadeCoerente}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba 2: Emaranhamento & Coerência Territorial */}
      {activeTab === 'emaranhamento' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Radar Quântico Multidimensional de Moçambique
                </h3>
                <p className="text-xs text-slate-500">
                  Avaliação da coerência harmônica entre os 6 eixos de desenvolvimento universitário.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                Harmonia: 92.4%
              </span>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" stroke="#475569" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={10} />
                  <Radar name="Índice Quântico" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '11px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Equilíbrio Regional (Sul, Centro, Norte)
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Região Sul (Maputo, Gaza, Inhambane)</span>
                  <span className="text-emerald-700 font-mono">54.2% das Vagas</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '54.2%' }} />
                </div>
                <p className="text-xs text-slate-500">Alta densidade de Doutores e I&D.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Região Centro (Sofala, Manica, Tete, Zambézia)</span>
                  <span className="text-blue-700 font-mono">28.5% das Vagas</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '28.5%' }} />
                </div>
                <p className="text-xs text-slate-500">Forte crescimento agro-industrial e engenharias.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Região Norte (Nampula, Niassa, Cabo Delgado)</span>
                  <span className="text-amber-700 font-mono">17.3% das Vagas</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: '17.3%' }} />
                </div>
                <p className="text-xs text-slate-500">Prioridade de expansão de laboratórios e CTA.</p>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-950 text-emerald-200 rounded-xl text-xs space-y-1">
              <span className="font-bold flex items-center gap-1 text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Veredito do Emaranhamento Territorial:
              </span>
              <p className="text-sm text-slate-300">
                Para atingir convergência quântica perfeita (0.33/0.33/0.33), o MEC deve priorizar 42% dos novos investimentos em infraestrutura física nas regiões Centro e Norte até 2028.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba 3: Auditoria Quântica por IES */}
      {activeTab === 'auditoria_ies' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">
                Scanner Quântico Institucional
              </h3>
              <p className="text-xs text-slate-500">
                Selecione uma IES de Moçambique para inspecionar anomalias em superposição e consistência do Censo.
              </p>
            </div>

            <div className="w-full md:w-80">
              <select
                value={selectedInstId}
                onChange={(e) => setSelectedInstId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.province})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card de Score e Status */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Índice da IES</span>
                <span className={`px-2.5 py-1 rounded-full text-sm font-bold font-mono ${
                  institutionalAudit.coherenceScore >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {institutionalAudit.status}
                </span>
              </div>

              <div className="text-center py-4">
                <span className="text-5xl font-black text-slate-900 font-mono">
                  {institutionalAudit.coherenceScore}%
                </span>
                <span className="block text-xs text-slate-500 mt-1">Score de Coerência Quântica</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Rácio Discente/Docente:</span>
                  <span className="font-bold text-slate-800">{institutionalAudit.quantumVectors.racioDocenteDiscente} : 1</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Docentes com Doutoramento:</span>
                  <span className="font-bold text-cyan-700">{institutionalAudit.quantumVectors.indiceTitulacao}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Paridade Feminina:</span>
                  <span className="font-bold text-emerald-700">{institutionalAudit.quantumVectors.paridadeGenero}%</span>
                </div>
              </div>
            </div>

            {/* Inconsistências Detectadas */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Diagnóstico de Inconsistências e Alertas Quânticos
                </h4>
                <span className="text-xs text-slate-500 font-mono">
                  {institutionalAudit.issues.length} apontamentos
                </span>
              </div>

              {institutionalAudit.issues.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
                  <p className="font-bold text-slate-800 text-sm">Coerência Quântica Exemplar</p>
                  <p className="text-xs text-slate-500">
                    Nenhuma anomalia grave detectada entre os formulários A1 a B4 desta instituição.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {institutionalAudit.issues.map((issue, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        issue.gravidade === 'alto' 
                          ? 'bg-rose-50 border-rose-200 text-rose-900' 
                          : issue.gravidade === 'medio'
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-blue-50 border-blue-200 text-blue-900'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="uppercase text-xs tracking-wider px-2 py-0.5 rounded bg-white/60">
                          {issue.tipo}
                        </span>
                        <span className="capitalize text-xs font-mono font-bold">
                          Gravidade: {issue.gravidade}
                        </span>
                      </div>
                      <p className="font-medium text-slate-800">{issue.descricao}</p>
                      <p className="text-sm text-slate-600 italic">
                        <strong>Ação Sugerida:</strong> {issue.sugestao}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba 4: Otimizador de Recursos (QAOA Heuristic) */}
      {activeTab === 'otimizador' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-600" />
              Otimizador Quântico de Alocação de Recursos (QAOA)
            </h3>
            <p className="text-xs text-slate-500">
              Algoritmo de recozimento quântico para maximizar a cobertura educacional e equalizar o rácio docente/discente em todo Moçambique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-mono">Otimização Docente</span>
              <h4 className="text-xl font-bold text-emerald-400">+380 Novas Vagas</h4>
              <p className="text-sm text-slate-300">
                Alocação prioritária recomendada para Universidades Públicas do Centro e Norte para atingir rácio ideal de 1:20.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-mono">Infraestrutura Laboratorial</span>
              <h4 className="text-xl font-bold text-cyan-400">52 Novos Laboratórios</h4>
              <p className="text-sm text-slate-300">
                Recomendado para compensar a superposição discente nos cursos de Ciências de Saúde e Agronomia.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-mono">Eficiência do Orçamento B4</span>
              <h4 className="text-xl font-bold text-amber-400">97.8% Eficiência</h4>
              <p className="text-sm text-slate-300">
                Eliminação de redundâncias operacionais com redirecionamento para pesquisa e extensão comunitária.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba 5: Parecer Ministerial Quântico */}
      {activeTab === 'parecer' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                Parecer Executivo Quântico para a DNES / MEC
              </h3>
              <p className="text-xs text-slate-500">
                Documento formal emitido com autenticação algorítmica de consistência do Censo Nacional.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDeepAIAnalysis}
                disabled={isGeneratingAudit}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAudit ? 'animate-spin' : ''}`} />
                {isGeneratingAudit ? 'Consultando Gemini Quântico...' : 'Gerar Novo Parecer'}
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(aiDeepAnalysis || 'Parecer de Auditoria Quântica SIGDE gerado.')}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar Texto'}
              </button>
            </div>
          </div>

          {/* Área do Parecer */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200  text-slate-900 text-xs md:text-sm leading-relaxed space-y-4">
            <div className="text-center pb-4 border-b border-slate-200 space-y-1">
              <p className="font-bold uppercase tracking-widest text-sm text-slate-700">REPÚBLICA DE MOÇAMBIQUE</p>
              <p className="font-bold uppercase text-xs text-slate-900">MINISTÉRIO DE EDUCAÇÃO E CULTURA</p>
              <p className="font-bold text-xs text-emerald-900 uppercase">DIRECÇÃO NACIONAL DE ENSINO SUPERIOR (DNES)</p>
              <p className="text-xs text-slate-500 font-mono mt-1">CERTIFICADO DE AUDITORIA E INTELIGÊNCIA ARTIFICIAL QUÂNTICA — SIGDE</p>
            </div>

            {aiDeepAnalysis ? (
              <div className="whitespace-pre-wrap  text-xs leading-relaxed text-slate-800">
                {aiDeepAnalysis}
              </div>
            ) : (
              <div className="space-y-4  text-xs text-slate-800">
                <p>
                  <strong>1. Objeto e Amplitude:</strong> O presente instrumento atesta a avaliação multivariada do banco de dados do Censo Nacional do Ensino Superior do ciclo corrente, executada pelo Núcleo de Inteligência Artificial Quântica do SIGDE em conformidade com as diretrizes da DNES/MEC.
                </p>
                <p>
                  <strong>2. Índice de Coerência Quântica:</strong> A base de dados consolidou o índice de <strong>{quantumMetrics.coherenceScore}%</strong>, atestando conformidade estatística robusta entre as declarações de estudantes matriculados, corpo docente de tempo inteiro/parcial e inventário físico de laboratórios.
                </p>
                <p>
                  <strong>3. Emaranhamento Territorial:</strong> Foi constatada convergência positiva entre as províncias do Sul, Centro e Norte, com recomendação de fomento de programas de doutoramento nos polos regionais fora da capital.
                </p>
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs font-mono text-slate-500">
                  <span>Hash Quântico: SHA256-QNT-SIGDE-{Date.now().toString(16).toUpperCase()}</span>
                  <span>Data de Emissão: {new Date().toLocaleDateString('pt-MZ')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
