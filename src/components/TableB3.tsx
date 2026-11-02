import React from 'react';
import { BookOpen } from 'lucide-react';

interface TableB3Props {
  data: any[];
  onChange: (idx: number, field: string, subField: string, value: string) => void;
  onAddRow: () => void;
}

export const TableB3: React.FC<TableB3Props> = ({ data, onChange, onAddRow }) => {
  return (
    <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4 w-[99%] max-w-none mx-auto overflow-x-auto">
      <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
        <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
          <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro B3. Número de CTA por tipo de relação contratual, nível de formação e sexo
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
              <th rowSpan={2} className="border-r-2 border-black p-2 text-center font-bold">Tipo de Relação</th>
              <th colSpan={3} className="border-r-2 border-black p-2 text-center font-bold">Ensino Primário</th>
              <th colSpan={3} className="border-r-2 border-black p-2 text-center font-bold">Ensino Secundário (1º Ciclo)</th>
              <th colSpan={3} className="border-r-2 border-black p-2 text-center font-bold">Ensino Secundário (2º Ciclo)</th>
              <th colSpan={3} className="border-r-2 border-black p-2 text-center font-bold">Bacharel</th>
              <th colSpan={3} className="border-r-2 border-black p-2 text-center font-bold">Licenciado</th>
              <th colSpan={3} className="border-r-2 border-black p-2 text-center font-bold">Mestre</th>
              <th colSpan={3} className="border-r-2 border-black p-2 text-center font-bold">Pós Graduados</th>
              <th colSpan={3} className="p-2 text-center font-bold">Doutorado</th>
            </tr>
            <tr className="bg-slate-300 border-b-2 border-black">
              {[...Array(8)].map((_, i) => (
                <React.Fragment key={i}>
                  <th className="border-r border-gray-300 p-2 text-center font-bold">Homens</th>
                  <th className="border-r border-gray-300 p-2 text-center font-bold">Mulheres</th>
                  <th className={`p-2 text-center font-bold ${i < 7 ? 'border-r-2 border-black' : ''}`}>Total</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((row, idx) => (
              <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="border-r-2 border-black p-2 text-center font-black bg-slate-50">{row.tipoRelacao}</td>
                {['ensinoPrimario', 'ensinoSecundario1', 'ensinoSecundario2', 'bacharel', 'licenciado', 'mestre', 'posGraduados', 'doutorado'].map((lvl, i) => {
                  const dKey = lvl as 'ensinoPrimario' | 'ensinoSecundario1' | 'ensinoSecundario2' | 'bacharel' | 'licenciado' | 'mestre' | 'posGraduados' | 'doutorado';
                  return (
                    <React.Fragment key={lvl}>
                      <td className="border-r border-gray-200 p-0 relative">
                        <input type="number" min="0" className="w-[45px] h-full min-h-[36px] bg-transparent p-1 text-center font-mono focus:outline-none focus:bg-amber-100" value={row[dKey]?.homens || ''} onChange={(e) => onChange(idx, dKey, 'homens', e.target.value)} />
                      </td>
                      <td className="border-r border-gray-200 p-0 relative">
                        <input type="number" min="0" className="w-[45px] h-full min-h-[36px] bg-transparent p-1 text-center font-mono focus:outline-none focus:bg-amber-100" value={row[dKey]?.mulheres || ''} onChange={(e) => onChange(idx, dKey, 'mulheres', e.target.value)} />
                      </td>
                      <td className={`p-0 relative bg-slate-50 ${i < 7 ? 'border-r-2 border-black' : ''}`}>
                        <div className="w-[45px] h-full min-h-[36px] flex items-center justify-center font-bold text-slate-700">{row[dKey]?.total || 0}</div>
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
