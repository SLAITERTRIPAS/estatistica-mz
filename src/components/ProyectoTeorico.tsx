import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Download, 
  Award, 
  ChevronRight, 
  Landmark, 
  ShieldCheck, 
  Layers, 
  DollarSign, 
  Calendar, 
  Compass, 
  Scale, 
  TrendingUp,
  AlertCircle,
  Users,
  Briefcase,
  HelpCircle,
  FileCheck2,
  List,
  CheckCircle,
  PieChart,
  Database,
  Cpu,
  Globe,
  X,
  ExternalLink
} from 'lucide-react';
import { SYSTEM_LOGO } from '../constants/assets';
import { useLanguage } from '../context/LanguageContext';
import { ProyectoTeoricoContentRenderer } from './ProyectoTeoricoContentRenderer';

interface ProyectoTeoricoProps {
  onBack?: () => void;
  lang?: 'pt' | 'en';
}

export default function ProyectoTeorico({ onBack }: ProyectoTeoricoProps = {}) {
  const { t } = useLanguage();
  const [isHumanVersion, setIsHumanVersion] = useState(true);
  const [activeSection, setActiveSection] = useState<
    | 'capa'
    | 'indice'
    | 'resumo'
    | 'apresentacao'
    | 'contexto'
    | 'publico'
    | 'justificativa'
    | 'objetivos'
    | 'plano_trabalho'
    | 'metodologia'
    | 'indicadores'
    | 'analise_riscos'
    | 'sustentabilidade'
    | 'cronograma'
    | 'orcamento'
    | 'anexos'
    | 'checklist'
    | 'ia_quantica'
  >('capa');

  const sections = [
    { id: 'capa', title: '1. Título', icon: Award },
    { id: 'indice', title: '2. Índice Geral', icon: List },
    { id: 'resumo', title: '3. Resumo', icon: FileText },
    { id: 'apresentacao', title: '4. Apresentação', icon: Landmark },
    { id: 'contexto', title: '5. Contexto', icon: Globe },
    { id: 'publico', title: '6. Público', icon: Users },
    { id: 'justificativa', title: '7. Justificativa', icon: Scale },
    { id: 'objetivos', title: '8. Objetivos', icon: Compass },
    { id: 'plano_trabalho', title: '9. Plano de trabalho', icon: Briefcase },
    { id: 'metodologia', title: '10. Metodologia', icon: Layers },
    { id: 'indicadores', title: '11. Indicadores', icon: PieChart },
    { id: 'analise_riscos', title: '12. Análise de riscos', icon: AlertCircle },
    { id: 'sustentabilidade', title: '13. Sustentabilidade do projeto', icon: TrendingUp },
    { id: 'cronograma', title: '14. Cronograma', icon: Calendar },
    { id: 'orcamento', title: '15. Orçamento', icon: DollarSign },
    { id: 'anexos', title: '16. Anexos', icon: FileText },
    { id: 'checklist', title: '17. Check list', icon: CheckCircle },
    { id: 'ia_quantica', title: '18. IA Quântica Aplicada', icon: Cpu }
  ] as const;

  const [showIframeAlert, setShowIframeAlert] = useState(false);

  const handlePrintOrDownload = () => {
    const printElement = document.getElementById('print-entire-document');
    
    if (printElement) {
      try {
        const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
          .map(tag => tag.outerHTML)
          .join('\n');
          
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Documento SIGDE - PDF</title>
                ${styles}
                <style>
                  @page {
                    size: A4 portrait;
                    margin: 3cm 2cm 2cm 3cm;
                    margin-top: 3cm;
                    margin-right: 2cm;
                    margin-bottom: 2cm;
                    margin-left: 3cm;
                  }
                  body { background: white !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; counter-reset: sectionPage 2; }
                  #print-entire-document { display: block !important; width: 100% !important; max-width: 160mm !important; margin: 0 auto !important; padding: 0 !important; position: relative; background: transparent !important; }
                  @media print {
                    body { zoom: 0.95; counter-reset: sectionPage 2; }
                    .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
                    .cover-page { min-height: 240mm !important; justify-content: center !important; }
                    .page-break { page-break-after: always; break-after: page; position: relative; width: 100%; min-height: 235mm; box-sizing: border-box; }
                    .numbered-page { counter-increment: sectionPage; position: relative; padding-bottom: 12mm; }
                    .numbered-page::after {
                      content: "06/09/26, 20:03/Documento SIGDE - Página " counter(sectionPage);
                      position: absolute;
                      bottom: 0;
                      left: 50%;
                      transform: translateX(-50%);
                      text-align: center;
                      font-size: 8pt;
                      font-family: monospace;
                      color: #000000;
                      white-space: nowrap;
                    }
                    .watermark-print { 
                      position: fixed !important; 
                      top: 50% !important; 
                      left: 50% !important; 
                      transform: translate(-50%, -50%) !important; 
                      width: 416px !important;
                      height: 416px !important;
                      max-width: 85% !important;
                      opacity: 0.22 !important; 
                      z-index: 0 !important; 
                      pointer-events: none !important; 
                      display: flex !important; 
                      align-items: center !important;
                      justify-content: center !important;
                    }
                    .watermark-print img { 
                      width: 100% !important;
                      height: 100% !important;
                      object-fit: contain !important;
                      mix-blend-mode: multiply !important; 
                      -webkit-print-color-adjust: exact !important; 
                      print-color-adjust: exact !important; 
                    }
                    .page-watermark {
                      position: absolute !important;
                      top: 50% !important;
                      left: 50% !important;
                      transform: translate(-50%, -50%) !important;
                      width: 384px !important;
                      height: 384px !important;
                      max-width: 85% !important;
                      opacity: 0.22 !important;
                      pointer-events: none !important;
                      z-index: 0 !important;
                      display: flex !important;
                      align-items: center !important;
                      justify-content: center !important;
                    }
                    .page-watermark img {
                      width: 100% !important;
                      height: 100% !important;
                      object-fit: contain !important;
                      mix-blend-mode: multiply !important;
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                    }
                  }
                </style>
              </head>
              <body>
                ${printElement.outerHTML}
                <script>
                  window.onload = function() {
                    setTimeout(() => {
                      window.print();
                    }, 500);
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
          return;
        }
      } catch (e) {
        console.warn("Could not open print window:", e);
      }
    }
    
    // Fallback if popup blocked or element not found
    if (window !== window.top) {
      setShowIframeAlert(true);
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-justify">
      {/* Iframe Modal Alert */}
      {showIframeAlert && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-slate-200 relative animate-bounce" style={{ animation: "bounce 0.3s ease-out forwards" }}>
            <button 
              onClick={() => setShowIframeAlert(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 ">Ação bloqueada na Pré-visualização</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Para imprimir ou descarregar o PDF, precisa de abrir a aplicação num novo separador. O modo de pré-visualização bloqueia a funcionalidade de impressão.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 font-medium border border-slate-100 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  Clique no ícone "Open in new tab" no canto superior direito do ecrã.
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowIframeAlert(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-all"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center no-print">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer mb-2 border border-slate-300 shadow-xs"
          >
            {t('back')}
          </button>
        )}
      </div>
      
      {/* Printable CSS override */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          /* Hide non-printable app components */
          #side-navigation-panel,
          #master-upper-header,
          .no-print,
          button,
          aside {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 3cm 2cm 2cm 3cm;
            margin-top: 3cm;
            margin-right: 2cm;
            margin-bottom: 2cm;
            margin-left: 3cm;
          }
          /* Ensure main scrolling container doesn't scroll/clip */
          #main-scrolling-workspace {
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }
          /* Ensure printable document fits and displays with ABNT width (160mm) */
          #print-entire-document {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 160mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: transparent !important;
            color: #0b0f19 !important;
            font-family: Georgia, Cambria, "Times New Roman", Times, serif;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
            position: relative;
            width: 100%;
            min-height: 235mm;
            box-sizing: border-box;
          }
          /* Pagination Logic */
          body { counter-reset: sectionPage 2; }
          .numbered-page { 
            counter-increment: sectionPage; 
            position: relative;
            padding-bottom: 12mm;
          }
          .numbered-page::after {
            content: "06/09/26, 20:03/Documento SIGDE - Página " counter(sectionPage);
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            font-size: 8pt;
            font-family: monospace;
            color: #000000;
            white-space: nowrap;
          }
          .watermark-print {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 416px !important;
            height: 416px !important;
            max-width: 85% !important;
            opacity: 0.22 !important;
            z-index: 0 !important;
            pointer-events: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .watermark-print img {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            mix-blend-mode: multiply !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .page-watermark {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 384px !important;
            height: 384px !important;
            max-width: 85% !important;
            opacity: 0.22 !important;
            pointer-events: none !important;
            z-index: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .page-watermark img {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            mix-blend-mode: multiply !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print border border-emerald-900">
        <div className="space-y-1">
          <h2 className="text-2xl font-black  tracking-tight flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-emerald-400" /> Projeto Teórico de Implementação (SIGDE- ONLINE)
          </h2>
          <p className="text-slate-300 text-xs  leading-relaxed max-w-3xl">
            Documento metodológico completo para modernização estatística, dotação financeira, fluxo organizacional de consistência lógica e consolidação do Ensino Superior em Moçambique.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={handlePrintOrDownload}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all rounded-xl text-xs font-black shadow-[3px_3px_0px_rgba(0,0,0,1)] text-white border-2 border-black cursor-pointer "
          >
            <Download className="h-4 w-4 text-white" /> 
            Descarregar PDF Oficial
          </button>
          <button
            onClick={handlePrintOrDownload}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all rounded-xl text-xs font-black shadow-[3px_3px_0px_rgba(0,0,0,1)] text-white border-2 border-slate-600 cursor-pointer "
          >
            <FileText className="h-4 w-4 text-emerald-400" /> Imprimir Documento (Físico/PDF)
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Navigation Rail (Left) */}
        <div className="lg:col-span-1 space-y-2 no-print w-full overflow-hidden">
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">
              Capítulos do Documento
            </h3>
            <div className="space-y-1">
              {sections.map((section) => {
                const IconComponent = section.icon;
                const isSelected = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    id={`btn-sec-${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`shrink-0 w-[240px] lg:w-full snap-start flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all text-xs  cursor-pointer ${
                      isSelected
                        ? 'bg-slate-950 text-white font-black shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <IconComponent className={`h-4 w-4 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="truncate">{section.title}</span>
                    {isSelected && <ChevronRight className="h-3.5 w-3.5 ml-auto text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-450 space-y-2.5 px-3">
            <div>
              <strong className="text-slate-500 uppercase font-mono text-xs block">Dono do Projeto</strong>
              <p className="text-slate-700 font-bold leading-tight">Direção Nacional de Ensino Superior (DNES)</p>
            </div>
            <div>
              <strong className="text-slate-500 uppercase font-mono text-xs block">Responsável Técnico</strong>
              <p className="text-slate-700 font-bold leading-tight">Franzíssi Tripalonga Vicente</p>
            </div>
            <div>
              <strong className="text-slate-500 uppercase font-mono text-xs block">E-mail</strong>
              <p className="text-slate-700 font-mono font-medium select-all">fttripas@gmail.com</p>
            </div>
            <div>
              <strong className="text-slate-500 font-mono text-xs block">Contacto</strong>
              <p className="text-slate-700 font-medium select-all">+258849547771 / 827520137</p>
              <p className="text-slate-500 text-xs">Tete/Songo, Moçambique</p>
            </div>
            <div>
              <strong className="text-slate-500 uppercase font-mono text-xs block">Status do Estudo</strong>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-black bg-emerald-100 text-emerald-800 mt-1">HOMOLOGADO E INTEGRADO</span>
            </div>
          </div>
        </div>

        {/* Content Viewer (Right) */}
        <div className="lg:col-span-3 bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 relative min-h-[600px] overflow-hidden group/watermark">
          
          {/* Subtle logo background watermark - becomes more visible on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] group-hover/watermark:opacity-[0.15] transition-opacity duration-500 pointer-events-none select-none">
            <img src={SYSTEM_LOGO} alt="Logotipo do Sistema" className="w-full max-w-[430px] h-auto object-contain aspect-square mix-blend-multiply" />
          </div>

          {/* Version Switcher */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4 mb-5 no-print relative z-10">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-widest block font-bold">Modo de Leitura do Documento</span>
              <p className="text-sm text-slate-600  italic">
                {isHumanVersion ? '❤️ Visualizando a Versão Mais Humana e Empática' : '🏛️ Visualizando a Versão Técnica e Metodológica'}
              </p>
            </div>
            <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200">
              <button
                onClick={() => setIsHumanVersion(false)}
                className={`px-3 py-1.5 rounded-lg text-xs  font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  !isHumanVersion
                    ? 'bg-slate-950 text-white shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-850'
                }`}
              >
                🏛️ Técnica Oficial
              </button>
              <button
                onClick={() => setIsHumanVersion(true)}
                className={`px-3 py-1.5 rounded-lg text-xs  font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isHumanVersion
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-850'
                }`}
              >
                ❤️ Versão Mais Humana
              </button>
            </div>
          </div>

          <ProyectoTeoricoContentRenderer 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
            t={t} 
            isHumanVersion={isHumanVersion} 
          />

        </div>

      </div>
    </div>
  );
}
