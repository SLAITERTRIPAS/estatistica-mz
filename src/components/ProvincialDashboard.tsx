import React, { useState } from 'react';
import { User, Submission, Institution, Province } from '../types';
import { 
  Plus, FileText, CheckCircle, Clock, AlertTriangle, Send, 
  MapPin, Building, GraduationCap, Users, BookOpen, Search, Download 
} from 'lucide-react';
import { motion } from 'motion/react';
import { MOZAMBIQUE_EMBLEM } from '../constants/assets';

interface ProvincialDashboardProps {
  currentUser: User;
  submissions: Submission[];
  institutions: Institution[];
}

export default function ProvincialDashboard({
  currentUser,
  submissions,
  institutions,
}: ProvincialDashboardProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [searchTerm, setSearchTerm] = useState('');
  const [openedSub, setOpenedSub] = useState<Submission | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'received' | 'missing'>('all');

  // Filter institutions operating inside this province
  const myProvinceInsts = institutions.filter(
    inst => inst.province.toLowerCase() === (currentUser.province || '').toLowerCase()
  );

  // Filter submissions belonging to this province that are shared ("sentToProvince" === true or already approved)
  const receivedSubmissions = submissions.filter(
    sub => sub.province.toLowerCase() === (currentUser.province || '').toLowerCase() && 
           (sub.sentToProvince || sub.status === 'approved')
  );

  const matchedSubsByYear = receivedSubmissions.filter(sub => sub.year === selectedYear);

  // Calculations for dashboard
  const totalMyInstsCount = myProvinceInsts.length;
  const submissionsReceivedCount = matchedSubsByYear.length;
  const compliancePercentage = totalMyInstsCount > 0 ? ((submissionsReceivedCount / totalMyInstsCount) * 100).toFixed(0) : '0';

  // Aggregate stats
  let totalStudents = 0;
  let totalTeachers = 0;
  let femaleStudents = 0;

  matchedSubsByYear.forEach(sub => {
    totalStudents += sub.data.studentsMale + sub.data.studentsFemale;
    femaleStudents += sub.data.studentsFemale;
    totalTeachers += sub.data.teachersFullTime + sub.data.teachersPartTime;
  });

  const finalFemalePercentage = totalStudents > 0 ? ((femaleStudents / totalStudents) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Official Header block */}
      <div className="flex flex-col items-center text-center space-y-3 pb-8 border-b border-slate-200 mb-8 pt-4">
        <img 
          src={MOZAMBIQUE_EMBLEM} 
          alt="Emblema de Moçambique" 
          className="w-34 aspect-[238/180] object-contain mb-2 mix-blend-multiply" 
        />
        <div className="space-y-1">
          <h1 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-[0.15em] leading-tight">
            REPÚBLICA DE MOÇAMBIQUE
          </h1>
          <h2 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-widest leading-tight">
            MINISTÉRIO DE EDUCAÇÃO E CULTURA
          </h2>
          <h3 className="text-xs md:text-xs font-black text-slate-600 uppercase tracking-widest">
            DIRECÇÃO NACIONAL DE ENSINO SUPERIOR
          </h3>
        </div>
        <div className="w-32 h-0.5 bg-[#009E60] mt-2 rounded-full"></div>
      </div>

      {/* Province banner */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-900 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="bg-sky-500/30 text-sky-100 text-xs uppercase font-black py-1.5 px-4 rounded-full border border-sky-400/30 tracking-[0.2em] ">
            Gabinete Provincial de Educação e Estatística
          </span>
          <h2 className="text-4xl font-black mt-3 tracking-tighter uppercase ">
            Jurisdição Provincial: {currentUser.province}
          </h2>
          <p className="text-sky-100/90 text-sm mt-3 max-w-2xl  italic">
            Acompanhamento, recebimento de relatórios e base de dados estatística das Instituições de Ensino Superior sediadas em {currentUser.province}.
          </p>
        </div>

        <div className="flex bg-white/10 p-2 rounded-2xl items-center border border-white/15 shadow-inner">
          <span className="text-xs font-black px-4 text-white uppercase tracking-widest ">Ano Estatístico:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-slate-900/40 font-black px-4 py-2 text-white border-2 border-white/20 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
          >
            <option value={2026} className="text-slate-800">2026 (Atual)</option>
            <option value={2025} className="text-slate-800">2025</option>
            <option value={2024} className="text-slate-800">2024</option>
          </select>
        </div>
      </div>

      {/* Aggregate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          role="button"
          onClick={() => setFilterType('all')}
          className={`border-2 p-6 rounded-2xl flex items-center gap-6 cursor-pointer hover:scale-[1.03] hover:shadow-lg transition-all shadow-sm ${
            filterType === 'all' ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-200' : 'bg-white border-slate-150 hover:bg-slate-50'
          }`}
          title="Clique para mostrar todas as IES registradas"
        >
          <div className="bg-sky-100 p-4 rounded-xl text-sky-700 border-2 border-sky-200 group-hover:bg-sky-600 group-hover:text-white transition-all">
            <Building className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-400 block uppercase tracking-widest ">Instituições Registadas ➔</span>
            <strong className="text-4xl font-black text-slate-950  block mt-1 tracking-tighter">{totalMyInstsCount}</strong>
          </div>
        </div>

        <div 
          role="button"
          onClick={() => setFilterType('received')}
          className={`border-2 p-6 rounded-2xl flex items-center gap-6 cursor-pointer hover:scale-[1.03] hover:shadow-lg transition-all shadow-sm ${
            filterType === 'received' ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200' : 'bg-white border-slate-150 hover:bg-slate-50'
          }`}
          title="Clique para filtrar apenas IES com relatórios recebidos"
        >
          <div className="bg-emerald-100 p-4 rounded-xl text-emerald-700 border-2 border-emerald-200">
            <CheckCircle className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-400 block uppercase tracking-widest ">Relatórios Recebidos ➔</span>
            <strong className="text-4xl font-black text-slate-950  block mt-1 tracking-tighter">{submissionsReceivedCount} / {totalMyInstsCount}</strong>
          </div>
        </div>

        <div 
          role="button"
          onClick={() => setFilterType('missing')}
          className={`border-2 p-6 rounded-2xl flex items-center gap-6 cursor-pointer hover:scale-[1.03] hover:shadow-lg transition-all shadow-sm ${
            filterType === 'missing' ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200' : 'bg-white border-slate-150 hover:bg-slate-50'
          }`}
          title="Clique para filtrar apenas IES com relatórios pendentes"
        >
          <div className="bg-amber-100 p-4 rounded-xl text-amber-700 border-2 border-amber-200">
            <Clock className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-400 block uppercase tracking-widest ">Aguardando Entrega ➔</span>
            <strong className="text-4xl font-black text-slate-950  block mt-1 tracking-tighter">{totalMyInstsCount - submissionsReceivedCount}</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Institutions compliance status & details */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 pb-2 border-b border-gray-50">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Receções Oficiais ({selectedYear}) {filterType === 'received' && '— Apenas Recebidos'}{filterType === 'missing' && '— Apenas Pendentes'}
              </h3>
              <p className="text-xs text-zinc-500 font-medium">Documentos compartilhados voluntária ou obrigatoriamente para consulta provincial. Clique no cartão acima para filtrar os estados da estatística.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                placeholder="Filtrar instituição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-sky-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-slate-400 font-semibold bg-slate-50/50">
                  <th className="p-2.5">Instituição (IES)</th>
                  <th className="p-2.5">Tipo</th>
                  <th className="p-2.5">Data Receção</th>
                  <th className="p-2.5">Alunos Ativos</th>
                  <th className="p-2.5">Estado da Estatística</th>
                  <th className="p-2.5 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-slate-700">
                {myProvinceInsts
                  .filter(inst => inst.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .filter(inst => {
                    const hasSub = matchedSubsByYear.some(s => s.institutionId === inst.id);
                    if (filterType === 'received') return hasSub;
                    if (filterType === 'missing') return !hasSub;
                    return true;
                  })
                  .map(inst => {
                    const matchedSub = matchedSubsByYear.find(s => s.institutionId === inst.id);
                    const totalStudentsInst = matchedSub ? matchedSub.data.studentsMale + matchedSub.data.studentsFemale : 0;

                    return (
                      <tr 
                        key={inst.id} 
                        id={inst.id} 
                        onClick={() => {
                          if (matchedSub) setOpenedSub(matchedSub);
                        }}
                        className={`hover:bg-[#f8fafc] active:bg-[#f1f5f9] transition-all ${
                          openedSub?.institutionId === inst.id ? 'bg-sky-50/40 font-semibold' : ''
                        } ${matchedSub ? 'cursor-pointer' : 'opacity-80'}`}
                        title={matchedSub ? "Clique para inspecionar os detalhes deste relatório" : "Esta instituição ainda não enviou os dados"}
                      >
                        <td className="p-2.5 font-bold text-slate-900 leading-tight">
                          {inst.name}
                          <span className="block text-xs font-normal text-slate-400 mt-0.5">Reitor: {inst.rector}</span>
                        </td>
                        <td className="p-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            inst.type === 'Pública' ? 'bg-sky-50 text-sky-700 border border-sky-100' : 'bg-purple-50 text-purple-700 border border-purple-100'
                          }`}>
                            {inst.type}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono text-xs text-gray-500">
                          {matchedSub?.submittedAt ? new Date(matchedSub.submittedAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="p-2.5 font-semibold text-slate-800 text-xs">
                          {matchedSub ? totalStudentsInst.toLocaleString() : 'Não Declarado'}
                        </td>
                        <td className="p-2.5 text-xs">
                          {matchedSub ? (
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              matchedSub.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                              matchedSub.status === 'pending_central' ? 'bg-sky-50 text-sky-700' :
                              'bg-amber-50 text-amber-700'
                            }`}>
                              {matchedSub.status === 'approved' ? 'Aprovado pelo MEC' :
                               matchedSub.status === 'pending_central' ? 'Pendente m/ Validação' : 'Rascunho Partilhado'}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs italic">Aguardando entrega</span>
                          )}
                        </td>
                        <td className="p-2.5 text-center">
                          {matchedSub ? (
                            <button
                              onClick={() => setOpenedSub(matchedSub)}
                              className="text-xs bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold px-2 py-1 rounded transition-colors"
                            >
                              Inspecionar
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                alert(`Enviando lembrete de notificação oficial para o email da instituição ${inst.name}.\nO sistema de alerta foi disparado com sucesso.`);
                              }}
                              className="text-xs underline text-slate-400 hover:text-slate-600"
                            >
                              Notificar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Detailed view of opened sub or quick compliance diagnostics */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider pb-2 border-b border-zinc-100">
              Taxa de Cumprimento ({selectedYear})
            </h4>

            <div className="space-y-4 text-center">
              <div className="relative inline-flex items-center justify-center">
                {/* SVG Circle progress */}
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    stroke="#0284c7" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * parseInt(compliancePercentage)) / 100}
                  />
                </svg>
                <div className="absolute text-slate-800">
                  <span className="text-lg font-black font-mono">{compliancePercentage}%</span>
                </div>
              </div>

              <div className="text-left space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>IES Entregues:</span>
                  <strong className="text-slate-800">{submissionsReceivedCount}</strong>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>IES em Falta:</span>
                  <strong className="text-slate-800">{totalMyInstsCount - submissionsReceivedCount}</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  alert('A gerar ficheiro EXCEL consolidado da Província...\nConsolidação provincial concluída com sucesso!');
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs cursor-pointer transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> Exportar Estatísticas de {currentUser.province}
              </button>
            </div>
          </div>

          {openedSub && (
            <div className="bg-slate-950 p-5 rounded-2xl text-white space-y-4">
              <div className="flex justify-between items-start border-b border-slate-850 pb-2">
                <div>
                  <h4 className="text-xs font-bold text-sky-400">{openedSub.institutionName}</h4>
                  <span className="text-xs text-slate-400">Dados Detalhados de {openedSub.year}</span>
                </div>
                <button 
                  onClick={() => setOpenedSub(null)}
                  className="text-slate-500 hover:text-white font-bold text-xs"
                >
                  Fechar
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-xs text-slate-500 block">Estudantes</span>
                    <strong className="text-xs font-mono">{(openedSub.data.studentsMale + openedSub.data.studentsFemale).toLocaleString()}</strong>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-xs text-slate-500 block">Professores</span>
                    <strong className="text-xs font-mono">{openedSub.data.teachersFullTime + openedSub.data.teachersPartTime}</strong>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-xs text-slate-500 block">Salas de Aula</span>
                    <strong className="text-xs font-mono">{openedSub.data.classroomsCount}</strong>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-xs text-slate-400 font-bold block uppercase">Estágio de Investigação</span>
                  <p className="text-sm text-slate-300">
                    Projetos Ativos: <strong className="font-mono text-white">{openedSub.data.researchProjectsCount}</strong><br />
                    Artigos Publicados: <strong className="font-mono text-white">{openedSub.data.scientificPapersCount}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
