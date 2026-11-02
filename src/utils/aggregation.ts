import { AcademicYearData, Submission } from '../types';

export const PROVINCE_REGIONS: Record<string, string> = {
  'Maputo Cidade': 'Sul',
  'Maputo Província': 'Sul',
  'Gaza': 'Sul',
  'Inhambane': 'Sul',
  'Sofala': 'Centro',
  'Manica': 'Centro',
  'Tete': 'Centro',
  'Zambézia': 'Centro',
  'Nampula': 'Norte',
  'Cabo Delgado': 'Norte',
  'Niassa': 'Norte'
};

export function aggregateSubmissions(subs: Submission[]): AcademicYearData {
  const dataList = subs.map(s => s.data).filter(Boolean) as AcademicYearData[];
  
  const aggregated: AcademicYearData = {
    studentsMale: 0,
    studentsFemale: 0,
    newAdmissionsMale: 0,
    newAdmissionsFemale: 0,
    graduatedMale: 0,
    graduatedFemale: 0,
    teachersFullTime: 0,
    teachersPartTime: 0,
    teachersWithBachelors: 0,
    teachersWithMasters: 0,
    teachersWithPhD: 0,
    teachersWithFullTitle: 0,
    staffMale: 0,
    staffFemale: 0,
    staffWithBachelors: 0,
    staffTrainingCount: 0,
    classroomsCount: 0,
    laboratoriesCount: 0,
    libraryCapcity: 0,
    computersWithInternet: 0,
    scientificPapersCount: 0,
    researchProjectsCount: 0,
    researchersCount: 0,
    researchersWithPhD: 0,
    researchersFullTime: 0,
    coursesProcuraES: [],
    coursesVagasPreenchidas: [],
    coursesEstudantesDinamica: [],
    nacionalidadeDinamica: {
      novosIngressosMocambicana: { homens: 0, mulheres: 0 },
      novosIngressosEstrangeira: { homens: 0, mulheres: 0 },
      matriculadosMocambicana: { homens: 0, mulheres: 0 },
      matriculadosEstrangeira: { homens: 0, mulheres: 0 },
      graduadosMocambicana: { homens: 0, mulheres: 0 },
      graduadosEstrangeira: { homens: 0, mulheres: 0 },
    },
    coursesEstudantesEstrangeiros: [],
    coursesNeedsEspeciais: [],
    coursesNeedsEspeciaisOutros: [],
    provinciaConclusao12Classe: [],
    provinciaNaturalidade: [],
    faixaEtaria: [],
    graduadosAnoPrimeiraMatricula: [],
    coursesCurtaDuracaoEspecializacao: [],
    coursesCurtaDuracaoEspecializacaoGraduados: [],
    estudantesBolseiros: [],
    estudantesBolseirosFaixaEtaria: [],
    estudantesBolseirosProvinciaNaturalidade: [],
    forecastStudents: 0,
    forecastTeachers: 0,
    budgetTotal: 0,
    budgetExecuted: 0,
    investmentResearch: 0,
    investmentInfrastructure: 0,
    auditRoomsCount: 0,
    internetFiberSpeed: 0,
    libraryBooksCount: 0,
    libraryDigitalSubscriptions: 0,
    customQuadros: {},
    docentesTempoInteiro: [],
    docentesGrupoEtario: [],
    docentesGrupoEtarioGrau: [],
    docentesAreaFormacao: [],
    docentesCursoFormacao: [],
    docentesRegimeCategoria: [],
    docentesRelacaoContractual: [],
    docentesInvestigadoresNacionalidade: [],
    docentesInvestigadoresNacionalidadeParcial: [],
    docentesInvestigadoresGrupoEtarioTi: [],
    docentesInvestigadoresGrupoEtarioTp: [],
    docentesInvestigadoresAreaFormacaoTi: [],
    docentesInvestigadoresAreaFormacaoTp: [],
    docentesInvestigadoresTCC: [],
    docentesInvestigadoresDissertacoes: [],
    docentesInvestigadoresMonografias: [],
    docentesInvestigadoresTeses: [],
    pesquisasA91: [],
    actividadesExtensaoA92: { divulgaçao: 0, prestacaoComunidade: 0, prestacaoEmpresas: 0, consultorias: 0, inovacoes: 0, outras: 0 } as any,
    actividadesExtensaoNivelA93: [],
    ctaB1: [],
    ctaB2: [],
    ctaB3: [],
    ctaB4: [],
    despesasIES: [],
    financiamentoIES: [],
    despesaFuncionamentoInvestimentoIES: [],
    laboratoriosIES: [],
    salasAulaIES: [],
    bibliotecasIES: [],
    computadoresIES: [],
    previsaoEstudantesMatriculados: []
  };

  dataList.forEach(d => {
    aggregated.studentsMale += Number(d.studentsMale) || 0;
    aggregated.studentsFemale += Number(d.studentsFemale) || 0;
    aggregated.newAdmissionsMale += Number(d.newAdmissionsMale) || 0;
    aggregated.newAdmissionsFemale += Number(d.newAdmissionsFemale) || 0;
    aggregated.graduatedMale += Number(d.graduatedMale) || 0;
    aggregated.graduatedFemale += Number(d.graduatedFemale) || 0;
    aggregated.teachersFullTime += Number(d.teachersFullTime) || 0;
    aggregated.teachersPartTime += Number(d.teachersPartTime) || 0;
    aggregated.teachersWithMasters += Number(d.teachersWithMasters) || 0;
    aggregated.teachersWithPhD += Number(d.teachersWithPhD) || 0;
    aggregated.researchProjectsCount += Number(d.researchProjectsCount) || 0;
    aggregated.scientificPapersCount += Number(d.scientificPapersCount) || 0;
    aggregated.budgetTotal += Number(d.budgetTotal) || 0;
    aggregated.budgetExecuted += Number(d.budgetExecuted) || 0;

    // Aggregating complex arrays (simplified mapping for this fix)
    if (d.docentesGrupoEtario && Array.isArray(d.docentesGrupoEtario)) {
       d.docentesGrupoEtario.forEach(row => {
         let existing = aggregated.docentesGrupoEtario!.find(r => r.classeIdade === row.classeIdade);
         if (!existing) {
           existing = { ...row, mocambicana: { ti: 0, tp: 0, total: 0 }, estrangeira: { ti: 0, tp: 0, total: 0 }, totalTI: 0, totalTP: 0, totalGeral: 0 };
           aggregated.docentesGrupoEtario!.push(existing);
         }
         if (row.mocambicana) {
           existing!.mocambicana.ti += Number(row.mocambicana.ti) || 0;
           existing!.mocambicana.tp += Number(row.mocambicana.tp) || 0;
           existing!.mocambicana.total = existing!.mocambicana.ti + existing!.mocambicana.tp;
         }
         if (row.estrangeira) {
           existing!.estrangeira.ti += Number(row.estrangeira.ti) || 0;
           existing!.estrangeira.tp += Number(row.estrangeira.tp) || 0;
           existing!.estrangeira.total = existing!.estrangeira.ti + existing!.estrangeira.tp;
         }
         existing!.totalTI = existing!.mocambicana.ti + existing!.estrangeira.ti;
         existing!.totalTP = existing!.mocambicana.tp + existing!.estrangeira.tp;
         existing!.totalGeral = existing!.mocambicana.total + existing!.estrangeira.total;
       });
    }

    if (d.despesasIES && Array.isArray(d.despesasIES)) {
      d.despesasIES.forEach(row => {
        let existing = aggregated.despesasIES!.find(r => r.rubrica === row.rubrica);
        if (!existing) {
          existing = { rubrica: row.rubrica, valor: 0 };
          aggregated.despesasIES!.push(existing);
        }
        existing!.valor += Number(row.valor) || 0;
      });
    }

    if (d.financiamentoIES && Array.isArray(d.financiamentoIES)) {
      d.financiamentoIES.forEach(row => {
        let existing = aggregated.financiamentoIES!.find(r => r.fonte === row.fonte);
        if (!existing) {
          existing = { fonte: row.fonte, valor: 0 };
          aggregated.financiamentoIES!.push(existing);
        }
        existing!.valor += Number(row.valor) || 0;
      });
    }

    if (d.despesaFuncionamentoInvestimentoIES && Array.isArray(d.despesaFuncionamentoInvestimentoIES)) {
      d.despesaFuncionamentoInvestimentoIES.forEach(row => {
        let existing = aggregated.despesaFuncionamentoInvestimentoIES!.find(r => r.categoria === row.categoria);
        if (!existing) {
          existing = { categoria: row.categoria, valor: 0 };
          aggregated.despesaFuncionamentoInvestimentoIES!.push(existing);
        }
        existing!.valor += Number(row.valor) || 0;
      });
    }

    if (d.laboratoriosIES && Array.isArray(d.laboratoriosIES)) {
      d.laboratoriosIES.forEach(row => {
        let existing = aggregated.laboratoriosIES!.find(r => r.especialidade === row.especialidade && r.provincia === row.provincia && r.distrito === row.distrito);
        if (!existing) {
          existing = { ...row, numLaboratorios: 0 };
          aggregated.laboratoriosIES!.push(existing);
        }
        existing!.numLaboratorios += Number(row.numLaboratorios) || 0;
      });
    }

    if (d.salasAulaIES && Array.isArray(d.salasAulaIES)) {
      d.salasAulaIES.forEach(row => {
        let existing = aggregated.salasAulaIES!.find(r => r.unidadeOrganica === row.unidadeOrganica && r.provincia === row.provincia && r.distrito === row.distrito);
        if (!existing) {
          existing = { ...row, numSalas: 0 };
          aggregated.salasAulaIES!.push(existing);
        }
        existing!.numSalas += Number(row.numSalas) || 0;
      });
    }

    if (d.bibliotecasIES && Array.isArray(d.bibliotecasIES)) {
      d.bibliotecasIES.forEach(row => {
        let existing = aggregated.bibliotecasIES!.find(r => r.unidadeOrganica === row.unidadeOrganica && r.provincia === row.provincia && r.distrito === row.distrito);
        if (!existing) {
          existing = { ...row, numFisicas: 0, numVirtuais: 0 };
          aggregated.bibliotecasIES!.push(existing);
        }
        existing!.numFisicas += Number(row.numFisicas) || 0;
        existing!.numVirtuais += Number(row.numVirtuais) || 0;
      });
    }

    if (d.computadoresIES && Array.isArray(d.computadoresIES)) {
      d.computadoresIES.forEach(row => {
        let existing = aggregated.computadoresIES!.find(r => r.unidadeOrganica === row.unidadeOrganica && r.provincia === row.provincia && r.distrito === row.distrito);
        if (!existing) {
          existing = { ...row, numComputadores: 0, numFuncionamento: 0, numNaoFuncionamento: 0 };
          aggregated.computadoresIES!.push(existing);
        }
        existing!.numComputadores += Number(row.numComputadores) || 0;
        existing!.numFuncionamento += Number(row.numFuncionamento) || 0;
        existing!.numNaoFuncionamento += Number(row.numNaoFuncionamento) || 0;
      });
    }

    if (d.previsaoEstudantesMatriculados && Array.isArray(d.previsaoEstudantesMatriculados)) {
      d.previsaoEstudantesMatriculados.forEach(row => {
        let existing = aggregated.previsaoEstudantesMatriculados!.find(r => r.nomeCurso === row.nomeCurso && r.provincia === row.provincia && r.grau === row.grau && r.regimeCurso === row.regimeCurso);
        if (!existing) {
          existing = { ...row, homens: 0, mulheres: 0, total: 0 };
          aggregated.previsaoEstudantesMatriculados!.push(existing);
        }
        existing!.homens += Number(row.homens) || 0;
        existing!.mulheres += Number(row.mulheres) || 0;
        existing!.total = existing!.homens + existing!.mulheres;
      });
    }
  });

  return aggregated;
}
