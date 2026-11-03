import React, { useState } from 'react';
import { Institution, Submission, User } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MOZAMBIQUE_EMBLEM } from '../constants/assets';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ReportSignature from './ReportSignature';
import { PROVINCE_REGIONS } from '../utils/aggregation';

export default function IESSummaryView({ institutions, submissions, currentUser }: { institutions: Institution[], submissions: Submission[], currentUser: User }) {
  const isIESUser = currentUser.role === 'ies' || currentUser.role === 'OrgaoMaximoIES';
  
  const getInitialViewMode = (): 'institucional' | 'provincial' | 'regional' | 'nacional' => {
    if (currentUser.role === 'RepresentanteProvincial') return 'provincial';
    if (currentUser.role === 'RepresentanteRegional') return 'regional';
    if (isIESUser) return 'institucional';
    return 'nacional';
  };

  const [viewMode, setViewMode] = useState<'institucional' | 'provincial' | 'regional' | 'nacional'>(getInitialViewMode());
  const [activeTab, setActiveTab] = useState<'dados' | 'graficos'>('dados');

  const filteredInstitutions = React.useMemo(() => {
    switch (viewMode) {
        case 'institucional':
            return institutions.filter(i => i.id === currentUser.institutionId);
        case 'provincial':
            return institutions.filter(i => i.province === currentUser.province);
        case 'regional':
            return institutions.filter(i => {
                return PROVINCE_REGIONS[i.province] === currentUser.region;
            });
        case 'nacional':
        default:
            return institutions;
    }
  }, [viewMode, institutions, currentUser]);

  const summaryData = filteredInstitutions.map(inst => {
    const instSubmissions = submissions.filter(s => s.institutionId === inst.id).sort((a, b) => b.year - a.year);
    const lastSub = instSubmissions[0];
    const data = lastSub?.data;

    if (!data) return { instName: inst.name, discente: { h: 0, m: 0, t: 0 }, docenteTI: { h: 0, m: 0, t: 0 }, docenteTP: { h: 0, m: 0, t: 0 }, invTI: { h: 0, m: 0, t: 0 }, invTP: { h: 0, m: 0, t: 0 }, ctaTI: { h: 0, m: 0, t: 0 }, ctaTP: { h: 0, m: 0, t: 0 }, orcamento: 0, total: { h: 0, m: 0, t: 0 } };

    const discenteH = data.studentsMale || 0;
    const discenteM = data.studentsFemale || 0;
    
    const docenteTI = (data.docentesTempoInteiro || []).reduce((acc, curr) => ({
      h: acc.h + curr.todos.homens,
      m: acc.m + curr.todos.mulheres,
      t: acc.t + curr.todos.total
    }), { h: 0, m: 0, t: 0 });

    const docenteTP = { h: 0, m: 0, t: data.teachersPartTime || 0 };

    const invTI = (data.docentesInvestigadoresNacionalidade || []).reduce((acc, curr) => ({
        h: acc.h + curr.todos.homens,
        m: acc.m + curr.todos.mulheres,
        t: acc.t + curr.todos.total
    }), { h: 0, m: 0, t: 0 });
    
    const invTP = (data.docentesInvestigadoresNacionalidadeParcial || []).reduce((acc, curr) => ({
        h: acc.h + curr.todos.homens,
        m: acc.m + curr.todos.mulheres,
        t: acc.t + curr.todos.total
    }), { h: 0, m: 0, t: 0 });

    const ctaTI = (data.ctaB1 || []).filter(c => c.vinculoContratual === 'Tempo Inteiro').reduce((acc, curr) => ({
        h: acc.h + curr.todos.homens,
        m: acc.m + curr.todos.mulheres,
        t: acc.t + curr.todos.total
    }), { h: 0, m: 0, t: 0 });

    const ctaTP = (data.ctaB1 || []).filter(c => c.vinculoContratual === 'Tempo parcial').reduce((acc, curr) => ({
        h: acc.h + curr.todos.homens,
        m: acc.m + curr.todos.mulheres,
        t: acc.t + curr.todos.total
    }), { h: 0, m: 0, t: 0 });

    const totalH = discenteH + docenteTI.h + docenteTP.h + invTI.h + invTP.h + ctaTI.h + ctaTP.h;
    const totalM = discenteM + docenteTI.m + docenteTP.m + invTI.m + invTP.m + ctaTI.m + ctaTP.m;
    const totalT = totalH + totalM;

    return {
      instName: inst.name,
      discente: { h: discenteH, m: discenteM, t: discenteH + discenteM },
      docenteTI,
      docenteTP,
      invTI,
      invTP,
      ctaTI,
      ctaTP,
      orcamento: data.budgetTotal || 0,
      total: { h: totalH, m: totalM, t: totalT }
    };
  }).sort((a,b) => b.total.t - a.total.t);

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('REPÚBLICA DE MOÇAMBIQUE', 105, 15, { align: 'center' });
      doc.setFontSize(11);
      doc.text('MINISTÉRIO DE EDUCAÇÃO E CULTURA', 105, 22, { align: 'center' });
      doc.setFontSize(9);
      doc.text('DIRECÇÃO NACIONAL DE ENSINO SUPERIOR (DNES)', 105, 27, { align: 'center' });
      
      doc.setFontSize(11);
      doc.text('SÍNTESE ESTATÍSTICA NACIONAL E REGIONAL - 2026', 105, 36, { align: 'center' });

      const tableRows = summaryData.map(d => [
        d.instName,
        d.discente.t.toLocaleString('pt-PT'),
        (d.docenteTI.t + d.docenteTP.t).toLocaleString('pt-PT'),
        (d.invTI.t + d.invTP.t).toLocaleString('pt-PT'),
        (d.ctaTI.t + d.ctaTP.t).toLocaleString('pt-PT'),
        d.total.t.toLocaleString('pt-PT')
      ]);

      autoTable(doc, {
        startY: 42,
        head: [['Instituição', 'Discentes', 'Docentes', 'Investigadores', 'CTA', 'Total Geral']],
        body: tableRows,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [11, 11, 41] }
      });

      doc.save(`SIGDE_ONLINE_RESUMO_ESTATISTICO_${new Date().getFullYear()}.pdf`);
    } catch (e) {
      console.warn("jsPDF fallback to print:", e);
    }

    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Prepare Enrollment History Chart Data (Last 3 years for current institution)
  const enrollmentHistoryData = React.useMemo(() => {
    if (!currentUser.institutionId) return [];
    
    return submissions
      .filter(s => s.institutionId === currentUser.institutionId)
      .sort((a, b) => b.year - a.year)
      .slice(0, 3)
      .reverse()
      .map(s => ({
        ano: s.year.toString(),
        Estudantes: (s.data?.studentsMale || 0) + (s.data?.studentsFemale || 0),
        Homens: s.data?.studentsMale || 0,
        Mulheres: s.data?.studentsFemale || 0
      }));
  }, [submissions, currentUser.institutionId]);

  // Prepare Chart Data
  const COLORS = ['#1e1b4b', '#4338ca', '#0ea5e9', '#0d9488'];
  const pieData = [
    { name: 'Discentes', value: summaryData.reduce((acc, curr) => acc + curr.discente.t, 0) },
    { name: 'Docentes', value: summaryData.reduce((acc, curr) => acc + curr.docenteTI.t + curr.docenteTP.t, 0) },
    { name: 'Investigadores', value: summaryData.reduce((acc, curr) => acc + curr.invTI.t + curr.invTP.t, 0) },
    { name: 'CTA', value: summaryData.reduce((acc, curr) => acc + curr.ctaTI.t + curr.ctaTP.t, 0) }
  ];

  const barChartData = summaryData.slice(0, 15).map(d => ({ // Limit to top 15 for visual clarity
    name: d.instName.length > 20 ? d.instName.substring(0, 20) + '...' : d.instName,
    Discentes: d.discente.t,
    Docentes: d.docenteTI.t + d.docenteTP.t,
    Investigadores: d.invTI.t + d.invTP.t,
    CTA: d.ctaTI.t + d.ctaTP.t,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl text-slate-100 ">
          <p className="font-bold border-b border-slate-700 pb-2 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm font-bold flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span>{entry.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="bg-white p-8 border border-slate-100 rounded-2xl shadow-sm space-y-8" 
      id="view-ies-summary-panel"
     
    >
      {/* 1. Official Header block with non-squished Emblem requested by user */}
      <div className="space-y-4 w-full flex flex-col items-center border-b pb-6 border-slate-200">
        <img 
          src={MOZAMBIQUE_EMBLEM} 
          alt="Emblema de Moçambique" 
          className="w-20 aspect-[238/180] object-contain mix-blend-multiply" 
        />
        <div className="space-y-1.5 text-center">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-[0.2em] leading-tight">
            REPÚBLICA DE MOÇAMBIQUE
          </h1>
          <h2 className="text-sm md:text-base font-black text-slate-800 uppercase tracking-widest leading-tight">
            MINISTÉRIO DE EDUCAÇÃO E CULTURA
          </h2>
          <h3 className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-wider">
            DIRECÇÃO NACIONAL DE ENSINO SUPERIOR
          </h3>
          <div className="text-sm font-bold text-emerald-800 uppercase tracking-wide mt-1">
            SISTEMA INTEGRADO DE GESTÃO DE DADOS ESTATÍSTICOS (SIGDE- ONLINE)
          </div>
        </div>
        <div className="w-32 h-1 bg-[#009E60] rounded"></div>
      </div>

      <div className="border-b-2 border-slate-950 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">Resumo</h2>
          <div className="flex bg-slate-100 rounded-lg p-1 mt-3 w-fit no-print">
            <button
              onClick={() => setActiveTab('dados')}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-md transition-all ${activeTab === 'dados' ? 'bg-white shadow-sm text-slate-950' : 'text-slate-500 hover:text-slate-700'}`}
            >
              📊 Resumo de Dados Preenchidos
            </button>
            <button
              onClick={() => setActiveTab('graficos')}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-md transition-all ${activeTab === 'graficos' ? 'bg-white shadow-sm text-slate-950' : 'text-slate-500 hover:text-slate-700'}`}
            >
              📈 Resumo em Gráficos
            </button>
          </div>
        </div>
        <div className="flex gap-2">
            {['Ministerial', 'nacional', 'central', 'sistema'].includes(currentUser.role) ? (
                <select 
                    value={viewMode} 
                    onChange={(e) => setViewMode(e.target.value as any)}
                    className="border-2 border-slate-950 rounded-lg p-2 bg-white font-bold text-xs cursor-pointer"
                >
                    <option value="institucional">Nível Institucional</option>
                    <option value="provincial">Nível Provincial</option>
                    <option value="regional">Nível Regional</option>
                    <option value="nacional">Nível Nacional</option>
                </select>
            ) : (
                <div className="border-2 border-slate-950 rounded-lg p-2 bg-slate-50 font-bold uppercase text-xs text-slate-800">
                    {viewMode === 'provincial' && `Província: ${currentUser.province || ''}`}
                    {viewMode === 'regional' && `Região: ${currentUser.region || ''}`}
                    {viewMode === 'institucional' && `Instituição: ${currentUser.institutionName || ''}`}
                </div>
            )}
            <button 
                onClick={handleDownloadPDF}
                className="bg-slate-950 text-white rounded-lg px-4 py-2 font-bold uppercase text-xs hover:bg-slate-800 cursor-pointer shadow-md no-print"
            >
                🖨️ Imprimir / PDF
            </button>
        </div>
      </div>

      {activeTab === 'dados' ? (
        <div className="overflow-x-auto border-2 border-slate-950 rounded-xl bg-white">
          <table className="w-full text-xs border-collapse">
              <thead>
                  <tr className="bg-slate-100 border-b-2 border-slate-950 text-slate-800 uppercase">
                      <th className="p-2 text-left border-r border-slate-950" rowSpan={2}>Instituição</th>
                      <th className="p-2 text-center border-r border-slate-950" colSpan={3}>Corpo Discente</th>
                      <th className="p-2 text-center border-r border-slate-950" colSpan={3}>Corpo Docente TI</th>
                      <th className="p-2 text-center border-r border-slate-950" colSpan={3}>Corpo Docente TP</th>
                      <th className="p-2 text-center border-r border-slate-950" colSpan={3}>Investigadores TI</th>
                      <th className="p-2 text-center border-r border-slate-950" colSpan={3}>Investigadores TP</th>
                      <th className="p-2 text-center border-r border-slate-950" colSpan={3}>CTA TI</th>
                      <th className="p-2 text-center border-r border-slate-950" colSpan={3}>CTA TP</th>
                      <th className="p-2 text-center border-r border-slate-950" rowSpan={2}>Orçamento Geral (MZN)</th>
                      <th className="p-2 text-center" colSpan={3}>Total Efetivo</th>
                  </tr>
                  <tr className="bg-slate-50 border-b-2 border-slate-950 text-slate-600 font-normal">
                      {Array(7).fill(0).map((_, i) => (
                          <React.Fragment key={i}>
                              <th className="p-1 border-r border-slate-200">H</th>
                              <th className="p-1 border-r border-slate-200">M</th>
                              <th className="p-1 border-r border-slate-950">HM</th>
                          </React.Fragment>
                      ))}
                      <th className="p-1 border-r border-slate-200">H</th>
                      <th className="p-1 border-r border-slate-200">M</th>
                      <th className="p-1">HM</th>
                  </tr>
              </thead>
              <tbody>
                  {summaryData.map(row => (
                      <tr key={row.instName} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-2 font-bold border-r border-slate-950">{row.instName}</td>
                          {([row.discente, row.docenteTI, row.docenteTP, row.invTI, row.invTP, row.ctaTI, row.ctaTP]).map((col, i) => (
                              <React.Fragment key={i}>
                                  <td className="p-1 text-center border-r border-slate-200">{col.h}</td>
                                  <td className="p-1 text-center border-r border-slate-200">{col.m}</td>
                                  <td className="p-1 text-center font-bold border-r border-slate-950">{col.t}</td>
                              </React.Fragment>
                          ))}
                          <td className="p-2 text-center font-mono border-r border-slate-950">{row.orcamento.toLocaleString()}</td>
                          <td className="p-1 text-center border-r border-slate-200">{row.total.h}</td>
                          <td className="p-1 text-center border-r border-slate-200">{row.total.m}</td>
                          <td className="p-1 text-center font-bold">{row.total.t}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
           
           <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-8">
             {/* Main Graphic - Demographic Distribution */}
             <div className="bg-slate-50 p-6 rounded-2xl border-4 border-slate-950 shadow-[6px_6px_0px_rgba(15,23,42,1)] transition-transform hover:-translate-y-1 hover:shadow-[10px_10px_0px_rgba(15,23,42,1)] duration-300 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e1b4b] to-[#0ea5e9]"></div>
               <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter border-b-2 border-slate-900 inline-block">Distribuição Demográfica Global</h3>
               <div className="h-72 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Tooltip content={<CustomTooltip />} />
                     <Legend wrapperStyle={{ fontFamily: 'serif', fontWeight: 'bold' }} />
                     <Pie
                       data={pieData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={100}
                       paddingAngle={5}
                       dataKey="value"
                       stroke="none"
                     >
                       {pieData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))' }} />
                       ))}
                     </Pie>
                   </PieChart>
                 </ResponsiveContainer>
               </div>
             </div>

             {/* Secondary Graphic - Top Performers / Sizes */}
             <div className="bg-slate-50 p-6 rounded-2xl border-4 border-slate-950 shadow-[6px_6px_0px_rgba(15,23,42,1)] transition-transform hover:-translate-y-1 hover:shadow-[10px_10px_0px_rgba(15,23,42,1)] duration-300 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-[#0ea5e9] to-[#0d9488]"></div>
               <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter border-b-2 border-slate-900 inline-block">
                 Proporção por Categoria em {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
               </h3>
               
               <div className="h-72 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                    {pieData.map((data, index) => (
                      <div key={data.name} className="flex flex-col justify-center items-center bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-slate-400 transition-colors">
                        <div className="w-10 h-10 rounded-full mb-3 shadow-inner flex items-center justify-center text-white font-bold" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                          {data.name.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{data.name}</span>
                        <span className="text-2xl font-black text-slate-950 mt-1">{data.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
               </div>
             </div>
           </div>

           {/* Enrollment History Chart - Only for Institutions with History */}
           {enrollmentHistoryData.length > 0 && (
             <div className="bg-slate-50 p-6 rounded-2xl border-4 border-slate-950 shadow-[6px_6px_0px_rgba(15,23,42,1)] relative w-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e1b4b] to-[#0d9488]"></div>
                <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter border-b-2 border-slate-900 inline-block">Histórico de Ingressos (Últimos 3 Anos)</h3>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={enrollmentHistoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                      <XAxis dataKey="ano" tick={{ fontSize: 12, fontWeight: 'bold', fill: '#0f172a' }} axisLine={{ stroke: '#0f172a', strokeWidth: 2 }} />
                      <YAxis tick={{ fontSize: 12, fontWeight: 'bold', fill: '#0f172a' }} axisLine={{ stroke: '#0f172a', strokeWidth: 2 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar name="Homens" dataKey="Homens" fill="#1e1b4b" radius={[4, 4, 0, 0]} />
                      <Bar name="Mulheres" dataKey="Mulheres" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
           )}

           {/* Large Bar Chart - Institutions */}
           <div className="bg-slate-50 p-6 rounded-2xl border-4 border-slate-950 shadow-[6px_6px_0px_rgba(15,23,42,1)] relative w-full">
               <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter border-b-2 border-slate-900 inline-block">Análise Comparativa (Top IES - Efetivo)</h3>
               <div className="h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart
                     data={barChartData}
                     margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                   >
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                     <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#0f172a', fontWeight: 'bold', fontSize: 10 }} 
                        axisLine={{ stroke: '#0f172a', strokeWidth: 2 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                     />
                     <YAxis 
                        tick={{ fill: '#0f172a', fontWeight: 'bold' }} 
                        axisLine={{ stroke: '#0f172a', strokeWidth: 2 }}
                     />
                     <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }} />
                     <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: 'serif', fontWeight: 'bold' }} />
                     <Bar dataKey="Discentes" stackId="a" fill="#1e1b4b" radius={[0, 0, 0, 0]} style={{ filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.2))' }} />
                     <Bar dataKey="Docentes" stackId="a" fill="#4338ca" radius={[0, 0, 0, 0]} style={{ filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.2))' }} />
                     <Bar dataKey="Investigadores" stackId="a" fill="#0ea5e9" radius={[0, 0, 0, 0]} style={{ filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.2))' }} />
                     <Bar dataKey="CTA" stackId="a" fill="#0d9488" radius={[4, 4, 0, 0]} style={{ filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.2))' }} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
           </div>

        </div>
      )}

      <div className="hidden print:block mt-8 border-t border-slate-950 pt-4 no-print">
         <p className="text-xs font-bold text-slate-950">Este documento tem carácter oficial e foi gerado digitalmente pelo SIGDE- ONLINE - Moçambique.</p>
         <p className="text-xs text-slate-800">Responsável: {currentUser.name || 'Administrador do Sistema'} | Nível: {currentUser.role?.toUpperCase() || 'SISTEM'}</p>
      </div>

      <div className="mt-12">
        {(() => {
          const firstInst = filteredInstitutions[0];
          const mockAuthority: Institution = firstInst || {
            id: 'gov-mz',
            name: 'Ministério da Ciência, Tecnologia e Ensino Superior',
            province: 'Maputo Cidade',
            rector: 'Ministro da MCTES',
            type: 'Pública',
            abbreviation: 'MCTES'
          };
          return <ReportSignature institution={mockAuthority} currentUser={currentUser} />;
        })()}
      </div>

    </div>
  );
}
