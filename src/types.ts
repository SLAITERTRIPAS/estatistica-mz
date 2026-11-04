export type UserRole = 'nacional' | 'central' | 'regional' | 'provincial' | 'ies' | 'FocalPoint' | 'OrgaoMaximoIES' | 'RepresentanteProvincial' | 'RepresentanteRegional' | 'sistema' | 'Ministerial' | 'ies_interno';

export interface User {
  id: string;
  name: string;
  email: string; // Will store Username/NUI for custom users
  nuit?: string;
  numBI?: string;
  personalEmail?: string;
  optionalEmail?: string;
  role: UserRole;
  province?: string; // Required for provincial and ies roles
  region?: 'Sul' | 'Centro' | 'Norte' | string; // Required for regional roles
  institutionId?: string; // Required for 'ies' role
  institutionName?: string; // Cached for helper displays
  affectedByNational?: boolean; // Set by national admin
  accountStatus?: 'pending' | 'active' | 'suspended';
  assignedEixo?: string; // e.g. "Eixo 1" or "Eixo 3"
  eixoStatus?: 'draft' | 'sent_to_focal_point' | 'approved';
  createdBy?: string; // Add field to track creator
  cargo?: string; // Add department/cargo field
  isOwner?: boolean;
  isProgrammer?: boolean;
  efetivo?: boolean;
  systemId?: string;
  photoURL?: string;
  logoUrl?: string;
  signatureUrl?: string;
  signaturePin?: string; // 6-digit PIN code for rector/user signature security
}

export interface Institution {
  id: string;
  name: string;
  province: string;
  district?: string;
  rector: string;
  type: 'Pública' | 'Privada';
  courses?: string[];
  shortCourses?: string[];
  abbreviation: string;
  logoUrl?: string;
  startYear?: number;
  nuit?: string;
  address?: string;
  website?: string;
  contact?: string;
  email?: string;
  anoInicio?: number;
  responsavel?: {
    nome: string;
    funcao: string;
    contacto: string;
    email: string;
  };
  focalPoint?: {
    nome: string;
    funcao: string;
    contacto: string;
    email: string;
  };
  delegacoes?: Array<{
    id: string;
    nome: string;
    tipo: 'Delegacao' | 'Extensao';
    provincia: string;
    distrito: string;
    endereco: string;
    contacto: string;
  }>;
}

export interface Province {
  id: string;
  name: string;
  region: string;
}

export interface StandardDocument {
  id: string;
  title: string;
  category: 'Estudantes' | 'Docentes' | 'Infraestrutura' | 'Geral';
  description: string;
  fileSize: string;
  lastUpdated: string;
  downloadUrl: string;
}

export interface AcademicYearData {
  // Students
  studentsMale: number;
  studentsFemale: number;
  newAdmissionsMale: number;
  newAdmissionsFemale: number;
  graduatedMale: number;
  graduatedFemale: number;
  
  // Teaching Staff
  teachersFullTime: number;
  teachersPartTime: number;
  teachersWithBachelors: number;
  teachersWithMasters: number;
  teachersWithPhD: number;
  teachersWithFullTitle: number;

  // Technical / Administrative Staff (CTA)
  staffMale: number;
  staffFemale: number;
  staffWithBachelors: number;
  staffTrainingCount: number;
  
  // Infrastructure
  classroomsCount: number;
  laboratoriesCount: number;
  libraryCapcity: number;
  computersWithInternet: number;
  
  // Research
  scientificPapersCount: number;
  researchProjectsCount: number;

  // New Fields for expanded tabs (Investigadores, Previsão N+1, Finanças, Infraestrutura, TIC, Biblioteca)
  // 4. Investigadores
  researchersCount?: number;
  researchersWithPhD?: number;
  researchersFullTime?: number;

  // 1.1 Procuram Ensino Superior
  coursesProcuraES?: Array<{
    nomeCurso: string;
    duracaoAnos: number;
    nacionalidade: string;
    provincia: string;
    distrito: string;
    iscedArea: string;
    iscedSubArea: string;
    regimeCurso: string;
    grau: string;
    homens: number;
    mulheres: number;
  }>;

