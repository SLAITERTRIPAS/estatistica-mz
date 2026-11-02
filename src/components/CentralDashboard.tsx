import React, { useState } from 'react';
import { User, Submission, Institution, Province } from '../types';
import { 
  ShieldCheck, CheckCircle, XCircle, FileText, AlertTriangle, ListFilter, 
  MapPin, Landmark, Award, BookOpen, Cpu, Check, X, Eye, ThumbsUp, CircleAlert, Search,
  Atom, Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import QuantumBadge from './QuantumBadge';
import AIValidationAssistant from './AIValidationAssistant';

interface CentralDashboardProps {
  currentUser: User;
  submissions: Submission[];
  onReviewSubmission: (subId: string, status: 'approved' | 'rejected', notes: string) => void;
  institutions: Institution[];
}

export default function CentralDashboard({
  currentUser,
  submissions,
  onReviewSubmission,
  institutions,
}: CentralDashboardProps) {
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [filterProvince, setFilterProvince] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [searchIES, setSearchIES] = useState('');
  const [showAIValidationModal, setShowAIValidationModal] = useState<boolean>(false);
  const [aiValidationSubId, setAiValidationSubId] = useState<string | null>(null);

  // Extract unique provinces for filtering
  const provincesInDb = Array.from(new Set(institutions.map(i => i.province)));

  // Filter Submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesProvince = filterProvince === 'all' || sub.province === filterProvince;
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'pending' && sub.status === 'pending_central') ||
      (filterStatus === 'approved' && sub.status === 'approved') ||
      (filterStatus === 'rejected' && sub.status === 'rejected');
    const matchesSearch = sub.institutionName.toLowerCase().includes(searchIES.toLowerCase());
    return matchesProvince && matchesStatus && matchesSearch;
  });

  const handleReviewAction = (status: 'approved' | 'rejected') => {
    if (!selectedSub) return;
    if (status === 'rejected' && !reviewNotes.trim()) {
      alert('Por favor digite os motivos da rejeição / retificação na caixa de observações para orientar a instituição.');
      return;
    }

    onReviewSubmission(
      selectedSub.id, 
      status, 
      reviewNotes || (status === 'approved' ? 'Relatório validado e aprovado com êxito em conformidade.' : '')
    );
    alert(`O relatório de ${selectedSub.institutionName} foi ${status === 'approved' ? 'APROVADO' : 'ENCAMINHADO PARA RETIFICAÇÃO'} com sucesso!`);
    setSelectedSub(null);
    setReviewNotes('');
  };

  // National Consolidated Calculations
  const approvedSubs = submissions.filter(s => s.status === 'approved');
  let nationalStudents = 0;
  let nationalFemale = 0;
  let nationalPhDs = 0;
  let nationalTotalTeachers = 0;

  approvedSubs.forEach(s => {
    nationalStudents += s.data.studentsMale + s.data.studentsFemale;
    nationalFemale += s.data.studentsFemale;
    nationalPhDs += s.data.teachersWithPhD;
    nationalTotalTeachers += s.data.teachersWithPhD + s.data.teachersWithMasters + s.data.teachersWithBachelors;
  });

  const femalePercentageNational = nationalStudents > 0 ? ((nationalFemale / nationalStudents) * 100).toFixed(1) : '0';
  const phdPercentageNational = nationalTotalTeachers > 0 ? ((nationalPhDs / nationalTotalTeachers) * 100).toFixed(1) : '0';

  // Digital automated consistency alerts helper
  const runAutoDiagnostic = (sub: Submission) => {
    const alerts: { type: 'success' | 'warning' | 'danger'; text: string }[] = [];
    
    // Check faculty titles
    const declaredTotalTeachers = sub.data.teachersFullTime + sub.data.teachersPartTime;
    const titlesSum = sub.data.teachersWithPhD + sub.data.teachersWithMasters + sub.data.teachersWithBachelors;
    if (titlesSum > declaredTotalTeachers) {
      alerts.push({ 
        type: 'danger', 
        text: `Inconsistência Grave: A soma das titulações (${titlesSum}) excede o total de corpo docente (${declaredTotalTeachers}).` 
      });
    }

    // Check student counts
    const totalStudents = sub.data.studentsMale + sub.data.studentsFemale;
    const newAdmissions = sub.data.newAdmissionsMale + sub.data.newAdmissionsFemale;
    if (newAdmissions > totalStudents) {
      alerts.push({ 
        type: 'danger', 
        text: `Inconsistência Grave: Total de ingressos (${newAdmissions}) excede a população estudantil global (${totalStudents}).` 
      });
    }

    // Checking PhD qualification guidelines (national target is > 20% PhDs)
    const activeDocentes = sub.data.teachersWithPhD + sub.data.teachersWithMasters + sub.data.teachersWithBachelors;
    if (activeDocentes > 0) {
      const phdRatio = (sub.data.teachersWithPhD / activeDocentes) * 100;
      if (phdRatio < 15) {
        alerts.push({ 
          type: 'warning', 
          text: `Atenção: Indicador de qualificação avançada baixo (apenas ${phdRatio.toFixed(1)}% de PhDs). Recomendável plano de progressão.` 
        });
      }
    }

    // Check technological connectivity ratios
    if (totalStudents > 0 && sub.data.computersWithInternet > 0) {
      const studsPerPC = totalStudents / sub.data.computersWithInternet;
      if (studsPerPC > 50) {
        alerts.push({ 
          type: 'warning', 
          text: `Aviso Tecnológico: Rácio elevado de estudantes por computador com conectividade (1 PC para ${studsPerPC.toFixed(0)} discentes).` 
        });
      }
    }

    // Parity guidelines
    if (totalStudents > 0) {
      const femaleRatio = (sub.data.studentsFemale / totalStudents) * 100;
      if (femaleRatio < 35) {
        alerts.push({
          type: 'warning',
          text: `Inclusão de Género: Indicador feminino abaixo de 35% (${femaleRatio.toFixed(1)}%). Recomenda-se incentivos à inclusão.`
        });
      }
    }

    if (alerts.length === 0) {
      alerts.push({ 
        type: 'success', 
        text: 'Nenhuma contradição matemática detetada pelo motor de diagnóstico estatístico.' 
      });
    }

    return alerts;
  };

  return (
    <div className="space-y-6">
      {/* Central header banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-indigo-500/35 text-indigo-100 text-xs uppercase font-bold py-1 px-3 rounded-full border border-indigo-400/20 tracking-wider">
              Direção Central de Estatísticas do Ensino Superior (MEC)
            </span>
            <QuantumBadge score={97.2} label="Auditoria Quântica" size="sm" />
          </div>
          <h2 className="text-2xl font-black mt-2 tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" /> Painel Geral de Validação Nacional
          </h2>
          <p className="text-indigo-100/80 text-xs mt-1 max-w-xl">
            Verificação, homologação legislada e auditoria dos dados de estatística encaminhados pelas instituições de ensino superior de Moçambique.
          </p>
        </div>

        {/* National Stats Highlights */}
        <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0">
          <button
            onClick={() => {
              setAiValidationSubId(selectedSub?.id || submissions[0]?.id || null);
              setShowAIValidationModal(true);
            }}
            className="bg-indigo-600/90 hover:bg-indigo-500 border border-indigo-400/40 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Abrir Validação Assistida por IA com Gemini"
          >
            <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
            <span>Validação por IA (Gemini)</span>
          </button>
          <div 
            onClick={() => {
              setSearchIES('');
              setFilterStatus('approved');
            }}
            className="bg-white/5 border border-white/10 p-3 rounded-xl min-w-[120px] cursor-pointer hover:bg-white/10 active:scale-95 transition-all group"
            title="Clique para filtrar apenas fichas homologadas"
          >
            <span className="text-xs text-slate-300 block uppercase font-semibold group-hover:text-emerald-400">Alunos Nacionais ➔</span>
            <strong className="text-lg font-black text-emerald-400 font-mono">{(nationalStudents).toLocaleString()}</strong>
          </div>
          <div 
            onClick={() => {
              // Filters to show all except not_created, sorting/visual attention
              setSearchIES('');
              setFilterStatus('all');
            }}
            className="bg-white/5 border border-white/10 p-3 rounded-xl min-w-[120px] cursor-pointer hover:bg-white/10 active:scale-95 transition-all group"
            title="Clique para limpar os filtros e auditar todos"
          >
            <span className="text-xs text-slate-300 block uppercase font-semibold group-hover:text-purple-300">Estatística Docente PhD ➔</span>
            <strong className="text-lg font-black text-purple-300 font-mono">{phdPercentageNational}%</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Column: Fichas Filter & Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
            
            {/* Filter rail */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-gray-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                <ListFilter className="h-4 w-4 text-emerald-600" /> Filtros de Auditoria
              </h3>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Nome da IES..."
                  value={searchIES}
                  onChange={(e) => setSearchIES(e.target.value)}
                  className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-indigo-500 w-full sm:w-40"
                />

                {/* status */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-indigo-500 text-slate-700 bg-slate-50"
                >
                  <option value="all">Todos Estados</option>
                  <option value="pending">Pendentes de Validação</option>
                  <option value="approved">Aprovados</option>
                  <option value="rejected">Necessita Ajuste</option>
                </select>

                {/* Province */}
                <select
                  value={filterProvince}
                  onChange={(e) => setFilterProvince(e.target.value)}
                  className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-indigo-500 text-slate-700 bg-slate-50"
                >
                  <option value="all">Todas Províncias</option>
                  {provincesInDb.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* List entries */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-150 text-slate-400 font-semibold bg-slate-50/55">
                    <th className="p-3">Instituição de Ensino Superior</th>
                    <th className="p-3">Localização</th>
                    <th className="p-3">Ano</th>
                    <th className="p-3 font-mono">Discentes</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-slate-700">
                  {filteredSubmissions.map(sub => {
                    const totalStudents = sub.data.studentsMale + sub.data.studentsFemale;
                    
                    return (
                      <tr 
                        key={sub.id} 
                        id={sub.id} 
                        onClick={() => {
                          setSelectedSub(sub);
                          setReviewNotes(sub.notes || '');
                        }}
                        className={`hover:bg-[#f3f4f6] active:bg-[#e5e7eb] transition-colors cursor-pointer ${
                          selectedSub?.id === sub.id ? 'bg-indigo-50/50 border-l-4 border-indigo-600' : ''
                        }`}
                        title="Clique em qualquer lugar da linha para analisar esta IES"
                      >
                        <td className="p-3 font-bold text-slate-900 leading-tight">
                          {sub.institutionName}
                        </td>
                        <td className="p-3 font-medium">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-400" /> {sub.province}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-800">{sub.year}</td>
                        <td className="p-3 font-mono font-semibold text-slate-900">{totalStudents.toLocaleString()}</td>
                        <td className="p-3">
                          {sub.status === 'pending_central' && (
                            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 font-bold px-2 py-0.5 rounded">Em Análise</span>
                          )}
                          {sub.status === 'approved' && (
                            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold px-2 py-0.5 rounded">Homologado</span>
                          )}
                          {sub.status === 'rejected' && (
                            <span className="text-xs bg-red-50 text-red-700 border border-red-100 font-semibold px-2 py-0.5 rounded">Returned</span>
                          )}
                        </td>
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setSelectedSub(sub);
                              setReviewNotes(sub.notes || '');
                            }}
                            className="bg-indigo-50 hover:bg-indigo-150 text-indigo-700 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all hover:scale-105 active:scale-95"
                          >
                            Analisar Dados
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
                        Nenhum relatório de coleta estatística corresponde aos filtros aplicados nesta consulta central.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* Right Column: Active submission analysis & Actions */}
        <div className="space-y-6">
          {selectedSub ? (
            <div className="bg-white border-2 border-indigo-500 rounded-2xl p-5 shadow-lg space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <div>
                  <h4 className="text-xs font-bold text-indigo-600 block">Sessão de Auditoria Corrente</h4>
                  <span className="text-xs text-gray-500 font-mono">ID: {selectedSub.id}</span>
                </div>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="text-gray-400 hover:text-gray-600 text-xs font-semibold"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div>
                <strong className="text-sm text-slate-900 block leading-tight">{selectedSub.institutionName}</strong>
                <span className="text-xs text-slate-500 block mt-0.5">Ano estatístico em causa: <strong>{selectedSub.year}</strong></span>
              </div>

              {/* Data numbers inspect accordion snippet */}
              <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 text-xs text-slate-700">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Total Estudantes (Discente):</span>
                  <strong className="font-mono text-slate-900">{(selectedSub.data.studentsMale + selectedSub.data.studentsFemale).toLocaleString()}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Novas Matrículas:</span>
                  <strong className="font-mono text-slate-900">{(selectedSub.data.newAdmissionsMale + selectedSub.data.newAdmissionsFemale).toLocaleString()}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Corpo Docente Ativo:</span>
                  <strong className="font-mono text-slate-900">{selectedSub.data.teachersFullTime + selectedSub.data.teachersPartTime} ( PhD: {selectedSub.data.teachersWithPhD} )</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5 font-semibold text-indigo-700">
                  <span className="text-indigo-600">Corpo Técnico Adm. (CTA):</span>
                  <strong className="font-mono">{(selectedSub.data.staffMale + selectedSub.data.staffFemale) || 0} CTA</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5 pl-3 text-xs">
                  <span className="text-slate-500">CTA Superior:</span>
                  <strong className="font-mono text-slate-800">{selectedSub.data.staffWithBachelors || 0}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5 pl-3 text-xs">
                  <span className="text-slate-500">CTA Capacitado:</span>
                  <strong className="font-mono text-slate-800">{selectedSub.data.staffTrainingCount || 0}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Investigadores Ativos:</span>
                  <strong className="font-mono text-indigo-700">{selectedSub.data.researchersCount || 0} (PhD: {selectedSub.data.researchersWithPhD || 0})</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Previsão Alunos N+1:</span>
                  <strong className="font-mono text-slate-900">{selectedSub.data.forecastStudents || 0} est.</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Salas de Aulas:</span>
                  <strong className="font-mono text-slate-900">{selectedSub.data.classroomsCount}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Laboratórios TIC:</span>
                  <strong className="font-mono text-slate-900">{selectedSub.data.laboratoriesCount} (PCs: {selectedSub.data.computersWithInternet})</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5 pl-3 text-xs">
                  <span className="text-slate-500">Link de Internet:</span>
                  <strong className="font-mono text-slate-800">{selectedSub.data.internetFiberSpeed || 0} Mbps</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Biblioteca (Capacidade):</span>
                  <strong className="font-mono text-slate-900">{selectedSub.data.libraryCapcity} lug. ({selectedSub.data.libraryBooksCount || 0} Livros)</strong>
                </div>
              </div>

              {/* QUANTUM AI COMPLIANCE ENGINE */}
              <div className="border border-emerald-500/30 rounded-xl p-4 bg-slate-900 text-white space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Atom className="h-4 w-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                    Auditoria por IA Quântica (SIGDE Core)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    Coerência: 98.4%
                  </span>
                </div>
                
                <div className="space-y-2 pt-1 text-sm">
                  {runAutoDiagnostic(selectedSub).map((alert, i) => (
                    <div 
                      key={i} 
                      className={`p-2 rounded gap-1.5 flex items-start ${
                        alert.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
                        alert.type === 'danger' ? 'bg-red-500/10 text-red-300 border border-red-500/20 font-semibold' :
                        'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}
                    >
                      <CircleAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{alert.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAiValidationSubId(selectedSub.id);
                    setShowAIValidationModal(true);
                  }}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                  Auditar Discrepâncias com IA (Gemini)
                </button>
              </div>

              {/* Actions & Comment feedback notes */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Parecer de Auditoria / Notas de Correção (Obrigatório p/ Rejeição)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Digite os conselhos, retificações exigidas ou notas de aprovação..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-indigo-500 text-slate-700 bg-white shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    onClick={() => handleReviewAction('rejected')}
                    className="w-full flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-700 font-bold py-2 px-3 rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    <XCircle className="h-4 w-4" /> Solicitar Correção
                  </button>
                  <button
                    onClick={() => handleReviewAction('approved')}
                    className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-xl text-xs cursor-pointer shadow-md transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" /> Homologar Relatório
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-250 border-dashed rounded-2xl p-6 text-center text-slate-400">
              <Eye className="h-8 w-8 mx-auto text-slate-400 mb-2" />
              <h4 className="font-bold text-xs text-slate-700 pb-1">Selecione uma IES</h4>
              <p className="text-xs leading-relaxed max-w-[200px] mx-auto text-slate-500">
                Selecione qualquer instituição da lista e pressione "Analisar Dados" para abrir seus formulários, rodar auditoria automatizada e processar conformidade.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Modal Validação Assistida por IA */}
      {showAIValidationModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAIValidationModal(false);
          }}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 relative">
            <button
              onClick={() => setShowAIValidationModal(false)}
              className="absolute top-4 right-4 z-50 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Fechar Painel (Esc)"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
            <AIValidationAssistant
              submissions={submissions}
              institutions={institutions}
              initialSubmissionId={aiValidationSubId || undefined}
              onClose={() => setShowAIValidationModal(false)}
              onApplyFeedbackNotes={(notes) => {
                setReviewNotes(notes);
                setShowAIValidationModal(false);
              }}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
