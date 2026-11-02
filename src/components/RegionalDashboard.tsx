import React, { useState, useEffect } from 'react';
import { User, Submission, Institution, Province } from '../types';
import { 
  Building, CheckCircle, Clock, Send, MapPin, 
  GraduationCap, Users, BookOpen, Search, Download, DollarSign, ArrowUpRight
} from 'lucide-react';
import { PROVINCES } from '../data';

interface RegionalDashboardProps {
  currentUser: User;
  submissions: Submission[];
  institutions: Institution[];
}

export default function RegionalDashboard({
  currentUser,
  submissions,
  institutions,
}: RegionalDashboardProps) {
  const [currentRegion, setCurrentRegion] = useState<'Norte' | 'Centro' | 'Sul'>(
    (currentUser.region as 'Norte' | 'Centro' | 'Sul') || 'Sul'
  );
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [searchTerm, setSearchTerm] = useState('');
  const [reportingStatus, setReportingStatus] = useState<'idle' | 'reporting' | 'success'>('idle');
  const [reportingNotes, setReportingNotes] = useState('');
  const [reportsHistory, setReportsHistory] = useState<any[]>([]);

  // Text helper to list exact provinces formatted per region as requested
  const getProvincesListText = (region: 'Norte' | 'Centro' | 'Sul') => {
    if (region === 'Norte') return 'Cabo Delgado, Niassa e Nampula';
    if (region === 'Centro') return 'Sofala, Manica, Tete e Zambézia';
    return 'Maputo (província), Maputo Cidade, Gaza e Inhambane';
  };

  // Get provinces in this region
  const myRegionProvinces = PROVINCES.filter(
    p => p.region.toLowerCase() === currentRegion.toLowerCase()
  );
  
  const provinceNames = myRegionProvinces.map(p => p.name);

  // Get institutions belonging to these provinces
  const myRegionInsts = institutions.filter(inst => 
    provinceNames.some(provName => provName.toLowerCase() === inst.province.toLowerCase())
  );

  // Gather submissions belonging to institutions in our region
  const regionSubmissions = submissions.filter(sub => {
    const inst = institutions.find(i => i.id === sub.institutionId);
    return inst && provinceNames.some(provName => provName.toLowerCase() === inst.province.toLowerCase());
  });

  const matchedSubsByYear = regionSubmissions.filter(sub => sub.year === selectedYear);

  const totalInstsCount = myRegionInsts.length;
  const submissionsReceivedCount = matchedSubsByYear.filter(s => s.status === 'approved' || s.status === 'pending_central').length;
  
  const compliancePercentage = totalInstsCount > 0 
    ? ((submissionsReceivedCount / totalInstsCount) * 100).toFixed(0) 
    : '0';

  // Load regional reports history
  useEffect(() => {
    const saved = localStorage.getItem('stat_regional_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Filter history related to this specific region & year
        setReportsHistory(parsed.filter((r: any) => r.region === currentRegion));
      } catch (e) {
        console.error(e);
      }
    }
  }, [currentRegion, reportingStatus]);

  // Regional aggregated numbers
  let totalStudents = 0;
  let maleStudents = 0;
  let femaleStudents = 0;
  let totalTeachers = 0;
  let phdTeachers = 0;
  let totalPapers = 0;

  matchedSubsByYear.forEach(sub => {
    totalStudents += (sub.data.studentsMale + sub.data.studentsFemale);
    maleStudents += sub.data.studentsMale;
    femaleStudents += sub.data.studentsFemale;
    totalTeachers += (sub.data.teachersFullTime + sub.data.teachersPartTime);
    phdTeachers += (sub.data.teachersWithPhD || 0);
    totalPapers += (sub.data.scientificPapersCount || 0);
  });

  const handlePrestarContas = (e: React.FormEvent) => {
    e.preventDefault();
    setReportingStatus('reporting');

    setTimeout(() => {
      const newReport = {
        id: 'rep-' + Math.random().toString(36).substring(2, 9),
        region: currentRegion,
        year: selectedYear,
        submittedBy: currentUser.name,
        submittedAt: new Date().toISOString(),
        notes: reportingNotes || 'Sem observações adicionais.',
        statistics: {
          totalInstitutions: totalInstsCount,
          submittingInstitutions: submissionsReceivedCount,
          totalStudents,
          totalTeachers,
          phdTeachers,
        }
      };

      const saved = localStorage.getItem('stat_regional_reports');
      const existing = saved ? JSON.parse(saved) : [];
      localStorage.setItem('stat_regional_reports', JSON.stringify([...existing, newReport]));

      setReportingStatus('success');
      setReportingNotes('');
      setTimeout(() => setReportingStatus('idle'), 3000);
    }, 1200);
  };

  return (
    <div id="reg-dashboard" className="space-y-6">
      
      {/* Selector de Região Administrativa */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 block mb-1">
              Gabinete de Governação Regional
            </span>
            <h3 className="text-sm font-bold text-slate-800">
              Indique a sua Região Administrativa de Atuação
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Escolha de que região é para carregar automaticamente as informações das províncias associadas.
            </p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl items-center border border-slate-200 gap-1 w-full md:w-auto">
            {(['Norte', 'Centro', 'Sul'] as const).map((reg) => {
              const isActive = currentRegion === reg;
              let tooltip = '';
              if (reg === 'Norte') tooltip = 'Cabo Delgado, Niassa e Nampula';
              if (reg === 'Centro') tooltip = 'Sofala, Manica, Tete e Zambézia';
              if (reg === 'Sul') tooltip = 'Maputo (província), Maputo Cidade, Gaza e Inhambane';
              
              return (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setCurrentRegion(reg)}
                  className={`flex-1 md:flex-initial text-xs font-black px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-650 hover:text-slate-800 hover:bg-slate-200/50'
                  }`}
                  title={tooltip}
                >
                  {reg}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Regional Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-emerald-500/35 text-emerald-50 text-xs uppercase font-bold py-1 px-3 rounded-full border border-emerald-400/30 tracking-wider">
            Gabinete de Governação Regional — MEC
          </span>
          <h2 className="text-2xl font-black mt-2 tracking-tight">
            Região de Monitoria: {currentRegion}
          </h2>
          <p className="text-emerald-100/90 text-xs mt-1 max-w-xl">
            Jurisdição territorial cobrindo as províncias de: <strong className="font-black text-white">{getProvincesListText(currentRegion)}</strong>.
            <br />
            Consolidação das contas educacionais e envio de estatísticas para a Destaque Nacional.
          </p>
        </div>

        <div className="flex bg-white/10 p-1 rounded-xl items-center border border-white/15">
          <span className="text-xs font-bold px-3 text-white">Ano Estatístico:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-transparent font-black px-2 py-1 text-white border-none text-xs rounded focus:outline-none select:bg-emerald-800"
          >
            <option value={2026} className="text-emerald-950">2026 (Atual)</option>
            <option value={2025} className="text-emerald-950">2025</option>
            <option value={2024} className="text-emerald-950">2024</option>
          </select>
        </div>
      </div>

      {/* Aggregate Stats bento box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-bold uppercase">Estudantes Matriculados</span>
            <span className="text-emerald-600 bg-emerald-50 text-xs px-1.5 py-0.5 rounded font-bold">
              {femaleStudents > 0 ? ((femaleStudents/totalStudents)*100).toFixed(0) : 0}% Mulheres
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-800 font-mono tracking-tight">{totalStudents.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">♂ {maleStudents.toLocaleString()} | ♀ {femaleStudents.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-bold uppercase">Corpo Docente Ativo</span>
            <span className="text-sky-600 bg-sky-50 text-xs px-1.5 py-0.5 rounded font-bold">
              {phdTeachers} PhDs
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-800 font-mono tracking-tight">{totalTeachers}</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Capacidade de Ensino Regional Geral</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-bold uppercase">Submissões por Província</span>
            <span className="text-emerald-700 bg-emerald-100 text-xs py-0.5 px-2 rounded font-bold">{compliancePercentage}%</span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-800 font-mono tracking-tight">{submissionsReceivedCount} / {totalInstsCount}</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">IES que reportaram os dados oficiais</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Submissions/Provinces table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 mb-4 border-b border-slate-50">
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wider">Submissões por Instituição ({selectedYear})</h3>
                <p className="text-xs text-slate-400">Listagem de relatórios entregues por província vinculados ao Gabinete Regional.</p>
              </div>
              <input
                type="text"
                placeholder="Filtrar IES ou Província..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs border px-3 py-1.5 border-slate-205 rounded-lg focus:outline-emerald-500 w-full sm:w-56"
              />
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b font-bold text-slate-400 bg-slate-50/50">
                    <th className="p-2">Instituição (SIGLA)</th>
                    <th className="p-2">Província</th>
                    <th className="p-2">Alunos</th>
                    <th className="p-2">Docentes</th>
                    <th className="p-2">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 text-slate-700">
                  {myRegionInsts
                    .filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.province.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(inst => {
                      const matchedSub = matchedSubsByYear.find(s => s.institutionId === inst.id);
                      return (
                        <tr key={inst.id} className="hover:bg-slate-50/50">
                          <td className="p-2">
                            <span className="font-bold text-slate-900 block">{inst.name}</span>
                            <span className="text-xs text-slate-400 font-mono">Reitor: {inst.rector}</span>
                          </td>
                          <td className="p-2">
                            <span className="text-slate-600 font-bold">
                              {inst.province === 'Maputo Província' ? 'Maputo (província)' : inst.province}
                            </span>
                          </td>
                          <td className="p-2 font-mono">
                            {matchedSub ? (matchedSub.data.studentsMale + matchedSub.data.studentsFemale).toLocaleString() : 'Não reportado'}
                          </td>
                          <td className="p-2 font-mono">
                            {matchedSub ? (matchedSub.data.teachersFullTime + matchedSub.data.teachersPartTime).toLocaleString() : '—'}
                          </td>
                          <td className="p-2">
                            {matchedSub ? (
                              <span className="bg-emerald-50 text-emerald-800 text-xs px-1.5 py-0.5 rounded font-bold uppercase">
                                {matchedSub.status === 'approved' ? 'Validado' : 'Pendente Central'}
                              </span>
                            ) : (
                              <span className="text-red-500 text-xs italic">Em Falta</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regional Provinces Overview */}
          <div className="bg-white border border-slate-101 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-2">Resumo de Cumprimento por Província</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {myRegionProvinces.map(prov => {
                const provInsts = myRegionInsts.filter(i => i.province.toLowerCase() === prov.name.toLowerCase());
                const provReceived = matchedSubsByYear.filter(s => s.province.toLowerCase() === prov.name.toLowerCase()).length;
                const percent = provInsts.length > 0 ? Math.round((provReceived / provInsts.length) * 100) : 0;

                return (
                  <div key={prov.id} className="p-3 border rounded-xl bg-slate-50/30">
                    <span className="text-xs font-bold text-slate-900">
                      {prov.name === 'Maputo Província' ? 'Maputo (província)' : prov.name}
                    </span>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-slate-400">{provReceived} de {provInsts.length} IES</span>
                      <span className={`text-xs font-black leading-none py-0.5 px-1.5 rounded ${
                        percent === 100 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      }`}>{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right side: Consolidation Action */}
        <div className="space-y-4">
          
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">Procedimento Estatístico Regional</span>
              <h3 className="text-sm font-bold text-white mt-1">Prestar Contas ao Nível Central</h3>
              <p className="text-xs text-slate-400/90 mt-1 leading-normal">
                Comprima as estatísticas de todos os alunos e docentes da Região {currentRegion} de Moçambique e submeta o relatório de consolidação ao Administrador Central (DGES).
              </p>
            </div>

            <form onSubmit={handlePrestarContas} className="space-y-4 text-xs">
              <div>
                <label className="text-xs font-black text-slate-350 uppercase mb-1 block">Notas do Relatório Regional</label>
                <textarea
                  placeholder="Ex: Todas as instituições de Gaza submeteram a tempo. Nampula possui duas pendências financeiras."
                  value={reportingNotes}
                  onChange={(e) => setReportingNotes(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-750 text-white p-2 text-xs rounded-lg h-20 focus:outline-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={reportingStatus === 'reporting'}
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-2.5 rounded-lg font-bold transition-all text-xs flex justify-center items-center gap-1.5 cursor-pointer disabled:bg-slate-700 disabled:cursor-not-allowed"
              >
                <Send className="h-4.5 w-4.5 shrink-0" />
                {reportingStatus === 'reporting' ? 'Enviando...' : 'Submeter Consolidação à DGES'}
              </button>
            </form>

            {reportingStatus === 'success' && (
              <p className="text-xs text-emerald-400 font-bold font-mono text-center">Consolidação submetida com sucesso ao sistema central!</p>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="text-sm font-bold uppercase text-slate-800 tracking-wider">Histórico de Prestação de Contas</h4>
            {reportsHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Nenhum consolidado enviado ainda para este ano.</p>
            ) : (
              <div className="space-y-3 text-xs">
                {reportsHistory.map((rep) => (
                  <div key={rep.id} className="p-2 border rounded-lg bg-zinc-50/50 space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-xs font-bold text-slate-800 font-mono">Consolidado #{rep.id}</strong>
                      <span className="text-xs text-slate-400 font-mono">{new Date(rep.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono line-clamp-1">Obs: {rep.notes}</p>
                    <div className="pt-1 flex gap-2 text-xs font-mono text-emerald-700">
                      <span>{rep.statistics.totalStudents} Alunos</span>
                      <span>•</span>
                      <span>{rep.statistics.totalTeachers} Docentes</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
