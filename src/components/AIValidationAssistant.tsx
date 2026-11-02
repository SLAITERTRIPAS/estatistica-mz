import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, AlertTriangle, CheckCircle, XCircle, Info, RefreshCw, 
  Copy, Check, FileText, ArrowRight, ShieldCheck, TrendingUp, 
  HelpCircle, ChevronRight, School, Calendar, MapPin, Download, 
  SlidersHorizontal, Filter, AlertOctagon, BrainCircuit, ExternalLink
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ReferenceLine } from 'recharts';
import { Submission, Institution } from '../types';
import { validateSubmissionWithAI, AIValidationResult, StatisticalDiscrepancy } from '../services/aiValidationService';

interface AIValidationAssistantProps {
  submissions: Submission[];
  institutions: Institution[];
  initialSubmissionId?: string;
  onApplyFeedbackNotes?: (notes: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const AIValidationAssistant: React.FC<AIValidationAssistantProps> = ({
  submissions,
  institutions,
  initialSubmissionId,
  onApplyFeedbackNotes,
  onClose,
  isModal = false,
}) => {
  const [selectedSubId, setSelectedSubId] = useState<string>(
    initialSubmissionId || submissions[0]?.id || ''
  );
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'alta' | 'media' | 'baixa'>('all');
  const [filterType, setFilterType] = useState<'all' | 'matematica' | 'historica' | 'normativa'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<AIValidationResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [appliedNoteSuccess, setAppliedNoteSuccess] = useState<boolean>(false);

  // Active submission
  const currentSubmission = useMemo(() => {
    return submissions.find(s => s.id === selectedSubId) || submissions[0];
  }, [submissions, selectedSubId]);

  // Institution matching
  const currentInstitution = useMemo(() => {
    if (!currentSubmission) return undefined;
    return institutions.find(i => i.id === currentSubmission.institutionId || i.name === currentSubmission.institutionName);
  }, [institutions, currentSubmission]);

  // Historical submissions for this institution
  const historicalSubmissions = useMemo(() => {
    if (!currentSubmission) return [];
    return submissions
      .filter(s => 
        (s.institutionId === currentSubmission.institutionId || s.institutionName === currentSubmission.institutionName) &&
        s.id !== currentSubmission.id
      )
      .sort((a, b) => a.year - b.year);
  }, [submissions, currentSubmission]);

  // Trigger analysis
  const runValidation = async () => {
    if (!currentSubmission) return;
    setIsLoading(true);
    try {
      const result = await validateSubmissionWithAI(
        currentSubmission,
        historicalSubmissions,
        currentInstitution
      );
      setValidationResult(result);
    } catch (err) {
      console.error('Validation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentSubmission) {
      runValidation();
    }
  }, [currentSubmission?.id]);

  // Filtered discrepancies
  const filteredDiscrepancies = useMemo(() => {
    if (!validationResult) return [];
    return validationResult.discrepancies.filter(d => {
      const matchesSeverity = filterSeverity === 'all' || d.severity === filterSeverity;
      const matchesType = filterType === 'all' || d.type === filterType;
      return matchesSeverity && matchesType;
    });
  }, [validationResult, filterSeverity, filterType]);

  // Historical chart data
  const historicalChartData = useMemo(() => {
    const list = [...historicalSubmissions, currentSubmission].filter(Boolean);
    const sorted = list.sort((a, b) => a.year - b.year);

    return sorted.map(sub => {
      const d = sub.data as any;
      const students = (Number(d?.studentsMale) || 0) + (Number(d?.studentsFemale) || 0);
      const teachers = (Number(d?.teachersFullTime) || 0) + (Number(d?.teachersPartTime) || 0);
      const newAdm = (Number(d?.newAdmissionsMale) || 0) + (Number(d?.newAdmissionsFemale) || 0);
      return {
        ano: sub.year.toString(),
        Estudantes: students,
        Ingressos: newAdm,
        Docentes: teachers,
        isCurrent: sub.id === currentSubmission?.id,
      };
    });
  }, [historicalSubmissions, currentSubmission]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const copyFullReport = () => {
    if (!validationResult || !currentSubmission) return;
    const text = `=== PARECER TÉCNICO DE VALIDAÇÃO ASSISTIDA POR IA (DNES / SIGDE) ===
Instituição: ${currentSubmission.institutionName} | Ano: ${currentSubmission.year}
Pontuação de Conformidade: ${validationResult.overallScore}% (${validationResult.status.toUpperCase()})
Sumário: ${validationResult.summary}

DISCREPÂNCIAS E VALORES ATÍPICOS IDENTIFICADOS (${validationResult.discrepancies.length}):
${validationResult.discrepancies.map((d, i) => `
${i + 1}. [${d.severity.toUpperCase()}] ${d.title}
   - Campo: ${d.field} (${d.category})
   - Valor Declarado: ${d.currentValue} | Esperado: ${d.expectedRange}
   - Diagnóstico: ${d.explanation}
   - Sugestão de Correção: ${d.suggestedCorrection}
`).join('\n')}

RECOMENDAÇÕES DA AUDITORIA:
${validationResult.recommendations.map(r => `• ${r}`).join('\n')}
Data do Parecer: ${new Date().toLocaleString('pt-MZ')}`;

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleApplyToNotes = () => {
    if (!validationResult || !onApplyFeedbackNotes) return;
    const criticalDiscrepancies = validationResult.discrepancies.filter(d => d.id !== 'disc-clean' && d.id !== 'disc-verified');
    if (criticalDiscrepancies.length === 0) {
      onApplyFeedbackNotes('Submissão analisada por Inteligência Artificial (Gemini): dados matematicamente coerentes e homologados sem restrições.');
    } else {
      const notesFormatted = `[Validação Assistida por IA - Parecer DNES]\nForam identificados ${criticalDiscrepancies.length} apontamentos de retificação:\n` +
        criticalDiscrepancies.map((d, i) => `${i + 1}. ${d.title}: ${d.suggestedCorrection}`).join('\n') +
        `\n\nFavor retificar as tabelas no SIGDE antes da homologação final.`;
      onApplyFeedbackNotes(notesFormatted);
    }
    setAppliedNoteSuccess(true);
    setTimeout(() => setAppliedNoteSuccess(false), 3000);
  };

  return (
    <div className={`bg-slate-50 min-h-[600px] flex flex-col ${isModal ? 'p-2 sm:p-6' : 'p-4 sm:p-6 rounded-2xl border border-slate-200'}`}>
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BrainCircuit className="w-64 h-64 text-indigo-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Validação Assistida por IA
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Gemini API Engine
              </span>
              {validationResult?.provider && (
                <span className="text-xs text-slate-400 font-mono">
                  • {validationResult.provider}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Auditoria de Discrepâncias e Valores Atípicos
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Algoritmo de inferência estatística treinado nas normas da Direcção Nacional de Ensino Superior (DNES). 
              Detecta anomalias matemáticas, quebras de tendência histórica e sugere correções precisas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={runValidation}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Analisando Submissão...' : 'Reavaliar com IA'}
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Fechar Painel
              </button>
            )}
          </div>
        </div>

        {/* Institution & Year Selector Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Instituição Avaliada
            </label>
            <select
              value={selectedSubId}
              onChange={(e) => setSelectedSubId(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-indigo-500 cursor-pointer"
            >
              {submissions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.institutionName} ({s.year} - {s.province})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Província & Localização
            </label>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-300 flex items-center gap-2 font-medium">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              {currentSubmission?.province || 'N/A'} • Região {currentInstitution?.type || 'Ensino Superior'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Ano de Exercício Estatístico
            </label>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-300 flex items-center gap-2 font-mono font-bold">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Censo Anual {currentSubmission?.year || '2026'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      {isLoading ? (
        <div className="py-24 text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <BrainCircuit className="w-8 h-8 text-indigo-600 absolute inset-0 m-auto" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Processando Auditoria Estatística via Gemini...</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Comparando matrizes de matrículas, qualificações docentes e rácio pedagógico com as séries históricas da instituição.
          </p>
        </div>
      ) : validationResult ? (
        <div className="space-y-6 mt-6">
          {/* Summary KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Score Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Confiabilidade Global</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-3xl font-black ${
                    validationResult.overallScore >= 90 ? 'text-emerald-600' :
                    validationResult.overallScore >= 70 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {validationResult.overallScore}%
                  </span>
                  <span className="text-xs text-slate-400 font-bold">/ 100</span>
                </div>
                <span className="text-xs font-semibold text-slate-650 block mt-1">
                  {validationResult.overallScore >= 90 ? 'Consistência Elevada' :
                   validationResult.overallScore >= 70 ? 'Atenção Requerida' : 'Inconsistências Graves'}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                validationResult.overallScore >= 90 ? 'bg-emerald-50 text-emerald-600' :
                validationResult.overallScore >= 70 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
              }`}>
                {validationResult.overallScore >= 90 ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
            </div>

            {/* Total Discrepancies */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Discrepâncias / Apontamentos</span>
                <span className="text-3xl font-black text-slate-900 block mt-1">
                  {validationResult.discrepancies.filter(d => d.id !== 'disc-clean' && d.id !== 'disc-verified').length}
                </span>
                <span className="text-xs text-slate-500 font-medium block mt-1">
                  {validationResult.discrepancies.filter(d => d.severity === 'alta').length} críticas • {validationResult.discrepancies.filter(d => d.type === 'historica').length} atípicas
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <AlertOctagon className="w-6 h-6" />
              </div>
            </div>

            {/* Rácio Pedagógico */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Rácio Aluno/Docente</span>
                <span className="text-2xl font-black text-slate-900 font-mono block mt-1">
                  {validationResult.historicalComparison?.studentTeacherRatio || '1:24'}
                </span>
                <span className="text-xs text-slate-500 font-medium block mt-1">
                  Norma DNES: 1:18 a 1:30
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            {/* Qualificação Docente */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Docentes com PhD</span>
                <span className="text-2xl font-black text-slate-900 font-mono block mt-1">
                  {validationResult.historicalComparison?.phdRatio || '20.0%'}
                </span>
                <span className="text-xs text-slate-500 font-medium block mt-1">
                  Meta Nacional: &gt;= 20%
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <School className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* AI Executive Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Síntese Diagnóstica da Auditoria Inteligente
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyFullReport}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAll ? 'Parecer Copiado!' : 'Copiar Parecer Completo'}
                </button>
                {onApplyFeedbackNotes && (
                  <button
                    onClick={handleApplyToNotes}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    {appliedNoteSuccess ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    {appliedNoteSuccess ? 'Aplicado com Sucesso!' : 'Aplicar ao Despacho'}
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {validationResult.summary}
            </p>

            {validationResult.recommendations && validationResult.recommendations.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-3 space-y-2">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-600" /> Recomendações Estratégicas para Homologação:
                </h4>
                <ul className="text-xs text-slate-650 space-y-1.5 list-disc list-inside">
                  {validationResult.recommendations.map((rec, i) => (
                    <li key={i} className="leading-relaxed">{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Historical Trend Outlier Visualizer */}
          {historicalChartData.length > 1 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Comparativo Histórico de Matrículas e Ingressos (Detector de Outliers)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Contraste do ano em análise ({currentSubmission.year}) face aos anos anteriores cadastrados da {currentSubmission.institutionName}.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                  Tendência Discente: {validationResult.historicalComparison?.studentsTrend || 'Estável'}
                </span>
              </div>

              <div className="w-full h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historicalChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="ano" stroke="#64748b" tick={{ fontSize: 12, fontWeight: 700 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12, fontWeight: 700 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                      formatter={(val: any) => [Number(val).toLocaleString(), 'Efetivo']}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                    <Bar dataKey="Estudantes" fill="#2563eb" radius={[6, 6, 0, 0]} name="Total de Estudantes" />
                    <Bar dataKey="Ingressos" fill="#10b981" radius={[6, 6, 0, 0]} name="Novos Ingressos" />
                    <Bar dataKey="Docentes" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Docentes Totais" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Filter Bar for Discrepancies */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filtrar Por:
              </span>

              {/* Severity filter buttons */}
              {(['all', 'alta', 'media', 'baixa'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterSeverity === sev
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-650 hover:bg-slate-100'
                  }`}
                >
                  {sev === 'all' ? 'Todas Gravidades' :
                   sev === 'alta' ? '🔴 Críticas (Alta)' :
                   sev === 'media' ? '🟡 Médias' : '🔵 Baixas / Alertas'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Type filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-bold focus:outline-indigo-500 cursor-pointer"
              >
                <option value="all">Todos Tipos de Anomalias</option>
                <option value="matematica">Matemáticas / Lógicas</option>
                <option value="historica">Valores Atípicos (Outliers Históricos)</option>
                <option value="normativa">Inconformidades Normativas</option>
              </select>
            </div>
          </div>

          {/* Discrepancies List */}
          <div className="space-y-4">
            {filteredDiscrepancies.map((disc) => (
              <div 
                key={disc.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all shadow-xs ${
                  disc.severity === 'alta' 
                    ? 'border-red-200 hover:border-red-400 bg-red-50/10' 
                    : disc.severity === 'media'
                    ? 'border-amber-200 hover:border-amber-400 bg-amber-50/10'
                    : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        disc.severity === 'alta' ? 'bg-red-100 text-red-700 border border-red-200' :
                        disc.severity === 'media' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        Gravidade {disc.severity.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-650">
                        {disc.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700">
                        {disc.type === 'matematica' ? 'Inconsistência Lógica' :
                         disc.type === 'historica' ? 'Outlier Histórico' : 'Critério Normativo'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        • {disc.field}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 pt-1 leading-snug">
                      {disc.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => copyToClipboard(disc.suggestedCorrection, disc.id)}
                    className="self-start sm:self-center px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    title="Copiar sugestão para a área de transferência"
                  >
                    {copiedId === disc.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copiar Sugestão</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Values comparison block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <span className="text-slate-500 block font-semibold">Valor Declarado na Submissão:</span>
                    <strong className="text-slate-900 font-mono text-sm block mt-0.5">{disc.currentValue}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <span className="text-slate-500 block font-semibold">Padrão / Intervalo Esperado:</span>
                    <strong className="text-indigo-700 font-mono text-sm block mt-0.5">{disc.expectedRange}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 sm:col-span-2 md:col-span-1">
                    <span className="text-slate-500 block font-semibold">Comparativo Histórico:</span>
                    <span className="text-slate-700 block mt-0.5 font-medium">{disc.historicalComparison}</span>
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-650 leading-relaxed font-medium">
                  {disc.explanation}
                </p>

                {/* Suggested Correction Box */}
                <div className="mt-3.5 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <strong className="text-indigo-950 font-black block">
                      Sugestão de Correção Assistida por IA:
                    </strong>
                    <p className="text-indigo-900 leading-relaxed font-medium">
                      {disc.suggestedCorrection}
                    </p>
                    {disc.impact && (
                      <span className="text-xs text-indigo-700 font-semibold block pt-0.5">
                        Impacto Normativo: {disc.impact}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredDiscrepancies.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-black text-slate-900">Nenhuma discrepância corresponde ao filtro selecionado</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  A submissão atende aos parâmetros normativos e matemáticos para a categoria de filtro aplicada.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AIValidationAssistant;
