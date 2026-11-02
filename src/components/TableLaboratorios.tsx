import React from 'react';
import { School, Plus, Trash2, Eye } from 'lucide-react';

interface LaboratorioRow {
  especialidade: string;
  area: string;
  subarea: string;
  provincia: string;
  distrito: string;
  numLaboratorios: number;
}

import { DISTRITOS_POR_PROVINCIA } from '../data/geography';

interface TableLaboratoriosProps {
  data: LaboratorioRow[] | undefined;
  onChange: (data: LaboratorioRow[]) => void;
  institutionAbbrev?: string;
  targetYear?: number;
}

// Simple list of provinces in Mozambique for autocomplete/dropdown if desired
const PROVINCIAS_MZ = [
  'Maputo Cidade',
  'Maputo Província',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Cabo Delgado',
  'Niassa'
];

export const TableLaboratorios: React.FC<TableLaboratoriosProps> = ({ data, onChange, institutionAbbrev = 'IES', targetYear = new Date().getFullYear() }) => {
  // Ensure we have at least 10 rows initially if none exist
  const rows = React.useMemo(() => {
    const raw = data || [];
    if (raw.length === 0) {
      const initial: LaboratorioRow[] = Array.from({ length: 12 }, () => ({
        especialidade: '',
        area: '',
        subarea: '',
        provincia: '',
        distrito: '',
        numLaboratorios: 0
      }));
      return initial;
    }
    return raw;
  }, [data]);

  const handleRowChange = (index: number, field: keyof LaboratorioRow, value: string | number) => {
    const next = [...rows];
    next[index] = {
      ...next[index],
      [field]: value
    };
    onChange(next);
  };

  const handleAddRow = () => {
    const next = [...rows, {
      especialidade: '',
      area: '',
      subarea: '',
      provincia: '',
      distrito: '',
      numLaboratorios: 0
    }];
    onChange(next);
  };

  const handleRemoveRow = (index: number) => {
    const next = rows.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const handleClear = () => {
    const initial: LaboratorioRow[] = Array.from({ length: 12 }, () => ({
      especialidade: '',
      area: '',
      subarea: '',
      provincia: '',
      distrito: '',
      numLaboratorios: 0
    }));
    onChange(initial);
  };

  const totalLaboratorios = rows.reduce((sum, r) => sum + (Number(r.numLaboratorios) || 0), 0);

  return (
    <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4 w-[99%] max-w-none mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
        <div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Registe os laboratórios de cada especialidade/curso, classificando-os pelas áreas e sub-áreas, província e distrito.
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs uppercase font-black tracking-wider text-red-500 hover:text-red-700 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 cursor-pointer"
          >
            Limpar Quadro
          </button>
          <button
            type="button"
            onClick={handleAddRow}
            className="text-xs uppercase font-black tracking-wider text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 flex items-center gap-1 cursor-pointer hover:shadow-sm"
          >
            <Plus className="h-3 w-3 stroke-[3]" /> Adicionar Linha
          </button>
        </div>
      </div>

      <div className="rounded-xl border-2 border-black shadow-sm overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse bg-white">
          <thead>
            {/* Super Header */}
            <tr className="bg-slate-200 border-b-2 border-black text-center text-slate-700 font-extrabold uppercase select-none">
              <th rowSpan={2} className="border-r border-slate-300 p-3 text-left w-1/4 align-middle font-black text-slate-800">Nome da Especialidade</th>
              <th colSpan={2} className="border-r border-slate-300 p-2 text-center border-b border-slate-300 font-black text-slate-800 uppercase text-xs">
                {institutionAbbrev} {targetYear - 1}
              </th>
              <th rowSpan={2} className="border-r border-slate-300 p-3 text-left w-1/6 align-middle font-black text-slate-800">Província</th>
              <th rowSpan={2} className="border-r border-slate-300 p-3 text-left w-1/6 align-middle font-black text-slate-800">Distrito</th>
              <th rowSpan={2} className="border-r border-slate-300 p-3 text-center w-1/8 align-middle font-black text-slate-800">Nº de Laboratórios</th>
              <th rowSpan={2} className="p-3 text-center w-[50px] align-middle"></th>
            </tr>
            {/* Sub Header */}
            <tr className="bg-slate-100 border-b-2 border-black text-slate-600 font-bold uppercase select-none text-xs">
              <th className="border-r border-slate-200 p-2 text-left font-black text-slate-705 w-[18%]">Áreas</th>
              <th className="border-r border-slate-200 p-2 text-left font-black text-slate-705 w-[18%]">Sub-áreas</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50/55 transition-colors group">
                {/* Nome da especialidade */}
                <td className="border-r border-slate-200 p-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-2 py-1.5 focus:bg-teal-50/60 focus:outline-none placeholder-slate-320 text-slate-800 font-medium rounded-md"
                    placeholder="Ex: Engenharia Civil"
                    value={row.especialidade}
                    onChange={(e) => handleRowChange(idx, 'especialidade', e.target.value)}
                  />
                </td>

                {/* IES: Áreas */}
                <td className="border-r border-slate-200 p-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-2 py-1.5 focus:bg-teal-50/60 focus:outline-none placeholder-slate-320 text-slate-800 text-sm rounded-md"
                    placeholder="Ex: Engenharia..."
                    value={row.area}
                    onChange={(e) => handleRowChange(idx, 'area', e.target.value)}
                  />
                </td>

                {/* IES: Sub-áreas */}
                <td className="border-r border-slate-200 p-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-2 py-1.5 focus:bg-teal-50/60 focus:outline-none placeholder-slate-320 text-slate-800 text-sm rounded-md"
                    placeholder="Ex: Construção Civil..."
                    value={row.subarea}
                    onChange={(e) => handleRowChange(idx, 'subarea', e.target.value)}
                  />
                </td>

                {/* Província */}
                <td className="border-r border-slate-200 p-1 relative">
                  <select
                    className="w-full bg-transparent px-1.5 py-1.5 focus:bg-teal-50/60 focus:outline-none text-slate-800 rounded-md cursor-pointer"
                    value={row.provincia}
                    onChange={(e) => handleRowChange(idx, 'provincia', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {PROVINCIAS_MZ.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </td>

                {/* Distrito */}
                <td className="border-r border-slate-200 p-1 relative">
                  <select
                    className="w-full bg-transparent px-1.5 py-1.5 focus:bg-teal-50/60 focus:outline-none text-slate-800 rounded-md cursor-pointer"
                    value={row.distrito}
                    onChange={(e) => handleRowChange(idx, 'distrito', e.target.value)}
                    disabled={!row.provincia}
                  >
                    <option value="">Selecione...</option>
                    {(DISTRITOS_POR_PROVINCIA[row.provincia] || []).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </td>

                {/* Número de Laboratórios */}
                <td className="border-r border-slate-200 p-1">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full bg-transparent p-1.5 text-center font-mono font-bold focus:bg-teal-50/60 focus:outline-none text-slate-850 rounded-md"
                    value={row.numLaboratorios || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      handleRowChange(idx, 'numLaboratorios', isNaN(val) ? 0 : val);
                    }}
                  />
                </td>

                {/* Delete button */}
                <td className="p-1 text-center align-middle">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    tabIndex={-1}
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer group-hover:opacity-100"
                    title="Remover linha"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-200 font-extrabold border-t-2 border-black text-slate-900 select-none">
              <td colSpan={5} className="border-r-2 border-black p-3 text-left pl-4 uppercase font-black tracking-wider">
                Total
              </td>
              <td className="p-3 text-center font-mono text-sm font-black border-r border-slate-300 bg-slate-200">
                {totalLaboratorios}
              </td>
              <td className="bg-slate-250"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-between items-center bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-xs md:text-xs">
        <span className="text-slate-500 font-medium">💡 <strong>Dica {institutionAbbrev}:</strong> Classifique os laboratórios de acordo com as diretrizes curriculares do ensino superior em Moçambique.</span>
        <button
          type="button"
          onClick={handleAddRow}
          className="text-xs uppercase font-black bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_rgba(0,0,0,1)] shrink-0 flex items-center gap-1"
        >
          <Plus className="h-3.5 w-3.5 stroke-[3]" /> Adicionar uma Nova Linha
        </button>
      </div>
    </div>
  );
};
