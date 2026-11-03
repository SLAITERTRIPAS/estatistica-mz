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
import { MOZAMBIQUE_EMBLEM } from '../constants/assets';
import { useLanguage } from '../context/LanguageContext';
import { ProyectoTeoricoContentRenderer } from './ProyectoTeoricoContentRenderer';

interface ProyectoTeoricoProps {
  onBack?: () => void;
  lang?: 'pt' | 'en';
}

export default function ProyectoTeorico({ onBack }: ProyectoTeoricoProps = {}) {
  const { t } = useLanguage();
  const [isHumanVersion, setIsHumanVersion] = useState(false);
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
    
    // Always trigger a direct file download of the complete document
    if (printElement) {
      try {
        const fullDocHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SIGDE-ONLINE - Projeto Teórico Oficial 2026</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 20mm 15mm;
    }
    @page a3 {
      size: A3 landscape;
      margin: 15mm;
    }
    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; color: #0f172a; line-height: 1.7; width: 100%; max-width: 100%; margin: 0 auto; background: #ffffff; box-sizing: border-box; }
    p, article p, li { text-align: justify !important; text-justify: inter-word !important; }
    h1, h2, h3 { color: #0284c7; margin-top: 24px; text-align: center; }
    .page-break { page-break-after: always; break-after: page; margin-bottom: 30px; border-bottom: 2px solid #cbd5e1; padding-bottom: 20px; width: 100%; min-height: 270mm; box-sizing: border-box; }
    table { width: 100% !important; border-collapse: collapse; margin: 20px 0; table-layout: auto; }
    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: justify; }
    th { background: #0f172a; color: white; text-align: center; }
  </style>
</head>
<body>
  ${printElement.innerHTML}
</body>
</html>`;

        const blob = new Blob([fullDocHtml], { type: 'text/html;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SIGDE_ONLINE_PROJETO_TEORICO_2026.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.warn('File download anchor fallback:', err);
      }
    }

    // Try popup window or print fallback
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
                    margin: 20mm 15mm;
                  }
                  @page a3-landscape {
                    size: A3 landscape;
                    margin: 15mm;
                  }
                  body { background: white !important; margin: 0; padding: 0; width: 100% !important; max-width: 100% !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; counter-reset: sectionPage 2; }
                  p, article p, li { text-align: justify !important; text-justify: inter-word !important; }
                  #print-entire-document { display: block !important; width: 100% !important; max-width: 100% !important; margin: 0 auto !important; padding: 0 !important; position: relative; background: transparent !important; box-sizing: border-box !important; }
                  @media print {
                    body { zoom: 1; counter-reset: sectionPage 2; width: 100% !important; max-width: 100% !important; }
                    p, article p, li { text-align: justify !important; text-justify: inter-word !important; }
                    .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
                    .page-break { page-break-after: always; break-after: page; position: relative; width: 100% !important; min-height: 270mm; box-sizing: border-box !important; }
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
    
    // Fallback if popup blocked
    try {
      window.print();
    } catch (e) {
      console.warn("window.print error:", e);
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
          /* Ensure printable document fits and matches reading mode preview identically */
          #print-entire-document {
            display: block !important;
            position: relative;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: transparent !important;
            color: #0b0f19 !important;
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
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
          /* Text Font Size 12pt and Justification for Theoretical Project */
          #print-entire-document,
          #print-entire-document p,
          #print-entire-document li,
          #print-entire-document td,
          .proyecto-teorico-body,
          .proyecto-teorico-body p,
          .proyecto-teorico-body li,
          .proyecto-teorico-body td {
            font-size: 12pt !important;
            line-height: 1.6 !important;
            text-align: justify !important;
            text-justify: inter-word !important;
          }
          /* Titles and Subtitles: 14pt bold */
          #print-entire-document h1,
          #print-entire-document h2,
          #print-entire-document h3,
          #print-entire-document h4,
          #print-entire-document h5,
          .proyecto-teorico-body h1,
          .proyecto-teorico-body h2,
          .proyecto-teorico-body h3,
          .proyecto-teorico-body h4,
          .proyecto-teorico-body h5 {
            font-size: 14pt !important;
            font-weight: bold !important;
          }
          /* Remove moving watermark in PDF/print mode */
          .watermark-print, .page-watermark {
            display: none !important;
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
        <div className="lg:col-span-3 bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 relative min-h-[600px] overflow-hidden proyecto-teorico-body">

          <ProyectoTeoricoContentRenderer 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
            t={t} 
            isHumanVersion={false} 
          />

        </div>

      </div>
    </div>
  );
}
