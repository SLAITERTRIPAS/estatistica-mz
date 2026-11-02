import React from 'react';
import { Landmark, Plus, Trash2 } from 'lucide-react';
import { DISTRITOS_POR_PROVINCIA } from '../data/geography';

interface SalaAulaRow {
  unidadeOrganica: string;
  provincia: string;
  distrito: string;
  grau: string;
  numSalas: number;
}

interface TableSalasAulaProps {
  data: SalaAulaRow[] | undefined;
  onChange: (data: SalaAulaRow[]) => void;
  institutionAbbrev?: string;
  targetYear?: number;
}

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

export const TableSalasAula: React.FC<TableSalasAulaProps> = ({ data, onChange, institutionAbbrev, targetYear }) => {
  // Ensure we have at least 12 rows initially if none exist
  const rows = React.useMemo(() => {
    const raw = data || [];
    if (raw.length === 0) {
      const initial: SalaAulaRow[] = Array.from({ length: 12 }, () => ({
        unidadeOrganica: '',
        provincia: '',
        distrito: '',
        grau: '',
        numSalas: 0
      }));
      return initial;
    }
    return raw;
  }, [data]);

  const handleRowChange = (index: number, field: keyof SalaAulaRow, value: string | number) => {
    const next = [...rows];
    next[index] = {
      ...next[index],
      [field]: value
    };
    onChange(next);
  };

  const handleAddRow = () => {
    const next = [...rows, {
      unidadeOrganica: '',
      provincia: '',
      distrito: '',
      grau: '',
      numSalas: 0
    }];
    onChange(next);
  };

  const handleRemoveRow = (index: number) => {
    const next = rows.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const handleClear = () => {
    const initial: SalaAulaRow[] = Array.from({ length: 12 }, () => ({
      unidadeOrganica: '',
      provincia: '',
      distrito: '',
      grau: '',
      numSalas: 0
    }));
    onChange(initial);
  };

  const totalSalas = rows.reduce((sum, r) => sum + (Number(r.numSalas) || 0), 0);

  return (
    <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4 w-[99%] max-w-none mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
        <div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Registe o número de salas de aula por unidade orgânica, delegação, extensão, faculdade ou escola com a sua respetiva província, distrito e grau.
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
            <tr className="bg-slate-200 border-b-2 border-black text-slate-700 font-extrabold uppercase select-none">
              <th className="border-r border-slate-300 p-3 text-left w-2/5 font-black text-slate-850">
                Unidade Orgânica, ou Delegação, ou Extensão, ou Faculdade, escola ou outra designação
              </th>
              <th className="border-r border-slate-300 p-3 text-left w-1/6 font-black text-slate-850">Província</th>
              <th className="border-r border-slate-300 p-3 text-left w-1/6 font-black text-slate-850">Distrito</th>
              <th className="border-r border-slate-300 p-3 text-left w-1/8 font-black text-slate-850">Grau</th>
              <th className="border-r border-slate-300 p-3 text-center w-1/8 font-black text-slate-850">Número de salas de aulas</th>
              <th className="p-3 text-center w-[50px]"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50/55 transition-colors group">
                {/* Unidade Orgânica */}
                <td className="border-r border-slate-200 p-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-2 py-1.5 focus:bg-teal-50/60 focus:outline-none placeholder-slate-300 text-slate-800 font-medium rounded-md"
                    placeholder="Ex: Faculdade de Engenharia"
                    value={row.unidadeOrganica}
                    onChange={(e) => handleRowChange(idx, 'unidadeOrganica', e.target.value)}
                  />
                </td>

                {/* Província */}
                <td className="border-r border-slate-200 p-1">
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

                {/* Grau */}
                <td className="border-r border-slate-200 p-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-2 py-1.5 focus:bg-teal-50/60 focus:outline-none placeholder-slate-300 text-slate-800 rounded-md"
                    placeholder="Ex: Licenciatura"
                    value={row.grau}
                    onChange={(e) => handleRowChange(idx, 'grau', e.target.value)}
                  />
                </td>

                {/* Número de Salas */}
                <td className="border-r border-slate-200 p-1">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full bg-transparent p-1.5 text-center font-mono font-bold focus:bg-teal-50/60 focus:outline-none text-slate-800 rounded-md"
                    value={row.numSalas || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      handleRowChange(idx, 'numSalas', isNaN(val) ? 0 : val);
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
              <td colSpan={4} className="border-r-2 border-black p-3 text-left pl-4 uppercase font-black tracking-wider">
                Total
              </td>
              <td className="p-3 text-center font-mono text-sm font-black border-r border-slate-300 bg-slate-200">
                {totalSalas}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-between items-center bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-xs md:text-xs">
        <span className="text-slate-500 font-medium">💡 <strong>Dica:</strong> Insira os totais de salas por faculdade/delegação física ativa neste ano académico.</span>
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