  // 1.2 Vagas Preenchidas
  coursesVagasPreenchidas?: Array<{
    nomeCurso: string;
    duracaoAnos: number;
    iscedArea: string;
    iscedSubArea: string;
    regimeCurso: string;
    grau: string;
    vagasExistentes?: number;
    vagasPreenchidas: number;
    vagasNaoPreenchidas: number;
    nacionalidade: string;
    provincia: string;
    distrito: string;
  }>;

  // 1.3 Estudantes Dinâmica (Novos, Matriculados, Graduados)
  coursesEstudantesDinamica?: Array<{
    nomeCurso: string;
    duracaoAnos: number;
    iscedArea: string;
    iscedSubArea: string;
    regimeCurso: string;
    provincia: string;
    distrito: string;
    grau: string;
    novosIngressosHomens: number;
    novosIngressosMulheres: number;
    matriculadosHomens: number;
    matriculadosMulheres: number;
    graduadosHomens: number;
    graduadosMulheres: number;
  }>;

  // 1.4 Dinâmica por Nacionalidade
  nacionalidadeDinamica?: {
    novosIngressosMocambicana: { homens: number; mulheres: number };
    novosIngressosEstrangeira: { homens: number; mulheres: number };
    matriculadosMocambicana: { homens: number; mulheres: number };
    matriculadosEstrangeira: { homens: number; mulheres: number };
    graduadosMocambicana: { homens: number; mulheres: number };
    graduadosEstrangeira: { homens: number; mulheres: number };
  };

  // 1.5 Estudantes Estrangeiros por Curso
  coursesEstudantesEstrangeiros?: Array<{
    nomeCurso: string;
    iscedArea: string;
    iscedSubArea: string;
    regimeCurso: string;
    paisProveniencia: string;
    grau: string;
    novosIngressosHomens: number;
    novosIngressosMulheres: number;
    matriculadosHomens: number;
    matriculadosMulheres: number;
    graduadosHomens: number;
    graduadosMulheres: number;
  }>;

  // 1.6 Estudantes com Necessidades Especiais
  coursesNeedsEspeciais?: Array<{
    nomeCurso: string;
    iscedArea: string;
    iscedSubArea: string;
    regimeCurso: string;
    provincia: string;
    distrito: string;
    grau: string;
    cadeirantes: { homens: number; mulheres: number; total: number };
    visual: { homens: number; mulheres: number; total: number };
    auditiva: { homens: number; mulheres: number; total: number };
    outros: { homens: number; mulheres: number; total: number };
  }>;

  // 1.7 Outras Necessidades Especiais
  coursesNeedsEspeciaisOutros?: Array<{
    nomeCurso: string;
    iscedArea: string;
    iscedSubArea: string;
    regimeCurso: string;
    provincia: string;
    distrito: string;
    grau: string;
    tipoNecessidade: string;
    homens: number;
    mulheres: number;
    total: number;
  }>;

  // 1.8 Número de Novos Ingressos, Matriculados e Graduados por Sexo e Província de conclusão
  provinciaConclusao12Classe?: Array<{
    provincia: string;
    novosIngressos: { homens: number; mulheres: number; total: number };
    matriculados: { homens: number; mulheres: number; total: number };
    graduados: { homens: number; mulheres: number; total: number };
  }>;

  // 1.9 Número de Novos Ingressos, Matriculados e Graduados por Sexo e Província de Naturalidade
  provinciaNaturalidade?: Array<{
    provincia: string;
    novosIngressos: { homens: number; mulheres: number; total: number };
    matriculados: { homens: number; mulheres: number; total: number };
    graduados: { homens: number; mulheres: number; total: number };
  }>;

  // 1.10 Número de Novos Ingressos, Matriculados e Graduados por Sexo e Faixa Etária
  faixaEtaria?: Array<{
    classeIdade: string;
    novosIngressos: { homens: number; mulheres: number; total: number };
    matriculados: { homens: number; mulheres: number; total: number };
    graduados: { homens: number; mulheres: number; total: number };
  }>;

