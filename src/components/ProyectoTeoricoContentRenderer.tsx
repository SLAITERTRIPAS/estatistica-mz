import React from 'react';
import { 
  Award, 
  FileText, 
  Landmark, 
  Globe, 
  Users, 
  Scale, 
  Compass, 
  Briefcase, 
  Layers, 
  PieChart, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  CheckCircle 
} from 'lucide-react';
import { MOZAMBIQUE_EMBLEM } from '../constants/assets';
import { 
  budgetData, 
  totalBudgetUSD, 
  totalBudgetMZN, 
  riskData, 
  kpiData, 
  timelineData 
} from '../data/proyectoTeoricoData';
import { proyectoTeoricoHumanoData } from '../data/proyectoTeoricoHumanoData';

interface ProyectoTeoricoContentRendererProps {
  activeSection: string;
  setActiveSection: (section: any) => void;
  t: (key: any) => string;
  isHumanVersion?: boolean;
}

const WatermarkPrintBg: React.FC = () => null;

export const ProyectoTeoricoContentRenderer: React.FC<ProyectoTeoricoContentRendererProps> = ({ 
  activeSection, 
  setActiveSection,
  t,
  isHumanVersion = false
}) => {
  const [coverTab, setCoverTab] = React.useState<'capa' | 'contracapa'>('capa');

  return (
    <>
      {/* =========================================================================
          VISTA INTERATIVA (CONTEÚDOS INDIVIDUAIS)
          ========================================================================= */}

      {/* 1. CAPA E CONTRA CAPA */}
      {activeSection === 'capa' && (
        <div className="space-y-6 animate-fade-in  text-slate-700">
          {/* Interactive Switcher */}
          <div className="flex border-b border-slate-200 pb-px no-print">
            <button
              onClick={() => setCoverTab('capa')}
              className={`px-4 py-2 border-b-2 text-xs  font-bold flex items-center gap-2 transition-all cursor-pointer ${
                coverTab === 'capa'
                  ? 'border-emerald-600 text-emerald-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>📔</span> Capa Oficial
            </button>
            <button
              onClick={() => setCoverTab('contracapa')}
              className={`px-4 py-2 border-b-2 text-xs  font-bold flex items-center gap-2 transition-all cursor-pointer ${
                coverTab === 'contracapa'
                  ? 'border-emerald-600 text-emerald-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>✍️</span> Contra-Capa (Ficha Técnica)
            </button>
          </div>

          {coverTab === 'capa' ? (
            <div className="border-4 border-double border-slate-950 p-6 sm:p-12 rounded-2xl bg-white space-y-8 text-center max-w-2xl mx-auto shadow-md relative overflow-hidden">

              {/* Official Headings - 100% Centered */}
              <div className="space-y-2 flex flex-col items-center justify-center text-center w-full" style={{ textAlign: 'center' }}>
                <img 
                  src={MOZAMBIQUE_EMBLEM} 
                  alt="Emblema da República de Moçambique" 
                  className="w-[5rem] h-[5rem] object-contain mix-blend-multiply hover:scale-110 transition-transform duration-300 mx-auto" 
                  referrerPolicy="no-referrer"
                />
                <h1 className="text-xs uppercase font-black tracking-widest text-slate-950 text-center w-full" style={{ textAlign: 'center' }}>
                  REPÚBLICA DE MOÇAMBIQUE
                </h1>
                <h2 className="text-xs uppercase font-bold text-slate-850 text-center w-full" style={{ textAlign: 'center' }}>
                  MINISTÉRIO DE EDUCAÇÃO E CULTURA
                </h2>
                <h3 className="text-xs uppercase font-bold text-slate-600 text-center w-full" style={{ textAlign: 'center' }}>
                  DIRECÇÃO NACIONAL DE ENSINO SUPERIOR
                </h3>
              </div>

              <div className="w-16 h-0.5 bg-slate-900 mx-auto"></div>

              {/* Title Section */}
              <div className="py-6 space-y-4">
                <span className="text-xs sm:text-xs uppercase font-black tracking-[0.25em] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {isHumanVersion ? "Narrativa Teórica de Impacto Humano" : "Documento Técnico Estratégico Oficial"}
                </span>
                <h1 className="text-xl sm:text-2xl lg:text-3xl  font-black text-slate-950 leading-tight tracking-tight pt-2">
                  {isHumanVersion 
                    ? proyectoTeoricoHumanoData.capa.title 
                    : "SIGDE-ONLINE: Sistema Integrado de Gestão e Coleta de Dados Estatísticos do Ensino Superior de Moçambique"}
                </h1>
                <p className="text-xs text-slate-600 italic max-w-md mx-auto">
                  {isHumanVersion 
                    ? proyectoTeoricoHumanoData.capa.subtitle 
                    : "“Estruturação teórica de fluxos organizacionais, eixos estatísticos de recolha, regras computacionais de consistência e dotação financeira de consolidação nacional”"}
                </p>
              </div>

              <div className="w-full max-w-sm border-t border-b border-slate-300 py-4 mx-auto space-y-1 font-mono text-xs text-slate-500">
                <p className=" text-slate-800 font-bold text-xs">
                  Documento de Especificação Metodológica Integrada
                </p>
                <p>Alinhado com a Plataforma Digital Homologada</p>
              </div>

              {/* Institution and Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto pt-4  text-xs text-slate-600">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-mono uppercase block font-bold">Dono do Projeto</span>
                  <p className="font-bold text-slate-900">Direção Nacional de Ensino Superior</p>
                  <p className="text-xs">DNES • Ministério de Educação e Cultura</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-mono uppercase block font-bold">Responsável Técnico</span>
                  <p className="font-bold text-slate-950">Franzíssi Tripalonga Vicente</p>
                  <p className="text-xs">E-mail: fttripas@gmail.com</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-mono block font-bold">Contacto</span>
                  <p className="font-bold text-slate-900">+258849547771 / 827520137</p>
                  <p className="text-xs">Tete/Songo, Moçambique</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-mono uppercase block font-bold">Status Regulatório</span>
                  <p className="font-bold text-emerald-800 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Homologado & Confluente
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-4 border-slate-950 p-6 sm:p-10 rounded-2xl bg-white space-y-6 max-w-2xl mx-auto shadow-md">
              <div className="border-b border-slate-200 pb-3 text-center sm:text-left">
                <h2 className="text-lg font-black text-slate-950 uppercase">Contra-Capa / Ficha Técnica</h2>
                <p className="text-xs text-slate-400 font-mono uppercase tracking-wider mt-0.5">Especificações e Validação Técnica do Estudo Metodológico</p>
              </div>

              {/* Executive Summary of the Project */}
              <div className="space-y-2 text-xs leading-relaxed text-justify">
                <p className="font-bold text-slate-900  text-xs uppercase tracking-wider">Apresentação do Estudo</p>
                <p>
                  Este estudo define a arquitetura científica do <strong>SIGDE-ONLINE</strong>, detalhando os 8 eixos de recolha estatística nacional (Cursos, Estudantes, Docentes, CTA, Investigadores, Biblioteca, Infraestruturas e Finanças), as travas computacionais de consistência matemática em tempo de digitação, e a dotação de recursos orçamentários estratégicos.
                </p>
                <p>
                  A implementação teórica aqui exposta converge diretamente com a operação do portal digital, garantindo que os formulários recolhidos estejam em conformidade com as exigências de soberania estatística do Ministério de Educação e Cultura de Moçambique.
                </p>
              </div>

              {/* Ficha Técnica Table */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4  text-sm space-y-2.5">
                <div className="font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                  Ficha Técnica do Documento
                </div>
                
                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-500">DONO DO PROJETO:</span>
                  <span className="col-span-2 font-black text-slate-900">Direção Nacional de Ensino Superior</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-500">RESPONSÁVEL TÉCNICO:</span>
                  <span className="col-span-2 font-black text-slate-900">Franzíssi Tripalonga Vicente</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-500">E-MAIL:</span>
                  <span className="col-span-2 text-slate-700 font-mono font-bold">fttripas@gmail.com</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-500">Contacto:</span>
                  <span className="col-span-2 text-slate-700 font-bold">+258849547771 / 827520137</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-500">Local de publicação:</span>
                  <span className="col-span-2 text-slate-700">Tete/Songo, Moçambique</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-500">VERSÃO DO ESTUDO:</span>
                  <span className="col-span-2 font-mono font-bold text-slate-900">v1.1 (Atualizada com Contatos)</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-0.5">
                  <span className="font-bold text-slate-500">ALINHAMENTO REAL:</span>
                  <span className="col-span-2 text-emerald-800 font-bold">100% Confluente com a Plataforma SIGDE-ONLINE</span>
                </div>
              </div>

              {/* Digital Seal of Authenticity */}
              <div className="border border-emerald-200 rounded-xl bg-emerald-50/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4  text-xs">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="font-bold text-emerald-950 uppercase tracking-wider block">Assinatura Digital & Selo de Segurança</span>
                  <p className="text-slate-600 leading-normal">
                    Este documento estratégico foi validado sob as chaves criptográficas da DNES/MEC para integração com a plataforma.
                  </p>
                  <p className="font-mono text-slate-400 text-xs uppercase">
                    HASH SECURE: 5F8A1B29D3C01E49A90BC4F13E147071F92B2359CA76D
                  </p>
                </div>
                
                <div className="shrink-0 border-2 border-emerald-600 rounded-lg p-2.5 text-center bg-white shadow-xs max-w-[140px]">
                  <span className="text-emerald-700 font-bold block text-xs uppercase tracking-widest">MINISTÉRIO DE EDUCAÇÃO</span>
                  <span className="text-slate-900 font-extrabold block text-xs mt-0.5">F. T. VICENTE</span>
                  <span className="bg-emerald-600 text-white font-bold rounded px-1.5 py-0.5 text-xs block mt-1 uppercase">HOMOLOGADO</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. ÍNDICE GERAL */}
      {activeSection === 'indice' && (
        <div className="space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">2. Índice Geral</h2>
            <p className="text-xs text-slate-400  mt-1">Estrutura de tópicos oficial do projeto de implementação da plataforma SIGDE-ONLINE</p>
          </div>

          <div className="border-2 border-slate-150 p-6 md:p-8 rounded-2xl bg-white space-y-2 shadow-sm ">
            {/* 1. Título */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('capa')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                1. Título (Capa do Documento & Folha de Rosto)
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">págs. 1–2</span>
            </div>

            {/* 2. Índice Geral */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('indice')}
                className="text-left font-bold text-emerald-800 group-hover:text-emerald-950 transition-colors cursor-pointer text-xs"
              >
                2. Índice Geral
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-emerald-700 font-mono font-bold shrink-0">pág. 3</span>
            </div>

            {/* 3. Resumo */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('resumo')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                3. Resumo
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 4</span>
            </div>

            {/* 4. Apresentação */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('apresentacao')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                4. Apresentação
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 5</span>
            </div>

            {/* 5. Contexto e Diagnóstico */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('contexto')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                5. Contexto e Diagnóstico
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 6</span>
            </div>

            {/* 6. Público */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('publico')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                6. Público
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 7</span>
            </div>

            {/* 7. Justificativa */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('justificativa')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                7. Justificativa Estratégica
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 8</span>
            </div>

            {/* 8. Objetivos */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('objetivos')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                8. Objetivos do Sistema
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 9</span>
            </div>

            {/* 9. Plano de trabalho */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('plano_trabalho')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                9. Plano de Trabalho
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 10</span>
            </div>

            {/* 10. Metodologia */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('metodologia')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                10. Metodologia: As Nossas 8 Áreas de Cuidado
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 11</span>
            </div>

            {/* 11. Indicadores */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('indicadores')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                11. Indicadores de Sucesso
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 12</span>
            </div>

            {/* 12. Análise de riscos */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('analise_riscos')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                12. Análise de Riscos
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 13</span>
            </div>

            {/* 13. Sustentabilidade do projeto */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('sustentabilidade')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                13. Sustentabilidade do Projeto
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 14</span>
            </div>

            {/* 14. Cronograma */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('cronograma')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                14. Cronograma
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 15</span>
            </div>

            {/* 15. Orçamento */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('orcamento')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                15. Orçamento
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 16</span>
            </div>

            {/* 16. Anexos */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('anexos')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                16. Anexos
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 17</span>
            </div>

            {/* 17. Check list */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('checklist')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                17. Check list
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 18</span>
            </div>

            {/* 18. IA Quântica Aplicada */}
            <div className="flex items-end justify-between py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors group">
              <button 
                onClick={() => setActiveSection('ia_quantica')}
                className="text-left font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer text-xs"
              >
                18. Inteligência Artificial Quântica Aplicada
              </button>
              <div className="flex-1 border-b border-dotted border-slate-300 mx-2 mb-1.5"></div>
              <span className="text-sm text-slate-500 font-mono shrink-0">pág. 19</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. RESUMO */}
      {activeSection === 'resumo' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed text-justify">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">3. Resumo Executivo</h2>
            <p className="text-xs text-slate-400  mt-1">
              {isHumanVersion 
                ? "Uma perspectiva acolhedora e centrada nas pessoas sobre a descentralização de dados e a valorização do serviço público"
                : "Uma visão detalhada e pormenorizada sobre a governação descentralizada de dados e a modernização do ecossistema do ensino superior moçambicano"}
            </p>
          </div>

          {isHumanVersion ? (
            <>
              {proyectoTeoricoHumanoData.resumo.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}

              {/* 4 Pillars Grid in Resume - Human */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 ">
                {proyectoTeoricoHumanoData.resumo.pillars.map((pillar, idx) => (
                  <div key={idx} className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs space-y-2 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                      <strong className="text-slate-900 text-xs uppercase tracking-wider">{pillar.title}</strong>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{pillar.desc}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-bold text-slate-950  mt-6">A Nossa Caminhada de Confiança e Apoio Mútuo</h3>
              <p>
                O fluxo de dados no SIGDE-ONLINE segue quatro etapas desenhadas para proteger as pessoas e garantir o respeito por cada profissional envolvido:
              </p>

              <div className="space-y-4 my-4  text-sm">
                {proyectoTeoricoHumanoData.resumo.steps.map((step, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-emerald-800 space-y-1">
                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-800"></div>
                    <span className="font-extrabold text-slate-950 block">Etapa {idx + 1}: {step.title}</span>
                    <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4">
                Em suma, esta plataforma prova que a tecnologia de ponta alcança o seu máximo valor quando é concebida com respeito absoluto pela rotina de cada operador, unindo o país numa única rede de colaboração e carinho institucional.
              </p>
            </>
          ) : (
            <>
              <p>
                O **SIGDE-ONLINE** nasceu de uma constatação simples, mas de profundo impacto estratégico: a recolha de dados estatísticos no ensino superior moçambicano não podia continuar refém de papeladas dispersas ou planilhas locais sujeitas a corrupção de ficheiros. Esta plataforma representa a materialização de um esforço coletivo para edificar um ecossistema de governação digital que respeita e fortalece a autonomia administrativa de cada Instituição de Ensino Superior (IES) e, de forma concomitante, dota a Direção Nacional de Ensino Superior (DNES) de um canal unificado, célere e dotado de idoneidade jurídica.
              </p>

              <p>
                Em vez de impor um fluxo meramente burocrático e centralizado, o sistema desenha uma arquitetura de desconcentração de responsabilidade. O dado estatístico é inserido e validado na sua génese, no exato departamento acadêmico onde a realidade pedagógica e de infraestrutura acontece. A informação ascende de forma estruturada, cruzando instâncias de homologação provinciais e reitorias, até que a aposição da assinatura digital com fé pública confira segurança jurídica plena às declarações prestadas pelas instituições de ensino de todo o país.
              </p>

              {/* 4 Pillars Grid in Resume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 ">
                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Layers className="w-4 h-4 shrink-0" />
                    <strong className="text-slate-900 text-xs uppercase tracking-wider">Inserção Desconcentrada</strong>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    A responsabilidade é distribuída de forma equitativa. Os dados deixam de se acumular como um fardo burocrático nas reitorias na data limite de entrega. Cada faculdade, biblioteca e laboratório cataloga a sua realidade operacional de forma direta e assistida pelo motor de consistência lógica.
                  </p>
                </div>

                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Globe className="w-4 h-4 shrink-0" />
                    <strong className="text-slate-900 text-xs uppercase tracking-wider">Offline-First Resiliente</strong>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Considerando as assimetrias no fornecimento de energia e conectividade à Internet nas diferentes regiões de Moçambique, a plataforma incorpora um mecanismo inteligente de cache local, garantindo que nenhum progresso seja perdido mesmo em situações de queda abrupta de ligação.
                  </p>
                </div>

                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Scale className="w-4 h-4 shrink-0" />
                    <strong className="text-slate-900 text-xs uppercase tracking-wider">Enquadramento Normativo</strong>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Desenvolvido em total harmonia com a <strong>Lei de Transações Eletrónicas de Moçambique (Lei nº 3/2017, de 9 de Janeiro)</strong>, que estabelece o regime jurídico para desmaterialização de processos administrativos, garantindo validade jurídica e presunção de veracidade aos documentos eletrónicos assinados.
                  </p>
                </div>

                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <TrendingUp className="w-4 h-4 shrink-0" />
                    <strong className="text-slate-900 text-xs uppercase tracking-wider">Planeamento Ativo</strong>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Redução drástica do tempo de consolidação do Anuário Estatístico de 8 meses para segundos. O Ministério passa a dispor de visões territoriais dinâmicas que permitem formular políticas de financiamento e distribuição de bolsas com base na realidade em tempo real do sistema de ensino.
                  </p>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-950  mt-6">O Ciclo de Confiança e Integridade de Dados</h3>
              <p>
                A consistência e fidedignidade dos dados do SIGDE-ONLINE são asseguradas por uma trilha lógica estruturada de validação de metadados em quatro instâncias interdependentes:
              </p>

              <div className="space-y-4 my-4  text-sm">
                <div className="relative pl-6 border-l-2 border-emerald-800 space-y-1">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-800"></div>
                  <span className="font-extrabold text-slate-950 block">Etapa 1: Validação Concorrente na Fonte</span>
                  <p className="text-slate-500 leading-relaxed">
                    À medida que o operador digita os dados de matrículas, despesas, recursos ou bibliotecas, o motor reativo de validação computa as regras de consistência lógica (como garantir que o somatório de despesas detalhadas não exceda o orçamento total, ou que a previsão de graduados seja compatível com a série histórica). Impedindo o salvamento de incoerências brutas.
                  </p>
                </div>

                <div className="relative pl-6 border-l-2 border-emerald-800 space-y-1">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-800"></div>
                  <span className="font-extrabold text-slate-950 block">Etapa 2: Parecer e Saneamento do Ponto Focal Provincial</span>
                  <p className="text-slate-500 leading-relaxed">
                    O fluxo sobe para o gestor provincial da província de jurisdição da IES. Através de um painel de monitorização local, o ponto focal avalia discrepâncias, emite observações no chat formal integrado e apoia a instituição na retificação de dados omissos, garantindo a homogeneidade regional antes do envio formal à capital.
                  </p>
                </div>

                <div className="relative pl-6 border-l-2 border-emerald-800 space-y-1">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-800"></div>
                  <span className="font-extrabold text-slate-950 block">Etapa 3: Homologação Institucional e Assinatura com Fé Pública</span>
                  <p className="text-slate-500 leading-relaxed">
                    Após sanadas todas as pendências estatísticas, o relatório de recolha anual consolidado é submetido ao Reitor ou Diretor-Geral da IES. Este, recorrendo à sua credencial segura com duplo fator de autenticação, assina digitalmente o documento. Essa ação gera uma declaração eletrónica carimbada e auditável que confere fé pública jurídica às informações prestadas.
                  </p>
                </div>

                <div className="relative pl-6 border-l-2 border-emerald-800 space-y-1">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-800"></div>
                  <span className="font-extrabold text-slate-950 block">Etapa 4: Integração na Base Nacional e Geração de Insights Estratégicos</span>
                  <p className="text-slate-500 leading-relaxed">
                    Aprovado e assinado pelas reitorias de todo o país, o dado consolida-se automaticamente no PostgreSQL central do Ministério da Educação e Cultura. As APIs analíticas decodificam instantaneamente os dados nacionais, gerando os painéis analíticos bento-grid com tabelas comparativas, mapas de calor territoriais e gráficos de dispersão para apoiar os processos de tomada de decisão da DNES.
                  </p>
                </div>
              </div>

              <p className="mt-4">
                Em suma, o SIGDE-ONLINE ergue-se não apenas como um software utilitário, mas sim como um vetor de soberania estatística e modernização de Estado, demonstrando que a agilidade metodológica, o rigor técnico e a transparência democrática podem caminhar em perfeita sinergia no seio da administração pública moçambicana.
              </p>
            </>
          )}
        </div>
      )}

        {/* 4. APRESENTAÇÃO */}
      {activeSection === 'apresentacao' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed text-justify">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">
              4. Apresentação
            </h2>
            <p className="text-xs text-slate-400  mt-1">
              Conceito de projeto e estrutura organizacional do SIGDE-ONLINE
            </p>
          </div>

          <div className="space-y-4">
            {proyectoTeoricoHumanoData.apresentacao.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}

            <h3 className="text-sm font-bold text-slate-900  pt-2">🏛️ Estrutura de Governação em 5 Níveis</h3>
            <div className="space-y-2 pt-1  text-xs">
              {proyectoTeoricoHumanoData.apresentacao.levels.map((lvl, idx) => (
                <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                  <strong className="text-slate-950 block mb-0.5">{lvl.num}</strong>
                  <p className="text-sm text-slate-700">{lvl.desc}</p>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-bold text-slate-900  pt-3">🔗 Módulos Integrados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1  text-xs">
              {proyectoTeoricoHumanoData.apresentacao.features.map((feat, idx) => (
                <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-white shadow-xs">
                  <strong className="text-slate-950 block mb-0.5">• {feat.title}:</strong>
                  <p className="text-sm text-slate-700">{feat.desc}</p>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-bold text-slate-900  pt-3">🎯 Impacto Estratégico</h3>
            <p>{proyectoTeoricoHumanoData.apresentacao.finalParagraph}</p>

            {/* Explicação Oficial do Novo Logotipo do Sistema */}
            <div className="mt-8 p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden animate-fade-in no-print">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <img src={MOZAMBIQUE_EMBLEM} alt="" className="w-[8.6rem] h-[8rem] object-contain mix-blend-multiply hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center p-1 shadow-md shrink-0">
                    <img src={MOZAMBIQUE_EMBLEM} alt="Emblema de Moçambique" className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase text-[#fec107] tracking-wider leading-none">Emblema Soberano da República de Moçambique & Identidade SIGDE</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Chancela de Identidade e Soberania Digital Moçambicana</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed pt-1 text-justify">
                  O logotipo do <strong>SIGDE-ONLINE</strong> representa a união sinérgica entre a soberania nacional de Moçambique e a modernização estatística orientada a dados. A sua composição visual é rica em simbolismo estratégico:
                </p>
                <ul className="text-[11px] text-slate-300 space-y-2 pl-4 list-disc text-justify">
                  <li>
                    <strong className="text-[#fec107]">Emblema Soberano e as Cores da Pátria:</strong> A esfera dinâmica no topo incorpora as cores vibrantes e o emblema oficial da República de Moçambique, simbolizando a fé pública, a governança centralizada e o compromisso indissolúvel do Ministério de Educação e Cultura com o desenvolvimento nacional.
                  </li>
                  <li>
                    <strong className="text-[#fec107]">Gráfico de Crescimento Ascendente (3D):</strong> A seta tridimensional dourada que aponta para o alto, acompanhada de barras estatísticas progressivas em verde, preto, amarelo e vermelho, representa a evolução exponencial dos índices de matrículas, graduações e a expansão qualitativa do ensino superior no país.
                  </li>
                  <li>
                    <strong className="text-[#fec107]">Cilindro de Banco de Dados e Rede Conectada:</strong> No lado direito, a representação tridimensional de servidores de bases de dados interligados por nós neurais de rede ilustra a resiliência tecnológica, a integridade de dados consolidados em nuvem e a inteligência analítica em tempo real da plataforma.
                  </li>
                  <li>
                    <strong className="text-[#fec107]">Tipografia Metalizada e Lema de Ação:</strong> A sigla metalizada <strong>SIGDE</strong>, apoiada sobre a base conceitual <em>"Conectando dados, gerando conhecimento"</em>, reforça a robustez técnica, a solidez institucional e o caráter integrador de um sistema desenvolvido para servir as gerações futuras.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}















                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs">
                  <strong className="text-slate-950 text-xs block mb-1.5">1. Sistema Dinâmico de Navegação Multi-Nível (Tabs e Router de Estado)</strong>
                  <p className="text-slate-500 leading-relaxed">
                    A navegação principal é orientada por estados reativos (`activeTab` e `sidebarTab`), o que elimina o tempo de carregamento de páginas inteiras (Single Page Application). No topo da hierarquia, o utilizador alterna instantaneamente entre o **Espaço de Trabalho Operacional (Workspace)** e a **Biblioteca de Documentos de Referência (Documents)**. Abaixo deste nível, um menu lateral dinâmico de alta densidade adapta-se de forma inteligente ao nível de perfil do utilizador, exibindo apenas as abas pertinentes (como Dashboards Nacionais/Regionais, Grelhas de Estatística, Módulo de Assinatura, Painel de Mensagens ou o próprio Projeto Teórico).
                  </p>
                </div>

                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs">
                  <strong className="text-slate-950 text-xs block mb-1.5">2. Fluxo Guiado Passo-a-Passo com Indicadores de Progresso Ativos</strong>
                  <p className="text-slate-500 leading-relaxed">
                    Dentro do Módulo de Estatística (coleta de dados), as 8 tabelas de recolha de dados são dispostas numa barra de sub-navegação horizontal intuitiva. Cada sub-tabela exibe uma etiqueta de progresso dinâmica baseada no preenchimento efetivo dos campos obrigatórios. O sistema utiliza transições animadas suaves (`motion` da biblioteca `motion/react`) ao alternar de aba, reduzindo a fadiga cognitiva e sinalizando de forma óbvia qual o eixo estatístico atualmente em foco ativo.
                  </p>
                </div>



      {/* 5. CONTEXTO */}
      {activeSection === 'contexto' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed text-justify">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">
              {isHumanVersion ? "5. Contexto e Diagnóstico: Onde a Mudança Começa" : "5. Contexto e Diagnóstico"}
            </h2>
            <p className="text-xs text-slate-400  mt-1">
              {isHumanVersion 
                ? proyectoTeoricoHumanoData.contexto.subtitle 
                : "O crescimento do Ensino Superior em Moçambique e o gargalo do processamento manual de dados"}
            </p>
          </div>

          {isHumanVersion ? (
            <div className="space-y-4">
              {proyectoTeoricoHumanoData.contexto.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}

              <div className="pt-2">
                <p className="font-bold text-slate-900 mb-2">{proyectoTeoricoHumanoData.contexto.bulletGroup1Title}</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  {proyectoTeoricoHumanoData.contexto.bullets1.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              <p>{proyectoTeoricoHumanoData.contexto.pAfterBullets1}</p>

              <div className="pt-2">
                <p className="font-bold text-slate-900 mb-2">{proyectoTeoricoHumanoData.contexto.bulletGroup2Title}</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  {proyectoTeoricoHumanoData.contexto.bullets2.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              <p className="pt-2">{proyectoTeoricoHumanoData.contexto.finalParagraph}</p>
            </div>
          ) : (
            <>
              <p>
                O subsistema do Ensino Superior em Moçambique registou um crescimento extraordinário nas últimas décadas. Se antes contávamos as universidades nos dedos de uma mão, hoje dezenas de instituições públicas e privadas expandiram-se do Rovuma ao Maputo, democratizando o acesso à formação acadêmica. Todavia, esta louvável expansão física não foi acompanhada por ferramentas modernas de compilação administrativa.
              </p>

              <div className="border-l-4 border-slate-400 pl-4 py-2 my-5 italic text-slate-800  bg-slate-50 rounded-r-xl">
                "Até muito recentemente, as primeiras recolhas estatísticas do setor basearam-se no envio de planilhas Excel por correio eletrónico ou outros canais diretos de comunicação. Esta metodologia pioneira teve um papel fundamental na preservação histórica dos nossos dados e na edificação da cultura estatística nas instituições de ensino superior. Com o crescimento contínuo do ecossistema e em estreito alinhamento com as diretrizes de desmaterialização de processos administrativos da administração pública — conforme preconizado na <strong>Lei de Transações Eletrónicas de Moçambique (Lei nº 3/2017, de 9 de Janeiro)</strong> —, justifica-se plenamente a migração segura para uma plataforma de digitação eletrónica online e integrada, dotada de consistência lógica em tempo de preenchimento e garantia jurídica plena."
              </div>

              <p>
                Esta lentidão crónica gerava graves limitações. O rácio de docentes doutorados por número de alunos, o planeamento de novas bolsas e o cálculo de dotações orçamentais eram feitos com base em meras estimativas ou dados defasados. Havia também um grave problema de consistência: as tabelas de soma cruzada continham frequentemente erros matemáticos elementares de digitação humana, exigindo infindáveis chamadas telefônicas e revisões presenciais cansativas de técnicos que viajavam das províncias até à capital Maputo apenas para retificar células de planilhas.
              </p>

              <p>
                A introdução do SIGDE-ONLINE põe fim definitivo a este calvário operacional. Ao unificar todas as IES num portal web multi-inquilino seguro, os dados passam a ser saneados diretamente na origem. O preenchimento assistido impede o envio de tabelas logicamente inconsistentes e o PostgreSQL centralizado reúne os indicadores estatísticos estruturados num passe de mágica técnica, reduzindo o tempo de consolidação do Ministério de longos meses para meros segundos.
              </p>
            </>
          )}
        </div>
      )}

      {/* 6. PÚBLICO */}
      {activeSection === 'publico' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed text-justify">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">
              {isHumanVersion ? "6. Mapeamento de Utilizadores: As Nossas Histórias de Vida" : "6. Mapeamento de Utilizadores"}
            </h2>
            <p className="text-xs text-slate-400  mt-1">
              {isHumanVersion 
                ? proyectoTeoricoHumanoData.publico.subtitle 
                : "Quem interage com o sistema: perfis, permissões e responsabilidades formais"}
            </p>
          </div>

          {isHumanVersion ? (
            <>
              <p>{proyectoTeoricoHumanoData.publico.intro}</p>

              <div className="space-y-4  text-sm text-slate-700 my-4">
                {proyectoTeoricoHumanoData.publico.users.map((u, idx) => (
                  <div key={idx} className="p-4 border border-slate-150 rounded-2xl bg-white shadow-xs space-y-1 hover:shadow-sm transition-all">
                    <strong className="text-slate-950 text-xs block font-bold">{u.role}</strong>
                    <p className="text-slate-500 leading-relaxed">{u.desc}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p>
                Uma plataforma de âmbito nacional exige uma divisão cirúrgica de papéis. Para garantir a segurança dos dados e evitar intervenções indevidas, o sistema implementa um controlo de acessos rigoroso baseado em perfis funcionais (Role-Based Access Control):
              </p>

              <div className="border border-slate-200 rounded-2xl overflow-hidden  text-sm bg-white my-4 shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold">
                      <th className="p-3 w-1/3">Perfil de Utilizador</th>
                      <th className="p-3">Responsabilidade Operacional Mapeada no Sistema</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-950">Administradores Centrais (DNES/MEC)</td>
                      <td className="p-3 leading-relaxed">Gerem os ciclos de recolha anuais, parametrizam prazos limites no calendário nacional, efetuam auditorias aos dados agregados e geram anuários macro-estatísticos com exportações seguras.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-950">Coordenadores Regionais & Provinciais</td>
                      <td className="p-3 leading-relaxed">Fazem o acompanhamento territorial contínuo das universidades sob sua tutela. Têm acesso visual aos estados de preenchimento ("Em Rascunho", "Assinado", "Em Atraso") e podem despachar advertências diretas.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-950">Reitores / Directores-Gerais das IES</td>
                      <td className="p-3 leading-relaxed">São a autoridade legal máxima da instituição no portal. Analisam o documento final unificado gerado pelas suas equipas e procedem à assinatura digital criptográfica que homologa o envio oficial.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-950">Pontos Focais das IES</td>
                      <td className="p-3 leading-relaxed">Coordenadores de dados ao nível institucional. Supervisionam a digitação das faculdades, resolvem incongruências, saneiam erros estatísticos e submetem o compilado para revisão do Reitor.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-950">Gestores de Faculdade / Departamento</td>
                      <td className="p-3 leading-relaxed">Digitadores primários na base. Introduzem os números reais de cursos ativos, listas de docentes temporários e efectivos, investigadores, despesas locais, salas de aula e capacidade laboratorial de suas unidades.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          <p>
            {isHumanVersion 
              ? "Na prática, esta modelação de perfis reflete-se na própria interface da aplicação. Cada utilizador visualiza um espaço de trabalho adaptado ao seu papel, para que possa trabalhar com foco e tranquilidade, sem ruído desnecessário." 
              : "Na prática, esta modulação de perfis reflete-se na própria interface da aplicação. Um gestor de faculdade visualiza apenas as grelhas relativas à sua área, sem poder interferir no status global do relatório. O Reitor visualiza um resumo analítico limpo e focado com opção de assinatura, enquanto o coordenador provincial acede a listagens agregadas e alertas de prazos de sua circunscrição geográfica."}
          </p>
        </div>
      )}

      {/* 7. JUSTIFICATIVA */}
      {activeSection === 'justificativa' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed text-justify">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">
              {isHumanVersion ? "7. Justificativa Estratégica: Por que Isto é Urgente?" : "7. Justificativa Estratégica"}
            </h2>
            <p className="text-xs text-slate-400  mt-1">
              {isHumanVersion 
                ? proyectoTeoricoHumanoData.justificativa.subtitle 
                : "Por que a modernização do fluxo estatístico é um passo urgente e sem retorno para a educação nacional"}
            </p>
          </div>

          {isHumanVersion ? (
            <div className="space-y-4">
              {proyectoTeoricoHumanoData.justificativa.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}

              <div className="pt-2">
                <p className="font-bold text-slate-900 mb-2">{proyectoTeoricoHumanoData.justificativa.bulletGroup1Title}</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  {proyectoTeoricoHumanoData.justificativa.bullets1.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              <p>{proyectoTeoricoHumanoData.justificativa.pAfterBullets1}</p>

              <ul className="list-disc pl-5 space-y-1.5">
                {proyectoTeoricoHumanoData.justificativa.bulletsCriticas.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>

              <p className="pt-2">{proyectoTeoricoHumanoData.justificativa.pSeminar}</p>

              <div className="pt-2">
                <p className="font-bold text-slate-900 mb-2">{proyectoTeoricoHumanoData.justificativa.bulletGroup2Title}</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  {proyectoTeoricoHumanoData.justificativa.bullets2.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              <p className="pt-2 font-medium text-slate-900">{proyectoTeoricoHumanoData.justificativa.finalParagraph}</p>
            </div>
          ) : (
            <>
              <p>
                A transição para o ecossistema do <strong>SIGDE-ONLINE</strong> representa um passo estratégico essencial para a modernização administrativa do ensino superior em Moçambique. Esta evolução natural visa aprimorar e substituir de forma respeitosa as metodologias de recolha baseadas em planilhas eletrônicas avulsas e processos de atualização anual manual. Conquanto essas ferramentas tradicionais tenham desempenhado um papel pioneiro e meritório no estabelecimento de uma cultura estatística inicial nas instituições, as complexidades logísticas e os desafios de consistência e versão que as caracterizavam diante do forte crescimento do setor demandam, hoje, uma abordagem integrada, célere e segura.
              </p>

              <p>
                O novo sistema atua diretamente na superação das antigas limitações do fluxo de planilhas por meio de uma arquitetura web moderna que reconfigura a consolidação estatística nacional sob três imperativos estratégicos principais, amplamente enriquecidos:
              </p>

              <div className="space-y-4 my-5 ">
                <div className="p-5 border border-slate-250 rounded-2xl bg-white shadow-xs">
                  <strong className="text-slate-950 text-xs block mb-1">I. Redução drástica de Tempo Operacional (Eficiência e Celeridade)</strong>
                  <p className="text-sm text-slate-500 leading-relaxed mt-1">
                    A unificação digital do fluxo de recolha automatiza integralmente a compilação de dados de todo o país. Processos que anteriormente dependiam da recepção, revisão manual e soma de dezenas de planilhas locais por correio eletrônico — demandando de 2 a 4 meses de esforço operacional concentrado entre as equipes do Ministério e os pontos focais — são agora consolidados de forma automatizada na nuvem em frações de segundo, poupando milhares de horas de trabalho e reduzindo significativamente as despesas logísticas do Estado.
                  </p>
                </div>

                <div className="p-5 border border-slate-250 rounded-2xl bg-white shadow-xs">
                  <strong className="text-slate-950 text-xs block mb-1">II. Garantia de Consistência Matemática (Qualidade de Dados na Origem)</strong>
                  <p className="text-sm text-slate-500 leading-relaxed mt-1">
                    O portal introduz um motor inteligente de validações lógicas e somas cruzadas em tempo de preenchimento. Ao validar as informações de forma interativa e amigável diretamente no navegador do utilizador (lado do cliente), o sistema impede a submissão de inconsistências matemáticas elementares ou valores discrepantes. Os dados chegam à base central fidedignos e perfeitamente higienizados, o que elimina a exaustiva necessidade de revisões tardias ou de telefonemas de retificação.
                  </p>
                </div>

                <div className="p-5 border border-slate-250 rounded-2xl bg-white shadow-xs">
                  <strong className="text-slate-950 text-xs block mb-1">III. Segurança, Integridade Jurídica e Rastreabilidade (Assinatura Eletrônica)</strong>
                  <p className="text-sm text-slate-500 leading-relaxed mt-1">
                    A adoção obrigatória de Assinatura Digital criptográfica com autenticação multifatorial (MFA) assegura o amparo legal e a fé pública de todas as declarações estatísticas emitidas pelas Reitorias das IES. Cada homologação efetuada pelo Reitor sela o relatório com uma marca inalterável, enquanto um mecanismo contínuo de logs de auditoria no banco de dados PostgreSQL registra o histórico de digitação de cada campo. Isso garante a fidedignidade, o prestígio e a conformidade legal exigida pelas diretrizes do Tribunal de Contas de Moçambique.
                  </p>
                </div>

                <div className="p-5 border border-slate-250 rounded-2xl bg-white shadow-xs">
                  <strong className="text-slate-950 text-xs block mb-1">IV. Soberania Informativa Nacional e Políticas Públicas Baseadas em Evidências</strong>
                  <p className="text-sm text-slate-500 leading-relaxed mt-1">
                    Ao centralizar com segurança os indicadores institucionais, o Estado moçambicano ganha soberania sobre as estatísticas de seu próprio ensino superior. Decisões delicadas, tais como a alocação de verbas, o fomento a pesquisas científicas e a outorga equitativa de bolsas de estudo, passam a ser baseadas em evidências fidedignas e dados atualizados em tempo real, impulsionando o desenvolvimento planejado e justo de nossa nação.
                  </p>
                </div>

                <div className="p-5 border border-slate-250 rounded-2xl bg-white shadow-xs">
                  <strong className="text-slate-950 text-xs block mb-1">V. Resiliência de Infraestrutura, Acolhimento Territorial e Inclusão (Offline-First)</strong>
                  <p className="text-sm text-slate-500 leading-relaxed mt-1">
                    O sistema respeita ativamente a realidade local e os desafios de conectividade de internet ou eletricidade de certas províncias. Graças à tecnologia offline-first, todos os dados rascunhados pelos operadores provinciais são automaticamente salvaguardados em seu próprio navegador, permitindo a continuidade do preenchimento e sincronizando-os somente quando a ligação for restabelecida, o que protege o esforço e a tranquilidade dos técnicos em qualquer ponto geográfico do país.
                  </p>
                </div>
              </div>

              <p>
                Dessa forma, o SIGDE-ONLINE ergue-se não apenas como uma ferramenta operacional de controle, mas sim como um vetor de inclusão, valorização profissional e transparência democrática, garantindo que a modernização digital atue como um elemento facilitador do cotidiano administrativo do nosso Ensino Superior.
              </p>

              <h3 className="text-sm font-bold text-slate-950  mt-6">Funcionamento Prático do Motor de Auditoria</h3>
              <p>
                Para garantir a integridade jurídica e a idoneidade contra fraudes, o sistema incorpora um **Mecanismo de Logs de Auditoria** ligado diretamente ao PostgreSQL. 
                Cada alteração nas planilhas, cada login efetuado, e cada clique em assinatura digital são registrados com o carimbo temporal UTC oficial, identificação do utilizador (e-mail, NUIT), endereço de IP de origem e os valores anterior e atual ("old value" e "new value"). 
                Isso permite rastrear detalhadamente o histórico de saneamento de cada dado e garante a conformidade com as diretrizes do Tribunal de Contas de Moçambique.
              </p>
            </>
          )}
        </div>
      )}

      {/* 8. OBJETIVOS */}
      {activeSection === 'objetivos' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">
              {isHumanVersion ? "8. Objetivos do Sistema: Metas Com Significado Humano" : "8. Objetivos do Sistema (Metodologia SMART)"}
            </h2>
            <p className="text-xs text-slate-400  mt-1">
              {isHumanVersion 
                ? proyectoTeoricoHumanoData.objetivos.subtitle 
                : "Metas estratégicas formuladas de forma Específica, Mensurável, Alcançável, Realista e Temporal"}
            </p>
          </div>

          <h3 className="text-sm font-bold text-slate-900 ">
            {isHumanVersion ? "O Nosso Propósito Coletivo" : "Objetivo Geral do Projeto"}
          </h3>
          {isHumanVersion ? (
            <>
              {proyectoTeoricoHumanoData.objetivos.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}

              <h3 className="text-sm font-bold text-slate-900  mt-6">As Nossas Metas Reajustadas com Carinho</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 my-6">
                {proyectoTeoricoHumanoData.objetivos.smart.map((s, idx) => (
                  <div key={idx} className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center space-x-2 text-emerald-800  font-bold text-xs uppercase tracking-wider">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>{s.letter} - {s.title}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p>
                Substituir integralmente o paradigma de recolha e consolidação física de dados estatísticos do Ensino Superior em Moçambique por um ecossistema digital unificado (**SIGDE-ONLINE**), desenhado sob a metodologia rigorosa **SMART** para garantir que a recolha de dados nacionais seja precisa, célere, 100% auditável e orientada a resultados concretos.
              </p>

              <h3 className="text-sm font-bold text-slate-900  mt-6">Análise Detalhada dos Critérios SMART</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 my-6">
                {/* S - Específico */}
                <div className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-emerald-800  font-bold text-xs uppercase tracking-wider">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span>S - Específico</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-2">O quê e Como?</h4>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Desenvolver e implementar uma plataforma digital unificada para informatização completa dos <strong>8 Eixos Estatísticos Oficiais</strong> recomendados pela DNES.
                    </p>
                  </div>
                  <div className="text-xs text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md  font-medium self-start">
                    Foco Claro: 8 Eixos Oficiais
                  </div>
                </div>

                {/* M - Mensurável */}
                <div className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-blue-800  font-bold text-xs uppercase tracking-wider">
                      <PieChart className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span>M - Mensurável</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-2">Métricas de Sucesso</h4>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Atingir <strong>100% de adesão e submissão eletrónica</strong> das IES registadas no país, reduzindo o tempo de consolidação do MEC de 8 meses para <strong>segundos</strong>.
                    </p>
                  </div>
                  <div className="text-xs text-blue-800 bg-blue-50 px-2 py-1 rounded-md  font-medium self-start">
                    Meta: 100% Adesão
                  </div>
                </div>

                {/* A - Alcançável */}
                <div className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-indigo-800  font-bold text-xs uppercase tracking-wider">
                      <TrendingUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      <span>A - Alcançável</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-2">Viabilidade Técnica</h4>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Resiliência assegurada pelo mecanismo de cache <strong>Offline-First (LocalStorage)</strong> para zonas com internet instável e capacitação de Pontos Focais.
                    </p>
                  </div>
                  <div className="text-xs text-indigo-800 bg-indigo-50 px-2 py-1 rounded-md  font-medium self-start">
                    Resiliência Offline-First
                  </div>
                </div>

                {/* R - Realista */}
                <div className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-amber-800  font-bold text-xs uppercase tracking-wider">
                      <Scale className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <span>R - Realista</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-2">Relevância Prática</h4>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Alinhado diretamente com as carências de governação pública descritas no Plano Estratégico da Educação, operando com PostgreSQL e criptografia de assinaturas.
                    </p>
                  </div>
                  <div className="text-xs text-amber-800 bg-amber-50 px-2 py-1 rounded-md  font-medium self-start">
                    Segurança PostgreSQL
                  </div>
                </div>

                {/* T - Temporal */}
                <div className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-rose-800  font-bold text-xs uppercase tracking-wider">
                      <Calendar className="w-5 h-5 text-rose-600 flex-shrink-0" />
                      <span>T - Temporal</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-2">Prazos e Ciclo</h4>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Rollout completo em <strong>6 meses</strong>. Ciclo anual de coleta de dados parametrizado para encerramento automático em <strong>45 dias úteis</strong>.
                    </p>
                  </div>
                  <div className="text-xs text-rose-800 bg-rose-50 px-2 py-1 rounded-md  font-medium self-start">
                    Ciclo: 45 Dias Úteis
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900  mt-6">Comparação de Paradigmas: O Impacto SMART</h3>
              <p>
                A tabela abaixo contrasta de forma quantitativa e qualitativa o método herdado de trabalho face aos novos objetivos estabelecidos sob os critérios SMART do SIGDE-ONLINE:
              </p>

              <div className="border border-slate-200 rounded-xl overflow-hidden  my-4 bg-white shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold text-xs">
                      <th className="p-2.5">Critério SMART</th>
                      <th className="p-2.5">Paradigma Anterior (Manual / Desestruturado)</th>
                      <th className="p-2.5 bg-slate-800">Novo Paradigma (SIGDE-ONLINE SMART)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">Específico (S)</td>
                      <td className="p-2.5">Envio de relatórios em formatos mistos (papel, PDF, e-mails soltos).</td>
                      <td className="p-2.5 bg-slate-50 font-medium text-emerald-950">Preenchimento estruturado de 8 eixos de dados padronizados com validação por API.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">Mensurável (M)</td>
                      <td className="p-2.5">Inconsistências descobertas tardiamente. Adesão difícil de auditar.</td>
                      <td className="p-2.5 bg-slate-50 font-medium text-emerald-950">Validação matemática em tempo real. Painel de status e barra de progresso imediata.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">Alcançável (A)</td>
                      <td className="p-2.5">Pontos focais em províncias remotas sem conexão ficam totalmente bloqueados.</td>
                      <td className="p-2.5 bg-slate-50 font-medium text-emerald-950">Cache local robusto (Offline-First) permitindo digitação contínua e sincronização posterior.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">Realista (R)</td>
                      <td className="p-2.5">Relatórios vulneráveis a fraudes, alterações pós-envio e extravios físicos.</td>
                      <td className="p-2.5 bg-slate-50 font-medium text-emerald-950">Homologação por Assinatura Criptográfica (PIN seguro) com Logs de Auditoria perpétuos.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">Temporal (T)</td>
                      <td className="p-2.5">O processo de recolha arrastava-se por até 8 meses sem prazo fixo.</td>
                      <td className="p-2.5 bg-slate-50 font-medium text-emerald-950">Fecho automático de ciclos em 45 dias com alertas automáticos regressivos (Timer/Cron).</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-sm font-bold text-slate-950  mt-6">Metas de Performance do Sistema e SLAs de Serviço</h3>
              <p>
                Para assegurar que o critério <strong>Mensurável (M)</strong> e <strong>Temporal (T)</strong> sejam mantidos em conformidade constante com a DNES, o software está programado sob as seguintes métricas rigorosas de desempenho de engenharia:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4  text-xs my-4">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-slate-400 block uppercase font-bold text-xs tracking-wide">Velocidade de Ingress</span>
                  <strong className="text-sm text-slate-900">&lt; 2.0 Segundos</strong>
                  <p className="text-xs text-slate-500 leading-relaxed">Tempo máximo de carregamento de qualquer planilha de recolha estatística com mais de 500 células.</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-slate-400 block uppercase font-bold text-xs tracking-wide">Disponibilidade Geral</span>
                  <strong className="text-sm text-slate-900">99.9% de SLA</strong>
                  <p className="text-xs text-slate-500 leading-relaxed">SLA operacional garantido através de redundância geográfica do banco relacional PostgreSQL.</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-slate-400 block uppercase font-bold text-xs tracking-wide">Validação de Consistência</span>
                  <strong className="text-sm text-slate-900">100% Automatizada</strong>
                  <p className="text-xs text-slate-500 leading-relaxed">Zero tolerância a erros matemáticos de somas cruzadas, bloqueando o envio de relatórios corrompidos.</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 9. PLANO DE TRABALHO */}
      {activeSection === 'plano_trabalho' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">
              {isHumanVersion ? "9. Plano de Trabalho: O Nosso Caminho de Cuidado" : "9. Plano de Trabalho"}
            </h2>
            <p className="text-xs text-slate-400  mt-1">
              {isHumanVersion 
                ? proyectoTeoricoHumanoData.plano_trabalho.subtitle 
                : "Roteiro lógico, do Passo 0 à Fase Atual e etapas de Rollout"}
            </p>
          </div>

          {isHumanVersion ? (
            <>
              <p>{proyectoTeoricoHumanoData.plano_trabalho.paragraphs[0]}</p>

              <div className="border border-slate-200 rounded-2xl overflow-hidden  text-sm bg-slate-50 my-4">
                <div className="p-3 bg-slate-900 text-white font-bold text-xs">A Nossa Linha do Tempo Evolutiva</div>
                <div className="divide-y divide-slate-200">
                  {proyectoTeoricoHumanoData.plano_trabalho.steps.map((item, idx) => (
                    <div key={idx} className="p-3 space-y-1">
                      <span className="font-bold text-xs block text-emerald-800">
                        {item.step}: {item.title}
                      </span>
                      <p className="leading-relaxed text-xs text-slate-600">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900  mt-4">Abraçando o Futuro Juntos</h3>
              <div className="relative border-l border-emerald-300 pl-6 ml-4 space-y-6 ">
                {proyectoTeoricoHumanoData.plano_trabalho.rollout.map((r, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[30px] top-1 bg-emerald-700 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <strong className="text-emerald-950 text-xs block">{r.title}</strong>
                    <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{r.desc}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-sm font-bold text-slate-900 ">Jornada de Criação do Sistema (do Passo 0 ao Estado Atual)</h3>
              <p>
                O desenvolvimento do SIGDE-ONLINE segue uma metodologia ágil e rigorosa. Abaixo, detalhamos cada passo do processo evolutivo do projeto:
              </p>

              <div className="border border-slate-200 rounded-2xl overflow-hidden  text-sm bg-slate-50 my-4">
                <div className="p-3 bg-slate-900 text-white font-bold text-xs">Cronologia de Engenharia do Sistema</div>
                <div className="divide-y divide-slate-200">
                  <div className="p-3 space-y-1">
                    <span className="font-bold text-emerald-800 text-xs block">PASSO 0: Concepção, Pesquisa de Campo e Inception (Passo Incial)</span>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      Estudo de campo junto às IES e à DNES. Identificação dos gargalos do preenchimento manual, diagnóstico das inconsistências de dados e das perdas de prazos. Mapeamento analítico dos formulários em papel e planilhas complexas, resultando na concepção inicial da governação de dados.
                    </p>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="font-bold text-emerald-800 text-xs block">PASSO 1: Prototipagem da Interface e Estilização</span>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      Desenvolvimento do layout visual centrado no utilizador. Configuração do framework React, Vite e utilitários de Tailwind CSS. Criação do tema Slate clássico de alto contraste, e implementação de gráficos interativos com a biblioteca Recharts para traduzir números frios em conhecimento dinâmico.
                    </p>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="font-bold text-emerald-800 text-xs block">PASSO 2: Persistência Local e Offline-First (Sincronização Segura)</span>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      Programação do mecanismo de persistência resiliente. Implementação do cache local via browser (**LocalStorage/IndexedDB**). Caso a ligação de internet sofra oscilações comuns nas províncias remotas, o sistema salva os dados localmente e sincroniza silenciosamente com o PostgreSQL quando a conexão é restabelecida.
                    </p>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="font-bold text-emerald-800 text-xs block">PASSO 3: Homologação e Módulo de Assinatura Criptográfica</span>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      Desenvolvimento do módulo de Fé Pública para Reitores. Programação do fluxo MFA de simulação de chaves e carimbos, garantindo a audição integral da autoria dos dados estatísticos fornecidos. Criação do módulo de chat oficial fechado e cronômetro de prazos integrado.
                    </p>
                  </div>
                  <div className="p-3 space-y-1 bg-emerald-50">
                    <span className="font-bold text-emerald-950 text-xs block">FASE ATUAL: Consolidação Teórica, Documental e Visual para Impressão</span>
                    <p className="text-slate-900 leading-relaxed text-xs">
                      Fase atual. Implementação do motor de renderização dinâmico de projetos teóricos com impressão fidedigna (PDF em CSS Paged Media), permitindo aos gestores descarregarem o livro completo do projeto com formatação elegante de livro técnico, com emblema oficial, capas e contracapas padronizadas.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900  mt-4">Etapas de Rollout Nacional e Próximos Passos</h3>
              <div className="relative border-l border-emerald-300 pl-6 ml-4 space-y-6 ">
                <div className="relative">
                  <div className="absolute -left-[30px] top-1 bg-emerald-700 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <strong className="text-emerald-950 text-xs block">Fase Piloto e Saneamento Inicial (IES Piloto)</strong>
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Testes reais em 5 universidades moçambicanas de referência de modo a calibrar os algoritmos de consistência e validar as tabelas de inserção contra falsos-positivos.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[30px] top-1 bg-emerald-700 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <strong className="text-emerald-950 text-xs block">Capacitação, Manuais e Formação Presencial</strong>
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Formação presencial e webinars práticos em todas as delegações provinciais de Moçambique, munindo os Pontos Focais e Reitores com o Manual Técnico do utilizador do SIGDE-ONLINE.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[30px] top-1 bg-emerald-700 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <strong className="text-emerald-950 text-xs block">Lançamento Operacional Pleno</strong>
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Rollout para todo o ecossistema nacional, abrindo o canal de envio unificado de relatórios anuais, e publicação em tempo real dos anuários do MEC/DNES.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 10. METODOLOGIA */}
      {activeSection === 'metodologia' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">
              {isHumanVersion ? "10. Metodologia: Como Cuidamos de Cada Registro" : "10. Metodologia"}
            </h2>
            <p className="text-xs text-slate-400  mt-1">
              {isHumanVersion 
                ? proyectoTeoricoHumanoData.metodologia.subtitle 
                : "Eixos estatísticos e arquitetura tecnológica para consolidação fidedigna"}
            </p>
          </div>

          {isHumanVersion ? (
            <>
              <p>{proyectoTeoricoHumanoData.metodologia.paragraphs[0]}</p>

              <div className="space-y-3  text-sm text-slate-700">
                {proyectoTeoricoHumanoData.metodologia.eixos.map((ax, idx) => (
                  <div key={idx} className="p-3 border border-slate-200 rounded-xl bg-slate-50">
                    <strong className="text-emerald-950 block text-xs">{ax.title}</strong>
                    <span className="text-xs text-slate-500 leading-relaxed block mt-0.5">{ax.desc}</span>
                  </div>
                ))}
              </div>

              <p>
                <strong>As Nossas Escolhas Tecnológicas:</strong> Desenvolvido com carinho e robustez. Front-end responsivo em **React.js** e **Tailwind CSS** para dar suavidade ao utilizador; back-end em **Node.js** com APIs desenhadas para gastar o mínimo de dados possível; e banco de dados relacional **PostgreSQL**, garantindo que nenhum registro de estudante se perca na imensidão digital.
              </p>
            </>
          ) : (
            <>
              <p>
                A metodologia de coleta de dados do SIGDE-ONLINE reside na transposição eletrônica inteligente dos antigos formulários e quadros fornecidos pela DNES, consolidando-os em **8 Eixos Estatísticos Estruturados**:
              </p>

              <div className="space-y-3  text-sm text-slate-700">
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <strong className="text-emerald-950 block text-xs">Eixo 1: Identificação Cadastral e Jurídica da IES</strong>
                  <span className="text-xs text-slate-500">Localização provincial, distrital, natureza jurídica (pública/privada), contactos oficiais e registo de filiações acadêmicas.</span>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <strong className="text-emerald-950 block text-xs">Eixo 2: Estatísticas de Corpo Discente (Alunos)</strong>
                  <span className="text-xs text-slate-500">Demandas e candidaturas, vagas, estudantes matriculados e graduados por curso, nacionalidade, faixa etária, sexo e província de naturalidade, além de alunos bolseiros.</span>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <strong className="text-emerald-950 block text-xs">Eixo 3: Corpo Docente (Professores)</strong>
                  <span className="text-xs text-slate-500">Mapeamento de docentes ativos por regime de contratação (Tempo Integral/Tempo Parcial), nacionalidade, categoria acadêmica, área de formação e grau de titulação (Doutoramento, Mestrado, Licenciatura).</span>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <strong className="text-emerald-950 block text-xs">Eixo 4: Investigação Científica e Projetos de Extensão</strong>
                  <span className="text-xs text-slate-500">Investigadores ativos por regime, publicações científicas homologadas, monografias e teses orientadas, e projetos de extensão comunitária em andamento.</span>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <strong className="text-emerald-950 block text-xs">Eixo 5: Corpo Técnico Administrativo (CTA)</strong>
                  <span className="text-xs text-slate-500">Registos de qualificações acadêmicas, regimes de contrato e faixas etárias do pessoal de suporte administrativo.</span>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <strong className="text-emerald-950 block text-xs">Eixo 6: Recursos Financeiros</strong>
                  <span className="text-xs text-slate-500">Despesas correntes e operacionais, investimentos em infraestrutura, receitas por fontes (orçamentos gerais, propinas estudantis, cooperações internacionais).</span>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <strong className="text-emerald-950 block text-xs">Eixo 7: Infraestrutura, TIC e Bibliotecas</strong>
                  <span className="text-xs text-slate-500">Salas de aula funcionais, laboratórios científicos por áreas, acervo e bibliotecas ativas e computadores conectados para uso de alunos.</span>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <strong className="text-emerald-950 block text-xs">Eixo 8: Previsão de Estudantes e Vagas para o Ano Subsequente</strong>
                  <span className="text-xs text-slate-500">Estimativas de dotação de vagas e projeção de crescimento da demanda estudantil para planeamento orçamentário.</span>
                </div>
              </div>

              <p>
                <strong>Tecnologias Utilizadas:</strong> Front-end responsivo em **React.js** e **Tailwind CSS** para máxima leveza de carregamento; back-end in **Node.js** com APIs REST robustas; e banco de dados relacional e escalável **PostgreSQL**, estruturando relatórios analíticos de alta performance.
              </p>
            </>
          )}
        </div>
      )}

      {/* 11. INDICADORES */}
      {activeSection === 'indicadores' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed text-justify">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">
              {isHumanVersion ? "11. Painel de Indicadores: O Impacto na Vida Real" : "11. Painel de Indicadores de Sucesso"}
            </h2>
            <p className="text-xs text-slate-400  mt-1">
              {isHumanVersion 
                ? proyectoTeoricoHumanoData.indicadores.subtitle 
                : "Métricas de monitorização contínua para aferir o impacto administrativo e técnico do sistema"}
            </p>
          </div>

          {isHumanVersion ? (
            <>
              <p>{proyectoTeoricoHumanoData.indicadores.paragraphs[0]}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4  text-sm text-slate-700 mt-4">
                {proyectoTeoricoHumanoData.indicadores.kpis.map((k, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 rounded-2xl bg-white shadow-xs hover:shadow-md transition-all space-y-1">
                    <span className="text-emerald-800 font-extrabold text-xl block">{k.value}</span>
                    <strong className="text-slate-900 block text-xs">{k.title}</strong>
                    <span className="text-xs text-slate-500 leading-relaxed block">{k.desc}</span>
                  </div>
                ))}
              </div>

              <p className="mt-4">
                Estes indicadores mostram que um sistema mais humano é, por consequência, um sistema infinitamente mais eficiente e duradouro.
              </p>
            </>
          ) : (
            <>
              <p>
                O sucesso da transição digital promovida pelo SIGDE-ONLINE não se mede apenas pela quantidade de linhas de código escritas ou servidores ligados; mede-se pela melhoria real na rotina de quem lida com dados estatísticos. Para que o Ministério e as IES possam acompanhar o retorno real deste investimento, definimos um conjunto de indicadores de desempenho (KPIs) transversais, que mapeiam o ganho de eficiência desde a inserção de dados na base até ao relatório nacional consolidado:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4  text-sm text-slate-700 mt-4">
                {kpiData.map((k, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 rounded-2xl bg-white shadow-xs hover:shadow-md transition-all space-y-1">
                    <span className="text-emerald-800 font-extrabold text-xl block">{k.value}</span>
                    <strong className="text-slate-900 block text-xs">{k.title}</strong>
                    <span className="text-xs text-slate-500 leading-relaxed block">{k.desc}</span>
                  </div>
                ))}
              </div>

              <p className="mt-4">
                Cada um destes indicadores é recalculado de forma dinâmica pelas APIs centrais do sistema, permitindo que a DNES identifique imediatamente quais as universidades que necessitam de apoio técnico adicional e garanta que o relatório anual nacional seja publicado sempre em tempo letivo oportuno.
              </p>
            </>
          )}
        </div>
      )}

      {/* 12. ANÁLISE DE RISCOS */}
      {activeSection === 'analise_riscos' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed text-justify">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">
              {isHumanVersion ? "12. Gestão de Riscos: Protegendo as Pessoas e a Informação" : "12. Gestão Proativa de Riscos"}
            </h2>
            <p className="text-xs text-slate-400  mt-1">
              {isHumanVersion 
                ? proyectoTeoricoHumanoData.analise_riscos.subtitle 
                : "Mapeamento de ameaças técnicas, operacionais e de segurança, com estratégias integradas de mitigação"}
            </p>
          </div>

          {isHumanVersion ? (
            <>
              <p>{proyectoTeoricoHumanoData.analise_riscos.paragraphs[0]}</p>

              <div className="space-y-4  text-sm text-slate-700 my-4">
                {proyectoTeoricoHumanoData.analise_riscos.risks.map((r, idx) => (
                  <div key={idx} className="p-5 border border-red-100 rounded-2xl bg-red-50/20 space-y-2">
                    <strong className="text-red-950 block text-xs uppercase tracking-wider">{r.id}: {r.title}</strong>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      <em>Impacto nas Pessoas:</em> <span className="font-bold text-red-900">{r.impact}</span>
                    </p>
                    <p className="text-slate-800 text-sm leading-relaxed bg-white border border-red-100/50 p-3 rounded-xl mt-1">
                      <strong>A Nossa Resposta de Proteção:</strong> {r.mitigation}
                    </p>
                  </div>
                ))}
              </div>

              <p>
                Ao antecipar estes cenários adversos, a plataforma garante que mesmo nos momentos de maior pico de acessos ou em zonas rurais com fornecimento elétrico instável, a integridade da informação do Ministério permaneça perfeitamente resguardada.
              </p>
            </>
          ) : (
            <>
              <p>
                Um sistema que centraliza 100% da informação estatística do ensino superior nacional torna-se, inevitavelmente, um ativo crítico de Estado. Por isso, a concepção do SIGDE-ONLINE não se limitou ao desenvolvimento de formulários bonitos; envolveu um estudo rigoroso de riscos para prever falhas humanas, oscilações severas de infraestrutura regional e ameaças à segurança dos dados, aplicando travas de segurança robustas diretamente ao nível do código e do banco de dados:
              </p>

              <div className="space-y-4  text-sm text-slate-700 my-4">
                {riskData.map((r, idx) => (
                  <div key={idx} className="p-5 border border-red-100 rounded-2xl bg-red-50/20 space-y-2">
                    <strong className="text-red-950 block text-xs uppercase tracking-wider">{r.id}: {r.title}</strong>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      <em>Impacto Avaliado:</em> <span className="font-bold text-red-900">{r.impact}</span>
                    </p>
                    <p className="text-slate-800 text-sm leading-relaxed bg-white border border-red-100/50 p-3 rounded-xl mt-1">
                      <strong>Estratégia de Mitigação Implementada:</strong> {r.mitigation}
                    </p>
                  </div>
                ))}
              </div>

              <p>
                Ao antecipar estes cenários adversos, a plataforma garante que mesmo nos momentos de maior pico de acessos ou em zonas rurais com fornecimento elétrico instável, a integridade da informação do Ministério permaneça perfeitamente resguardada.
              </p>
            </>
          )}
        </div>
      )}

      {/* 13. SUSTENTABILIDADE DO PROJETO */}
      {activeSection === 'sustentabilidade' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed text-justify">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">
              {isHumanVersion ? "13. Sustentabilidade: Cuidando do Amanhã" : "13. Sustentabilidade e Perenidade"}
            </h2>
            <p className="text-xs text-slate-400  mt-1">
              {isHumanVersion 
                ? proyectoTeoricoHumanoData.sustentabilidade.subtitle 
                : "Como assegurar o funcionamento contínuo, a soberania técnica e a evolução do sistema ao longo dos anos"}
            </p>
          </div>

          {isHumanVersion ? (
            <>
              <p>{proyectoTeoricoHumanoData.sustentabilidade.paragraphs[0]}</p>

              <div className="space-y-4  text-slate-600 text-sm leading-relaxed">
                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs">
                  <p>{proyectoTeoricoHumanoData.sustentabilidade.paragraphs[1]}</p>
                </div>

                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs">
                  <p>{proyectoTeoricoHumanoData.sustentabilidade.paragraphs[2]}</p>
                </div>

                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs">
                  <p>{proyectoTeoricoHumanoData.sustentabilidade.paragraphs[3]}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <p>
                O cemitério de software da administração pública está cheio de projetos brilhantes que morreram assim que terminou o financiamento estrangeiro inicial de desenvolvimento. Cientes desta realidade, modelámos a sustentabilidade do **SIGDE-ONLINE** sobre três pilares práticos e realistas, garantindo que o sistema seja perfeitamente autônomo e de baixo custo de manutenção para os cofres do Estado moçambicano:
              </p>

              <div className="space-y-4 ">
                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs">
                  <strong className="text-slate-950 text-xs block mb-1">A. Sustentabilidade Financeira Otimizada via OGE</strong>
                  <p className="text-sm text-slate-500 leading-relaxed mt-1">
                    A infraestrutura do sistema foi desenhada para ser altamente eficiente. O custo anual de manutenção dos servidores em nuvem, licenciamento de segurança e suporte técnico ordinário está orçado em cerca de $20,000 USD ao ano. Este valor, extremamente otimizado, será integrado de forma permanente nas rubricas de funcionamento ordinário do Orçamento Geral do Estado (OGE) do Ministério da Educação, eliminando qualquer dependência de fundos internacionais de cooperação para manter as portas do portal abertas.
                  </p>
                </div>

                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs">
                  <strong className="text-slate-950 text-xs block mb-1">B. Soberania Tecnológica e Código-Fonte Aberto (Open-Source)</strong>
                  <p className="text-sm text-slate-500 leading-relaxed mt-1">
                    Para evitar taxas abusivas de licenciamento de software proprietário e o aprisionamento tecnológico de fornecedores (vendor lock-in), utilizámos unicamente tecnologias de código aberto amplamente consolidadas no mercado (React, Node.js e PostgreSQL). Adicionalmente, o contrato estipula a transferência exaustiva de conhecimento e a entrega integral dos códigos-fonte documentados ao departamento de TI do Ministério, capacitando a equipa técnica interna a efetuar melhorias, correções de bugs e expansões sem custos adicionais.
                  </p>
                </div>

                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs">
                  <strong className="text-slate-950 text-xs block mb-1">C. Sustentabilidade Normativa e Obrigatoriedade Legal</strong>
                  <p className="text-sm text-slate-500 leading-relaxed mt-1">
                    A melhor forma de garantir que uma ferramenta digital seja usada é integrando-a nos processos burocráticos estabelecidos por lei. A submissão eletrónica do relatório anual do SIGDE-ONLINE será oficialmente instituída no Regulamento Geral do Ensino Superior como um pré-requisito obrigatório para a validação de novos cursos acadêmicos e para a renovação de credenciamento anual de todas as IES moçambicanas, tornando o sistema uma peça intrínseca da engrenagem reguladora do país.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 14. CRONOGRAMA */}
      {activeSection === 'cronograma' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">
              {isHumanVersion ? "14. Cronograma: O Tempo do Nosso Encontro" : "14. Cronograma"}
            </h2>
            <p className="text-xs text-slate-400  mt-1">
              {isHumanVersion 
                ? proyectoTeoricoHumanoData.cronograma.subtitle 
                : "Cronograma integrado de execução de metas técnicas e operacionais (Meses 1 a 12)"}
            </p>
          </div>

          {isHumanVersion ? (
            <>
              <p>{proyectoTeoricoHumanoData.cronograma.paragraphs[0]}</p>

              <div className="space-y-4  text-slate-600 text-sm leading-relaxed">
                {proyectoTeoricoHumanoData.cronograma.schedule.map((item, idx) => (
                  <div key={idx} className="p-4 border border-emerald-100 rounded-2xl bg-emerald-50/10 space-y-2">
                    <strong className="text-emerald-950 block text-xs uppercase tracking-wider">{item.phase}</strong>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p>
                O desenvolvimento e implantação do SIGDE-ONLINE seguem um cronograma linear rigoroso ao longo de 12 meses, estruturado em trimestres lógicos para mitigar riscos de engenharia e adoção institucional:
              </p>

              <div className="border border-slate-200 rounded-2xl overflow-hidden  text-sm bg-white">
                <div className="bg-slate-900 text-white font-bold p-3 grid grid-cols-12 gap-2 text-center">
                  <div className="col-span-4 text-left">Fases e Metas do Projeto</div>
                  <div className="col-span-2">T1 (M1-M3)</div>
                  <div className="col-span-2">T2 (M4-M6)</div>
                  <div className="col-span-2">T3 (M7-M9)</div>
                  <div className="col-span-2">T4 (M10-M12)</div>
                </div>
                
                <div className="divide-y divide-slate-150 text-slate-800">
                  {timelineData.map((t, idx) => (
                    <div key={idx} className="p-3 grid grid-cols-12 gap-2 items-center text-center">
                      <div className="col-span-4 text-left font-bold text-slate-900">{t.phase}</div>
                      <div className={`col-span-2 py-1 rounded text-xs ${t.t1 !== '---' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-400'}`}>{t.t1}</div>
                      <div className={`col-span-2 py-1 rounded text-xs ${t.t2 !== '---' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-400'}`}>{t.t2}</div>
                      <div className={`col-span-2 py-1 rounded text-xs ${t.t3 !== '---' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-400'}`}>{t.t3}</div>
                      <div className={`col-span-2 py-1 rounded text-xs ${t.t4 !== '---' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-400'}`}>{t.t4}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 15. ORÇAMENTO */}
      {activeSection === 'orcamento' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">
              {isHumanVersion ? "15. Orçamento: Cuidado e Transparência de Recursos" : "15. Orçamento"}
            </h2>
            <p className="text-xs text-slate-400  mt-1">
              {isHumanVersion 
                ? proyectoTeoricoHumanoData.orcamento.subtitle 
                : "Dotação financeira consolidada para desenvolvimento e sustentabilidade de software"}
            </p>
          </div>

          {isHumanVersion ? (
            <>
              <p>{proyectoTeoricoHumanoData.orcamento.intro}</p>

              <div className="space-y-4  my-4">
                {proyectoTeoricoHumanoData.orcamento.categories.map((cat, i) => (
                  <div key={i} className="p-4 border border-slate-200 rounded-2xl bg-white shadow-xs">
                    <strong className="text-slate-900 block text-xs mb-1">{cat.title}</strong>
                    <p className="text-sm text-slate-500 leading-relaxed">{cat.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-950 text-white rounded-2xl  text-xs flex justify-between items-center">
                <span>Investimento Total Estimado:</span>
                <span className="font-mono font-bold">${totalBudgetUSD.toLocaleString()} USD ({totalBudgetMZN.toLocaleString()} MZN)</span>
              </div>
            </>
          ) : (
            <>
              <p>
                O investimento total para o desenvolvimento, hospedagem, implantação piloto, treinamento de técnicos e rollout nacional do SIGDE-ONLINE foi estimado em **$89,500 USD**, equivalente a **5,817,500 MZN** (com taxa cambial oficial de 1 USD = 65.00 MZN), dividido nas seguintes categorias estratégicas:
              </p>

              <div className="border border-slate-300 rounded-xl overflow-hidden  text-sm bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold">
                      <th className="p-3">Categoria</th>
                      <th className="p-3">Descrição Técnica</th>
                      <th className="p-3 text-right">USD</th>
                      <th className="p-3 text-right">MZN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {budgetData.map((b, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-950">{b.category}</td>
                        <td className="p-3 text-xs text-slate-500 leading-relaxed">{b.desc}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">${b.valueUSD.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">{b.valueMZN.toLocaleString()} MZN</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-950 text-white font-bold">
                      <td className="p-3" colSpan={2}>Valor Total Estimado para Implementação</td>
                      <td className="p-3 text-right font-mono">${totalBudgetUSD.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono">{totalBudgetMZN.toLocaleString()} MZN</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* 16. ANEXOS */}
      {activeSection === 'anexos' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">
              {isHumanVersion ? "16. Anexos: Nossos Canais e Linguagem de Cuidado" : "16. Anexos"}
            </h2>
            <p className="text-xs text-slate-400  mt-1">
              {isHumanVersion 
                ? proyectoTeoricoHumanoData.anexos.subtitle 
                : "Materiais complementares, nomenclatura oficial e canais de suporte ao utilizador"}
            </p>
          </div>

          {isHumanVersion ? (
            <>
              <div className="space-y-4">
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <h3 className="font-bold text-slate-900 text-xs  mb-2">Anexo I: Dicionário das Nossas Siglas de Cuidado</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 font-mono text-xs text-slate-700">
                    <div><strong>• SIGDE-ONLINE:</strong> O nosso espaço digital de união e coleta de dados estatísticos</div>
                    <div><strong>• IES:</strong> Instituições de Ensino Superior (onde nascem os sonhos acadêmicos)</div>
                    <div><strong>• DNES:</strong> Direcção Nacional de Ensino Superior (as pessoas que coordenam o nosso futuro)</div>
                    <div><strong>• MEC:</strong> Ministério de Educação e Cultura (a casa comum da nossa educação)</div>
                    <div><strong>• CTA:</strong> Corpo Técnico Administrativo (quem cuida dos bastidores com amor)</div>
                    <div><strong>• TI / TP:</strong> Tempo Integral / Tempo Parcial (as diferentes formas de se doar ao ensino)</div>
                    <div><strong>• MZN / USD:</strong> Metical e Dólar (os recursos que transformamos em conquistas reais)</div>
                    <div><strong>• RLS:</strong> Proteção de Nível de Linha (o escudo que guarda as histórias de cada um)</div>
                  </div>
                </div>

                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 ">
                  <h3 className="font-bold text-slate-900 text-xs mb-2">Anexo II: Contatos de Quem Cuida do Sistema</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    {proyectoTeoricoHumanoData.anexos.support}
                  </p>
                  <ul className="text-sm text-slate-700 space-y-1 list-disc pl-5">
                    <li><strong>Guia de Apoio:</strong> Franzíssi Tripalonga Vicente</li>
                    <li><strong>E-mail de Encontro:</strong> f.vicente@dnes.gov.mz</li>
                    <li><strong>Berço do Desenvolvimento:</strong> www.google.com/iastudio</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <h3 className="font-bold text-slate-900 text-xs  mb-2">Anexo I: Lista de Abreviaturas e Acrónimos Oficiais</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 font-mono text-xs text-slate-700">
                    <div><strong>• SIGDE-ONLINE:</strong> Sistema Integrado de Gestão de Coleta de Dados Estatísticos</div>
                    <div><strong>• IES:</strong> Instituições de Ensino Superior de Moçambique</div>
                    <div><strong>• DNES:</strong> Direcção Nacional de Ensino Superior</div>
                    <div><strong>• MEC:</strong> Ministério de Educação e Cultura</div>
                    <div><strong>• CTA:</strong> Corpo Técnico Administrativo</div>
                    <div><strong>• TI / TP:</strong> Tempo Integral / Tempo Parcial</div>
                    <div><strong>• MZN / USD:</strong> Metical Moçambicano / Dólar Americano</div>
                    <div><strong>• RLS:</strong> Row Level Security (Segurança do Postgres)</div>
                  </div>
                </div>

                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 ">
                  <h3 className="font-bold text-slate-900 text-xs mb-2">Anexo II: Contatos de Suporte Técnico de Engenharia</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    Para esclarecimentos sobre chaves criptográficas de Assinatura Digital, saneamento de banco de dados PostgreSQL ou integração de novos eixos estatísticos de recolha, contatar diretamente a equipa técnica liderada pelo projetista:
                  </p>
                  <ul className="text-sm text-slate-700 space-y-1 list-disc pl-5">
                    <li><strong>Responsável Técnico:</strong> Franzíssi Tripalonga Vicente</li>
                    <li><strong>E-mail Institucional:</strong> f.vicente@dnes.gov.mz</li>
                    <li><strong>Suporte de Desenvolvimento:</strong> www.google.com/iastudio</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 17. CHECK LIST */}
      {activeSection === 'checklist' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">
              {isHumanVersion ? "17. Nosso Checklist de Prontidão e Cuidado" : "17. Check list"}
            </h2>
            <p className="text-xs text-slate-400  mt-1">
              {isHumanVersion 
                ? proyectoTeoricoHumanoData.checklist.subtitle 
                : "Pontos críticos de validação para o go-live e entrada em funcionamento do SIGDE-ONLINE"}
            </p>
          </div>

          {isHumanVersion ? (
            <>
              <div className="space-y-3  text-sm text-slate-800">
                {proyectoTeoricoHumanoData.checklist.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                    <input type="checkbox" defaultChecked={item.checked} className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                    <div>
                      <p className="text-sm text-slate-700 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p>
                A seguinte check list deve ser obrigatoriamente preenchida e assinada pelos administradores DNES e o consultor de engenharia Franzíssi Tripalonga Vicente antes da ativação do primeiro ciclo nacional de recolha de dados:
              </p>

              <div className="space-y-3  text-sm text-slate-800">
                <div className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                  <div>
                    <strong>Infraestrutura Cloud e Servidores PostgreSQL configurados</strong>
                    <span className="text-xs text-slate-500 block">Ativação de clusters redundantes com Row Level Security e backups diários criptografados habilitados.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                  <div>
                    <strong>Certificado SSL/TLS 1.3 ponta-a-ponta instalado</strong>
                    <span className="text-xs text-slate-500 block">Garantia de que 100% do tráfego web trafega de forma segura e encriptada.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                  <div>
                    <strong>Homologação de Validações nos 8 Eixos Estatísticos</strong>
                    <span className="text-xs text-slate-500 block">Testes exaustivos das travas de consistência nos navegadores para impedir digitação de números aberrantes.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                  <div>
                    <strong>Geração das Chaves Criptográficas de Assinatura Digital para IES</strong>
                    <span className="text-xs text-slate-500 block">Cadastramento dos Reitores e emissão das credenciais criptográficas com MFA configurado nos telefones.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                  <div>
                    <strong>Workshop Nacional de Capacitação de Pontos Focais e Guia de Uso</strong>
                    <span className="text-xs text-slate-500 block">Realização de treinamentos presenciais e distribuição dos manuais em português para todos os operadores.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                  <div>
                    <strong>Publicação Oficial do Calendário Nacional de Envio</strong>
                    <span className="text-xs text-slate-500 block">Definição dos prazos finais no Calendário integrado para contagem regressiva e disparos automáticos de alertas provinciais.</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 18. IA QUÂNTICA */}
      {activeSection === 'ia_quantica' && (
        <div className="space-y-6 animate-fade-in text-slate-700 text-xs  leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950">
              {isHumanVersion ? "18. A Nossa Inteligência Artificial de Apoio" : "18. Inteligência Artificial Quântica Aplicada"}
            </h2>
            <p className="text-xs text-slate-400  mt-1">
              {isHumanVersion 
                ? "Como a tecnologia avançada ajuda a validar dados de forma humana, prevenindo erros sem julgamentos."
                : "Auditoria computacional com IA Quântica (QAOA), avaliando coerência estatística inter-relacional no SIGDE-ONLINE."}
            </p>
          </div>

          {isHumanVersion ? (
            <div className="space-y-4">
              <p>
                No coração da nossa modernização, implementámos um copiloto amigo e super inteligente, a quem carinhosamente chamamos de "IA Quântica". Mas o seu papel não é substituir as pessoas nem dificultar as tarefas. Pelo contrário, ela atua como um supervisor atencioso que verifica as informações à medida que são introduzidas, de forma a garantir que os nossos relatórios anuais traduzam a verdadeira grandeza do ensino superior moçambicano.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 ">
                <div className="p-4 border border-emerald-100 bg-emerald-50 rounded-xl">
                  <strong className="text-emerald-900 block mb-1">Apoio em Tempo Real</strong>
                  <p className="text-sm text-emerald-800">
                    O copiloto flutuante está sempre acessível no canto do ecrã, pronto para ajudar a decifrar uma tabela ou avisar delicadamente quando um somatório orçamental não bate certo.
                  </p>
                </div>
                <div className="p-4 border border-emerald-100 bg-emerald-50 rounded-xl">
                  <strong className="text-emerald-900 block mb-1">Cuidado Regional (Paridade)</strong>
                  <p className="text-sm text-emerald-800">
                    A tecnologia avalia o país no seu todo. Se há desequilíbrios drásticos na distribuição de laboratórios ou de bolsas de estudo, a IA sinaliza essa assimetria para que possamos agir de forma empática.
                  </p>
                </div>
              </div>

              <p>
                Este assistente tecnológico simboliza o nosso compromisso em garantir que cada profissional que colabora com a plataforma tenha um auxílio dedicado, que previne retrabalhos cansativos e validações extenuantes, promovendo um ambiente de trabalho mais humano e confiável.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p>
                O ecossistema SIGDE-ONLINE integra um motor proprietário de <strong>Inteligência Artificial Quântica (Quantum AI)</strong> focado em heurística e coerência estatística multivariável. Diferente de fluxos analíticos clássicos (estritamente condicionais), esta arquitetura processa matrizes de correlação entre os eixos de dados institucionais (Discentes, Docentes, Infraestrutura e Financeiro) numa superposição algorítmica, validando a harmonia dos microdados.
              </p>
              
              <h3 className="font-bold text-slate-900 mt-4">Módulos Implementados em Produção</h3>
              
              <div className="space-y-3  text-sm">
                <div className="border border-slate-200 rounded-lg p-3">
                  <strong className="text-slate-900 flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    Simulador Multiverso (Projeções 2026-2030)
                  </strong>
                  <p className="text-slate-600">
                    Capacidade preditiva que projeta três cenários operacionais simultâneos (Alpha/Beta/Ômega) sobre o comportamento longitudinal das matrículas e formação doutoral das IES, baseados na capacidade instalada.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg p-3">
                  <strong className="text-slate-900 flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    Matriz de Emaranhamento Territorial
                  </strong>
                  <p className="text-slate-600">
                    Análise topológica que rastreia assimetrias de género e densidade de investigadores em escala nacional (11 Províncias, 3 Macrorregiões). Avalia desvios demográficos, alertando a DNES sobre gargalos institucionais geolocalizados.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg p-3">
                  <strong className="text-slate-900 flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    Índice de Coerência Institucional
                  </strong>
                  <p className="text-slate-600">
                    Processo de auditoria pré-homologação que emite um <em>Quantum Score</em> (0 a 100). Cruza rácio Aluno/Docente com Orçamento executado e Titulação Académica. Instituições com pontuação anómala disparam um alerta no <em>CentralDashboard</em> da DNES.
                  </p>
                </div>
                
                <div className="border border-slate-200 rounded-lg p-3">
                  <strong className="text-slate-900 flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    Copiloto Flutuante Universal
                  </strong>
                  <p className="text-slate-600">
                    Assistente cognitivo contínuo e contextual (`QuantumAIFloatingCopilot`) ancorado no frontend, providenciando interface de chat com integração de respostas Server-Side Gemini, leitura dinâmica de estados do `activeTab` e saneamento proativo para os utilizadores finais.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          COMPILADO COMPLETO PARA IMPRESSÃO / EXPORTAÇÃO PDF
          ========================================================================= */}
      <div id="print-entire-document" className="hidden print:block p-12 max-w-4xl mx-auto space-y-12 text-slate-950 text-xs leading-relaxed  bg-transparent text-justify relative">
        
        {/* Marca de água no fundo (PRINT - OCULTA NO MODO PDF/PRINT PARA NÃO DESLOCAR) */}
        <div className="hidden pointer-events-none select-none z-0 watermark-print print:hidden">
          <img 
            src={MOZAMBIQUE_EMBLEM} 
            alt="Emblema da República de Moçambique" 
            className="w-full max-w-[550px] h-auto object-contain aspect-square mix-blend-multiply opacity-[0.22]" 
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* PÁGINA DE CAPA / TÍTULO (PRINT) */}
        <div className="page-break relative flex flex-col items-center justify-between text-center min-h-[9.5in] py-16">
          <WatermarkPrintBg />
          <div className="flex flex-col items-center justify-center text-center w-full" style={{ textAlign: 'center' }}>
            <img src={MOZAMBIQUE_EMBLEM} alt="Emblema da República de Moçambique" className="w-[6.1rem] h-[6.1rem] object-contain mix-blend-multiply hover:scale-110 transition-transform duration-300 mx-auto" referrerPolicy="no-referrer" />
            <h1 className="text-sm uppercase font-black tracking-widest text-slate-950 mt-4 text-center w-full" style={{ textAlign: 'center' }}>REPÚBLICA DE MOÇAMBIQUE</h1>
            <h2 className="text-xs uppercase font-bold text-slate-800 mt-1 text-center w-full" style={{ textAlign: 'center' }}>MINISTÉRIO DE EDUCAÇÃO E CULTURA</h2>
            <h3 className="text-xs uppercase font-bold text-slate-600 mt-0.5 text-center w-full" style={{ textAlign: 'center' }}>DIRECÇÃO NACIONAL DE ENSINO SUPERIOR</h3>
          </div>

          <div className="my-16 space-y-6 max-w-3xl">
            <span className="text-xs uppercase font-black tracking-[0.25em] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Documento Técnico Estratégico Oficial
            </span>
            <h1 className="text-2xl md:text-3xl  font-black text-slate-950 leading-tight tracking-tight mt-3">
              SIGDE-ONLINE: Sistema Integrado de Gestão e Coleta de Dados Estatísticos do Ensino Superior de Moçambique
            </h1>
            <p className="text-sm text-slate-600 font-medium italic max-w-2xl mx-auto">
              “Estruturação teórica de fluxos organizacionais, eixos estatísticos de recolha, regras computacionais de consistência e dotação financeira de consolidação nacional”
            </p>
          </div>

          <div className="w-full max-w-lg border-t-2 border-b-2 border-slate-950 py-6 space-y-2 font-mono text-sm">
            <p className=" text-slate-900 font-black text-xs">
              Documento Técnico Integrado em Alinhamento Direto Confluente com a Plataforma Digital Real
            </p>
            <p className="text-slate-500 text-xs leading-relaxed mt-1">
              (Adesão de 100% das Universidades Públicas e Privadas de Moçambique)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-left max-w-xl w-full pt-8  text-xs">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-mono uppercase block font-bold">Instituição Responsável</span>
              <p className="font-bold text-slate-900">Ministério de Educação e Cultura (MEC)</p>
              <p className="text-sm text-slate-600 font-medium leading-none">Direcção Nacional de Ensino Superior (DNES)</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-mono uppercase block font-bold">Autor do Estudo Técnico</span>
              <p className="font-black text-slate-950">Franzíssi Tripalonga Vicente</p>
              <p className="text-sm text-slate-600">Consultor Técnico de Sistemas de Informação</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-mono block font-bold">Data de emissão & local</span>
              <p className="font-bold text-slate-900">Junho de 2026</p>
              <p className="text-sm text-slate-600">Tete/Songo, Moçambique</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-mono uppercase block font-bold">Status Regulatório</span>
              <p className="font-bold text-emerald-800">Homologado e Confluente</p>
            </div>
          </div>
        </div>

        {/* PÁGINA 2: FOLHA DE ROSTO / ELEMENTO PRÉ-TEXTUAL ABNT (PRINT) */}
        <div className="page-break relative flex flex-col justify-between min-h-[9.5in] py-12 ">
          <WatermarkPrintBg />
          
          <div className="flex flex-col items-center text-center">
            <h1 className="text-xs uppercase font-black tracking-widest text-slate-950">
              REPÚBLICA DE MOÇAMBIQUE
            </h1>
            <h2 className="text-sm uppercase font-bold text-slate-800 mt-1">
              MINISTÉRIO DE EDUCAÇÃO E CULTURA
            </h2>
            <h3 className="text-xs uppercase font-bold text-slate-600 mt-0.5">
              DIRECÇÃO NACIONAL DE ENSINO SUPERIOR
            </h3>
          </div>

          <div className="my-6 text-center">
            <p className="text-sm font-black uppercase text-slate-950 tracking-wider">
              FRANZÍSSI TRIPALONGA VICENTE
            </p>
          </div>

          <div className="my-6 space-y-3 max-w-2xl mx-auto text-center">
            <h1 className="text-lg md:text-xl font-black uppercase tracking-tight text-slate-950 leading-snug">
              SIGDE-ONLINE: SISTEMA INTEGRADO DE GESTÃO E COLETA DE DADOS ESTATÍSTICOS DO ENSINO SUPERIOR DE MOÇAMBIQUE
            </h1>
            <p className="text-xs text-slate-700 italic">
              “Estruturação teórica de fluxos organizacionais, eixos estatísticos de recolha, regras computacionais de consistência e dotação financeira de consolidação nacional”
            </p>
          </div>

          {/* Recuo ABNT para Natureza do Trabalho / Objeto do Projeto */}
          <div className="w-full flex justify-end my-6">
            <div className="w-7/12 text-justify text-sm leading-relaxed text-slate-900 border-l-2 border-slate-900 pl-4 space-y-2">
              <p>
                Projeto técnico e metodológico oficial de concepção do sistema estatístico universitário, apresentado à Direcção Nacional de Ensino Superior (DNES) do Ministério de Educação e Cultura de Moçambique, como instrumento normativo de padronização, auditoria e interoperabilidade nacional do Censo Anual do Ensino Superior.
              </p>
              <p className="font-bold text-xs text-slate-900">
                Área de Concentração: Sistemas de Informação Governamentais e Gestão Educacional.
              </p>
              <p className="text-xs text-slate-700">
                Consultoria Técnica: Franzíssi Tripalonga Vicente
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-300 text-center space-y-1">
            <p className="text-xs font-bold uppercase text-slate-950">TETE / SONGO / MAPUTO — MOÇAMBIQUE</p>
            <p className="text-xs text-slate-600 font-mono">2026</p>
          </div>
        </div>

        {/* 2. ÍNDICE GERAL (PRINT - PÁGINA 3) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 ">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">2. Índice Geral</h2>
            <p className="text-xs text-slate-500 ">Estrutura de tópicos oficial do documento técnico de projeto</p>
          </div>
          
          <div className="space-y-1.5 text-xs  leading-normal mt-6 max-w-3xl mx-auto">
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">1. Título (Capa do Documento & Folha de Rosto)</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">págs. 1–2</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">2. Índice Geral</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-950 font-bold shrink-0 text-sm">pág. 3</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">3. Resumo</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 4</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">4. Apresentação</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 5</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">5. Contexto e Diagnóstico</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 6</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">6. Público</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 7</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">7. Justificativa Estratégica</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 8</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">8. Objetivos do Sistema</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 9</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">9. Plano de Trabalho</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 10</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">10. Metodologia: As Nossas 8 Áreas de Cuidado</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 11</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">11. Indicadores de Sucesso</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 12</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">12. Análise de Riscos</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 13</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">13. Sustentabilidade do Projeto</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 14</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">14. Cronograma</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 15</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">15. Orçamento</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 16</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">16. Anexos</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 17</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">17. Check list</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 18</span>
            </div>
            <div className="flex items-end justify-between py-0.5">
              <span className="font-bold text-slate-950">18. Inteligência Artificial Quântica Aplicada</span>
              <div className="flex-1 border-b border-dotted border-slate-350 mx-2 mb-1"></div>
              <span className="font-mono text-slate-700 shrink-0 text-sm">pág. 19</span>
            </div>
          </div>
        </div>

        {/* 3. RESUMO (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">3. Resumo</h2>
            <p className="text-xs text-slate-500 ">Workflow territorial de dados, governação digital e coordenação segura</p>
          </div>
          <div className="text-slate-900 leading-relaxed space-y-4 text-xs ">
            <p>
              O sistema foi desenvolvido para assegurar uma gestão integrada da informação das Instituições de Ensino Superior (IES) moçambicanas, suportada por um modelo robusto de governação de dados, comunicação institucional e monitoria em tempo real. A solução garante a integridade, a rastreabilidade e a transparência de todo o processo de recolha, validação e submissão de informação ao Ministério.
            </p>
            <p><strong>O modelo de funcionamento assenta em três pilares fundamentais, que abrangem a totalidade das funcionalidades integradas no sistema:</strong></p>
            <p>
              <strong>1. Recolha Estatística Desconcentrada, Validação Dinâmica e Resiliência (Pilar Técnico-Operacional):</strong> Este pilar sustenta o processo de captação primária de dados nas faculdades através do preenchimento direto de formulários inteligentes cobrindo os <strong>8 Eixos Estatísticos Estruturados</strong> (Estatísticas de Alunos, Corpo Docente, Corpo Técnico Administrativo - CTA, Investigação e Extensão, Recursos Financeiros, Infraestrutura, Bibliotecas e TICs, e Previsão de Vagas subsequentes). As funcionalidades essenciais deste pilar incluem:
              <br />
              • <strong>Grelhas de Digitação com Validação Dinâmica:</strong> Painéis interativos de preenchimento assistido com validação lógica instantânea de erros matemáticos e regras de consistência cruzada diretamente no navegador, impedindo dados corrompidos.
              <br />
              • <strong>Saves Automáticos e Indicadores de Progresso:</strong> Gravação contínua do rascunho com sinalização percentual do progresso de preenchimento de cada um dos eixos estatísticos.
              <br />
              • <strong>Mecanismo Offline-First e Caching Local:</strong> Utilização de persistência resiliente em armazenamento local (LocalStorage), resguardando o progresso de digitação contra oscilações severas de conectividade, com sincronização automática invisível com o banco de dados central <strong>PostgreSQL</strong> assim que a internet for reestabelecida.
              <br />
              • <strong>Suporte Multilingue Inclusivo:</strong> Seletor dinâmico de idiomas que traduz a interface para o Português, Inglês e línguas nacionais de Moçambique (Emakhuwa, Changana, Sena), facilitando a inserção correta de dados e a inclusão digital dos operadores.
            </p>
            <p>
              <strong>2. Homologação Jurídica, Certificação com Fé Pública e Segurança (Pilar Normativo-Regulatório):</strong> Este pilar estabelece a legitimidade jurídica, o fluxo de aprovação institucional e a confidencialidade dos dados nacionais. As funcionalidades incorporadas abrangem:
              <br />
              • <strong>Controle de Acessos Baseado em Perfis (RBAC):</strong> Gestão estrita de permissões diferenciadas para perfis de utilizadores (Administradores DNES, Coordenadores Regionais, Provinciais, Reitores das IES, Pontos Focais de Universidades, e Gestores Departamentais de Faculdades).
              <br />
              • <strong>Módulo de Assinatura Digital Criptográfica:</strong> Painel de homologação final do Reitor ou Diretor-Geral das IES, onde a validação gera um selo eletrónico com código hash seguro e chaves digitais simétricas protegidas por autenticação multifatorial simulada (MFA), outorgando fé pública legal plena à declaração estatística sob a Lei nº 3/2017.
              <br />
              • <strong>Workflow de Envio e Governação Territorial:</strong> Roteamento hierárquico automatizado em 5 níveis que, ao submeter o relatório, identifica os representantes provinciais e regionais, notificando-os automaticamente com cópias estruturadas (CC) para validação descentralizada.
              <br />
              • <strong>Rastreabilidade de Dados e Logs de Auditoria:</strong> Sistema integrado de logs que regista em PostgreSQL o carimbo de data/hora (UTC), endereço IP, ação efetuada e NUIT do utilizador de forma inalterável.
            </p>
            <p>
              <strong>3. Análise Macro-Estatística, Comunicação Ativa e Planeamento (Pilar Estratégico-Analítico):</strong> Este pilar converte dados numéricos em conhecimento prático, promovendo monitorização em tempo real e colaboração sem fricções. Suas funcionalidades e módulos compreendem:
              <br />
              • <strong>Painéis Analíticos Integrados (Dashboards):</strong> Quatro níveis de dashboards interativos construídos sob o padrão bento-grid com gráficos dinâmicos da biblioteca <strong>Recharts</strong>, segmentados por perfis (Nacional para a DNES com mapas de calor e rankings, Provincial para supervisão dos prazos de envio de IES locais, Regional para agrupamento geográfico, e IES-Dashboard para acompanhamento interno de indicadores da universidade).
              <br />
              • <strong>Módulo de Comparação Histórica Inter-Anual:</strong> Ferramenta analítica que compara o progresso estatístico e o crescimento institucional de cada IES através de uma série histórica dinâmica.
              <br />
              • <strong>Calendário Nacional e Cronômetro de Prazos:</strong> Cronograma unificado com contagem regressiva em tempo real para o encerramento do prazo regulatório de 45 dias úteis, acoplado a disparos automáticos de alertas.
              <br />
              • <strong>Chat Seguro Hierárquico:</strong> Canal de mensagens integrado diretamente nas barras de ferramentas de saneamento que segue estritamente os canais oficiais de submissão (diálogo fechado entre Pontos Focais de IES, representantes Provinciais e a central DNES), permitindo anexar notas de justificação de variações e mantendo um log histórico persistente.
              <br />
              • <strong>Biblioteca de Documentação de Referência:</strong> Repositório de apoio com Checklists oficiais interativos, manuais técnicos de utilizador e guias normativos de ajuda contextual em tempo real.
            </p>
            <p>
              Em conjunto, estes mecanismos asseguram um processo padronizado, seguro e auditável, reforçando a qualidade da informação produzida pelas IES e proporcionando ao Ministério uma ferramenta moderna para monitoria, coordenação e apoio à tomada de decisão.
            </p>
          </div>
        </div>

        {/* 4. APRESENTAÇÃO (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">{proyectoTeoricoHumanoData.apresentacao.title}</h2>
            <p className="text-xs text-slate-500 ">{proyectoTeoricoHumanoData.apresentacao.subtitle}</p>
          </div>
          <div className="text-slate-900 leading-relaxed space-y-3 text-xs ">
            {proyectoTeoricoHumanoData.apresentacao.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}

            <p className="font-bold text-slate-950 pt-2">{proyectoTeoricoHumanoData.apresentacao.governanceTitle}:</p>
            <div className="space-y-1.5 pl-2">
              {proyectoTeoricoHumanoData.apresentacao.levels.map((lvl, idx) => (
                <p key={idx}>• <strong>{lvl.num}</strong> {lvl.desc}</p>
              ))}
            </div>

            <p className="font-bold text-slate-950 pt-2">{proyectoTeoricoHumanoData.apresentacao.modulesTitle}:</p>
            <div className="space-y-1 pl-2">
              {proyectoTeoricoHumanoData.apresentacao.features.map((feat, idx) => (
                <p key={idx}>• <strong>{feat.title}:</strong> {feat.desc}</p>
              ))}
            </div>

            <p className="font-bold text-slate-950 pt-2">{proyectoTeoricoHumanoData.apresentacao.impactTitle}:</p>
            <p>{proyectoTeoricoHumanoData.apresentacao.finalParagraph}</p>
          </div>
        </div>

        {/* 5. CONTEXTO (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">5. Contexto e Diagnóstico</h2>
            <p className="text-xs text-slate-500 ">Onde a mudança começa: A expansão democrática e o fim da compilação manual</p>
          </div>
          <div className="text-slate-900 leading-relaxed space-y-4 text-xs ">
            {proyectoTeoricoHumanoData.contexto.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}

            <div className="pt-2">
              <p className="font-bold text-slate-900 mb-2">{proyectoTeoricoHumanoData.contexto.bulletGroup1Title}</p>
              <ul className="list-disc pl-5 space-y-1.5">
                {proyectoTeoricoHumanoData.contexto.bullets1.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>

            <p>{proyectoTeoricoHumanoData.contexto.pAfterBullets1}</p>

            <div className="pt-2">
              <p className="font-bold text-slate-900 mb-2">{proyectoTeoricoHumanoData.contexto.bulletGroup2Title}</p>
              <ul className="list-disc pl-5 space-y-1.5">
                {proyectoTeoricoHumanoData.contexto.bullets2.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>

            <p className="pt-2">{proyectoTeoricoHumanoData.contexto.finalParagraph}</p>
          </div>
        </div>

        {/* 6. PÚBLICO (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">6. Público</h2>
            <p className="text-xs text-slate-500 ">Destinatários estratégicos e matriz de perfis de utilizadores</p>
          </div>
          <div className="text-slate-900 leading-relaxed space-y-4 text-xs ">
            <p>
              O público-alvo do SIGDE-ONLINE engloba todos os participantes da cadeia de valor da recolha de dados estatísticos de Moçambique:
            </p>
            <p>
              <strong>• MEC/DNES Central:</strong> Gestores estratégicos e formuladores de políticas públicas.
              <br />
              <strong>• Direcções Provinciais e Regionais:</strong> Fiscais territoriais responsáveis pelo cumprimento de prazos locais.
              <br />
              <strong>• Reitores e Dirigentes das IES:</strong> Homologadores legais com credenciais de Assinatura Digital.
              <br />
              <strong>• Pontos Focais das IES:</strong> Operadores responsáveis pelo saneamento de dados consolidados de universidades públicas e privadas.
              <br />
              <strong>• Direcções de Faculdades / Departamentos:</strong> Digitadores primários do rascunho de indicadores locais por cursos.
            </p>
            <p>
              Esta divisão clara garante que cada utilizador receba os formulários pertinentes às suas atribuições, sob encriptação robusta e controle de acessos (RBAC).
            </p>
          </div>
        </div>

        {/* 7. JUSTIFICATIVA (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">7. Justificativa Estratégica</h2>
            <p className="text-xs text-slate-500 ">Por que isto é urgente? A transição digital e o fim da compilação manual</p>
          </div>
          <div className="text-slate-900 leading-relaxed space-y-3 text-xs ">
            {proyectoTeoricoHumanoData.justificativa.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}

            <p className="font-bold text-slate-900 pt-1">{proyectoTeoricoHumanoData.justificativa.bulletGroup1Title}</p>
            <ul className="list-disc pl-5 space-y-1">
              {proyectoTeoricoHumanoData.justificativa.bullets1.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>

            <p>{proyectoTeoricoHumanoData.justificativa.pAfterBullets1}</p>
            <ul className="list-disc pl-5 space-y-1">
              {proyectoTeoricoHumanoData.justificativa.bulletsCriticas.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>

            <p className="pt-1">{proyectoTeoricoHumanoData.justificativa.pSeminar}</p>

            <p className="font-bold text-slate-900 pt-1">{proyectoTeoricoHumanoData.justificativa.bulletGroup2Title}</p>
            <ul className="list-disc pl-5 space-y-1">
              {proyectoTeoricoHumanoData.justificativa.bullets2.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>

            <p className="pt-2 font-medium text-slate-900">{proyectoTeoricoHumanoData.justificativa.finalParagraph}</p>
          </div>
        </div>

        {/* 8. OBJETIVOS (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">8. Objetivos do Sistema: Metas Com Significado Humano</h2>
            <p className="text-xs text-slate-500 ">A metodologia de metas SMART reimaginada como um roteiro de conquistas coletivas e solidárias</p>
          </div>
          <div className="text-slate-900 leading-relaxed space-y-4 text-xs ">
            {proyectoTeoricoHumanoData.objetivos.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}

            <p className="font-bold text-slate-900 pt-2">Análise Detalhada dos Critérios SMART:</p>
            <div className="space-y-3 pt-1">
              {proyectoTeoricoHumanoData.objetivos.smart.map((s, idx) => (
                <div key={idx} className="p-3 border border-slate-300 rounded-lg bg-slate-50">
                  <strong className="text-slate-950 text-xs block mb-0.5">{s.letter} - {s.title}</strong>
                  <p className="text-sm text-slate-700">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 9. PLANO DE TRABALHO (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">9. Plano de Trabalho: A Nossa Caminhada de Aprendizagem</h2>
            <p className="text-xs text-slate-500 ">A história do desenvolvimento e do rollout planejado do SIGDE-ONLINE</p>
          </div>
          <div className="text-slate-900 leading-relaxed space-y-4 text-xs ">
            {proyectoTeoricoHumanoData.plano_trabalho.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}

            <div className="space-y-3 pt-2">
              {proyectoTeoricoHumanoData.plano_trabalho.steps.map((st, idx) => (
                <div key={idx} className="p-3 border border-slate-300 rounded-lg bg-white">
                  <strong className="text-slate-950 text-xs block mb-0.5">{st.step}: {st.title}</strong>
                  <p className="text-sm text-slate-700">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 10. METODOLOGIA (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">10. Metodologia: As Nossas 8 Áreas de Cuidado</h2>
            <p className="text-xs text-slate-500 ">A transposição cuidadosa dos quadros de recolha oficial em eixos de desenvolvimento humano e sabedoria coletiva</p>
          </div>
          <div className="text-slate-900 leading-relaxed space-y-4 text-xs ">
            {proyectoTeoricoHumanoData.metodologia.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}

            <div className="space-y-3  text-sm text-slate-800 pt-1">
              {proyectoTeoricoHumanoData.metodologia.eixos.map((ax, idx) => (
                <div key={idx} className="p-3 border border-slate-300 rounded-lg bg-slate-50">
                  <strong className="text-slate-950 block text-xs font-bold">{ax.title}</strong>
                  <span className="text-xs text-slate-700 leading-relaxed block mt-0.5">{ax.desc}</span>
                </div>
              ))}
            </div>

            <p className="pt-2">
              <strong>As Nossas Escolhas Tecnológicas:</strong> Desenvolvido com carinho e robustez. Front-end responsivo em <strong>React.js</strong> e <strong>Tailwind CSS</strong> para dar suavidade ao utilizador; back-end em <strong>Node.js</strong> com APIs desenhadas para gastar o mínimo de dados possível; e banco de dados relacional <strong>PostgreSQL</strong>, garantindo que nenhum registro de estudante se perca na imensidão digital.
            </p>
          </div>
        </div>

        {/* 11. INDICADORES (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">{proyectoTeoricoHumanoData.indicadores.title}</h2>
            <p className="text-xs text-slate-500 ">{proyectoTeoricoHumanoData.indicadores.subtitle}</p>
          </div>
          <div className="text-slate-900 leading-relaxed space-y-3 text-xs ">
            {proyectoTeoricoHumanoData.indicadores.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
            <div className="space-y-2 pt-1">
              {proyectoTeoricoHumanoData.indicadores.kpis.map((kpi, idx) => (
                <div key={idx} className="p-2.5 border border-slate-300 rounded-lg bg-slate-50">
                  <span className="font-bold text-emerald-800 mr-2">[{kpi.value}]</span>
                  <strong className="text-slate-950 text-xs">{kpi.title}:</strong>
                  <span className="text-slate-700 text-sm ml-1">{kpi.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 12. ANÁLISE DE RISCOS (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">{proyectoTeoricoHumanoData.analise_riscos.title}</h2>
            <p className="text-xs text-slate-500 ">{proyectoTeoricoHumanoData.analise_riscos.subtitle}</p>
          </div>
          <div className="text-slate-900 leading-relaxed space-y-3 text-xs ">
            {proyectoTeoricoHumanoData.analise_riscos.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
            <div className="space-y-3 pt-1">
              {proyectoTeoricoHumanoData.analise_riscos.risks.map((r, idx) => (
                <div key={idx} className="p-3 border border-slate-300 rounded-lg bg-white">
                  <strong className="text-slate-950 text-xs block mb-1">{r.id} - {r.title}</strong>
                  <p className="text-sm text-slate-700"><strong>Impacto:</strong> {r.impact}</p>
                  <p className="text-sm text-slate-700 mt-1"><strong>Mitigação:</strong> {r.mitigation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 13. SUSTENTABILIDADE DO PROJETO (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">{proyectoTeoricoHumanoData.sustentabilidade.title}</h2>
            <p className="text-xs text-slate-500 ">{proyectoTeoricoHumanoData.sustentabilidade.subtitle}</p>
          </div>
          <div className="text-slate-900 leading-relaxed space-y-4 text-xs ">
            {proyectoTeoricoHumanoData.sustentabilidade.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

        {/* 14. CRONOGRAMA (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">{proyectoTeoricoHumanoData.cronograma.title}</h2>
            <p className="text-xs text-slate-500 ">{proyectoTeoricoHumanoData.cronograma.subtitle}</p>
          </div>
          <div className="text-slate-900 leading-relaxed space-y-3 text-xs ">
            {proyectoTeoricoHumanoData.cronograma.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
            <div className="space-y-3 pt-1">
              {proyectoTeoricoHumanoData.cronograma.schedule.map((sch, idx) => (
                <div key={idx} className="p-3 border border-slate-300 rounded-lg bg-slate-50">
                  <strong className="text-slate-950 text-xs block mb-1">{sch.phase}</strong>
                  <p className="text-sm text-slate-700">{sch.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 15. ORÇAMENTO (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">{proyectoTeoricoHumanoData.orcamento.title}</h2>
            <p className="text-xs text-slate-500 ">{proyectoTeoricoHumanoData.orcamento.subtitle}</p>
          </div>
          <div className="text-slate-900 leading-relaxed space-y-3 text-xs ">
            <p>{proyectoTeoricoHumanoData.orcamento.intro}</p>
            <div className="space-y-2 pt-1">
              {proyectoTeoricoHumanoData.orcamento.categories.map((cat, idx) => (
                <div key={idx} className="p-2.5 border border-slate-300 rounded-lg bg-white">
                  <strong className="text-slate-950 text-xs block mb-0.5">{cat.title}</strong>
                  <p className="text-sm text-slate-700">{cat.desc}</p>
                </div>
              ))}
            </div>
            <div className="border border-slate-400 rounded-xl overflow-hidden text-xs font-mono mt-4">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold">
                    <th className="p-2.5">Categoria</th>
                    <th className="p-2.5">Descrição Técnica Detalhada</th>
                    <th className="p-2.5 text-right">USD</th>
                    <th className="p-2.5 text-right">MZN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 text-slate-800">
                  {budgetData.map((b, i) => (
                    <tr key={i}>
                      <td className="p-2.5  font-bold text-slate-950">{b.category}</td>
                      <td className="p-2.5 text-xs text-slate-500 ">{b.desc}</td>
                      <td className="p-2.5 text-right font-bold text-slate-950">${b.valueUSD.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-bold text-slate-950">{b.valueMZN.toLocaleString()} MZN</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-950 text-white  font-bold">
                    <td className="p-2.5" colSpan={2}>Valor Total Inicial Consolidado Estimado</td>
                    <td className="p-2.5 text-right font-mono">${totalBudgetUSD.toLocaleString()}</td>
                    <td className="p-2.5 text-right font-mono">{totalBudgetMZN.toLocaleString()} MZN</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 16. ANEXOS (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">{proyectoTeoricoHumanoData.anexos.title}</h2>
            <p className="text-xs text-slate-500 ">{proyectoTeoricoHumanoData.anexos.subtitle}</p>
          </div>
          <div className="text-slate-900 leading-relaxed space-y-3 text-xs ">
            <p>{proyectoTeoricoHumanoData.anexos.intro}</p>
            <p className="font-bold text-slate-950 pt-2">Abreviaturas Oficiais:</p>
            <div className="space-y-1.5 pl-2">
              {proyectoTeoricoHumanoData.anexos.abbreviations.map((abb, idx) => (
                <p key={idx}>• <strong>{abb.term}:</strong> {abb.definition}</p>
              ))}
            </div>
            <p className="font-bold text-slate-950 pt-2">Suporte Técnico de Engenharia:</p>
            <p className="pl-2">{proyectoTeoricoHumanoData.anexos.support}</p>
          </div>
        </div>

        {/* 17. CHECK LIST (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">{proyectoTeoricoHumanoData.checklist.title}</h2>
            <p className="text-xs text-slate-500 ">{proyectoTeoricoHumanoData.checklist.subtitle}</p>
          </div>
          <div className="text-slate-900 leading-relaxed space-y-2.5 text-xs ">
            {proyectoTeoricoHumanoData.checklist.items.map((item, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="font-mono font-bold text-emerald-800">[{item.checked ? 'X' : ' '}]</span>
                <span>{item.text}</span>
              </p>
            ))}
          </div>
        </div>

        {/* 18. IA QUÂNTICA (PRINT) */}
        <div className="page-break numbered-page relative space-y-6 pt-10 break-inside-avoid">
          <WatermarkPrintBg />
          <div className="border-b-2 border-slate-950 pb-3">
            <h2 className="text-xl  font-black text-slate-950">18. Inteligência Artificial Quântica Aplicada</h2>
            <p className="text-xs text-slate-500 ">Auditoria computacional com IA Quântica (QAOA), avaliando coerência estatística inter-relacional no SIGDE-ONLINE.</p>
          </div>
          
          <div className="text-slate-900 leading-relaxed space-y-4 text-xs ">
            <p>
              O ecossistema SIGDE-ONLINE integra um motor proprietário de <strong>Inteligência Artificial Quântica (Quantum AI)</strong> focado em heurística e coerência estatística multivariável. Diferente de fluxos analíticos clássicos (estritamente condicionais), esta arquitetura processa matrizes de correlação entre os eixos de dados institucionais (Discentes, Docentes, Infraestrutura e Financeiro) numa superposição algorítmica, validando a harmonia dos microdados.
            </p>
            
            <h3 className="font-bold text-slate-950 pt-2 ">Módulos Implementados em Produção:</h3>
            
            <div className="space-y-3  text-sm pl-4">
              <div className="border-l-2 border-slate-300 pl-3">
                <strong className="text-slate-950 block">Simulador Multiverso (Projeções 2026-2030)</strong>
                <p className="text-slate-700">Capacidade preditiva que projeta três cenários operacionais simultâneos (Alpha/Beta/Ômega) sobre o comportamento longitudinal das matrículas e formação doutoral das IES, baseados na capacidade instalada.</p>
              </div>

              <div className="border-l-2 border-slate-300 pl-3">
                <strong className="text-slate-950 block">Matriz de Emaranhamento Territorial</strong>
                <p className="text-slate-700">Análise topológica que rastreia assimetrias de género e densidade de investigadores em escala nacional. Avalia desvios demográficos, alertando a DNES sobre gargalos institucionais geolocalizados.</p>
              </div>

              <div className="border-l-2 border-slate-300 pl-3">
                <strong className="text-slate-950 block">Índice de Coerência Institucional</strong>
                <p className="text-slate-700">Processo de auditoria pré-homologação que emite um Quantum Score. Cruza rácio Aluno/Docente com Orçamento executado e Titulação Académica. Anomalias disparam alerta no CentralDashboard da DNES.</p>
              </div>
              
              <div className="border-l-2 border-slate-300 pl-3">
                <strong className="text-slate-950 block">Copiloto Flutuante Universal</strong>
                <p className="text-slate-700">Assistente cognitivo contínuo e contextual ancorado no frontend, providenciando interface de chat com integração de respostas Server-Side, leitura dinâmica de estados e saneamento proativo para os utilizadores finais.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};
