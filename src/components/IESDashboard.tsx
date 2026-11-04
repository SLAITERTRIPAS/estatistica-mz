import React, { useState, useEffect, useRef } from 'react';
import { User, Submission, AcademicYearData, Institution } from '../types';
import { EMPTY_FORM_DATA } from '../data';
import IESWorkflowPanel from './IESWorkflowPanel';
import { 
  Building2, Send, Save, Share2, ClipboardList, Database, Landmark, 
  MapPin, CheckCircle, Clock, AlertTriangle, RefreshCw, Layers, Calendar, 
  ChevronRight, Users, GraduationCap, School, CircleAlert, Check, Briefcase, Cpu, Coins,
  Search, TrendingUp, Library, ArrowLeft, Folder, Notebook, Sparkles, BookOpen, Trash2, Home,
  Atom, X
} from 'lucide-react';
import QuantumBadge from './QuantumBadge';
import { motion } from 'motion/react';
import { PROVINCIAS_MOZ, DISTRITOS_POR_PROVINCIA } from '../data/geography';
import { TableB2 } from './TableB2';
import AIValidationAssistant from './AIValidationAssistant';
import { TableB3 } from './TableB3';
import { TableB4 } from './TableB4';
import { TableDespesas } from './TableDespesas';
import { TableFinanciamento } from './TableFinanciamento';
import { TableDespesaDetalhada } from './TableDespesaDetalhada';
import { TableLaboratorios } from './TableLaboratorios';
import { TableSalasAula } from './TableSalasAula';
import { TableBibliotecas } from './TableBibliotecas';
import { TableComputadores } from './TableComputadores';
import { TablePrevisaoEstudantes } from './TablePrevisaoEstudantes';
import IESHistoricoSubmissoes from './IESHistoricoSubmissoes';

const CourseSelect = ({ value, onChange, courses, onDetectArea }: { value: string, onChange: (val: string) => void, courses: string[], onDetectArea?: (name: string) => void }) => (
  <select 
    value={value} 
    onChange={(e) => {
      const val = e.target.value;
      onChange(val);
      if (onDetectArea) onDetectArea(val);
    }} 
    className="w-full bg-transparent p-1 focus:outline-blue-500 font-bold"
  >
     <option value="">Selecione um curso</option>
     {courses.map(c => <option key={c} value={c}>{c}</option>)}
  </select>
)
const CourseSelectCell = ({ course, idx, formData, setFormData, instCourses }: { course: any, idx: number, formData: any, setFormData: any, instCourses: string[] }) => {
  const [localValue, setLocalValue] = React.useState(course.nome);
  const [isDirty, setIsDirty] = React.useState(false);

  return (
    <td className="relative border-2 border-black p-1">
      <select 
        className="w-full bg-transparent p-1 font-bold" 
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
          setIsDirty(true);
        }}
      >
        <option value="">Selecione um curso</option>
        {instCourses.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      
      {isDirty && (
        <div className="absolute -top-6 right-0 bg-emerald-500 text-white p-0.5 z-10 text-xs">
          <button onClick={() => { 
            const updated = [...formData.coursesDinamica!];
            updated[idx].nome = localValue;
            setFormData((prev: any) => ({ ...prev, coursesDinamica: updated }));
            setIsDirty(false); 
          }}>Guardar</button>
        </div>
      )}
    </td>
  );
};

const GeoSelect = ({ 
  type, 
  value, 
  onChange, 
  provincia,
  nacionalidade
}: { 
  type: 'provincia' | 'distrito' | 'nacionalidade' | 'regime', 
  value: string, 
  onChange: (val: string) => void,
  provincia?: string,
  nacionalidade?: string
}) => {
  const isForeign = nacionalidade === 'Estrangeira';

  if (type === 'provincia') {
    if (isForeign) {
      return (
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Província (Estrangeira)"
          className="w-full h-full bg-transparent p-1 font-bold text-center focus:bg-sky-50 focus:outline-none"
        />
      );
    }
    return (
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full h-full bg-transparent p-1 font-bold text-center appearance-none focus:bg-sky-50 focus:outline-none"
      >
        <option value="">Selecione</option>
        {PROVINCIAS_MOZ.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
    );
  }
  if (type === 'distrito') {
    if (isForeign) {
      return (
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Distrito (Estrangeira)"
          className="w-full h-full bg-transparent p-1 font-bold text-center focus:bg-sky-50 focus:outline-none"
        />
      );
    }
    const distritos = provincia ? (DISTRITOS_POR_PROVINCIA[provincia] || []) : [];
    return (
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full h-full bg-transparent p-1 font-bold text-center appearance-none focus:bg-sky-50 focus:outline-none disabled:opacity-50"
        disabled={!provincia}
      >
        <option value="">Selecione</option>
        {distritos.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
    );
  }
  if (type === 'nacionalidade') {
    return (
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full h-full bg-transparent p-1 font-bold text-center appearance-none focus:bg-sky-50 focus:outline-none"
      >
        <option value="">Selecione</option>
        <option value="Moçambicana">Moçambicana</option>
        <option value="Estrangeira">Estrangeira</option>
      </select>
    );
  }
  if (type === 'regime') {
    return (
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full h-full bg-transparent p-1 font-bold text-center appearance-none focus:bg-sky-50 focus:outline-none"
      >
        <option value="">Selecione</option>
        <option value="Tempo Inteiro">Tempo Inteiro</option>
        <option value="Tempo Parcial">Tempo Parcial</option>
      </select>
    );
  }
  return null;
}
interface IESDashboardProps {
  currentUser: User;
  submissions: Submission[];
  onSaveSubmission: (sub: Submission) => void;
  onSendToProvince: (subId: string) => void;
  institutions: Institution[];
  initialYear?: number;
}

const quadrosEixo1 = [
  { type: 'procura_es', id: '1.1', title: 'Número de Estudantes que procuram o Ensino Superior' },
  { type: 'vagas_preenchidas', id: '1.2', title: 'Número de vagas preenchidas' },
  { type: 'estudantes_dinamica', id: '1.3', title: 'Número de Estudantes Novos Ingresso, Matriculados, Graduados por Grau, Sexo e Cursos em Funcionamento no ano académico anterior' },
  { type: 'nacionalidade_dinamica', id: '1.4', title: 'Número de Novos Ingressos, Matriculados e Graduados por Nacionalidade e sexo' },
  { type: 'estudantes_estrangeiros', id: '1.5', title: 'Número de Estudantes Estrangeiros, Novos Ingressos, Matriculados e Graduados por Curso, Grau e Sexo' },
  { type: 'estudantes_needs_especiais', id: '1.6', title: 'Número de Estudantes com Necessidades Especiais por Curso, Grau e Sexo' },
  { type: 'estudantes_needs_especiais_outros', id: '1.7', title: 'Número de Estudantes com Outras Necessidades Especiais não especificadas no quadro 1.6 por Curso, Grau e Sexo' },
  { type: 'estudantes_provincia_conclusao', id: '1.8', title: 'Número de Novos Ingressos, Matriculados e Graduados por Sexo e Província de conclusão da 12ª classe e ou Equivalência' },
  { type: 'estudantes_provincia_naturalidade', id: '1.9', title: 'Número de Novos Ingressos, Matriculados e Graduados por Sexo e Província de Naturalidade' },
  { type: 'estudantes_faixa_etaria', id: '1.10', title: 'Número de Novos Ingressos, Matriculados e Graduados por Sexo e Faixa Etária' },
  { type: 'graduados_primeira_matricula', id: '1.11', title: 'Número de Estudantes Graduados por Curso consoante o ano da Primeira Matricula' },
  { type: 'curta_duracao_matriculados', id: '1.12', title: 'Cursos de curta duração e ou Especialização por Grau e Sexo - Matriculados' },
  { type: 'cursos_curta_duracao_graduados', id: '1.13', title: 'Número de Estudantes Desistentes, Óbito ou que Anularam Matrícula Por Curso e Sexo' },
  { type: 'estudantes_bolseiros', id: '1.14', title: 'Número de Estudantes Bolseiros por Curso, Sexo, tipo de Bolsa e Financiador' },
  { type: 'bolseiros_faixa_etaria', id: '1.15', title: 'Bolseiros por Idade' },
  { type: 'bolseiros_provincia_naturalidade', id: '1.16', title: 'Bolseiros por Naturalidade' },
];

const EIXO_1_QUADROS = [
  { type: 'procura_es', id: '1.1', title: 'Número de Estudantes que procuram o Ensino Superior', eixo: 2 },
  { type: 'vagas_preenchidas', id: '1.2', title: 'Número de vagas preenchidas', eixo: 2 },
  { type: 'estudantes_dinamica', id: '1.3', title: 'Número de Estudantes Novos Ingresso, Matriculados, Graduados por Grau, Sexo e Cursos em Funcionamento no ano académico anterior', eixo: 2 },
  { type: 'nacionalidade_dinamica', id: '1.4', title: 'Número de Novos Ingressos, Matriculados e Graduados por Nacionalidade e sexo', eixo: 2 },
  { type: 'estudantes_estrangeiros', id: '1.5', title: 'Número de Estudantes Estrangeiros, Novos Ingressos, Matriculados e Graduados por Curso, Grau e Sexo', eixo: 2 },
  { type: 'estudantes_needs_especiais', id: '1.6', title: 'Número de Estudantes com Necessidades Especiais por Curso, Grau e Sexo', eixo: 2 },
  { type: 'estudantes_needs_especiais_outros', id: '1.7', title: 'Número de Estudantes com Outras Necessidades Especiais não especificadas no quadro 1.6 por Curso, Grau e Sexo', eixo: 2 },
  { type: 'estudantes_provincia_conclusao', id: '1.8', title: 'Número de Novos Ingressos, Matriculados e Graduados por Sexo e Província de conclusão da 12ª classe e ou Equivalência', eixo: 2 },
  { type: 'estudantes_provincia_naturalidade', id: '1.9', title: 'Número de Novos Ingressos, Matriculados e Graduados por Sexo e Província de Naturalidade', eixo: 2 },
  { type: 'estudantes_faixa_etaria', id: '1.10', title: 'Número de Novos Ingressos, Matriculados e Graduados por Sexo e Faixa Etária', eixo: 2 },
  { type: 'graduados_primeira_matricula', id: '1.11', title: 'Número de Estudantes Graduados por Curso consoante o ano da Primeira Matricula', eixo: 2 },
  { type: 'curta_duracao_matriculados', id: '1.12', title: 'Cursos de curta duração e ou Especialização por Grau e Sexo - Matriculados', eixo: 2 },
  { type: 'cursos_curta_duracao_graduados', id: '1.13', title: 'Número de Estudantes Desistentes, Óbito ou que Anularam Matrícula Por Curso e Sexo', eixo: 2 },
  { type: 'estudantes_bolseiros', id: '1.14', title: 'Número de Estudantes Bolseiros por Curso, Sexo, tipo de Bolsa e Financiador', eixo: 2 },
  { type: 'bolseiros_faixa_etaria', id: '1.15', title: 'Número de Estudantes Bolseiros por Faixa Etária', eixo: 2 },
  { type: 'bolseiros_provincia_naturalidade', id: '1.16', title: 'Número de Estudantes Bolseiros por Província de Naturalidade', eixo: 2 },
];

const GENERATED_QUADROS = Array.from({ length: 8 }, (_, idxE) => {
  const eixo = idxE + 3; // Starts from Eixo 3 up to 10. We will only use 3 to 9.
  if (eixo > 9) return null;

  return Array.from({ length: 25 }, (_, idxQ) => {
    // Basic structural filters
    if (eixo === 3 && (idxQ === 0 || idxQ > 7)) return null; // A1-A7
    if (eixo === 4 && (idxQ === 0 || idxQ > 14)) return null; // A8.1-A9.3
    if (eixo === 5 && (idxQ === 0 || idxQ > 4)) return null; // B1-B4
    if (eixo === 6 && (idxQ !== 1 && idxQ !== 2 && idxQ !== 3)) return null; 
    if (eixo === 7 && (idxQ !== 1 && idxQ !== 2 && idxQ !== 3 && idxQ !== 4)) return null;
    if (eixo >= 8 && eixo <= 9 && (idxQ !== 1)) return null; // Placeholders

    let title = '';
    let customId = `${eixo}.${idxQ}`;

    // Eixo 3: C - Corpo Docente (A1-A7)
    if (eixo === 3 && idxQ === 1) {
      title = 'Numero de Docentes por Província, Regime de Contratação, Grau e Sexo (Tempo Inteiro)';
      customId = 'A1';
    } else if (eixo === 3 && idxQ === 2) {
      title = 'Quadro A2. Número de Docentes por grupo etário, nacionalidade e regime de contratação';
      customId = 'A2';
    } else if (eixo === 3 && idxQ === 3) {
      title = 'Quadro A3. Número de Docentes por grupo etário, grau e regime de contratação';
      customId = 'A3';
    } else if (eixo === 3 && idxQ === 4) {
      title = 'Quadro A4: Número de docentes por Área de Formação segundo UNESCO, por Grau e Sexo';
      customId = 'A4';
    } else if (eixo === 3 && idxQ === 5) {
      title = 'Quadro A5: Número de docentes por Curso de Formação, Grau e Sexo';
      customId = 'A5';
    } else if (eixo === 3 && idxQ === 6) {
      title = 'Quadro A6: Número de Docentes por Regime de Contratação, Categoria e Sexo';
      customId = 'A6';
    } else if (eixo === 3 && idxQ === 7) {
      title = 'Quadro A7: Número de Docentes por tipo de relação contractual, nível de formação e sexo';
      customId = 'A7';
    }

    // Eixo 4: D - Investigadores (A8.1-A9.3)
    else if (eixo === 4 && idxQ === 1) {
      title = 'Quadro A8.1: Número de Investigadores a tempo inteiro por nacionalidade nível de formação e sexo';
      customId = 'A8.1';
    } else if (eixo === 4 && idxQ === 2) {
      title = 'Quadro A8.2: Número de Investigadores a tempo parcial por nacionalidade nível de formação e sexo';
      customId = 'A8.2';
    } else if (eixo === 4 && idxQ === 3) {
      title = 'Quadro A8.3 Número de Investigadores por tipo de contrato, nível de formação e por sexo';
      customId = 'A8.3';
    } else if (eixo === 4 && idxQ === 4) {
      title = 'Quadro A8.4.1 Número de investigadores a tempo inteiro por grupo etário, nacionalidade e sexo';
      customId = 'A8.4.1';
    } else if (eixo === 4 && idxQ === 5) {
      title = 'Quadro A8.4.2 Número de Investigadores a tempo parcial por grupo etario, nacionalidade e sexo';
      customId = 'A8.4.2';
    } else if (eixo === 4 && idxQ === 6) {
      title = 'Quadro A8.4.4 Número de investigadores a tempo inteiro por área de formação, sexo e nacionalidade';
      customId = 'A8.4.4';
    } else if (eixo === 4 && idxQ === 7) {
      title = 'Quadro  A8.4.4.1  Número de investigadores a tempo parcial por área de formação, sexo e nacionalidade';
      customId = 'A8.4.4.1';
    } else if (eixo === 4 && idxQ === 8) {
      title = 'Quadro A8.4.4.2 Trabalhos de Conclusão do Curso';
      customId = 'A8.4.4.2';
    } else if (eixo === 4 && idxQ === 9) {
      title = 'Quadro A8.4.4.3 Número de Dissertações Orientadas por Docente, Nível de Formação e Sexo';
      customId = 'A8.4.4.3';
    } else if (eixo === 4 && idxQ === 10) {
      title = 'Quadro A8.4.4.4 Número de Monografias Orientadas por Docente, Nível de Formação e Sexo';
      customId = 'A8.4.4.4';
    } else if (eixo === 4 && idxQ === 11) {
      title = 'Quadro A8.4.4.5 Número de Teses Orientadas por Docente, Nível de Formação e Sexo';
      customId = 'A8.4.4.5';
    } else if (eixo === 4 && idxQ === 12) {
      title = 'Quadro A9.1 Número de Pesquisas';
      customId = 'A9.1';
    } else if (eixo === 4 && idxQ === 13) {
      title = 'Quadro A9.2 Actividades de Extensão';
      customId = 'A9.2';
    } else if (eixo === 4 && idxQ === 14) {
      title = 'Quadro A9.3 Número de actividades de extensão por nivel de formação';
      customId = 'A9.3';
    }

    // Eixo 5: E - CTA (B1-B4)
    else if (eixo === 5 && idxQ === 1) {
      title = 'Quadro B1: Qualificação Académica do Pessoal Técnico e Administrativo por Sexo';
      customId = 'B1';
    } else if (eixo === 5 && idxQ === 2) {
      title = 'Quadro B2. Número de CTA a tempo parcial por nível de formação e nacionalidade e Sexo';
      customId = 'B2';
    } else if (eixo === 5 && idxQ === 3) {
      title = 'Quadro B3. Número de CTA por tipo de relação contractual, nível de formação e sexo';
      customId = 'B3';
    } else if (eixo === 5 && idxQ === 4) {
      title = 'Quadro B4. Número de CTA por grupo etário, nacionalidade e regime de contratação';
      customId = 'B4';
    }

    // Eixos 6-9 placeholders
    else if (eixo === 6 && idxQ === 1) {
      title = 'Quadro 1. Despesas na IES';
      customId = '1';
    }
    else if (eixo === 6 && idxQ === 2) {
      title = 'Quadro 2. Financiamento da instituição por fonte';
      customId = '2';
    }
    else if (eixo === 6 && idxQ === 3) {
      title = 'Quadro 3. Despesa para funcionamento e investimento';
      customId = '3';
    }
    else if (eixo === 7 && idxQ === 1) {
      title = 'Quadro D. 1.1 Número de laboratórios em funcionamento';
      customId = 'D.1.1';
    }
    else if (eixo === 7 && idxQ === 2) {
      title = 'Quadro D. 1.2. Número de salas de aula';
      customId = 'D.1.2';
    }
    else if (eixo === 7 && idxQ === 3) {
      title = 'Quadro D.1.3 Número de Bibliotecas em funcionamento';
      customId = 'D.1.3';
    }
    else if (eixo === 7 && idxQ === 4) {
      title = 'Quadro D. 1.4 Número de computadores disponíveis para estudantes';
      customId = 'D.1.4';
    }
    else if (eixo === 7) {
      title = 'G - INFRAESTRUTURA';
    }
    else if (eixo === 8 && idxQ === 1) {
      title = 'Quadro H.1 Previsão de estudantes matriculados';
      customId = 'H.1';
    }
    else if (eixo === 8) {
      title = 'H - PREVISÃO';
    }
    else if (eixo === 9) title = 'LEGENDAS';
    else return null;

    const isEixo3 = eixo === 3;
    const typeKey = isEixo3 ? `eixo_2_q${idxQ - 1}` : `eixo_${eixo}_q${idxQ}`;

    return {
      type: typeKey,
      id: customId,
      title: title,
      eixo: eixo
    };
  }).filter((q): q is { type: string; id: string; title: string; eixo: number } => q !== null);
}).filter(Boolean).flat() as { type: string; id: string; title: string; eixo: number }[];

const TODOS_OS_QUADROS = [...EIXO_1_QUADROS, ...GENERATED_QUADROS];

const ORDEM_QUADROS = TODOS_OS_QUADROS.map(q => q.type);

const MAPA_CURSOS_ISCED: { [key: string]: { area: string; subarea: string } } = {
  'engenharia informática': { area: 'Tecnologias de Informação e Comunicação (TIC)', subarea: 'Ciências de Computadores e Software' },
  'informática': { area: 'Tecnologias de Informação e Comunicação (TIC)', subarea: 'Ciências de Computadores e Software' },
  'tecnologias de informação': { area: 'Tecnologias de Informação e Comunicação (TIC)', subarea: 'Desenvolvimento de Sistemas de Informação' },
  'desenvolvimento de software': { area: 'Tecnologias de Informação e Comunicação (TIC)', subarea: 'Ciências de Computadores e Software' },
  'sistemas de informação': { area: 'Tecnologias de Informação e Comunicação (TIC)', subarea: 'Tecnologias de Informação' },
  'ciências de computadores': { area: 'Tecnologias de Informação e Comunicação (TIC)', subarea: 'Ciências de Computadores' },
  
  'medicina': { area: 'Saúde e Bem-Estar', subarea: 'Medicina Clínica e Saúde Humana' },
  'enfermagem': { area: 'Saúde e Bem-Estar', subarea: 'Enfermagem e Cuidados de Saúde' },
  'saúde pública': { area: 'Saúde e Bem-Estar', subarea: 'Saúde Pública' },
  'farmácia': { area: 'Saúde e Bem-Estar', subarea: 'Farmácia' },
  'nutrição': { area: 'Saúde e Bem-Estar', subarea: 'Nutrição e Ciências dos Alimentos' },
  'medicina dentária': { area: 'Saúde e Bem-Estar', subarea: 'Saúde Oral' },
  
  'direito': { area: 'Sociologia, Ciências Sociais e Direito', subarea: 'Direito e Jurisprudência' },
  
  'contabilidade': { area: 'Negócios, Administração e Direito', subarea: 'Contabilidade e Fiscalidade' },
  'finanças': { area: 'Negócios, Administração e Direito', subarea: 'Finanças, Banca e Seguros' },
  'gestão de empresas': { area: 'Negócios, Administração e Direito', subarea: 'Gestão e Administração Comercial' },
  'gestão': { area: 'Negócios, Administração e Direito', subarea: 'Gestão e Administração' },
  'administração pública': { area: 'Negócios, Administração e Direito', subarea: 'Administração Pública e Políticas Públicas' },
  'economia': { area: 'Negócios, Administração e Direito', subarea: 'Economia e Finanças' },
  'recursos humanos': { area: 'Negócios, Administração e Direito', subarea: 'Gestão de Recursos Humanos' },
  'marketing': { area: 'Negócios, Administração e Direito', subarea: 'Marketing e Publicidade' },
  
  'engenharia civil': { area: 'Engenharia, Indústrias Transformadoras e Construção', subarea: 'Engenharia Civil e Construção' },
  'engenharia mecânica': { area: 'Engenharia, Indústrias Transformadoras e Construção', subarea: 'Engenharia Mecânica e Metalurgia' },
  'engenharia electrotécnica': { area: 'Engenharia, Indústrias Transformadoras e Construção', subarea: 'Eletricidade e Engenharia de Energia' },
  'engenharia de telecomunicações': { area: 'Engenharia, Indústrias Transformadoras e Construção', subarea: 'Telecomunicações e Eletrónica' },
  'engenharia química': { area: 'Engenharia, Indústrias Transformadoras e Construção', subarea: 'Processos Químicos e Engenharia Química' },
  'engenharia de minas': { area: 'Engenharia, Indústrias Transformadoras e Construção', subarea: 'Exploração de Minas e Geotecnia' },
  'arquitetura': { area: 'Engenharia, Indústrias Transformadoras e Construção', subarea: 'Arquitetura, Urbanismo e Planeamento Territorial' },
  
  'agronomia': { area: 'Agricultura, Silvicultura, Pescas e Veterinária', subarea: 'Agricultura, Cultivos e Horticultura' },
  'engenharia agronómica': { area: 'Agricultura, Silvicultura, Pescas e Veterinária', subarea: 'Agricultura' },
  'silvicultura': { area: 'Agricultura, Silvicultura, Pescas e Veterinária', subarea: 'Silvicultura e Exploração Florestal' },
  'pescas': { area: 'Agricultura, Silvicultura, Pescas e Veterinária', subarea: 'Pesca e Aquacultura' },
  'medicina veterinária': { area: 'Agricultura, Silvicultura, Pescas e Veterinária', subarea: 'Ciências Veterinárias' },
  
  'psicologia': { area: 'Ciências Sociais, Jornalismo e Informação', subarea: 'Psicologia e Ciências Comportamentais' },
  'sociologia': { area: 'Ciências Sociais, Jornalismo e Informação', subarea: 'Sociologia e Estudos Sociais' },
  'comunicação social': { area: 'Ciências Sociais, Jornalismo e Informação', subarea: 'Jornalismo, Reportagem e Comunicação' },
  'jornalismo': { area: 'Ciências Sociais, Jornalismo e Informação', subarea: 'Jornalismo' },
  'antropologia': { area: 'Ciências Sociais, Jornalismo e Informação', subarea: 'Antropologia e História' },
  
  'biologia': { area: 'Ciências Naturais, Matemática e Estatística', subarea: 'Ciências Biológicas e da Vida' },
  'física': { area: 'Ciências Naturais, Matemática e Estatística', subarea: 'Ciências Físicas' },
  'química': { area: 'Ciências Naturais, Matemática e Estatística', subarea: 'Ciências Químicas' },
  'matemática': { area: 'Ciências Naturais, Matemática e Estatística', subarea: 'Matemática e Estatística aplicada' },
  'estatística': { area: 'Ciências Naturais, Matemática e Estatística', subarea: 'Estatística' },
  'geologia': { area: 'Ciências Naturais, Matemática e Estatística', subarea: 'Ciências da Terra' },
  
  'pedagogia': { area: 'Educação', subarea: 'Ciências da Educação' },
  'ciências da educação': { area: 'Educação', subarea: 'Estudos Gerais de Educação' },
  'ensino': { area: 'Educação', subarea: 'Formação de Professores e Didáticas específicas' },
  
  'turismo': { area: 'Serviços', subarea: 'Serviços de Viagens, Turismo e Lazer' },
  'hotelaria': { area: 'Serviços', subarea: 'Serviços de Hotelaria, Restauração e Catering' },
};

function detectCourseArea(nomeCurso: string): { area: string; subarea: string } {
  const normalized = nomeCurso.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .trim();

  if (!normalized) {
    return { area: '', subarea: '' };
  }

  // Exact matching or substring matching
  for (const [key, value] of Object.entries(MAPA_CURSOS_ISCED)) {
    const keyNormalized = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (normalized.includes(keyNormalized) || keyNormalized.includes(normalized)) {
      return { area: value.area, subarea: value.subarea };
    }
  }

  // Broad generic rules based on common keywords
  if (normalized.includes('eng') || normalized.includes('comput') || normalized.includes('software') || normalized.includes('sist') || normalized.includes('informatic') || normalized.includes('telecom')) {
    if (normalized.includes('civ') || normalized.includes('const')) {
      return { area: 'Engenharia, Indústrias Transformadoras e Construção', subarea: 'Engenharia Civil e Construção' };
    }
    if (normalized.includes('mec') || normalized.includes('term')) {
      return { area: 'Engenharia, Indústrias Transformadoras e Construção', subarea: 'Engenharia Mecânica e Metalurgia' };
    }
    if (normalized.includes('elect') || normalized.includes('energi') || normalized.includes('power')) {
      return { area: 'Engenharia, Indústrias Transformadoras e Construção', subarea: 'Eletricidade e Engenharia de Energia' };
    }
    if (normalized.includes('informatic') || normalized.includes('comput') || normalized.includes('software') || normalized.includes('sistem')) {
      return { area: 'Tecnologias de Informação e Comunicação (TIC)', subarea: 'Ciências de Computadores e Software' };
    }
    return { area: 'Engenharia, Indústrias Transformadoras e Construção', subarea: 'Construção, Engenharia e áreas conexas' };
  }

  if (normalized.includes('med') || normalized.includes('saud') || normalized.includes('enferm') || normalized.includes('odont') || normalized.includes('psicol') || normalized.includes('farm') || normalized.includes('terap')) {
    if (normalized.includes('psic')) {
      return { area: 'Ciências Sociais, Jornalismo e Informação', subarea: 'Psicologia e Ciências Comportamentais' };
    }
    if (normalized.includes('enferm')) {
      return { area: 'Saúde e Bem-Estar', subarea: 'Enfermagem e Cuidados de Saúde' };
    }
    return { area: 'Saúde e Bem-Estar', subarea: 'Medicina Clínica e Saúde Humana' };
  }

  if (normalized.includes('dir') || normalized.includes('jur') || normalized.includes('lei')) {
    return { area: 'Sociologia, Ciências Sociais e Direito', subarea: 'Direito e Jurisprudência' };
  }

  if (normalized.includes('contab') || normalized.includes('finan') || normalized.includes('gest') || normalized.includes('admin') || normalized.includes('econ') || normalized.includes('recurs') || normalized.includes('mark') || normalized.includes('negoc')) {
    if (normalized.includes('contab') || normalized.includes('audito') || normalized.includes('fisc')) {
      return { area: 'Negócios, Administração e Direito', subarea: 'Contabilidade e Fiscalidade' };
    }
    if (normalized.includes('finan') || normalized.includes('banc')) {
      return { area: 'Negócios, Administração e Direito', subarea: 'Finanças, Banca e Seguros' };
    }
    if (normalized.includes('econ')) {
      return { area: 'Negócios, Administração e Direito', subarea: 'Economia e Finanças' };
    }
    if (normalized.includes('publi') || normalized.includes('gov')) {
      return { area: 'Negócios, Administração e Direito', subarea: 'Administração Pública e Políticas Públicas' };
    }
    return { area: 'Negócios, Administração e Direito', subarea: 'Gestão e Administração' };
  }

  if (normalized.includes('agr') || normalized.includes('silv') || normalized.includes('florest') || normalized.includes('pesc') || normalized.includes('veter')) {
    if (normalized.includes('veter')) {
      return { area: 'Agricultura, Silvicultura, Pescas e Veterinária', subarea: 'Ciências Veterinárias' };
    }
    return { area: 'Agricultura, Silvicultura, Pescas e Veterinária', subarea: 'Agricultura, Cultivos e Horticultura' };
  }

  if (normalized.includes('educ') || normalized.includes('pedag') || normalized.includes('ensin') || normalized.includes('docen') || normalized.includes('didat')) {
    return { area: 'Educação', subarea: 'Formação de Professores e Didáticas específicas' };
  }

  if (normalized.includes('comunic') || normalized.includes('jorn') || normalized.includes('media') || normalized.includes('publi')) {
    return { area: 'Ciências Sociais, Jornalismo e Informação', subarea: 'Jornalismo, Reportagem e Comunicação' };
  }

  if (normalized.includes('turis') || normalized.includes('hotel') || normalized.includes('viag')) {
    return { area: 'Serviços', subarea: 'Serviços de Viagens, Turismo e Lazer' };
  }

  return { area: 'Ciências Sociais, Humanidades e Artes', subarea: 'Estudos Gerais e de área não categorizada' };
}

const cardConfigs = [
  {
    type: 'identificacao',
    title: 'A - Identificação da Entidade',
    sub: 'Dados Institucionais',
    desc: 'Informações básicas, localização, contactos e caracterização da Instituição de Ensino Superior.',
    icon: Home,
    colorClass: 'text-gray-500 bg-gray-55/10'
  },
  {
    type: 'discente',
    title: 'B - Estatística sobre Corpo Discente',
    sub: 'Fluxo de Estudantes',
    desc: 'Registo completo de candidaturas, vagas, matrículas, dinâmica de nacionalidade e necessidades especiais.',
    icon: Users,
    colorClass: 'text-blue-500 bg-blue-55/10'
  },
  {
    type: 'docente',
    title: 'C - Corpo Docente',
    sub: 'Docentes & Habilitações',
    desc: 'Grau académico dos docentes (PhD, Licenciatura, Mestrado), e o seu regime de contratação na IES.',
    icon: GraduationCap,
    colorClass: 'text-indigo-500 bg-indigo-55/10'
  },
  {
    type: 'investigadores',
    title: 'D - Investigadores',
    sub: 'Pesquisa & Publicações',
    desc: 'Registo completo de investigadores ativos e produção científica (Artigos, Livros, Patentes).',
    icon: Search,
    colorClass: 'text-sky-500 bg-sky-55/10'
  },
  {
    type: 'cta',
    title: 'E - Corpo Técnico Administrativo - CTA',
    sub: 'Corpo de Apoio à IES',
    desc: 'Servidores de apoio administrativo, qualificadores e categorias profissionais.',
    icon: Briefcase,
    colorClass: 'text-amber-500 bg-amber-55/10'
  },
  {
    type: 'financas',
    title: 'F - Recursos Financeiros',
    sub: 'Orçamento & Financiamento',
    desc: 'Detalhamento das receitas, execução orçamental e investimentos realizados.',
    icon: Coins,
    colorClass: 'text-emerald-500 bg-emerald-55/10'
  },
  {
    type: 'infraestrutura',
    title: 'G - Infraestrutura',
    sub: 'Salas, Auditórios & Labs',
    desc: 'Cômputo físico de salas de aula, laboratórios, Ambiente TIC e Bibliotecas.',
    icon: School,
    colorClass: 'text-teal-500 bg-teal-55/10'
  },
  {
    type: 'previsao',
    title: 'H - Previsão',
    sub: 'Projeções Futuras',
    desc: 'Estimação do volume discente e recursos exigidos correspondentes ao novo ano.',
    icon: TrendingUp,
    colorClass: 'text-purple-500 bg-purple-55/10'
  },
  {
    type: 'legendas',
    title: 'Legendas',
    sub: 'Glossário e Auxílio',
    desc: 'Definições, siglas e instruções para o preenchimento correto dos quadros.',
    icon: BookOpen,
    colorClass: 'text-rose-500 bg-rose-55/10'
  }
] as const;

export default function IESDashboard({
  currentUser,
  submissions,
  onSaveSubmission,
  onSendToProvince,
  institutions,
  initialYear,
}: IESDashboardProps) {
  const myInstitution = institutions.find(i => i.id === currentUser.institutionId);
  const [editableCourses, setEditableCourses] = useState<string[]>(() => {
    const saved = localStorage.getItem(`ies_courses_${currentUser.institutionId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return myInstitution?.courses || [];
  });
  const [editableShortCourses, setEditableShortCourses] = useState<string[]>(() => {
    const saved = localStorage.getItem(`ies_short_courses_${currentUser.institutionId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return myInstitution?.shortCourses || [];
  });
  const instCourses = editableCourses;

  useEffect(() => {
    localStorage.setItem(`ies_courses_${currentUser.institutionId}`, JSON.stringify(editableCourses));
  }, [editableCourses, currentUser.institutionId]);

  useEffect(() => {
    localStorage.setItem(`ies_short_courses_${currentUser.institutionId}`, JSON.stringify(editableShortCourses));
  }, [editableShortCourses, currentUser.institutionId]);

  const instShortCourses = editableShortCourses;
  const [activeTab, setActiveTab] = useState<'form' | 'history' | 'report'>('form');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [modalCourseTab, setModalCourseTab] = useState<'regulares' | 'curta'>('regulares');
  const [selectedYear, setSelectedYear] = useState<number>(initialYear || new Date().getFullYear());
  const [selectedQuadro, setSelectedQuadro] = useState<string>('1.1');
  const [showAIValidationModal, setShowAIValidationModal] = useState<boolean>(false);
  
  const isBlocked = (selectedYear !== 2026) && (currentUser.role !== 'FocalPoint');

  useEffect(() => {
    if (isBlocked && (activeTab === 'form')) {
        setActiveTab('history'); // Default to Resumo
    }
  }, [selectedYear, isBlocked, activeTab]);

  const [formSubTab, setFormSubTab] = useState<string>(() => {
    if (currentUser.role === 'ies_interno' && currentUser.assignedEixo) {
      const EIXOS_MAP: Record<string, string> = {
        'Eixo 1': 'identificacao',
        'Eixo 2': 'discente',
        'Eixo 3': 'docente',
        'Eixo 4': 'investigadores',
        'Eixo 5': 'cta',
        'Eixo 6': 'financas',
        'Eixo 7': 'infraestrutura',
        'Eixo 8': 'previsao',
      };
      return EIXOS_MAP[currentUser.assignedEixo] || 'capa';
    }
    return 'capa';
  });

  useEffect(() => {
    if (formSubTab === 'discente') {
      setFormSubTab('procura_es');
    } else if (formSubTab === 'docente') {
      setFormSubTab('eixo_2_q0');
    } else if (formSubTab === 'investigadores') {
      setFormSubTab('eixo_4_q1');
    } else if (formSubTab === 'cta') {
      setFormSubTab('eixo_5_q1');
    } else if (formSubTab === 'financas') {
      setFormSubTab('eixo_6_q1');
    } else if (formSubTab === 'infraestrutura') {
      setFormSubTab('eixo_7_q1');
    } else if (formSubTab === 'previsao') {
      setFormSubTab('eixo_8_q1');
    }
  }, [formSubTab]);
  
  // Calendar events tracking
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem('stat_calendar_events');
    const loadedEvents = saved ? JSON.parse(saved) : [];
    const hasConvite = loadedEvents.some((e: any) => e.type === 'convite');
    if (saved && hasConvite) {
      setCalendarEvents(loadedEvents);
    } else {
      const initial: any[] = [];
      const finalEvents = saved ? [...loadedEvents] : initial;
      setCalendarEvents(finalEvents);
      localStorage.setItem('stat_calendar_events', JSON.stringify(finalEvents));
    }
  }, [formSubTab, activeTab]);

  // Statistical Form Data state
  const [formData, setFormData] = useState<AcademicYearData>({ ...EMPTY_FORM_DATA });
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<Submission['status'] | 'not_created'>('not_created');
  const [sentToProvince, setSentToProv] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState<string | null>(null);

  // Load IES submissions for current year when year matches
  useEffect(() => {
    const existingSub = submissions.find(
      s => s.institutionId === currentUser.institutionId && s.year === selectedYear
    );

    if (existingSub) {
      const loadedData = { ...existingSub.data };
      
      // Ensure ctaB1 is populated if missing or empty
      if (!loadedData.ctaB1 || loadedData.ctaB1.length === 0) {
        loadedData.ctaB1 = JSON.parse(JSON.stringify(EMPTY_FORM_DATA.ctaB1));
      }

      // Ensure ctaB2 is populated if missing or empty
      if (!loadedData.ctaB2 || loadedData.ctaB2.length === 0) {
        loadedData.ctaB2 = JSON.parse(JSON.stringify(EMPTY_FORM_DATA.ctaB2));
      }

      // Ensure ctaB3 has the correct structure and fixed labels matching user request
      if (!loadedData.ctaB3 || loadedData.ctaB3.length < 2) {
        loadedData.ctaB3 = JSON.parse(JSON.stringify(EMPTY_FORM_DATA.ctaB3));
      } else {
        loadedData.ctaB3 = loadedData.ctaB3.map((row, i) => {
          const defaultLabel = i === 0 ? 'Pertence ao quadro' : 'Não pertence ao quadro';
          return {
            ...row,
            tipoRelacao: defaultLabel
          };
        });
      }

      // Ensure ctaB4 has the correct structure and fixed ages matching user request
      if (!loadedData.ctaB4 || loadedData.ctaB4.length < 9) {
        loadedData.ctaB4 = JSON.parse(JSON.stringify(EMPTY_FORM_DATA.ctaB4));
      } else {
        const defaultAges = [
          'Inferior a 25 anos',
          '25 - 29',
          '30 - 34',
          '35 - 39',
          '40 - 44',
          '45 - 49',
          '50 - 54',
          '55 - 59',
          '60+'
        ];
        loadedData.ctaB4 = loadedData.ctaB4.map((row, i) => {
          if (i < defaultAges.length) {
            return {
              ...row,
              classeIdade: defaultAges[i]
            };
          }
          return row;
        });
      }

      // Ensure despesasIES is populated if missing or empty
      if (!loadedData.despesasIES || loadedData.despesasIES.length < 3) {
        loadedData.despesasIES = JSON.parse(JSON.stringify(EMPTY_FORM_DATA.despesasIES));
      }

      // Ensure financiamentoIES is populated if missing or empty
      if (!loadedData.financiamentoIES || loadedData.financiamentoIES.length < 5) {
        loadedData.financiamentoIES = JSON.parse(JSON.stringify(EMPTY_FORM_DATA.financiamentoIES));
      }

      // Ensure despesaFuncionamentoInvestimentoIES is populated if missing or empty
      if (!loadedData.despesaFuncionamentoInvestimentoIES || loadedData.despesaFuncionamentoInvestimentoIES.length < 10) {
        loadedData.despesaFuncionamentoInvestimentoIES = JSON.parse(JSON.stringify(EMPTY_FORM_DATA.despesaFuncionamentoInvestimentoIES));
      }

      // Ensure laboratoriosIES is populated if missing or empty
      if (!loadedData.laboratoriosIES) {
        loadedData.laboratoriosIES = JSON.parse(JSON.stringify(EMPTY_FORM_DATA.laboratoriosIES || []));
      }

      // Ensure salasAulaIES is populated if missing or empty
      if (!loadedData.salasAulaIES) {
        loadedData.salasAulaIES = JSON.parse(JSON.stringify(EMPTY_FORM_DATA.salasAulaIES || []));
      }

      // Ensure bibliotecasIES is populated if missing or empty
      if (!loadedData.bibliotecasIES) {
        loadedData.bibliotecasIES = JSON.parse(JSON.stringify(EMPTY_FORM_DATA.bibliotecasIES || []));
      }

      // Ensure computadoresIES is populated if missing or empty
      if (!loadedData.computadoresIES) {
        loadedData.computadoresIES = JSON.parse(JSON.stringify(EMPTY_FORM_DATA.computadoresIES || []));
      }

      // Ensure previsaoEstudantesMatriculados is populated if missing or empty
      if (!loadedData.previsaoEstudantesMatriculados) {
        loadedData.previsaoEstudantesMatriculados = JSON.parse(JSON.stringify(EMPTY_FORM_DATA.previsaoEstudantesMatriculados || []));
      }

      setFormData(loadedData);
      setSubmissionId(existingSub.id);
      setSubmissionStatus(existingSub.status);
      setSentToProv(existingSub.sentToProvince);
      setRejectionNotes(existingSub.status === 'rejected' ? existingSub.notes || null : null);
    } else {
      setFormData({ ...EMPTY_FORM_DATA });
      setSubmissionId(null);
      setSubmissionStatus('not_created');
      setSentToProv(false);
      setRejectionNotes(null);
    }
  }, [selectedYear, submissions, currentUser.institutionId]);

  const currentYear = new Date().getFullYear();
  const isReadOnly = submissionStatus === 'pending_central' || submissionStatus === 'approved' || selectedYear < currentYear;

  // 1. Ref and Sync hook to hold the serialized string of the last saved state
  const lastSavedDataRef = useRef<string>("");
  useEffect(() => {
    lastSavedDataRef.current = JSON.stringify(formData);
  }, [selectedYear, submissionId]);

  // 2. Autosave with 3-second (3000ms) debounce
  useEffect(() => {
    if (isReadOnly || submissionStatus === 'pending_central' || submissionStatus === 'approved') return;

    const currentSerialized = JSON.stringify(formData);
    
    // Avoid saving on initial load or if no modifications were actually made
    if (!lastSavedDataRef.current) {
      lastSavedDataRef.current = currentSerialized;
      return;
    }
    if (currentSerialized === lastSavedDataRef.current) return;

    const timeoutId = setTimeout(() => {
      const id = submissionId || 'sub-' + currentUser.institutionId + '-' + selectedYear;
      const newSub: Submission = {
        id,
        institutionId: currentUser.institutionId || '',
        institutionName: currentUser.institutionName || 'Instituição Desconhecida',
        province: currentUser.province || 'Luanda',
        year: selectedYear,
        data: formData,
        status: 'draft',
        sentToProvince: sentToProvince,
        updatedAt: new Date().toISOString(),
      };
      
      onSaveSubmission(newSub);
      lastSavedDataRef.current = currentSerialized;
      console.log("📝 Autosave: Dados estatísticos salvos automaticamente.");
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [formData, isReadOnly, submissionStatus, submissionId, currentUser, selectedYear, sentToProvince, onSaveSubmission]);

  // 3. Warning on close tab if there is unsaved data, with synchronous fallback to LocalStorage
  useEffect(() => {
    if (isReadOnly || submissionStatus === 'pending_central' || submissionStatus === 'approved') return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const currentSerialized = JSON.stringify(formData);
      if (currentSerialized !== lastSavedDataRef.current) {
        // Synchronous fallback save to local storage before closing
        const id = submissionId || 'sub-' + currentUser.institutionId + '-' + selectedYear;
        const newSub: Submission = {
          id,
          institutionId: currentUser.institutionId || '',
          institutionName: currentUser.institutionName || 'Instituição Desconhecida',
          province: currentUser.province || 'Luanda',
          year: selectedYear,
          data: formData,
          status: 'draft',
          sentToProvince: sentToProvince,
          updatedAt: new Date().toISOString(),
        };
        
        // Save both to the backup key and directly to standard storage
        localStorage.setItem(`ies_autosave_backup_${id}`, JSON.stringify(newSub));
        
        const savedSubs = localStorage.getItem('stat_submissions');
        let parsedSubs: Submission[] = [];
        if (savedSubs) {
          try {
            parsedSubs = JSON.parse(savedSubs);
          } catch (err) {
            // fallback
          }
        }
        const filtered = parsedSubs.filter(s => s.id !== id);
        filtered.push(newSub);
        localStorage.setItem('stat_submissions', JSON.stringify(filtered));

        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, isReadOnly, submissionStatus, submissionId, currentUser, selectedYear, sentToProvince]);

  const previousYearSub = submissions.find(
    s => s.institutionId === currentUser.institutionId && s.year === selectedYear - 1
  );

  const complianceIssues: Array<{
    id: string;
    type: 'error' | 'warning' | 'success';
    message: string;
    submessage?: string;
  }> = [];

  if (previousYearSub) {
    const curStudents = (formData.studentsMale || 0) + (formData.studentsFemale || 0);
    const prevStudents = (previousYearSub.data.studentsMale || 0) + (previousYearSub.data.studentsFemale || 0);
    if (prevStudents > 0) {
      const ratio = Math.abs(curStudents - prevStudents) / prevStudents;
      if (ratio >= 0.35) {
        complianceIssues.push({
          id: 'students_var',
          type: 'warning',
          message: `Desvio de Alunos: ${Math.round(ratio * 100)}% de variação`,
          submessage: `Actual: ${curStudents} matriculados | Anterior (${selectedYear - 1}): ${prevStudents}`
        });
      }
    }

    const curTeachers = (formData.teachersFullTime || 0) + (formData.teachersPartTime || 0);
    const prevTeachers = (previousYearSub.data.teachersFullTime || 0) + (previousYearSub.data.teachersPartTime || 0);
    if (prevTeachers > 0) {
      const ratio = Math.abs(curTeachers - prevTeachers) / prevTeachers;
      if (ratio >= 0.30) {
        complianceIssues.push({
          id: 'teachers_var',
          type: 'warning',
          message: `Desvio de Docentes: ${Math.round(ratio * 100)}% de variação`,
          submessage: `Actual: ${curTeachers} docentes | Anterior (${selectedYear - 1}): ${prevTeachers}`
        });
      }
    }

    const curBooks = formData.libraryBooksCount || 0;
    const prevBooks = previousYearSub.data.libraryBooksCount || 0;
    if (prevBooks > 0 && curBooks < prevBooks) {
      complianceIssues.push({
        id: 'library_dec',
        type: 'warning',
        message: `Decréscimo no Acervo da Biblioteca`,
        submessage: `Actual: ${curBooks} exemplares | Anterior (${selectedYear - 1}): ${prevBooks} volumes`
      });
    }

    const curRooms = formData.classroomsCount || 0;
    const prevRooms = previousYearSub.data.classroomsCount || 0;
    if (prevRooms > 0 && curRooms < prevRooms) {
      complianceIssues.push({
        id: 'classrooms_dec',
        type: 'warning',
        message: `Redução de Salas de Aula Físicas`,
        submessage: `Actual: ${curRooms} salas | Anterior (${selectedYear - 1}): ${prevRooms} salas`
      });
    }

    const curNewAdmissions = (formData.newAdmissionsMale || 0) + (formData.newAdmissionsFemale || 0);
    const prevNewAdmissions = (previousYearSub.data.newAdmissionsMale || 0) + (previousYearSub.data.newAdmissionsFemale || 0);
    if (prevNewAdmissions > 0 && curNewAdmissions === 0) {
      complianceIssues.push({
        id: 'new_admissions_missing',
        type: 'error',
        message: `Novos Ingressos Não Declarados`,
        submessage: `Tinha ${prevNewAdmissions} ingressos em ${selectedYear - 1} e atualmente reporta 0 para ${selectedYear}.`
      });
    }

    const curPapers = formData.scientificPapersCount || 0;
    const prevPapers = previousYearSub.data.scientificPapersCount || 0;
    if (prevPapers > 10 && curPapers === 0) {
      complianceIssues.push({
        id: 'research_missing',
        type: 'warning',
        message: `Nenhuma Publicação Científica reportada`,
        submessage: `Tinha ${prevPapers} publicações em ${selectedYear - 1} e presentemente declara 0.`
      });
    }

    const curBudget = formData.budgetExecuted || 0;
    const prevBudget = previousYearSub.data.budgetExecuted || 0;
    if (prevBudget > 0 && curBudget === 0) {
      complianceIssues.push({
        id: 'budget_missing',
        type: 'error',
        message: `Execução Orçamental Crítica Não Declarada`,
        submessage: `Foi executado MT ${prevBudget.toLocaleString()} em ${selectedYear - 1} e presentemente reporta zero.`
      });
    }
  }

  const handleInputChange = (category: keyof AcademicYearData, value: string) => {
    if (isReadOnly) return;
    const numericValue = Math.max(0, parseInt(value) || 0);
    setFormData(prev => ({
      ...prev,
      [category]: numericValue
    }));
  };

  const handleSaveDraft = () => {
    const id = submissionId || 'sub-' + currentUser.institutionId + '-' + selectedYear;
    const newSub: Submission = {
      id,
      institutionId: currentUser.institutionId || '',
      institutionName: currentUser.institutionName || 'Instituição Desconhecida',
      province: currentUser.province || 'Luanda',
      year: selectedYear,
      data: formData,
      status: 'draft',
      sentToProvince: sentToProvince,
      updatedAt: new Date().toISOString(),
    };
    onSaveSubmission(newSub);
    alert('Rascunho de dados salvos localmente com sucesso! Pode continuar a editar mais tarde.');
  };

  const handleA2CellChange = (idx: number, group: 'mocambicana' | 'estrangeira', field: 'ti' | 'tp', value: string) => {
    const updated = [...(formData.docentesGrupoEtario || [])];
    const num = parseInt(value) || 0;
    
    // Explicitly handle nested objects to avoid reference issues
    const newGroup = { ...updated[idx][group] };
    newGroup[field] = num;
    newGroup.total = (newGroup.ti || 0) + (newGroup.tp || 0);
    
    updated[idx] = { 
      ...updated[idx], 
      [group]: newGroup 
    };
    
    // Recalculate row totals
    updated[idx].totalTI = (updated[idx].mocambicana?.ti || 0) + (updated[idx].estrangeira?.ti || 0);
    updated[idx].totalTP = (updated[idx].mocambicana?.tp || 0) + (updated[idx].estrangeira?.tp || 0);
    updated[idx].totalGeral = (updated[idx].totalTI || 0) + (updated[idx].totalTP || 0);
    
    setFormData(prev => ({ ...prev, docentesGrupoEtario: updated }));
  };

  const handleA3CellChange = (idx: number, degree: 'licenciado' | 'mestre' | 'doutorado', gender: 'homens' | 'mulheres', value: string) => {
    const updated = [...(formData.docentesGrupoEtarioGrau || [])];
    const num = parseInt(value) || 0;
    
    const newDegree = { ...updated[idx][degree] };
    newDegree[gender] = num;
    newDegree.total = (newDegree.homens || 0) + (newDegree.mulheres || 0);
    
    updated[idx] = { 
      ...updated[idx], 
      [degree]: newDegree 
    };

    // Recalculate 'todos' group
    const hTotal = (updated[idx].licenciado?.homens || 0) + (updated[idx].mestre?.homens || 0) + (updated[idx].doutorado?.homens || 0);
    const mTotal = (updated[idx].licenciado?.mulheres || 0) + (updated[idx].mestre?.mulheres || 0) + (updated[idx].doutorado?.mulheres || 0);
    
    updated[idx].todos = {
      homens: hTotal,
      mulheres: mTotal,
      total: hTotal + mTotal
    };
    
    setFormData(prev => ({ ...prev, docentesGrupoEtarioGrau: updated }));
  };

  const handleA4CellChange = (idx: number, degree: 'licenciado' | 'mestre' | 'posGraduacao' | 'doutorado', gender: 'homens' | 'mulheres', value: string) => {
    const updated = [...(formData.docentesAreaFormacao || [])];
    const num = parseInt(value) || 0;
    
    const newDegree = { ...updated[idx][degree] };
    newDegree[gender] = num;
    newDegree.total = (newDegree.homens || 0) + (newDegree.mulheres || 0);
    
    updated[idx] = { 
      ...updated[idx], 
      [degree]: newDegree 
    };

    // Recalculate 'todos' group
    const hTotal = (updated[idx].licenciado?.homens || 0) + (updated[idx].mestre?.homens || 0) + (updated[idx].posGraduacao?.homens || 0) + (updated[idx].doutorado?.homens || 0);
    const mTotal = (updated[idx].licenciado?.mulheres || 0) + (updated[idx].mestre?.mulheres || 0) + (updated[idx].posGraduacao?.mulheres || 0) + (updated[idx].doutorado?.mulheres || 0);
    
    updated[idx].todos = {
      homens: hTotal,
      mulheres: mTotal,
      total: hTotal + mTotal
    };
    
    setFormData(prev => ({ ...prev, docentesAreaFormacao: updated }));
  };

  const handleA5CellChange = (idx: number, degree: 'licenciado' | 'mestre' | 'posGraduacao' | 'doutorado', gender: 'homens' | 'mulheres', value: string) => {
    const updated = [...(formData.docentesCursoFormacao || [])];
    const num = parseInt(value) || 0;
    
    const newDegree = { ...updated[idx][degree] };
    newDegree[gender] = num;
    newDegree.total = (newDegree.homens || 0) + (newDegree.mulheres || 0);
    
    updated[idx] = { 
      ...updated[idx], 
      [degree]: newDegree 
    };

    // Recalculate 'todos' group
    const hTotal = (updated[idx].licenciado?.homens || 0) + (updated[idx].mestre?.homens || 0) + (updated[idx].posGraduacao?.homens || 0) + (updated[idx].doutorado?.homens || 0);
    const mTotal = (updated[idx].licenciado?.mulheres || 0) + (updated[idx].mestre?.mulheres || 0) + (updated[idx].posGraduacao?.mulheres || 0) + (updated[idx].doutorado?.mulheres || 0);
    
    updated[idx].todos = {
      homens: hTotal,
      mulheres: mTotal,
      total: hTotal + mTotal
    };
    
    setFormData(prev => ({ ...prev, docentesCursoFormacao: updated }));
  };

  const handleA5CourseChange = (idx: number, value: string) => {
    const updated = [...(formData.docentesCursoFormacao || [])];
    updated[idx] = { ...updated[idx], curso: value };
    setFormData(prev => ({ ...prev, docentesCursoFormacao: updated }));
  };

  const handleAddRow = (field: 'docentesGrupoEtario' | 'docentesGrupoEtarioGrau' | 'docentesAreaFormacao' | 'docentesCursoFormacao' | 'docentesRegimeCategoria' | 'docentesRelacaoContractual' | 'docentesInvestigadoresNacionalidade' | 'docentesInvestigadoresNacionalidadeParcial' | 'docentesInvestigadoresAreaFormacaoTi' | 'docentesInvestigadoresAreaFormacaoTp' | 'docentesInvestigadoresTCC' | 'docentesInvestigadoresDissertacoes' | 'docentesInvestigadoresMonografias' | 'docentesInvestigadoresTeses' | 'pesquisasA91' | 'actividadesExtensaoNivelA93') => {
    setFormData(prev => {
      const current = prev[field] || [];
      let template;
      if (field === 'docentesGrupoEtario') {
        template = { classeIdade: '', mocambicana: { ti: 0, tp: 0, total: 0 }, estrangeira: { ti: 0, tp: 0, total: 0 }, totalTI: 0, totalTP: 0, totalGeral: 0 };
      } else if (field === 'docentesGrupoEtarioGrau') {
        template = { classeIdade: '', licenciado: { homens: 0, mulheres: 0, total: 0 }, mestre: { homens: 0, mulheres: 0, total: 0 }, doutorado: { homens: 0, mulheres: 0, total: 0 }, todos: { homens: 0, mulheres: 0, total: 0 } };
      } else if (field === 'docentesAreaFormacao') {
        template = { area: '', licenciado: { homens: 0, mulheres: 0, total: 0 }, mestre: { homens: 0, mulheres: 0, total: 0 }, posGraduacao: { homens: 0, mulheres: 0, total: 0 }, doutorado: { homens: 0, mulheres: 0, total: 0 }, todos: { homens: 0, mulheres: 0, total: 0 } };
      } else if (field === 'docentesCursoFormacao') {
        template = { curso: '', licenciado: { homens: 0, mulheres: 0, total: 0 }, mestre: { homens: 0, mulheres: 0, total: 0 }, posGraduacao: { homens: 0, mulheres: 0, total: 0 }, doutorado: { homens: 0, mulheres: 0, total: 0 }, todos: { homens: 0, mulheres: 0, total: 0 } };
      } else if (field === 'docentesRegimeCategoria') {
        template = { regime: '', assistenteEstagiario: { homens: 0, mulheres: 0, total: 0 }, assistente: { homens: 0, mulheres: 0, total: 0 }, professorAuxiliar: { homens: 0, mulheres: 0, total: 0 }, professorAssociado: { homens: 0, mulheres: 0, total: 0 }, professorCatedratico: { homens: 0, mulheres: 0, total: 0 }, todos: { homens: 0, mulheres: 0, total: 0 } };
      } else if (field === 'docentesRelacaoContractual') {
        template = { relacaoContractual: '', licenciado: { homens: 0, mulheres: 0, total: 0 }, mestre: { homens: 0, mulheres: 0, total: 0 }, doutorado: { homens: 0, mulheres: 0, total: 0 }, todos: { homens: 0, mulheres: 0, total: 0 } };
      } else if (field === 'docentesInvestigadoresAreaFormacaoTi' || field === 'docentesInvestigadoresAreaFormacaoTp') {
        template = { area: '', mocambicanos: { homens: 0, mulheres: 0, total: 0 }, estrangeiros: { homens: 0, mulheres: 0, total: 0 } };
      } else if (field === 'docentesInvestigadoresTCC') {
        template = { conclusaoDocente: '', nivel: '' };
      } else if (field === 'docentesInvestigadoresDissertacoes') {
        template = { dissertacoesDocente: '', nivel: '' };
      } else if (field === 'docentesInvestigadoresMonografias') {
        template = { monografiasDocente: '', nivel: '' };
      } else if (field === 'docentesInvestigadoresTeses') {
        template = { tesesDocente: '', nivel: '' };
      } else if (field === 'pesquisasA91') {
        template = { emCurso: 0, concluidas: 0 };
      } else if (field === 'actividadesExtensaoNivelA93') {
        template = { nivel: '', quantidade: 0 };
      } else { // docentesInvestigadoresNacionalidade and docentesInvestigadoresNacionalidadeParcial
        template = { nacionalidade: '', licenciatura: { homens: 0, mulheres: 0, total: 0 }, mestrado: { homens: 0, mulheres: 0, total: 0 }, doutoramento: { homens: 0, mulheres: 0, total: 0 }, posGraduacao: { homens: 0, mulheres: 0, total: 0 }, todos: { homens: 0, mulheres: 0, total: 0 } };
      }
        
      return { ...prev, [field]: [...current, template as any] };
    });
  };

  const handleA8CellChange = (idx: number, cat: 'licenciatura' | 'mestrado' | 'doutoramento' | 'posGraduacao', gender: 'homens' | 'mulheres', value: string) => {
    const updated = [...(formData.docentesInvestigadoresNacionalidade || [])];
    const num = parseInt(value) || 0;
    
    updated[idx] = {
      ...updated[idx],
      [cat]: {
        ...updated[idx][cat],
        [gender]: num,
        total: (gender === 'homens' ? num : (updated[idx][cat]?.homens || 0)) + (gender === 'mulheres' ? num : (updated[idx][cat]?.mulheres || 0))
      }
    };
    
    // Recalculate todos
    const hTotal = (updated[idx].licenciatura?.homens || 0) + (updated[idx].mestrado?.homens || 0) + (updated[idx].doutoramento?.homens || 0) + (updated[idx].posGraduacao?.homens || 0);
    const mTotal = (updated[idx].licenciatura?.mulheres || 0) + (updated[idx].mestrado?.mulheres || 0) + (updated[idx].doutoramento?.mulheres || 0) + (updated[idx].posGraduacao?.mulheres || 0);
    
    updated[idx].todos = {
      homens: hTotal,
      mulheres: mTotal,
      total: hTotal + mTotal
    };
    
    setFormData(prev => ({ ...prev, docentesInvestigadoresNacionalidade: updated }));
  };

  const handleA8NacionalidadeChange = (idx: number, value: string) => {
    const updated = [...(formData.docentesInvestigadoresNacionalidade || [])];
    updated[idx] = { ...updated[idx], nacionalidade: value };
    setFormData(prev => ({ ...prev, docentesInvestigadoresNacionalidade: updated }));
  };

  const handleA8ParcialCellChange = (idx: number, cat: 'licenciatura' | 'mestrado' | 'doutoramento' | 'posGraduacao', gender: 'homens' | 'mulheres', value: string) => {
    const updated = [...(formData.docentesInvestigadoresNacionalidadeParcial || [])];
    const num = parseInt(value) || 0;
    
    updated[idx] = {
      ...updated[idx],
      [cat]: {
        ...updated[idx][cat],
        [gender]: num,
        total: (gender === 'homens' ? num : (updated[idx][cat]?.homens || 0)) + (gender === 'mulheres' ? num : (updated[idx][cat]?.mulheres || 0))
      }
    };
    
    // Recalculate todos
    const hTotal = (updated[idx].licenciatura?.homens || 0) + (updated[idx].mestrado?.homens || 0) + (updated[idx].doutoramento?.homens || 0) + (updated[idx].posGraduacao?.homens || 0);
    const mTotal = (updated[idx].licenciatura?.mulheres || 0) + (updated[idx].mestrado?.mulheres || 0) + (updated[idx].doutoramento?.mulheres || 0) + (updated[idx].posGraduacao?.mulheres || 0);
    
    updated[idx].todos = {
      homens: hTotal,
      mulheres: mTotal,
      total: hTotal + mTotal
    };
    
    setFormData(prev => ({ ...prev, docentesInvestigadoresNacionalidadeParcial: updated }));
  };

  const handleA8ParcialNacionalidadeChange = (idx: number, value: string) => {
    const updated = [...(formData.docentesInvestigadoresNacionalidadeParcial || [])];
    updated[idx] = { ...updated[idx], nacionalidade: value };
    setFormData(prev => ({ ...prev, docentesInvestigadoresNacionalidadeParcial: updated }));
  };

  const handleA841CellChange = (idx: number, type: 'mocambicanos' | 'estrangeiros', gender: 'homens' | 'mulheres', value: string) => {
    const updated = [...(formData.docentesInvestigadoresGrupoEtarioTi || [])];
    const num = parseInt(value) || 0;
    
    updated[idx] = {
      ...updated[idx],
      [type]: {
        ...updated[idx][type],
        [gender]: num,
        total: (gender === 'homens' ? num : (updated[idx][type]?.homens || 0)) + (gender === 'mulheres' ? num : (updated[idx][type]?.mulheres || 0))
      }
    };
    
    // Recalculate total for that row
    const hTotalRow = (updated[idx].mocambicanos?.homens || 0) + (updated[idx].estrangeiros?.homens || 0);
    const mTotalRow = (updated[idx].mocambicanos?.mulheres || 0) + (updated[idx].estrangeiros?.mulheres || 0);
    
    updated[idx].total = {
      homens: hTotalRow,
      mulheres: mTotalRow,
      total: hTotalRow + mTotalRow
    };
    
    setFormData(prev => ({ ...prev, docentesInvestigadoresGrupoEtarioTi: updated }));
  };

  const handleA842CellChange = (idx: number, type: 'mocambicanos' | 'estrangeiros', gender: 'homens' | 'mulheres', value: string) => {
    const updated = [...(formData.docentesInvestigadoresGrupoEtarioTp || [])];
    const num = parseInt(value) || 0;
    
    updated[idx] = {
      ...updated[idx],
      [type]: {
        ...updated[idx][type],
        [gender]: num,
        total: (gender === 'homens' ? num : (updated[idx][type]?.homens || 0)) + (gender === 'mulheres' ? num : (updated[idx][type]?.mulheres || 0))
      }
    };
    
    const hTotalRow = (updated[idx].mocambicanos?.homens || 0) + (updated[idx].estrangeiros?.homens || 0);
    const mTotalRow = (updated[idx].mocambicanos?.mulheres || 0) + (updated[idx].estrangeiros?.mulheres || 0);
    
    updated[idx].total = {
      homens: hTotalRow,
      mulheres: mTotalRow,
      total: hTotalRow + mTotalRow
    };
    
    setFormData(prev => ({ ...prev, docentesInvestigadoresGrupoEtarioTp: updated }));
  };

  const handleA844CellChange = (idx: number, type: 'mocambicanos' | 'estrangeiros', gender: 'homens' | 'mulheres', value: string) => {
    const updated = [...(formData.docentesInvestigadoresAreaFormacaoTi || [])];
    const num = parseInt(value) || 0;
    
    updated[idx] = {
      ...updated[idx],
      [type]: {
        ...updated[idx][type],
        [gender]: num,
        total: (gender === 'homens' ? num : (updated[idx][type]?.homens || 0)) + (gender === 'mulheres' ? num : (updated[idx][type]?.mulheres || 0))
      }
    };
    
    setFormData(prev => ({ ...prev, docentesInvestigadoresAreaFormacaoTi: updated }));
  };

  const handleA844AreaChange = (idx: number, value: string) => {
    const updated = [...(formData.docentesInvestigadoresAreaFormacaoTi || [])];
    updated[idx] = { ...updated[idx], area: value };
    setFormData(prev => ({ ...prev, docentesInvestigadoresAreaFormacaoTi: updated }));
  };

  const handleA8441CellChange = (idx: number, type: 'mocambicanos' | 'estrangeiros', gender: 'homens' | 'mulheres', value: string) => {
    const updated = [...(formData.docentesInvestigadoresAreaFormacaoTp || [])];
    const num = parseInt(value) || 0;
    
    updated[idx] = {
      ...updated[idx],
      [type]: {
        ...updated[idx][type],
        [gender]: num,
        total: (gender === 'homens' ? num : (updated[idx][type]?.homens || 0)) + (gender === 'mulheres' ? num : (updated[idx][type]?.mulheres || 0))
      }
    };
    
    setFormData(prev => ({ ...prev, docentesInvestigadoresAreaFormacaoTp: updated }));
  };

  const handleA8441AreaChange = (idx: number, value: string) => {
    const updated = [...(formData.docentesInvestigadoresAreaFormacaoTp || [])];
    updated[idx] = { ...updated[idx], area: value };
    setFormData(prev => ({ ...prev, docentesInvestigadoresAreaFormacaoTp: updated }));
  };

  const handleTCCChange = (idx: number, type: 'conclusaoDocente' | 'nivel', value: string) => {
    const updated = [...(formData.docentesInvestigadoresTCC || [])];
    updated[idx] = { ...updated[idx], [type]: value };
    setFormData(prev => ({ ...prev, docentesInvestigadoresTCC: updated }));
  };

  const handleDissertacoesChange = (idx: number, type: 'dissertacoesDocente' | 'nivel', value: string) => {
    const updated = [...(formData.docentesInvestigadoresDissertacoes || [])];
    updated[idx] = { ...updated[idx], [type]: value };
    setFormData(prev => ({ ...prev, docentesInvestigadoresDissertacoes: updated }));
  };

  const handleMonografiasChange = (idx: number, type: 'monografiasDocente' | 'nivel', value: string) => {
    const updated = [...(formData.docentesInvestigadoresMonografias || [])];
    updated[idx] = { ...updated[idx], [type]: value };
    setFormData(prev => ({ ...prev, docentesInvestigadoresMonografias: updated }));
  };

  const handleTesesChange = (idx: number, type: 'tesesDocente' | 'nivel', value: string) => {
    const updated = [...(formData.docentesInvestigadoresTeses || [])];
    updated[idx] = { ...updated[idx], [type]: value };
    setFormData(prev => ({ ...prev, docentesInvestigadoresTeses: updated }));
  };

  const handlePesquisasA91Change = (idx: number, field: 'emCurso' | 'concluidas', value: string) => {
    const updated = [...(formData.pesquisasA91 || [])];
    updated[idx] = { ...updated[idx], [field]: parseInt(value) || 0 };
    setFormData(prev => ({ ...prev, pesquisasA91: updated }));
  };

  const handleActividadesExtensaoA92Change = (field: keyof NonNullable<typeof formData.actividadesExtensaoA92>, value: string) => {
    setFormData(prev => ({
      ...prev,
      actividadesExtensaoA92: {
        ...(prev.actividadesExtensaoA92 || { divulgacao: 0, prestacaoComunidade: 0, prestacaoEmpresas: 0, consultorias: 0, inovacoes: 0, outras: 0 }),
        [field]: parseInt(value) || 0
      }
    }));
  };

  const handleCtaB1Change = (idx: number, degree: 'ensinoPrimario' | 'ensinoSecundario1' | 'ensinoSecundario2' | 'bacharel' | 'licenciado' | 'mestre' | 'posGraduados' | 'doutorado', gender: 'homens' | 'mulheres', value: string) => {
    const updated = [...(formData.ctaB1 || [])];
    const num = parseInt(value) || 0;
    
    const newDegree = { ...updated[idx][degree] };
    newDegree[gender] = num;
    newDegree.total = (newDegree.homens || 0) + (newDegree.mulheres || 0);
    
    updated[idx] = { 
      ...updated[idx], 
      [degree]: newDegree 
    };

    // Recalculate 'todos' column
    const hTotal = (updated[idx].ensinoPrimario?.homens || 0) + (updated[idx].ensinoSecundario1?.homens || 0) + (updated[idx].ensinoSecundario2?.homens || 0) + (updated[idx].bacharel?.homens || 0) + (updated[idx].licenciado?.homens || 0) + (updated[idx].mestre?.homens || 0) + (updated[idx].posGraduados?.homens || 0) + (updated[idx].doutorado?.homens || 0);
    const mTotal = (updated[idx].ensinoPrimario?.mulheres || 0) + (updated[idx].ensinoSecundario1?.mulheres || 0) + (updated[idx].ensinoSecundario2?.mulheres || 0) + (updated[idx].bacharel?.mulheres || 0) + (updated[idx].licenciado?.mulheres || 0) + (updated[idx].mestre?.mulheres || 0) + (updated[idx].posGraduados?.mulheres || 0) + (updated[idx].doutorado?.mulheres || 0);
    
    updated[idx].todos = {
      homens: hTotal,
      mulheres: mTotal,
      total: hTotal + mTotal
    };
    
    setFormData(prev => ({ ...prev, ctaB1: updated }));
  };

  const handleCtaB2Change = (idx: number, degree: 'ensinoPrimario' | 'ensinoSecundario1' | 'ensinoSecundario2' | 'bacharel' | 'licenciado' | 'mestre' | 'posGraduados' | 'doutorado', gender: 'homens' | 'mulheres', value: string) => {
    const updated = [...(formData.ctaB2 || [])];
    const num = parseInt(value) || 0;
    
    const newDegree = { ...updated[idx][degree] };
    newDegree[gender] = num;
    newDegree.total = (newDegree.homens || 0) + (newDegree.mulheres || 0);
    
    updated[idx] = { 
      ...updated[idx], 
      [degree]: newDegree 
    };

    // Recalculate 'todos' column
    const hTotal = (updated[idx].ensinoPrimario?.homens || 0) + (updated[idx].ensinoSecundario1?.homens || 0) + (updated[idx].ensinoSecundario2?.homens || 0) + (updated[idx].bacharel?.homens || 0) + (updated[idx].licenciado?.homens || 0) + (updated[idx].mestre?.homens || 0) + (updated[idx].posGraduados?.homens || 0) + (updated[idx].doutorado?.homens || 0);
    const mTotal = (updated[idx].ensinoPrimario?.mulheres || 0) + (updated[idx].ensinoSecundario1?.mulheres || 0) + (updated[idx].ensinoSecundario2?.mulheres || 0) + (updated[idx].bacharel?.mulheres || 0) + (updated[idx].licenciado?.mulheres || 0) + (updated[idx].mestre?.mulheres || 0) + (updated[idx].posGraduados?.mulheres || 0) + (updated[idx].doutorado?.mulheres || 0);
    
    updated[idx].todos = {
      homens: hTotal,
      mulheres: mTotal,
      total: hTotal + mTotal
    };
    
    setFormData(prev => ({ ...prev, ctaB2: updated }));
  };

  const handleCtaB3Change = (idx: number, degree: 'ensinoPrimario' | 'ensinoSecundario1' | 'ensinoSecundario2' | 'bacharel' | 'licenciado' | 'mestre' | 'posGraduados' | 'doutorado', gender: 'homens' | 'mulheres', value: string) => {
    const updated = [...(formData.ctaB3 || [])];
    const num = parseInt(value) || 0;
    
    const newDegree = { ...updated[idx][degree] };
    newDegree[gender] = num;
    newDegree.total = (newDegree.homens || 0) + (newDegree.mulheres || 0);
    
    updated[idx] = { 
      ...updated[idx], 
      [degree]: newDegree 
    };

    // Recalculate 'todos' column
    const hTotal = (updated[idx].ensinoPrimario?.homens || 0) + (updated[idx].ensinoSecundario1?.homens || 0) + (updated[idx].ensinoSecundario2?.homens || 0) + (updated[idx].bacharel?.homens || 0) + (updated[idx].licenciado?.homens || 0) + (updated[idx].mestre?.homens || 0) + (updated[idx].posGraduados?.homens || 0) + (updated[idx].doutorado?.homens || 0);
    const mTotal = (updated[idx].ensinoPrimario?.mulheres || 0) + (updated[idx].ensinoSecundario1?.mulheres || 0) + (updated[idx].ensinoSecundario2?.mulheres || 0) + (updated[idx].bacharel?.mulheres || 0) + (updated[idx].licenciado?.mulheres || 0) + (updated[idx].mestre?.mulheres || 0) + (updated[idx].posGraduados?.mulheres || 0) + (updated[idx].doutorado?.mulheres || 0);
    
    updated[idx].todos = {
      homens: hTotal,
      mulheres: mTotal,
      total: hTotal + mTotal
    };
    
    setFormData(prev => ({ ...prev, ctaB3: updated }));
  };

  const handleCtaB4Change = (idx: number, group: 'mocambicana' | 'estrangeira', type: 'ti' | 'tp', value: string) => {
    const updated = [...(formData.ctaB4 || [])];
    const num = parseInt(value) || 0;
    
    updated[idx] = { ...updated[idx] };
    updated[idx][group] = { ...updated[idx][group], [type]: num };
    updated[idx][group].total = (updated[idx][group].ti || 0) + (updated[idx][group].tp || 0);
    
    // Recalculate totals
    updated[idx].totalTI = (updated[idx].mocambicana?.ti || 0) + (updated[idx].estrangeira?.ti || 0);
    updated[idx].totalTP = (updated[idx].mocambicana?.tp || 0) + (updated[idx].estrangeira?.tp || 0);
    updated[idx].totalGeral = updated[idx].totalTI + updated[idx].totalTP;
    
    setFormData(prev => ({ ...prev, ctaB4: updated }));
  };

  const handleCtaB4ClasseIdadeChange = (idx: number, value: string) => {
    const updated = [...(formData.ctaB4 || [])];
    updated[idx] = { ...updated[idx], classeIdade: value };
    setFormData(prev => ({ ...prev, ctaB4: updated }));
  };

  const handleAddCtaB4Row = () => {
    setFormData(prev => ({
      ...prev,
      ctaB4: [
        ...(prev.ctaB4 || []), 
        { classeIdade: 'Nova Classe', mocambicana: { ti: 0, tp: 0, total: 0 }, estrangeira: { ti: 0, tp: 0, total: 0 }, totalTI: 0, totalTP: 0, totalGeral: 0 }
      ]
    }));
  };

  const handleAddCtaB2Row = () => {
    setFormData(prev => ({
      ...prev,
      ctaB2: [
        ...(prev.ctaB2 || []), 
        { nacionalidade: 'Nova', todos: { homens: 0, mulheres: 0, total: 0 }, ensinoPrimario: { homens: 0, mulheres: 0, total: 0 }, ensinoSecundario1: { homens: 0, mulheres: 0, total: 0 }, ensinoSecundario2: { homens: 0, mulheres: 0, total: 0 }, bacharel: { homens: 0, mulheres: 0, total: 0 }, licenciado: { homens: 0, mulheres: 0, total: 0 }, mestre: { homens: 0, mulheres: 0, total: 0 }, posGraduados: { homens: 0, mulheres: 0, total: 0 }, doutorado: { homens: 0, mulheres: 0, total: 0 } }
      ]
    }));
  };

  const handleAddCtaB3Row = () => {
    setFormData(prev => ({
      ...prev,
      ctaB3: [
        ...(prev.ctaB3 || []), 
        { tipoRelacao: 'Nova', ensinoPrimario: { homens: 0, mulheres: 0, total: 0 }, ensinoSecundario1: { homens: 0, mulheres: 0, total: 0 }, ensinoSecundario2: { homens: 0, mulheres: 0, total: 0 }, bacharel: { homens: 0, mulheres: 0, total: 0 }, licenciado: { homens: 0, mulheres: 0, total: 0 }, mestre: { homens: 0, mulheres: 0, total: 0 }, posGraduados: { homens: 0, mulheres: 0, total: 0 }, doutorado: { homens: 0, mulheres: 0, total: 0 } }
      ]
    }));
  };

  const handleDespesasChange = (idx: number, value: string) => {
    const updated = [...(formData.despesasIES || [
      { rubrica: 'Despesas de Funcionamento', valor: 0 },
      { rubrica: 'Despesas de Investimento', valor: 0 },
      { rubrica: 'Total', valor: 0 }
    ])];
    const num = parseInt(value) || 0;
    updated[idx] = { ...updated[idx], valor: num };
    
    // Recalculate Total
    const funcionamento = updated.find(r => r.rubrica === 'Despesas de Funcionamento')?.valor || 0;
    const investimento = updated.find(r => r.rubrica === 'Despesas de Investimento')?.valor || 0;
    const totalIdx = updated.findIndex(r => r.rubrica === 'Total');
    if (totalIdx !== -1) {
      updated[totalIdx] = { ...updated[totalIdx], valor: funcionamento + investimento };
    }
    
    setFormData(prev => ({ ...prev, despesasIES: updated }));
  };

  const handleFinanciamentoChange = (idx: number, value: string) => {
    const updated = [...(formData.financiamentoIES || [
      { fonte: 'Orçamento Geral do Estado (OGE)', valor: 0 },
      { fonte: 'Doações (internas e externas)', valor: 0 },
      { fonte: 'Créditos', valor: 0 },
      { fonte: 'Receitas próprias', valor: 0 },
      { fonte: 'Total', valor: 0 }
    ])];
    const num = parseInt(value) || 0;
    updated[idx] = { ...updated[idx], valor: num };
    
    // Recalculate Total
    const oge = updated.find(r => r.fonte === 'Orçamento Geral do Estado (OGE)')?.valor || 0;
    const doacoes = updated.find(r => r.fonte === 'Doações (internas e externas)')?.valor || 0;
    const creditos = updated.find(r => r.fonte === 'Créditos')?.valor || 0;
    const receitas = updated.find(r => r.fonte === 'Receitas próprias')?.valor || 0;
    const totalIdx = updated.findIndex(r => r.fonte === 'Total');
    if (totalIdx !== -1) {
      updated[totalIdx] = { ...updated[totalIdx], valor: oge + doacoes + creditos + receitas };
    }
    
    setFormData(prev => ({ ...prev, financiamentoIES: updated }));
  };

  const handleDespesaDetalhadaChange = (categoria: string, value: string) => {
    const updated = [...(formData.despesaFuncionamentoInvestimentoIES || [
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
    ])];
    const num = parseInt(value) || 0;
    const idx = updated.findIndex(r => r.categoria === categoria);
    if (idx !== -1) {
      updated[idx] = { ...updated[idx], valor: num };
    } else {
      updated.push({ categoria, valor: num });
    }
    setFormData(prev => ({ ...prev, despesaFuncionamentoInvestimentoIES: updated }));
  };

  const handleLaboratoriosChange = (newLaboratorios: any[]) => {
    const totalLabs = newLaboratorios.reduce((sum, r) => sum + (Number(r.numLaboratorios) || 0), 0);
    setFormData(prev => ({
      ...prev,
      laboratoriosIES: newLaboratorios,
      laboratoriesCount: totalLabs
    }));
  };

  const handleSalasAulaChange = (newSalas: any[]) => {
    const totalRooms = newSalas.reduce((sum, r) => sum + (Number(r.numSalas) || 0), 0);
    setFormData(prev => ({
      ...prev,
      salasAulaIES: newSalas,
      classroomsCount: totalRooms
    }));
  };

  const handleBibliotecasChange = (newBibliotecas: any[]) => {
    setFormData(prev => ({
      ...prev,
      bibliotecasIES: newBibliotecas
    }));
  };

  const handleComputadoresChange = (newComputadores: any[]) => {
    const totalComputadores = newComputadores.reduce((sum, r) => sum + (Number(r.numComputadores) || 0), 0);
    setFormData(prev => ({
      ...prev,
      computadoresIES: newComputadores,
      computersCount: totalComputadores
    }));
  };

  const handlePrevisaoChange = (newPrevisao: any[]) => {
    setFormData(prev => ({
      ...prev,
      previsaoEstudantesMatriculados: newPrevisao
    }));
  };

  const handleActividadesExtensaoNivelA93Change = (idx: number, type: 'nivel' | 'quantidade', value: string) => {
    const updated = [...(formData.actividadesExtensaoNivelA93 || [])];
    if (type === 'quantidade') {
      updated[idx] = { ...updated[idx], [type]: parseInt(value) || 0 };
    } else {
      updated[idx] = { ...updated[idx], [type]: value };
    }
    setFormData(prev => ({ ...prev, actividadesExtensaoNivelA93: updated }));
  };

  const handleA6CellChange = (idx: number, cat: 'assistenteEstagiario' | 'assistente' | 'professorAuxiliar' | 'professorAssociado' | 'professorCatedratico', gender: 'homens' | 'mulheres', value: string) => {
    const updated = [...(formData.docentesRegimeCategoria || [])];
    const num = parseInt(value) || 0;
    
    const newCat = { ...updated[idx][cat] };
    newCat[gender] = num;
    newCat.total = (newCat.homens || 0) + (newCat.mulheres || 0);
    
    updated[idx] = { 
      ...updated[idx], 
      [cat]: newCat 
    };

    // Recalculate 'todos' column
    const hTotal = (updated[idx].assistenteEstagiario?.homens || 0) + (updated[idx].assistente?.homens || 0) + (updated[idx].professorAuxiliar?.homens || 0) + (updated[idx].professorAssociado?.homens || 0) + (updated[idx].professorCatedratico?.homens || 0);
    const mTotal = (updated[idx].assistenteEstagiario?.mulheres || 0) + (updated[idx].assistente?.mulheres || 0) + (updated[idx].professorAuxiliar?.mulheres || 0) + (updated[idx].professorAssociado?.mulheres || 0) + (updated[idx].professorCatedratico?.mulheres || 0);
    
    updated[idx].todos = {
      homens: hTotal,
      mulheres: mTotal,
      total: hTotal + mTotal
    };
    
    setFormData(prev => ({ ...prev, docentesRegimeCategoria: updated }));
  };

  const handleA7CellChange = (idx: number, degree: 'licenciado' | 'mestre' | 'doutorado', gender: 'homens' | 'mulheres', value: string) => {
    const updated = [...(formData.docentesRelacaoContractual || [])];
    const num = parseInt(value) || 0;
    
    const newDegree = { ...updated[idx][degree] };
    newDegree[gender] = num;
    newDegree.total = (newDegree.homens || 0) + (newDegree.mulheres || 0);
    
    updated[idx] = { 
      ...updated[idx], 
      [degree]: newDegree 
    };

    // Recalculate 'todos' column
    const hTotal = (updated[idx].licenciado?.homens || 0) + (updated[idx].mestre?.homens || 0) + (updated[idx].doutorado?.homens || 0);
    const mTotal = (updated[idx].licenciado?.mulheres || 0) + (updated[idx].mestre?.mulheres || 0) + (updated[idx].doutorado?.mulheres || 0);
    
    updated[idx].todos = {
      homens: hTotal,
      mulheres: mTotal,
      total: hTotal + mTotal
    };
    
    setFormData(prev => ({ ...prev, docentesRelacaoContractual: updated }));
  };

  const handleA7RelacaoChange = (idx: number, value: string) => {
    const updated = [...(formData.docentesRelacaoContractual || [])];
    updated[idx] = { ...updated[idx], relacaoContractual: value };
    setFormData(prev => ({ ...prev, docentesRelacaoContractual: updated }));
  };

  const handleSubmitCentral = () => {
    if (formData.studentsMale === 0 && formData.studentsFemale === 0) {
      alert('Atenção: O total de estudantes não pode ser nulo.');
      return;
    }
    if (formData.teachersFullTime === 0 && formData.teachersPartTime === 0) {
      alert('Atenção: Deve declarar pelo menos um docente em regime laboral.');
      return;
    }

    // Mathematical logical validations
    if (formData.teachersWithPhD + formData.teachersWithMasters + formData.teachersWithBachelors > 
        (formData.teachersFullTime + formData.teachersPartTime)) {
      alert('Inconsistência Numérica:\nA soma de Professores Titulados (PhD, Mestres, Licenciados) excede o total global de professores declarados.');
      return;
    }

    if (formData.newAdmissionsMale + formData.newAdmissionsFemale > 
        (formData.studentsMale + formData.studentsFemale)) {
      alert('Inconsistência Numérica:\nO volume de novos alunos registados excede o total absoluto da população estudantil da IES.');
      return;
    }

    // Year-Over-Year Quality Assurance Checks (Garantia de Conformidade)
    const criticalErrors = complianceIssues.filter(i => i.type === 'error');
    if (criticalErrors.length > 0) {
      alert(`[ERRO DE CONFORMIDADE ESTRITA]\nNão é possível submeter o relatório. Foram detectados erros críticos de inconformidade com os dados do ano anterior (${selectedYear - 1}):\n\n` + 
        criticalErrors.map(e => `❌ ${e.message}\n   -> ${e.submessage}`).join('\n\n') + 
        `\n\nPor favor, corrija estes dados antes de submeter.`);
      return;
    }

    const warningIssues = complianceIssues.filter(i => i.type === 'warning');
    if (warningIssues.length > 0) {
      const confirmSubmit = window.confirm(`[AVISO DE SANEAMENTO E QUALIDADE DE DADOS]\nEncontramos alertas de desvio incomum comparado ao ano de ${selectedYear - 1}:\n\n` +
        warningIssues.map(w => `⚠️ ${w.message}\n   -> ${w.submessage}`).join('\n\n') +
        `\n\nDeseja avançar com a submissão mesmo com estas anomalias reportadas? (O Ministério será notificado destas discrepâncias estatísticas).`);
      if (!confirmSubmit) {
        return;
      }
    }

    const id = submissionId || 'sub-' + currentUser.institutionId + '-' + selectedYear;
    const newSub: Submission = {
      id,
      institutionId: currentUser.institutionId || '',
      institutionName: currentUser.institutionName || 'Instituição Desconhecida',
      province: currentUser.province || 'Luanda',
      year: selectedYear,
      data: formData,
      status: 'pending_central',
      sentToProvince: sentToProvince,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSaveSubmission(newSub);
    alert('Formulário estatístico submetido com sucesso para validação central!\nOs dados agora estão em revisão do Ministério.');
  };

  const handleShareProvince = () => {
    const id = submissionId || 'sub-' + currentUser.institutionId + '-' + selectedYear;
    
    // Save first then trigger provincial transmit
    const newSub: Submission = {
      id,
      institutionId: currentUser.institutionId || '',
      institutionName: currentUser.institutionName || 'Instituição Desconhecida',
      province: currentUser.province || 'Luanda',
      year: selectedYear,
      data: formData,
      status: submissionStatus === 'not_created' ? 'draft' : submissionStatus,
      sentToProvince: true,
      updatedAt: new Date().toISOString(),
    };
    onSaveSubmission(newSub);
    onSendToProvince(id);
    setSentToProv(true);
    alert(`Dados do relatório de ${selectedYear} partilhados oficialmente com o Gabinete Provincial de Estatística de ${currentUser.province}.`);
  };

  const loadHistoricalToForm = (sub: Submission) => {
    if (sub.year < 2026) {
        alert('Área Bloqueada: Só é permitido o acesso ao Resumo e Relatório.');
        return;
    }
    setSelectedYear(sub.year);
    setActiveTab('form');
    setFormSubTab('capa');
  };

  // Real-time Calculadores pointers
  const totalStudents = formData.studentsMale + formData.studentsFemale;
  const femalePercentage = totalStudents > 0 ? ((formData.studentsFemale / totalStudents) * 100).toFixed(1) : '0';
  const totalTeachers = formData.teachersFullTime + formData.teachersPartTime;
  const teacherStudentRatio = totalTeachers > 0 ? (totalStudents / totalTeachers).toFixed(1) : '0';
  const labsRatio = totalStudents > 0 ? (totalStudents / (formData.laboratoriesCount || 1)).toFixed(0) : '0';

// Dropdown navigation for all quadros
  const [isNavOpen, setIsNavOpen] = useState(false);
  const handleNavigate = (type: string) => {
    setFormSubTab(type as any);
    setIsNavOpen(false);
  };

  const getSectionStats = (subTab: string) => {
    const idx = cardConfigs.findIndex(c => c.type === subTab);
    if (idx !== -1 && idx > 0) {
      const eixoNum = idx + 1;
      const customQuadros = formData.customQuadros || {};
      let filledCount = 0;
      for (let q = 0; q <= 10; q++) {
        const key = `eixo_${eixoNum}_q${q}`;
        if (customQuadros[key] && customQuadros[key].length > 0) {
          filledCount++;
        }
      }
      if (filledCount > 0) {
        return {
          isFilled: true,
          label: `${filledCount} de 11 Quadros`,
          color: 'bg-indigo-50 text-indigo-800 border-indigo-200'
        };
      } else {
        return {
          isFilled: false,
          label: 'Pendente',
          color: 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
    }

    switch (subTab) {
      case 'docente': {
        const total = formData.teachersFullTime + formData.teachersPartTime;
        const isFilled = total > 0;
        return {
          isFilled,
          label: isFilled ? `${total} Docentes` : 'Pendente',
          color: isFilled ? 'bg-indigo-50 text-indigo-800 border-indigo-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'cta': {
        const total = formData.staffMale + formData.staffFemale;
        const isFilled = total > 0;
        return {
          isFilled,
          label: isFilled ? `${total} Colaboradores` : 'Pendente',
          color: isFilled ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'investigadores': {
        const count = formData.researchersCount || 0;
        const papers = formData.scientificPapersCount || 0;
        const isFilled = count > 0 || papers > 0;
        return {
          isFilled,
          label: isFilled ? `${count} Pesq. / ${papers} Art.` : 'Pendente',
          color: isFilled ? 'bg-sky-50 text-sky-800 border-sky-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'previsao': {
        const isFilled = (formData.forecastStudents || 0) > 0 || (formData.forecastTeachers || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `Ano N+1 Def.` : 'Pendente',
          color: isFilled ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'financas': {
        const hasDespesas = (formData.despesasIES || []).some(d => d.valor > 0);
        const hasFinancias = (formData.financiamentoIES || []).some(f => f.valor > 0);
        const hasDetalhada = (formData.despesaFuncionamentoInvestimentoIES || []).some(d => d.valor > 0);
        const isFilled = hasDespesas || hasFinancias || hasDetalhada;
        const totalDespesas = (formData.despesasIES?.find(r => r.rubrica === 'Total')?.valor || 0);
        return {
          isFilled,
          label: isFilled ? `Registado (Desp: ${totalDespesas.toLocaleString('pt-PT')} MT)` : 'Pendente',
          color: isFilled ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'infraestrutura': {
        const hasLabs = (formData.laboratoriosIES || []).some(l => (l.numLaboratorios || 0) > 0);
        const hasSalas = (formData.salasAulaIES || []).some(s => (s.numSalas || 0) > 0);
        const hasLibs = (formData.bibliotecasIES || []).some(b => (b.numFisicas || 0) > 0 || (b.numVirtuais || 0) > 0);
        const hasComputers = (formData.computadoresIES || []).some(c => (c.numComputadores || 0) > 0);
        const isFilled = (formData.classroomsCount || 0) > 0 || hasLabs || hasSalas || hasLibs || hasComputers;
        const totalLabs = formData.laboratoriesCount || (formData.laboratoriosIES || []).reduce((sum, l) => sum + (l.numLaboratorios || 0), 0);
        const totalSalas = formData.classroomsCount || (formData.salasAulaIES || []).reduce((sum, s) => sum + (s.numSalas || 0), 0);
        const totalLibs = (formData.bibliotecasIES || []).reduce((sum, b) => sum + (b.numFisicas || 0) + (b.numVirtuais || 0), 0);
        const totalComputers = (formData.computadoresIES || []).reduce((sum, c) => sum + (c.numComputadores || 0), 0);
        return {
          isFilled,
          label: isFilled ? `${totalSalas || 0} Salas / ${totalLabs || 0} Labs / ${totalLibs || 0} Bibs / ${totalComputers || 0} PCs` : 'Pendente',
          color: isFilled ? 'bg-teal-50 text-teal-800 border-teal-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'tic': {
        const isFilled = (formData.computersWithInternet || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.computersWithInternet} PCs c/ Net` : 'Pendente',
          color: isFilled ? 'bg-cyan-50 text-cyan-800 border-cyan-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'biblioteca': {
        const isFilled = (formData.libraryBooksCount || 0) > 0 || (formData.libraryCapcity || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.libraryBooksCount || 0} Livros` : 'Pendente',
          color: isFilled ? 'bg-violet-50 text-violet-800 border-violet-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'discente':
      case 'procura_es': {
        const isFilled = (formData.coursesProcuraES?.length || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.coursesProcuraES?.length} Cursos` : 'Pendente',
          color: isFilled ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'vagas_preenchidas': {
        const isFilled = (formData.coursesVagasPreenchidas?.length || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.coursesVagasPreenchidas?.length} Cursos` : 'Pendente',
          color: isFilled ? 'bg-orange-50 text-orange-800 border-orange-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'estudantes_dinamica': {
        const isFilled = (formData.coursesEstudantesDinamica?.length || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.coursesEstudantesDinamica?.length} Cursos` : 'Pendente',
          color: isFilled ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'nacionalidade_dinamica': {
        const isFilled = (formData.nacionalidadeDinamica?.novosIngressosMocambicana.homens || 0) > 0 || (formData.nacionalidadeDinamica?.graduadosEstrangeira.mulheres || 0) > 0;
        return {
          isFilled,
          label: isFilled ? 'Preenchido' : 'Pendente',
          color: isFilled ? 'bg-sky-50 text-sky-800 border-sky-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'estudantes_estrangeiros': {
        const isFilled = (formData.coursesEstudantesEstrangeiros?.length || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.coursesEstudantesEstrangeiros?.length} Cursos` : 'Pendente',
          color: isFilled ? 'bg-pink-50 text-pink-800 border-pink-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'estudantes_needs_especiais': {
        const isFilled = (formData.coursesNeedsEspeciais?.length || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.coursesNeedsEspeciais?.length} Cursos` : 'Pendente',
          color: isFilled ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'estudantes_needs_especiais_outros': {
        const isFilled = (formData.coursesNeedsEspeciaisOutros?.length || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.coursesNeedsEspeciaisOutros?.length} Cursos` : 'Pendente',
          color: isFilled ? 'bg-orange-50 text-orange-800 border-orange-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'estudantes_provincia_conclusao': {
        const isFilled = (formData.provinciaConclusao12Classe?.length || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.provinciaConclusao12Classe?.length} Províncias` : 'Pendente',
          color: isFilled ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'estudantes_provincia_naturalidade': {
        const isFilled = (formData.provinciaNaturalidade?.length || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.provinciaNaturalidade?.length} Províncias` : 'Pendente',
          color: isFilled ? 'bg-indigo-50 text-indigo-800 border-indigo-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'estudantes_faixa_etaria': {
        const isFilled = (formData.faixaEtaria?.length || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.faixaEtaria?.length} Faixas` : 'Pendente',
          color: isFilled ? 'bg-cyan-50 text-cyan-800 border-cyan-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'graduados_primeira_matricula': {
        const isFilled = (formData.graduadosAnoPrimeiraMatricula?.length || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.graduadosAnoPrimeiraMatricula?.length} Cursos` : 'Pendente',
          color: isFilled ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'curta_duracao_matriculados': {
        const isFilled = (formData.coursesCurtaDuracaoEspecializacao?.length || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.coursesCurtaDuracaoEspecializacao?.length} Cursos` : 'Pendente',
          color: isFilled ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'cursos_curta_duracao_graduados': {
        const isFilled = (formData.coursesCurtaDuracaoEspecializacaoGraduados?.length || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.coursesCurtaDuracaoEspecializacaoGraduados?.length} Cursos` : 'Pendente',
          color: isFilled ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'estudantes_bolseiros': {
        const isFilled = (formData.estudantesBolseiros?.length || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.estudantesBolseiros?.length} Bolseiros` : 'Pendente',
          color: isFilled ? 'bg-violet-50 text-violet-800 border-violet-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'bolseiros_faixa_etaria': {
        const isFilled = (formData.estudantesBolseirosFaixaEtaria?.length || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.estudantesBolseirosFaixaEtaria?.length} Faixas` : 'Pendente',
          color: isFilled ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'bolseiros_provincia_naturalidade': {
        const isFilled = (formData.estudantesBolseirosProvinciaNaturalidade?.length || 0) > 0;
        return {
          isFilled,
          label: isFilled ? `${formData.estudantesBolseirosProvinciaNaturalidade?.length} Províncias` : 'Pendente',
          color: isFilled ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      case 'eixo_8_q1': {
        const isFilled = (formData.previsaoEstudantesMatriculados?.length || 0) > 0 && formData.previsaoEstudantesMatriculados.some(r => r.nomeCurso && r.total > 0);
        const total = (formData.previsaoEstudantesMatriculados || []).reduce((sum, r) => sum + (r.total || 0), 0);
        const courseCount = (formData.previsaoEstudantesMatriculados || []).filter(r => r.nomeCurso).length;
        return {
          isFilled,
          label: isFilled ? `${courseCount} Cursos (${total} Est.)` : 'Pendente',
          color: isFilled ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'
        };
      }
      default:
        return { isFilled: false, label: 'Pendente', color: 'bg-slate-50 border-slate-200 text-slate-400' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Path Indicator strictly matching the screenshot */}
      <div className="bg-white border-[3px] border-black rounded-[14px] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] select-none" id="workspace-navigator">
        <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800">
          {!isBlocked && (
            <button 
              type="button" 
              onClick={() => setActiveTab(activeTab === 'form' ? 'history' : 'form')}
              className="flex items-center gap-1 hover:text-slate-600 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="h-4 w-4 text-slate-800 stroke-[3]" />
              <span className="font-mono text-slate-400">|</span>
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-amber-500 fill-amber-200 shrink-0" />
            <span className="text-sm font-black font-mono tracking-tight">Navegando em: <span className=" italic font-extrabold text-blue-900 border-b-2 border-[#fec107]">Estatística</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtle switcher for Form vs History */}
            <button
              onClick={() => alert('Área Bloqueada: Só é permitido o acesso ao Resumo e Relatório.')}
className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-[2px] border-black  opacity-50 bg-slate-300 text-slate-500`}
>
              Formulário Corrente
            </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-[2px] border-black flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-[#fec107] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]' : 'bg-white text-slate-700'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Histórico de Submissões
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-[2px] border-black  ${
              activeTab === 'report' ? 'bg-[#fec107] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]' : 'bg-white text-slate-500'
            }`}
          >
            Relatório
          </button>
        </div>
      </div>

      {(activeTab === 'form' && !isBlocked) ? (
        formSubTab === 'capa' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="form-menu-grid-root">
            
            {/* Middle Columns: Year Selector + 9 Cards Hub (SPAN 2) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Personalização da Instituição de Ensino Superior */}
              {myInstitution && (
                <div className="bg-slate-900 text-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white border-2 border-black rounded-xl flex items-center justify-center overflow-hidden p-1.5 shrink-0 shadow-sm">
                        {myInstitution.logoUrl ? (
                          <a href="/" title="Voltar ao início">
                              <img 
                                src={myInstitution.logoUrl} 
                                alt={`${myInstitution.abbreviation || 'Logótipo'} Logo`} 
                                className="w-full h-full object-contain mix-blend-multiply"
                                style={{ mixBlendMode: 'multiply' }}
                              />
                          </a>
                        ) : (
                          <GraduationCap className="h-8 w-8 text-slate-800" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase bg-[#fec107] text-slate-950 px-2 py-0.5 rounded tracking-wider">
                            {myInstitution.type}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            ID: {myInstitution.id.toUpperCase()}
                          </span>
                        </div>
                        <h2 className="text-xl md:text-2xl  font-black text-white mt-2 leading-tight uppercase tracking-tight">
                          {myInstitution.name}
                        </h2>
                        <p className="text-xs text-slate-350 leading-none mt-2 ">
                          Sigla Oficial: <strong className="text-white uppercase tracking-widest">{myInstitution.abbreviation}</strong>
                          {myInstitution.rector && (
                            <> • Responsável Máximo: <strong className="text-white italic">{myInstitution.rector}</strong></>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-850 text-xs">
                    <div 
                      onClick={() => setFormSubTab('estudantes_provincia_naturalidade')}
                      className="bg-slate-800 p-4 rounded-xl border-2 border-slate-700 cursor-pointer hover:bg-slate-750 hover:border-emerald-500 transition-all group"
                      title="Clique para ir ao preenchimento de naturalidade dos estudantes"
                    >
                      <span className="text-xs uppercase font-black text-slate-500 block tracking-[0.2em] group-hover:text-emerald-400 transition-colors ">Localização Registada ➔</span>
                      <p className="text-slate-200 mt-2  font-bold text-sm italic">
                        Província de {myInstitution.province}{myInstitution.district ? `, Distrito de ${myInstitution.district}` : ''}
                      </p>
                    </div>
                    <div 
                      onClick={() => setShowCourseModal(true)}
                      className="bg-slate-800 p-4 rounded-xl border-2 border-slate-700 cursor-pointer transition-all group"
                      title="Cursos de Funcionamento Ativo"
                    >
                      <span className="text-xs uppercase font-black text-slate-500 block tracking-[0.2em] ">Cursos de Funcionamento Ativo</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {instCourses.length > 0 ? (
                          instCourses.slice(0, 4).map((c, idx) => (
                            <span key={idx} className="bg-slate-700 text-slate-200 text-xs px-3 py-1 rounded-lg border border-slate-600 font-black  uppercase tracking-tighter">
                              {c}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic text-xs ">Nenhum curso associado.</span>
                        )}
                        {instCourses.length > 4 && (
                          <span className="text-slate-400 font-black text-xs self-center ">
                            +{instCourses.length - 4} mais
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Year Selector and Status notice */}
              <div className="bg-white border-[3px] border-black rounded-[20px] p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">Ano Letivo de Coleta:</span>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      disabled={submissionStatus === 'pending_central' || submissionStatus === 'approved'}
                      className="ml-1 bg-slate-50 font-bold text-slate-800 border border-slate-200 text-xs px-2 py-1 rounded focus:outline-emerald-500"
                    >
                      <option value={2026}>Estatística 2026 (Decorre em 2027)</option>
                      <option value={2025}>Estatística 2025 (Decorre em 2026)</option>
                      <option value={2024}>Estatística 2024 (Decorre em 2025)</option>
                      <option value={2023}>Estatística 2023 (Decorre em 2024)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-500 font-medium">Estado do Relatório ({selectedYear}):</span>
                    {submissionStatus === 'not_created' && (
                      <span className="font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Não Iniciado</span>
                    )}
                    {submissionStatus === 'draft' && (
                      <span className="font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">Rascunho Local</span>
                    )}
                    {submissionStatus === 'pending_central' && (
                      <span className="font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Enviado à Central
                      </span>
                    )}
                    {submissionStatus === 'approved' && (
                      <span className="font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Aprovado pelo Ministério
                      </span>
                    )}
                    {submissionStatus === 'rejected' && (
                      <span className="font-bold text-red-650 bg-red-50 border border-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Rejeitado / Correção Necessária
                      </span>
                    )}
                  </div>
                </div>
                
                {selectedYear < new Date().getFullYear() && (
                  <div className="mt-4 bg-amber-50/50 border-2 border-amber-500 rounded-xl p-4 text-xs text-amber-900 leading-relaxed space-y-1.5 shadow-[2px_2px_0px_rgba(245,158,11,1)]">
                    <strong className="font-bold text-amber-950 block flex items-center gap-1.5 ">
                      🔒 ANO ESTATÍSTICO ENCERRADO (SÓ LEITURA):
                    </strong>
                    <p>
                      Como o ciclo de <strong>{selectedYear}</strong> já se encontra encerrado, todas as informações correspondentes encontram-se bloqueadas para edição, gravação ou envio. Este painel destina-se estritamente à consulta do histórico e auditoria subsequente.
                    </p>
                  </div>
                )}

                {rejectionNotes && (
                  <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-4 text-xs text-red-800 leading-relaxed space-y-1">
                    <strong className="font-bold text-red-900 block flex items-center gap-1">
                      <CircleAlert className="h-4 w-4 shrink-0" /> Mensagem de Ajustes da Direção Central (MEC):
                    </strong>
                    <p className="italic">{rejectionNotes}</p>
                    <p className="text-xs text-red-600 pt-1">Corrija os erros assinalados e abra as categorias abaixo para re-submeter os ajustes.</p>
                  </div>
                )}
              </div>

              {/* Launcher Hub of 9 independent-page forms */}
              <div className="space-y-4">
                <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-base sm:text-lg  font-black text-slate-900 uppercase">Eixos de Coleta Estatística — Ano {selectedYear}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Cada ícone abaixo corresponde a uma página de formulário independente. Selecione uma seção para iniciar ou retificar o preenchimento. Após preencher todas as secções, use o painel à direita para submeter definitivamente ao Ministério de Ensino.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pt-1" id="eixos-launcher-grid">
                  {(() => {
                    const EIXOS_MAP: Record<string, string> = {
                      'Eixo 1': 'identificacao',
                      'Eixo 2': 'discente',
                      'Eixo 3': 'docente',
                      'Eixo 4': 'investigadores',
                      'Eixo 5': 'cta',
                      'Eixo 6': 'financas',
                      'Eixo 7': 'infraestrutura',
                      'Eixo 8': 'previsao',
                    };

                    const assignedEixoArray = (currentUser.assignedEixo || '').split(',').map(e => e.trim());
                    
                    const visibleCards = currentUser.role === 'ies_interno'
                      ? cardConfigs.filter(c => {
                          if (c.type === 'legendas') return true;
                          const eixosForCard = Object.keys(EIXOS_MAP).filter(k => EIXOS_MAP[k] === c.type);
                          return eixosForCard.some(eixoKey => assignedEixoArray.includes(eixoKey));
                        })
                      : cardConfigs;

                    return visibleCards.map(card => {
                      const stats = getSectionStats(card.type);
                      return (
                        <div 
                          key={card.type}
                          onClick={() => {
                            if (isBlocked) {
                              alert('Área Bloqueada: Só é permitido o acesso ao Resumo e Relatório.');
                              return;
                            }
                            setFormSubTab(card.type);
                          }}
                          className="bg-white border-[3px] border-black rounded-[22px] p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex flex-col justify-between min-h-[280px] group"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="p-3 rounded-xl text-black border-2 border-black bg-[#fec107]/10 group-hover:bg-[#fec107] transition-all">
                                <card.icon className="h-6 w-6 stroke-[2.5]" />
                              </div>
                              <span className={`text-sm font-black border-2 border-black px-3 py-1 rounded-full uppercase tracking-widest  ${stats.color}`}>
                                {stats.label}
                              </span>
                            </div>
                            
                            <div>
                              <span className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] block leading-none ">{card.sub}</span>
                              <h4 className="text-base sm:text-lg  font-black text-slate-950 mt-2 leading-tight uppercase tracking-tight">{card.title}</h4>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 italic ">{card.desc}</p>

                            {/* QUADROS LIST INTEGRATION */}
                            {card.type !== 'legendas' && (
                              <div className="pt-3 mt-3 border-t-2 border-dashed border-slate-200 space-y-2" onClick={(e) => e.stopPropagation()}>
                                <span className="text-xs font-black uppercase text-slate-500 block tracking-wider ">Quadros e Formulários Integrados:</span>
                                <div className="max-h-[140px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                                  {card.type === 'identificacao' ? (
                                    <div className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl text-[10.5px] bg-slate-50 border border-slate-200 hover:bg-amber-50 hover:border-[#fec107] transition-all text-slate-800 font-bold ">
                                      <span className="bg-slate-950 text-[#fec107] font-mono px-1.5 py-0.5 rounded text-xs font-black">Quadro A</span>
                                      <span className="truncate text-slate-700">Identificação da Entidade</span>
                                    </div>
                                  ) : (
                                    (() => {
                                      const EIXOS_MAP: Record<string, number> = {
                                        'discente': 2,
                                        'docente': 3,
                                        'investigadores': 4,
                                        'cta': 5,
                                        'financas': 6,
                                        'infraestrutura': 7,
                                        'previsao': 8,
                                      };
                                      const eNum = EIXOS_MAP[card.type];
                                      const listQ = TODOS_OS_QUADROS.filter(q => q.eixo === eNum);
                                      return listQ.map(q => (
                                        <button
                                          key={q.type}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (isBlocked) {
                                              alert('Área Bloqueada: Só é permitido o acesso ao Resumo e Relatório.');
                                              return;
                                            }
                                            setFormSubTab(q.type);
                                          }}
                                          className="w-full text-left flex items-center gap-2 py-1.5 px-2.5 rounded-xl text-[10.5px] bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 transition-all text-slate-800  font-bold cursor-pointer"
                                        >
                                          <span className="bg-slate-950 text-[#fec107] font-mono px-1.5 py-0.5 rounded text-[8.5px] font-black shrink-0">Quadro {q.id}</span>
                                          <span className="truncate text-slate-700">{q.title}</span>
                                        </button>
                                      ));
                                    })()
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-4 flex items-center justify-between text-xs font-black text-black border-t-2 border-slate-100 mt-4 uppercase tracking-widest ">
                            <span className="group-hover:underline">Abrir Formulário</span>
                            <ChevronRight className="h-4 w-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Right Side: Options and Diagnostics */}
            <div className="space-y-6">
              {/* Collaborative Workflow Control Board */}
              <IESWorkflowPanel 
                currentUser={currentUser}
                selectedYear={selectedYear}
                formData={formData}
                submissionStatus={submissionStatus}
                submissionId={submissionId}
                onSaveSubmission={onSaveSubmission}
              />

              {/* Painel de Saneamento e Garantia de Qualidade de Dados */}
              <div className="bg-white border-[3px] border-black rounded-[20px] p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b-2 border-slate-900">
                  <h4 className=" font-black text-slate-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    🛡️ Saneamento & Qualidade Quântica
                  </h4>
                  <QuantumBadge score={98.1} size="sm" label="Coerência" />
                </div>

                <p className="text-sm text-slate-500 leading-relaxed  italic">
                  Este painel compara em tempo real os dados declarados em <strong className="text-slate-800">{selectedYear}</strong> face ao ciclo de <strong className="text-slate-800">{selectedYear - 1}</strong> para assegurar conformidade e integridade estatística.
                </p>

                {previousYearSub ? (
                  <div className="space-y-3">
                    {complianceIssues.length === 0 ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-250 text-sm text-emerald-800 rounded-lg space-y-1">
                        <div className="font-extrabold flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> DADOS COERENTES
                        </div>
                        <p className="text-xs">Parabéns! Nenhuma inconsistência severa foi detetada. Isso garante a fidedignidade e a integridade da série temporal nacional.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="text-xs font-black uppercase text-slate-500 tracking-wider block">
                          Sinalizações ({complianceIssues.length}):
                        </span>
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {complianceIssues.map((issue) => (
                            <div 
                              key={issue.id}
                              className={`p-2.5 rounded-lg border text-sm ${
                                issue.type === 'error' 
                                  ? 'bg-red-50/70 border-red-200 text-red-950' 
                                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
                              }`}
                            >
                              <div className="font-extrabold flex items-center gap-1 mb-0.5">
                                {issue.type === 'error' ? '❌' : '⚠️'} {issue.message}
                              </div>
                              {issue.submessage && (
                                <p className="text-xs text-slate-600 font-mono italic">{issue.submessage}</p>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-400 pt-1 leading-relaxed">
                          * Divergências estatísticas abruptas podem bloquear a consolidação e necessitam de revisão ou retificação.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-100 text-sm text-slate-500 rounded-lg italic text-center">
                    ℹ️ Não foram detetados relatórios anteriores correspondentes ao ano de {selectedYear - 1} para calcular desvios de série histórica.
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowAIValidationModal(true)}
                  className="w-full mt-3 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  Validação Assistida por IA (Gemini API)
                </button>
              </div>

              {/* Smart Diagnostics (Calculos) */}
              <div className="bg-slate-900 rounded-2xl p-5 text-white space-y-4 shadow-sm">
                <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Indicadores Interativos</span>
                  <span className="bg-emerald-500 text-white font-black px-1.5 py-0.2 rounded text-xs uppercase tracking-wide">Clique para ver</span>
                </h4>

                <div className="space-y-4 pt-1">
                  <div 
                    onClick={() => setFormSubTab('procura_es')}
                    className="cursor-pointer hover:bg-slate-800/40 p-2 rounded-lg transition-all border border-transparent hover:border-slate-800 group"
                    title="Analisar Corpo Discente"
                  >
                    <div className="flex justify-between items-center text-xs mb-1 text-slate-300">
                      <span className="group-hover:text-[#fec107] font-semibold transition-colors">Paridade de Género (Alunos) ➔</span>
                      <strong className="text-white font-bold font-mono">{femalePercentage}% Feminino</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${formData.studentsMale + formData.studentsFemale > 0 ? (formData.studentsMale / (formData.studentsMale + formData.studentsFemale)) * 100 : 50}%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div 
                      onClick={() => setFormSubTab('docente')}
                      className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/30 cursor-pointer hover:bg-slate-700/60 hover:border-emerald-500 transition-all group"
                      title="Analisar Corpo Docente"
                    >
                      <span className="text-xs text-slate-400 block leading-tight group-hover:text-emerald-400 font-bold">Discentes / Professor ➔</span>
                      <strong className="text-sm font-bold block mt-1 font-mono text-emerald-400">{teacherStudentRatio} : 1</strong>
                    </div>
                    <div 
                      onClick={() => setFormSubTab('infraestrutura')}
                      className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/30 cursor-pointer hover:bg-slate-700/60 hover:border-sky-500 transition-all group"
                      title="Analisar Infraestrutura"
                    >
                      <span className="text-xs text-slate-400 block leading-tight group-hover:text-sky-450 font-bold">Estudantes / Lab ➔</span>
                      <strong className="text-sm font-bold block mt-1 font-mono text-sky-400">{labsRatio} : 1</strong>
                    </div>
                  </div>

                  <div 
                    onClick={() => setFormSubTab('docente')}
                    className="bg-slate-800/30 border border-slate-800 p-2 text-xs text-slate-450 leading-relaxed cursor-pointer hover:bg-slate-800/60 rounded-lg transition-all"
                    title="Ir para Corpo Docente"
                  >
                    <strong className="text-slate-300">Consistência Académica:</strong> {totalTeachers > 0 ? (
                      <span className="text-emerald-400">✔ Rácio docente equilibrado.</span>
                    ) : 'Nenhum docente inserido no sistema.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Independent edit page - Occupies 100% of the screen */
          <div className="fixed inset-0 z-[2000] bg-[#f8fafc] overflow-y-auto p-2 sm:p-4 select-none" id="independent-form-page">
            <div className="max-w-full w-full mx-auto space-y-5 pb-20">
            
            {/* Header Axis Card with Sticky Controls */}
            <div className="bg-white border-[3px] border-black rounded-[20px] p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] sticky top-4 z-[50] flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                  type="button" 
                  onClick={() => setFormSubTab('capa')}
                  className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border-2 border-black text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[1px]"
                >
                  <ArrowLeft className="h-4 w-4 stroke-[3]" />
                  Menu
                </button>
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    {(() => {
                      const qGeneral = TODOS_OS_QUADROS.find(q => q.type === formSubTab);
                      if (qGeneral) {
                        const iconComp = cardConfigs.find(c => c.type === formSubTab)?.icon || cardConfigs[qGeneral.eixo - 1]?.icon || Users;
                        return (
                          <>
                            {React.createElement(iconComp, { className: "h-5 w-5 text-slate-900 stroke-[2.5]" })}
                            {`Quadro ${qGeneral.id}: ${qGeneral.title}`}
                          </>
                        );
                      }
                      const config = cardConfigs.find(c => c.type === formSubTab);
                      return (
                        <>
                          {React.createElement(config?.icon || Folder, { className: "h-5 w-5 text-slate-900 stroke-[2.5]" })}
                          {config?.title || 'Formulário'}
                        </>
                      );
                    })()}
                  </h2>
                  <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2">
                    <span>Eixo {(() => {
                        const qGeneral = TODOS_OS_QUADROS.find(q => q.type === formSubTab);
                        return qGeneral ? qGeneral.eixo : '?';
                      })()}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="text-blue-900 font-mono">Ano {selectedYear}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                      submissionStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                      submissionStatus === 'pending_central' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {submissionStatus === 'approved' ? 'Submetido e Aprovado' : 
                       submissionStatus === 'pending_central' ? 'Pendente de Validação' : 'Em Rascunho'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {isReadOnly && (
                  <div className="bg-slate-900 text-[#fec107] px-4 py-2 rounded-xl border-2 border-black flex items-center gap-2 text-xs font-black uppercase shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                    <CheckCircle className="h-4 w-4" /> Relatório Oficial Bloqueado (Apenas Consulta)
                  </div>
                )}
                <button
                  type="button"
                  disabled={isReadOnly}
                  onClick={() => {
                    const id = submissionId || 'sub-' + currentUser.institutionId + '-' + selectedYear;
                    const newSub: Submission = {
                      id,
                      institutionId: currentUser.institutionId || '',
                      institutionName: currentUser.institutionName || 'Instituição Desconhecida',
                      province: currentUser.province || 'Luanda',
                      year: selectedYear,
                      data: formData,
                      status: 'draft',
                      sentToProvince: sentToProvince,
                      updatedAt: new Date().toISOString(),
                    };
                    onSaveSubmission(newSub);
                    alert("Rascunho guardado com sucesso!");
                  }}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-2 border-black hover:bg-slate-50 text-slate-800 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" /> Guardar Rascunho
                </button>
                <button
                  type="button"
                  disabled={isReadOnly}
                  onClick={() => {
                    if (window.confirm("Deseja submeter este quadro? Após a submissão, os dados ficarão em modo de consulta e pendentes de validação pelo Ministério.")) {
                       const id = submissionId || 'sub-' + currentUser.institutionId + '-' + selectedYear;
                        const newSub: Submission = {
                          id,
                          institutionId: currentUser.institutionId || '',
                          institutionName: currentUser.institutionName || 'Instituição Desconhecida',
                          province: currentUser.province || 'Luanda',
                          year: selectedYear,
                          data: formData,
                          status: 'pending_central',
                          sentToProvince: sentToProvince,
                          updatedAt: new Date().toISOString(),
                        };
                        onSaveSubmission(newSub);
                    }
                  }}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl text-xs transition-all cursor-pointer shadow-[3px_3px_0px_rgba(3,105,161,1)] hover:translate-y-[1px] disabled:opacity-50"
                >
                  <Send className="h-4 w-4" /> Enviar Dados
                </button>
              </div>
            </div>


            {/* Selection bar - Styled precisely as the mockup, taking 100% width */}
            <div className="bg-white border-[3px] border-black rounded-[14px] p-2.5 relative shadow-sm animate-fade-in" id="independent-section-navigator">
              <button
                type="button"
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="w-full bg-[#0d1e34] hover:bg-[#162e4e] text-white font-extrabold text-xs md:text-xs px-5 py-3 rounded-lg flex items-center justify-between cursor-pointer uppercase tracking-widest transition-all border-2 border-slate-900"
              >
                <span>
                  {(() => {
                    const q = TODOS_OS_QUADROS.find(q => q.type === formSubTab);
                    if (q) return `Quadro ${q.id}: ${q.title}`;
                    return cardConfigs.find(c => c.type === formSubTab)?.title || 'Selecione';
                  })()}
                </span>
                <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isNavOpen ? 'rotate-90' : ''} stroke-[3] ml-2 shrink-0`} />
              </button>
              
              {isNavOpen && (
                <div className="absolute top-[102%] left-2.5 right-2.5 mt-1 bg-white border-[3px] border-black rounded-xl shadow-[8px_8px_0px_rgba(0,0,0,1)] z-[200] max-h-[350px] overflow-y-auto py-2">
                   <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Selecione o Quadro para preencher:</span>
                  </div>
                  {(() => {
                    const qGeneral = TODOS_OS_QUADROS.find(q => q.type === formSubTab);
                    const currentEixoNum = qGeneral ? qGeneral.eixo : 1;
                    return TODOS_OS_QUADROS.filter(q => q.eixo === currentEixoNum).map((q) => (
                      <button
                         key={q.type}
                         onClick={() => {
                           setSelectedQuadro(`${q.id}`);
                           handleNavigate(q.type as any); 
                           setIsNavOpen(false);
                         }}
                         className={`w-full text-left px-5 py-3 text-sm font-bold flex items-center justify-between group transition-colors border-b border-slate-50 last:border-0 hover:bg-slate-50 ${formSubTab === q.type ? 'bg-blue-50 text-blue-700' : 'text-slate-800'}`}
                      >
                        <div className="flex flex-col text-left">
                          <span className={formSubTab === q.type ? 'text-blue-700 font-extrabold' : 'text-slate-900 group-hover:text-blue-600 transition-colors'}>Quadro {q.id}: {q.title}</span>
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter mt-0.5">Eixo {q.eixo}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded font-black uppercase shrink-0 ml-2 ${formSubTab === q.type ? 'bg-blue-200 text-blue-800' : 'bg-blue-50 text-blue-500 opacity-60'}`}>
                          {formSubTab === q.type ? 'Aberto' : 'Ver'}
                        </span>
                      </button>
                    ));
                  })()}
                </div>
              )}
            </div>

            {/* Content area: Placeholder or actual form */}
            {formSubTab === 'capa' ? (
              <div className="bg-white border-[3px] border-black rounded-[20px] p-16 flex items-center justify-center text-slate-500 font-black text-lg border-dashed">
                Selecione o Quadro a preencher
              </div>
            ) : formSubTab === 'identificacao' ? (
              <div className="space-y-6 animate-fade-in">
                 {/* Alert Message */}
                 <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-[4px_4px_0px_rgba(245,158,11,0.2)]">
                    <div className="flex items-center gap-3">
                       <CircleAlert className="h-6 w-6 text-amber-600" />
                       <p className="text-amber-800 font-bold text-sm">
                          ESTA INFORMAÇÃO SOBRE A IDENTIDADE DA IES, DEVERÁ SER PREENCHIDA AO REGISTAR A IES
                       </p>
                    </div>
                 </div>

                 {/* Main Info Card */}
                 <div className="bg-white border-[3px] border-black rounded-[20px] p-6 sm:p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden">
                    <div className="border-b-4 border-[#fec107] pb-4 mb-8 inline-block">
                       <h2 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
                          <Home className="h-8 w-8 text-slate-800" />
                          A. Identificação da Entidade
                       </h2>
                    </div>

                    <div className="space-y-10">
                       {/* IES Table */}
                       <div>
                          <div className="bg-slate-900 text-[#fec107] py-3 px-6 rounded-t-xl text-center font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4 border-2 border-black">
                             Identificação, localização da instituição e respectivas delegações
                          </div>
                          
                          <div className="overflow-x-auto border-[3px] border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                             <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                   <tr className="bg-slate-100 border-b-[3px] border-black">
                                      <th colSpan={9} className="py-2.5 text-center font-black text-slate-900 border-r-2 border-black uppercase">IES</th>
                                   </tr>
                                   <tr className="bg-slate-50 border-b-2 border-black">
                                      <th className="p-3 border-r-2 border-black font-black text-slate-700">Nome</th>
                                      <th className="p-3 border-r-2 border-black font-black text-slate-700">Sigla</th>
                                      <th className="p-3 border-r-2 border-black font-black text-slate-700">Nuit</th>
                                      <th className="p-3 border-r-2 border-black font-black text-slate-700">Ano do início do funcionamento</th>
                                      <th className="p-3 border-r-2 border-black font-black text-slate-700">Província</th>
                                      <th className="p-3 border-r-2 border-black font-black text-slate-700">Distrito</th>
                                      <th className="p-3 border-r-2 border-black font-black text-slate-700">Endereço físico</th>
                                      <th className="p-3 border-r-2 border-black font-black text-slate-700">Website da IES</th>
                                      <th className="p-3 font-black text-slate-700">Contacto da IES</th>
                                   </tr>
                                </thead>
                                <tbody className="bg-white">
                                   <tr className="border-b-2 border-black hover:bg-slate-50 transition-colors">
                                      <td className="p-3 border-r-2 border-black font-bold text-slate-900">{myInstitution?.name || '---'}</td>
                                      <td className="p-3 border-r-2 border-black font-bold text-slate-900">{myInstitution?.abbreviation || '---'}</td>
                                      <td className="p-3 border-r-2 border-black font-bold text-slate-900">{myInstitution?.nuit || '---'}</td>
                                      <td className="p-3 border-r-2 border-black font-bold text-slate-900">{myInstitution?.anoInicio || myInstitution?.startYear || '---'}</td>
                                      <td className="p-3 border-r-2 border-black font-bold text-slate-900">{myInstitution?.province || '---'}</td>
                                      <td className="p-3 border-r-2 border-black font-bold text-slate-900">{myInstitution?.district || '---'}</td>
                                      <td className="p-3 border-r-2 border-black font-bold text-slate-900">{myInstitution?.address || '---'}</td>
                                      <td className="p-3 border-r-2 border-black font-bold text-blue-600 underline decoration-blue-300 underline-offset-2">{myInstitution?.website || '---'}</td>
                                      <td className="p-3 font-bold text-slate-900">{myInstitution?.contact || '---'}</td>
                                   </tr>
                                </tbody>
                             </table>
                          </div>
                          <div className="flex items-start gap-2 mt-3 ml-2">
                             <CircleAlert className="h-3 w-3 text-slate-400 mt-0.5" />
                             <p className="text-xs text-slate-500 font-bold italic leading-tight">
                                *Ano do início do funcionamento de uma IES-Refere-se ao ano em que a IES foi atribuída um alvará que autoriza o início de seu funcionamento.
                             </p>
                          </div>
                       </div>

                       {/* Delegacoes Section */}
                       <div>
                          <div className="overflow-x-auto border-[3px] border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                             <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                   <tr className="bg-slate-100 border-b-[3px] border-black">
                                      <th colSpan={9} className="py-2.5 text-center font-black text-slate-900 uppercase">Delegações/Extensões</th>
                                   </tr>
                                   <tr className="bg-slate-50 border-b-2 border-black">
                                      <th className="p-3 border-r-2 border-black font-black text-slate-700">Nome</th>
                                      <th className="p-3 border-r-2 border-black font-black text-slate-700">Extensão/Delegação</th>
                                      <th className="p-3 border-r-2 border-black font-black text-slate-700">Província</th>
                                      <th className="p-3 border-r-2 border-black font-black text-slate-700">Distrito</th>
                                      <th className="p-3 border-r-2 border-black font-black text-slate-700">Endereço físico</th>
                                      <th className="p-3 border-r-2 border-black font-black text-slate-700">Contacto</th>
                                      <th colSpan={3} className="p-3 font-black text-slate-700">Obs</th>
                                   </tr>
                                </thead>
                                <tbody className="bg-white">
                                   {myInstitution?.delegacoes && myInstitution.delegacoes.length > 0 ? (
                                      myInstitution.delegacoes.map((d, idx) => (
                                         <tr key={d.id} className="border-b border-slate-200 h-10 even:bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                            <td className="p-3 border-r border-slate-100 font-bold text-slate-800">{d.nome}</td>
                                            <td className="p-3 border-r border-slate-100 font-bold text-slate-800">{d.tipo}</td>
                                            <td className="p-3 border-r border-slate-100 font-bold text-slate-800">{d.provincia}</td>
                                            <td className="p-3 border-r border-slate-100 font-bold text-slate-800">{d.distrito}</td>
                                            <td className="p-3 border-r border-slate-100 font-bold text-slate-800">{d.endereco}</td>
                                            <td className="p-3 border-r border-slate-100 font-bold text-slate-800">{d.contacto}</td>
                                            <td colSpan={3} className="p-3 text-xs text-slate-500 italic">Registado via SIGDE- ONLINE</td>
                                         </tr>
                                      ))
                                   ) : (
                                      [1, 2, 3].map(i => (
                                         <tr key={i} className="border-b border-slate-200 h-10 even:bg-slate-50/50">
                                            <td className="p-3 border-r border-slate-100"></td>
                                            <td className="p-3 border-r border-slate-100"></td>
                                            <td className="p-3 border-r border-slate-100"></td>
                                            <td className="p-3 border-r border-slate-100"></td>
                                            <td className="p-3 border-r border-slate-100"></td>
                                            <td className="p-3 border-r border-slate-100"></td>
                                            <td colSpan={3} className="p-3 font-bold text-slate-300 italic text-xs">Sem dados registados</td>
                                         </tr>
                                      ))
                                   )}
                                </tbody>
                             </table>
                          </div>
                       </div>

                       {/* Bottom Tables: Responsável and Focal Point */}
                       <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-8">
                          {/* Responsável Table */}
                          <div>
                             <div className="bg-slate-900 text-[#fec107] py-2 px-6 rounded-t-xl font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4 border-2 border-black inline-block">
                                Responsável da IES
                             </div>
                             
                             <div className="border-[3px] border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-white">
                                <table className="w-full text-sm border-collapse">
                                   <tbody>
                                      <tr className="border-b-2 border-black group hover:bg-slate-50 transition-colors">
                                         <td className="p-3 bg-slate-100 font-black text-slate-700 border-r-2 border-black w-32 uppercase tracking-tight">Nome</td>
                                         <td className="p-3 font-bold text-slate-900">{myInstitution?.responsavel?.nome || myInstitution?.rector || '---'}</td>
                                      </tr>
                                      <tr className="border-b-2 border-black group hover:bg-slate-50 transition-colors">
                                         <td className="p-3 bg-slate-100 font-black text-slate-700 border-r-2 border-black uppercase tracking-tight">Função</td>
                                         <td className="p-3 font-bold text-slate-900">{myInstitution?.responsavel?.funcao || 'Reitor(a)'}</td>
                                      </tr>
                                      <tr className="border-b-2 border-black group hover:bg-slate-50 transition-colors">
                                         <td className="p-3 bg-slate-100 font-black text-slate-700 border-r-2 border-black uppercase tracking-tight">Contacto</td>
                                         <td className="p-3 font-bold text-slate-900">{myInstitution?.responsavel?.contacto || '---'}</td>
                                      </tr>
                                      <tr className="group hover:bg-slate-50 transition-colors">
                                         <td className="p-3 bg-slate-100 font-black text-slate-700 border-r-2 border-black uppercase tracking-tight">email</td>
                                         <td className="p-3 font-bold text-slate-900">{myInstitution?.responsavel?.email || myInstitution?.email || '---'}</td>
                                      </tr>
                                   </tbody>
                                </table>
                             </div>
                          </div>

                          {/* Focal Point Table */}
                          <div>
                             <div className="bg-slate-900 text-[#fec107] py-2 px-6 rounded-t-xl font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4 border-2 border-black inline-block">
                                Focal Point da IES
                             </div>
                             
                             <div className="border-[3px] border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-white">
                                <table className="w-full text-sm border-collapse">
                                   <tbody>
                                      <tr className="border-b-2 border-black group hover:bg-slate-50 transition-colors">
                                         <td className="p-3 bg-slate-100 font-black text-slate-700 border-r-2 border-black w-32 uppercase tracking-tight">Nome</td>
                                         <td className="p-3 font-bold text-slate-900">{myInstitution?.focalPoint?.nome || '---'}</td>
                                      </tr>
                                      <tr className="border-b-2 border-black group hover:bg-slate-50 transition-colors">
                                         <td className="p-3 bg-slate-100 font-black text-slate-700 border-r-2 border-black uppercase tracking-tight">Função</td>
                                         <td className="p-3 font-bold text-slate-900">{myInstitution?.focalPoint?.funcao || '---'}</td>
                                      </tr>
                                      <tr className="border-b-2 border-black group hover:bg-slate-50 transition-colors">
                                         <td className="p-3 bg-slate-100 font-black text-slate-700 border-r-2 border-black uppercase tracking-tight">Contacto</td>
                                         <td className="p-3 font-bold text-slate-900">{myInstitution?.focalPoint?.contacto || '---'}</td>
                                      </tr>
                                      <tr className="group hover:bg-slate-50 transition-colors">
                                         <td className="p-3 bg-slate-100 font-black text-slate-700 border-r-2 border-black uppercase tracking-tight">email</td>
                                         <td className="p-3 font-bold text-slate-900">{myInstitution?.focalPoint?.email || '---'}</td>
                                      </tr>
                                   </tbody>
                                </table>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            ) : cardConfigs.some(c => c.type === formSubTab) ? (
              <div className="space-y-6 animate-fade-in" id="eixo-landing-view">
                <div className="bg-white border-[3px] border-black rounded-[20px] p-6 sm:p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                   <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
                      <div className="bg-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_rgba(254,193,7,1)]">
                        {(() => {
                           const config = cardConfigs.find(c => c.type === formSubTab);
                           const Icon = config?.icon || Folder;
                           return <Icon className="h-10 w-10 text-[#fec107] stroke-[2.5]" />
                        })()}
                      </div>
                      <div className="flex-1">
                         <h2 className="text-2xl md:text-3xl font-black text-slate-900 border-b-4 border-[#fec107] inline-block mb-3">
                            {cardConfigs.find(c => c.type === formSubTab)?.title}
                         </h2>
                         <p className="text-slate-500 font-bold text-sm md:text-base italic leading-relaxed max-w-3xl">
                            {cardConfigs.find(c => c.type === formSubTab)?.desc}
                         </p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {(() => {
                    const idx = cardConfigs.findIndex(c => c.type === formSubTab);
                    const eixoNum = idx !== -1 ? idx + 1 : 1;
                    return TODOS_OS_QUADROS.filter(q => q.eixo === eixoNum).map((q) => (
                      <button
                        key={q.type}
                        onClick={() => setFormSubTab(q.type)}
                        className="bg-white border-[3px] border-black rounded-[24px] p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex flex-col justify-between min-h-[160px] group text-left relative overflow-hidden"
                      >
                         <div className="absolute top-0 right-0 w-12 h-12 bg-slate-50 -mr-6 -mt-6 rotate-45 group-hover:bg-blue-50 transition-colors"></div>
                         
                         <div className="space-y-3 relative z-10">
                           <div className="flex justify-between items-start">
                             <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-widest">Q {q.id}</span>
                             <div className="h-6 w-6 rounded-full bg-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <ChevronRight className="h-3 w-3 text-[#fec107] stroke-[3]" />
                             </div>
                           </div>
                           <h4 className="text-sm font-black text-slate-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-3">
                              {q.title}
                           </h4>
                         </div>
                         
                         <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                              <span className="text-xs font-black uppercase text-slate-500 tracking-tight">Disponível para Preenchimento</span>
                            </div>
                            <span className="text-xs bg-slate-900 text-[#fec107] px-2.5 py-1 rounded-lg font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] transform group-hover:scale-105 transition-transform">
                               Abrir
                            </span>
                         </div>
                      </button>
                    ));
                  })()}
                </div>
              </div>
            ) : (
              <form key={formSubTab} onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {formSubTab === 'procura_es' && (
                  <div className="space-y-6">
                    <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] overflow-x-auto">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          <Database className="h-4 w-4 text-rose-500" /> Quadro 1.1: Número de Estudantes que procuram o Ensino Superior
                        </h3>
                        <button 
                          type="button"
                          className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                          onClick={() => {
                            const newCourse = { 
                              id: Date.now().toString(), 
                              nome: '', 
                              nomeCurso: '',
                              duracao: '', 
                              duracaoAnos: 0,
                              iscedArea: '', 
                              iscedSubArea: '', 
                              regime: '', 
                              regimeCurso: '',
                              grau: '', 
                              homens: 0, 
                              mulheres: 0, 
                              nacionalidade: 'Moçambicana', 
                              provincia: '', 
                              distrito: '' 
                            };
                            setFormData(prev => ({
                              ...prev,
                              coursesProcuraES: [...(prev.coursesProcuraES || []), newCourse]
                            }));
                          }}
                        >
                          + Adicionar Curso
                        </button>
                      </div>

                      <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-950 rounded-xl p-3.5 text-xs font-semibold mb-4 flex items-start gap-2.5 shadow-sm">
                        <Sparkles className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <strong className="text-emerald-900 block font-bold mb-0.5">Preenchimento Automatizado Inteligente ({myInstitution?.abbreviation || 'IES'}):</strong>
                          Ao digitar ou selecionar o nome de um curso (por exemplo: <em>Informática, Medicina, Direito, Contabilidade, Engenharia Civil</em>), o sistema identificará o curso e preencherá a <strong>Área de Formação</strong> e a <strong>Sub-área</strong> regulamentada automaticamente nas colunas correspondentes de forma inteligente!
                        </div>
                      </div>

                      <table className="w-full text-xs border-collapse min-w-full min-w-[1200px]">
                        <thead>
                          <tr className="bg-slate-50">
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase">Nome do curso</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-20">***Duração (anos)</th>
                            <th colSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase text-center">{myInstitution?.abbreviation || 'IES'} {selectedYear - 1}</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-24">Regime-Curso</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-24">Grau</th>
                            <th colSpan={3} className="border-2 border-black p-2 bg-slate-100 uppercase text-center">Estudantes que procuram o ES</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-28">Nacionalidadde</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-28">Província**</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-28">Distrito*</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-10">...</th>
                          </tr>
                          <tr className="bg-slate-50">
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center">Áreas</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center">Sub-as</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center w-12">Homens</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center w-12">Mulheres</th>
                            <th className="border-2 border-black p-2 bg-slate-100 uppercase text-center w-16 font-black">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.coursesProcuraES && formData.coursesProcuraES.length > 0 ? (
                            formData.coursesProcuraES.map((course, idx) => (
                              <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                                <td className="border-2 border-black p-1">
                                  <CourseSelect 
                                    value={course.nomeCurso || course.nome || ''} 
                                    courses={instCourses} 
                                    onChange={(val) => {
                                      const updated = [...formData.coursesProcuraES!];
                                      updated[idx].nome = val;
                                      updated[idx].nomeCurso = val;
                                      const detetado = detectCourseArea(val);
                                      if (detetado.area) {
                                        updated[idx].iscedArea = detetado.area;
                                        updated[idx].iscedSubArea = detetado.subarea;
                                      }
                                      setFormData(prev => ({ ...prev, coursesProcuraES: updated }));
                                    }} 
                                  />
                                </td>
                                <td className="border-2 border-black p-1 text-center w-20">
                                  <select 
                                    className="w-full bg-transparent p-1 text-center font-bold text-xs" 
                                    value={course.duracao || course.duracaoAnos || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      const updated = [...formData.coursesProcuraES!];
                                      updated[idx].duracao = val;
                                      updated[idx].duracaoAnos = parseInt(val) || 0;
                                      setFormData(prev => ({ ...prev, coursesProcuraES: updated }));
                                    }}
                                  >
                                    <option value="">Selecione</option>
                                    <option value="1">1 Ano</option>
                                    <option value="2">2 Anos</option>
                                    <option value="3">3 Anos</option>
                                    <option value="4">4 Anos</option>
                                    <option value="5">5 Anos</option>
                                    <option value="6">6 Anos</option>
                                  </select>
                                </td>
                                <td className="border-2 border-black p-1">
                                  <input 
                                    type="text" 
                                    className="w-full bg-transparent p-1 font-medium text-center text-xs" 
                                    value={course.iscedArea || ''}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesProcuraES!];
                                      updated[idx].iscedArea = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesProcuraES: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1">
                                  <input 
                                    type="text" 
                                    className="w-full bg-transparent p-1 font-medium text-center text-xs" 
                                    value={course.iscedSubArea || ''}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesProcuraES!];
                                      updated[idx].iscedSubArea = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesProcuraES: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1 w-24">
                                  <select 
                                    className="w-full bg-transparent p-1 text-xs font-bold text-center"
                                    value={course.regimeCurso || course.regime || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      const updated = [...formData.coursesProcuraES!];
                                      updated[idx].regime = val;
                                      updated[idx].regimeCurso = val;
                                      setFormData(prev => ({ ...prev, coursesProcuraES: updated }));
                                    }}
                                  >
                                    <option value="">Selecione</option>
                                    <option value="Laboral">Laboral</option>
                                    <option value="Pós Laboral">Pós Laboral</option>
                                    <option value="EAD">EAD</option>
                                  </select>
                                </td>
                                <td className="border-2 border-black p-1 w-24">
                                  <select 
                                    className="w-full bg-transparent p-1 text-xs font-bold text-center"
                                    value={course.grau || ''}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesProcuraES!];
                                      updated[idx].grau = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesProcuraES: updated }));
                                    }}
                                  >
                                    <option value="">Selecione</option>
                                    <option value="Bacharelato">Bacharelato</option>
                                    <option value="Licenciatura">Licenciatura</option>
                                    <option value="Mestrado">Mestrado</option>
                                    <option value="Doutoramento">Doutoramento</option>
                                  </select>
                                </td>
                                <td className="border-2 border-black p-1 w-12 text-center">
                                  <input 
                                    type="number" 
                                    className="w-full bg-transparent p-1 text-center font-bold" 
                                    value={course.homens === 0 ? '' : course.homens}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 0;
                                      const updated = [...formData.coursesProcuraES!];
                                      updated[idx].homens = val;
                                      setFormData(prev => ({ ...prev, coursesProcuraES: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1 w-12 text-center">
                                  <input 
                                    type="number" 
                                    className="w-full bg-transparent p-1 text-center font-bold" 
                                    value={course.mulheres === 0 ? '' : course.mulheres}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 0;
                                      const updated = [...formData.coursesProcuraES!];
                                      updated[idx].mulheres = val;
                                      setFormData(prev => ({ ...prev, coursesProcuraES: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1 w-16 text-center bg-slate-100 font-black">
                                  {(course.homens || 0) + (course.mulheres || 0)}
                                </td>
                                <td className="border-2 border-black p-0 relative w-28">
                                  <GeoSelect 
                                    type="nacionalidade"
                                    value={course.nacionalidade || 'Moçambicana'}
                                    onChange={(val) => {
                                      const updated = [...formData.coursesProcuraES!];
                                      updated[idx].nacionalidade = val;
                                      setFormData(prev => ({ ...prev, coursesProcuraES: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-0 relative w-28">
                                  <GeoSelect 
                                    type="provincia"
                                    value={course.provincia || ''}
                                    nacionalidade={course.nacionalidade}
                                    onChange={(val) => {
                                      const updated = [...formData.coursesProcuraES!];
                                      updated[idx].provincia = val;
                                      if (course.nacionalidade !== 'Estrangeira') {
                                        updated[idx].distrito = ''; // Reset district
                                      }
                                      setFormData(prev => ({ ...prev, coursesProcuraES: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-0 relative w-28">
                                  <GeoSelect 
                                    type="distrito"
                                    value={course.distrito || ''}
                                    provincia={course.provincia}
                                    nacionalidade={course.nacionalidade}
                                    onChange={(val) => {
                                      const updated = [...formData.coursesProcuraES!];
                                      updated[idx].distrito = val;
                                      setFormData(prev => ({ ...prev, coursesProcuraES: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1 text-center w-10">
                                  <button 
                                    className="text-red-500 hover:text-red-700 font-bold p-1"
                                    onClick={() => {
                                      const updated = formData.coursesProcuraES!.filter(c => c.id !== course.id);
                                      setFormData(prev => ({ ...prev, coursesProcuraES: updated }));
                                    }}
                                  >
                                    ×
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={13} className="border-2 border-black p-8 text-center bg-slate-50 text-slate-400 italic">
                                Nenhum curso registado. Clique em "Adicionar Curso" para começar.
                              </td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="bg-slate-900 text-[#fec107] font-black uppercase">
                            <td colSpan={6} className="border-2 border-black p-2 text-right">TOTAL</td>
                            <td className="border-2 border-black p-2 text-center">
                              {formData.coursesProcuraES?.reduce((acc, c) => acc + (c.homens || 0), 0) || 0}
                            </td>
                            <td className="border-2 border-black p-2 text-center">
                              {formData.coursesProcuraES?.reduce((acc, c) => acc + (c.mulheres || 0), 0) || 0}
                            </td>
                            <td className="border-2 border-black p-2 text-center">
                              {formData.coursesProcuraES?.reduce((acc, c) => acc + (c.homens || 0) + (c.mulheres || 0), 0) || 0}
                            </td>
                            <td colSpan={4} className="border-2 border-black p-2 bg-slate-800"></td>
                          </tr>
                        </tfoot>
                      </table>
                      
                      <div className="mt-4 p-4 border-[2px] border-black bg-slate-50 rounded-xl space-y-2">
                        <p className="text-xs text-slate-500 font-mono italic">*** Duração: Refere-se à duração regulamentar do curso em anos.</p>
                        <p className="text-xs text-slate-500 font-mono italic">** Província: Refere-se à província de residência ou origem conforme aplicável.</p>
                        <p className="text-xs text-slate-500 font-mono italic">* Distrito: Refere-se ao distrito correspondente à província indicada.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dynamic Customizable Quadros for Eixos 2 to 9 (from .0 to .10) */}
                {formSubTab.startsWith('eixo_') && 
                 formSubTab !== 'eixo_2_q0' && 
                 formSubTab !== 'eixo_2_q1' && 
                 formSubTab !== 'eixo_2_q2' && 
                 formSubTab !== 'eixo_2_q3' && 
                 formSubTab !== 'eixo_2_q4' && 
                 formSubTab !== 'eixo_2_q5' && 
                 formSubTab !== 'eixo_2_q6' && 
                 formSubTab !== 'eixo_4_q1' && 
                 formSubTab !== 'eixo_4_q2' && 
                 formSubTab !== 'eixo_4_q3' && 
                 formSubTab !== 'eixo_4_q4' && 
                 formSubTab !== 'eixo_4_q5' && 
                 formSubTab !== 'eixo_4_q6' && 
                 formSubTab !== 'eixo_4_q7' && 
                 formSubTab !== 'eixo_4_q8' && 
                 formSubTab !== 'eixo_4_q9' && 
                 formSubTab !== 'eixo_4_q10' && 
                 formSubTab !== 'eixo_4_q11' && 
                 formSubTab !== 'eixo_4_q12' && 
                 formSubTab !== 'eixo_4_q13' && 
                 formSubTab !== 'eixo_4_q14' && 
                 formSubTab !== 'eixo_5_q1' && 
                 formSubTab !== 'eixo_5_q2' && 
                 formSubTab !== 'eixo_5_q3' && 
                 formSubTab !== 'eixo_5_q4' && 
                 formSubTab !== 'eixo_6_q1' && 
                 formSubTab !== 'eixo_6_q2' && 
                 formSubTab !== 'eixo_6_q3' && 
                 formSubTab !== 'eixo_7_q1' && 
                 formSubTab !== 'eixo_7_q2' && 
                 formSubTab !== 'eixo_7_q3' && 
                 formSubTab !== 'eixo_7_q4' && 
                 formSubTab !== 'eixo_8_q1' && (() => {

                  const qInfo = TODOS_OS_QUADROS.find(q => q.type === formSubTab);
                  if (!qInfo) return null;
                  const key = formSubTab;
                  
                  // Initialize custom quadros data array
                  const currentData = formData.customQuadros?.[key] || [];
                  
                  // Deduce standard template columns if we don't have custom ones yet
                  let defaultCols = ["Descrição", "Homens (Masculino)", "Mulheres (Feminino)", "Total"];
                  if (qInfo.eixo === 2 && qInfo.id.endsWith('.0')) {
                    defaultCols = ["Categoria Docente", "Tempo Integral", "Tempo Parcial", "Total"];
                  } else if (qInfo.eixo === 2 && qInfo.id.endsWith('.1')) {
                    defaultCols = ["Nível Académico", "Homens", "Mulheres", "Total"];
                  } else if (qInfo.eixo === 3 && qInfo.id.endsWith('.0')) {
                    defaultCols = ["Categoria Técnico", "Homens", "Mulheres", "Total"];
                  } else if (qInfo.eixo === 4 && qInfo.id.endsWith('.0')) {
                    defaultCols = ["Área de Pesquisa", "Número de Investigadores", "Artigos Publicados"];
                  } else if (qInfo.eixo === 5 && qInfo.id.endsWith('.0')) {
                    defaultCols = ["Nível / Curso", "Matrículas Atuais", "Vagas Previstas N+1", "Crescimento (%)"];
                  } else if (qInfo.eixo === 6 && qInfo.id.endsWith('.0')) {
                    defaultCols = ["Categoria de Despesa", "Recursos Alocados", "Recursos Executados", "Rácio de Execução (%)"];
                  } else if (qInfo.eixo === 7 && qInfo.id.endsWith('.0')) {
                    defaultCols = ["Bloco / Edifício", "Salas de Aula", "Laboratórios", "Capacidade Total (Lugares)"];
                  } else if (qInfo.eixo === 8 && qInfo.id.endsWith('.0')) {
                    defaultCols = ["Serviço TIC", "Velocidade de Fibra (Mbps)", "Computadores Disponíveis", "Rácio de Acesso"];
                  } else if (qInfo.eixo === 9 && qInfo.id.endsWith('.0')) {
                    defaultCols = ["Tipo de Recurso", "Títulos Disponíveis", "Acessos Digitais", "Total Físico"];
                  }

                  const rowCols = currentData.length > 0 && currentData[0].colunas ? currentData[0].colunas : defaultCols;

                  const handleAddRow = () => {
                    const newRow = {
                      colunas: rowCols,
                      valores: rowCols.reduce((acc, col) => {
                        acc[col] = '';
                        return acc;
                      }, {} as Record<string, string>)
                    };
                    const updatedData = [...currentData, newRow];
                    setFormData({
                      ...formData,
                      customQuadros: {
                        ...(formData.customQuadros || {}),
                        [key]: updatedData
                      }
                    });
                  };

                  const handleCellChange = (rowIndex: number, colName: string, value: string) => {
                    const updatedData = currentData.map((row, rIdx) => {
                      if (rIdx === rowIndex) {
                        const newValores = { ...row.valores, [colName]: value };
                        const isSumCol = colName.toLowerCase().includes('total');
                        const sumCol = rowCols.find(c => c.toLowerCase() === 'total' || c.toLowerCase() === 'total (automático)');
                        if (sumCol && !isSumCol) {
                          const otherCols = rowCols.filter(c => c !== sumCol);
                          let sum = 0;
                          let hasNumber = false;
                          otherCols.forEach(c => {
                            const num = parseFloat(newValores[c]);
                            if (!isNaN(num)) {
                              sum += num;
                              hasNumber = true;
                            }
                          });
                          if (hasNumber) {
                            newValores[sumCol] = sum.toString();
                          }
                        }
                        return { ...row, valores: newValores };
                      }
                      return row;
                    });
                    setFormData({
                      ...formData,
                      customQuadros: {
                        ...(formData.customQuadros || {}),
                        [key]: updatedData
                      }
                    });
                  };

                  const handleRemoveRow = (rowIndex: number) => {
                    const updatedData = currentData.filter((_, rIdx) => rIdx !== rowIndex);
                    setFormData({
                      ...formData,
                      customQuadros: {
                        ...(formData.customQuadros || {}),
                        [key]: updatedData
                      }
                    });
                  };

                  const handleAddColumn = (colName: string) => {
                    if (!colName.trim() || rowCols.includes(colName)) return;
                    const updatedCols = [...rowCols, colName];
                    const updatedData = currentData.map(row => {
                      return {
                        colunas: updatedCols,
                        valores: { ...row.valores, [colName]: '' }
                      };
                    });
                    setFormData({
                      ...formData,
                      customQuadros: {
                        ...(formData.customQuadros || {}),
                        [key]: updatedData.length > 0 ? updatedData : [{ colunas: updatedCols, valores: {} }]
                      }
                    });
                  };

                  const handleRemoveColumn = (colName: string) => {
                    const updatedCols = rowCols.filter(c => c !== colName);
                    const updatedData = currentData.map(row => {
                      const newValores = { ...row.valores };
                      delete newValores[colName];
                      return {
                        colunas: updatedCols,
                        valores: newValores
                      };
                    });
                    setFormData({
                      ...formData,
                      customQuadros: {
                        ...(formData.customQuadros || {}),
                        [key]: updatedData
                      }
                    });
                  };

                  return (
                    <div className="space-y-6">
                      {/* Configuration & Customization Topbar */}
                      <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <span className="text-xs text-emerald-650 bg-emerald-50 border border-emerald-200 uppercase font-black px-2 py-0.5 rounded-full inline-block mb-1">
                              Eixo {qInfo.eixo} • Estatísticas
                            </span>
                            <h3 className="text-base  font-black text-slate-900 leading-tight">
                              Quadro {qInfo.id}: {qInfo.title}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                              Este quadro é totalmente personalizável. Configure as colunas abaixo conforme o modelo de coleta da sua instituição e insira os dados necessários.
                            </p>
                          </div>
                          
                          {!isReadOnly && (
                            <button
                              type="button"
                              onClick={handleAddRow}
                              className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#fec107] hover:bg-[#e0a800] text-black  font-black text-xs border-2 border-black py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-y-[1px]"
                            >
                              + Adicionar Linha de Dados
                            </button>
                          )}
                        </div>

                        {/* Column Customizer Panel */}
                        <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 border-2 border-black rounded-xl text-xs">
                          <span className="font-extrabold text-slate-800">⚙ Redefinir / Gerir Colunas:</span>
                          <div className="flex flex-wrap gap-2">
                            {rowCols.map(col => (
                              <span key={col} className="bg-white border-2 border-black rounded-lg px-2 py-1 flex items-center gap-1.5 font-bold text-sm text-slate-750">
                                {col}
                              </span>
                            ))}
                          </div>
                          {!isReadOnly && (
                            <div className="flex items-center gap-2 ml-auto">
                              <input
                                type="text"
                                id={`new-col-${key}`}
                                placeholder="Nova Coluna..."
                                className="text-sm px-2 py-1 border-2 border-black rounded-lg bg-white focus:outline-emerald-500 font-bold"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = (e.currentTarget as HTMLInputElement).value;
                                    if (val) {
                                      handleAddColumn(val);
                                      (e.currentTarget as HTMLInputElement).value = '';
                                    }
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById(`new-col-${key}`) as HTMLInputElement;
                                  if (input && input.value) {
                                    handleAddColumn(input.value);
                                    input.value = '';
                                  }
                                }}
                                className="bg-slate-900 border-2 border-black hover:bg-slate-800 text-[#fec107] px-3 py-1 rounded-lg text-xs uppercase font-black tracking-wider cursor-pointer transition-all"
                              >
                                + Adicionar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Main Dynamic Table Layout matching Eixo 1 visual styles */}
                      <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                        <div className="overflow-x-auto border-2 border-black rounded-xl">
                          <table className="w-full text-xs  border-collapse text-left">
                            <thead>
                              <tr className="bg-slate-900 text-white font-black uppercase text-xs tracking-wider border-b-2 border-black">
                                <th className="p-3 border-r-2 border-black w-12 text-center bg-slate-800">#</th>
                                {rowCols.map((col, idx) => (
                                  <th key={idx} className="p-3 border-r-2 border-black last:border-r-0">
                                    {col}
                                  </th>
                                ))}
                                {!isReadOnly && <th className="p-3 w-16 text-center">Ações</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {currentData.length > 0 && currentData.some(row => Object.keys(row.valores || {}).length > 0) ? (
                                currentData.map((row, rowIndex) => (
                                  <tr key={rowIndex} className="border-b-2 border-black last:border-b-0 hover:bg-slate-50 transition-colors">
                                    <td className="p-3 border-r-2 border-black text-center font-mono font-bold bg-slate-50">
                                      {rowIndex + 1}
                                    </td>
                                    {rowCols.map((col, colIdx) => {
                                      const isProvCol = col.toLowerCase().includes('província') || col.toLowerCase().includes('provincia');
                                      const isDistCol = col.toLowerCase().includes('distrito');
                                      const isNacCol = col.toLowerCase().includes('nacionalidade');
                                      const isRegCol = col.toLowerCase().includes('regime');

                                      if (isProvCol || isDistCol || isNacCol || isRegCol) {
                                        const type = isProvCol ? 'provincia' : isDistCol ? 'distrito' : isNacCol ? 'nacionalidade' : 'regime';
                                        let provincialValue = undefined;
                                        let nacValue = undefined;

                                        const provColName = rowCols.find(c => c.toLowerCase().includes('província') || c.toLowerCase().includes('provincia'));
                                        const nacColName = rowCols.find(c => c.toLowerCase().includes('nacionalidade'));
                                        
                                        if (isDistCol && provColName) {
                                          provincialValue = row.valores?.[provColName];
                                        }
                                        if (nacColName) {
                                          nacValue = row.valores?.[nacColName];
                                        }
                                        
                                        return (
                                          <td key={colIdx} className="p-2 border-r-2 border-black last:border-r-0">
                                            <GeoSelect 
                                              type={type as any}
                                              value={row.valores?.[col] || ''}
                                              provincia={provincialValue}
                                              nacionalidade={nacValue}
                                              onChange={(val) => {
                                                handleCellChange(rowIndex, col, val);
                                                // If changed province, reset district in the same row if it exists
                                                if (isProvCol && nacValue !== 'Estrangeira') {
                                                  const distColName = rowCols.find(c => c.toLowerCase().includes('distrito'));
                                                  if (distColName) {
                                                    handleCellChange(rowIndex, distColName, '');
                                                  }
                                                }
                                              }}
                                            />
                                          </td>
                                        );
                                      }

                                      return (
                                        <td key={colIdx} className="p-2 border-r-2 border-black last:border-r-0">
                                          <input
                                            type="text"
                                            disabled={isReadOnly}
                                            value={row.valores?.[col] || ''}
                                            placeholder={`Preencher ${col}...`}
                                            onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
                                            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded focus:border-black focus:outline-none transition-colors text-slate-800 font-semibold bg-transparent"
                                          />
                                        </td>
                                      );
                                    })}
                                    {!isReadOnly && (
                                      <td className="p-2 text-center">
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveRow(rowIndex)}
                                          className="bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-650 hover:text-red-800 w-7 h-7 flex items-center justify-center rounded-lg font-black text-sm cursor-pointer transition-all mx-auto shadow-sm"
                                          title="Excluir Linha"
                                        >
                                          ×
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={rowCols.length + (isReadOnly ? 1 : 2)} className="border-2 border-black p-12 text-center bg-slate-50 text-slate-400 italic font-medium">
                                    Esse quadro está à espera de ser personalizado. Clique em "+ Adicionar Linha de Dados" para preencher.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Totals & Summary panel at bottom of table */}
                        {currentData.length > 0 && (
                          <div className="mt-4 p-4 bg-slate-950 text-[#fec107] border-2 border-black rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs font-mono font-black uppercase tracking-wider">
                            <span>Resumo Estatístico Consolidado:</span>
                            <div className="flex flex-wrap gap-4">
                              {rowCols.filter(col => col.toLowerCase() !== 'descrição' && col.toLowerCase() !== 'categoria' && !col.toLowerCase().includes('nome') && !col.toLowerCase().includes('grau')).slice(0, 4).map((col, idx) => {
                                const sum = currentData.reduce((acc, row) => {
                                  const val = parseFloat(row.valores?.[col] || '');
                                  return acc + (isNaN(val) ? 0 : val);
                                }, 0);
                                if (sum > 0) {
                                  return (
                                    <span key={idx} className="bg-slate-900 border border-slate-800 px-3 py-1 rounded">
                                      {col}: <strong className="text-white font-bold">{sum}</strong>
                                    </span>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Category 1.9: Redes de Ensino e Outros could go here if needed */}

                
                {formSubTab === 'vagas_preenchidas' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-end mb-4">
                      <button 
                        type="button" 
                        onClick={() => {
                          const newRow = { 
                            id: Date.now().toString(), 
                            nome: '', duracao: '', iscedArea: '', iscedSubArea: '', regime: '', grau: '', 
                            vagasExistentes: 0, preenchidas: 0, naoPreenchidas: 0, nacionalidade: '', provincia: '', distrito: '' 
                          };
                          setFormData({...formData, coursesVagasPreenchidas: [...(formData.coursesVagasPreenchidas || []), newRow as any]});
                        }}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        + Adicionar Linha
                      </button>
                    </div>
                    <div className="overflow-x-auto border-2 border-black rounded-xl">
                      <table className="w-full text-xs border-collapse min-w-full min-w-[1200px]">
                        <thead>
                          <tr className="bg-slate-50">
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase">Nome do curso</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-20">***Duração (anos)</th>
                            <th colSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase text-center">{myInstitution?.abbreviation || 'IES'} {selectedYear - 1}</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-24">Regime-Curso</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-24">Grau</th>
                            <th colSpan={3} className="border-2 border-black p-2 bg-slate-100 uppercase text-center">Nº DE VAGAS EXISTENTE</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-16">Total</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-28">Nacionalidade</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-28">Província**</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-28">Distrito**</th>
                          </tr>
                          <tr className="bg-slate-50">
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center">Áreas</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center">Sub-áreas</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center w-16">VAGAS EXISTENTE</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center w-16">Preenchidas</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center w-16">*Não Preenchidas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.coursesVagasPreenchidas?.map((course, idx) => (
                              <tr key={course.id}>
                                <td className="border-2 border-black p-1">
                                  <CourseSelect 
                                    value={course.nome} 
                                    courses={instCourses} 
                                    onChange={(val) => {
                                      const updated = [...formData.coursesVagasPreenchidas!];
                                      updated[idx].nome = val;
                                      const detetado = detectCourseArea(val);
                                      if (detetado.area) {
                                        updated[idx].iscedArea = detetado.area;
                                        updated[idx].iscedSubArea = detetado.subarea;
                                      }
                                      setFormData(prev => ({ ...prev, coursesVagasPreenchidas: updated }));
                                    }} 
                                  />
                                </td>
                                <td className="border-2 border-black p-1">
                                  <select 
                                    className="w-full bg-transparent p-1 text-center font-bold text-xs" 
                                    value={course.duracao || ''}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesVagasPreenchidas!];
                                      updated[idx].duracao = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesVagasPreenchidas: updated }));
                                    }}
                                  >
                                    <option value="">Selecione</option>
                                    <option value="4 Anos">4 Anos</option>
                                    <option value="5 Anos">5 Anos</option>
                                  </select>
                                </td>
                                <td className="border-2 border-black p-1">
                                  <input 
                                    type="text" 
                                    className="w-full bg-transparent p-1 font-medium" 
                                    value={course.iscedArea}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesVagasPreenchidas!];
                                      updated[idx].iscedArea = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesVagasPreenchidas: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1">
                                  <input 
                                    type="text" 
                                    className="w-full bg-transparent p-1 font-medium" 
                                    value={course.iscedSubArea}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesVagasPreenchidas!];
                                      updated[idx].iscedSubArea = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesVagasPreenchidas: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1">
                                  <select 
                                    className="w-full bg-transparent p-1 text-xs font-bold"
                                    value={course.regime}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesVagasPreenchidas!];
                                      updated[idx].regime = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesVagasPreenchidas: updated }));
                                    }}
                                  >
                                    <option value="">Selecione</option>
                                    <option value="Laboral">Laboral</option>
                                    <option value="Pós Labora">Pós Labora</option>
                                    <option value="EAD">EAD</option>
                                  </select>
                                </td>
                                <td className="border-2 border-black p-1">
                                  <select 
                                    className="w-full bg-transparent p-1 text-xs font-bold"
                                    value={course.grau}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesVagasPreenchidas!];
                                      updated[idx].grau = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesVagasPreenchidas: updated }));
                                    }}
                                  >
                                    <option value="">Selecione</option>
                                    <option value="Licenciatura">Licenciatura</option>
                                    <option value="Mestrado">Mestrado</option>
                                    <option value="Doutoramento">Doutoramento</option>
                                  </select>
                                </td>
                                <td className="border-2 border-black p-1">
                                  <input 
                                    type="number" 
                                    className="w-full bg-transparent p-1 text-center font-bold" 
                                    value={course.vagasExistentes || ''}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 0;
                                      const updated = [...formData.coursesVagasPreenchidas!];
                                      updated[idx].vagasExistentes = val;
                                      updated[idx].naoPreenchidas = val - (updated[idx].preenchidas || 0);
                                      setFormData(prev => ({ ...prev, coursesVagasPreenchidas: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1">
                                  <input 
                                    type="number" 
                                    className="w-full bg-transparent p-1 text-center font-bold" 
                                    value={course.preenchidas || ''}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 0;
                                      const updated = [...formData.coursesVagasPreenchidas!];
                                      updated[idx].preenchidas = val;
                                      updated[idx].naoPreenchidas = (updated[idx].vagasExistentes || 0) - val;
                                      setFormData(prev => ({ ...prev, coursesVagasPreenchidas: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1 bg-slate-50">
                                  <input 
                                    type="number" 
                                    className="w-full bg-transparent p-1 text-center font-bold opacity-70" 
                                    value={course.naoPreenchidas}
                                    readOnly
                                  />
                                </td>
                                <td className="border-2 border-black p-1 bg-slate-100 text-center font-black">
                                  {(course.preenchidas || 0) + (course.naoPreenchidas || 0)}
                                </td>
                                <td className="border-2 border-black p-0 relative">
                                  <GeoSelect 
                                    type="nacionalidade"
                                    value={course.nacionalidade}
                                    onChange={(val) => {
                                      const updated = [...formData.coursesVagasPreenchidas!];
                                      updated[idx].nacionalidade = val;
                                      setFormData(prev => ({ ...prev, coursesVagasPreenchidas: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-0 relative">
                                  <GeoSelect 
                                    type="provincia"
                                    value={course.provincia}
                                    nacionalidade={course.nacionalidade}
                                    onChange={(val) => {
                                      const updated = [...formData.coursesVagasPreenchidas!];
                                      updated[idx].provincia = val;
                                      if (course.nacionalidade !== 'Estrangeira') {
                                        updated[idx].distrito = ''; // Reset district
                                      }
                                      setFormData(prev => ({ ...prev, coursesVagasPreenchidas: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-0 relative">
                                  <GeoSelect 
                                    type="distrito"
                                    value={course.distrito}
                                    provincia={course.provincia}
                                    nacionalidade={course.nacionalidade}
                                    onChange={(val) => {
                                      const updated = [...formData.coursesVagasPreenchidas!];
                                      updated[idx].distrito = val;
                                      setFormData(prev => ({ ...prev, coursesVagasPreenchidas: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1 text-center">
                                  <button 
                                    className="text-red-500 hover:text-red-700 font-bold p-1"
                                    onClick={() => {
                                      const updated = formData.coursesVagasPreenchidas!.filter(c => c.id !== course.id);
                                      setFormData(prev => ({ ...prev, coursesVagasPreenchidas: updated }));
                                    }}
                                  >
                                    ×
                                  </button>
                                </td>
                              </tr>
                          ))}
                          <tr className="bg-slate-200 border-t-2 border-black font-bold text-xs">
                            <td className="border-2 border-black p-2" colSpan={6}>TOTAL GERAL</td>
                            <td className="border-2 border-black p-1 text-center bg-slate-50">
                              {formData.coursesVagasPreenchidas?.reduce((acc, c) => acc + (c.vagasExistentes || 0), 0)}
                            </td>
                            <td className="border-2 border-black p-1 text-center bg-slate-50">
                              {formData.coursesVagasPreenchidas?.reduce((acc, c) => acc + (c.preenchidas || 0), 0)}
                            </td>
                            <td className="border-2 border-black p-1 text-center bg-slate-100">
                              {formData.coursesVagasPreenchidas?.reduce((acc, c) => acc + (c.naoPreenchidas || 0), 0)}
                            </td>
                            <td className="border-2 border-black p-1 text-center bg-slate-200 font-black">
                              {formData.coursesVagasPreenchidas?.reduce((acc, c) => acc + (c.vagasExistentes || 0), 0)}
                            </td>
                            <td colSpan={4} className="border-2 border-black p-1 bg-slate-100"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {formSubTab === 'estudantes_dinamica' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5">
                        <Database className="h-4 w-4 text-emerald-700" /> 1.3: Número de Estudantes Novos Ingresso, Matriculados, Graduados por Grau, Sexo e Cursos em Funcionamento no ano académico anterior
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newRow = { nome: '', duracao: '', iscedArea: '', iscedSubArea: '', regime: '', provincia: '', distrito: '', grau: '', ingressosHomens: 0, ingressosMulheres: 0, matriculadosHomens: 0, matriculadosMulheres: 0, graduadosHomens: 0, graduadosMulheres: 0 };
                          setFormData({...formData, coursesDinamica: [...(formData.coursesDinamica || []), newRow as any]});
                        }}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        + Adicionar Linha
                      </button>
                    </div>
                    <div className="overflow-x-auto border-2 border-black rounded-xl">
                      <table className="w-full text-xs border-collapse min-w-[1400px]">
                        <thead>
                          <tr className="bg-slate-50">
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase">Nome do curso</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-20">**Duração (anos)</th>
                            <th colSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase text-center">{myInstitution?.abbreviation || 'IES'} {selectedYear - 1}</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-24">Regime-Curso</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-28">Província</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-28">Distrito*</th>
                            <th rowSpan={2} className="border-2 border-black p-2 bg-slate-100 uppercase w-24">Grau</th>
                            <th colSpan={3} className="border-2 border-black p-2 bg-slate-100 uppercase text-center">Novos Ingressos</th>
                            <th colSpan={3} className="border-2 border-black p-2 bg-slate-100 uppercase text-center">Matriculados</th>
                            <th colSpan={3} className="border-2 border-black p-2 bg-slate-100 uppercase text-center">Graduados</th>
                          </tr>
                          <tr className="bg-slate-50">
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center">Áreas</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center">Sub-áreas</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center w-12">Homens</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center w-12">Mulheres</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center w-16">Total</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center w-12">Homens</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center w-12">Mulheres</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center w-16">Total</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center w-12">Homens</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center w-12">Mulheres</th>
                            <th className="border-2 border-black p-2 bg-slate-50 uppercase text-center w-16">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.coursesDinamica?.map((course, idx) => (
                              <tr key={idx}>
                                <td className="border-2 border-black p-1">
                                  <CourseSelect 
                                    value={course.nome} 
                                    courses={instCourses} 
                                    onChange={(val) => {
                                      const updated = [...formData.coursesDinamica!];
                                      updated[idx].nome = val;
                                      const detetado = detectCourseArea(val);
                                      if (detetado.area) {
                                        updated[idx].iscedArea = detetado.area;
                                        updated[idx].iscedSubArea = detetado.subarea;
                                      }
                                      setFormData(prev => ({ ...prev, coursesDinamica: updated }));
                                    }} 
                                  />
                                </td>
                                <td className="border-2 border-black p-1">
                                  <select 
                                    className="w-full bg-transparent p-1 text-center font-bold text-xs" 
                                    value={course.duracao || ''}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesDinamica!];
                                      updated[idx].duracao = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesDinamica: updated }));
                                    }}
                                  >
                                    <option value="">Selecione</option>
                                    <option value="4 Anos">4 Anos</option>
                                    <option value="5 Anos">5 Anos</option>
                                  </select>
                                </td>
                                <td className="border-2 border-black p-1">
                                  <input 
                                    type="text" 
                                    className="w-full bg-transparent p-1 font-medium" 
                                    value={course.iscedArea}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesDinamica!];
                                      updated[idx].iscedArea = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesDinamica: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1">
                                  <input 
                                    type="text" 
                                    className="w-full bg-transparent p-1 font-medium" 
                                    value={course.iscedSubArea}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesDinamica!];
                                      updated[idx].iscedSubArea = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesDinamica: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1">
                                  <select 
                                    className="w-full bg-transparent p-1 text-xs font-bold"
                                    value={course.regime}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesDinamica!];
                                      updated[idx].regime = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesDinamica: updated }));
                                    }}
                                  >
                                    <option value="">Selecione</option>
                                    <option value="Laboral">Laboral</option>
                                    <option value="Pós Labora">Pós Labora</option>
                                    <option value="EAD">EAD</option>
                                  </select>
                                </td>
                                <td className="border-2 border-black p-1">
                                  <select 
                                    className="w-full bg-transparent p-1 font-bold text-xs" 
                                    value={course.provincia}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesDinamica!];
                                      updated[idx].provincia = e.target.value;
                                      updated[idx].distrito = ''; // Reset district
                                      setFormData(prev => ({ ...prev, coursesDinamica: updated }));
                                    }}
                                  >
                                    <option value="">Selecione Província</option>
                                    {PROVINCIAS_MOZ.map(p => (
                                      <option key={p} value={p}>{p}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="border-2 border-black p-1">
                                  <select 
                                    className="w-full bg-transparent p-1 font-bold text-xs" 
                                    value={course.distrito}
                                    disabled={!course.provincia}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesDinamica!];
                                      updated[idx].distrito = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesDinamica: updated }));
                                    }}
                                  >
                                    <option value="">Selecione Distrito</option>
                                    {course.provincia && DISTRITOS_POR_PROVINCIA[course.provincia]?.map(d => (
                                      <option key={d} value={d}>{d}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="border-2 border-black p-1">
                                  <select 
                                    className="w-full bg-transparent p-1 text-xs font-bold"
                                    value={course.grau}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesDinamica!];
                                      updated[idx].grau = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesDinamica: updated }));
                                    }}
                                  >
                                    <option value="">Selecione</option>
                                    <option value="Licenciatura">Licenciatura</option>
                                    <option value="Mestrado">Mestrado</option>
                                    <option value="Doutoramento">Doutoramento</option>
                                  </select>
                                </td>
                                <td className="border-2 border-black p-1">
                                  <input 
                                    type="number" 
                                    className="w-full bg-transparent p-1 text-center font-bold" 
                                    value={course.ingressosHomens || ''}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesDinamica!];
                                      updated[idx].ingressosHomens = parseInt(e.target.value) || 0;
                                      setFormData(prev => ({ ...prev, coursesDinamica: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1">
                                  <input 
                                    type="number" 
                                    className="w-full bg-transparent p-1 text-center font-bold" 
                                    value={course.ingressosMulheres || ''}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesDinamica!];
                                      updated[idx].ingressosMulheres = parseInt(e.target.value) || 0;
                                      setFormData(prev => ({ ...prev, coursesDinamica: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1 bg-slate-100 text-center font-black">
                                  {(course.ingressosHomens || 0) + (course.ingressosMulheres || 0)}
                                </td>
                                <td className="border-2 border-black p-1">
                                  <input 
                                    type="number" 
                                    className="w-full bg-transparent p-1 text-center font-bold" 
                                    value={course.matriculadosHomens || ''}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesDinamica!];
                                      updated[idx].matriculadosHomens = parseInt(e.target.value) || 0;
                                      setFormData(prev => ({ ...prev, coursesDinamica: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1">
                                  <input 
                                    type="number" 
                                    className="w-full bg-transparent p-1 text-center font-bold" 
                                    value={course.matriculadosMulheres || ''}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesDinamica!];
                                      updated[idx].matriculadosMulheres = parseInt(e.target.value) || 0;
                                      setFormData(prev => ({ ...prev, coursesDinamica: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1 bg-slate-100 text-center font-black">
                                  {(course.matriculadosHomens || 0) + (course.matriculadosMulheres || 0)}
                                </td>
                                <td className="border-2 border-black p-1">
                                  <input 
                                    type="number" 
                                    className="w-full bg-transparent p-1 text-center font-bold" 
                                    value={course.graduadosHomens || ''}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesDinamica!];
                                      updated[idx].graduadosHomens = parseInt(e.target.value) || 0;
                                      setFormData(prev => ({ ...prev, coursesDinamica: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1">
                                  <input 
                                    type="number" 
                                    className="w-full bg-transparent p-1 text-center font-bold" 
                                    value={course.graduadosMulheres || ''}
                                    onChange={(e) => {
                                      const updated = [...formData.coursesDinamica!];
                                      updated[idx].graduadosMulheres = parseInt(e.target.value) || 0;
                                      setFormData(prev => ({ ...prev, coursesDinamica: updated }));
                                    }}
                                  />
                                </td>
                                <td className="border-2 border-black p-1 bg-slate-100 text-center font-black">
                                  {(course.graduadosHomens || 0) + (course.graduadosMulheres || 0)}
                                </td>

                              </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'nacionalidade_dinamica' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-sky-700" /> 1.4: Número de Novos Ingressos, Matriculados e Graduados por Nacionalidade e sexo
                      </h3>
                    </div>
                    <div className="overflow-x-auto border-2 border-black rounded-xl">
                      <table className="w-full text-xs border-collapse bg-white">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={3}>Estudantes</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold relative" colSpan={6}>
                              <span className="block border-b-2 border-black absolute top-0 left-0 right-0 h-full" style={{zIndex: -1}}></span>
                              Nacionalidade
                            </th>
                            <th className="p-1 text-center font-bold bg-slate-300" colSpan={3} rowSpan={2}>Todos</th>
                          </tr>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-l-2 border-r-2 border-t-2 border-black p-1 text-center font-bold" colSpan={3}>Moçambicana</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold" colSpan={3}>Estrangeira</th>
                          </tr>
                          <tr className="bg-slate-100 border-b-2 border-black shadow-sm">
                            <th className="border-l-2 border-r-2 border-black p-1 text-center">Homens</th>
                            <th className="border-r-2 border-black p-1 text-center">Mulheres</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-slate-200">Total</th>
                            <th className="border-r-2 border-black p-1 text-center">Homens</th>
                            <th className="border-r-2 border-black p-1 text-center">Mulheres</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-slate-200">Total</th>
                            <th className="border-r-2 border-l-2 border-black p-1 text-center">Homens</th>
                            <th className="border-r-2 border-black p-1 text-center">Mulheres</th>
                            <th className="p-1 text-center font-bold bg-slate-300 shadow-inner">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { 
                              key: 'novosIngressos', 
                              label: 'Novos Ingressos', 
                              dataMoc: formData.nacionalidadeDinamica?.novosIngressosMocambicana,
                              dataEst: formData.nacionalidadeDinamica?.novosIngressosEstrangeira
                            },
                            { 
                              key: 'matriculados', 
                              label: 'Matriculados', 
                              dataMoc: formData.nacionalidadeDinamica?.matriculadosMocambicana,
                              dataEst: formData.nacionalidadeDinamica?.matriculadosEstrangeira
                            },
                            { 
                              key: 'graduados', 
                              label: 'Graduados', 
                              dataMoc: formData.nacionalidadeDinamica?.graduadosMocambicana,
                              dataEst: formData.nacionalidadeDinamica?.graduadosEstrangeira
                            },
                          ].map((row, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-2 font-medium bg-slate-50">{row.label}</td>
                              <td className="border-r-2 border-black p-0 relative">
                                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-bl-sm"></span>
                                <input
                                  type="number"
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50 transition-colors"
                                  value={row.dataMoc?.homens || ''}
                                  onChange={(e) => {
                                    setFormData(prev => {
                                      const key = `${row.key}Mocambicana` as keyof typeof prev.nacionalidadeDinamica;
                                      return {
                                        ...prev,
                                        nacionalidadeDinamica: {
                                          ...prev.nacionalidadeDinamica,
                                          [key]: { ...(prev.nacionalidadeDinamica?.[key]), homens: parseInt(e.target.value) || 0 }
                                        }
                                      };
                                    });
                                  }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400"></div>
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <input
                                  type="number"
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50 transition-colors"
                                  value={row.dataMoc?.mulheres || ''}
                                  onChange={(e) => {
                                    setFormData(prev => {
                                      const key = `${row.key}Mocambicana` as keyof typeof prev.nacionalidadeDinamica;
                                      return {
                                        ...prev,
                                        nacionalidadeDinamica: {
                                          ...prev.nacionalidadeDinamica,
                                          [key]: { ...(prev.nacionalidadeDinamica?.[key]), mulheres: parseInt(e.target.value) || 0 }
                                        }
                                      };
                                    });
                                  }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400"></div>
                              </td>
                              <td className="border-r-2 border-black p-1 text-center font-bold bg-slate-50 relative">
                                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-bl-sm"></span>
                                {(row.dataMoc?.homens || 0) + (row.dataMoc?.mulheres || 0)}
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <input
                                  type="number"
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50 transition-colors"
                                  value={row.dataEst?.homens || ''}
                                  onChange={(e) => {
                                    setFormData(prev => {
                                      const key = `${row.key}Estrangeira` as keyof typeof prev.nacionalidadeDinamica;
                                      return {
                                        ...prev,
                                        nacionalidadeDinamica: {
                                          ...prev.nacionalidadeDinamica,
                                          [key]: { ...(prev.nacionalidadeDinamica?.[key]), homens: parseInt(e.target.value) || 0 }
                                        }
                                      };
                                    });
                                  }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400"></div>
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <input
                                  type="number"
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50 transition-colors"
                                  value={row.dataEst?.mulheres || ''}
                                  onChange={(e) => {
                                    setFormData(prev => {
                                      const key = `${row.key}Estrangeira` as keyof typeof prev.nacionalidadeDinamica;
                                      return {
                                        ...prev,
                                        nacionalidadeDinamica: {
                                          ...prev.nacionalidadeDinamica,
                                          [key]: { ...(prev.nacionalidadeDinamica?.[key]), mulheres: parseInt(e.target.value) || 0 }
                                        }
                                      };
                                    });
                                  }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400"></div>
                              </td>
                              <td className="border-r-2 border-black p-1 text-center font-bold bg-slate-50 relative">
                                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-bl-sm"></span>
                                {(row.dataEst?.homens || 0) + (row.dataEst?.mulheres || 0)}
                              </td>
                              <td className="border-r-2 border-l-2 border-black p-0 relative">
                                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-bl-sm"></span>
                                <div className="w-full h-full min-h-[30px] flex items-center justify-center font-bold text-sky-600">
                                  {(row.dataMoc?.homens || 0) + (row.dataEst?.homens || 0)}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400"></div>
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <div className="w-full h-full min-h-[30px] flex items-center justify-center font-bold text-sky-600">
                                  {(row.dataMoc?.mulheres || 0) + (row.dataEst?.mulheres || 0)}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400"></div>
                              </td>
                              <td className="p-1 text-center font-black bg-slate-100 relative">
                                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-bl-sm"></span>
                                {(row.dataMoc?.homens || 0) + (row.dataMoc?.mulheres || 0) + (row.dataEst?.homens || 0) + (row.dataEst?.mulheres || 0)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {formSubTab === 'estudantes_estrangeiros' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-sky-700" /> 1.5: Número de Estudantes Estrangeiros, Novos Ingressos, Matriculados e Graduados por Curso, Grau e Sexo
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newRow = { nomeCurso: '', paisProveniencia: '', novosIngressosHomens: 0, novosIngressosMulheres: 0, matriculadosHomens: 0, matriculadosMulheres: 0, graduadosHomens: 0, graduadosMulheres: 0 };
                          setFormData({...formData, coursesEstudantesEstrangeiros: [...(formData.coursesEstudantesEstrangeiros || []), newRow as any]});
                        }}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto border-2 border-black rounded-xl">
                      <table className="w-full text-xs border-collapse bg-white whitespace-nowrap min-w-full min-w-[1200px]">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Nome do curso</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold" colSpan={2}>{myInstitution?.abbreviation || 'IES'} {selectedYear - 1}</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Regime-Curso</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>*País de proveniência</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Grau</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold" colSpan={3}>Novos Ingressos</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold" colSpan={3}>Matriculados</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold" colSpan={3}>Graduados</th>
                            <th className="p-2 font-bold bg-gray-300 text-center" rowSpan={2}>Ações</th>
                          </tr>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Áreas</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Sub-áreas</th>
                            <th className="border-r-2 border-l-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                            <th className="border-r-2 border-l-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                            <th className="border-r-2 border-l-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.coursesEstudantesEstrangeiros?.map((course, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                               <td className="border-r-2 border-black p-0 relative">
                                  <CourseSelect 
    value={course.nomeCurso} 
    courses={instCourses} 
    onChange={(val) => {
      const updated = [...formData.coursesEstudantesEstrangeiros!];
      updated[idx].nomeCurso = val;
      const detetado = detectCourseArea(val);
      if (detetado.area) {
        updated[idx].iscedArea = detetado.area;
        updated[idx].iscedSubArea = detetado.subarea;
      }
      setFormData(prev => ({ ...prev, coursesEstudantesEstrangeiros: updated }));
    }} 
  />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <input type="text" className="w-full h-full min-h-[30px] bg-transparent p-1 focus:outline-none focus:bg-sky-50 transition-colors" value={course.iscedArea || ''} onChange={(e) => {
                                      const updated = [...formData.coursesEstudantesEstrangeiros!];
                                      updated[idx].iscedArea = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesEstudantesEstrangeiros: updated }));
                                  }} />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <input type="text" className="w-full h-full min-h-[30px] bg-transparent p-1 focus:outline-none focus:bg-sky-50 transition-colors" value={course.iscedSubArea || ''} onChange={(e) => {
                                      const updated = [...formData.coursesEstudantesEstrangeiros!];
                                      updated[idx].iscedSubArea = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesEstudantesEstrangeiros: updated }));
                                  }} />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select 
                                    className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs"
                                    value={course.regimeCurso || ''} 
                                    onChange={(e) => {
                                      const updated = [...formData.coursesEstudantesEstrangeiros!];
                                      updated[idx].regimeCurso = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesEstudantesEstrangeiros: updated }));
                                    }}
                                  >
                                    <option value="">Selecione</option>
                                    <option value="Laboral">Laboral</option>
                                    <option value="Pós Labora">Pós Labora</option>
                                    <option value="EAD">EAD</option>
                                  </select>
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <input 
                                    type="text"
                                    className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs focus:outline-none focus:bg-sky-50"
                                    value={course.paisProveniencia || ''} 
                                    onChange={(e) => {
                                      const updated = [...formData.coursesEstudantesEstrangeiros!];
                                      updated[idx].paisProveniencia = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesEstudantesEstrangeiros: updated }));
                                    }}
                                    placeholder="Digite o país"
                                  />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select 
                                    className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs"
                                    value={course.grau || ''} 
                                    onChange={(e) => {
                                      const updated = [...formData.coursesEstudantesEstrangeiros!];
                                      updated[idx].grau = e.target.value;
                                      setFormData(prev => ({ ...prev, coursesEstudantesEstrangeiros: updated }));
                                    }}
                                  >
                                    <option value="">Selecione</option>
                                    <option value="Licenciatura">Licenciatura</option>
                                    <option value="Mestrado">Mestrado</option>
                                    <option value="Doutoramento">Doutoramento</option>
                                  </select>
                               </td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={course.novosIngressosHomens || ''} onChange={(e) => { const updated = [...formData.coursesEstudantesEstrangeiros!]; updated[idx].novosIngressosHomens = parseInt(e.target.value)||0; setFormData(prev => ({ ...prev, coursesEstudantesEstrangeiros: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={course.novosIngressosMulheres || ''} onChange={(e) => { const updated = [...formData.coursesEstudantesEstrangeiros!]; updated[idx].novosIngressosMulheres = parseInt(e.target.value)||0; setFormData(prev => ({ ...prev, coursesEstudantesEstrangeiros: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold bg-slate-100">{(course.novosIngressosHomens || 0) + (course.novosIngressosMulheres || 0)}</td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={course.matriculadosHomens || ''} onChange={(e) => { const updated = [...formData.coursesEstudantesEstrangeiros!]; updated[idx].matriculadosHomens = parseInt(e.target.value)||0; setFormData(prev => ({ ...prev, coursesEstudantesEstrangeiros: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={course.matriculadosMulheres || ''} onChange={(e) => { const updated = [...formData.coursesEstudantesEstrangeiros!]; updated[idx].matriculadosMulheres = parseInt(e.target.value)||0; setFormData(prev => ({ ...prev, coursesEstudantesEstrangeiros: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold bg-slate-100">{(course.matriculadosHomens || 0) + (course.matriculadosMulheres || 0)}</td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={course.graduadosHomens || ''} onChange={(e) => { const updated = [...formData.coursesEstudantesEstrangeiros!]; updated[idx].graduadosHomens = parseInt(e.target.value)||0; setFormData(prev => ({ ...prev, coursesEstudantesEstrangeiros: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={course.graduadosMulheres || ''} onChange={(e) => { const updated = [...formData.coursesEstudantesEstrangeiros!]; updated[idx].graduadosMulheres = parseInt(e.target.value)||0; setFormData(prev => ({ ...prev, coursesEstudantesEstrangeiros: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold bg-slate-100">{(course.graduadosHomens || 0) + (course.graduadosMulheres || 0)}</td>
                               <td className="p-1 text-center text-red-500 font-black cursor-pointer hover:bg-red-50" onClick={() => setFormData(prev => ({...prev, coursesEstudantesEstrangeiros: prev.coursesEstudantesEstrangeiros?.filter((_,i) => i !== idx)}))}>×</td>
                            </tr>
                          ))}
                          {/* Linha de Total */}
                          <tr className="bg-slate-200 border-t-2 border-black font-bold">
                            <td className="border-r-2 border-black p-2 text-right" colSpan={5}>Total</td>
                            <td className="border-r-2 border-l-2 border-black p-1 text-center">
                              {formData.coursesEstudantesEstrangeiros?.reduce((acc, c) => acc + (c.novosIngressosHomens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.coursesEstudantesEstrangeiros?.reduce((acc, c) => acc + (c.novosIngressosMulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-sky-800 bg-slate-300">
                              {formData.coursesEstudantesEstrangeiros?.reduce((acc, c) => acc + (c.novosIngressosHomens || 0) + (c.novosIngressosMulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-l-2 border-black p-1 text-center">
                              {formData.coursesEstudantesEstrangeiros?.reduce((acc, c) => acc + (c.matriculadosHomens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.coursesEstudantesEstrangeiros?.reduce((acc, c) => acc + (c.matriculadosMulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-sky-800 bg-slate-300">
                              {formData.coursesEstudantesEstrangeiros?.reduce((acc, c) => acc + (c.matriculadosHomens || 0) + (c.matriculadosMulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-l-2 border-black p-1 text-center">
                              {formData.coursesEstudantesEstrangeiros?.reduce((acc, c) => acc + (c.graduadosHomens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.coursesEstudantesEstrangeiros?.reduce((acc, c) => acc + (c.graduadosMulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-sky-800 bg-slate-300">
                              {formData.coursesEstudantesEstrangeiros?.reduce((acc, c) => acc + (c.graduadosHomens || 0) + (c.graduadosMulheres || 0), 0)}
                            </td>
                            <td className="p-1"></td>
                          </tr>
                        </tbody>
                       </table>
                    </div>

                  </div>
                )}
                
                {formSubTab === 'estudantes_needs_especiais' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-sky-700" /> 1.6: Número de Estudantes com Necessidades Especiais por Curso, Grau e Sexo
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newRow = { nomeCurso: '', iscedArea: '', iscedSubArea: '', regime: '', provincia: '', distrito: '', grau: '', cadeirantes: { homens: 0, mulheres: 0, total: 0 }, visual: { homens: 0, mulheres: 0, total: 0 }, auditiva: { homens: 0, mulheres: 0, total: 0 }, outros: { homens: 0, mulheres: 0, total: 0 } };
                          setFormData({...formData, coursesNeedsEspeciais: [...(formData.coursesNeedsEspeciais || []), newRow as any]});
                        }}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                     <div className="overflow-x-auto border-2 border-black rounded-xl">
                       <table className="w-full text-xs border-collapse min-w-[1500px]">
                        <thead>
                          <tr className="bg-slate-300">
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Nome do curso</th>
                            <th colSpan={2} className="border-2 border-black p-2 uppercase text-center">{myInstitution?.abbreviation || 'IES'} {selectedYear - 1}</th>
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Regime-Curso</th>
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Província</th>
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Distrito</th>
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Grau</th>
                            <th colSpan={3} className="border-2 border-black p-2 uppercase text-center">Cadeirantes</th>
                            <th colSpan={3} className="border-2 border-black p-2 uppercase text-center">Visual</th>
                            <th colSpan={3} className="border-2 border-black p-2 uppercase text-center">Auditiva</th>
                            <th colSpan={3} className="border-2 border-black p-2 uppercase text-center">Outros</th>
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Ações</th>
                          </tr>
                          <tr className="bg-slate-300">
                              <th className="border-2 border-black p-1">Áreas</th>
                              <th className="border-2 border-black p-1">Sub-áreas</th>
                              <th className="border-2 border-black p-1">H</th><th className="border-2 border-black p-1">M</th><th className="border-2 border-black p-1">T</th>
                              <th className="border-2 border-black p-1">H</th><th className="border-2 border-black p-1">M</th><th className="border-2 border-black p-1">T</th>
                              <th className="border-2 border-black p-1">H</th><th className="border-2 border-black p-1">M</th><th className="border-2 border-black p-1">T</th>
                              <th className="border-2 border-black p-1">H</th><th className="border-2 border-black p-1">M</th><th className="border-2 border-black p-1">T</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.coursesNeedsEspeciais?.map((course, idx) => (
                            <tr key={idx}>
                               <td className="border-2 border-black p-1"><CourseSelect 
    value={course.nomeCurso} 
    courses={instCourses} 
    onChange={(val) => {
      const updated = [...formData.coursesNeedsEspeciais!];
      updated[idx].nomeCurso = val;
      const detetado = detectCourseArea(val);
      if (detetado.area) {
        updated[idx].iscedArea = detetado.area;
        updated[idx].iscedSubArea = detetado.subarea;
      }
      setFormData(prev => ({ ...prev, coursesNeedsEspeciais: updated }));
    }} 
  /></td>
                               <td className="border-2 border-black p-1"><input type="text" className="w-full bg-transparent p-1" value={course.iscedArea} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciais!]; updated[idx].iscedArea = e.target.value; setFormData(prev => ({ ...prev, coursesNeedsEspeciais: updated })); }} /></td>
                               <td className="border-2 border-black p-1"><input type="text" className="w-full bg-transparent p-1" value={course.iscedSubArea} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciais!]; updated[idx].iscedSubArea = e.target.value; setFormData(prev => ({ ...prev, coursesNeedsEspeciais: updated })); }} /></td>
                               <td className="border-2 border-black p-1"><select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={course.regime} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciais!]; updated[idx].regime = e.target.value; setFormData(prev => ({ ...prev, coursesNeedsEspeciais: updated })); }}>
  <option value="">Selecione</option>
  <option value="Laboral">Laboral</option>
  <option value="Pós Labora">Pós Labora</option>
  <option value="EAD">EAD</option>
</select></td>
                               <td className="border-2 border-black p-1"><select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={course.provincia || ''} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciais!]; updated[idx].provincia = e.target.value; updated[idx].distrito = ''; setFormData(prev => ({ ...prev, coursesNeedsEspeciais: updated })); }}>
  <option value="">Província</option>
  {PROVINCIAS_MOZ.map(p => <option key={p} value={p}>{p}</option>)}
</select></td>
                               <td className="border-2 border-black p-1"><select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={course.distrito || ''} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciais!]; updated[idx].distrito = e.target.value; setFormData(prev => ({ ...prev, coursesNeedsEspeciais: updated })); }} disabled={!course.provincia}>
  <option value="">Distrito</option>
  {(course.provincia && DISTRITOS_POR_PROVINCIA[course.provincia as keyof typeof DISTRITOS_POR_PROVINCIA]) ? DISTRITOS_POR_PROVINCIA[course.provincia as keyof typeof DISTRITOS_POR_PROVINCIA].map(d => <option key={d} value={d}>{d}</option>) : <option value="" disabled>Selecione a província primeiro</option>}
</select></td>
                               <td className="border-2 border-black p-1"><select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={course.grau || ''} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciais!]; updated[idx].grau = e.target.value; setFormData(prev => ({ ...prev, coursesNeedsEspeciais: updated })); }}>
  <option value="">Selecione</option>
  <option value="Licenciatura">Licenciatura</option>
  <option value="Mestrado">Mestrado</option>
  <option value="Doutoramento">Doutoramento</option>
</select></td>
                               
                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent" value={course.cadeirantes.homens} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciais!]; updated[idx].cadeirantes.homens = parseInt(e.target.value)||0; updated[idx].cadeirantes.total = updated[idx].cadeirantes.homens + updated[idx].cadeirantes.mulheres; setFormData(prev => ({ ...prev, coursesNeedsEspeciais: updated })); }} /></td>
                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent" value={course.cadeirantes.mulheres} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciais!]; updated[idx].cadeirantes.mulheres = parseInt(e.target.value)||0; updated[idx].cadeirantes.total = updated[idx].cadeirantes.homens + updated[idx].cadeirantes.mulheres; setFormData(prev => ({ ...prev, coursesNeedsEspeciais: updated })); }} /></td>
                               <td className="border-2 border-black p-1 bg-slate-100 text-center font-black">{course.cadeirantes.total}</td>
                               
                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent" value={course.visual.homens} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciais!]; updated[idx].visual.homens = parseInt(e.target.value)||0; updated[idx].visual.total = updated[idx].visual.homens + updated[idx].visual.mulheres; setFormData(prev => ({ ...prev, coursesNeedsEspeciais: updated })); }} /></td>
                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent" value={course.visual.mulheres} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciais!]; updated[idx].visual.mulheres = parseInt(e.target.value)||0; updated[idx].visual.total = updated[idx].visual.homens + updated[idx].visual.mulheres; setFormData(prev => ({ ...prev, coursesNeedsEspeciais: updated })); }} /></td>
                               <td className="border-2 border-black p-1 bg-slate-100 text-center font-black">{course.visual.total}</td>
                               
                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent" value={course.auditiva.homens} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciais!]; updated[idx].auditiva.homens = parseInt(e.target.value)||0; updated[idx].auditiva.total = updated[idx].auditiva.homens + updated[idx].auditiva.mulheres; setFormData(prev => ({ ...prev, coursesNeedsEspeciais: updated })); }} /></td>
                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent" value={course.auditiva.mulheres} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciais!]; updated[idx].auditiva.mulheres = parseInt(e.target.value)||0; updated[idx].auditiva.total = updated[idx].auditiva.homens + updated[idx].auditiva.mulheres; setFormData(prev => ({ ...prev, coursesNeedsEspeciais: updated })); }} /></td>
                               <td className="border-2 border-black p-1 bg-slate-100 text-center font-black">{course.auditiva.total}</td>

                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent" value={course.outros.homens} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciais!]; updated[idx].outros.homens = parseInt(e.target.value)||0; updated[idx].outros.total = updated[idx].outros.homens + updated[idx].outros.mulheres; setFormData(prev => ({ ...prev, coursesNeedsEspeciais: updated })); }} /></td>
                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent" value={course.outros.mulheres} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciais!]; updated[idx].outros.mulheres = parseInt(e.target.value)||0; updated[idx].outros.total = updated[idx].outros.homens + updated[idx].outros.mulheres; setFormData(prev => ({ ...prev, coursesNeedsEspeciais: updated })); }} /></td>
                               <td className="border-2 border-black p-1 bg-slate-100 text-center font-black">{course.outros.total}</td>
                               
                               <td className="border-2 border-black text-center text-red-500 font-black cursor-pointer" onClick={() => setFormData(prev => ({...prev, coursesNeedsEspeciais: prev.coursesNeedsEspeciais?.filter((_,i) => i !== idx)}))}>×</td>
                            </tr>
                          ))}
                        </tbody>
                       </table>
                    </div>

                  </div>
                )}
                
                {formSubTab === 'estudantes_needs_especiais_outros' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-sky-700" /> 1.7: Número de Estudantes com Outras Necessidades Especiais não especificadas no quadro 1.6 por Curso, Grau e Sexo
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newRow = { nomeCurso: '', iscedArea: '', iscedSubArea: '', regimeCurso: '', provincia: '', distrito: '', grau: '', tipoNecessidade: '', homens: 0, mulheres: 0, total: 0 };
                          setFormData({...formData, coursesNeedsEspeciaisOutros: [...(formData.coursesNeedsEspeciaisOutros || []), newRow as any]});
                        }}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        + Adicionar Linha
                      </button>
                    </div>
                    <div className="overflow-x-auto border-2 border-black rounded-xl">
                       <table className="w-full text-xs border-collapse min-w-[1300px]">
                        <thead>
                          <tr className="bg-slate-300">
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Nome do curso</th>
                            <th colSpan={2} className="border-2 border-black p-2 uppercase text-center">{myInstitution?.abbreviation || 'IES'} {selectedYear - 1}</th>
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Regime-Curso</th>
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Província</th>
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Distrito</th>
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Grau</th>
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Tipo de Necessidade</th>
                            <th colSpan={3} className="border-2 border-black p-2 uppercase text-center">Outros</th>
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Ações</th>
                          </tr>
                          <tr className="bg-slate-300">
                              <th className="border-2 border-black p-1">Áreas</th>
                              <th className="border-2 border-black p-1">Sub-areas</th>
                              <th className="border-2 border-black p-1">H</th>
                              <th className="border-2 border-black p-1">M</th>
                              <th className="border-2 border-black p-1">T</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.coursesNeedsEspeciaisOutros?.map((course, idx) => (
                            <tr key={idx}>
                               <td className="border-2 border-black p-1"><CourseSelect 
    value={course.nomeCurso} 
    courses={instCourses} 
    onChange={(val) => {
      const updated = [...formData.coursesNeedsEspeciaisOutros!];
      updated[idx].nomeCurso = val;
      const detetado = detectCourseArea(val);
      if (detetado.area) {
        updated[idx].iscedArea = detetado.area;
        updated[idx].iscedSubArea = detetado.subarea;
      }
      setFormData(prev => ({ ...prev, coursesNeedsEspeciaisOutros: updated }));
    }} 
  /></td>
                               <td className="border-2 border-black p-1"><input type="text" className="w-full bg-transparent p-1" value={course.iscedArea || ''} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciaisOutros!]; updated[idx].iscedArea = e.target.value; setFormData(prev => ({ ...prev, coursesNeedsEspeciaisOutros: updated })); }} /></td>
                               <td className="border-2 border-black p-1"><input type="text" className="w-full bg-transparent p-1" value={course.iscedSubArea || ''} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciaisOutros!]; updated[idx].iscedSubArea = e.target.value; setFormData(prev => ({ ...prev, coursesNeedsEspeciaisOutros: updated })); }} /></td>
                               <td className="border-2 border-black p-1"><select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={course.regimeCurso || ''} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciaisOutros!]; updated[idx].regimeCurso = e.target.value; setFormData(prev => ({ ...prev, coursesNeedsEspeciaisOutros: updated })); }}>
                                 <option value="">Selecione</option>
                                 <option value="Laboral">Laboral</option>
                                 <option value="Pós Laboral">Pós Laboral</option>
                                 <option value="EAD">EAD</option>
                               </select></td>
                               <td className="border-2 border-black p-1"><select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={course.provincia || ''} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciaisOutros!]; updated[idx].provincia = e.target.value; updated[idx].distrito = ''; setFormData(prev => ({ ...prev, coursesNeedsEspeciaisOutros: updated })); }}>
                                 <option value="">Província</option>
                                 {PROVINCIAS_MOZ.map(p => <option key={p} value={p}>{p}</option>)}
                               </select></td>
                               <td className="border-2 border-black p-1"><select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={course.distrito || ''} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciaisOutros!]; updated[idx].distrito = e.target.value; setFormData(prev => ({ ...prev, coursesNeedsEspeciaisOutros: updated })); }} disabled={!course.provincia}>
                                 <option value="">Distrito</option>
                                 {(course.provincia && DISTRITOS_POR_PROVINCIA[course.provincia as keyof typeof DISTRITOS_POR_PROVINCIA]) ? DISTRITOS_POR_PROVINCIA[course.provincia as keyof typeof DISTRITOS_POR_PROVINCIA].map(d => <option key={d} value={d}>{d}</option>) : <option value="" disabled>Selecione a província primeiro</option>}
                               </select></td>
                               <td className="border-2 border-black p-1"><select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={course.grau || ''} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciaisOutros!]; updated[idx].grau = e.target.value; setFormData(prev => ({ ...prev, coursesNeedsEspeciaisOutros: updated })); }}>
                                 <option value="">Selecione</option>
                                 <option value="Bacharelato">Bacharelato</option>
                                 <option value="Licenciatura">Licenciatura</option>
                                 <option value="Mestrado">Mestrado</option>
                                 <option value="Doutoramento">Doutoramento</option>
                               </select></td>
                               <td className="border-2 border-black p-1">
                                 <select 
                                   className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" 
                                   value={course.tipoNecessidade || ''} 
                                   onChange={(e) => { 
                                     const updated = [...formData.coursesNeedsEspeciaisOutros!]; 
                                     updated[idx].tipoNecessidade = e.target.value; 
                                     setFormData(prev => ({ ...prev, coursesNeedsEspeciaisOutros: updated })); 
                                   }}
                                 >
                                   <option value="">Selecione</option>
                                   <option value="Cadeirante">Cadeirante</option>
                                   <option value="Visual">Visual</option>
                                   <option value="Auditiva">Auditiva</option>
                                   <option value="Moleta">Moleta</option>
                                   <option value="Braço amputado">Braço amputado</option>
                                   <option value="Pé amputado">Pé amputado</option>
                                   <option value="Paralisia Cerebral">Paralisia Cerebral</option>
                                   <option value="Deficiência Intelectual">Deficiência Intelectual</option>
                                   <option value="Autismo">Autismo</option>
                                   <option value="Dificuldades de Aprendizagem">Dificuldades de Aprendizagem</option>
                                   <option value="Doenças Crónicas">Doenças Crónicas</option>
                                   <option value="Deficiência Motora (Não Cadeirante)">Deficiência Motora (Não Cadeirante)</option>
                                   <option value="Deficiência Psicossocial">Deficiência Psicossocial</option>
                                   <option value="Multideficiência">Multideficiência</option>
                                   <option value="Outras">Outras</option>
                                 </select>
                               </td>
                               
                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent text-center" value={course.homens || ''} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciaisOutros!]; updated[idx].homens = parseInt(e.target.value)||0; updated[idx].total = (updated[idx].homens || 0) + (updated[idx].mulheres || 0); setFormData(prev => ({ ...prev, coursesNeedsEspeciaisOutros: updated })); }} /></td>
                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent text-center" value={course.mulheres || ''} onChange={(e) => { const updated = [...formData.coursesNeedsEspeciaisOutros!]; updated[idx].mulheres = parseInt(e.target.value)||0; updated[idx].total = (updated[idx].homens || 0) + (updated[idx].mulheres || 0); setFormData(prev => ({ ...prev, coursesNeedsEspeciaisOutros: updated })); }} /></td>
                               <td className="border-2 border-black p-1 bg-slate-100 text-center font-black">{(course.homens || 0) + (course.mulheres || 0)}</td>
                               
                               <td className="border-2 border-black text-center text-red-500 font-black cursor-pointer hover:bg-red-50" onClick={() => setFormData(prev => ({...prev, coursesNeedsEspeciaisOutros: prev.coursesNeedsEspeciaisOutros?.filter((_,i) => i !== idx)}))}>×</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-200 border-t-2 border-black font-bold">
                            <td className="border-r-2 border-black p-2 text-left" colSpan={8}>Total</td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.coursesNeedsEspeciaisOutros?.reduce((acc, c) => acc + (c.homens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.coursesNeedsEspeciaisOutros?.reduce((acc, c) => acc + (c.mulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center bg-slate-100">
                              {formData.coursesNeedsEspeciaisOutros?.reduce((acc, c) => acc + ((c.homens || 0) + (c.mulheres || 0)), 0)}
                            </td>
                            <td className="p-1"></td>
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}
                
                
                {formSubTab === 'estudantes_provincia_conclusao' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-indigo-700" /> Quadro 1.8. Número de Novos Ingressos, Matriculados e Graduados por Sexo e Província de conclusão da 12ª classe e ou Equivalência
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newRow = { provincia: '', novosIngressos: { homens: 0, mulheres: 0, total: 0 }, matriculados: { homens: 0, mulheres: 0, total: 0 }, graduados: { homens: 0, mulheres: 0, total: 0 } };
                          setFormData({...formData, provinciaConclusao12Classe: [...(formData.provinciaConclusao12Classe || []), newRow as any]});
                        }}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        + Adicionar Linha
                      </button>
                    </div>
                    <div className="overflow-x-auto border-2 border-black rounded-xl">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap min-w-[1000px]">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th rowSpan={2} className="border-r-2 border-black p-2 font-bold bg-gray-300">Província</th>
                            <th colSpan={3} className="border-r-2 border-black p-1 text-center font-bold">Novos Ingressos</th>
                            <th colSpan={3} className="border-r-2 border-black p-1 text-center font-bold">Matriculados</th>
                            <th colSpan={3} className="border-r-2 border-black p-1 text-center font-bold">Graduados</th>
                            <th rowSpan={2} className="p-2 font-bold bg-gray-300 text-center">Ações</th>
                          </tr>
                          <tr className="bg-slate-200 border-b-2 border-black">
                              <th className="border-r-2 border-l-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                              <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                              <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                              <th className="border-r-2 border-l-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                              <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                              <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                              <th className="border-r-2 border-l-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                              <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                              <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.provinciaConclusao12Classe?.map((item, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                               <td className="border-r-2 border-black p-0 relative">
                                  <GeoSelect 
                                    type="provincia"
                                    value={item.provincia || ''}
                                    onChange={(val) => {
                                      const updated = [...formData.provinciaConclusao12Classe!];
                                      updated[idx].provincia = val;
                                      setFormData(prev => ({ ...prev, provinciaConclusao12Classe: updated }));
                                    }}
                                  />
                               </td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.novosIngressos.homens || ''} onChange={(e) => { const updated = [...formData.provinciaConclusao12Classe!]; updated[idx].novosIngressos.homens = parseInt(e.target.value)||0; updated[idx].novosIngressos.total = updated[idx].novosIngressos.homens + updated[idx].novosIngressos.mulheres; setFormData(prev => ({ ...prev, provinciaConclusao12Classe: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.novosIngressos.mulheres || ''} onChange={(e) => { const updated = [...formData.provinciaConclusao12Classe!]; updated[idx].novosIngressos.mulheres = parseInt(e.target.value)||0; updated[idx].novosIngressos.total = updated[idx].novosIngressos.homens + updated[idx].novosIngressos.mulheres; setFormData(prev => ({ ...prev, provinciaConclusao12Classe: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold bg-slate-100">{item.novosIngressos.total}</td>

                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.matriculados.homens || ''} onChange={(e) => { const updated = [...formData.provinciaConclusao12Classe!]; updated[idx].matriculados.homens = parseInt(e.target.value)||0; updated[idx].matriculados.total = updated[idx].matriculados.homens + updated[idx].matriculados.mulheres; setFormData(prev => ({ ...prev, provinciaConclusao12Classe: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.matriculados.mulheres || ''} onChange={(e) => { const updated = [...formData.provinciaConclusao12Classe!]; updated[idx].matriculados.mulheres = parseInt(e.target.value)||0; updated[idx].matriculados.total = updated[idx].matriculados.homens + updated[idx].matriculados.mulheres; setFormData(prev => ({ ...prev, provinciaConclusao12Classe: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold bg-slate-100">{item.matriculados.total}</td>
                               
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.graduados.homens || ''} onChange={(e) => { const updated = [...formData.provinciaConclusao12Classe!]; updated[idx].graduados.homens = parseInt(e.target.value)||0; updated[idx].graduados.total = updated[idx].graduados.homens + updated[idx].graduados.mulheres; setFormData(prev => ({ ...prev, provinciaConclusao12Classe: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.graduados.mulheres || ''} onChange={(e) => { const updated = [...formData.provinciaConclusao12Classe!]; updated[idx].graduados.mulheres = parseInt(e.target.value)||0; updated[idx].graduados.total = updated[idx].graduados.homens + updated[idx].graduados.mulheres; setFormData(prev => ({ ...prev, provinciaConclusao12Classe: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold bg-slate-100">{item.graduados.total}</td>
                               
                               <td className="p-1 text-center text-red-500 font-black cursor-pointer hover:bg-red-50" onClick={() => setFormData(prev => ({...prev, provinciaConclusao12Classe: prev.provinciaConclusao12Classe?.filter((_,i) => i !== idx)}))}>×</td>
                            </tr>
                          ))}
                          {/* Linha de Total */}
                          <tr className="bg-slate-200 border-t-2 border-black font-bold">
                            <td className="border-r-2 border-black p-2 text-left">Total</td>
                            <td className="border-r-2 border-l-2 border-black p-1 text-center">
                              {formData.provinciaConclusao12Classe?.reduce((acc, c) => acc + (c.novosIngressos.homens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.provinciaConclusao12Classe?.reduce((acc, c) => acc + (c.novosIngressos.mulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-sky-800 bg-slate-300">
                              {formData.provinciaConclusao12Classe?.reduce((acc, c) => acc + (c.novosIngressos.total || 0), 0)}
                            </td>
                            <td className="border-r-2 border-l-2 border-black p-1 text-center">
                              {formData.provinciaConclusao12Classe?.reduce((acc, c) => acc + (c.matriculados.homens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.provinciaConclusao12Classe?.reduce((acc, c) => acc + (c.matriculados.mulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-sky-800 bg-slate-300">
                              {formData.provinciaConclusao12Classe?.reduce((acc, c) => acc + (c.matriculados.total || 0), 0)}
                            </td>
                            <td className="border-r-2 border-l-2 border-black p-1 text-center">
                              {formData.provinciaConclusao12Classe?.reduce((acc, c) => acc + (c.graduados.homens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.provinciaConclusao12Classe?.reduce((acc, c) => acc + (c.graduados.mulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-sky-800 bg-slate-300">
                              {formData.provinciaConclusao12Classe?.reduce((acc, c) => acc + (c.graduados.total || 0), 0)}
                            </td>
                            <td className="p-1"></td>
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}
                
                {formSubTab === 'estudantes_provincia_naturalidade' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-indigo-700" /> 1.9: Número de Novos Ingressos, Matriculados e Graduados por Sexo e Província de Naturalidade
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newRow = { provincia: '', novosIngressos: { homens: 0, mulheres: 0, total: 0 }, matriculados: { homens: 0, mulheres: 0, total: 0 }, graduados: { homens: 0, mulheres: 0, total: 0 } };
                          setFormData({...formData, estudantesProvinciaNaturalidade: [...(formData.estudantesProvinciaNaturalidade || []), newRow as any]});
                        }}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        + Adicionar Linha
                      </button>
                    </div>
                    <div className="overflow-x-auto border-2 border-black rounded-xl">
                       <table className="w-full text-xs border-collapse min-w-[1000px]">
                        <thead>
                          <tr className="bg-slate-300">
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Província</th>
                            <th colSpan={3} className="border-2 border-black p-2 uppercase text-center">Novos Ingressos</th>
                            <th colSpan={3} className="border-2 border-black p-2 uppercase text-center">Matriculados</th>
                            <th colSpan={3} className="border-2 border-black p-2 uppercase text-center">Graduados</th>
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Ações</th>
                          </tr>
                          <tr className="bg-slate-300">
                              <th className="border-2 border-black p-1">H</th><th className="border-2 border-black p-1">M</th><th className="border-2 border-black p-1">T</th>
                              <th className="border-2 border-black p-1">H</th><th className="border-2 border-black p-1">M</th><th className="border-2 border-black p-1">T</th>
                              <th className="border-2 border-black p-1">H</th><th className="border-2 border-black p-1">M</th><th className="border-2 border-black p-1">T</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.estudantesProvinciaNaturalidade?.map((item, idx) => (
                            <tr key={idx}>
                               <td className="border-2 border-black p-0 relative">
                                  <GeoSelect 
                                    type="provincia"
                                    value={item.provincia}
                                    onChange={(val) => {
                                      const updated = [...formData.estudantesProvinciaNaturalidade!];
                                      updated[idx].provincia = val;
                                      setFormData(prev => ({ ...prev, estudantesProvinciaNaturalidade: updated }));
                                    }}
                                  />
                               </td>
                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent" value={item.novosIngressos.homens} onChange={(e) => { const updated = [...formData.estudantesProvinciaNaturalidade!]; updated[idx].novosIngressos.homens = parseInt(e.target.value)||0; updated[idx].novosIngressos.total = updated[idx].novosIngressos.homens + updated[idx].novosIngressos.mulheres; setFormData(prev => ({ ...prev, estudantesProvinciaNaturalidade: updated })); }} /></td>
                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent" value={item.novosIngressos.mulheres} onChange={(e) => { const updated = [...formData.estudantesProvinciaNaturalidade!]; updated[idx].novosIngressos.mulheres = parseInt(e.target.value)||0; updated[idx].novosIngressos.total = updated[idx].novosIngressos.homens + updated[idx].novosIngressos.mulheres; setFormData(prev => ({ ...prev, estudantesProvinciaNaturalidade: updated })); }} /></td>
                               <td className="border-2 border-black p-1 bg-slate-100 text-center font-black">{item.novosIngressos.total}</td>

                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent" value={item.matriculados.homens} onChange={(e) => { const updated = [...formData.estudantesProvinciaNaturalidade!]; updated[idx].matriculados.homens = parseInt(e.target.value)||0; updated[idx].matriculados.total = updated[idx].matriculados.homens + updated[idx].matriculados.mulheres; setFormData(prev => ({ ...prev, estudantesProvinciaNaturalidade: updated })); }} /></td>
                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent" value={item.matriculados.mulheres} onChange={(e) => { const updated = [...formData.estudantesProvinciaNaturalidade!]; updated[idx].matriculados.mulheres = parseInt(e.target.value)||0; updated[idx].matriculados.total = updated[idx].matriculados.homens + updated[idx].matriculados.mulheres; setFormData(prev => ({ ...prev, estudantesProvinciaNaturalidade: updated })); }} /></td>
                               <td className="border-2 border-black p-1 bg-slate-100 text-center font-black">{item.matriculados.total}</td>
                               
                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent" value={item.graduados.homens} onChange={(e) => { const updated = [...formData.estudantesProvinciaNaturalidade!]; updated[idx].graduados.homens = parseInt(e.target.value)||0; updated[idx].graduados.total = updated[idx].graduados.homens + updated[idx].graduados.mulheres; setFormData(prev => ({ ...prev, estudantesProvinciaNaturalidade: updated })); }} /></td>
                               <td className="border-2 border-black p-1"><input type="number" className="w-full bg-transparent" value={item.graduados.mulheres} onChange={(e) => { const updated = [...formData.estudantesProvinciaNaturalidade!]; updated[idx].graduados.mulheres = parseInt(e.target.value)||0; updated[idx].graduados.total = updated[idx].graduados.homens + updated[idx].graduados.mulheres; setFormData(prev => ({ ...prev, estudantesProvinciaNaturalidade: updated })); }} /></td>
                               <td className="border-2 border-black p-1 bg-slate-100 text-center font-black">{item.graduados.total}</td>
                               
                               <td className="border-2 border-black text-center text-red-500 font-black cursor-pointer" onClick={() => setFormData(prev => ({...prev, estudantesProvinciaNaturalidade: prev.estudantesProvinciaNaturalidade?.filter((_,i) => i !== idx)}))}>×</td>
                            </tr>
                          ))}
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}
                
                {formSubTab === 'estudantes_faixa_etaria' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-cyan-700" /> Quadro 1.10: Número de Novos Ingressos, Matriculados e Graduados por Sexo e Faixa Etária
                      </h3>
                      {(!formData.faixaEtaria || formData.faixaEtaria.length === 0) && (
                        <button 
                          type="button" 
                          onClick={() => {
                            const initialRows = [
                              "<=17 anos", "18 a 23 anos", "24 a 29 anos", "30 a 35 anos", "Superior a 35 anos"
                            ].map(f => ({
                              classeIdade: f,
                              novosIngressos: { homens: 0, mulheres: 0, total: 0 },
                              matriculados: { homens: 0, mulheres: 0, total: 0 },
                              graduados: { homens: 0, mulheres: 0, total: 0 }
                            }));
                            setFormData({...formData, faixaEtaria: initialRows});
                          }}
                          className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                        >
                          Inicializar Tabela
                        </button>
                      )}
                    </div>
                    <div className="overflow-x-auto border-2 border-black rounded-xl">
                       <table className="w-full text-xs border-collapse min-w-[1000px]">
                        <thead>
                          <tr className="bg-slate-300">
                            <th rowSpan={2} className="border-2 border-black p-2 uppercase">Classe de idade</th>
                            <th colSpan={3} className="border-2 border-black p-2 uppercase text-center">Novos Ingressos</th>
                            <th colSpan={3} className="border-2 border-black p-2 uppercase text-center">Matriculados</th>
                            <th colSpan={3} className="border-2 border-black p-2 uppercase text-center">Graduados</th>
                          </tr>
                          <tr className="bg-slate-300">
                              <th className="border-2 border-black p-1 text-center">Homens</th>
                              <th className="border-2 border-black p-1 text-center">Mulheres</th>
                              <th className="border-2 border-black p-1 text-center bg-slate-400 font-bold">Total</th>
                              <th className="border-2 border-black p-1 text-center">Homens</th>
                              <th className="border-2 border-black p-1 text-center">Mulheres</th>
                              <th className="border-2 border-black p-1 text-center bg-slate-400 font-bold">Total</th>
                              <th className="border-2 border-black p-1 text-center">Homens</th>
                              <th className="border-2 border-black p-1 text-center">Mulheres</th>
                              <th className="border-2 border-black p-1 text-center bg-slate-400 font-bold">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.faixaEtaria?.map((item, idx) => (
                            <tr key={idx}>
                               <td className="border-2 border-black p-2 font-bold bg-slate-50">{item.classeIdade}</td>
                               <td className="border-2 border-black p-1">
                                 <input 
                                   type="number" 
                                   disabled={isReadOnly}
                                   className="w-full bg-transparent p-1 text-center" 
                                   value={item.novosIngressos?.homens ?? 0} 
                                   onChange={(e) => { 
                                     const updated = [...(formData.faixaEtaria || [])]; 
                                     updated[idx].novosIngressos.homens = parseInt(e.target.value) || 0; 
                                     updated[idx].novosIngressos.total = updated[idx].novosIngressos.homens + updated[idx].novosIngressos.mulheres; 
                                     setFormData(prev => ({ ...prev, faixaEtaria: updated })); 
                                   }} 
                                 />
                               </td>
                               <td className="border-2 border-black p-1">
                                 <input 
                                   type="number" 
                                   disabled={isReadOnly}
                                   className="w-full bg-transparent p-1 text-center" 
                                   value={item.novosIngressos?.mulheres ?? 0} 
                                   onChange={(e) => { 
                                     const updated = [...(formData.faixaEtaria || [])]; 
                                     updated[idx].novosIngressos.mulheres = parseInt(e.target.value) || 0; 
                                     updated[idx].novosIngressos.total = updated[idx].novosIngressos.homens + updated[idx].novosIngressos.mulheres; 
                                     setFormData(prev => ({ ...prev, faixaEtaria: updated })); 
                                   }} 
                                 />
                               </td>
                               <td className="border-2 border-black p-1 bg-slate-100 text-center font-black">{item.novosIngressos?.total ?? 0}</td>

                               <td className="border-2 border-black p-1">
                                 <input 
                                   type="number" 
                                   disabled={isReadOnly}
                                   className="w-full bg-transparent p-1 text-center" 
                                   value={item.matriculados?.homens ?? 0} 
                                   onChange={(e) => { 
                                     const updated = [...(formData.faixaEtaria || [])]; 
                                     updated[idx].matriculados.homens = parseInt(e.target.value) || 0; 
                                     updated[idx].matriculados.total = updated[idx].matriculados.homens + updated[idx].matriculados.mulheres; 
                                     setFormData(prev => ({ ...prev, faixaEtaria: updated })); 
                                   }} 
                                 />
                               </td>
                               <td className="border-2 border-black p-1">
                                 <input 
                                   type="number" 
                                   disabled={isReadOnly}
                                   className="w-full bg-transparent p-1 text-center" 
                                   value={item.matriculados?.mulheres ?? 0} 
                                   onChange={(e) => { 
                                     const updated = [...(formData.faixaEtaria || [])]; 
                                     updated[idx].matriculados.mulheres = parseInt(e.target.value) || 0; 
                                     updated[idx].matriculados.total = updated[idx].matriculados.homens + updated[idx].matriculados.mulheres; 
                                     setFormData(prev => ({ ...prev, faixaEtaria: updated })); 
                                   }} 
                                 />
                               </td>
                               <td className="border-2 border-black p-1 bg-slate-100 text-center font-black">{item.matriculados?.total ?? 0}</td>
                               
                               <td className="border-2 border-black p-1">
                                 <input 
                                   type="number" 
                                   disabled={isReadOnly}
                                   className="w-full bg-transparent p-1 text-center" 
                                   value={item.graduados?.homens ?? 0} 
                                   onChange={(e) => { 
                                     const updated = [...(formData.faixaEtaria || [])]; 
                                     updated[idx].graduados.homens = parseInt(e.target.value) || 0; 
                                     updated[idx].graduados.total = updated[idx].graduados.homens + updated[idx].graduados.mulheres; 
                                     setFormData(prev => ({ ...prev, faixaEtaria: updated })); 
                                   }} 
                                 />
                               </td>
                               <td className="border-2 border-black p-1">
                                 <input 
                                   type="number" 
                                   disabled={isReadOnly}
                                   className="w-full bg-transparent p-1 text-center" 
                                   value={item.graduados?.mulheres ?? 0} 
                                   onChange={(e) => { 
                                     const updated = [...(formData.faixaEtaria || [])]; 
                                     updated[idx].graduados.mulheres = parseInt(e.target.value) || 0; 
                                     updated[idx].graduados.total = updated[idx].graduados.homens + updated[idx].graduados.mulheres; 
                                     setFormData(prev => ({ ...prev, faixaEtaria: updated })); 
                                   }} 
                                 />
                               </td>
                               <td className="border-2 border-black p-1 bg-slate-100 text-center font-black">{item.graduados?.total ?? 0}</td>
                            </tr>
                          ))}

                          {formData.faixaEtaria && formData.faixaEtaria.length > 0 && (
                            <tr className="bg-slate-200 font-bold border-t-2 border-black">
                              <td className="border-2 border-black p-2 font-black bg-slate-300">Total</td>
                              <td className="border-2 border-black p-1 text-center font-black bg-slate-100">
                                {formData.faixaEtaria.reduce((sum, r) => sum + (r.novosIngressos?.homens || 0), 0)}
                              </td>
                              <td className="border-2 border-black p-1 text-center font-black bg-slate-100">
                                {formData.faixaEtaria.reduce((sum, r) => sum + (r.novosIngressos?.mulheres || 0), 0)}
                              </td>
                              <td className="border-2 border-black p-1 text-center font-black bg-slate-300">
                                {formData.faixaEtaria.reduce((sum, r) => sum + (r.novosIngressos?.total || 0), 0)}
                              </td>
                              <td className="border-2 border-black p-1 text-center font-black bg-slate-100">
                                {formData.faixaEtaria.reduce((sum, r) => sum + (r.matriculados?.homens || 0), 0)}
                              </td>
                              <td className="border-2 border-black p-1 text-center font-black bg-slate-100">
                                {formData.faixaEtaria.reduce((sum, r) => sum + (r.matriculados?.mulheres || 0), 0)}
                              </td>
                              <td className="border-2 border-black p-1 text-center font-black bg-slate-300">
                                {formData.faixaEtaria.reduce((sum, r) => sum + (r.matriculados?.total || 0), 0)}
                              </td>
                              <td className="border-2 border-black p-1 text-center font-black bg-slate-100">
                                {formData.faixaEtaria.reduce((sum, r) => sum + (r.graduados?.homens || 0), 0)}
                              </td>
                              <td className="border-2 border-black p-1 text-center font-black bg-slate-100">
                                {formData.faixaEtaria.reduce((sum, r) => sum + (r.graduados?.mulheres || 0), 0)}
                              </td>
                              <td className="border-2 border-black p-1 text-center font-black bg-slate-300">
                                {formData.faixaEtaria.reduce((sum, r) => sum + (r.graduados?.total || 0), 0)}
                              </td>
                            </tr>
                          )}
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}
                
                {formSubTab === 'graduados_primeira_matricula' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-emerald-700" /> 1.11: Número de Estudantes Graduados por Curso consoante o ano da Primeira Matricula
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newRow = { nomeCurso: '', iscedArea: '', iscedSubArea: '', regimeCurso: '', anoMobilidade: '', provincia: '', distrito: '', duracao: '', grau: '', antesDe2018: 0, ano2018: 0, ano2019: 0, ano2020: 0, ano2021: 0, ano2022: 0, ano2023: 0, ano2024: 0, ano2025: 0 };
                          setFormData({...formData, graduadosAnoPrimeiraMatricula: [...(formData.graduadosAnoPrimeiraMatricula || []), newRow]});
                        }}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        + Adicionar Linha
                      </button>
                    </div>
                    <div className="overflow-x-auto border-2 border-black rounded-xl">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap min-w-[1400px]">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Nome do curso</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold" colSpan={2}>{myInstitution?.abbreviation || 'IES'} {selectedYear - 1}</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Regime-Curso</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>***Ano de mobilidade</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Província</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Distrito</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>**Duração</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Grau</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold" colSpan={9}>Ano da primeira matrícula</th>
                            <th className="p-2 font-bold bg-gray-300 text-center" rowSpan={2}>Total</th>
                            <th className="border-l-2 border-black p-2 font-bold bg-gray-300 text-center" rowSpan={2}>Ações</th>
                          </tr>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Áreas</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Sub-áreas</th>
                            <th className="border-r-2 border-l-2 border-t-2 border-black p-1 text-center font-bold">Antes de</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">2018</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">2019</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">2020</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">2021</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">2022</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">2023</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">2024</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">2025</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.graduadosAnoPrimeiraMatricula?.map((item, idx) => {
                            const rowTotal = (item.antesDe2018 || 0) + (item.ano2018 || 0) + (item.ano2019 || 0) + (item.ano2020 || 0) + (item.ano2021 || 0) + (item.ano2022 || 0) + (item.ano2023 || 0) + (item.ano2024 || 0) + (item.ano2025 || 0);
                            return (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                               <td className="border-r-2 border-black p-0 relative">
                                  <CourseSelect 
    value={item.nomeCurso} 
    courses={instCourses} 
    onChange={(val) => {
      const updated = [...formData.graduadosAnoPrimeiraMatricula!];
      updated[idx].nomeCurso = val;
      const detetado = detectCourseArea(val);
      if (detetado.area) {
        updated[idx].iscedArea = detetado.area;
        updated[idx].iscedSubArea = detetado.subarea;
      }
      setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated }));
    }} 
  />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <input type="text" className="w-full h-full min-h-[30px] bg-transparent p-1 focus:outline-none focus:bg-sky-50 transition-colors" value={item.iscedArea || ''} onChange={(e) => { const updated = [...formData.graduadosAnoPrimeiraMatricula!]; updated[idx].iscedArea = e.target.value; setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated })); }} />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <input type="text" className="w-full h-full min-h-[30px] bg-transparent p-1 focus:outline-none focus:bg-sky-50 transition-colors" value={item.iscedSubArea || ''} onChange={(e) => { const updated = [...formData.graduadosAnoPrimeiraMatricula!]; updated[idx].iscedSubArea = e.target.value; setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated })); }} />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={item.regimeCurso} onChange={(e) => { const updated = [...formData.graduadosAnoPrimeiraMatricula!]; updated[idx].regimeCurso = e.target.value; setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated })); }}>
  <option value="">Selecione</option>
  <option value="Laboral">Laboral</option>
  <option value="Pós Labora">Pós Labora</option>
  <option value="EAD">EAD</option>
</select>
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <input type="text" className="w-full h-full min-h-[30px] bg-transparent p-1 focus:outline-none focus:bg-sky-50 transition-colors" value={item.anoMobilidade || ''} onChange={(e) => { const updated = [...formData.graduadosAnoPrimeiraMatricula!]; updated[idx].anoMobilidade = e.target.value; setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated })); }} />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <GeoSelect 
                                    type="provincia"
                                    value={item.provincia || ''}
                                    onChange={(val) => {
                                      const updated = [...formData.graduadosAnoPrimeiraMatricula!];
                                      updated[idx].provincia = val;
                                      updated[idx].distrito = '';
                                      setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated }));
                                    }}
                                  />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <GeoSelect 
                                    type="distrito"
                                    value={item.distrito || ''}
                                    provincia={item.provincia}
                                    onChange={(val) => {
                                      const updated = [...formData.graduadosAnoPrimeiraMatricula!];
                                      updated[idx].distrito = val;
                                      setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated }));
                                    }}
                                  />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-center text-xs" value={item.duracao} onChange={(e) => { const updated = [...formData.graduadosAnoPrimeiraMatricula!]; updated[idx].duracao = e.target.value; setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated })); }}>
  <option value="">Selecione</option>
  <option value="4 Anos">4 Anos</option>
  <option value="5 Anos">5 Anos</option>
</select>
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={item.grau} onChange={(e) => { const updated = [...formData.graduadosAnoPrimeiraMatricula!]; updated[idx].grau = e.target.value; setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated })); }}>
  <option value="">Selecione</option>
  <option value="Licenciatura">Licenciatura</option>
  <option value="Mestrado">Mestrado</option>
  <option value="Doutoramento">Doutoramento</option>
</select>
                               </td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.antesDe2018 || ''} onChange={(e) => { const updated = [...formData.graduadosAnoPrimeiraMatricula!]; updated[idx].antesDe2018 = parseInt(e.target.value)||0; setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.ano2018 || ''} onChange={(e) => { const updated = [...formData.graduadosAnoPrimeiraMatricula!]; updated[idx].ano2018 = parseInt(e.target.value)||0; setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.ano2019 || ''} onChange={(e) => { const updated = [...formData.graduadosAnoPrimeiraMatricula!]; updated[idx].ano2019 = parseInt(e.target.value)||0; setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.ano2020 || ''} onChange={(e) => { const updated = [...formData.graduadosAnoPrimeiraMatricula!]; updated[idx].ano2020 = parseInt(e.target.value)||0; setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.ano2021 || ''} onChange={(e) => { const updated = [...formData.graduadosAnoPrimeiraMatricula!]; updated[idx].ano2021 = parseInt(e.target.value)||0; setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.ano2022 || ''} onChange={(e) => { const updated = [...formData.graduadosAnoPrimeiraMatricula!]; updated[idx].ano2022 = parseInt(e.target.value)||0; setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.ano2023 || ''} onChange={(e) => { const updated = [...formData.graduadosAnoPrimeiraMatricula!]; updated[idx].ano2023 = parseInt(e.target.value)||0; setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.ano2024 || ''} onChange={(e) => { const updated = [...formData.graduadosAnoPrimeiraMatricula!]; updated[idx].ano2024 = parseInt(e.target.value)||0; setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.ano2025 || ''} onChange={(e) => { const updated = [...formData.graduadosAnoPrimeiraMatricula!]; updated[idx].ano2025 = parseInt(e.target.value)||0; setFormData(prev => ({ ...prev, graduadosAnoPrimeiraMatricula: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold text-sky-800 bg-slate-100">{rowTotal}</td>
                               <td className="border-l-2 border-black p-1 text-center text-red-500 font-black cursor-pointer hover:bg-red-50" onClick={() => setFormData(prev => ({...prev, graduadosAnoPrimeiraMatricula: prev.graduadosAnoPrimeiraMatricula?.filter((_,i) => i !== idx)}))}>×</td>
                            </tr>
                            );
                          })}
                          <tr className="bg-slate-200 border-t-2 border-black font-bold">
                            <td className="border-r-2 border-black p-2 text-left" colSpan={9}>Total</td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.graduadosAnoPrimeiraMatricula?.reduce((acc, c) => acc + (c.antesDe2018 || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.graduadosAnoPrimeiraMatricula?.reduce((acc, c) => acc + (c.ano2018 || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.graduadosAnoPrimeiraMatricula?.reduce((acc, c) => acc + (c.ano2019 || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.graduadosAnoPrimeiraMatricula?.reduce((acc, c) => acc + (c.ano2020 || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.graduadosAnoPrimeiraMatricula?.reduce((acc, c) => acc + (c.ano2021 || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.graduadosAnoPrimeiraMatricula?.reduce((acc, c) => acc + (c.ano2022 || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.graduadosAnoPrimeiraMatricula?.reduce((acc, c) => acc + (c.ano2023 || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.graduadosAnoPrimeiraMatricula?.reduce((acc, c) => acc + (c.ano2024 || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.graduadosAnoPrimeiraMatricula?.reduce((acc, c) => acc + (c.ano2025 || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-sky-800 bg-slate-300">
                              {formData.graduadosAnoPrimeiraMatricula?.reduce((acc, c) => acc + (c.antesDe2018 || 0) + (c.ano2018 || 0) + (c.ano2019 || 0) + (c.ano2020 || 0) + (c.ano2021 || 0) + (c.ano2022 || 0) + (c.ano2023 || 0) + (c.ano2024 || 0) + (c.ano2025 || 0), 0)}
                            </td>
                            <td className="border-l-2 border-black p-1"></td>
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}
                
                {formSubTab === 'curta_duracao_matriculados' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro 1.12: Cursos de curta duração e ou Especialização por Grau e Sexo - Matriculados
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newRow = { nomeCurso: '', iscedArea: '', iscedSubArea: '', regimeCurso: '', provincia: '', distrito: '', duracaoMeses: '', grau: '', homens: 0, mulheres: 0, total: 0 };
                          setFormData({...formData, coursesCurtaDuracaoEspecializacao: [...(formData.coursesCurtaDuracaoEspecializacao || []), newRow as any]});
                        }}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        + Adicionar Linha
                      </button>
                    </div>
                    <div className="overflow-x-auto border-2 border-black rounded-xl">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap min-w-full min-w-[1200px]">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Nome do curso</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold" colSpan={2}>{myInstitution?.abbreviation || 'IES'} {selectedYear - 1}</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Regime-Curso</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Província</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Distrito</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>**Duração (meses)</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Grau</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold" colSpan={3}>Matriculados</th>
                            <th className="p-2 font-bold bg-gray-300 text-center" rowSpan={2}>Ações</th>
                          </tr>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Áreas</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Sub-áreas</th>
                            <th className="border-r-2 border-l-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.coursesCurtaDuracaoEspecializacao?.map((item, idx) => {
                            return (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                               <td className="border-r-2 border-black p-0 relative">
                                  <CourseSelect 
    value={item.nomeCurso} 
    courses={instShortCourses} 
    onChange={(val) => {
      const updated = [...formData.coursesCurtaDuracaoEspecializacao!];
      updated[idx].nomeCurso = val;
      const detetado = detectCourseArea(val);
      if (detetado.area) {
        updated[idx].iscedArea = detetado.area;
        updated[idx].iscedSubArea = detetado.subarea;
      }
      setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacao: updated }));
    }} 
  />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <input type="text" className="w-full h-full min-h-[30px] bg-transparent p-1 focus:outline-none focus:bg-sky-50 transition-colors" value={item.iscedArea || ''} onChange={(e) => { const updated = [...formData.coursesCurtaDuracaoEspecializacao!]; updated[idx].iscedArea = e.target.value; setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacao: updated })); }} />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <input type="text" className="w-full h-full min-h-[30px] bg-transparent p-1 focus:outline-none focus:bg-sky-50 transition-colors" value={item.iscedSubArea || ''} onChange={(e) => { const updated = [...formData.coursesCurtaDuracaoEspecializacao!]; updated[idx].iscedSubArea = e.target.value; setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacao: updated })); }} />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={item.regimeCurso} onChange={(e) => { const updated = [...formData.coursesCurtaDuracaoEspecializacao!]; updated[idx].regimeCurso = e.target.value; setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacao: updated })); }}>
  <option value="">Selecione</option>
  <option value="Laboral">Laboral</option>
  <option value="Pós Labora">Pós Labora</option>
  <option value="EAD">EAD</option>
</select>
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <GeoSelect 
                                    type="provincia"
                                    value={item.provincia || ''}
                                    onChange={(val) => {
                                      const updated = [...formData.coursesCurtaDuracaoEspecializacao!];
                                      updated[idx].provincia = val;
                                      updated[idx].distrito = '';
                                      setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacao: updated }));
                                    }}
                                  />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <GeoSelect 
                                    type="distrito"
                                    value={item.distrito || ''}
                                    provincia={item.provincia}
                                    onChange={(val) => {
                                      const updated = [...formData.coursesCurtaDuracaoEspecializacao!];
                                      updated[idx].distrito = val;
                                      setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacao: updated }));
                                    }}
                                  />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-center text-xs" value={item.duracaoMeses} onChange={(e) => {
                                    const val = e.target.value;
                                    const updated = [...formData.coursesCurtaDuracaoEspecializacao!];
                                    updated[idx].duracaoMeses = val;
                                    if (val.includes("Mês") || val.includes("Meses")) {
                                      updated[idx].grau = "Profissionalizante";
                                    } else if (val === "1 Ano") {
                                      updated[idx].grau = "Básico";
                                    } else if (val === "2 Anos") {
                                      updated[idx].grau = "Médio";
                                    } else if (val === "3 Anos") {
                                      updated[idx].grau = "Técnico Médio";
                                    }
                                    setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacao: updated }));
                                  }}>
                                    <option value="">Selecione</option>
                                    <option value="1 Mês">1 Mês</option>
                                    <option value="2 Meses">2 Meses</option>
                                    <option value="3 Meses">3 Meses</option>
                                    <option value="4 Meses">4 Meses</option>
                                    <option value="5 Meses">5 Meses</option>
                                    <option value="6 Meses">6 Meses</option>
                                    <option value="7 Meses">7 Meses</option>
                                    <option value="8 Meses">8 Meses</option>
                                    <option value="9 Meses">9 Meses</option>
                                    <option value="10 Meses">10 Meses</option>
                                    <option value="11 Meses">11 Meses</option>
                                    <option value="12 Meses">12 Meses</option>
                                    <option value="1 Ano">1 Ano</option>
                                    <option value="2 Anos">2 Anos</option>
                                    <option value="3 Anos">3 Anos</option>
                                  </select>
                                </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={item.grau} onChange={(e) => { const updated = [...formData.coursesCurtaDuracaoEspecializacao!]; updated[idx].grau = e.target.value; setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacao: updated })); }}>
                                    <option value="">Selecione</option>
                                    {(!item.duracaoMeses || item.duracaoMeses.includes("Mês") || item.duracaoMeses.includes("Meses")) && (
                                      <option value="Profissionalizante">Profissionalizante</option>
                                    )}
                                    {(!item.duracaoMeses || item.duracaoMeses === "1 Ano") && (
                                      <option value="Básico">Básico</option>
                                    )}
                                    {(!item.duracaoMeses || item.duracaoMeses === "2 Anos") && (
                                      <option value="Médio">Médio</option>
                                    )}
                                    {(!item.duracaoMeses || item.duracaoMeses === "3 Anos") && (
                                      <option value="Técnico Médio">Técnico Médio</option>
                                    )}
                                  </select>
                               </td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.homens || ''} onChange={(e) => { const updated = [...formData.coursesCurtaDuracaoEspecializacao!]; updated[idx].homens = parseInt(e.target.value)||0; updated[idx].total = (updated[idx].homens || 0) + (updated[idx].mulheres || 0); setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacao: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.mulheres || ''} onChange={(e) => { const updated = [...formData.coursesCurtaDuracaoEspecializacao!]; updated[idx].mulheres = parseInt(e.target.value)||0; updated[idx].total = (updated[idx].homens || 0) + (updated[idx].mulheres || 0); setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacao: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold text-sky-800 bg-slate-100">{item.total || 0}</td>
                               <td className="p-1 text-center text-red-500 font-black cursor-pointer hover:bg-red-50" onClick={() => setFormData(prev => ({...prev, coursesCurtaDuracaoEspecializacao: prev.coursesCurtaDuracaoEspecializacao?.filter((_,i) => i !== idx)}))}>×</td>
                            </tr>
                            );
                          })}
                          <tr className="bg-slate-200 border-t-2 border-black font-bold">
                            <td className="border-r-2 border-black p-2 text-left" colSpan={8}>Total</td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.coursesCurtaDuracaoEspecializacao?.reduce((acc, c) => acc + (c.homens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.coursesCurtaDuracaoEspecializacao?.reduce((acc, c) => acc + (c.mulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-sky-800 bg-slate-300">
                              {formData.coursesCurtaDuracaoEspecializacao?.reduce((acc, c) => acc + (c.total || 0), 0)}
                            </td>
                            <td className="p-1"></td>
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}
                
                {formSubTab === 'cursos_curta_duracao_graduados' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro 1.13: Número de Estudantes Desistentes, Óbito ou que Anularam Matrícula Por Curso e Sexo
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newRow = { nomeCurso: '', iscedArea: '', iscedSubArea: '', regimeCurso: '', grau: '', causas: '', provincia: '', distrito: '', homens: 0, mulheres: 0, total: 0 };
                          setFormData({...formData, coursesCurtaDuracaoEspecializacaoGraduados: [...(formData.coursesCurtaDuracaoEspecializacaoGraduados || []), newRow as any]});
                        }}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        + Adicionar Linha
                      </button>
                    </div>
                    <div className="overflow-x-auto border-2 border-black rounded-xl">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap min-w-[1240px]">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Nome do curso</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold" colSpan={2}>{myInstitution?.abbreviation || 'IES'} {selectedYear - 1}</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Regime-Curso</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Grau</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Causas</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold" colSpan={3}>Sexo</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Província</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Distrito</th>
                            <th className="p-2 font-bold bg-gray-300 text-center" rowSpan={2}>Ações</th>
                          </tr>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Áreas</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Sub-áreas</th>
                            <th className="border-r-2 border-l-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.coursesCurtaDuracaoEspecializacaoGraduados?.map((item, idx) => {
                            return (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                               <td className="border-r-2 border-black p-0 relative min-w-[200px]">
                                  <CourseSelect 
                                    value={item.nomeCurso || ''} 
                                    courses={instCourses} 
                                    onChange={(val) => {
      const updated = [...formData.coursesCurtaDuracaoEspecializacaoGraduados!];
      updated[idx].nomeCurso = val;
      const detetado = detectCourseArea(val);
      if (detetado.area) {
        updated[idx].iscedArea = detetado.area;
        updated[idx].iscedSubArea = detetado.subarea;
      }
      setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacaoGraduados: updated }));
    }} 
  />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <input type="text" className="w-full h-full min-h-[30px] bg-transparent p-1 focus:outline-none focus:bg-sky-50 transition-colors" value={item.iscedArea || ''} onChange={(e) => { const updated = [...formData.coursesCurtaDuracaoEspecializacaoGraduados!]; updated[idx].iscedArea = e.target.value; setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacaoGraduados: updated })); }} />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <input type="text" className="w-full h-full min-h-[30px] bg-transparent p-1 focus:outline-none focus:bg-sky-50 transition-colors" value={item.iscedSubArea || ''} onChange={(e) => { const updated = [...formData.coursesCurtaDuracaoEspecializacaoGraduados!]; updated[idx].iscedSubArea = e.target.value; setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacaoGraduados: updated })); }} />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={item.regimeCurso || ''} onChange={(e) => { const updated = [...formData.coursesCurtaDuracaoEspecializacaoGraduados!]; updated[idx].regimeCurso = e.target.value; setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacaoGraduados: updated })); }}>
                                    <option value="">Selecione</option>
                                    <option value="Laboral">Laboral</option>
                                    <option value="Pós Labora">Pós Labora</option>
                                    <option value="EAD">EAD</option>
                                  </select>
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={item.grau || ''} onChange={(e) => { const updated = [...formData.coursesCurtaDuracaoEspecializacaoGraduados!]; updated[idx].grau = e.target.value; setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacaoGraduados: updated })); }}>
                                    <option value="">Selecione</option>
                                    <option value="Licenciatura">Licenciatura</option>
                                    <option value="Mestrado">Mestrado</option>
                                    <option value="Doutoramento">Doutoramento</option>
                                  </select>
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={item.causas || ''} onChange={(e) => { const updated = [...formData.coursesCurtaDuracaoEspecializacaoGraduados!]; updated[idx].causas = e.target.value; setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacaoGraduados: updated })); }}>
                                    <option value="">Selecione</option>
                                    <option value="Desistência">Desistência</option>
                                    <option value="Morte">Morte</option>
                                    <option value="Doença Prolongada">Doença Prolongada</option>
                                    <option value="Óbito">Óbito</option>
                                    <option value="Anulação de Matrícula">Anulação de Matrícula</option>
                                    <option value="Falta de fundo financeiro">Falta de fundo financeiro</option>
                                  </select>
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-amber-600 focus:outline-none focus:bg-amber-50" value={item.homens || ''} onChange={(e) => { const updated = [...formData.coursesCurtaDuracaoEspecializacaoGraduados!]; updated[idx].homens = parseInt(e.target.value)||0; updated[idx].total = (updated[idx].homens || 0) + (updated[idx].mulheres || 0); setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacaoGraduados: updated })); }} />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-amber-600 focus:outline-none focus:bg-amber-50" value={item.mulheres || ''} onChange={(e) => { const updated = [...formData.coursesCurtaDuracaoEspecializacaoGraduados!]; updated[idx].mulheres = parseInt(e.target.value)||0; updated[idx].total = (updated[idx].homens || 0) + (updated[idx].mulheres || 0); setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacaoGraduados: updated })); }} />
                               </td>
                               <td className="border-r-2 border-black p-1 text-center font-bold text-amber-800 bg-amber-100">
                                  {(item.homens || 0) + (item.mulheres || 0)}
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 focus:outline-none focus:bg-sky-50 transition-colors text-xs" value={item.provincia || ''} onChange={(e) => { const updated = [...formData.coursesCurtaDuracaoEspecializacaoGraduados!]; updated[idx].provincia = e.target.value; updated[idx].distrito = ''; setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacaoGraduados: updated })); }}>
                                    <option value="">Selecione</option>
                                    {PROVINCIAS_MOZ.map(p => <option key={p} value={p}>{p}</option>)}
                                  </select>
                                </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 focus:outline-none focus:bg-sky-50 transition-colors text-xs" value={item.distrito || ''} disabled={!item.provincia} onChange={(e) => { const updated = [...formData.coursesCurtaDuracaoEspecializacaoGraduados!]; updated[idx].distrito = e.target.value; setFormData(prev => ({ ...prev, coursesCurtaDuracaoEspecializacaoGraduados: updated })); }}>
                                    <option value="">Selecione</option>
                                    {item.provincia && DISTRITOS_POR_PROVINCIA[item.provincia]?.map(d => <option key={d} value={d}>{d}</option>)}
                                  </select>
                               </td>
                               <td className="p-1 text-center text-red-500 font-black cursor-pointer hover:bg-red-50" onClick={() => setFormData(prev => ({...prev, coursesCurtaDuracaoEspecializacaoGraduados: prev.coursesCurtaDuracaoEspecializacaoGraduados?.filter((_,i) => i !== idx)}))}>×</td>
                            </tr>
                            );
                          })}
                          <tr className="bg-slate-200 border-t-2 border-black font-bold">
                            <td className="border-r-2 border-black p-2 text-left" colSpan={6}>Total</td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.coursesCurtaDuracaoEspecializacaoGraduados?.reduce((acc, c) => acc + (c.homens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.coursesCurtaDuracaoEspecializacaoGraduados?.reduce((acc, c) => acc + (c.mulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-amber-800 bg-slate-300">
                              {formData.coursesCurtaDuracaoEspecializacaoGraduados?.reduce((acc, c) => acc + (c.total || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1"></td>
                            <td className="border-r-2 border-black p-1"></td>
                            <td className="p-1"></td>
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}
                
                {formSubTab === 'estudantes_bolseiros' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-violet-700" /> Quadro 1.14: Número de Estudantes Bolseiros por Curso, Sexo, tipo de Bolsa e Financiador
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newRow = { nomeCurso: '', iscedArea: '', iscedSubArea: '', regimeCurso: '', paisProveniencia: '', tipoBolsa: '', financiador: '', grau: '', novosIngressos: { homens: 0, mulheres: 0, total: 0 }, matriculados: { homens: 0, mulheres: 0, total: 0 }, graduados: { homens: 0, mulheres: 0, total: 0 }, nacionalidade: '', provincia: '' };
                          setFormData({...formData, estudantesBolseiros: [...(formData.estudantesBolseiros || []), newRow as any]});
                        }}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        + Adicionar Linha
                      </button>
                    </div>
                    <div className="overflow-x-auto border-2 border-black rounded-xl">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap min-w-[2000px]">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Nome do curso</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold" colSpan={2}>{myInstitution?.abbreviation || 'IES'} {selectedYear - 1}</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Regime-Curso</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>País de Proveniência</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>**Tipo de bolsa</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>***Financiador</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Grau</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-sky-200" colSpan={3}>Novos Ingressos</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-emerald-200" colSpan={3}>Matriculados</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-amber-200" colSpan={3}>Graduados</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Nacionalidade</th>
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>*Província</th>
                            <th className="p-2 font-bold bg-gray-300 text-center" rowSpan={2}>Ações</th>
                          </tr>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Áreas</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Sub-áreas</th>
                            <th className="border-r-2 border-l-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.estudantesBolseiros?.map((item, idx) => {
                            return (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                               <td className="border-r-2 border-black p-0 relative">
                                  <CourseSelect 
    value={item.nomeCurso} 
    courses={instCourses} 
    onChange={(val) => {
      const updated = [...formData.estudantesBolseiros!];
      updated[idx].nomeCurso = val;
      const detetado = detectCourseArea(val);
      if (detetado.area) {
        updated[idx].iscedArea = detetado.area;
        updated[idx].iscedSubArea = detetado.subarea;
      }
      setFormData(prev => ({ ...prev, estudantesBolseiros: updated }));
    }} 
  />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <input type="text" className="w-full h-full min-h-[30px] bg-transparent p-1 focus:outline-none focus:bg-sky-50 transition-colors" value={item.iscedArea || ''} onChange={(e) => { const updated = [...formData.estudantesBolseiros!]; updated[idx].iscedArea = e.target.value; setFormData(prev => ({ ...prev, estudantesBolseiros: updated })); }} />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <input type="text" className="w-full h-full min-h-[30px] bg-transparent p-1 focus:outline-none focus:bg-sky-50 transition-colors" value={item.iscedSubArea || ''} onChange={(e) => { const updated = [...formData.estudantesBolseiros!]; updated[idx].iscedSubArea = e.target.value; setFormData(prev => ({ ...prev, estudantesBolseiros: updated })); }} />
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={item.regimeCurso} onChange={(e) => { const updated = [...formData.estudantesBolseiros!]; updated[idx].regimeCurso = e.target.value; setFormData(prev => ({ ...prev, estudantesBolseiros: updated })); }}>
  <option value="">Selecione</option>
  <option value="Laboral">Laboral</option>
  <option value="Pós Labora">Pós Labora</option>
  <option value="EAD">EAD</option>
</select>
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={item.paisProveniencia || ''} onChange={(e) => { const updated = [...formData.estudantesBolseiros!]; updated[idx].paisProveniencia = e.target.value; setFormData(prev => ({ ...prev, estudantesBolseiros: updated })); }}>
                                    <option value="">Selecione</option>
                                    <option value="Moçambique">Moçambique</option>
                                    <option value="Estrangeiro">Estrangeiro</option>
                                  </select>
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={item.tipoBolsa || ''} onChange={(e) => { const updated = [...formData.estudantesBolseiros!]; updated[idx].tipoBolsa = e.target.value; setFormData(prev => ({ ...prev, estudantesBolseiros: updated })); }}>
                                    <option value="">Selecione</option>
                                    <option value="Completa">Completa</option>
                                    <option value="Parcial">Parcial</option>
                                    <option value="Reduzida">Reduzida</option>
                                  </select>
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={item.financiador || ''} onChange={(e) => { const updated = [...formData.estudantesBolseiros!]; updated[idx].financiador = e.target.value; setFormData(prev => ({ ...prev, estudantesBolseiros: updated })); }}>
                                    <option value="">Selecione</option>
                                    <option value="OGE">OGE</option>
                                    <option value="Receitas Proprias">Receitas Proprias</option>
                                    <option value="Empréstimo">Empréstimo</option>
                                    <option value="Doação">Doação</option>
                                  </select>
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs" value={item.grau} onChange={(e) => { const updated = [...formData.estudantesBolseiros!]; updated[idx].grau = e.target.value; setFormData(prev => ({ ...prev, estudantesBolseiros: updated })); }}>
  <option value="">Selecione</option>
  <option value="Licenciatura">Licenciatura</option>
  <option value="Mestrado">Mestrado</option>
  <option value="Doutoramento">Doutoramento</option>
</select>
                               </td>
                               
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.novosIngressos?.homens || ''} onChange={(e) => { const updated = [...formData.estudantesBolseiros!]; const nv = updated[idx].novosIngressos || {homens:0,mulheres:0,total:0}; nv.homens = parseInt(e.target.value)||0; nv.total = nv.homens + (nv.mulheres||0); updated[idx].novosIngressos=nv; setFormData(prev => ({ ...prev, estudantesBolseiros: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.novosIngressos?.mulheres || ''} onChange={(e) => { const updated = [...formData.estudantesBolseiros!]; const nv = updated[idx].novosIngressos || {homens:0,mulheres:0,total:0}; nv.mulheres = parseInt(e.target.value)||0; nv.total = (nv.homens||0) + nv.mulheres; updated[idx].novosIngressos=nv; setFormData(prev => ({ ...prev, estudantesBolseiros: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold text-sky-800 bg-slate-100">{item.novosIngressos?.total || 0}</td>

                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-emerald-600 focus:outline-none focus:bg-emerald-50" value={item.matriculados?.homens || ''} onChange={(e) => { const updated = [...formData.estudantesBolseiros!]; const nv = updated[idx].matriculados || {homens:0,mulheres:0,total:0}; nv.homens = parseInt(e.target.value)||0; nv.total = nv.homens + (nv.mulheres||0); updated[idx].matriculados=nv; setFormData(prev => ({ ...prev, estudantesBolseiros: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-emerald-600 focus:outline-none focus:bg-emerald-50" value={item.matriculados?.mulheres || ''} onChange={(e) => { const updated = [...formData.estudantesBolseiros!]; const nv = updated[idx].matriculados || {homens:0,mulheres:0,total:0}; nv.mulheres = parseInt(e.target.value)||0; nv.total = (nv.homens||0) + nv.mulheres; updated[idx].matriculados=nv; setFormData(prev => ({ ...prev, estudantesBolseiros: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold text-emerald-800 bg-emerald-100">{item.matriculados?.total || 0}</td>

                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-amber-600 focus:outline-none focus:bg-amber-50" value={item.graduados?.homens || ''} onChange={(e) => { const updated = [...formData.estudantesBolseiros!]; const nv = updated[idx].graduados || {homens:0,mulheres:0,total:0}; nv.homens = parseInt(e.target.value)||0; nv.total = nv.homens + (nv.mulheres||0); updated[idx].graduados=nv; setFormData(prev => ({ ...prev, estudantesBolseiros: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-amber-600 focus:outline-none focus:bg-amber-50" value={item.graduados?.mulheres || ''} onChange={(e) => { const updated = [...formData.estudantesBolseiros!]; const nv = updated[idx].graduados || {homens:0,mulheres:0,total:0}; nv.mulheres = parseInt(e.target.value)||0; nv.total = (nv.homens||0) + nv.mulheres; updated[idx].graduados=nv; setFormData(prev => ({ ...prev, estudantesBolseiros: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold text-amber-800 bg-amber-100">{item.graduados?.total || 0}</td>

                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-xs text-center" value={item.nacionalidade} onChange={(e) => { const updated = [...formData.estudantesBolseiros!]; updated[idx].nacionalidade = e.target.value; setFormData(prev => ({ ...prev, estudantesBolseiros: updated })); }}>
  <option value="">Selecione</option>
  <option value="Moçambicana">Moçambicana</option>
  <option value="Estrangeira">Estrangeira</option>
</select>
                               </td>
                               <td className="border-r-2 border-black p-0 relative">
                                  <select className="w-full h-full min-h-[30px] bg-transparent p-1 focus:outline-none focus:bg-slate-50 transition-colors" value={item.provincia || ''} onChange={(e) => { const updated = [...formData.estudantesBolseiros!]; updated[idx].provincia = e.target.value; setFormData(prev => ({ ...prev, estudantesBolseiros: updated })); }}>
                                    <option value="">Selecione</option>
                                    {PROVINCIAS_MOZ.map(p => <option key={p} value={p}>{p}</option>)}
                                  </select>
                               </td>

                               <td className="p-1 text-center text-red-500 font-black cursor-pointer hover:bg-red-50" onClick={() => setFormData(prev => ({...prev, estudantesBolseiros: prev.estudantesBolseiros?.filter((_,i) => i !== idx)}))}>×</td>
                            </tr>
                            );
                          })}
                          <tr className="bg-slate-200 border-t-2 border-black font-bold">
                            <td className="border-r-2 border-black p-2 text-left" colSpan={7}>Total</td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseiros?.reduce((acc, c) => acc + (c.novosIngressos?.homens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseiros?.reduce((acc, c) => acc + (c.novosIngressos?.mulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-sky-800 bg-slate-300">
                              {formData.estudantesBolseiros?.reduce((acc, c) => acc + (c.novosIngressos?.total || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseiros?.reduce((acc, c) => acc + (c.matriculados?.homens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseiros?.reduce((acc, c) => acc + (c.matriculados?.mulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-emerald-800 bg-slate-300">
                              {formData.estudantesBolseiros?.reduce((acc, c) => acc + (c.matriculados?.total || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseiros?.reduce((acc, c) => acc + (c.graduados?.homens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseiros?.reduce((acc, c) => acc + (c.graduados?.mulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-amber-800 bg-slate-300">
                              {formData.estudantesBolseiros?.reduce((acc, c) => acc + (c.graduados?.total || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1" colSpan={2}></td>
                            <td className="p-1"></td>
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}
                
                {formSubTab === 'bolseiros_faixa_etaria' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-rose-700" /> Quadro 1.15: Número de Estudantes Bolseiros, Novos Ingressos, Matriculados e Graduados por Sexo e Faixa Etária
                      </h3>
                      {(!formData.estudantesBolseirosFaixaEtaria || formData.estudantesBolseirosFaixaEtaria.length === 0) && (
                        <button 
                          type="button" 
                          onClick={() => {
                            const initialRows = [
                              "<=17 anos", "18 a 23 anos", "24 a 29 anos", "30 a 35 anos", "Superior a 35 anos"
                            ].map(f => ({
                              faixaEtaria: f,
                              novosIngressos: { homens: 0, mulheres: 0, total: 0 },
                              matriculados: { homens: 0, mulheres: 0, total: 0 },
                              graduados: { homens: 0, mulheres: 0, total: 0 }
                            }));
                            setFormData({...formData, estudantesBolseirosFaixaEtaria: initialRows});
                          }}
                          className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                        >
                          Inicializar Tabela
                        </button>
                      )}
                    </div>
                    
                    <div className="overflow-x-auto border-2 border-black rounded-xl">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap min-w-[800px]">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Idade</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-sky-200" colSpan={3}>Novos Ingressos</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-emerald-200" colSpan={3}>Matriculados</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-amber-200" colSpan={3}>Graduados</th>
                          </tr>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.estudantesBolseirosFaixaEtaria?.map((item, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                               <td className="border-r-2 border-black p-2 font-medium">{item.faixaEtaria}</td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.novosIngressos?.homens || ''} onChange={(e) => { const updated = [...formData.estudantesBolseirosFaixaEtaria!]; const nv = updated[idx].novosIngressos || {homens:0,mulheres:0,total:0}; nv.homens = parseInt(e.target.value)||0; nv.total = nv.homens + (nv.mulheres||0); updated[idx].novosIngressos=nv; setFormData(prev => ({ ...prev, estudantesBolseirosFaixaEtaria: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.novosIngressos?.mulheres || ''} onChange={(e) => { const updated = [...formData.estudantesBolseirosFaixaEtaria!]; const nv = updated[idx].novosIngressos || {homens:0,mulheres:0,total:0}; nv.mulheres = parseInt(e.target.value)||0; nv.total = (nv.homens||0) + nv.mulheres; updated[idx].novosIngressos=nv; setFormData(prev => ({ ...prev, estudantesBolseirosFaixaEtaria: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold text-sky-800 bg-sky-100">{item.novosIngressos?.total || 0}</td>

                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-emerald-600 focus:outline-none focus:bg-emerald-50" value={item.matriculados?.homens || ''} onChange={(e) => { const updated = [...formData.estudantesBolseirosFaixaEtaria!]; const nv = updated[idx].matriculados || {homens:0,mulheres:0,total:0}; nv.homens = parseInt(e.target.value)||0; nv.total = nv.homens + (nv.mulheres||0); updated[idx].matriculados=nv; setFormData(prev => ({ ...prev, estudantesBolseirosFaixaEtaria: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-emerald-600 focus:outline-none focus:bg-emerald-50" value={item.matriculados?.mulheres || ''} onChange={(e) => { const updated = [...formData.estudantesBolseirosFaixaEtaria!]; const nv = updated[idx].matriculados || {homens:0,mulheres:0,total:0}; nv.mulheres = parseInt(e.target.value)||0; nv.total = (nv.homens||0) + nv.mulheres; updated[idx].matriculados=nv; setFormData(prev => ({ ...prev, estudantesBolseirosFaixaEtaria: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold text-emerald-800 bg-emerald-100">{item.matriculados?.total || 0}</td>

                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-amber-600 focus:outline-none focus:bg-amber-50" value={item.graduados?.homens || ''} onChange={(e) => { const updated = [...formData.estudantesBolseirosFaixaEtaria!]; const nv = updated[idx].graduados || {homens:0,mulheres:0,total:0}; nv.homens = parseInt(e.target.value)||0; nv.total = nv.homens + (nv.mulheres||0); updated[idx].graduados=nv; setFormData(prev => ({ ...prev, estudantesBolseirosFaixaEtaria: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-amber-600 focus:outline-none focus:bg-amber-50" value={item.graduados?.mulheres || ''} onChange={(e) => { const updated = [...formData.estudantesBolseirosFaixaEtaria!]; const nv = updated[idx].graduados || {homens:0,mulheres:0,total:0}; nv.mulheres = parseInt(e.target.value)||0; nv.total = (nv.homens||0) + nv.mulheres; updated[idx].graduados=nv; setFormData(prev => ({ ...prev, estudantesBolseirosFaixaEtaria: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold text-amber-800 bg-amber-100">{item.graduados?.total || 0}</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-200 border-t-2 border-black font-bold">
                            <td className="border-r-2 border-black p-2 text-left">Total</td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseirosFaixaEtaria?.reduce((acc, c) => acc + (c.novosIngressos?.homens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseirosFaixaEtaria?.reduce((acc, c) => acc + (c.novosIngressos?.mulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-sky-800 bg-slate-300">
                              {formData.estudantesBolseirosFaixaEtaria?.reduce((acc, c) => acc + (c.novosIngressos?.total || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseirosFaixaEtaria?.reduce((acc, c) => acc + (c.matriculados?.homens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseirosFaixaEtaria?.reduce((acc, c) => acc + (c.matriculados?.mulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-emerald-800 bg-slate-300">
                              {formData.estudantesBolseirosFaixaEtaria?.reduce((acc, c) => acc + (c.matriculados?.total || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseirosFaixaEtaria?.reduce((acc, c) => acc + (c.graduados?.homens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseirosFaixaEtaria?.reduce((acc, c) => acc + (c.graduados?.mulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-amber-800 bg-slate-300">
                              {formData.estudantesBolseirosFaixaEtaria?.reduce((acc, c) => acc + (c.graduados?.total || 0), 0)}
                            </td>
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}
                
                {formSubTab === 'bolseiros_provincia_naturalidade' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-emerald-700" /> Quadro 1.16: Número de Estudantes Bolseiros, Novos Ingressos, Matriculados e Graduados por Sexo e Província de Naturalidade
                      </h3>
                      {(!formData.estudantesBolseirosProvinciaNaturalidade || formData.estudantesBolseirosProvinciaNaturalidade.length === 0) && (
                        <button 
                          type="button" 
                          onClick={() => {
                            const initialRows = PROVINCIAS_MOZ.map(p => ({
                              provinciaNaturalidade: p,
                              novosIngressos: { homens: 0, mulheres: 0, total: 0 },
                              matriculados: { homens: 0, mulheres: 0, total: 0 },
                              graduados: { homens: 0, mulheres: 0, total: 0 }
                            }));
                            setFormData({...formData, estudantesBolseirosProvinciaNaturalidade: initialRows});
                          }}
                          className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                        >
                          Inicializar Tabela
                        </button>
                      )}
                    </div>
                    
                    <div className="overflow-x-auto border-2 border-black rounded-xl">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap min-w-[800px]">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 font-bold bg-gray-300" rowSpan={2}>Província de Naturalidade</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-sky-200" colSpan={3}>Novos Ingressos</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-emerald-200" colSpan={3}>Matriculados</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-amber-200" colSpan={3}>Graduados</th>
                          </tr>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Homens</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-t-2 border-black p-1 text-center font-bold bg-slate-300">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.estudantesBolseirosProvinciaNaturalidade?.map((item, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                               <td className="border-r-2 border-black p-2 font-medium">{item.provinciaNaturalidade}</td>
                               
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.novosIngressos?.homens || ''} onChange={(e) => { const updated = [...formData.estudantesBolseirosProvinciaNaturalidade!]; const nv = updated[idx].novosIngressos || {homens:0,mulheres:0,total:0}; nv.homens = parseInt(e.target.value)||0; nv.total = nv.homens + (nv.mulheres||0); updated[idx].novosIngressos=nv; setFormData(prev => ({ ...prev, estudantesBolseirosProvinciaNaturalidade: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-sky-600 focus:outline-none focus:bg-sky-50" value={item.novosIngressos?.mulheres || ''} onChange={(e) => { const updated = [...formData.estudantesBolseirosProvinciaNaturalidade!]; const nv = updated[idx].novosIngressos || {homens:0,mulheres:0,total:0}; nv.mulheres = parseInt(e.target.value)||0; nv.total = (nv.homens||0) + nv.mulheres; updated[idx].novosIngressos=nv; setFormData(prev => ({ ...prev, estudantesBolseirosProvinciaNaturalidade: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold text-sky-800 bg-sky-100">{item.novosIngressos?.total || 0}</td>

                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-emerald-600 focus:outline-none focus:bg-emerald-50" value={item.matriculados?.homens || ''} onChange={(e) => { const updated = [...formData.estudantesBolseirosProvinciaNaturalidade!]; const nv = updated[idx].matriculados || {homens:0,mulheres:0,total:0}; nv.homens = parseInt(e.target.value)||0; nv.total = nv.homens + (nv.mulheres||0); updated[idx].matriculados=nv; setFormData(prev => ({ ...prev, estudantesBolseirosProvinciaNaturalidade: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-emerald-600 focus:outline-none focus:bg-emerald-50" value={item.matriculados?.mulheres || ''} onChange={(e) => { const updated = [...formData.estudantesBolseirosProvinciaNaturalidade!]; const nv = updated[idx].matriculados || {homens:0,mulheres:0,total:0}; nv.mulheres = parseInt(e.target.value)||0; nv.total = (nv.homens||0) + nv.mulheres; updated[idx].matriculados=nv; setFormData(prev => ({ ...prev, estudantesBolseirosProvinciaNaturalidade: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold text-emerald-800 bg-emerald-100">{item.matriculados?.total || 0}</td>

                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-amber-600 focus:outline-none focus:bg-amber-50" value={item.graduados?.homens || ''} onChange={(e) => { const updated = [...formData.estudantesBolseirosProvinciaNaturalidade!]; const nv = updated[idx].graduados || {homens:0,mulheres:0,total:0}; nv.homens = parseInt(e.target.value)||0; nv.total = nv.homens + (nv.mulheres||0); updated[idx].graduados=nv; setFormData(prev => ({ ...prev, estudantesBolseirosProvinciaNaturalidade: updated })); }} /></td>
                               <td className="border-r-2 border-black p-0 relative"><input type="number" className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-bold text-amber-600 focus:outline-none focus:bg-amber-50" value={item.graduados?.mulheres || ''} onChange={(e) => { const updated = [...formData.estudantesBolseirosProvinciaNaturalidade!]; const nv = updated[idx].graduados || {homens:0,mulheres:0,total:0}; nv.mulheres = parseInt(e.target.value)||0; nv.total = (nv.homens||0) + nv.mulheres; updated[idx].graduados=nv; setFormData(prev => ({ ...prev, estudantesBolseirosProvinciaNaturalidade: updated })); }} /></td>
                               <td className="border-r-2 border-black p-1 text-center font-bold text-amber-800 bg-amber-100">{item.graduados?.total || 0}</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-200 border-t-2 border-black font-bold">
                            <td className="border-r-2 border-black p-2 text-left">Total</td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseirosProvinciaNaturalidade?.reduce((acc, c) => acc + (c.novosIngressos?.homens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseirosProvinciaNaturalidade?.reduce((acc, c) => acc + (c.novosIngressos?.mulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-sky-800 bg-slate-300">
                              {formData.estudantesBolseirosProvinciaNaturalidade?.reduce((acc, c) => acc + (c.novosIngressos?.total || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseirosProvinciaNaturalidade?.reduce((acc, c) => acc + (c.matriculados?.homens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseirosProvinciaNaturalidade?.reduce((acc, c) => acc + (c.matriculados?.mulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-emerald-800 bg-slate-300">
                              {formData.estudantesBolseirosProvinciaNaturalidade?.reduce((acc, c) => acc + (c.matriculados?.total || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseirosProvinciaNaturalidade?.reduce((acc, c) => acc + (c.graduados?.homens || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center">
                              {formData.estudantesBolseirosProvinciaNaturalidade?.reduce((acc, c) => acc + (c.graduados?.mulheres || 0), 0)}
                            </td>
                            <td className="border-r-2 border-black p-1 text-center text-amber-800 bg-slate-300">
                              {formData.estudantesBolseirosProvinciaNaturalidade?.reduce((acc, c) => acc + (c.graduados?.total || 0), 0)}
                            </td>
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}
                
                {formSubTab === 'eixo_2_q0' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight">
                        <Users className="h-4 w-4 text-sky-700" /> Quadro A1: Numero de Docentes por Província, Regime de Contratação, Grau e Sexo (Tempo Inteiro)
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newRow = { 
                            provincia: '', distrito: '', nacionalidadePais: '', regime: '',
                            licenciado: { homens: 0, mulheres: 0, total: 0 },
                            mestre: { homens: 0, mulheres: 0, total: 0 },
                            posGraduacao: { homens: 0, mulheres: 0, total: 0 },
                            doutorado: { homens: 0, mulheres: 0, total: 0 },
                            todos: { homens: 0, mulheres: 0, total: 0 }
                          };
                          setFormData({...formData, docentesTempoInteiro: [...(formData.docentesTempoInteiro || []), newRow]});
                        }}
                        className="bg-slate-900 text-white text-xs font-black px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors uppercase"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap min-w-[1500px]">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-1 text-center font-bold" rowSpan={2}>Província</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold" rowSpan={2}>Distrito</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold" rowSpan={2}>Nacionalidade e (País)</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold" rowSpan={2}>Regime de Contratação</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-sky-50" colSpan={3}>Licenciado</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-emerald-50" colSpan={3}>Mestre</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-amber-50" colSpan={3}>Pós-Graduação</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-purple-50" colSpan={3}>Doutorado</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-slate-400 text-white" colSpan={3}>Todos</th>
                            <th className="p-1 text-center font-bold" rowSpan={2}>Remover</th>
                          </tr>
                          <tr className="bg-slate-100 border-b-2 border-black">
                            {['Licenciado', 'Mestre', 'Pós-Graduação', 'Doutorado', 'Todos'].map((cat) => (
                              <React.Fragment key={cat}>
                                <th className="border-r-2 border-black p-1 text-center font-bold">Homens</th>
                                <th className="border-r-2 border-black p-1 text-center font-bold">Mulheres</th>
                                <th className="border-r-2 border-black p-1 text-center font-bold bg-slate-200">Total</th>
                              </React.Fragment>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesTempoInteiro?.map((item, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-0 relative">
                                <GeoSelect 
                                  type="provincia"
                                  value={item.provincia || ''}
                                  onChange={(val) => {
                                    const updated = [...formData.docentesTempoInteiro!];
                                    updated[idx].provincia = val;
                                    updated[idx].distrito = ''; // Reset district
                                    setFormData(prev => ({ ...prev, docentesTempoInteiro: updated }));
                                  }}
                                />
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <GeoSelect 
                                  type="distrito"
                                  value={item.distrito || ''}
                                  provincia={item.provincia}
                                  onChange={(val) => {
                                    const updated = [...formData.docentesTempoInteiro!];
                                    updated[idx].distrito = val;
                                    setFormData(prev => ({ ...prev, docentesTempoInteiro: updated }));
                                  }}
                                />
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <GeoSelect 
                                  type="nacionalidade"
                                  value={item.nacionalidadePais || ''}
                                  onChange={(val) => {
                                    const updated = [...formData.docentesTempoInteiro!];
                                    updated[idx].nacionalidadePais = val;
                                    setFormData(prev => ({ ...prev, docentesTempoInteiro: updated }));
                                  }}
                                />
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <GeoSelect 
                                  type="regime"
                                  value={item.regime || ''}
                                  onChange={(val) => {
                                    const updated = [...formData.docentesTempoInteiro!];
                                    updated[idx].regime = val;
                                    setFormData(prev => ({ ...prev, docentesTempoInteiro: updated }));
                                  }}
                                />
                              </td>

                              {/* Helper function to handle sub-fields */}
                              {['licenciado', 'mestre', 'posGraduacao', 'doutorado', 'todos'].map((field) => (
                                <React.Fragment key={field}>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[28px] bg-transparent p-1 text-center font-bold text-slate-800 focus:outline-none focus:bg-sky-50" 
                                      value={(item as any)[field]?.homens || ''} 
                                      onChange={(e) => { 
                                        const updated = [...formData.docentesTempoInteiro!]; 
                                        const nv = (updated[idx] as any)[field] || {homens:0,mulheres:0,total:0}; 
                                        nv.homens = parseInt(e.target.value)||0; 
                                        nv.total = nv.homens + (nv.mulheres||0); 
                                        (updated[idx] as any)[field]=nv;

                                        // Update "todos" field automatically
                                        const sumFields = ['licenciado', 'mestre', 'posGraduacao', 'doutorado'];
                                        updated[idx].todos.homens = sumFields.reduce((sum, f) => sum + ((updated[idx] as any)[f]?.homens || 0), 0);
                                        updated[idx].todos.mulheres = sumFields.reduce((sum, f) => sum + ((updated[idx] as any)[f]?.mulheres || 0), 0);
                                        updated[idx].todos.total = updated[idx].todos.homens + updated[idx].todos.mulheres;

                                        setFormData(prev => ({ ...prev, docentesTempoInteiro: updated })); 
                                      }} 
                                    />
                                  </td>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[28px] bg-transparent p-1 text-center font-bold text-slate-800 focus:outline-none focus:bg-sky-50" 
                                      value={(item as any)[field]?.mulheres || ''} 
                                      onChange={(e) => { 
                                        const updated = [...formData.docentesTempoInteiro!]; 
                                        const nv = (updated[idx] as any)[field] || {homens:0,mulheres:0,total:0}; 
                                        nv.mulheres = parseInt(e.target.value)||0; 
                                        nv.total = (nv.homens||0) + nv.mulheres; 
                                        (updated[idx] as any)[field]=nv;

                                        // Update "todos" field automatically
                                        const sumFields = ['licenciado', 'mestre', 'posGraduacao', 'doutorado'];
                                        updated[idx].todos.homens = sumFields.reduce((sum, f) => sum + ((updated[idx] as any)[f]?.homens || 0), 0);
                                        updated[idx].todos.mulheres = sumFields.reduce((sum, f) => sum + ((updated[idx] as any)[f]?.mulheres || 0), 0);
                                        updated[idx].todos.total = updated[idx].todos.homens + updated[idx].todos.mulheres;

                                        setFormData(prev => ({ ...prev, docentesTempoInteiro: updated })); 
                                      }} 
                                    />
                                  </td>
                                  <td className={`border-r-2 border-black p-1 text-center font-black ${field === 'todos' ? 'text-black bg-slate-300' : 'text-slate-700 bg-slate-50'}`}>
                                    {(item as any)[field]?.total || 0}
                                  </td>
                                </React.Fragment>
                              ))}

                              <td className="p-1 text-center">
                                <button type="button" onClick={() => setFormData({...formData, docentesTempoInteiro: formData.docentesTempoInteiro?.filter((_, i) => i !== idx)})} className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50">
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {formData.docentesTempoInteiro?.length === 0 && (
                            <tr>
                              <td colSpan={19} className="p-8 text-center text-slate-400 italic">
                                Nenhuma linha adicionada. Clique no botão acima para começar.
                              </td>
                            </tr>
                          )}
                          {/* Totals row */}
                          <tr className="bg-slate-800 text-white font-black">
                            <td className="border-r border-slate-700 p-2 text-left" colSpan={4}>TOTAL GERAL</td>
                            {['licenciado', 'mestre', 'posGraduacao', 'doutorado', 'todos'].map((field) => (
                              <React.Fragment key={field}>
                                <td className="border-r border-slate-700 p-1 text-center">
                                  {formData.docentesTempoInteiro?.reduce((acc, c) => acc + ((c as any)[field]?.homens || 0), 0)}
                                </td>
                                <td className="border-r border-slate-700 p-1 text-center">
                                  {formData.docentesTempoInteiro?.reduce((acc, c) => acc + ((c as any)[field]?.mulheres || 0), 0)}
                                </td>
                                <td className="border-r border-slate-700 p-1 text-center bg-slate-700">
                                  {formData.docentesTempoInteiro?.reduce((acc, c) => acc + ((c as any)[field]?.total || 0), 0)}
                                </td>
                              </React.Fragment>
                            ))}
                            <td></td>
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_2_q1' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight">
                        <Users className="h-4 w-4 text-sky-700" /> Quadro A2. Número de Docentes por grupo etário, nacionalidade e regime de contratação
                      </h3>
                      <button 
                        onClick={() => handleAddRow('docentesGrupoEtario')}
                        className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700 font-bold"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold" rowSpan={2}>Classe de idade</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Moçambicana</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Estrangeira</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold bg-slate-400 text-white" rowSpan={2}>Total TI</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold bg-slate-400 text-white" rowSpan={2}>Total TP</th>
                          </tr>
                          <tr className="bg-slate-100 border-b-2 border-black">
                             <th className="border-r-2 border-black p-1 text-center font-bold">TI</th>
                             <th className="border-r-2 border-black p-1 text-center font-bold">TP</th>
                             <th className="border-r-2 border-black p-1 text-center font-bold bg-slate-200">Total</th>
                             <th className="border-r-2 border-black p-1 text-center font-bold">TI</th>
                             <th className="border-r-2 border-black p-1 text-center font-bold">TP</th>
                             <th className="border-r-2 border-black p-1 text-center font-bold bg-slate-200">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesGrupoEtario?.map((item, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-2 font-bold bg-slate-50 text-xs">{item.classeIdade}</td>
                              
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={item.mocambicana?.ti || ''} 
                                  onChange={(e) => handleA2CellChange(idx, 'mocambicana', 'ti', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={item.mocambicana?.tp || ''} 
                                  onChange={(e) => handleA2CellChange(idx, 'mocambicana', 'tp', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-100">{(item.mocambicana?.ti || 0) + (item.mocambicana?.tp || 0)}</td>
                              
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={item.estrangeira?.ti || ''} 
                                  onChange={(e) => handleA2CellChange(idx, 'estrangeira', 'ti', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={item.estrangeira?.tp || ''} 
                                  onChange={(e) => handleA2CellChange(idx, 'estrangeira', 'tp', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-100">{(item.estrangeira?.ti || 0) + (item.estrangeira?.tp || 0)}</td>
                              
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-800 text-white">{(item.mocambicana?.ti || 0) + (item.estrangeira?.ti || 0)}</td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-800 text-white">{(item.mocambicana?.tp || 0) + (item.estrangeira?.tp || 0)}</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-900 text-white font-black">
                            <td className="border-r border-slate-700 p-2 text-left uppercase">TOTAL GERAL</td>
                            <td className="border-r border-slate-700 p-1 text-center text-orange-400">
                              {formData.docentesGrupoEtario?.reduce((acc, i) => acc + (i.mocambicana?.ti || 0), 0)}
                            </td>
                            <td className="border-r border-slate-700 p-1 text-center text-orange-400">
                              {formData.docentesGrupoEtario?.reduce((acc, i) => acc + (i.mocambicana?.tp || 0), 0)}
                            </td>
                            <td className="border-r border-slate-700 p-1 text-center bg-slate-700">
                              {formData.docentesGrupoEtario?.reduce((acc, i) => acc + ((i.mocambicana?.ti || 0) + (i.mocambicana?.tp || 0)), 0)}
                            </td>
                            <td className="border-r border-slate-700 p-1 text-center text-orange-400">
                              {formData.docentesGrupoEtario?.reduce((acc, i) => acc + (i.estrangeira?.ti || 0), 0)}
                            </td>
                            <td className="border-r border-slate-700 p-1 text-center text-orange-400">
                              {formData.docentesGrupoEtario?.reduce((acc, i) => acc + (i.estrangeira?.tp || 0), 0)}
                            </td>
                            <td className="border-r border-slate-700 p-1 text-center bg-slate-700">
                              {formData.docentesGrupoEtario?.reduce((acc, i) => acc + ((i.estrangeira?.ti || 0) + (i.estrangeira?.tp || 0)), 0)}
                            </td>
                            <td className="border-r border-slate-700 p-1 text-center bg-orange-600">
                              {formData.docentesGrupoEtario?.reduce((acc, i) => acc + ((i.mocambicana?.ti || 0) + (i.estrangeira?.ti || 0)), 0)}
                            </td>
                            <td className="border-r border-slate-700 p-1 text-center bg-orange-600">
                              {formData.docentesGrupoEtario?.reduce((acc, i) => acc + ((i.mocambicana?.tp || 0) + (i.estrangeira?.tp || 0)), 0)}
                            </td>
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_2_q2' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight">
                        <Users className="h-4 w-4 text-emerald-700" /> Quadro A3. Número de Docentes por grupo etário, grau e regime de contratação
                      </h3>
                      <button 
                        onClick={() => handleAddRow('docentesGrupoEtarioGrau')}
                        className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 font-bold"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold" rowSpan={2}>Classe de idade</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Licenciado</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Mestre</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Doutorado</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold bg-slate-400 text-white" colSpan={3}>Todos</th>
                          </tr>
                          <tr className="bg-slate-100 border-b-2 border-black">
                             {['Licenciado', 'Mestre', 'Doutorado', 'Todos'].map(cat => (
                               <React.Fragment key={cat}>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">H</th>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">M</th>
                                 <th className="border-r-2 border-black p-1 text-center font-bold bg-slate-200">Total</th>
                               </React.Fragment>
                             ))}
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesGrupoEtarioGrau?.map((item, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-2 font-bold bg-slate-50 text-xs">{item.classeIdade}</td>
                              
                              {(['licenciado', 'mestre', 'doutorado'] as const).map(degree => (
                                <React.Fragment key={degree}>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                      value={item[degree]?.homens || ''} 
                                      onChange={(e) => handleA3CellChange(idx, degree, 'homens', e.target.value)} 
                                    />
                                  </td>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                      value={item[degree]?.mulheres || ''} 
                                      onChange={(e) => handleA3CellChange(idx, degree, 'mulheres', e.target.value)} 
                                    />
                                  </td>
                                  <td className="border-r-2 border-black p-1 text-center font-black bg-slate-100">{(item[degree]?.homens || 0) + (item[degree]?.mulheres || 0)}</td>
                                </React.Fragment>
                              ))}
                              
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-800 text-white">{item.todos?.homens || 0}</td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-800 text-white">{item.todos?.mulheres || 0}</td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-700 text-white">{item.todos?.total || 0}</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-900 text-white font-black">
                            <td className="border-r border-slate-700 p-2 text-left uppercase">TOTAL GERAL</td>
                            {(['licenciado', 'mestre', 'doutorado', 'todos'] as const).map(degree => (
                              <React.Fragment key={degree}>
                                <td className="border-r border-slate-700 p-1 text-center text-orange-400">
                                  {formData.docentesGrupoEtarioGrau?.reduce((acc, i) => acc + (i[degree]?.homens || 0), 0)}
                                </td>
                                <td className="border-r border-slate-700 p-1 text-center text-orange-400">
                                  {formData.docentesGrupoEtarioGrau?.reduce((acc, i) => acc + (i[degree]?.mulheres || 0), 0)}
                                </td>
                                <td className="border-r border-slate-700 p-1 text-center bg-slate-700">
                                  {formData.docentesGrupoEtarioGrau?.reduce((acc, i) => acc + (i[degree]?.total || 0), 0)}
                                </td>
                              </React.Fragment>
                            ))}
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_2_q3' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-amber-700" /> #Área de formação {currentUser.name || 'ISPS'} ({myInstitution?.abbreviation || 'IES'}) 2025
                      </h3>
                      <button 
                        onClick={() => handleAddRow('docentesAreaFormacao')}
                        className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 font-bold"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold" rowSpan={2}>Área de formação</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Licenciado</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Mestre</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Pós-Graduação</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Doutorado</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold bg-slate-400 text-white" colSpan={3}>Todos</th>
                          </tr>
                          <tr className="bg-slate-100 border-b-2 border-black">
                             {[1, 2, 3, 4, 5].map(i => (
                               <React.Fragment key={i}>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">H</th>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">M</th>
                                 <th className="border-r-2 border-black p-1 text-center font-bold bg-slate-200">Total</th>
                               </React.Fragment>
                             ))}
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesAreaFormacao?.map((item, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-2 font-bold bg-slate-50 text-xs w-[300px] whitespace-normal leading-tight">{item.area}</td>
                              
                              {(['licenciado', 'mestre', 'posGraduacao', 'doutorado'] as const).map(degree => (
                                <React.Fragment key={degree}>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                      value={item[degree]?.homens || ''} 
                                      onChange={(e) => handleA4CellChange(idx, degree, 'homens', e.target.value)} 
                                    />
                                  </td>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                      value={item[degree]?.mulheres || ''} 
                                      onChange={(e) => handleA4CellChange(idx, degree, 'mulheres', e.target.value)} 
                                    />
                                  </td>
                                  <td className="border-r-2 border-black p-1 text-center font-black bg-slate-100">{(item[degree]?.homens || 0) + (item[degree]?.mulheres || 0)}</td>
                                </React.Fragment>
                              ))}
                              
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-800 text-white">{item.todos?.homens || 0}</td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-800 text-white">{item.todos?.mulheres || 0}</td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-700 text-white">{item.todos?.total || 0}</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-900 text-white font-black">
                            <td className="border-r border-slate-700 p-2 text-left uppercase">TOTAL GERAL</td>
                            {(['licenciado', 'mestre', 'posGraduacao', 'doutorado', 'todos'] as const).map(degree => (
                              <React.Fragment key={degree}>
                                <td className="border-r border-slate-700 p-1 text-center text-orange-400">
                                  {formData.docentesAreaFormacao?.reduce((acc, i) => acc + (i[degree]?.homens || 0), 0)}
                                </td>
                                <td className="border-r border-slate-700 p-1 text-center text-orange-400">
                                  {formData.docentesAreaFormacao?.reduce((acc, i) => acc + (i[degree]?.mulheres || 0), 0)}
                                </td>
                                <td className="border-r border-slate-700 p-1 text-center bg-slate-700">
                                  {formData.docentesAreaFormacao?.reduce((acc, i) => acc + (i[degree]?.total || 0), 0)}
                                </td>
                              </React.Fragment>
                            ))}
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_2_q4' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro A5: Número de docentes por Curso de Formação, Grau e Sexo
                      </h3>
                      <button 
                        onClick={() => handleAddRow('docentesCursoFormacao')}
                        className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 font-bold"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold" rowSpan={2}>Curso de Formação</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Licenciado</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Mestre</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Pós-Graduação</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Doutorado</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold bg-slate-400 text-white" colSpan={3}>Todos</th>
                          </tr>
                          <tr className="bg-slate-100 border-b-2 border-black">
                             {[1, 2, 3, 4, 5].map(i => (
                               <React.Fragment key={i}>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">H</th>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">M</th>
                                 <th className="border-r-2 border-black p-1 text-center font-bold bg-slate-200">Total</th>
                               </React.Fragment>
                             ))}
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesCursoFormacao?.map((item, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-0 relative w-[250px]">
                                <input 
                                  placeholder="Curso..."
                                  className="w-full h-full min-h-[30px] bg-transparent p-2 text-left font-bold focus:outline-none focus:bg-emerald-50 italic placeholder:text-slate-300" 
                                  value={item.curso || ''} 
                                  onChange={(e) => handleA5CourseChange(idx, e.target.value)} 
                                />
                              </td>
                              
                              {(['licenciado', 'mestre', 'posGraduacao', 'doutorado'] as const).map(degree => (
                                <React.Fragment key={degree}>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                      value={item[degree]?.homens || ''} 
                                      onChange={(e) => handleA5CellChange(idx, degree, 'homens', e.target.value)} 
                                    />
                                  </td>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                      value={item[degree]?.mulheres || ''} 
                                      onChange={(e) => handleA5CellChange(idx, degree, 'mulheres', e.target.value)} 
                                    />
                                  </td>
                                  <td className="border-r-2 border-black p-1 text-center font-black bg-slate-100">{(item[degree]?.homens || 0) + (item[degree]?.mulheres || 0)}</td>
                                </React.Fragment>
                              ))}
                              
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-800 text-white">{item.todos?.homens || 0}</td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-800 text-white">{item.todos?.mulheres || 0}</td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-700 text-white">{item.todos?.total || 0}</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-900 text-white font-black">
                            <td className="border-r border-slate-700 p-2 text-left uppercase">TOTAL GERAL</td>
                            {(['licenciado', 'mestre', 'posGraduacao', 'doutorado', 'todos'] as const).map(degree => (
                              <React.Fragment key={degree}>
                                <td className="border-r border-slate-700 p-1 text-center text-orange-400">
                                  {formData.docentesCursoFormacao?.reduce((acc, i) => acc + (i[degree]?.homens || 0), 0)}
                                </td>
                                <td className="border-r border-slate-700 p-1 text-center text-orange-400">
                                  {formData.docentesCursoFormacao?.reduce((acc, i) => acc + (i[degree]?.mulheres || 0), 0)}
                                </td>
                                <td className="border-r border-slate-700 p-1 text-center bg-slate-700">
                                  {formData.docentesCursoFormacao?.reduce((acc, i) => acc + (i[degree]?.total || 0), 0)}
                                </td>
                              </React.Fragment>
                            ))}
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_2_q5' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <GraduationCap className="h-4 w-4 text-emerald-700" /> Quadro A6: Número de Docentes por Regime de Contratação, Categoria e Sexo
                      </h3>
                      <button 
                        type="button"
                        onClick={() => handleAddRow('docentesRegimeCategoria')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] transition-all uppercase"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm bg-white">
                      <table className="w-full text-xs border-collapse bg-white whitespace-nowrap min-w-full min-w-[1200px]">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold" rowSpan={2}>Regime de Contratação</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-sky-50" colSpan={3}>Assistente Estagiário</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-emerald-50" colSpan={3}>Assistente</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-amber-50" colSpan={3}>Professor Auxiliar</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-purple-50" colSpan={3}>Professor Associado</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-rose-50" colSpan={3}>Professor Catedrático</th>
                            <th className="border-r-2 border-black p-1 text-center font-bold bg-slate-400 text-white" colSpan={3}>Todos os Docentes</th>
                            <th className="p-1 text-center font-bold" rowSpan={2}>Remover</th>
                          </tr>
                          <tr className="bg-slate-100 border-b-2 border-black">
                            {['Assistente Estagiário', 'Assistente', 'Professor Auxiliar', 'Professor Associado', 'Professor Catedrático', 'Todos'].map((cat) => (
                              <React.Fragment key={cat}>
                                <th className="border-r-2 border-black p-1 text-center font-bold">H</th>
                                <th className="border-r-2 border-black p-1 text-center font-bold">M</th>
                                <th className="border-r-2 border-black p-1 text-center font-bold bg-slate-200">Total</th>
                              </React.Fragment>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesRegimeCategoria?.map((item, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-0 relative min-w-[180px]">
                                <select 
                                  value={item.regime || ''} 
                                  onChange={(e) => {
                                    const updated = [...(formData.docentesRegimeCategoria || [])];
                                    updated[idx] = { ...updated[idx], regime: e.target.value };
                                    setFormData(prev => ({ ...prev, docentesRegimeCategoria: updated }));
                                  }}
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 font-bold text-center focus:bg-sky-50 focus:outline-none"
                                >
                                  <option value="">Selecione</option>
                                  <option value="Tempo Inteiro">Tempo Inteiro</option>
                                  <option value="Tempo Parcial">Tempo Parcial</option>
                                </select>
                              </td>

                              {(['assistenteEstagiario', 'assistente', 'professorAuxiliar', 'professorAssociado', 'professorCatedratico'] as const).map(cat => (
                                <React.Fragment key={cat}>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                      value={item[cat]?.homens || ''} 
                                      onChange={(e) => handleA6CellChange(idx, cat, 'homens', e.target.value)} 
                                    />
                                  </td>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                      value={item[cat]?.mulheres || ''} 
                                      onChange={(e) => handleA6CellChange(idx, cat, 'mulheres', e.target.value)} 
                                    />
                                  </td>
                                  <td className="border-r-2 border-black p-1 text-center font-black bg-slate-100">{(item[cat]?.homens || 0) + (item[cat]?.mulheres || 0)}</td>
                                </React.Fragment>
                              ))}

                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-800 text-white">{item.todos?.homens || 0}</td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-800 text-white">{item.todos?.mulheres || 0}</td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-700 text-white">{item.todos?.total || 0}</td>
                              
                              <td className="p-1 text-center">
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    const updated = formData.docentesRegimeCategoria?.filter((_, i) => i !== idx) || [];
                                    setFormData(prev => ({ ...prev, docentesRegimeCategoria: updated }));
                                  }}
                                  className="text-red-650 hover:text-red-800 font-extrabold uppercase text-xs"
                                >
                                  Remover
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-slate-900 text-white font-black">
                            <td className="border-r-2 border-black p-2 text-left uppercase">TOTAL GERAL</td>
                            {(['assistenteEstagiario', 'assistente', 'professorAuxiliar', 'professorAssociado', 'professorCatedratico', 'todos'] as const).map(cat => (
                              <React.Fragment key={cat}>
                                <td className="border-r-2 border-black p-1 text-center text-orange-400">
                                  {formData.docentesRegimeCategoria?.reduce((acc, i) => acc + (i[cat]?.homens || 0), 0)}
                                </td>
                                <td className="border-r-2 border-black p-1 text-center text-orange-400">
                                  {formData.docentesRegimeCategoria?.reduce((acc, i) => acc + (i[cat]?.mulheres || 0), 0)}
                                </td>
                                <td className="border-r-2 border-black p-1 text-center bg-slate-700 text-orange-400">
                                  {formData.docentesRegimeCategoria?.reduce((acc, i) => acc + (i[cat]?.total || 0), 0)}
                                </td>
                              </React.Fragment>
                            ))}
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_2_q6' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro A7: Número de Docentes por tipo de relação contratual, nível de formação e sexo
                      </h3>
                      <button 
                        onClick={() => handleAddRow('docentesRelacaoContractual')}
                        className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 font-bold ml-2"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold" rowSpan={2}>Tipo de relação</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Licenciado</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Mestre</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Doutorado</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold bg-slate-400 text-white" colSpan={3}>Todos</th>
                          </tr>
                          <tr className="bg-slate-100 border-b-2 border-black">
                             {[1, 2, 3, 4].map(i => (
                               <React.Fragment key={i}>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">H</th>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">M</th>
                                 <th className="border-r-2 border-black p-1 text-center font-bold bg-slate-200">Total</th>
                               </React.Fragment>
                             ))}
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesRelacaoContractual?.map((item, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="text" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={item.relacaoContractual || ''} 
                                  onChange={(e) => handleA7RelacaoChange(idx, e.target.value)} 
                                />
                              </td>
                              
                              {(['licenciado', 'mestre', 'doutorado'] as const).map(cat => (
                                <React.Fragment key={cat}>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                      value={item[cat]?.homens || ''} 
                                      onChange={(e) => handleA7CellChange(idx, cat, 'homens', e.target.value)} 
                                    />
                                  </td>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                      value={item[cat]?.mulheres || ''} 
                                      onChange={(e) => handleA7CellChange(idx, cat, 'mulheres', e.target.value)} 
                                    />
                                  </td>
                                  <td className="border-r-2 border-black p-1 text-center font-black bg-slate-100">{(item[cat]?.homens || 0) + (item[cat]?.mulheres || 0)}</td>
                                </React.Fragment>
                              ))}
                              
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-800 text-white">{item.todos?.homens || 0}</td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-800 text-white">{item.todos?.mulheres || 0}</td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-700 text-white">{item.todos?.total || 0}</td>
                            </tr>
                          ))}
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_4_q1' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro A8.1: Número de Investigadores a tempo inteiro por nacionalidade nível de formação e sexo
                      </h3>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold" rowSpan={2}>Nacionalidade</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Licenciatura</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Mestrado</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Doutoramento</th>
                            <th className="border-r border-black p-2 text-center font-bold" colSpan={3}>Pós-Graduação</th>
                          </tr>
                          <tr className="bg-slate-100 border-b-2 border-black">
                             {[1, 2, 3, 4].map(i => (
                               <React.Fragment key={i}>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">Homens</th>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">Mulheres</th>
                                 <th className="border-r border-black p-1 text-center font-bold bg-slate-200">Total</th>
                               </React.Fragment>
                             ))}
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesInvestigadoresNacionalidade?.map((item, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-2 font-black bg-slate-50">{item.nacionalidade}</td>
                              
                              {(['licenciatura', 'mestrado', 'doutoramento', 'posGraduacao'] as const).map(cat => (
                                <React.Fragment key={cat}>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                      value={item[cat]?.homens || ''} 
                                      onChange={(e) => handleA8CellChange(idx, cat, 'homens', e.target.value)} 
                                    />
                                  </td>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                      value={item[cat]?.mulheres || ''} 
                                      onChange={(e) => handleA8CellChange(idx, cat, 'mulheres', e.target.value)} 
                                    />
                                  </td>
                                  <td className="border-r border-black p-1 text-center font-black bg-slate-100">{(item[cat]?.homens || 0) + (item[cat]?.mulheres || 0)}</td>
                                </React.Fragment>
                              ))}
                            </tr>
                          ))}
                          {/* Total Row */}
                          <tr className="bg-slate-200 font-black">
                            <td className="border-r-2 border-black p-2 text-center uppercase">Total</td>
                            {(['licenciatura', 'mestrado', 'doutoramento', 'posGraduacao'] as const).map(cat => {
                              const hTotal = (formData.docentesInvestigadoresNacionalidade || []).reduce((sum, row) => sum + (row[cat]?.homens || 0), 0);
                              const mTotal = (formData.docentesInvestigadoresNacionalidade || []).reduce((sum, row) => sum + (row[cat]?.mulheres || 0), 0);
                              return (
                                <React.Fragment key={cat}>
                                  <td className="border-r-2 border-black p-1 text-center bg-slate-300">{hTotal}</td>
                                  <td className="border-r-2 border-black p-1 text-center bg-slate-300">{mTotal}</td>
                                  <td className="border-r border-black p-1 text-center bg-slate-400">{hTotal + mTotal}</td>
                                </React.Fragment>
                              );
                            })}
                          </tr>
                        </tbody>
                       </table>
                    </div>

                  </div>
                )}

                {formSubTab === 'eixo_4_q2' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro A8.2: Número de Investigadores a tempo parcial por nacionalidade nível de formação e sexo
                      </h3>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold" rowSpan={2}>Nacionalidade</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Licenciatura</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Mestrado</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Doutoramento</th>
                            <th className="border-r border-black p-2 text-center font-bold" colSpan={3}>Pós-Graduação</th>
                          </tr>
                          <tr className="bg-slate-100 border-b-2 border-black">
                             {[1, 2, 3, 4].map(i => (
                               <React.Fragment key={i}>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">Homens</th>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">Mulheres</th>
                                 <th className="border-r border-black p-1 text-center font-bold bg-slate-200">Total</th>
                               </React.Fragment>
                             ))}
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesInvestigadoresNacionalidadeParcial?.map((item, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-2 font-black bg-slate-50">{item.nacionalidade}</td>
                              
                              {(['licenciatura', 'mestrado', 'doutoramento', 'posGraduacao'] as const).map(cat => (
                                <React.Fragment key={cat}>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                      value={item[cat]?.homens || ''} 
                                      onChange={(e) => handleA8ParcialCellChange(idx, cat, 'homens', e.target.value)} 
                                    />
                                  </td>
                                  <td className="border-r-2 border-black p-0 relative">
                                    <input 
                                      type="number" 
                                      className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                      value={item[cat]?.mulheres || ''} 
                                      onChange={(e) => handleA8ParcialCellChange(idx, cat, 'mulheres', e.target.value)} 
                                    />
                                  </td>
                                  <td className="border-r border-black p-1 text-center font-black bg-slate-100">{(item[cat]?.homens || 0) + (item[cat]?.mulheres || 0)}</td>
                                </React.Fragment>
                              ))}
                            </tr>
                          ))}
                          {/* Total Row */}
                          <tr className="bg-slate-200 font-black">
                            <td className="border-r-2 border-black p-2 text-center uppercase">Total</td>
                            {(['licenciatura', 'mestrado', 'doutoramento', 'posGraduacao'] as const).map(cat => {
                              const hTotal = (formData.docentesInvestigadoresNacionalidadeParcial || []).reduce((sum, row) => sum + (row[cat]?.homens || 0), 0);
                              const mTotal = (formData.docentesInvestigadoresNacionalidadeParcial || []).reduce((sum, row) => sum + (row[cat]?.mulheres || 0), 0);
                              return (
                                <React.Fragment key={cat}>
                                  <td className="border-r-2 border-black p-1 text-center bg-slate-300">{hTotal}</td>
                                  <td className="border-r-2 border-black p-1 text-center bg-slate-300">{mTotal}</td>
                                  <td className="border-r border-black p-1 text-center bg-slate-400">{hTotal + mTotal}</td>
                                </React.Fragment>
                              );
                            })}
                          </tr>
                        </tbody>
                       </table>
                    </div>

                  </div>
                )}

                {formSubTab === 'eixo_4_q3' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro A8.3 Número de Investigadores por tipo de contrato, nível de formação e por sexo
                      </h3>
                      <div className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                        Preenchimento Automático (Resumo de A8.1 e A8.2)
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold" rowSpan={2}>Tipo de Contrato</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Licenciatura</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Mestrado</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Doutoramento</th>
                            <th className="border-r border-black p-2 text-center font-bold" colSpan={3}>Pós-Graduação</th>
                          </tr>
                          <tr className="bg-slate-100 border-b-2 border-black">
                             {[1, 2, 3, 4].map(i => (
                               <React.Fragment key={i}>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">Homens</th>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">Mulheres</th>
                                 <th className="border-r border-black p-1 text-center font-bold bg-slate-200">Total</th>
                               </React.Fragment>
                             ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const cats = ['licenciatura', 'mestrado', 'doutoramento', 'posGraduacao'] as const;
                            
                            // Sums for TI (A8.1)
                            const tiSums = cats.map(cat => {
                              const h = (formData.docentesInvestigadoresNacionalidade || []).reduce((s, r) => s + (r[cat]?.homens || 0), 0);
                              const m = (formData.docentesInvestigadoresNacionalidade || []).reduce((s, r) => s + (r[cat]?.mulheres || 0), 0);
                              return { h, m };
                            });

                            // Sums for TP (A8.2)
                            const tpSums = cats.map(cat => {
                              const h = (formData.docentesInvestigadoresNacionalidadeParcial || []).reduce((s, r) => s + (r[cat]?.homens || 0), 0);
                              const m = (formData.docentesInvestigadoresNacionalidadeParcial || []).reduce((s, r) => s + (r[cat]?.mulheres || 0), 0);
                              return { h, m };
                            });

                            return (
                              <>
                                <tr className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                                  <td className="border-r-2 border-black p-2 font-black bg-slate-50">Tempo Inteiro</td>
                                  {tiSums.map((sums, i) => (
                                    <React.Fragment key={i}>
                                      <td className="border-r-2 border-black p-2 text-center font-bold">{sums.h}</td>
                                      <td className="border-r-2 border-black p-2 text-center font-bold">{sums.m}</td>
                                      <td className="border-r border-black p-2 text-center font-black bg-slate-100">{sums.h + sums.m}</td>
                                    </React.Fragment>
                                  ))}
                                </tr>
                                <tr className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                                  <td className="border-r-2 border-black p-2 font-black bg-slate-50">Tempo parcial</td>
                                  {tpSums.map((sums, i) => (
                                    <React.Fragment key={i}>
                                      <td className="border-r-2 border-black p-2 text-center font-bold">{sums.h}</td>
                                      <td className="border-r-2 border-black p-2 text-center font-bold">{sums.m}</td>
                                      <td className="border-r border-black p-2 text-center font-black bg-slate-100">{sums.h + sums.m}</td>
                                    </React.Fragment>
                                  ))}
                                </tr>
                                <tr className="bg-slate-200 font-black">
                                  <td className="border-r-2 border-black p-2 text-center uppercase">Total</td>
                                  {cats.map((_, i) => {
                                    const hTotal = tiSums[i].h + tpSums[i].h;
                                    const mTotal = tiSums[i].m + tpSums[i].m;
                                    return (
                                      <React.Fragment key={i}>
                                        <td className="border-r-2 border-black p-1 text-center bg-slate-300">{hTotal}</td>
                                        <td className="border-r-2 border-black p-1 text-center bg-slate-300">{mTotal}</td>
                                        <td className="border-r border-black p-1 text-center bg-slate-400">{hTotal + mTotal}</td>
                                      </React.Fragment>
                                    );
                                  })}
                                </tr>
                              </>
                            );
                          })()}
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_4_q4' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro A8.4.1 Número de investigadores a tempo inteiro por grupo etário, nacionalidade e sexo
                      </h3>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold" rowSpan={2}>Classe de idade</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Moçambicanos</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Estrangeiros</th>
                            <th className="border-r border-black p-2 text-center font-bold" colSpan={3}>Todos</th>
                          </tr>
                          <tr className="bg-slate-100 border-b-2 border-black">
                             {[1, 2, 3].map(i => (
                               <React.Fragment key={i}>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">Homens</th>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">Mulheres</th>
                                 <th className="border-r border-black p-1 text-center font-bold bg-slate-200">Total</th>
                               </React.Fragment>
                             ))}
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesInvestigadoresGrupoEtarioTi?.map((row, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-2 font-black bg-slate-50">{row.classeIdade}</td>
                              
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.mocambicanos?.homens || ''} 
                                  onChange={(e) => handleA841CellChange(idx, 'mocambicanos', 'homens', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.mocambicanos?.mulheres || ''} 
                                  onChange={(e) => handleA841CellChange(idx, 'mocambicanos', 'mulheres', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-100 italic">{row.mocambicanos?.total || 0}</td>

                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.estrangeiros?.homens || ''} 
                                  onChange={(e) => handleA841CellChange(idx, 'estrangeiros', 'homens', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.estrangeiros?.mulheres || ''} 
                                  onChange={(e) => handleA841CellChange(idx, 'estrangeiros', 'mulheres', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-100 italic">{row.estrangeiros?.total || 0}</td>

                              <td className="border-r-2 border-black p-1 text-center font-bold bg-slate-200">{row.total?.homens || 0}</td>
                              <td className="border-r-2 border-black p-1 text-center font-bold bg-slate-200">{row.total?.mulheres || 0}</td>
                              <td className="border-r border-black p-1 text-center font-black bg-slate-300">{row.total?.total || 0}</td>
                            </tr>
                          ))}
                          {/* Total Row */}
                          <tr className="bg-slate-300 font-black">
                            <td className="border-r-2 border-black p-2 text-center uppercase">Total Geral</td>
                            {(() => {
                              const hMoc = (formData.docentesInvestigadoresGrupoEtarioTi || []).reduce((s, r) => s + (r.mocambicanos?.homens || 0), 0);
                              const mMoc = (formData.docentesInvestigadoresGrupoEtarioTi || []).reduce((s, r) => s + (r.mocambicanos?.mulheres || 0), 0);
                              const hEst = (formData.docentesInvestigadoresGrupoEtarioTi || []).reduce((s, r) => s + (r.estrangeiros?.homens || 0), 0);
                              const mEst = (formData.docentesInvestigadoresGrupoEtarioTi || []).reduce((s, r) => s + (r.estrangeiros?.mulheres || 0), 0);
                              
                              return (
                                <>
                                  <td className="border-r-2 border-black p-1 text-center">{hMoc}</td>
                                  <td className="border-r-2 border-black p-1 text-center">{mMoc}</td>
                                  <td className="border-r-2 border-black p-1 text-center bg-slate-400">{hMoc + mMoc}</td>
                                  <td className="border-r-2 border-black p-1 text-center">{hEst}</td>
                                  <td className="border-r-2 border-black p-1 text-center">{mEst}</td>
                                  <td className="border-r-2 border-black p-1 text-center bg-slate-400">{hEst + mEst}</td>
                                  <td className="border-r-2 border-black p-1 text-center bg-slate-400">{hMoc + hEst}</td>
                                  <td className="border-r-2 border-black p-1 text-center bg-slate-400">{mMoc + mEst}</td>
                                  <td className="border-r border-black p-1 text-center bg-slate-500 text-white">{hMoc + mMoc + hEst + mEst}</td>
                                </>
                              );
                            })()}
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_4_q5' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro A8.4.2 Número de Investigadores a tempo parcial por grupo etario, nacionalidade e sexo
                      </h3>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold" rowSpan={2}>Classe de idade</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Moçambicanos</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Estrangeiros</th>
                            <th className="border-r border-black p-2 text-center font-bold" colSpan={3}>Todos</th>
                          </tr>
                          <tr className="bg-slate-100 border-b-2 border-black">
                             {[1, 2, 3].map(i => (
                               <React.Fragment key={i}>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">Homens</th>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">Mulheres</th>
                                 <th className="border-r border-black p-1 text-center font-bold bg-slate-200">Total</th>
                               </React.Fragment>
                             ))}
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesInvestigadoresGrupoEtarioTp?.map((row, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-2 font-black bg-slate-50">{row.classeIdade}</td>
                              
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.mocambicanos?.homens || ''} 
                                  onChange={(e) => handleA842CellChange(idx, 'mocambicanos', 'homens', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.mocambicanos?.mulheres || ''} 
                                  onChange={(e) => handleA842CellChange(idx, 'mocambicanos', 'mulheres', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-100 italic">{row.mocambicanos?.total || 0}</td>

                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.estrangeiros?.homens || ''} 
                                  onChange={(e) => handleA842CellChange(idx, 'estrangeiros', 'homens', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.estrangeiros?.mulheres || ''} 
                                  onChange={(e) => handleA842CellChange(idx, 'estrangeiros', 'mulheres', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-100 italic">{row.estrangeiros?.total || 0}</td>

                              <td className="border-r-2 border-black p-1 text-center font-bold bg-slate-200">{row.total?.homens || 0}</td>
                              <td className="border-r-2 border-black p-1 text-center font-bold bg-slate-200">{row.total?.mulheres || 0}</td>
                              <td className="border-r border-black p-1 text-center font-black bg-slate-300">{row.total?.total || 0}</td>
                            </tr>
                          ))}
                          {/* Total Row */}
                          <tr className="bg-slate-300 font-black">
                            <td className="border-r-2 border-black p-2 text-center uppercase">Total Geral</td>
                            {(() => {
                              const hMoc = (formData.docentesInvestigadoresGrupoEtarioTp || []).reduce((s, r) => s + (r.mocambicanos?.homens || 0), 0);
                              const mMoc = (formData.docentesInvestigadoresGrupoEtarioTp || []).reduce((s, r) => s + (r.mocambicanos?.mulheres || 0), 0);
                              const hEst = (formData.docentesInvestigadoresGrupoEtarioTp || []).reduce((s, r) => s + (r.estrangeiros?.homens || 0), 0);
                              const mEst = (formData.docentesInvestigadoresGrupoEtarioTp || []).reduce((s, r) => s + (r.estrangeiros?.mulheres || 0), 0);
                              
                              return (
                                <>
                                  <td className="border-r-2 border-black p-1 text-center">{hMoc}</td>
                                  <td className="border-r-2 border-black p-1 text-center">{mMoc}</td>
                                  <td className="border-r-2 border-black p-1 text-center bg-slate-400">{hMoc + mMoc}</td>
                                  <td className="border-r-2 border-black p-1 text-center">{hEst}</td>
                                  <td className="border-r-2 border-black p-1 text-center">{mEst}</td>
                                  <td className="border-r-2 border-black p-1 text-center bg-slate-400">{hEst + mEst}</td>
                                  <td className="border-r-2 border-black p-1 text-center bg-slate-400">{hMoc + hEst}</td>
                                  <td className="border-r-2 border-black p-1 text-center bg-slate-400">{mMoc + mEst}</td>
                                  <td className="border-r border-black p-1 text-center bg-slate-500 text-white">{hMoc + mMoc + hEst + mEst}</td>
                                </>
                              );
                            })()}
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_4_q6' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro A8.4.4 Número de investigadores a tempo inteiro por área de formação, sexo e nacionalidade
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => handleAddRow('docentesInvestigadoresAreaFormacaoTi')}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)] ml-2"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold" rowSpan={2}>Área de formação</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Moçambicanos</th>
                            <th className="border-r border-black p-2 text-center font-bold" colSpan={3}>Estrangeiros</th>
                          </tr>
                          <tr className="bg-slate-100 border-b-2 border-black">
                             {[1, 2].map(i => (
                               <React.Fragment key={i}>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">Homens</th>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">Mulheres</th>
                                 <th className="border-r border-black p-1 text-center font-bold bg-slate-200">Total</th>
                               </React.Fragment>
                             ))}
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesInvestigadoresAreaFormacaoTi?.map((row, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-0 relative whitespace-normal min-w-[200px]">
                                <input 
                                  placeholder="Área de formação..."
                                  className="w-full h-full min-h-[30px] bg-transparent p-2 text-left font-black focus:outline-none focus:bg-emerald-50 italic placeholder:text-slate-300" 
                                  value={row.area || ''} 
                                  onChange={(e) => handleA844AreaChange(idx, e.target.value)} 
                                />
                              </td>
                              
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.mocambicanos?.homens || ''} 
                                  onChange={(e) => handleA844CellChange(idx, 'mocambicanos', 'homens', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.mocambicanos?.mulheres || ''} 
                                  onChange={(e) => handleA844CellChange(idx, 'mocambicanos', 'mulheres', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-100 italic">{row.mocambicanos?.total || 0}</td>

                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.estrangeiros?.homens || ''} 
                                  onChange={(e) => handleA844CellChange(idx, 'estrangeiros', 'homens', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.estrangeiros?.mulheres || ''} 
                                  onChange={(e) => handleA844CellChange(idx, 'estrangeiros', 'mulheres', e.target.value)} 
                                />
                              </td>
                              <td className="border-r border-black p-1 text-center font-black bg-slate-100 italic">{row.estrangeiros?.total || 0}</td>
                            </tr>
                          ))}
                          {/* Total Row */}
                          <tr className="bg-slate-300 font-black text-xs">
                            <td className="border-r-2 border-black p-2 text-center uppercase">Total Geral</td>
                            {(() => {
                              const hMoc = (formData.docentesInvestigadoresAreaFormacaoTi || []).reduce((s, r) => s + (r.mocambicanos?.homens || 0), 0);
                              const mMoc = (formData.docentesInvestigadoresAreaFormacaoTi || []).reduce((s, r) => s + (r.mocambicanos?.mulheres || 0), 0);
                              const hEst = (formData.docentesInvestigadoresAreaFormacaoTi || []).reduce((s, r) => s + (r.estrangeiros?.homens || 0), 0);
                              const mEst = (formData.docentesInvestigadoresAreaFormacaoTi || []).reduce((s, r) => s + (r.estrangeiros?.mulheres || 0), 0);
                              
                              return (
                                <>
                                  <td className="border-r-2 border-black p-1 text-center">{hMoc}</td>
                                  <td className="border-r-2 border-black p-1 text-center">{mMoc}</td>
                                  <td className="border-r-2 border-black p-1 text-center bg-slate-400">{hMoc + mMoc}</td>
                                  <td className="border-r-2 border-black p-1 text-center">{hEst}</td>
                                  <td className="border-r-2 border-black p-1 text-center">{mEst}</td>
                                  <td className="border-r border-black p-1 text-center bg-slate-400">{hEst + mEst}</td>
                                </>
                              );
                            })()}
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}


                
                {formSubTab === 'eixo_4_q7' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro  A8.4.4.1  Número de investigadores a tempo parcial por área de formação, sexo e nacionalidade
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => handleAddRow('docentesInvestigadoresAreaFormacaoTp')}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)] ml-2"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-xs border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold" rowSpan={2}>Área de formação</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold" colSpan={3}>Moçambicanos</th>
                            <th className="border-r border-black p-2 text-center font-bold" colSpan={3}>Estrangeiros</th>
                          </tr>
                          <tr className="bg-slate-100 border-b-2 border-black">
                             {[1, 2].map(i => (
                               <React.Fragment key={i}>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">Homens</th>
                                 <th className="border-r-2 border-black p-1 text-center font-bold">Mulheres</th>
                                 <th className="border-r border-black p-1 text-center font-bold bg-slate-200">Total</th>
                               </React.Fragment>
                             ))}
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesInvestigadoresAreaFormacaoTp?.map((row, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-0 relative whitespace-normal min-w-[200px]">
                                <input 
                                  placeholder="Área de formação..."
                                  className="w-full h-full min-h-[30px] bg-transparent p-2 text-left font-black focus:outline-none focus:bg-emerald-50 italic placeholder:text-slate-300" 
                                  value={row.area || ''} 
                                  onChange={(e) => handleA8441AreaChange(idx, e.target.value)} 
                                />
                              </td>
                              
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.mocambicanos?.homens || ''} 
                                  onChange={(e) => handleA8441CellChange(idx, 'mocambicanos', 'homens', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.mocambicanos?.mulheres || ''} 
                                  onChange={(e) => handleA8441CellChange(idx, 'mocambicanos', 'mulheres', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-1 text-center font-black bg-slate-100 italic">{row.mocambicanos?.total || 0}</td>

                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.estrangeiros?.homens || ''} 
                                  onChange={(e) => handleA8441CellChange(idx, 'estrangeiros', 'homens', e.target.value)} 
                                />
                              </td>
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number" 
                                  className="w-full h-full min-h-[30px] bg-transparent p-1 text-center font-black focus:outline-none focus:bg-sky-50" 
                                  value={row.estrangeiros?.mulheres || ''} 
                                  onChange={(e) => handleA8441CellChange(idx, 'estrangeiros', 'mulheres', e.target.value)} 
                                />
                              </td>
                              <td className="border-r border-black p-1 text-center font-black bg-slate-100 italic">{row.estrangeiros?.total || 0}</td>
                            </tr>
                          ))}
                          {/* Total Row */}
                          <tr className="bg-slate-300 font-black text-xs">
                            <td className="border-r-2 border-black p-2 text-center uppercase">Total Geral</td>
                            {(() => {
                              const hMoc = (formData.docentesInvestigadoresAreaFormacaoTp || []).reduce((s, r) => s + (r.mocambicanos?.homens || 0), 0);
                              const mMoc = (formData.docentesInvestigadoresAreaFormacaoTp || []).reduce((s, r) => s + (r.mocambicanos?.mulheres || 0), 0);
                              const hEst = (formData.docentesInvestigadoresAreaFormacaoTp || []).reduce((s, r) => s + (r.estrangeiros?.homens || 0), 0);
                              const mEst = (formData.docentesInvestigadoresAreaFormacaoTp || []).reduce((s, r) => s + (r.estrangeiros?.mulheres || 0), 0);
                              
                              return (
                                <>
                                  <td className="border-r-2 border-black p-1 text-center">{hMoc}</td>
                                  <td className="border-r-2 border-black p-1 text-center">{mMoc}</td>
                                  <td className="border-r-2 border-black p-1 text-center bg-slate-400">{hMoc + mMoc}</td>
                                  <td className="border-r-2 border-black p-1 text-center">{hEst}</td>
                                  <td className="border-r-2 border-black p-1 text-center">{mEst}</td>
                                  <td className="border-r border-black p-1 text-center bg-slate-400">{hEst + mEst}</td>
                                </>
                              );
                            })()}
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_4_q8' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro A8.4.4.2 Trabalhos de Conclusão do Curso
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => handleAddRow('docentesInvestigadoresTCC')}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)] ml-2"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-sm border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold font-mono text-xs w-12">N de Ord.</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold">Trabalhos de conclusão/docente</th>
                            <th className="p-2 text-center font-bold">Nivel</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesInvestigadoresTCC?.map((row, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-2 text-center font-black bg-slate-50">{idx + 1}</td>
                              <td className="border-r-2 border-black p-0 relative min-w-[250px]">
                                <input 
                                  placeholder="Nome ou descrição..."
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-left font-semibold focus:outline-none focus:bg-emerald-50" 
                                  value={row.conclusaoDocente || ''} 
                                  onChange={(e) => handleTCCChange(idx, 'conclusaoDocente', e.target.value)} 
                                />
                              </td>
                              <td className="border-black p-0 relative min-w-[150px]">
                                <input 
                                  placeholder="Licenciatura, Mestrado..."
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-center font-semibold focus:outline-none focus:bg-emerald-50" 
                                  value={row.nivel || ''} 
                                  onChange={(e) => handleTCCChange(idx, 'nivel', e.target.value)} 
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_4_q9' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro A8.4.4.3 Número de Dissertações Orientadas por Docente, Nível de Formação e Sexo
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => handleAddRow('docentesInvestigadoresDissertacoes')}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)] ml-2"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-sm border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold font-mono text-xs w-12">N de Ord.</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold">Dissertações/docente</th>
                            <th className="p-2 text-center font-bold">Nível</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesInvestigadoresDissertacoes?.map((row, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-2 text-center font-black bg-slate-50">{idx + 1}</td>
                              <td className="border-r-2 border-black p-0 relative min-w-[250px]">
                                <input 
                                  placeholder="Nome ou descrição..."
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-left font-semibold focus:outline-none focus:bg-emerald-50" 
                                  value={row.dissertacoesDocente || ''} 
                                  onChange={(e) => handleDissertacoesChange(idx, 'dissertacoesDocente', e.target.value)} 
                                />
                              </td>
                              <td className="border-black p-0 relative min-w-[150px]">
                                <input 
                                  placeholder="Mestrado, Doutorado..."
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-center font-semibold focus:outline-none focus:bg-emerald-50" 
                                  value={row.nivel || ''} 
                                  onChange={(e) => handleDissertacoesChange(idx, 'nivel', e.target.value)} 
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_4_q10' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro A8.4.4.4 Número de Monografias Orientadas por Docente, Nível de Formação e Sexo
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => handleAddRow('docentesInvestigadoresMonografias')}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)] ml-2"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-sm border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold font-mono text-xs w-12">N ºde Ord.</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold">Monografias/docente</th>
                            <th className="p-2 text-center font-bold">Nivel</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesInvestigadoresMonografias?.map((row, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-2 text-center font-black bg-slate-50">{idx + 1}</td>
                              <td className="border-r-2 border-black p-0 relative min-w-[250px]">
                                <input 
                                  placeholder="Nome ou descrição..."
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-left font-semibold focus:outline-none focus:bg-emerald-50" 
                                  value={row.monografiasDocente || ''} 
                                  onChange={(e) => handleMonografiasChange(idx, 'monografiasDocente', e.target.value)} 
                                />
                              </td>
                              <td className="border-black p-0 relative min-w-[150px]">
                                <input 
                                  placeholder="Nível..."
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-center font-semibold focus:outline-none focus:bg-emerald-50" 
                                  value={row.nivel || ''} 
                                  onChange={(e) => handleMonografiasChange(idx, 'nivel', e.target.value)} 
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_4_q11' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro A8.4.4.5 Número de Teses Orientadas por Docente, Nível de Formação e Sexo
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => handleAddRow('docentesInvestigadoresTeses')}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)] ml-2"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-sm border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold font-mono text-xs w-12">N ºde Ord.</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold">Teses/docente</th>
                            <th className="p-2 text-center font-bold">Nivel</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.docentesInvestigadoresTeses?.map((row, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-2 text-center font-black bg-slate-50">{idx + 1}</td>
                              <td className="border-r-2 border-black p-0 relative min-w-[250px]">
                                <input 
                                  placeholder="Nome ou descrição..."
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-left font-semibold focus:outline-none focus:bg-emerald-50" 
                                  value={row.tesesDocente || ''} 
                                  onChange={(e) => handleTesesChange(idx, 'tesesDocente', e.target.value)} 
                                />
                              </td>
                              <td className="border-black p-0 relative min-w-[150px]">
                                <input 
                                  placeholder="Nível..."
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-center font-semibold focus:outline-none focus:bg-emerald-50" 
                                  value={row.nivel || ''} 
                                  onChange={(e) => handleTesesChange(idx, 'nivel', e.target.value)} 
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}
                {formSubTab === 'eixo_4_q12' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> A9. Pesquisas e Actividades de Extensão - Quadro A9.1 Número de Pesquisas
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => handleAddRow('pesquisasA91')}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)] ml-2"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-sm border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold font-mono text-xs w-12">Nº de Ord.</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold">Nºde Pesquisas em curso</th>
                            <th className="p-2 text-center font-bold">Pesquisas Concluídas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.pesquisasA91?.map((row, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-2 text-center font-black bg-slate-50">{idx + 1}</td>
                              <td className="border-r-2 border-black p-0 relative">
                                <input 
                                  type="number"
                                  min="0"
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-center font-bold focus:outline-none focus:bg-emerald-50" 
                                  value={row.emCurso || ''} 
                                  onChange={(e) => handlePesquisasA91Change(idx, 'emCurso', e.target.value)} 
                                />
                              </td>
                              <td className="border-black p-0 relative">
                                <input 
                                  type="number"
                                  min="0"
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-center font-bold focus:outline-none focus:bg-emerald-50" 
                                  value={row.concluidas || ''} 
                                  onChange={(e) => handlePesquisasA91Change(idx, 'concluidas', e.target.value)} 
                                />
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-slate-100 border-t-[3px] border-black">
                            <td className="border-r-2 border-black p-2 font-black">Total</td>
                            <td className="border-r-2 border-black p-2 text-center font-black">
                              {formData.pesquisasA91?.reduce((sum, row) => sum + (row.emCurso || 0), 0) || 0}
                            </td>
                            <td className="p-2 text-center font-black">
                              {formData.pesquisasA91?.reduce((sum, row) => sum + (row.concluidas || 0), 0) || 0}
                            </td>
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}
                
                {formSubTab === 'eixo_4_q13' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> A9. Pesquisas e Actividades de Extensão - Quadro A9.2 Actividades de Extensão
                      </h3>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-sm border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold">Acções de extensão/Produção</th>
                            <th className="p-2 text-center font-bold">Quantidade</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="border-r-2 border-black p-2 text-left bg-slate-50 font-semibold min-w-[300px]">Divulgação de actividade/ pesquisa na comunidade</td>
                            <td className="border-black p-0 relative min-w-[150px]">
                                <input 
                                  type="number"
                                  min="0"
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-center font-bold focus:outline-none focus:bg-emerald-50" 
                                  value={formData.actividadesExtensaoA92?.divulgacao || ''} 
                                  onChange={(e) => handleActividadesExtensaoA92Change('divulgacao', e.target.value)} 
                                />
                            </td>
                          </tr>
                          <tr className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="border-r-2 border-black p-2 text-left bg-slate-50 font-semibold min-w-[300px]">Prestação de serviços a comunidade</td>
                            <td className="border-black p-0 relative min-w-[150px]">
                                <input 
                                  type="number"
                                  min="0"
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-center font-bold focus:outline-none focus:bg-emerald-50" 
                                  value={formData.actividadesExtensaoA92?.prestacaoComunidade || ''} 
                                  onChange={(e) => handleActividadesExtensaoA92Change('prestacaoComunidade', e.target.value)} 
                                />
                            </td>
                          </tr>
                          <tr className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="border-r-2 border-black p-2 text-left bg-slate-50 font-semibold min-w-[300px]">Prestação de serviços a empresas</td>
                            <td className="border-black p-0 relative min-w-[150px]">
                                <input 
                                  type="number"
                                  min="0"
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-center font-bold focus:outline-none focus:bg-emerald-50" 
                                  value={formData.actividadesExtensaoA92?.prestacaoEmpresas || ''} 
                                  onChange={(e) => handleActividadesExtensaoA92Change('prestacaoEmpresas', e.target.value)} 
                                />
                            </td>
                          </tr>
                          <tr className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="border-r-2 border-black p-2 text-left bg-slate-50 font-semibold min-w-[300px]">Consultorias</td>
                            <td className="border-black p-0 relative min-w-[150px]">
                                <input 
                                  type="number"
                                  min="0"
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-center font-bold focus:outline-none focus:bg-emerald-50" 
                                  value={formData.actividadesExtensaoA92?.consultorias || ''} 
                                  onChange={(e) => handleActividadesExtensaoA92Change('consultorias', e.target.value)} 
                                />
                            </td>
                          </tr>
                          <tr className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="border-r-2 border-black p-2 text-left bg-slate-50 font-semibold min-w-[300px]">Inovações</td>
                            <td className="border-black p-0 relative min-w-[150px]">
                                <input 
                                  type="number"
                                  min="0"
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-center font-bold focus:outline-none focus:bg-emerald-50" 
                                  value={formData.actividadesExtensaoA92?.inovacoes || ''} 
                                  onChange={(e) => handleActividadesExtensaoA92Change('inovacoes', e.target.value)} 
                                />
                            </td>
                          </tr>
                          <tr className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="border-r-2 border-black p-2 text-left bg-slate-50 font-bold min-w-[300px]">Outras</td>
                            <td className="border-black p-0 relative min-w-[150px]">
                                <input 
                                  type="number"
                                  min="0"
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-center font-bold focus:outline-none focus:bg-emerald-50" 
                                  value={formData.actividadesExtensaoA92?.outras || ''} 
                                  onChange={(e) => handleActividadesExtensaoA92Change('outras', e.target.value)} 
                                />
                            </td>
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_4_q14' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex justify-between items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro A9.3 Número de actividades de extensão por nivel de formação
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => handleAddRow('actividadesExtensaoNivelA93')}
                        className="bg-[#fec107] text-black px-4 py-2 rounded-lg text-xs font-black border-2 border-black hover:bg-[#e0a800] shadow-[2px_2px_0px_rgba(0,0,0,1)] ml-2"
                      >
                        + Adicionar Linha
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-black shadow-sm">
                       <table className="w-full text-sm border-collapse bg-white whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th className="border-r-2 border-black p-2 text-center font-bold font-mono text-xs w-12">Nº de Ord.</th>
                            <th className="border-r-2 border-black p-2 text-center font-bold">Nível</th>
                            <th className="p-2 text-center font-bold">Quantidade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.actividadesExtensaoNivelA93?.map((row, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-2 text-center font-black bg-slate-50">{idx + 1}</td>
                              <td className="border-r-2 border-black p-0 relative min-w-[200px]">
                                <input 
                                  placeholder="Nível..."
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-left font-semibold focus:outline-none focus:bg-emerald-50" 
                                  value={row.nivel || ''} 
                                  onChange={(e) => handleActividadesExtensaoNivelA93Change(idx, 'nivel', e.target.value)} 
                                />
                              </td>
                              <td className="border-black p-0 relative min-w-[150px]">
                                <input 
                                  type="number"
                                  min="0"
                                  className="w-full h-full min-h-[36px] bg-transparent p-2 text-center font-bold focus:outline-none focus:bg-emerald-50" 
                                  value={row.quantidade || ''} 
                                  onChange={(e) => handleActividadesExtensaoNivelA93Change(idx, 'quantidade', e.target.value)} 
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_5_q1' && (
                  <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4 overflow-x-auto">
                    <div className="flex items-center mb-4 text-xs md:text-xs">
                      <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2 flex-grow flex items-center gap-1.5 uppercase tracking-tight text-sm">
                        <BookOpen className="h-4 w-4 text-emerald-700" /> Quadro B1. Número de CTA por nível de formação, sexo e regime de contratação
                      </h3>
                    </div>

                    <div className="rounded-xl border-2 border-black shadow-sm overflow-x-auto">
                       <table className="w-full text-sm border-collapse bg-white whitespace-nowrap min-w-[max-content]">
                        <thead>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th rowSpan={3} className="border-r-2 border-black p-2 text-center font-bold">Vínculo Contratual</th>
                            <th colSpan={27} className="p-2 text-center font-bold border-b-2 border-black">Nível de formação</th>
                          </tr>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            <th colSpan={3} className="border-r-2 border-gray-400 p-2 text-center font-bold">Todos</th>
                            <th colSpan={3} className="border-r-2 border-gray-400 p-2 text-center font-bold">Ensino Primário</th>
                            <th colSpan={6} className="border-r-2 border-gray-400 p-2 text-center font-bold">Ensino Secundário</th>
                            <th colSpan={3} className="border-r-2 border-gray-400 p-2 text-center font-bold">Bacharel</th>
                            <th colSpan={3} className="border-r-2 border-gray-400 p-2 text-center font-bold">Licenciado</th>
                            <th colSpan={3} className="border-r-2 border-gray-400 p-2 text-center font-bold">Mestre</th>
                            <th colSpan={3} className="border-r-2 border-gray-400 p-2 text-center font-bold">Pós Graduados</th>
                            <th colSpan={3} className="p-2 text-center font-bold">Doutorado</th>
                          </tr>
                          <tr className="bg-slate-200 border-b-2 border-black">
                            {/* Todos */}
                            <th className="border-r border-gray-300 p-2 text-center font-bold">Homens</th>
                            <th className="border-r border-gray-300 p-2 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-gray-400 p-2 text-center font-bold bg-slate-300">Total</th>
                            
                            {/* Ensino Primário */}
                            <th className="border-r border-gray-300 p-2 text-center font-bold">Homens</th>
                            <th className="border-r border-gray-300 p-2 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-gray-400 p-2 text-center font-bold bg-slate-300">Total</th>

                            {/* Ensino Secundário 1º Ciclo */}
                            <th colSpan={3} className="border-r border-gray-400 p-0 text-center font-bold">
                              <div className="border-b border-gray-400 p-1">1º Ciclo/ Equivalente</div>
                              <div className="flex border-t border-gray-200">
                                <div className="flex-1 border-r border-gray-300 p-1">Homens</div>
                                <div className="flex-1 border-r border-gray-300 p-1">Mulheres</div>
                                <div className="flex-1 p-1 bg-slate-300 font-bold">Total</div>
                              </div>
                            </th>
                            
                            {/* Ensino Secundário 2º Ciclo */}
                            <th colSpan={3} className="border-r-2 border-gray-400 p-0 text-center font-bold">
                              <div className="border-b border-gray-400 p-1">2º Ciclo/ Equivalente</div>
                              <div className="flex border-t border-gray-200">
                                <div className="flex-1 border-r border-gray-300 p-1">Homens</div>
                                <div className="flex-1 border-r border-gray-300 p-1">Mulheres</div>
                                <div className="flex-1 p-1 bg-slate-300 font-bold">Total</div>
                              </div>
                            </th>
                            
                            {/* Bacharel */}
                            <th className="border-r border-gray-300 p-2 text-center font-bold">Homens</th>
                            <th className="border-r border-gray-300 p-2 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-gray-400 p-2 text-center font-bold bg-slate-300">Total</th>
                            {/* Licenciado */}
                            <th className="border-r border-gray-300 p-2 text-center font-bold">Homens</th>
                            <th className="border-r border-gray-300 p-2 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-gray-400 p-2 text-center font-bold bg-slate-300">Total</th>
                            {/* Mestre */}
                            <th className="border-r border-gray-300 p-2 text-center font-bold">Homens</th>
                            <th className="border-r border-gray-300 p-2 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-gray-400 p-2 text-center font-bold bg-slate-300">Total</th>
                            {/* Pós Graduados */}
                            <th className="border-r border-gray-300 p-2 text-center font-bold">Homens</th>
                            <th className="border-r border-gray-300 p-2 text-center font-bold">Mulheres</th>
                            <th className="border-r-2 border-gray-400 p-2 text-center font-bold bg-slate-300">Total</th>
                            {/* Doutorado */}
                            <th className="border-r border-gray-300 p-2 text-center font-bold">Homens</th>
                            <th className="border-r border-gray-300 p-2 text-center font-bold">Mulheres</th>
                            <th className="p-2 text-center font-bold bg-slate-300">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.ctaB1?.map((row, idx) => (
                            <tr key={idx} className="border-b-2 border-slate-200 hover:bg-slate-50 transition-colors">
                              <td className="border-r-2 border-black p-2 text-center font-black bg-slate-50">{row.vinculoContratual}</td>
                              
                              {/* Todos */}
                              <td className="border-r border-gray-200 p-0 relative"><div className="w-12 h-full min-h-[36px] bg-slate-100 flex items-center justify-center font-bold">{row.todos?.homens || 0}</div></td>
                              <td className="border-r border-gray-200 p-0 relative"><div className="w-12 h-full min-h-[36px] bg-slate-100 flex items-center justify-center font-bold">{row.todos?.mulheres || 0}</div></td>
                              <td className="border-r-2 border-gray-400 p-0 relative"><div className="w-12 h-full min-h-[36px] bg-slate-200 flex items-center justify-center font-black">{row.todos?.total || 0}</div></td>
                              
                              {/* Fields mapping: level names -> keys used in handleCtaB1Change */}
                              {[
                                'ensinoPrimario', 
                                'ensinoSecundario1', 
                                'ensinoSecundario2', 
                                'bacharel', 
                                'licenciado', 
                                'mestre', 
                                'posGraduados', 
                                'doutorado'
                              ].map((lvl, k) => {
                                const isLastGroup = k === 7; // doutorado
                                const groupBorderClass = isLastGroup ? "border-r-0" : "border-r-2 border-gray-400";
                                const dKey = lvl as 'ensinoPrimario' | 'ensinoSecundario1' | 'ensinoSecundario2' | 'bacharel' | 'licenciado' | 'mestre' | 'posGraduados' | 'doutorado';
                                return (
                                  <React.Fragment key={lvl}>
                                    <td className="border-r border-gray-200 p-0 relative">
                                      <input type="number" min="0" className="w-[45px] h-full min-h-[36px] bg-transparent p-1 text-center font-mono focus:outline-none focus:bg-amber-100" value={row[dKey]?.homens || ''} onChange={(e) => handleCtaB1Change(idx, dKey, 'homens', e.target.value)} />
                                    </td>
                                    <td className="border-r border-gray-200 p-0 relative">
                                      <input type="number" min="0" className="w-[45px] h-full min-h-[36px] bg-transparent p-1 text-center font-mono focus:outline-none focus:bg-amber-100" value={row[dKey]?.mulheres || ''} onChange={(e) => handleCtaB1Change(idx, dKey, 'mulheres', e.target.value)} />
                                    </td>
                                    <td className={`${groupBorderClass} p-0 relative bg-slate-50`}>
                                      <div className="w-[45px] h-full min-h-[36px] flex items-center justify-center font-bold text-slate-700">{row[dKey]?.total || 0}</div>
                                    </td>
                                  </React.Fragment>
                                );
                              })}
                            </tr>
                          ))}

                          {/* Total Row */}
                          <tr className="bg-slate-300 border-t-4 border-black">
                            <td className="border-r-2 border-black p-2 text-center font-black">Total</td>
                            
                            {/* Todos */}
                            <td className="border-r border-gray-300 p-2 text-center font-bold">{formData.ctaB1?.reduce((sum, r) => sum + (r.todos?.homens || 0), 0) || 0}</td>
                            <td className="border-r border-gray-300 p-2 text-center font-bold">{formData.ctaB1?.reduce((sum, r) => sum + (r.todos?.mulheres || 0), 0) || 0}</td>
                            <td className="border-r-2 border-gray-400 p-2 text-center font-black text-black">{formData.ctaB1?.reduce((sum, r) => sum + (r.todos?.total || 0), 0) || 0}</td>
                            
                            {[
                                'ensinoPrimario', 
                                'ensinoSecundario1', 
                                'ensinoSecundario2', 
                                'bacharel', 
                                'licenciado', 
                                'mestre', 
                                'posGraduados', 
                                'doutorado'
                            ].map((lvl, k) => {
                              const isLastGroup = k === 7;
                              const groupBorderClass = isLastGroup ? "border-r-0" : "border-r-2 border-gray-400";
                              const dKey = lvl as 'ensinoPrimario' | 'ensinoSecundario1' | 'ensinoSecundario2' | 'bacharel' | 'licenciado' | 'mestre' | 'posGraduados' | 'doutorado';
                              return (
                                <React.Fragment key={lvl}>
                                  <td className="border-r border-gray-300 p-2 text-center font-bold">{formData.ctaB1?.reduce((sum, r) => sum + (r[dKey]?.homens || 0), 0) || 0}</td>
                                  <td className="border-r border-gray-300 p-2 text-center font-bold">{formData.ctaB1?.reduce((sum, r) => sum + (r[dKey]?.mulheres || 0), 0) || 0}</td>
                                  <td className={`${groupBorderClass} p-2 text-center font-black`}>{formData.ctaB1?.reduce((sum, r) => sum + (r[dKey]?.total || 0), 0) || 0}</td>
                                </React.Fragment>
                              );
                            })}
                          </tr>
                        </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {formSubTab === 'eixo_5_q2' && (
                  <TableB2 data={formData.ctaB2} onChange={handleCtaB2Change} onAddRow={handleAddCtaB2Row} />
                )}

                {formSubTab === 'eixo_5_q3' && (
                  <TableB3 data={formData.ctaB3} onChange={handleCtaB3Change} onAddRow={handleAddCtaB3Row} />
                )}

                {formSubTab === 'eixo_5_q4' && (
                  <TableB4 data={formData.ctaB4} onChange={handleCtaB4Change} onClasseIdadeChange={handleCtaB4ClasseIdadeChange} onAddRow={handleAddCtaB4Row} />
                )}

                {formSubTab === 'eixo_6_q1' && (
                  <TableDespesas data={formData.despesasIES} onChange={handleDespesasChange} />
                )}

                {formSubTab === 'eixo_6_q2' && (
                  <TableFinanciamento data={formData.financiamentoIES} onChange={handleFinanciamentoChange} />
                )}

                {formSubTab === 'eixo_6_q3' && (
                  <TableDespesaDetalhada data={formData.despesaFuncionamentoInvestimentoIES} onChange={handleDespesaDetalhadaChange} />
                )}

                {formSubTab === 'eixo_7_q1' && (
                  <TableLaboratorios data={formData.laboratoriosIES} onChange={handleLaboratoriosChange} institutionAbbrev={myInstitution?.abbreviation || 'IES'} targetYear={selectedYear} />
                )}

                {formSubTab === 'eixo_7_q2' && (
                  <TableSalasAula data={formData.salasAulaIES} onChange={handleSalasAulaChange} institutionAbbrev={myInstitution?.abbreviation || 'IES'} targetYear={selectedYear} />
                )}

                {formSubTab === 'eixo_7_q3' && (
                  <TableBibliotecas data={formData.bibliotecasIES} onChange={handleBibliotecasChange} institutionAbbrev={myInstitution?.abbreviation || 'IES'} targetYear={selectedYear} />
                )}

                {formSubTab === 'eixo_7_q4' && (
                  <TableComputadores data={formData.computadoresIES} onChange={handleComputadoresChange} institutionAbbrev={myInstitution?.abbreviation || 'IES'} targetYear={selectedYear} />
                )}

                {formSubTab === 'eixo_8_q1' && (
                  <TablePrevisaoEstudantes data={formData.previsaoEstudantesMatriculados} onChange={handlePrevisaoChange} instCourses={instCourses} selectedYear={selectedYear} institutionAbbrev={myInstitution?.abbreviation || 'IES'} />
                )}
              </form>
            )}

            {/* Sub-page Navigation and Saving Controls */}
            <div className="bg-white border-[3px] border-black rounded-[20px] p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => setFormSubTab('capa')}
                className="w-full sm:w-auto text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 py-2 justify-center cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Cancelar e Voltar sem Gravar
              </button>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {/* Quick Save Draft for this Section */}
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={submissionStatus === 'pending_central' || submissionStatus === 'approved'}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 border-[2px] border-black text-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
                >
                  <Save className="h-4 w-4 text-slate-600" /> Salvar Rascunho
                </button>

                {/* Next Section Button */}
                {ORDEM_QUADROS.includes(formSubTab as any) && ORDEM_QUADROS.indexOf(formSubTab as any) < ORDEM_QUADROS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = ORDEM_QUADROS.indexOf(formSubTab as any);
                      const nextType = ORDEM_QUADROS[currentIndex + 1];
                      // Auto-save current state as draft on proceed if compatible
                      if (submissionStatus !== 'pending_central' && submissionStatus !== 'approved') {
                        const id = submissionId || 'sub-' + currentUser.institutionId + '-' + selectedYear;
                        const newSub: Submission = {
                          id,
                          institutionId: currentUser.institutionId || '',
                          institutionName: currentUser.institutionName || 'Instituição Desconhecida',
                          province: currentUser.province || 'Luanda',
                          year: selectedYear,
                          data: formData,
                          status: 'draft',
                          sentToProvince: sentToProvince,
                          updatedAt: new Date().toISOString(),
                        };
                        onSaveSubmission(newSub);
                      }
                      setFormSubTab(nextType as any);
                      window.scrollTo(0, 0);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 bg-[#fec107] hover:bg-[#e0a800] text-black border-[2px] border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] text-xs  font-extrabold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    Gravar e Próximo Quadro
                    <ChevronRight className="h-4 w-4 stroke-[3]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isReadOnly) {
                        const id = submissionId || 'sub-' + currentUser.institutionId + '-' + selectedYear;
                        const newSub: Submission = {
                          id,
                          institutionId: currentUser.institutionId || '',
                          institutionName: currentUser.institutionName || 'Instituição Desconhecida',
                          province: currentUser.province || 'Luanda',
                          year: selectedYear,
                          data: formData,
                          status: 'draft',
                          sentToProvince: sentToProvince,
                          updatedAt: new Date().toISOString(),
                        };
                        onSaveSubmission(newSub);
                      }
                      setFormSubTab('capa');
                      window.scrollTo(0, 0);
                      if (!isReadOnly) {
                        alert('Rascunho de eixo guardado! Continue os outros eixos ou finalize a submissão global.');
                      }
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white border-[2px] border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] text-xs font-bold py-2.5 px-5 rounded-xl transition-all cursor-pointer"
                  >
                    {isReadOnly ? 'Voltar ao Menu Geral' : 'Gravar e Voltar ao Menu Geral'}
                    {isReadOnly ? <ArrowLeft className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )
      ) : (
        /* History lookup database & Recharts evolution */
        <IESHistoricoSubmissoes
          currentUser={currentUser}
          submissions={submissions}
          onLoadSubmissionToForm={(sub) => {
            loadHistoricalToForm(sub);
            setActiveTab('form');
          }}
          onGoToForm={() => setActiveTab('form')}
        />
      )}
      
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold mb-2 ">Gerir Cursos</h2>
            
            <div className="flex border-b border-gray-200 mb-4 text-xs font-bold">
              <button 
                type="button"
                onClick={() => setModalCourseTab('regulares')}
                className={`py-2 px-4 border-b-2 transition-colors ${modalCourseTab === 'regulares' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Cursos Regulares ({editableCourses.length})
              </button>
              <button 
                type="button"
                onClick={() => setModalCourseTab('curta')}
                className={`py-2 px-4 border-b-2 transition-colors ${modalCourseTab === 'curta' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Cursos Curta Duração ({editableShortCourses.length})
              </button>
            </div>

            {modalCourseTab === 'regulares' ? (
              <>
                <div className="max-h-60 overflow-y-auto mb-4 border rounded p-2">
                  {editableCourses.map((c, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-700">{c}</span>
                      <button onClick={() => setEditableCourses(editableCourses.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 text-xs">Remover</button>
                    </div>
                  ))}
                  {editableCourses.length === 0 && (
                    <div className="p-4 text-center text-gray-400 text-xs">Nenhum curso regular registado.</div>
                  )}
                </div>
                <input 
                  type="text" 
                  placeholder="Novo curso regular (Pressione Enter)..." 
                  className="w-full p-2 border rounded mb-4 text-sm "
                  onKeyPress={(e: any) => {
                      if(e.key === 'Enter') {
                          const val = e.target.value.trim();
                          if(val) {
                              setEditableCourses([...editableCourses, val]);
                              e.target.value = '';
                          }
                      }
                  }}
                />
              </>
            ) : (
              <>
                <div className="max-h-60 overflow-y-auto mb-4 border rounded p-2">
                  {editableShortCourses.map((c, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-700">{c}</span>
                      <button onClick={() => setEditableShortCourses(editableShortCourses.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 text-xs">Remover</button>
                    </div>
                  ))}
                  {editableShortCourses.length === 0 && (
                    <div className="p-4 text-center text-gray-400 text-xs">Nenhum curso de curta duração registado.</div>
                  )}
                </div>
                <input 
                  type="text" 
                  placeholder="Novo curso curta duração (Pressione Enter)..." 
                  className="w-full p-2 border rounded mb-4 text-sm "
                  onKeyPress={(e: any) => {
                      if(e.key === 'Enter') {
                          const val = e.target.value.trim();
                          if(val) {
                              setEditableShortCourses([...editableShortCourses, val]);
                              e.target.value = '';
                          }
                      }
                  }}
                />
              </>
            )}

            <button
               onClick={() => {
                   setShowCourseModal(false);
               }}
               className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-sm transition-colors shadow-md animate-fade-in"
            >
              Guardar e Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Validação Assistida por IA (Gemini) */}
      {showAIValidationModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAIValidationModal(false);
          }}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 relative">
            <button
              onClick={() => setShowAIValidationModal(false)}
              className="absolute top-4 right-4 z-50 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Fechar Painel (Esc)"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
            <AIValidationAssistant
              submissions={submissions}
              institutions={institutions}
              initialSubmissionId={submissionId || undefined}
              onClose={() => setShowAIValidationModal(false)}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
