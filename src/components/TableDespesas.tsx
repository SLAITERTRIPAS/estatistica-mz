import React from 'react';
import { DollarSign } from 'lucide-react';

interface TableDespesasProps {
  data: Array<{ rubrica: string; valor: number }> | undefined;
  onChange: (idx: number, value: string) => void;
}

export const TableDespesas: React.FC<TableDespesasProps> = ({ data, onChange }) => {
  // Ensure we fall back to defaults if not populated
  const rows = data || [
    { rubrica: 'Despesas de Funcionamento', valor: 0 },
    { rubrica: 'Despesas de Investimento', valor: 0 },
    { rubrica: 'Total', valor: 0 }
  ];

  const funcionamento = rows.find(r => r.rubrica === 'Despesas de Funcionamento')?.valor || 0;
  const investimento = rows.find(r => r.rubrica === 'Despesas de Investimento')?.valor || 0;
  const totalCalculado = funcionamento + investimento;

  return (
    <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4 w-[99%] max-w-none mx-auto">
      <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
        <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
          <DollarSign className="h-4 w-4 text-emerald-700" /> Quadro 1. Despesas na IES
        </h3>
      </div>

      <div className="rounded-xl border-2 border-black shadow-sm overflow-hidden">
        <table className="w-full text-xs border-collapse bg-white whitespace-nowrap">
          <thead>
            <tr className="bg-slate-200 border-b-2 border-black">
              <th className="border-r-2 border-black p-3 text-left font-black text-slate-700 w-2/3 uppercase">Rubrica</th>
              <th className="p-3 text-center font-black text-slate-700 w-1/3 uppercase">Valor em MT(10^3)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              if (row.rubrica === 'Total') {
                return (
                  <tr key={idx} className="bg-slate-100 font-bold border-t-2 border-black">
                    <td className="border-r-2 border-black p-3 text-left font-black text-slate-800 bg-slate-100">{row.rubrica}</td>
                    <td className="p-3 text-center font-black text-slate-800 bg-slate-100">{totalCalculado.toLocaleString('pt-PT')}</td>
                  </tr>
                );
              }

              return (
                <tr key={idx} className="border-b-2 border-slate-200">
                  <td className="border-r-2 border-black p-3 text-left font-bold bg-slate-50 text-slate-700">{row.rubrica}</td>
                  <td className="p-0 relative">
                    <input
                      type="number"
                      min="0"
                      className="w-full h-full min-h-[44px] bg-transparent p-3 text-center font-mono font-bold focus:outline-none focus:bg-amber-100 text-slate-800"
                      value={row.valor || ''}
                      onChange={(e) => onChange(idx, e.target.value)}
                      placeholder="0"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
