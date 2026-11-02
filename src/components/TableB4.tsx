import React from 'react';
import { BookOpen } from 'lucide-react';

interface TableB4Props {
  data: any[];
  onChange: (idx: number, field: string, subField: string, value: string) => void;
  onClasseIdadeChange: (idx: number, value: string) => void;
  onAddRow: () => void;
}

export const TableB4: React.FC<TableB4Props> = ({ data, onChange, onClasseIdadeChange, onAddRow }) => {
  return (
    <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4 w-[99%] max-w-none mx-auto overflow-x-auto">
      <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
        <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
          <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro B4. Número de CTA por grupo etário, nacionalidade e regime de contratação
        </h3>
        <button 
          type="button" 
          onClick={onAddRow}
          className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)] ml-2"
        >
          + Adicionar Linha
        </button>
      </div>

      <div className="rounded-xl border-2 border-black shadow-sm overflow-x-auto">
        <table className="w-full text-sm border-collapse bg-white whitespace-nowrap min-w-[max-content]">
          <thead>
            <tr className="bg-slate-200 border-b-2 border-black">
              <th rowSpan={2} className="border-r-2 border-black p-2 text-center font-bold">Classe de idade</th>
              <th colSpan={3} className="border-r-2 border-black p-2 text-center font-bold">Moçambicana</th>
              <th colSpan={3} className="border-r-2 border-black p-2 text-center font-bold">Estrangeira</th>
              <th rowSpan={2} className="border-r-2 border-black p-2 text-center font-bold">Total</th>
              <th rowSpan={2} className="border-r-2 border-black p-2 text-center font-bold">Total TI</th>
              <th rowSpan={2} className="p-2 text-center font-bold">Total TP</th>
            </tr>
            <tr className="bg-slate-300 border-b-2 border-black">
              <th className="p-2 text-center font-bold">TEMPO INTEIRO</th>
              <th className="p-2 text-center font-bold">TEMPO PARCIAL</th>
              <th className="border-r-2 border-black p-2 text-center font-bold">Total</th>
              <th className="p-2 text-center font-bold">TEMPO INTEIRO</th>
              <th className="p-2 text-center font-bold">TEMPO PARCIAL</th>
              <th className="border-r-2 border-black p-2 text-center font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row, idx) => (
              <tr key={idx} className="border-b-2 border-slate-200">
                <td className="border-r-2 border-black p-2 text-center font-bold bg-slate-50 text-xs">
                  {row.classeIdade}
                </td>
                {/* Moçambicana */}
                <td className="p-0 border-r border-slate-200">
                  <input type="number" className="w-full p-2 text-center" value={row.mocambicana?.ti || ''} onChange={(e) => onChange(idx, 'mocambicana', 'ti', e.target.value)} />
                </td>
                <td className="p-0 border-r border-slate-200">
                  <input type="number" className="w-full p-2 text-center" value={row.mocambicana?.tp || ''} onChange={(e) => onChange(idx, 'mocambicana', 'tp', e.target.value)} />
                </td>
                <td className="border-r-2 border-black p-2 text-center font-bold">{row.mocambicana?.total || 0}</td>
                {/* Estrangeira */}
                <td className="p-0 border-r border-slate-200">
                  <input type="number" className="w-full p-2 text-center" value={row.estrangeira?.ti || ''} onChange={(e) => onChange(idx, 'estrangeira', 'ti', e.target.value)} />
                </td>
                <td className="p-0 border-r border-slate-200">
                  <input type="number" className="w-full p-2 text-center" value={row.estrangeira?.tp || ''} onChange={(e) => onChange(idx, 'estrangeira', 'tp', e.target.value)} />
                </td>
                <td className="border-r-2 border-black p-2 text-center font-bold">{row.estrangeira?.total || 0}</td>
                <td className="border-r-2 border-black p-2 text-center font-bold">{ (row.mocambicana?.total || 0) + (row.estrangeira?.total || 0) }</td>
                <td className="border-r-2 border-black p-2 text-center font-bold">{row.totalTI || 0}</td>
                <td className="p-2 text-center font-bold">{row.totalTP || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