  // 1.11 Graduados por ano de primeira matrícula
  graduadosAnoPrimeiraMatricula?: Array<{
    nomeCurso?: string;
    iscedArea?: string;
    iscedSubArea?: string;
    regimeCurso?: string;
    anoMobilidade?: string;
    provincia?: string;
    distrito?: string;
    duracao?: string;
    grau?: string;
    antesDe2018?: number;
    ano2018?: number;
    ano2019?: number;
    ano2020?: number;
    ano2021?: number;
    ano2022?: number;
    ano2023?: number;
    ano2024?: number;
    ano2025?: number;
  }>;

  // 1.12 Cursos de curta duração e ou Especialização por Grau e Sexo - Matriculados
  coursesCurtaDuracaoEspecializacao?: Array<{
    nomeCurso?: string;
    iscedArea?: string;
    iscedSubArea?: string;
    regimeCurso?: string;
    provincia?: string;
    distrito?: string;
    duracaoMeses?: string;
    grau?: string;
    homens?: number;
    mulheres?: number;
    total?: number;
  }>;

  // 1.13 Número de Estudantes Desistentes, Óbito ou que Anularam Matrícula Por Curso e Sexo
  coursesCurtaDuracaoEspecializacaoGraduados?: Array<{
    nomeCurso?: string;
    iscedArea?: string;
    iscedSubArea?: string;
    regimeCurso?: string;
    provincia?: string;
    distrito?: string;
    causas?: string;
    grau?: string;
    homens?: number;
    mulheres?: number;
    total?: number;
  }>;

  // 1.14. Número de Estudantes Bolseiros por Curso, Sexo, tipo de Bolsa e Financiador
  estudantesBolseiros?: Array<{
    nomeCurso: string;
    iscedArea: string;
    iscedSubArea: string;
    regimeCurso: string;
    paisProveniencia: string;
    tipoBolsa: string;
    financiador: string;
    grau: string;
    nacionalidade: string;
    provincia: string;
    novosIngressos: { homens: number; mulheres: number; total: number };
    matriculados: { homens: number; mulheres: number; total: number };
    graduados: { homens: number; mulheres: number; total: number };
  }>;

  // 1.15. Número de Estudantes Bolseiros, Novos Ingressos, Matriculados e Graduados por Sexo e Faixa Etária
  estudantesBolseirosFaixaEtaria?: Array<{
    faixaEtaria: string;
    novosIngressos: { homens: number; mulheres: number; total: number };
    matriculados: { homens: number; mulheres: number; total: number };
    graduados: { homens: number; mulheres: number; total: number };
  }>;

  // 1.16 Número de Estudantes Bolseiros, Novos Ingressos, Matriculados e Graduados por Sexo e Província de Naturalidade
  estudantesBolseirosProvinciaNaturalidade?: Array<{
    provinciaNaturalidade: string;
    novosIngressos: { homens: number; mulheres: number; total: number };
    matriculados: { homens: number; mulheres: number; total: number };
    graduados: { homens: number; mulheres: number; total: number };
  }>;

  // 5. Previsão N+1
  forecastStudents?: number;
  forecastTeachers?: number;

  // 6. Finanças adicionais
  budgetTotal?: number;
  budgetExecuted?: number;
  investmentResearch?: number;
  investmentInfrastructure?: number;

  // 7. Infraestrutura adicional
  auditRoomsCount?: number;

  // 8. TIC adicional
  internetFiberSpeed?: number;

  // 9. Biblioteca adicional
  libraryBooksCount?: number;
  libraryDigitalSubscriptions?: number;
  customQuadros?: Record<string, any[]>;

  // Quadro A1: Numero de Docentes por Província, Regime de Contratação, Grau e Sexo (Tempo Inteiro)
  docentesTempoInteiro?: Array<{
    provincia: string;
    distrito: string;
    nacionalidadePais: string;
    regime: string;
    licenciado: { homens: number, mulheres: number, total: number };
    mestre: { homens: number, mulheres: number, total: number };
    posGraduacao: { homens: number, mulheres: number, total: number };
    doutorado: { homens: number, mulheres: number, total: number };
    todos: { homens: number, mulheres: number, total: number };
  }>;

