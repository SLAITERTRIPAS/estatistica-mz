import React, { useState, useEffect } from 'react';
import { STANDARD_DOCUMENTS } from '../data';
import { FileText, Download, CheckCircle, HelpCircle, FileSpreadsheet, Upload, Trash2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface CustomFile {
  name: string;
  size: string;
  type: string;
  uploadDate: string;
  content: string;
}

export default function StandardDocuments() {
  const [customFiles, setCustomFiles] = useState<{ [key: string]: CustomFile }>({});
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Load custom files on mount
  useEffect(() => {
    const stored = localStorage.getItem('sys_custom_docs');
    if (stored) {
      try {
        setCustomFiles(JSON.parse(stored));
      } catch (e) {
        console.error('Erro ao ler modelos customizados:', e);
      }
    }
  }, []);

  const handleFileUpload = (docId: string, file: File) => {
    // Restrict type checks
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['xls', 'xlsx', 'doc', 'docx', 'pdf'];
    
    if (!ext || !allowedExtensions.includes(ext)) {
      alert("Formato inválido! Apenas ficheiros Excel (.xls, .xlsx), Word (.doc, .docx) ou PDF (.pdf) são homologados como modelos.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("O ficheiro é muito grande. O limite máximo para modelos do sistema é de 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Content = e.target?.result as string;
      const updated = {
        ...customFiles,
        [docId]: {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          type: file.type,
          uploadDate: new Date().toLocaleDateString('pt-PT'),
          content: base64Content
        }
      };
      setCustomFiles(updated);
      localStorage.setItem('sys_custom_docs', JSON.stringify(updated));
      alert(`Documento "${file.name}" carregado e aplicado com êxito como modelo operacional do sistema.`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomFile = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Deseja realmente repor o modelo padrão oficial (Original MEC) e remover este ficheiro?")) {
      const updated = { ...customFiles };
      delete updated[docId];
      setCustomFiles(updated);
      localStorage.setItem('sys_custom_docs', JSON.stringify(updated));
    }
  };

  const handleDownload = (doc: typeof STANDARD_DOCUMENTS[0]) => {
    const custom = customFiles[doc.id];
    if (custom && custom.content) {
      const link = document.createElement("a");
      link.href = custom.content;
      link.download = custom.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Create a mock original file matching the name which download succeeds with
      const dummyContent = `MEC Moçambique - Modelo Oficial ${doc.category}\nDocumento Original: ${doc.title}\nID do Sistema: ${doc.id}\nData de Emissão: ${doc.lastUpdated}`;
      const blob = new Blob([dummyContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const ext = doc.title.includes('Excel') ? 'xlsx' : doc.title.includes('Manual') ? 'pdf' : 'docx';
      link.href = url;
      link.download = `${doc.title.toLowerCase().replace(/\s+/g, '_')}_oficial.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const getDocIcon = (docTitle: string, customFile?: CustomFile) => {
    const name = (customFile?.name || docTitle).toLowerCase();
    if (name.includes('xls') || name.includes('tabela') || name.includes('quadro')) {
      return <FileSpreadsheet className="h-8 w-8 text-emerald-600" />;
    }
    if (name.includes('doc') || name.includes('word') || name.includes('guião')) {
      return <FileText className="h-8 w-8 text-indigo-600" />;
    }
    return <FileText className="h-8 w-8 text-teal-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-md">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" /> Documentos e Modelos Padrão
        </h2>
        <p className="mt-2 text-emerald-100 max-w-2xl text-sm">
          Aceda e transfira os modelos homologados para a recolha estatística nacional. Pode também carregar ficheiros Excel, Word e PDF personalizados para substituir os formulários e modelos padrão vigentes em todo o sistema.
        </p>
      </div>

      <div className="bg-white border-2 border-black rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-slate-50/50">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-indigo-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-slate-800">Estado da Parametrização de Modelos:</span>
            <p className="text-slate-500">
              Atualmente {Object.keys(customFiles).length} modelos personalizados foram carregados pelas reitorias e aplicados no ecossistema SIGDE- ONLINE. Os restantes utilizam os modelos oficiais de fábrica.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STANDARD_DOCUMENTS.map((doc, index) => {
          const custom = customFiles[doc.id];
          const hasCustom = !!custom;
          const isDragOver = dragOverId === doc.id;

          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={doc.id}
              id={doc.id}
              className={`bg-white border-2 rounded-2xl p-5 transition-all flex flex-col justify-between ${
                hasCustom 
                  ? 'border-indigo-600 shadow-[5px_5px_0px_rgba(79,70,229,0.15)] bg-indigo-50/5' 
                  : 'border-slate-250 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] hover:border-black'
              } ${isDragOver ? 'border-dashed border-emerald-500 bg-emerald-50/20 scale-[1.01]' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverId(doc.id);
              }}
              onDragLeave={() => setDragOverId(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverId(null);
                const file = e.dataTransfer.files[0];
                if (file) handleFileUpload(doc.id, file);
              }}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-black uppercase tracking-wider ${
                    doc.category === 'Estudantes' ? 'bg-blue-105 text-blue-900 border border-blue-200' :
                    doc.category === 'Docentes' ? 'bg-purple-105 text-purple-900 border border-purple-200' :
                    doc.category === 'Infraestrutura' ? 'bg-amber-105 text-amber-900 border border-amber-200' :
                    'bg-emerald-105 text-emerald-900 border border-emerald-200'
                  }`}>
                    {doc.category}
                  </span>
                  <span className="text-xs text-gray-400 font-mono font-bold">ID: {doc.id}</span>
                </div>
                
                <div className="flex gap-3 items-start my-1.5">
                  <div className="p-2.5 bg-slate-100 rounded-xl flex-shrink-0 border border-slate-200">
                    {getDocIcon(doc.title, custom)}
                  </div>
                  <div>
                    <h3 className="text-sm  font-black text-slate-900 leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>
                </div>

                {/* Upload drag dropzone placeholder */}
                <div className="mt-4">
                  <label className="block w-full cursor-pointer group">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".xls,.xlsx,.doc,.docx,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(doc.id, file);
                      }}
                    />
                    <div className="py-3 px-4 border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl bg-slate-50/50 hover:bg-white text-center transition-all flex items-center justify-center gap-2">
                      <Upload className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-900">
                        {hasCustom ? 'Carregar outro ficheiro para substituir (Excel, PDF, Word)' : 'Clique aqui ou arraste ficheiro Excel, Word ou PDF para aplicar no sistema'}
                      </span>
                    </div>
                  </label>
                </div>

                {hasCustom && (
                  <div className="mt-3 p-3 bg-indigo-50/60 rounded-xl border border-indigo-150 flex items-center justify-between text-sm animate-fade-in">
                    <div className="flex items-center gap-2 text-indigo-900 truncate">
                      <CheckCircle className="h-4 w-4 text-indigo-600 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold block truncate">{custom.name}</span>
                        <span className="text-xs text-indigo-700 block">Aplicado em {custom.uploadDate} ({custom.size})</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleRemoveCustomFile(doc.id, e)}
                      className="p-1 px-2 text-red-650 hover:bg-red-50 hover:text-red-800 rounded font-bold transition-all text-xs"
                      title="Repor modelo padrão original"
                    >
                      Remover modelo personalizado
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div>
                  <span>Tamanho: <strong className="text-gray-700 font-bold">{hasCustom ? custom.size : doc.fileSize}</strong></span>
                  <span className="mx-2">•</span>
                  <span>Modificado: <strong className="text-gray-700 font-bold">{hasCustom ? custom.uploadDate : doc.lastUpdated}</strong></span>
                </div>
                <button
                  onClick={() => handleDownload(doc)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-black transition-colors cursor-pointer text-xs"
                >
                  <Download className="h-3 w-3" /> {hasCustom ? 'Descarregar Customizado' : 'Descarregar Original'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-slate-700">
        <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
          <HelpCircle className="h-5 w-5 text-slate-500" /> Notas para o Preenchimento Eficaz o Alinhamento com os Modelos
        </h4>
        <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed md:grid md:grid-cols-2 md:gap-x-6 md:space-y-0">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Regra de Estatística Acumulada</strong>: Declare os alunos matriculados até à data limite de fecho do ano estatístico corrente.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Tempo Integral vs Parcial</strong>: Docentes com carga horária igual ou superior a 36 horas semanais contam exclusivamente como Tempo Integral.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Recursos de Conectividade</strong>: Inclua na ficha de infraestrutura apenas os computadores afetos à área académica com acesso operacional à Internet.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Previsão de Erros</strong>: O validador central rejeitará formulários que contenham contradições numéricas nas somas.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

