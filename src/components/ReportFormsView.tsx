import React from 'react';
import { AcademicYearData, Institution, User } from '../types';
import { BookOpen, DollarSign, Award, Grid, ShieldAlert, Users, GraduationCap, Search, Briefcase, Coins, School, TrendingUp } from 'lucide-react';
import ReportSignature from './ReportSignature';

interface ReportFormsViewProps {
  data: AcademicYearData;
  scope: 'nacional' | 'provincial' | 'regional' | 'institucional';
  year: number;
  institutionAbbrev?: string;
  institution?: Institution;
  currentUser?: User | null;
}

export default function ReportFormsView({ data, scope, year, institutionAbbrev, institution, currentUser }: ReportFormsViewProps) {
  const abbrev = institutionAbbrev || 'IES';
  // Safe helper to sum totals across tables
  const formatMT = (val?: number) => {
    return (val || 0).toLocaleString('pt-PT');
  };

  const getScopeLabel = () => {
    switch (scope) {
      case 'nacional': return 'CONSOLIDAÇÃO NACIONAL DE MOÇAMBIQUE';
      case 'provincial': return 'CONSOLIDAÇÃO PROVINCIAL';
      case 'regional': return 'CONSOLIDAÇÃO REGIONAL';
      case 'institucional': return 'RELATÓRIO INSTITUCIONAL GERAL';
      default: return 'REGISTO CONSOLIDADO';
    }
  };

  // Extract despesas totals
  const funcionamento = (data.despesasIES || []).find(r => r.rubrica === 'Despesas de Funcionamento')?.valor || 0;
  const investimento = (data.despesasIES || []).find(r => r.rubrica === 'Despesas de Investimento')?.valor || 0;
  const totalDespesas = funcionamento + investimento;

  // Extract financiamento total
  const totalFinanciamento = (data.financiamentoIES || []).reduce((acc, r) => acc + (r.fonte !== 'Total' ? Number(r.valor) : 0), 0);

  // Extract despesa detalhada total
  const totalDespesaDetalhada = (data.despesaFuncionamentoInvestimentoIES || []).reduce((acc, r) => acc + Number(r.valor), 0);

  // Mock authority for non-institutional scopes
  const mockAuthority: Institution = institution || {
    id: 'gov-mz',
    name: 'Ministério da Ciência, Tecnologia e Ensino Superior',
    province: 'Maputo Cidade',
    rector: 'Ministro da MCTES',
    type: 'Pública',
    abbreviation: 'MCTES',
    responsavel: {
      nome: 'Director Nacional de Ensino Superior',
      funcao: 'Direcção Nacional',
      contacto: '+258 21 000 000',
      email: 'dnes@mctes.gov.mz'
    },
    focalPoint: {
      nome: 'Técnico de Estatística Central',
      funcao: 'Departamento de Estatística',
      contacto: '+258 21 000 001',
      email: 'estatistica@mctes.gov.mz'
    }
  };

  return (
    <div className="space-y-16 mt-12 text-left">
      
      {/* SECTION HEADER BLOCK */}
      <div className="border-b-4 border-slate-900 pb-3 mb-10 text-center">
        <h2 className="text-xl font-black uppercase tracking-widest text-[#009E60]">
          PARTE II • CADERNO COMPILADO DE QUADROS ESTATÍSTICOS OFICIAIS
        </h2>
        <p className="text-xs italic text-slate-500 mt-1 uppercase">
          {getScopeLabel()} • ANO DE REFERÊNCIA {year - 1} (RECOLHA {year})
        </p>
      </div>

      {/* QUADRO RESUMO: SUMMARY METRICS CARD */}
      <div className="bg-slate-50 border-2 border-slate-900 p-6 rounded-2xl space-y-4 shadow-sm" id="quadro-resumo-rapido">
        <div className="flex items-center gap-2 text-indigo-950 font-bold border-b border-slate-300 pb-2">
          <Award className="h-5 w-5 text-indigo-805" />
          <h3 className="text-md uppercase font-black">Quadro Resumo. Indicadores de Síntese Consolidada</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-xs uppercase font-bold text-slate-500 block">Estudantes Matriculados</span>
            <span className="text-xl font-black text-slate-800">{(data.studentsMale || 0) + (data.studentsFemale || 0)}</span>
            <div className="text-xs text-slate-400 font-mono mt-0.5">M: {data.studentsMale || 0} | F: {data.studentsFemale || 0}</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-xs uppercase font-bold text-slate-500 block">Novos Ingressos</span>
            <span className="text-xl font-black text-slate-800">{(data.newAdmissionsMale || 0) + (data.newAdmissionsFemale || 0)}</span>
            <div className="text-xs text-slate-400 font-mono mt-0.5">M: {data.newAdmissionsMale || 0} | F: {data.newAdmissionsFemale || 0}</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-xs uppercase font-bold text-slate-500 block">Docentes Tempo Integral</span>
            <span className="text-xl font-black text-slate-800">{data.teachersFullTime || 0}</span>
            <div className="text-xs text-slate-400 font-mono mt-0.5">Mestres+: {(data.teachersWithPhD || 0) + (data.teachersWithMasters || 0)}</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-xs uppercase font-bold text-slate-500 block">Pessoal de Apoio (CTA)</span>
            <span className="text-xl font-black text-slate-800">{(data.staffMale || 0) + (data.staffFemale || 0)}</span>
            <div className="text-xs text-slate-400 font-mono mt-0.5">Grau Superior: {data.staffWithBachelors || 0}</div>
          </div>
        </div>
      </div>

      <div className="page-break-before" />

      {/* ==================== EIXO I: CORPO DISCENTE (Fluxo de Estudantes) ==================== */}
      <div className="space-y-10" id="relatorio-eixo-1">
        <div className="border-[#009E60] border-l-8 pl-4 py-1.5 bg-[#009E60]/5">
          <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tight">EIXO I: CORPO DISCENTE (Alunos)</h3>
          <p className="text-sm text-slate-500 font-medium ">Acesso, dinâmicas de preenchimento de vagas, matrículas, graduações e necessidades especiais.</p>
        </div>

        {/* 1.1 PROCURAM ENSINO SUPERIOR */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
            <Grid className="h-4 w-4 text-[#009E60]" /> Quadro 1.1. Candidatos que Procuram Ensino Superior
          </h4>
          <div className="overflow-x-auto border-2 border-black rounded-xl">
            <table className="w-full text-xs border-collapse bg-white text-center">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-black text-slate-800 font-bold">
                  <th className="p-2 text-left">Curso de Ensino Superior</th>
                  <th className="p-2">Regime</th>
                  <th className="p-2">Grau</th>
                  <th className="p-2">Província / Distrito</th>
                  <th className="p-2">Área {abbrev}</th>
                  <th className="p-2">Homens</th>
                  <th className="p-2">Mulheres</th>
                  <th className="p-2 bg-slate-50 font-black">Total</th>
                </tr>
              </thead>
              <tbody>
                {(data.coursesProcuraES || []).length > 0 ? (
                  (data.coursesProcuraES || []).map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200 font-mono hover:bg-slate-50 text-xs">
                      <td className="p-2 text-left  font-black">{row.nomeCurso}</td>
                      <td className="p-2 ">{row.regimeCurso}</td>
                      <td className="p-2 ">{row.grau}</td>
                      <td className="p-2 text-slate-500">{row.provincia} / {row.distrito}</td>
                      <td className="p-2 text-slate-500">{row.iscedArea} - {row.iscedSubArea}</td>
                      <td className="p-2">{row.homens}</td>
                      <td className="p-2">{row.mulheres}</td>
                      <td className="p-2 bg-slate-50 font-black">{(row.homens || 0) + (row.mulheres || 0)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-slate-400 italic">Nenhum registo de procura de ensino superior catalogado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 1.2 VAGAS EXISTENTES E PREENCHIDAS */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
            <Grid className="h-4 w-4 text-[#009E60]" /> Quadro 1.2. Vagas Existentes, Preenchidas e Sobrantes por Curso
          </h4>
          <div className="overflow-x-auto border-2 border-black rounded-xl">
            <table className="w-full text-xs border-collapse bg-white text-center">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-black text-slate-800 font-bold">
                  <th className="p-2 text-left">Curso</th>
                  <th className="p-2">Regime</th>
                  <th className="p-2">Grau</th>
                  <th className="p-2">Vagas Existentes</th>
                  <th className="p-2 text-emerald-850">Vagas Preenchidas</th>
                  <th className="p-2 text-amber-850">Vagas Não Preenchidas (Sobrantes)</th>
                  <th className="p-2">Nacionalidade</th>
                  <th className="p-2 text-slate-500">Local de Oferta</th>
                </tr>
              </thead>
              <tbody>
                {(data.coursesVagasPreenchidas || []).length > 0 ? (
                  (data.coursesVagasPreenchidas || []).map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200 font-mono hover:bg-slate-50 text-xs">
                      <td className="p-2 text-left  font-black">{row.nomeCurso}</td>
                      <td className="p-2 ">{row.regimeCurso}</td>
                      <td className="p-2 ">{row.grau}</td>
                      <td className="p-2 font-bold">{row.vagasExistentes ?? (row.vagasPreenchidas + row.vagasNaoPreenchidas)}</td>
                      <td className="p-2 text-emerald-800 font-bold">{row.vagasPreenchidas}</td>
                      <td className="p-2 text-amber-700">{row.vagasNaoPreenchidas}</td>
                      <td className="p-2 ">{row.nacionalidade}</td>
                      <td className="p-2 text-slate-500 text-xs">{row.provincia} / {row.distrito}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-slate-400 italic">Nenhum registo de preenchimento de vagas inserido.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 1.3 ESTUDANTES QUADRO GERAL */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
            <Grid className="h-4 w-4 text-[#009E60]" /> Quadro 1.3. Quadro Geral de Estudantes por Curso (Novos, Matriculados e Graduados)
          </h4>
          <div className="overflow-x-auto border-2 border-black rounded-xl border-collapse">
            <table className="w-full text-xs border-collapse bg-white text-center">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-black text-slate-800 font-bold">
                  <th rowSpan={2} className="border-r border-slate-300 p-2 text-left">Curso e Grau</th>
                  <th colSpan={3} className="border-r border-slate-300 p-1 text-blue-900">Novos Ingressos</th>
                  <th colSpan={3} className="border-r border-slate-300 p-1 text-slate-900 bg-slate-50">Matriculados Totais</th>
                  <th colSpan={3} className="p-1 text-emerald-900">Graduados do Ano</th>
                </tr>
                <tr className="bg-slate-50 border-b-2 border-black font-semibold text-xs">
                  <th className="border-r border-slate-200 py-1">H</th>
                  <th className="border-r border-slate-200 py-1">M</th>
                  <th className="border-r border-slate-300 py-1 font-bold bg-slate-100">T</th>
                  <th className="border-r border-slate-200 py-1">H</th>
                  <th className="border-r border-slate-200 py-1">M</th>
                  <th className="border-r border-slate-300 py-1 font-bold bg-slate-100">T</th>
                  <th className="border-r border-slate-200 py-1">H</th>
                  <th className="border-r border-slate-200 py-1">M</th>
                  <th className="font-bold bg-slate-100 py-1">T</th>
                </tr>
              </thead>
              <tbody>
                {(data.coursesEstudantesDinamica || []).length > 0 ? (
                  (data.coursesEstudantesDinamica || []).map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200 font-mono hover:bg-slate-50 text-xs">
                      <td className="border-r border-slate-250 p-2 text-left  font-black">
                        {row.nomeCurso} <span className="text-xs font-normal text-slate-500 block">({row.grau} — {row.regimeCurso})</span>
                      </td>
                      <td className="border-r border-slate-150 py-1">{row.novosIngressosHomens}</td>
                      <td className="border-r border-slate-150 py-1">{row.novosIngressosMulheres}</td>
                      <td className="border-r-2 border-slate-300 py-1 font-bold bg-slate-50/70">{(row.novosIngressosHomens || 0) + (row.novosIngressosMulheres || 0)}</td>
                      <td className="border-r border-slate-150 py-1">{row.matriculadosHomens}</td>
                      <td className="border-r border-slate-150 py-1">{row.matriculadosMulheres}</td>
                      <td className="border-r-2 border-slate-300 py-1 font-bold bg-slate-50/70">{(row.matriculadosHomens || 0) + (row.matriculadosMulheres || 0)}</td>
                      <td className="border-r border-slate-150 py-1">{row.graduadosHomens}</td>
                      <td className="border-r border-slate-150 py-1">{row.graduadosMulheres}</td>
                      <td className="font-bold bg-slate-50/70 py-1">{(row.graduadosHomens || 0) + (row.graduadosMulheres || 0)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="p-4 text-center text-slate-400 italic">Sem dinâmicas de preenchimento inseridas por curso.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 1.4 DINÂMICA NACIONALIDADE SUMMARY */}
        {data.nacionalidadeDinamica && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
              <Grid className="h-4 w-4 text-[#009E60]" /> Quadro 1.4. Dinâmica Geral de Fluxos por Nacionalidade
            </h4>
            <div className="overflow-x-auto border-2 border-black rounded-xl">
              <table className="w-full text-xs border-collapse bg-white text-center">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-black text-slate-800 font-bold">
                    <th className="p-2 text-left">Fluxo Estudantil</th>
                    <th colSpan={3} className="border-r border-slate-300 p-2">Por Nacionalidade Moçambicana</th>
                    <th colSpan={3} className="p-2">Por Nacionalidade Estrangeira</th>
                  </tr>
                  <tr className="bg-slate-50 border-b-2 border-black font-semibold text-xs">
                    <td className="p-2 text-left  font-black">Categoria</td>
                    <td className="border-r border-slate-200">Homens</td>
                    <td className="border-r border-slate-200">Mulheres</td>
                    <td className="border-r-2 border-slate-300 font-bold bg-slate-100">Total</td>
                    <td className="border-r border-slate-200">Homens</td>
                    <td className="border-r border-slate-200">Mulheres</td>
                    <td className="font-bold bg-slate-100">Total</td>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200 font-mono hover:bg-slate-50">
                    <td className="p-2 text-left  font-bold text-slate-700">Novos Ingressos</td>
                    <td className="p-2">{data.nacionalidadeDinamica.novosIngressosMocambicana?.homens || 0}</td>
                    <td className="p-2">{data.nacionalidadeDinamica.novosIngressosMocambicana?.mulheres || 0}</td>
                    <td className="p-2 font-black bg-slate-50">{(data.nacionalidadeDinamica.novosIngressosMocambicana?.homens || 0) + (data.nacionalidadeDinamica.novosIngressosMocambicana?.mulheres || 0)}</td>
                    <td className="p-2">{data.nacionalidadeDinamica.novosIngressosEstrangeira?.homens || 0}</td>
                    <td className="p-2">{data.nacionalidadeDinamica.novosIngressosEstrangeira?.mulheres || 0}</td>
                    <td className="p-2 font-black bg-slate-50">{(data.nacionalidadeDinamica.novosIngressosEstrangeira?.homens || 0) + (data.nacionalidadeDinamica.novosIngressosEstrangeira?.mulheres || 0)}</td>
                  </tr>
                  <tr className="border-b border-slate-200 font-mono hover:bg-slate-50">
                    <td className="p-2 text-left  font-bold text-slate-700">Matriculados Totais</td>
                    <td className="p-2">{data.nacionalidadeDinamica.matriculadosMocambicana?.homens || 0}</td>
                    <td className="p-2">{data.nacionalidadeDinamica.matriculadosMocambicana?.mulheres || 0}</td>
                    <td className="p-2 font-black bg-slate-50">{(data.nacionalidadeDinamica.matriculadosMocambicana?.homens || 0) + (data.nacionalidadeDinamica.matriculadosMocambicana?.mulheres || 0)}</td>
                    <td className="p-2">{data.nacionalidadeDinamica.matriculadosEstrangeira?.homens || 0}</td>
                    <td className="p-2">{data.nacionalidadeDinamica.matriculadosEstrangeira?.mulheres || 0}</td>
                    <td className="p-2 font-black bg-slate-50">{(data.nacionalidadeDinamica.matriculadosEstrangeira?.homens || 0) + (data.nacionalidadeDinamica.matriculadosEstrangeira?.mulheres || 0)}</td>
                  </tr>
                  <tr className="font-mono hover:bg-slate-50">
                    <td className="p-2 text-left  font-bold text-slate-700">Graduados Líquidos</td>
                    <td className="p-2">{data.nacionalidadeDinamica.graduadosMocambicana?.homens || 0}</td>
                    <td className="p-2">{data.nacionalidadeDinamica.graduadosMocambicana?.mulheres || 0}</td>
                    <td className="p-2 font-black bg-slate-50">{(data.nacionalidadeDinamica.graduadosMocambicana?.homens || 0) + (data.nacionalidadeDinamica.graduadosMocambicana?.mulheres || 0)}</td>
                    <td className="p-2">{data.nacionalidadeDinamica.graduadosEstrangeira?.homens || 0}</td>
                    <td className="p-2">{data.nacionalidadeDinamica.graduadosEstrangeira?.mulheres || 0}</td>
                    <td className="p-2 font-black bg-slate-50">{(data.nacionalidadeDinamica.graduadosEstrangeira?.homens || 0) + (data.nacionalidadeDinamica.graduadosEstrangeira?.mulheres || 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="page-break-before" />

      {/* ==================== EIXO III: CORPO DOCENTE (Professores) ==================== */}
      <div className="space-y-10" id="relatorio-eixo-3">
        <div className="border-[#009E60] border-l-8 pl-4 py-1.5 bg-[#009E60]/5">
          <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tight">EIXO III: CORPO DOCENTE (Professores)</h3>
          <p className="text-sm text-slate-500 font-medium ">Métricas de titulação académica, regimes contratuais e representabilidade etária/nacional.</p>
        </div>

        {/* PROCURA DOCENTES IN THE IES TABLE */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
            <Grid className="h-4 w-4 text-[#009E60]" /> Quadro A1. Número de Docentes de Tempo Inteiro por Província, Grau e Sexo
          </h4>
          <div className="overflow-x-auto border-2 border-black rounded-xl">
            <table className="w-full text-xs border-collapse bg-white text-center">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-black text-slate-800 font-bold">
                  <th rowSpan={2} className="border-r border-slate-300 p-2 text-left">Província / Distrito</th>
                  <th colSpan={3} className="border-r border-slate-300 p-1">Licenciados</th>
                  <th colSpan={3} className="border-r border-slate-300 p-1">Mestres</th>
                  <th colSpan={3} className="border-r border-slate-300 p-1">Pós-Graduados</th>
                  <th colSpan={3} className="p-1">Doutores (PhD)</th>
                </tr>
                <tr className="bg-slate-50 border-b-2 border-black font-semibold text-xs">
                  {/* Licensed, Masters, PG, PhD */}
                  {[...Array(4)].map((_, idx) => (
                    <React.Fragment key={idx}>
                      <th className="border-r border-slate-200 text-center">H</th>
                      <th className="border-r border-slate-200 text-center">M</th>
                      <th className={`font-bold bg-slate-100 ${idx < 3 ? 'border-r border-slate-300' : ''}`}>T</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data.docentesTempoInteiro || []).length > 0 ? (
                  (data.docentesTempoInteiro || []).map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200 font-mono hover:bg-slate-50">
                      <td className="border-r border-slate-350 p-2 text-left  font-black">{row.provincia} - {row.distrito}</td>
                      <td className="border-r border-slate-150">{row.licenciado?.homens || 0}</td>
                      <td className="border-r border-slate-150">{row.licenciado?.mulheres || 0}</td>
                      <td className="border-r border-slate-300 font-bold bg-slate-50">{(row.licenciado?.homens || 0) + (row.licenciado?.mulheres || 0)}</td>
                      <td className="border-r border-slate-150">{row.mestre?.homens || 0}</td>
                      <td className="border-r border-slate-150">{row.mestre?.mulheres || 0}</td>
                      <td className="border-r border-slate-300 font-bold bg-slate-50">{(row.mestre?.homens || 0) + (row.mestre?.mulheres || 0)}</td>
                      <td className="border-r border-slate-150">{row.posGraduacao?.homens || 0}</td>
                      <td className="border-r border-slate-150">{row.posGraduacao?.mulheres || 0}</td>
                      <td className="border-r border-slate-300 font-bold bg-slate-50">{(row.posGraduacao?.homens || 0) + (row.posGraduacao?.mulheres || 0)}</td>
                      <td className="border-r border-slate-150">{row.doutorado?.homens || 0}</td>
                      <td className="border-r border-slate-150">{row.doutorado?.mulheres || 0}</td>
                      <td className="font-bold bg-slate-50">{(row.doutorado?.homens || 0) + (row.doutorado?.mulheres || 0)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={13} className="p-4 text-center text-slate-400 italic">Sem registos de qualificação de professores inserida no momento.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DOCENTES FAiXA ETÁRIA */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
            <Grid className="h-4 w-4 text-[#009E60]" /> Quadro A2. Docentes por Classe de Idade, Nacionalidade e Regime
          </h4>
          <div className="overflow-x-auto border-2 border-black rounded-xl">
            <table className="w-full text-xs border-collapse bg-white text-center">
              <thead>
                <tr className="bg-slate-200 border-b-2 border-black text-slate-800 font-bold">
                  <th rowSpan={2} className="border-r-2 border-black p-2 text-left">Classe de Idade</th>
                  <th colSpan={3} className="border-r-2 border-black p-1">Nacionalidade Moçambicana</th>
                  <th colSpan={3} className="border-r-2 border-black p-1">Nacionalidade Estrangeira</th>
                  <th rowSpan={2} className="border-r p-2 font-black text-slate-900 bg-slate-100">Total TI</th>
                  <th rowSpan={2} className="border-r p-2 font-black text-slate-900 bg-slate-100">Total TP</th>
                  <th rowSpan={2} className="p-2 font-black text-indigo-900 bg-indigo-50">Total Geral</th>
                </tr>
                <tr className="bg-slate-100 border-b-2 border-black font-semibold text-sm">
                  <th className="border-r p-1">TI (Tempo Int.)</th>
                  <th className="border-r p-1">TP (Tempo Par.)</th>
                  <th className="border-r-2 border-black font-bold bg-slate-50 py-1">Subtotal</th>
                  <th className="border-r p-1">TI (Tempo Int.)</th>
                  <th className="border-r p-1">TP (Tempo Par.)</th>
                  <th className="border-r-2 border-black font-bold bg-slate-50 py-1">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(data.docentesGrupoEtario || []).length > 0 ? (
                  (data.docentesGrupoEtario || []).map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200 font-mono hover:bg-slate-50">
                      <td className="border-r-2 border-black p-2 text-left  font-black bg-slate-50">{row.classeIdade}</td>
                      <td className="border-r p-1">{row.mocambicana?.ti || 0}</td>
                      <td className="border-r p-1">{row.mocambicana?.tp || 0}</td>
                      <td className="border-r-2 border-black font-black bg-slate-50">{(row.mocambicana?.ti || 0) + (row.mocambicana?.tp || 0)}</td>
                      <td className="border-r p-1">{row.estrangeira?.ti || 0}</td>
                      <td className="border-r p-1">{row.estrangeira?.tp || 0}</td>
                      <td className="border-r-2 border-black font-black bg-slate-50">{(row.estrangeira?.ti || 0) + (row.estrangeira?.tp || 0)}</td>
                      <td className="border-r font-black text-slate-700 bg-slate-50">{row.totalTI || 0}</td>
                      <td className="border-r font-black text-slate-700 bg-slate-50">{row.totalTP || 0}</td>
                      <td className="font-black text-indigo-950 bg-indigo-50/50">{row.totalGeral || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="p-4 text-center text-slate-400 italic">Nenhum registo de idades ou regimes inserido para professores.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="page-break-before" />

      {/* ==================== EIXO IV: INVESTIGADORES E PESQUISA ==================== */}
      <div className="space-y-10" id="relatorio-eixo-4">
        <div className="border-[#009E60] border-l-8 pl-4 py-1.5 bg-[#009E60]/5">
          <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tight">EIXO IV: INVESTIGADORES E PESQUISA</h3>
          <p className="text-sm text-slate-500 font-medium ">Métricas de publicações científicas, patentes, monografias, dissertações orientadas e projetos ativos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* PESQUIAS E EXTENSÃO DETAILS CARDS */}
          <div className="bg-slate-50 border-2 border-slate-900 p-5 rounded-2xl space-y-4">
            <h4 className="font-bold  text-slate-900 text-xs uppercase border-b border-black/10 pb-2 flex items-center gap-1.5">
              <Search className="h-4 w-4 text-[#009E60]" /> Atividades Globais de Investigação Científica do Ano
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-xl border border-slate-205">
                <span className="text-xs uppercase font-bold text-slate-500 block">Investigações em Curso</span>
                <span className="text-lg font-black text-slate-800">{(data.pesquisasA91 || []).reduce((acc, r) => acc + (r.emCurso || 0), 0)}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-205">
                <span className="text-xs uppercase font-bold text-slate-500 block">Pesquisas Concluídas</span>
                <span className="text-lg font-black text-slate-800">{(data.pesquisasA91 || []).reduce((acc, r) => acc + (r.concluidas || 0), 0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/30 border-2 border-slate-900 p-5 rounded-2xl space-y-4">
            <h4 className="font-bold  text-slate-900 text-xs uppercase border-b border-black/10 pb-2 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-[#009E60]" /> Extensão e Intercâmbio Comunitário
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-xs uppercase text-slate-500 font-bold block">Consultorias</span>
                <span className="text-sm font-black text-slate-800">{data.actividadesExtensaoA92?.consultorias || 0}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-xs uppercase text-slate-500 font-bold block">Inovações</span>
                <span className="text-sm font-black text-slate-800">{data.actividadesExtensaoA92?.inovacoes || 0}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-xs uppercase text-slate-500 font-bold block">Divulgações</span>
                <span className="text-sm font-black text-slate-800">{data.actividadesExtensaoA92?.divulgacao || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quadro A8.1 Investigadores Tempo Inteiro */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
            <Grid className="h-4 w-4 text-[#009E60]" /> Quadro A8.1. Investigadores a Tempo Inteiro por Nacionalidade e Nível
          </h4>
          <div className="overflow-x-auto border-2 border-black rounded-xl">
            <table className="w-full text-xs border-collapse bg-white text-center">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-black text-slate-800 font-bold">
                  <th rowSpan={2} className="border-r border-slate-300 p-2 text-left">Nacionalidade</th>
                  <th colSpan={3} className="border-r border-slate-300 p-1">Licenciatura</th>
                  <th colSpan={3} className="border-r border-slate-300 p-1">Mestrado</th>
                  <th colSpan={3} className="border-r border-slate-300 p-1">Doutoramento</th>
                  <th colSpan={3} className="p-1">Total Investigadores</th>
                </tr>
                <tr className="bg-slate-50 border-b-2 border-black font-semibold text-xs">
                  {[...Array(4)].map((_, idx) => (
                    <React.Fragment key={idx}>
                      <th className="border-r border-slate-200 py-1">H</th>
                      <th className="border-r border-slate-200 py-1">M</th>
                      <th className={`font-bold bg-slate-100 py-1 ${idx < 3 ? 'border-r border-slate-350' : ''}`}>T</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data.docentesInvestigadoresNacionalidade || []).length > 0 ? (
                  (data.docentesInvestigadoresNacionalidade || []).map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200 font-mono text-xs hover:bg-slate-50">
                      <td className="border-r border-slate-350 p-2 text-left  font-black bg-slate-50">{row.nacionalidade}</td>
                      <td className="border-r border-slate-150">{row.licenciatura?.homens || 0}</td>
                      <td className="border-r border-slate-150">{row.licenciatura?.mulheres || 0}</td>
                      <td className="border-r-2 border-slate-300 font-bold bg-slate-105">{(row.licenciatura?.homens || 0) + (row.licenciatura?.mulheres || 0)}</td>
                      <td className="border-r border-slate-150">{row.mestrado?.homens || 0}</td>
                      <td className="border-r border-slate-150">{row.mestrado?.mulheres || 0}</td>
                      <td className="border-r-2 border-slate-300 font-bold bg-slate-105">{(row.mestrado?.homens || 0) + (row.mestrado?.mulheres || 0)}</td>
                      <td className="border-r border-slate-150">{row.doutoramento?.homens || 0}</td>
                      <td className="border-r border-slate-150">{row.doutoramento?.mulheres || 0}</td>
                      <td className="border-r-2 border-slate-300 font-bold bg-slate-105">{(row.doutoramento?.homens || 0) + (row.doutoramento?.mulheres || 0)}</td>
                      <td className="border-r border-slate-150">{row.todos?.homens || 0}</td>
                      <td className="border-r border-slate-150">{row.todos?.mulheres || 0}</td>
                      <td className="font-bold bg-slate-105">{(row.todos?.homens || 0) + (row.todos?.mulheres || 0)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={13} className="p-4 text-center text-slate-400 italic">Nenhum investigador registado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="page-break-before" />

      {/* ==================== EIXO V: CORPO TÉCNICO E ADMINISTRATIVO (CTA) ==================== */}
      <div className="space-y-10" id="relatorio-eixo-5">
        <div className="border-[#009E60] border-l-8 pl-4 py-1.5 bg-[#009E60]/5">
          <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tight">EIXO V: CORPO TÉCNICO E ADMINISTRATIVO (CTA)</h3>
          <p className="text-sm text-slate-500 font-medium ">Dimensionamento, representabilidade nacional e nível de escolaridade habilitante.</p>
        </div>

        {/* QUADRO B2 */}
        <div className="space-y-3" id="pub-quadro-b2">
          <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-[#009E60]" /> Quadro B2. Número de CTA a tempo parcial por nível de formação, nacionalidade e Sexo
          </h4>
          <div className="overflow-x-auto border-2 border-black rounded-xl">
            <table className="w-full text-xs border-collapse bg-white text-center">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-black text-slate-800 font-bold">
                  <th rowSpan={2} className="border-r-2 border-black p-2 text-left">Nacionalidade</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2">Todos</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2">Ensino Primário</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2">Ensino Secundário (1º C)</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2">Ensino Secundário (2º C)</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2">Bacharel</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2 font-black">Licenciado</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2">Mestre</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2">Pós-Graduados</th>
                  <th colSpan={3} className="p-2">Doutorado</th>
                </tr>
                <tr className="bg-slate-50 border-b-2 border-black font-semibold text-xs">
                  {[...Array(9)].map((_, i) => (
                    <React.Fragment key={i}>
                      <th className="border-r border-slate-200 py-1 px-0.5">H</th>
                      <th className="border-r border-slate-200 py-1 px-0.5">M</th>
                      <th className={`py-1 px-0.5 font-bold bg-slate-100 ${i < 8 ? 'border-r-2 border-slate-350' : ''}`}>T</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data.ctaB2 || []).map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-250 font-mono hover:bg-slate-50 text-xs">
                    <td className="border-r-2 border-black p-2 text-left  font-bold text-xs bg-slate-50">{row.nacionalidade}</td>
                    {['todos', 'ensinoPrimario', 'ensinoSecundario1', 'ensinoSecundario2', 'bacharel', 'licenciado', 'mestre', 'posGraduados', 'doutorado'].map((lvl, k) => {
                      const lData = row[lvl] || { homens: 0, mulheres: 0, total: 0 };
                      return (
                        <React.Fragment key={lvl}>
                          <td className="border-r border-slate-205 px-1 py-1">{lData.homens || 0}</td>
                          <td className="border-r border-slate-205 px-1 py-1">{lData.mulheres || 0}</td>
                          <td className={`px-1 py-1 font-black bg-slate-50 text-slate-900 ${k < 8 ? 'border-r-2 border-slate-350' : ''}`}>{lData.total || 0}</td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="page-break-before" />

        {/* QUADRO B3 */}
        <div className="space-y-3" id="pub-quadro-b3">
          <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-[#009E60]" /> Quadro B3. Número de CTA por tipo de relação contratual, nível de formação e sexo
          </h4>
          <div className="overflow-x-auto border-2 border-black rounded-xl">
            <table className="w-full text-xs border-collapse bg-white text-center">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-black text-slate-800 font-bold">
                  <th rowSpan={2} className="border-r-2 border-black p-2 text-left">Relação Contratual</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2">Todos</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2">Ensino Primário</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2">Ensino Secundário (1º C)</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2">Ensino Secundário (2º C)</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2">Bacharel</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2 font-black">Licenciado</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2">Mestre</th>
                  <th colSpan={3} className="border-r border-slate-300 p-2">Pós-Graduados</th>
                  <th colSpan={3} className="p-2">Doutorado</th>
                </tr>
                <tr className="bg-slate-50 border-b-2 border-black font-semibold text-xs">
                  {[...Array(9)].map((_, i) => (
                    <React.Fragment key={i}>
                      <th className="border-r border-slate-200 py-1 px-0.5">H</th>
                      <th className="border-r border-slate-200 py-1 px-0.5">M</th>
                      <th className={`py-1 px-0.5 font-bold bg-slate-100 ${i < 8 ? 'border-r-2 border-slate-350' : ''}`}>T</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data.ctaB3 || []).map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-250 font-mono hover:bg-slate-50 text-xs">
                    <td className="border-r-2 border-black p-2 text-left  font-bold text-xs bg-slate-50">{row.tipoRelacao}</td>
                    {['todos', 'ensinoPrimario', 'ensinoSecundario1', 'ensinoSecundario2', 'bacharel', 'licenciado', 'mestre', 'posGraduados', 'doutorado'].map((lvl, k) => {
                      const lData = row[lvl] || { homens: 0, mulheres: 0, total: 0 };
                      return (
                        <React.Fragment key={lvl}>
                          <td className="border-r border-slate-205 px-1 py-1">{lData.homens || 0}</td>
                          <td className="border-r border-slate-205 px-1 py-1">{lData.mulheres || 0}</td>
                          <td className={`px-1 py-1 font-black bg-slate-50 text-slate-900 ${k < 8 ? 'border-r-2 border-slate-350' : ''}`}>{lData.total || 0}</td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="page-break-before" />

        {/* QUADRO B4 */}
        <div className="space-y-3" id="pub-quadro-b4">
          <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-[#009E60]" /> Quadro B4. Número de CTA por grupo etário, nacionalidade e regime de contratação
          </h4>
          <div className="overflow-x-auto border-2 border-black rounded-xl">
            <table className="w-full text-xs border-collapse bg-white text-center">
              <thead>
                <tr className="bg-slate-200 border-b-2 border-black text-slate-800 font-bold">
                  <th rowSpan={2} className="border-r-2 border-black p-3 text-left w-1/4">Classe de Idade</th>
                  <th colSpan={3} className="border-r-2 border-black p-2">Moçambicana</th>
                  <th colSpan={3} className="border-r-2 border-black p-2">Estrangeira</th>
                  <th rowSpan={2} className="border-r border-slate-300 p-2 font-black text-slate-900 bg-slate-100">Total TI</th>
                  <th rowSpan={2} className="border-r border-slate-300 p-2 font-black text-slate-900 bg-slate-100">Total TP</th>
                  <th rowSpan={2} className="p-2 font-black text-indigo-900 bg-indigo-50">Total Geral</th>
                </tr>
                <tr className="bg-slate-100 border-b-2 border-black font-semibold text-sm">
                  <th className="border-r border-slate-300 p-2">TI</th>
                  <th className="border-r border-slate-300 p-2">TP</th>
                  <th className="border-r-2 border-black p-2 text-slate-900 font-bold bg-slate-50">SubTotal</th>
                  <th className="border-r border-slate-300 p-2">TI</th>
                  <th className="border-r border-slate-300 p-2">TP</th>
                  <th className="border-r-2 border-black p-2 text-slate-900 font-bold bg-slate-50">SubTotal</th>
                </tr>
              </thead>
              <tbody>
                {(data.ctaB4 || []).map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-200 font-mono hover:bg-slate-50">
                    <td className="border-r-2 border-black p-3 text-left  font-bold text-xs bg-slate-50">{row.classeIdade}</td>
                    <td className="border-r border-slate-200 p-2">{row.mocambicana?.ti || 0}</td>
                    <td className="border-r border-slate-200 p-2">{row.mocambicana?.tp || 0}</td>
                    <td className="border-r-2 border-black p-2 font-black bg-slate-50">{row.mocambicana?.total || 0}</td>
                    <td className="border-r border-slate-200 p-2">{row.estrangeira?.ti || 0}</td>
                    <td className="border-r border-slate-200 p-2">{row.estrangeira?.tp || 0}</td>
                    <td className="border-r-2 border-black p-2 font-black bg-slate-50">{row.estrangeira?.total || 0}</td>
                    <td className="border-r border-slate-200 p-2 font-black text-slate-700 bg-slate-50">{row.totalTI || 0}</td>
                    <td className="border-r border-slate-200 p-2 font-black text-slate-700 bg-slate-50">{row.totalTP || 0}</td>
                    <td className="p-2 font-black text-indigo-950 bg-indigo-50/50">{row.totalGeral || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="page-break-before" />

      {/* ==================== EIXO VI: RECURSOS FINANCEIROS AND ORÇAMENTAIS ==================== */}
      <div className="space-y-10" id="relatorio-eixo-6">
        <div className="border-[#009E60] border-l-8 pl-4 py-1.5 bg-[#009E60]/5">
          <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tight">EIXO VI: RECURSOS FINANCEIROS E ORÇAMENTAIS</h3>
          <p className="text-sm text-slate-500 font-medium">Fluxos de arrecadação monetária, dotação orçamental do Estado e balanço de despesas correntes.</p>
        </div>

        {/* FINANCIAL SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-300 p-4 rounded-xl">
            <span className="text-xs font-bold uppercase text-slate-500 block">Total Financiamento Arrecadado</span>
            <span className="text-lg font-black text-slate-900">{formatMT(totalFinanciamento)} MT (10^3)</span>
          </div>
          <div className="bg-slate-50 border border-slate-300 p-4 rounded-xl">
            <span className="text-xs font-bold uppercase text-slate-500 block">Gastos Globais Declarados</span>
            <span className="text-lg font-black text-rose-950">{formatMT(totalDespesas)} MT (10^3)</span>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl">
            <span className="text-xs font-bold uppercase text-indigo-650 block">Execução Detalhada</span>
            <span className="text-lg font-black text-indigo-950">{formatMT(totalDespesaDetalhada)} MT (10^3)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* TABLE COMPONENT 1: DESPESAS GLOBAIS */}
          <div className="space-y-3" id="pub-quadro-fin1">
            <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-emerald-700" /> Quadro 6.1. Despesas Globais Corporativas
            </h4>
            <div className="border-2 border-black rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-xs border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-black text-slate-800 font-bold">
                    <th className="p-3 text-left">Rubrica Financeira</th>
                    <th className="p-3 text-center">Valor em MT(10^3)</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.despesasIES || []).map((row, idx) => (
                    <tr key={idx} className={`border-b border-slate-200 font-mono ${row.rubrica === 'Total' ? 'bg-slate-100 font-bold text-slate-900 border-t-2 border-black' : 'hover:bg-slate-50/55'}`}>
                      <td className="p-3  font-bold text-slate-700">{row.rubrica}</td>
                      <td className="p-3 text-center font-bold">{row.rubrica === 'Total' ? formatMT(totalDespesas) : formatMT(row.valor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLE COMPONENT 2: FINANCIAMENTO ARRECADADO */}
          <div className="space-y-3" id="pub-quadro-fin2">
            <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-emerald-700" /> Quadro 6.2. Fontes de Financiamento Arrecadado
            </h4>
            <div className="border-2 border-black rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-xs border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-black text-slate-800 font-bold">
                    <th className="p-3 text-left">Fonte de Financiamento</th>
                    <th className="p-3 text-center">Valor em MT(10^3)</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.financiamentoIES || []).map((row, idx) => (
                    <tr key={idx} className={`border-b border-slate-200 font-mono ${row.fonte === 'Total' ? 'bg-slate-100 font-bold text-slate-900 border-t-2 border-black' : 'hover:bg-slate-50/55'}`}>
                      <td className="p-3  font-bold text-slate-700">{row.fonte}</td>
                      <td className="p-3 text-center font-bold">{row.fonte === 'Total' ? formatMT(totalFinanciamento) : formatMT(row.valor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="page-break-before" />

        {/* TABLE COMPONENT 3: DESPESA DETALHADA */}
        <div className="space-y-3" id="pub-quadro-fin3">
          <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
            <Coins className="h-4 w-4 text-emerald-700" /> Quadro 6.3. Execução Orçamental de Despesas Detalhadas
          </h4>
          <div className="border-2 border-black rounded-xl overflow-hidden">
            <table className="w-full text-xs border-collapse bg-white">
              <thead>
                <tr className="bg-slate-150 border-b-2 border-black text-slate-850 font-black">
                  <th className="p-3 text-left w-2/3">Categoria de Custo / Serviço</th>
                  <th className="p-3 text-center w-1/3">Valor de Execução Líquido em MT(10^3)</th>
                </tr>
              </thead>
              <tbody>
                {(data.despesaFuncionamentoInvestimentoIES || []).map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-200 font-mono hover:bg-slate-50">
                    <td className="p-3  text-slate-700 bg-slate-50/40">{row.categoria}</td>
                    <td className="p-3 text-center font-bold text-slate-900">{formatMT(row.valor)}</td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-bold text-slate-950 border-t-2 border-black">
                  <td className="p-3 text-left font-black">SOMA TOTAL DAS DOTAÇÕES EXECUTADAS</td>
                  <td className="p-3 text-center font-black">{formatMT(totalDespesaDetalhada)} MT(10^3)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="page-break-before" />

      {/* ==================== EIXO VII: INFRAESTRUTURAS, PATRIMÓNIO E TIC ==================== */}
      <div className="space-y-10" id="relatorio-eixo-7">
        <div className="border-[#009E60] border-l-8 pl-4 py-1.5 bg-[#009E60]/5">
          <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tight">EIXO VII: INFRAESTRUTURAS, PATRIMÓNIO E TIC</h3>
          <p className="text-sm text-slate-500 font-medium ">Métricas de capacidade instalada de salas de aula, laboratórios científicos, bibliotecas e conectividade TIC.</p>
        </div>

        {/* INFRASTRUCTURE SUMMARY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-50 border border-slate-300 p-3 rounded-lg">
            <span className="text-xs text-slate-500 font-bold uppercase block">Salas Registadas</span>
            <span className="text-lg font-black text-slate-950">{(data.salasAulaIES || []).reduce((sum, r) => sum + (r.numSalas || 0), 0)}</span>
          </div>
          <div className="bg-slate-50 border border-slate-300 p-3 rounded-lg">
            <span className="text-xs text-slate-500 font-bold uppercase block">Laboratórios Activos</span>
            <span className="text-lg font-black text-slate-950">{(data.laboratoriosIES || []).reduce((sum, r) => sum + (r.numLaboratorios || 0), 0)}</span>
          </div>
          <div className="bg-slate-50 border border-slate-300 p-3 rounded-lg">
            <span className="text-xs text-slate-500 font-bold uppercase block">Bibliotecas Físicas</span>
            <span className="text-lg font-black text-slate-950">{(data.bibliotecasIES || []).reduce((sum, r) => sum + (r.numFisicas || 0), 0)}</span>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg">
            <span className="text-xs text-indigo-700 font-bold uppercase block">Total Computadores</span>
            <span className="text-lg font-black text-indigo-950">{(data.computadoresIES || []).reduce((sum, r) => sum + (r.numComputadores || 0), 0)}</span>
          </div>
        </div>

        {/* LABS AND CLASSROOMS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LABS TABLE */}
          <div className="space-y-3" id="pub-quadro-infra1">
            <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
              <School className="h-4 w-4 text-emerald-700" /> Quadro 7.1. Laboratórios das IES por Especialidade e Distrito
            </h4>
            <div className="border-2 border-black rounded-xl overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-xs border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-black font-bold text-slate-800">
                    <th className="p-2 text-left">Especialidade</th>
                    <th className="p-2 text-left">Área</th>
                    <th className="p-2 text-left">Província / Distrito</th>
                    <th className="p-2 text-center">Nº Labs</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.laboratoriosIES || []).length > 0 ? (
                    (data.laboratoriosIES || []).map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-200 font-mono hover:bg-slate-50">
                        <td className="p-2 text-slate-900  font-black">{row.especialidade}</td>
                        <td className="p-2 text-slate-655  text-xs">{row.area} ({row.subarea})</td>
                        <td className="p-2 text-slate-500  text-xs">{row.provincia} - {row.distrito}</td>
                        <td className="p-2 text-center font-black text-slate-900 bg-slate-50">{row.numLaboratorios || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-400 italic">Nenhum registo de laboratório catalogado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* CLASSROOMS TABLE */}
          <div className="space-y-3" id="pub-quadro-infra2">
            <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
              <School className="h-4 w-4 text-emerald-700" /> Quadro 7.2. Salas de Aula por Faculdade e Grau
            </h4>
            <div className="border-2 border-black rounded-xl overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-xs border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-black font-bold text-slate-800">
                    <th className="p-2 text-left">Unidade Orgânica</th>
                    <th className="p-2 text-left">Distrito</th>
                    <th className="p-2 text-left">Grau Atendido</th>
                    <th className="p-2 text-center">Nº Salas</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.salasAulaIES || []).length > 0 ? (
                    (data.salasAulaIES || []).map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-200 font-mono hover:bg-slate-50">
                        <td className="p-2 text-slate-900  font-black">{row.unidadeOrganica}</td>
                        <td className="p-2 text-slate-500  text-xs">{row.provincia} - {row.distrito}</td>
                        <td className="p-2 text-slate-655 ">{row.grau}</td>
                        <td className="p-2 text-center font-black text-slate-900 bg-slate-50">{row.numSalas || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-400 italic">Nenhum registo de salas de aula cadastrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="page-break-before" />

        {/* LIBRARIES AND COMPUTERS GRID */}
        {/* Standard Row Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LIBRARIES TABLE */}
          <div className="space-y-3" id="pub-quadro-infra3">
            <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro 7.3. Bibliotecas Activas por Faculdade/Unidade
            </h4>
            <div className="border-2 border-black rounded-xl overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-xs border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-black font-bold text-slate-800">
                    <th className="p-2 text-left">Unidade Orgânica</th>
                    <th className="p-2 text-left  text-xs">Localização</th>
                    <th className="p-2 text-center">Físicas</th>
                    <th className="p-2 text-center">Digitais</th>
                    <th className="p-2 text-center bg-emerald-50 text-emerald-900 font-black">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.bibliotecasIES || []).length > 0 ? (
                    (data.bibliotecasIES || []).map((row, idx) => {
                      const totalBibs = (row.numFisicas || 0) + (row.numVirtuais || 0);
                      return (
                        <tr key={idx} className="border-b border-slate-200 font-mono hover:bg-slate-50">
                          <td className="p-2 text-slate-900  font-black">{row.unidadeOrganica}</td>
                          <td className="p-2 text-slate-500  text-xs">{row.provincia} - {row.distrito}</td>
                          <td className="p-2 text-center">{row.numFisicas || 0}</td>
                          <td className="p-2 text-center">{row.numVirtuais || 0}</td>
                          <td className="p-2 text-center font-black text-slate-900 bg-slate-100">{totalBibs}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-400 italic">Nenhum registo de biblioteca inserido.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* COMPUTER EQUIPMENTS TABLE */}
          <div className="space-y-3" id="pub-quadro-infra4">
            <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
              <School className="h-4 w-4 text-emerald-700" /> Quadro 7.4. Equipamento Informático e Acesso Internet
            </h4>
            <div className="border-2 border-black rounded-xl overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-xs border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-black font-bold text-slate-800">
                    <th className="p-2 text-left">Unidade Orgânica</th>
                    <th className="p-2 text-center">Total PCs</th>
                    <th className="p-2 text-center text-emerald-800">Operacionais</th>
                    <th className="p-2 text-center text-rose-800">Avariados</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.computadoresIES || []).length > 0 ? (
                    (data.computadoresIES || []).map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-200 font-mono hover:bg-slate-50">
                        <td className="p-2 text-slate-900  font-black">
                          {row.unidadeOrganica}
                          <div className="text-xs text-[#009E60]  font-normal">{row.provincia} - {row.distrito}</div>
                        </td>
                        <td className="p-2 text-center font-black bg-slate-50">{row.numComputadores || 0}</td>
                        <td className="p-2 text-center font-bold text-emerald-800">{row.numFuncionamento || 0}</td>
                        <td className="p-2 text-center text-rose-700">{row.numNaoFuncionamento || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-400 italic">Nenhum registo de computadores declarado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="page-break-before" />

      {/* ==================== EIXO VIII: MATRÍCULAS E PREVISÃO DE ESTUDANTES ==================== */}
      <div className="space-y-10" id="relatorio-eixo-8">
        <div className="border-[#009E60] border-l-8 pl-4 py-1.5 bg-[#009E60]/5">
          <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tight">EIXO VIII: PREVISÕES DE ESTUDANTES PARA O ANO {year + 1}</h3>
          <p className="text-sm text-slate-500 font-medium ">Planos de capacidade, quotas projetadas de recrutamento para o próximo exercício estatístico.</p>
        </div>

        {/* PREVISÃO DE ESTUDANTES TABLE */}
        <div className="space-y-3" id="pub-quadro-previsao">
          <h4 className="font-bold text-slate-900 border-b border-black/10 pb-1 text-xs uppercase flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-emerald-700" /> Quadro 8.1. Plano de Prospecção Académica para o Ano {year} (Vagas e Projecções)
          </h4>
          <div className="border-2 border-black rounded-xl overflow-hidden max-h-96 overflow-y-auto shadow-xs">
            <table className="w-full text-xs border-collapse bg-white">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-black font-bold text-slate-800 text-center">
                  <th className="p-3 text-left w-1/4">Nome do Curso de Ensino Superior</th>
                  <th className="p-2">Regime</th>
                  <th className="p-2">{abbrev}</th>
                  <th className="p-2">Província</th>
                  <th className="p-2">Grau</th>
                  <th className="p-2 text-center w-12 text-blue-900">MASC</th>
                  <th className="p-2 text-center w-12 text-rose-900">FEM</th>
                  <th className="p-2 text-center w-16 bg-emerald-50 text-emerald-950 font-black">Total Projeção</th>
                </tr>
              </thead>
              <tbody>
                {(data.previsaoEstudantesMatriculados || []).length > 0 ? (
                  (data.previsaoEstudantesMatriculados || []).map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200 font-mono hover:bg-slate-50 text-center">
                      <td className="p-3 text-left  font-black text-slate-950 text-xs">{row.nomeCurso}</td>
                      <td className="p-2 text-slate-655 text-xs ">{row.regimeCurso || 'Laboral'}</td>
                      <td className="p-2 text-slate-500 text-xs">{row.iscedArea} / {row.iscedSubArea}</td>
                      <td className="p-2 text-slate-500 text-xs ">{row.provincia}</td>
                      <td className="p-2 text-slate-655 text-xs ">{row.grau}</td>
                      <td className="p-2 text-center">{row.homens || 0}</td>
                      <td className="p-2 text-center">{row.mulheres || 0}</td>
                      <td className="p-2 text-center font-black bg-emerald-50/40 text-slate-900 text-xs">{row.total || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 italic">Sem estimativas de estudantes matriculados para canais curriculares no momento.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FINAL REGULATION FOOTNOTE */}
      <div className="border-t border-slate-900 pt-6 mt-16 text-slate-800 text-xs text-center font-bold no-print" id="sige-security-footnote">
         <p>Este documento tem carácter oficial e foi gerado digitalmente pelo SIGDE- ONLINE - Moçambique.</p>
         <p className="mt-1">Responsável: Administrador do Sistema | Nível: SISTEM</p>
      </div>

      <div className="mt-12">
        <ReportSignature institution={mockAuthority} currentUser={currentUser} />
      </div>
    </div>
  );
}