  // Quadro A2: Número de Docentes por grupo etário, nacionalidade e regime de contratação
  docentesGrupoEtario?: Array<{
    classeIdade: string;
    mocambicana: { ti: number; tp: number; total: number };
    estrangeira: { ti: number; tp: number; total: number };
    totalTI: number;
    totalTP: number;
    totalGeral: number;
  }>;

  // Quadro A3: Número de Docentes por grupo etário, grau e regime de contratação
  docentesGrupoEtarioGrau?: Array<{
    classeIdade: string;
    licenciado: { homens: number; mulheres: number; total: number };
    mestre: { homens: number; mulheres: number; total: number };
    doutorado: { homens: number; mulheres: number; total: number };
    todos: { homens: number; mulheres: number; total: number };
  }>;

  // Quadro A4: Número de docentes por Área de Formação segundo UNESCO, por Grau e Sexo
  docentesAreaFormacao?: Array<{
    area: string;
    licenciado: { homens: number; mulheres: number; total: number };
    mestre: { homens: number; mulheres: number; total: number };
    posGraduacao: { homens: number; mulheres: number; total: number };
    doutorado: { homens: number; mulheres: number; total: number };
    todos: { homens: number; mulheres: number; total: number };
  }>;

  // Quadro A5: Número de docentes por Curso de Formação, Grau e Sexo
  docentesCursoFormacao?: Array<{
    curso: string;
    licenciado: { homens: number; mulheres: number; total: number };
    mestre: { homens: number; mulheres: number; total: number };
    posGraduacao: { homens: number; mulheres: number; total: number };
    doutorado: { homens: number; mulheres: number; total: number };
    todos: { homens: number; mulheres: number; total: number };
  }>;

  // Quadro A6: Número de Docentes por Regime de Contratação, Categoria e Sexo
  docentesRegimeCategoria?: Array<{
    regime: string;
    assistenteEstagiario: { homens: number; mulheres: number; total: number };
    assistente: { homens: number; mulheres: number; total: number };
    professorAuxiliar: { homens: number; mulheres: number; total: number };
    professorAssociado: { homens: number; mulheres: number; total: number };
    professorCatedratico: { homens: number; mulheres: number; total: number };
    todos: { homens: number; mulheres: number; total: number };
  }>;

  // Quadro A7: Número de Docentes por tipo de relação contratual, nível de formação e sexo
  docentesRelacaoContractual?: Array<{
    relacaoContractual: string;
    licenciado: { homens: number; mulheres: number; total: number };
    mestre: { homens: number; mulheres: number; total: number };
    doutorado: { homens: number; mulheres: number; total: number };
    todos: { homens: number; mulheres: number; total: number };
  }>;

  // Quadro A8.1: Número de Investigadores a tempo inteiro por nacionalidade, nível de formação e sexo
  docentesInvestigadoresNacionalidade?: Array<{
    nacionalidade: string;
    licenciatura: { homens: number; mulheres: number; total: number };
    mestrado: { homens: number; mulheres: number; total: number };
    doutoramento: { homens: number; mulheres: number; total: number };
    posGraduacao: { homens: number; mulheres: number; total: number };
    todos: {                  homens: number; mulheres: number; total: number };
  }>;

  // Quadro A8.2: Número de Investigadores a tempo parcial por nacionalidade, nível de formação e sexo
  docentesInvestigadoresNacionalidadeParcial?: Array<{
    nacionalidade: string;
    licenciatura: { homens: number; mulheres: number; total: number };
    mestrado: { homens: number; mulheres: number; total: number };
    doutoramento: { homens: number; mulheres: number; total: number };
    posGraduacao: { homens: number; mulheres: number; total: number };
    todos: { homens: number; mulheres: number; total: number };
  }>;

  // Quadro A8.4.1: Número de investigadores a tempo inteiro por grupo etário, nacionalidade e sexo
  docentesInvestigadoresGrupoEtarioTi?: Array<{
    classeIdade: string;
    mocambicanos: { homens: number; mulheres: number; total: number };
    estrangeiros: { homens: number; mulheres: number; total: number };
    total: { homens: number; mulheres: number; total: number };
  }>;

