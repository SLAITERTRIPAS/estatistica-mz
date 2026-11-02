import React from 'react';
import { PiggyBank } from 'lucide-react';

interface TableDespesaDetalhadaProps {
  data: Array<{ categoria: string; valor: number }> | undefined;
  onChange: (categoria: string, value: string) => void;
}

export const TableDespesaDetalhada: React.FC<TableDespesaDetalhadaProps> = ({ data, onChange }) => {
  // Safe fallback if not loaded
  const rows = data || [
    { categoria: 'Funcionamento - Ensino', valor: 0 },
    { categoria: 'Funcionamento - Investigação', valor: 0 },
    { categoria: 'Funcionamento - Administração', valor: 0 },
    { categoria: 'Salários - Docentes', valor: 0 },
    { categoria: 'Salários - Corpo Técnico Administrativos', valor: 0 },
    { categoria: 'Salários - Outros', valor: 0 },
    { categoria: 'Investimento - Investimento', valor: 0 },
    { categoria: 'Investimento - Depreciação de edifícios e Equipamentos', valor: 0 },
    { categoria: 'Investimento - Outros', valor: 0 },
    { categoria: 'Reembolso de capital (créditos)', valor: 0 }
  ];

  const getVal = (cat: string) => rows.find(r => r.categoria === cat)?.valor || 0;

  // Calculations
  const subTotalFuncionamento =
    getVal('Funcionamento - Ensino') +
    getVal('Funcionamento - Investigação') +
    getVal('Funcionamento - Administração');

  const subTotalSalarios =
    getVal('Salários - Docentes') +
    getVal('Salários - Corpo Técnico Administrativos') +
    getVal('Salários - Outros');

  const subTotalInvestimento =
    getVal('Investimento - Investimento') +
    getVal('Investimento - Depreciação de edifícios e Equipamentos') +
    getVal('Investimento - Outros');

  const reembolsoCapital = getVal('Reembolso de capital (créditos)');

  const grandeTotal = subTotalFuncionamento + subTotalSalarios + subTotalInvestimento + reembolsoCapital;

  const renderInputRow = (label: string, categoryKey: string, focusBgClass: string) => {
    const val = getVal(categoryKey);
    return (
      <tr className="border-b border-slate-200">
        <td className="border-r-2 border-black p-3 pl-6 text-left font-medium text-slate-700 bg-slate-50">{label}</td>
        <td className="p-0 relative">
          <input
            type="number"
            min="0"
            className={`w-full h-full min-h-[44px] bg-transparent p-3 text-center font-mono font-bold focus:outline-none focus:bg-${focusBgClass}-100 text-slate-800`}
            value={val || ''}
            onChange={(e) => onChange(categoryKey, e.target.value)}
            placeholder="0"
          />
        </td>
      </tr>
    );
  };

  const renderHeaderRow = (title: string) => (
    <tr className="bg-slate-100 font-extrabold border-b-2 border-slate-300">
      <td colSpan={2} className="border-r-2 border-black p-3 pl-4 text-left text-slate-900 uppercase tracking-wide text-xs">
        {title}
      </td>
    </tr>
  );

  const renderSubTotalRow = (title: string, value: number) => (
    <tr className="bg-slate-100 font-extrabold border-b-2 border-black">
      <td className="border-r-2 border-black p-3 pl-4 text-left text-slate-800">{title}</td>
      <td className="p-3 text-center font-mono text-slate-900 bg-slate-100 font-black">
        {value.toLocaleString('pt-PT')}
      </td>
    </tr>
  );

  return (
    <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4 w-[99%] max-w-none mx-auto">
      <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
        <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
          <PiggyBank className="h-4 w-4 text-purple-700" /> Quadro 3. Despesa para funcionamento e investimento
        </h3>
      </div>

      <div className="rounded-xl border-2 border-black shadow-sm overflow-hidden">
        <table className="w-full text-xs border-collapse bg-white whitespace-nowrap">
          <thead>
            <tr className="bg-slate-200 border-b-2 border-black">
              <th className="border-r-2 border-black p-3 text-left font-black text-slate-700 w-2/3 uppercase">Categoria de despesa</th>
              <th className="p-3 text-center font-black text-slate-700 w-1/3 uppercase">Valor em MT(10^3)</th>
            </tr>
          </thead>
          <tbody>
            {/* Secção 1 */}
            {renderHeaderRow('Despesa corrente de funcionamento')}
            {renderInputRow('Ensino', 'Funcionamento - Ensino', 'purple')}
            {renderInputRow('Investigação', 'Funcionamento - Investigação', 'purple')}
            {renderInputRow('Administração', 'Funcionamento - Administração', 'purple')}
            {renderSubTotalRow('Sub-total', subTotalFuncionamento)}

            {/* Secção 2 */}
            {renderHeaderRow('Salário e outros benefícios')}
            {renderInputRow('Docentes', 'Salários - Docentes', 'indigo')}
            {renderInputRow('Corpo Técnico Administrativos', 'Salários - Corpo Técnico Administrativos', 'indigo')}
            {renderInputRow('Outros', 'Salários - Outros', 'indigo')}
            {renderSubTotalRow('Sub total', subTotalSalarios)}

            {/* Secção 3 */}
            {renderHeaderRow('Despesa de investimento')}
            {renderInputRow('Investimento', 'Investimento - Investimento', 'amber')}
            {renderInputRow('Depreciação de edifícios e Equipamentos', 'Investimento - Depreciação de edifícios e Equipamentos', 'amber')}
            {renderInputRow('Outros', 'Investimento - Outros', 'amber')}
            {renderSubTotalRow('Sub total', subTotalInvestimento)}

            {/* Reembolso */}
            <tr className="border-b-2 border-black bg-slate-50">
              <td className="border-r-2 border-black p-3 pl-4 text-left font-black text-slate-800 uppercase text-xs">Reembolso de capital (créditos)</td>
              <td className="p-0 relative">
                <input
                  type="number"
                  min="0"
                  className="w-full h-full min-h-[44px] bg-transparent p-3 text-center font-mono font-bold focus:outline-none focus:bg-emerald-100 text-slate-800"
                  value={reembolsoCapital || ''}
                  onChange={(e) => onChange('Reembolso de capital (créditos)', e.target.value)}
                  placeholder="0"
                />
              </td>
            </tr>

            {/* Grande Total */}
            <tr className="bg-slate-200 font-extrabold border-t-2 border-black">
              <td className="border-r-2 border-black p-3 pl-4 text-left font-black text-slate-950 uppercase">Grande total</td>
              <td className="p-3 text-center font-black text-slate-950 bg-slate-200 font-mono text-sm">
                {grandeTotal.toLocaleString('pt-PT')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
