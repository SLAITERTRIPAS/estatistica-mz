import React from 'react';
import { Submission, AcademicYearData } from '../types';

export default function IESHistoryComparison({ submissions, institutionId }: { submissions: Submission[], institutionId: string }) {
  const years = [new Date().getFullYear() - 1, new Date().getFullYear() - 2, new Date().getFullYear() - 3];
  
  const historyData = years.map(year => {
    const submission = submissions.find(s => s.institutionId === institutionId && s.year === year);
    return {
      year,
      data: submission?.data || ({} as AcademicYearData)
    };
  });

  return (
    <div className="mt-8 border-t-2 border-slate-950 pt-8">
      <h3 className="text-xl font-black uppercase tracking-tight mb-6 ">Resumo Comparativo (Últimos 3 Anos)</h3>
      <div className="overflow-x-auto border-2 border-slate-950 rounded-xl bg-white">
        <table className="w-full text-sm border-collapse">
            <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-950 text-slate-800">
                    <th className="p-3 text-left">Métrica</th>
                    {years.map(y => <th key={y} className="p-3 text-center">{y}</th>)}
                </tr>
            </thead>
            <tbody>
                {[
                    { label: 'Total Estudantes (M)', key: 'studentsMale' },
                    { label: 'Total Estudantes (F)', key: 'studentsFemale' },
                    { label: 'Docentes (Tempo Inteiro)', key: 'teachersFullTime' },
                ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 text-center">
                        <td className="p-3 text-left font-bold">{row.label}</td>
                        {historyData.map(h => (
                            <td key={h.year} className="p-3 font-mono">{h.data[row.key as keyof AcademicYearData] || 0}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