  // Quadro A8.4.2: Número de Investigadores a tempo parcial por grupo etário, nacionalidade e sexo
  docentesInvestigadoresGrupoEtarioTp?: Array<{
    classeIdade: string;
    mocambicanos: { homens: number; mulheres: number; total: number };
    estrangeiros: { homens: number; mulheres: number; total: number };
    total: { homens: number; mulheres: number; total: number };
  }>;

  // Quadro A8.4.4: Número de investigadores a tempo inteiro por área de formação, sexo e nacionalidade
  docentesInvestigadoresAreaFormacaoTi?: Array<{
    area: string;
    mocambicanos: { homens: number; mulheres: number; total: number };
    estrangeiros: { homens: number; mulheres: number; total: number };
  }>;

  // Quadro A8.4.4.1: Número de investigadores a tempo parcial por área de formação, sexo e nacionalidade
  docentesInvestigadoresAreaFormacaoTp?: Array<{
    area: string;
    mocambicanos: { homens: number; mulheres: number; total: number };
    estrangeiros: { homens: number; mulheres: number; total: number };
  }>;

  // Quadro A8.4.4.2: Trabalhos de Conclusão do Curso
  docentesInvestigadoresTCC?: Array<{
    conclusaoDocente: string;
    nivel: string;
  }>;

  // Quadro A8.4.4.3: Número de Dissertações Orientadas por Docente, Nível de Formação e Sexo
  docentesInvestigadoresDissertacoes?: Array<{
    dissertacoesDocente: string;
    nivel: string;
  }>;

  // Quadro A8.4.4.4: Número de Monografias Orientadas por Docente, Nível de Formação e Sexo
  docentesInvestigadoresMonografias?: Array<{
    monografiasDocente: string;
    nivel: string;
  }>;

  // Quadro A8.4.4.5: Número de Teses Orientadas por Docente, Nível de Formação e Sexo
  docentesInvestigadoresTeses?: Array<{
    tesesDocente: string;
    nivel: string;
  }>;

  // Quadro A9.1: Número de Pesquisas
  pesquisasA91?: Array<{
    emCurso: number;
    concluidas: number;
  }>;

  // Quadro A9.2: Actividades de Extensão
  actividadesExtensaoA92?: {
    divulgacao: number;
    prestacaoComunidade: number;
    prestacaoEmpresas: number;
    consultorias: number;
    inovacoes: number;
    outras: number;
  };

  // Quadro A9.3: Número de actividades de extensão por nivel de formação
  actividadesExtensaoNivelA93?: Array<{
    nivel: string;
    quantidade: number;
  }>;

  // Quadro B1: Qualificação Académica do Pessoal Técnico e Administrativo por Sexo
  ctaB1?: Array<{
    vinculoContratual: string; // 'Tempo Inteiro', 'Tempo parcial'
    ensinoPrimario: { homens: number; mulheres: number; total: number };
    ensinoSecundario1: { homens: number; mulheres: number; total: number }; // 1º Ciclo/ Equivalente
    ensinoSecundario2: { homens: number; mulheres: number; total: number }; // 2º Ciclo/ Equivalente
    bacharel: { homens: number; mulheres: number; total: number };
    licenciado: { homens: number; mulheres: number; total: number };
    mestre: { homens: number; mulheres: number; total: number };
    posGraduados: { homens: number; mulheres: number; total: number };
    doutorado: { homens: number; mulheres: number; total: number };
    todos: { homens: number; mulheres: number; total: number };
  }>;

  // Quadro B2: Número de CTA a tempo parcial por nível de formação e nacionalidade e Sexo
  ctaB2?: Array<{
    nacionalidade: string; // 'Moçambicana', 'Estrangeira'
    ensinoPrimario: { homens: number; mulheres: number; total: number };
    ensinoSecundario1: { homens: number; mulheres: number; total: number }; // 1º Ciclo/ Equivalente
    ensinoSecundario2: { homens: number; mulheres: number; total: number }; // 2º Ciclo/ Equivalente
    bacharel: { homens: number; mulheres: number; total: number };
    licenciado: { homens: number; mulheres: number; total: number };
    mestre: { homens: number; mulheres: number; total: number };
    posGraduados: { homens: number; mulheres: number; total: number };
    doutorado: { homens: number; mulheres: number; total: number };
    todos: { homens: number; mulheres: number; total: number };
  }>;

