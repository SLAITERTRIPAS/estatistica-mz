import React from 'react';
import { Landmark, Plus, Trash2, Calendar } from 'lucide-react';

interface PrevisaoRow {
  nomeCurso: string;
  duracaoAnos: number;
  iscedArea: string;
  iscedSubArea: string;
  regimeCurso: string;
  provincia: string;
  grau: string;
  homens: number;
  mulheres: number;
  total: number;
}

interface TablePrevisaoEstudantesProps {
  data: PrevisaoRow[] | undefined;
  onChange: (data: PrevisaoRow[]) => void;
  instCourses?: string[];
  selectedYear?: number;
  institutionAbbrev?: string;
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

const GRAUS_MZ = [
  'Bacharelato',
  'Licenciatura',
  'Mestrado',
  'Doutoramento',
  'Especialização',
  'Outro'
];

const REGIMES_MZ = [
  'Laboral',
  'Pós-Laboral',
  'EaD (Ensino à Distância)',
  'Misto'
];

const MAPA_CURSOS_ISCED: { [key: string]: { area: string; subarea: string; duracaoDefault: number; grauDefault: string } } = {
  'engenharia informática': { area: 'Tecnologias de Informação e Comunicação (TIC)', subarea: 'Ciências de Computadores e Software', duracaoDefault: 4, grauDefault: 'Licenciatura' },
  'informática': { area: 'Tecnologias de Informação e Comunicação (TIC)', subarea: 'Ciências de Computadores e Software', duracaoDefault: 4, grauDefault: 'Licenciatura' },
  'tecnologias de informação': { area: 'Tecnologias de Informação e Comunicação (TIC)', subarea: 'Desenvolvimento de Sistemas de Informação', duracaoDefault: 4, grauDefault: 'Licenciatura' },
  'desenvolvimento de software': { area: 'Tecnologias de Informação e Comunicação (TIC)', subarea: 'Ciências de Computadores e Software', duracaoDefault: 4, grauDefault: 'Licenciatura' },
  'sistemas de informação': { area: 'Tecnologias de Informação e Comunicação (TIC)', subarea: 'Tecnologias de Informação', duracaoDefault: 4, grauDefault: 'Licenciatura' },
  'ciências de computadores': { area: 'Tecnologias de Informação e Comunicação (TIC)', subarea: 'Ciências de Computadores', duracaoDefault: 4, grauDefault: 'Licenciatura' },
  
  'medicina': { area: 'Saúde e Bem-Estar', subarea: 'Medicina Clínica e Saúde Humana', duracaoDefault: 6, grauDefault: 'Licenciatura' },
  'enfermagem': { area: 'Saúde e Bem-Estar', subarea: 'Enfermagem e Cuidados de Saúde', duracaoDefault: 4, grauDefault: 'Licenciatura' },
  'saúde pública': { area: 'Saúde e Bem-Estar', subarea: 'Saúde Pública', duracaoDefault: 2, grauDefault: 'Mestrado' },
  'farmácia': { area: 'Saúde e Bem-Estar', subarea: 'Farmácia', duracaoDefault: 4, grauDefault: 'Licenciatura' },
  'nutrição': { area: 'Saúde e Bem-Estar', subarea: 'Nutrição e Ciências dos Alimentos', duracaoDefault: 4, grauDefault: 'Licenciatura' },
  'medicina dentária': { area: 'Saúde e Bem-Estar', subarea: 'Saúde Oral', duracaoDefault: 5, grauDefault: 'Licenciatura' },
  
  'direito': { area: 'Sociologia, Ciências Sociais e Direito', subarea: 'Direito e Jurisprudência', duracaoDefault: 4, grauDefault: 'Licenciatura' },
  
  'contabilidade': { area: 'Negócios, Administração e Direito', subarea: 'Contabilidade e Fiscalidade', duracaoDefault: 4, grauDefault: 'Licenciatura' },
  'finanças': { area: 'Negócios, Administração e Direito', subarea: 'Finanças, Banca e Seguros', duracaoDefault: 4, grauDefault: 'Licenciatura' },
  'gestão de empresas': { area: 'Negócios, Administração e Direito', subarea: 'Gestão e Administração Comercial', duracaoDefault: 4, grauDefault: 'Licenciatura' },
  'gestão': { area: 'Negócios, Administração e Direito', subarea: 'Gestão e Administração', duracaoDefault: 4, grauDefault: 'Licenciatura' },
  'administração pública': { area: 'Negócios, Administração e Direito', subarea: 'Administração Pública e Políticas Públicas', duracaoDefault: 4, grauDefault: 'Licenciatura' }
};

export const TablePrevisaoEstudantes: React.FC<TablePrevisaoEstudantesProps> = ({ 
  data, 
  onChange, 
  instCourses = [],
  selectedYear = 2026,
  institutionAbbrev = 'IES'
}) => {
  const targetYear = selectedYear + 1; // N+1

  // Ensure we have at least 12 rows initially if none exist
  const rows = React.useMemo(() => {
    const raw = data || [];
    if (raw.length === 0) {
      const initial: PrevisaoRow[] = Array.from({ length: 12 }, () => ({
        nomeCurso: '',
        duracaoAnos: 4,
        iscedArea: '',
        iscedSubArea: '',
        regimeCurso: '',
        provincia: '',
        grau: 'Licenciatura',
        homens: 0,
        mulheres: 0,
        total: 0
      }));
      return initial;
    }
    return raw;
  }, [data]);

  const handleRowChange = (index: number, field: keyof PrevisaoRow, value: any) => {
    const next = [...rows];
    
    if (field === 'nomeCurso') {
      const cursoLower = String(value).toLowerCase().trim();
      const detetado = MAPA_CURSOS_ISCED[cursoLower];
      if (detetado) {
        next[index] = {
          ...next[index],
          nomeCurso: value,
          iscedArea: detetado.area,
          iscedSubArea: detetado.subarea,
          duracaoAnos: detetado.duracaoDefault,
          grau: detetado.grauDefault
        };
      } else {
        next[index] = {
          ...next[index],
          nomeCurso: value
        };
      }
    } else {
      next[index] = {
        ...next[index],
        [field]: value
      };
    }

    // Always auto-compute the total on changes to homens or mulheres
    if (field === 'homens' || field === 'mulheres') {
      const h = field === 'homens' ? Number(value) : Number(next[index].homens) || 0;
      const m = field === 'mulheres' ? Number(value) : Number(next[index].mulheres) || 0;
      next[index].total = h + m;
    }

    onChange(next);
  };

  const handleAddRow = () => {
    const next = [...rows, {
      nomeCurso: '',
      duracaoAnos: 4,
      iscedArea: '',
      iscedSubArea: '',
      regimeCurso: '',
      provincia: '',
      grau: 'Licenciatura',
      homens: 0,
      mulheres: 0,
      total: 0
    }];
    onChange(next);
  };

  const handleRemoveRow = (index: number) => {
    const next = rows.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const handleClear = () => {
    const initial: PrevisaoRow[] = Array.from({ length: 12 }, () => ({
      nomeCurso: '',
      duracaoAnos: 4,
      iscedArea: '',
      iscedSubArea: '',
      regimeCurso: '',
      provincia: '',
      grau: 'Licenciatura',
      homens: 0,
      mulheres: 0,
      total: 0
    }));
    onChange(initial);
  };

  const totalHomens = rows.reduce((sum, r) => sum + (Number(r.homens) || 0), 0);
  const totalMulheres = rows.reduce((sum, r) => sum + (Number(r.mulheres) || 0), 0);
  const totalPrevisto = rows.reduce((sum, r) => sum + (Number(r.total) || 0), 0);

  return (
    <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4 w-[99%] max-w-none mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
        <div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Previsão preliminar para o ano letivo de {targetYear} (Ano N+1). Registe a previsão de estudantes matriculados por curso, indicando sexo masculino (Homens) e feminino (Mulheres).
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
        <table className="w-full text-xs text-left border-collapse bg-white min-w-[1200px]">
          <thead>
            {/* Super Header matching original Mozambique print layouts */}
            <tr className="bg-slate-200 border-b-2 border-black text-center text-slate-700 font-extrabold uppercase select-none">
              <th rowSpan={2} className="border-r border-slate-300 p-3 text-left w-1/5 align-middle font-black text-slate-800">
                Nome do curso
              </th>
              <th rowSpan={2} className="border-r border-slate-300 p-3 text-center w-[8%] align-middle font-black text-slate-800">
                **Duração (anos)
              </th>
              <th colSpan={2} className="border-r border-slate-300 p-2 text-center border-b border-slate-300 font-black text-slate-800 uppercase text-sm">
                {institutionAbbrev} {selectedYear - 1}
              </th>
              <th rowSpan={2} className="border-r border-slate-300 p-3 text-center w-[10%] align-middle font-black text-slate-800">
                Regime-Curso
              </th>
              <th rowSpan={2} className="border-r border-slate-300 p-3 text-left w-[12%] align-middle font-black text-slate-800">
                Província
              </th>
              <th rowSpan={2} className="border-r border-slate-300 p-3 text-center w-[10%] align-middle font-black text-slate-800">
                Grau
              </th>
              <th colSpan={3} className="border-r border-slate-300 p-2 text-center border-b border-slate-300 font-black text-slate-800">
                Número previsto de Estudantes matriculados em {targetYear}
              </th>
              <th rowSpan={2} className="p-3 text-center w-[45px] align-middle"></th>
            </tr>
            {/* Sub Header */}
            <tr className="bg-slate-100 border-b-2 border-black text-slate-600 font-bold uppercase select-none text-xs text-center">
              <th className="border-r border-slate-200 p-2 w-[12%]">Áreas</th>
              <th className="border-r border-slate-200 p-2 w-[12%]">Sub-áreas</th>
              <th className="border-r border-slate-200 p-2 font-black text-teal-800 bg-teal-50/40 w-[6%]">H (Homens)</th>
              <th className="border-r border-slate-200 p-2 font-black text-rose-800 bg-rose-50/40 w-[6%]">M (Mulheres)</th>
              <th className="border-r border-slate-200 p-2 font-black text-slate-900 bg-amber-50/40 w-[7%]">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50/55 transition-colors group">
                {/* Nome do curso (Select or typing lookup) */}
                <td className="border-r border-slate-200 p-1">
                  <div className="relative">
                    <input
                      type="text"
                      list={`inst-previsao-courses-${idx}`}
                      className="w-full bg-transparent px-2 py-1.5 focus:bg-amber-50/60 focus:outline-none placeholder-slate-300 text-slate-800 font-medium rounded-md text-sm"
                      placeholder="Introduza ou selecione o curso..."
                      value={row.nomeCurso}
                      onChange={(e) => handleRowChange(idx, 'nomeCurso', e.target.value)}
                    />
                    <datalist id={`inst-previsao-courses-${idx}`}>
                      {instCourses.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                </td>

                {/* Duração em Anos */}
                <td className="border-r border-slate-200 p-1">
                  <input
                    type="number"
                    min="1"
                    max="8"
                    className="w-full bg-transparent p-1.5 text-center font-mono font-bold focus:bg-amber-50/60 focus:outline-none text-slate-800 rounded-md"
                    value={row.duracaoAnos || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      handleRowChange(idx, 'duracaoAnos', isNaN(val) ? 0 : val);
                    }}
                  />
                </td>

                {/* ISCED Área */}
                <td className="border-r border-slate-200 p-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-2 py-1.5 focus:bg-amber-50/60 focus:outline-none placeholder-slate-300 text-slate-800 text-xs rounded-md"
                    placeholder="Ex: Ciências"
                    value={row.iscedArea}
                    onChange={(e) => handleRowChange(idx, 'iscedArea', e.target.value)}
                  />
                </td>

                {/* ISCED Sub-área */}
                <td className="border-r border-slate-200 p-1">
                  <input
                    type="text"
                    className="w-full bg-transparent px-2 py-1.5 focus:bg-amber-50/60 focus:outline-none placeholder-slate-300 text-slate-800 text-xs rounded-md"
                    placeholder="Ex: Química"
                    value={row.iscedSubArea}
                    onChange={(e) => handleRowChange(idx, 'iscedSubArea', e.target.value)}
                  />
                </td>

                {/* Regime Curso */}
                <td className="border-r border-slate-200 p-1">
                  <select
                    className="w-full bg-transparent px-1 py-1.5 focus:bg-amber-50/60 focus:outline-none text-slate-800 text-xs rounded-md cursor-pointer font-medium"
                    value={row.regimeCurso}
                    onChange={(e) => handleRowChange(idx, 'regimeCurso', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {REGIMES_MZ.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>

                {/* Província */}
                <td className="border-r border-slate-200 p-1">
                  <select
                    className="w-full bg-transparent px-1 py-1.5 focus:bg-amber-50/60 focus:outline-none text-slate-800 text-xs rounded-md cursor-pointer font-medium"
                    value={row.provincia}
                    onChange={(e) => handleRowChange(idx, 'provincia', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {PROVINCIAS_MZ.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </td>

                {/* Grau */}
                <td className="border-r border-slate-200 p-1">
                  <select
                    className="w-full bg-transparent px-1 py-1.5 focus:bg-amber-50/60 focus:outline-none text-slate-800 text-xs rounded-md cursor-pointer font-medium"
                    value={row.grau}
                    onChange={(e) => handleRowChange(idx, 'grau', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {GRAUS_MZ.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </td>

                {/* H (Homens) */}
                <td className="border-r border-slate-200 p-1 bg-teal-50/10">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full bg-transparent p-1.5 text-center font-mono font-bold text-teal-900 focus:bg-teal-100/50 focus:outline-none rounded-md"
                    value={row.homens || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      handleRowChange(idx, 'homens', isNaN(val) ? 0 : val);
                    }}
                  />
                </td>

                {/* M (Mulheres) */}
                <td className="border-r border-slate-200 p-1 bg-rose-50/10">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full bg-transparent p-1.5 text-center font-mono font-bold text-rose-900 focus:bg-rose-100/50 focus:outline-none rounded-md"
                    value={row.mulheres || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      handleRowChange(idx, 'mulheres', isNaN(val) ? 0 : val);
                    }}
                  />
                </td>

                {/* Total (Calculated) */}
                <td className="border-r border-slate-200 p-1 bg-amber-50/20 text-center font-mono font-black text-slate-800 select-none">
                  {row.total}
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
            <tr className="bg-slate-200 font-extrabold border-t-2 border-black text-slate-900 select-none text-sm">
              <td colSpan={7} className="border-r-2 border-black p-3 text-left pl-4 uppercase font-black tracking-wider">
                Total Geral Previsto ({targetYear})
              </td>
              <td className="p-3 text-center font-mono font-black border-r border-slate-300 bg-teal-100/70 text-teal-950">
                {totalHomens}
              </td>
              <td className="p-3 text-center font-mono font-black border-r border-slate-300 bg-rose-100/70 text-rose-950">
                {totalMulheres}
              </td>
              <td className="p-3 text-center font-mono font-black border-r-2 border-black bg-amber-100/80 text-amber-950">
                {totalPrevisto}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-between items-center bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-xs md:text-xs">
        <span className="text-slate-500 font-medium">💡 <strong>Dica de Produtividade:</strong> Digite ou selecione o curso. Para cursos conhecidos do currículo nacional, a duração e a classificação serão preenchidas automaticamente. O Total de Estudantes é autocalculado de forma segura.</span>
        <button
          type="button"
          onClick={handleAddRow}
          className="text-xs uppercase font-black bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg cursor-pointer transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_rgba(0,0,0,1)] shrink-0 flex items-center gap-1"
        >
          <Plus className="h-3.5 w-3.5 stroke-[3]" /> Adicionar Linha ao Quadro
        </button>
      </div>
    </div>
  );
};