  // Quadro B3: Número de CTA por tipo de relação contratual, nível de formação e sexo
  ctaB3?: Array<{
    tipoRelacao: string; // 'Pertence ao quadro', 'Não pertence ao quadro'
    ensinoPrimario: { homens: number; mulheres: number; total: number };
    ensinoSecundario1: { homens: number; mulheres: number; total: number }; // 1º Ciclo/ Equivalente
    ensinoSecundario2: { homens: number; mulheres: number; total: number }; // 2º Ciclo/ Equivalente
    bacharel: { homens: number; mulheres: number; total: number };
    licenciado: { homens: number; mulheres: number; total: number };
    mestre: { homens: number; mulheres: number; total: number };
    posGraduados: { homens: number; mulheres: number; total: number };
    doutorado: { homens: number; mulheres: number; total: number };
    todos: { homens: number; mulheres: number; total: number };
  }>;

  // Quadro B4: Número de CTA por grupo etário, nacionalidade e regime de contratação
  ctaB4?: Array<{
    classeIdade: string;
    mocambicana: { ti: number; tp: number; total: number };
    estrangeira: { ti: number; tp: number; total: number };
    totalTI: number;
    totalTP: number;
    totalGeral: number;
  }>;

  // Quadro 1: Recursos Financeiros - Despesas na IES
  despesasIES?: Array<{
    rubrica: string;
    valor: number;
  }>;

  // Quadro 2: Recursos Financeiros - Financiamento da instituição por fonte
  financiamentoIES?: Array<{
    fonte: string;
    valor: number;
  }>;

  // Quadro 3: Recursos Financeiros - Despesa para funcionamento e investimento
  despesaFuncionamentoInvestimentoIES?: Array<{
    categoria: string;
    valor: number;
  }>;

  // Eixo 7: Infraestrutura - Quadro D. 1.1 Número de Laboratórios em funcionamento
  laboratoriosIES?: Array<{
    especialidade: string;
    area: string;
    subarea: string;
    provincia: string;
    distrito: string;
    numLaboratorios: number;
  }>;

  // Eixo 7: Infraestrutura - Quadro D. 1.2 Número de salas de aula
  salasAulaIES?: Array<{
    unidadeOrganica: string;
    provincia: string;
    distrito: string;
    grau: string;
    numSalas: number;
  }>;

  // Eixo 7: Infraestrutura - Quadro D. 1.3 Número de Bibliotecas em funcionamento
  bibliotecasIES?: Array<{
    unidadeOrganica: string;
    provincia: string;
    distrito: string;
    numFisicas: number;
    numVirtuais: number;
  }>;

  // Eixo 7: Infraestrutura - Quadro D. 1.4 Número de computadores disponíveis para estudantes
  computadoresIES?: Array<{
    unidadeOrganica: string;
    provincia: string;
    distrito: string;
    numComputadores: number;
    numFuncionamento: number; // F
    numNaoFuncionamento: number; // nF
  }>;

  // Eixo 8: Previsão / Preliminar - Previsão de estudantes matriculados por curso, grau e sexo para o ano N+1
  previsaoEstudantesMatriculados?: Array<{
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
  }>;
}

export interface Submission {
  id: string;
  institutionId: string;
  institutionName: string;
  province: string;
  year: number;
  data: AcademicYearData;
  status: 'draft' | 'pending_orgao_maximo' | 'signed_focal_point' | 'pending_central' | 'approved' | 'rejected';
  sentToProvince: boolean;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string; // Review feedback
  updatedAt: string;
  signedByOrgaoMaximo?: boolean;
  signedAt?: string;
  signedByName?: string;
  eixosStatus?: Record<string, 'draft' | 'sent_to_focal_point' | 'approved'>;
  eixosSubmittedBy?: Record<string, string>; // user id or name who sent
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details: string;
}
