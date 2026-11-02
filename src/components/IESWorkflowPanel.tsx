import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  PenTool, 
  Check, 
  CornerUpLeft, 
  UserCheck, 
  Users, 
  FileText, 
  Lock,
  Save,
  HelpCircle
} from 'lucide-react';
import { User, Submission, AcademicYearData } from '../types';
import { PROVINCE_REGIONS } from '../utils/aggregation';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

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

const EIXO_LABELS: Record<string, string> = {
  'Eixo 1': 'Eixo I: Identificação da Entidade',
  'Eixo 2': 'Eixo II: Estatística sobre Corpo Discente',
  'Eixo 3': 'Eixo III: Corpo Docente',
  'Eixo 4': 'Eixo IV: Investigadores, Pesquisa e Extensão',
  'Eixo 5': 'Eixo V: Corpo Técnico Administrativo (CTA)',
  'Eixo 6': 'Eixo VI: Recursos Financeiros',
  'Eixo 7': 'Eixo VII: Infraestrutura, TIC e Bibliotecas',
  'Eixo 8': 'Eixo VIII: Previsão de Estudantes e Vagas',
};

interface IESWorkflowPanelProps {
  currentUser: User;
  selectedYear: number;
  formData: AcademicYearData;
  submissionStatus: Submission['status'] | 'not_created';
  submissionId: string | null;
  onSaveSubmission: (sub: Submission) => void;
  onRefreshData?: () => void;
}

export default function IESWorkflowPanel({
  currentUser,
  selectedYear,
  formData,
  submissionStatus,
  submissionId,
  onSaveSubmission,
  onRefreshData,
}: IESWorkflowPanelProps) {
  const [internalUsers, setInternalUsers] = useState<User[]>([]);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState<string>('');
  const [isSigning, setIsSigning] = useState(false);
  const [orgaoMaximoName, setOrgaoMaximoName] = useState('');
  const [submissionCopies, setSubmissionCopies] = useState<any[]>([]);
  const [iesRectorUser, setIesRectorUser] = useState<User | null>(null);

  // Load submission copies from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('stat_submission_copies');
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter(
          (c: any) => c.institutionId === currentUser.institutionId && c.year === selectedYear
        );
        setSubmissionCopies(filtered);
      } else {
        setSubmissionCopies([]);
      }
    } catch (e) {
      console.error('Error loading submission copies', e);
    }
  }, [currentUser.institutionId, selectedYear, currentSubmission]);

  // Load rector user for this institution
  useEffect(() => {
    try {
      const stored = localStorage.getItem('stat_registered_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        const allUsers: User[] = parsed.map((item: any) => item.user).filter(Boolean);
        const foundRector = allUsers.find(
          u => u.institutionId === currentUser.institutionId && u.role === 'OrgaoMaximoIES'
        );
        if (foundRector) {
          setIesRectorUser(foundRector);
        } else {
          setIesRectorUser(null);
        }
      }
    } catch (e) {
      console.error('Error loading rector user', e);
    }
  }, [currentUser.institutionId]);

  // Helper function to save copy
  const saveSubmissionCopy = (sub: Submission, statusLabel: string, copiedBy: string, suffix: string) => {
    try {
      const copyId = `copy-${Date.now()}`;
      const newCopy = {
        id: copyId,
        submissionId: sub.id,
        institutionId: sub.institutionId,
        institutionName: sub.institutionName,
        year: sub.year,
        data: JSON.parse(JSON.stringify(sub.data)),
        status: sub.status,
        statusLabel,
        copiedAt: new Date().toISOString(),
        copiedBy,
        fileName: `Relatorio_Estatistico_${sub.year}_${suffix}.json`,
        signedByName: sub.signedByName,
        signedAt: sub.signedAt,
        signedByOrgaoMaximo: sub.signedByOrgaoMaximo
      };

      const storedCopies = localStorage.getItem('stat_submission_copies');
      const parsedCopies = storedCopies ? JSON.parse(storedCopies) : [];
      parsedCopies.push(newCopy);
      localStorage.setItem('stat_submission_copies', JSON.stringify(parsedCopies));
      setSubmissionCopies(prev => [...prev, newCopy]);
    } catch (e) {
      console.error('Error saving submission copy:', e);
    }
  };

  // Fetch internal users for this institution
  useEffect(() => {
    try {
      const stored = localStorage.getItem('stat_registered_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        const allUsers: User[] = parsed.map((item: any) => item.user).filter(Boolean);
        const myInternal = allUsers.filter(
          u => u.institutionId === currentUser.institutionId && u.role === 'ies_interno'
        );
        setInternalUsers(myInternal);
      }
    } catch (e) {
      console.error('Error fetching internal users', e);
    }
  }, [currentUser.institutionId]);

  // Load current submission from local storage to verify latest eixos details
  useEffect(() => {
    try {
      const savedSubs = localStorage.getItem('stat_submissions');
      if (savedSubs) {
        const parsed: Submission[] = JSON.parse(savedSubs);
        const found = parsed.find(
          s => s.institutionId === currentUser.institutionId && s.year === selectedYear
        );
        if (found) {
          setCurrentSubmission(found);
        } else {
          setCurrentSubmission(null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser.institutionId, selectedYear, submissionStatus]);

  const activeSubStatus = currentSubmission?.status || submissionStatus;

  // Track status of each eixo
  const getEixoStatus = (eixoKey: string): { status: 'pending' | 'draft' | 'sent_to_focal_point'; user?: string } => {
    const defaultUser = internalUsers.find(u => u.assignedEixo?.split(',').includes(eixoKey));
    const apiStatus = currentSubmission?.eixosStatus?.[eixoKey];
    const submittedBy = currentSubmission?.eixosSubmittedBy?.[eixoKey];

    if (apiStatus) {
      return { 
        status: apiStatus as any, 
        user: submittedBy || defaultUser?.name 
      };
    }
    
    // Fallback based on users exist
    if (defaultUser) {
      return { status: 'pending', user: defaultUser.name };
    }
    return { status: 'pending' };
  };

  const handleInternalSubmitEixo = (eixoKey: string) => {
    const confirmSend = window.confirm(
      `Confirma o envio do preenchimento do ${eixoKey} para o Focal Point do Gabinete da IES?\nIsto notificará a coordenação interna que a sua parte está finalizada.`
    );
    if (!confirmSend) return;

    const id = submissionId || `sub-${currentUser.institutionId}-${selectedYear}`;
    
    // Load latest submissions list
    const savedSubs = localStorage.getItem('stat_submissions');
    const parsedSubmissions: Submission[] = savedSubs ? JSON.parse(savedSubs) : [];
    const index = parsedSubmissions.findIndex(
      s => s.institutionId === currentUser.institutionId && s.year === selectedYear
    );

    let nextSub: Submission;
    const existingEixosStatus = currentSubmission?.eixosStatus || {};
    const existingEixosSubmittedBy = currentSubmission?.eixosSubmittedBy || {};

    const updatedEixosStatus = {
      ...existingEixosStatus,
      [eixoKey]: 'sent_to_focal_point' as const,
    };
    const updatedEixosSubmittedBy = {
      ...existingEixosSubmittedBy,
      [eixoKey]: currentUser.name,
    };

    if (index !== -1) {
      nextSub = {
        ...parsedSubmissions[index],
        data: formData, // Save current progress
        eixosStatus: updatedEixosStatus,
        eixosSubmittedBy: updatedEixosSubmittedBy,
        updatedAt: new Date().toISOString(),
      };
    } else {
      nextSub = {
        id,
        institutionId: currentUser.institutionId || '',
        institutionName: currentUser.institutionName || 'Instituição',
        province: currentUser.province || 'Maputo',
        year: selectedYear,
        data: formData,
        status: 'draft',
        sentToProvince: false,
        eixosStatus: updatedEixosStatus,
        eixosSubmittedBy: updatedEixosSubmittedBy,
        updatedAt: new Date().toISOString(),
      };
    }

    onSaveSubmission(nextSub);
    setCurrentSubmission(nextSub);
    if (onRefreshData) onRefreshData();
    alert(`Sucesso! O preenchimento do ${eixoKey} foi enviado ao Focal Point para consolidação.`);
  };

  const handleInternalSaveDraft = (eixoKey: string) => {
    const id = submissionId || `sub-${currentUser.institutionId}-${selectedYear}`;
    
    const savedSubs = localStorage.getItem('stat_submissions');
    const parsedSubmissions: Submission[] = savedSubs ? JSON.parse(savedSubs) : [];
    const index = parsedSubmissions.findIndex(
      s => s.institutionId === currentUser.institutionId && s.year === selectedYear
    );

    let nextSub: Submission;
    const existingEixosStatus = currentSubmission?.eixosStatus || {};
    const existingEixosSubmittedBy = currentSubmission?.eixosSubmittedBy || {};

    const updatedEixosStatus = {
      ...existingEixosStatus,
      [eixoKey]: 'draft' as const,
    };

    if (index !== -1) {
      nextSub = {
        ...parsedSubmissions[index],
        data: formData,
        eixosStatus: updatedEixosStatus,
        updatedAt: new Date().toISOString(),
      };
    } else {
      nextSub = {
        id,
        institutionId: currentUser.institutionId || '',
        institutionName: currentUser.institutionName || 'Instituição',
        province: currentUser.province || 'Maputo',
        year: selectedYear,
        data: formData,
        status: 'draft',
        sentToProvince: false,
        eixosStatus: updatedEixosStatus,
        updatedAt: new Date().toISOString(),
      };
    }

    onSaveSubmission(nextSub);
    setCurrentSubmission(nextSub);
    alert(`Rascunho do ${eixoKey} guardado localmente com sucesso!`);
  };

  // Focal Point sends to Órgão Máximo for signature
  const handleFocalPointSendToOrgaoMaximo = async () => {
    const pendingEixos = Object.keys(EIXOS_MAP).filter(
      k => getEixoStatus(k).status !== 'sent_to_focal_point'
    );

    if (pendingEixos.length > 0) {
      const proceed = window.confirm(
        `Aviso: Os seguintes eixos ainda não foram marcados como preenchidos/enviados:\n${pendingEixos.join(', ')}.\n\nDeseja submeter mesmo assim para o Órgão Máximo da IES?`
      );
      if (!proceed) return;
    } else {
      const proceed = window.confirm(
        `Confirma o envio do relatório de ${selectedYear} consolidado para o Órgão Máximo da IES para a devida Assinatura?`
      );
      if (!proceed) return;
    }

    const id = submissionId || `sub-${currentUser.institutionId}-${selectedYear}`;
    const savedSubs = localStorage.getItem('stat_submissions');
    const parsedSubmissions: Submission[] = savedSubs ? JSON.parse(savedSubs) : [];
    const index = parsedSubmissions.findIndex(
      s => s.institutionId === currentUser.institutionId && s.year === selectedYear
    );

    let nextSub: Submission;
    if (index !== -1) {
      nextSub = {
        ...parsedSubmissions[index],
        data: formData,
        status: 'pending_orgao_maximo',
        updatedAt: new Date().toISOString(),
      };
    } else {
      nextSub = {
        id,
        institutionId: currentUser.institutionId || '',
        institutionName: currentUser.institutionName || 'Instituição',
        province: currentUser.province || 'Maputo',
        year: selectedYear,
        data: formData,
        status: 'pending_orgao_maximo',
        sentToProvince: false,
        updatedAt: new Date().toISOString(),
      };
    }

    onSaveSubmission(nextSub);
    setCurrentSubmission(nextSub);
    
    // Save copy of the sent file (snapshot)
    saveSubmissionCopy(nextSub, 'Pendente de Assinatura', `${currentUser.name} (Focal Point)`, 'Enviado_ao_Reitor');

    // Notify the Rector in the system if they exist
    if (iesRectorUser) {
      const autoMsg = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        senderInstName: currentUser.institutionName || 'IES',
        recipientIds: [iesRectorUser.id],
        recipientNames: [iesRectorUser.name],
        title: `✍️ Solicitação de Assinatura - Relatório ${selectedYear}`,
        content: `Prezado Reitor/Director (${iesRectorUser.name}),\n\nO Focal Point (${currentUser.name}) submeteu o relatório consolidado de dados estatísticos relativo ao ano académico ${selectedYear} para a sua devida assinatura digital.\n\nPor favor, aceda ao painel "Fluxo de Trabalho e Assinatura" para verificar os dados e assinar digitalmente.`,
        createdAt: new Date().toISOString(),
        readBy: []
      };
      
      try {
        await setDoc(doc(db, 'messages', autoMsg.id), autoMsg);
      } catch (msgErr) {
        console.error("Error creating auto notification message to Rector:", msgErr);
      }
    }

    if (onRefreshData) onRefreshData();
    
    let successMsg = 'Relatório submetido com êxito! Encontra-se agora no gabinete do Reitor / Diretor (Órgão Máximo) aguardando assinatura digital.';
    if (iesRectorUser) {
      successMsg += `\n\nEnviado para o Dirigente Máximo: ${iesRectorUser.name} (${iesRectorUser.email})`;
    }
    alert(successMsg);
  };

  // Orgao Maximo Signs and returns to Focal Point
  const handleOrgaoMaximoSign = () => {
    if (!orgaoMaximoName.trim()) {
      alert('Por favor, digite o seu nome completo para efetuar a Assinatura.');
      return;
    }

    const proceed = window.confirm(
      `Ao clicar em Confirmar, você estará assinando digitalmente em nome de [${currentUser.institutionName}] o relatório de estatísticas de ${selectedYear}.\n\nDeseja continuar?`
    );
    if (!proceed) return;

    const id = submissionId || `sub-${currentUser.institutionId}-${selectedYear}`;
    const savedSubs = localStorage.getItem('stat_submissions');
    const parsedSubmissions: Submission[] = savedSubs ? JSON.parse(savedSubs) : [];
    const index = parsedSubmissions.findIndex(
      s => s.institutionId === currentUser.institutionId && s.year === selectedYear
    );

    let nextSub: Submission;
    if (index !== -1) {
      nextSub = {
        ...parsedSubmissions[index],
        status: 'pending_orgao_maximo', // Keep pending until explicitly returned
        signedByOrgaoMaximo: true,
        signedAt: new Date().toISOString(),
        signedByName: orgaoMaximoName.trim(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      nextSub = {
        id,
        institutionId: currentUser.institutionId || '',
        institutionName: currentUser.institutionName || 'Instituição',
        province: currentUser.province || 'Maputo',
        year: selectedYear,
        data: formData,
        status: 'pending_orgao_maximo',
        sentToProvince: false,
        signedByOrgaoMaximo: true,
        signedAt: new Date().toISOString(),
        signedByName: orgaoMaximoName.trim(),
        updatedAt: new Date().toISOString(),
      };
    }

    onSaveSubmission(nextSub);
    setCurrentSubmission(nextSub);
    setIsSigning(false);
    if (onRefreshData) onRefreshData();
    alert('Relatório assinado digitalmente com sucesso! Por favor, proceda com o envio clicando em "Enviar de Volta ao Focal Point".');
  };

  // Orgao Maximo explicitly sends the signed file back to Focal Point
  const handleOrgaoMaximoReturnToFocalPoint = async () => {
    if (!currentSubmission) return;

    const proceed = window.confirm(
      `Deseja enviar o relatório assinado de volta ao Focal Point da instituição?`
    );
    if (!proceed) return;

    const savedSubs = localStorage.getItem('stat_submissions');
    const parsedSubmissions: Submission[] = savedSubs ? JSON.parse(savedSubs) : [];
    const index = parsedSubmissions.findIndex(
      s => s.institutionId === currentUser.institutionId && s.year === selectedYear
    );

    let nextSub: Submission;
    if (index !== -1) {
      nextSub = {
        ...parsedSubmissions[index],
        status: 'signed_focal_point',
        updatedAt: new Date().toISOString(),
      };
    } else {
      nextSub = {
        ...currentSubmission,
        status: 'signed_focal_point',
        updatedAt: new Date().toISOString(),
      };
    }

    onSaveSubmission(nextSub);
    setCurrentSubmission(nextSub);
    
    // Save a copy of the signed file (snapshot)
    saveSubmissionCopy(nextSub, 'Assinado & Devolvido', `${currentUser.name} (Dirigente Máximo)`, 'Assinado_pelo_Reitor');

    // Send a message notification in system
    try {
      // Find focal points to notify
      const stored = localStorage.getItem('stat_registered_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        const allUsers: User[] = parsed.map((item: any) => item.user).filter(Boolean);
        const myFocalPoints = allUsers.filter(
          u => u.institutionId === currentUser.institutionId && ['ies', 'FocalPoint'].includes(u.role)
        );
        
        const recipientIds = myFocalPoints.map(u => u.id);
        const recipientNames = myFocalPoints.map(u => u.name);

        if (recipientIds.length > 0) {
          const autoMsg = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderRole: currentUser.role,
            senderInstName: currentUser.institutionName || 'IES',
            recipientIds,
            recipientNames,
            title: `✍️ Relatório Assinado pelo Reitor - ${selectedYear}`,
            content: `Prezados,\n\nO Órgão Máximo (${currentUser.name}) assinou digitalmente o relatório de dados estatísticos de ${selectedYear} e devolveu-o ao Focal Point.\n\nPor favor, procedam com a submissão formal definitiva ao Ministério/Província na vossa Área de Trabalho.`,
            createdAt: new Date().toISOString(),
            readBy: []
          };
          await setDoc(doc(db, 'messages', autoMsg.id), autoMsg);
        }
      }
    } catch (e) {
      console.error('Error sending message notification to Focal Point', e);
    }

    if (onRefreshData) onRefreshData();
    alert('O relatório assinado foi devolvido com sucesso ao Focal Point!');
  };

  // Orgao Maximo returns to Focal Point for corrections without signing
  const handleOrgaoMaximoReject = () => {
    const notes = window.prompt(
      'Instruções de Retificação (Indique os campos que o Focal Point e os técnicos devem corrigir):'
    );
    if (notes === null) return; // cancelled
    if (!notes.trim()) {
      alert('Por favor, insira o motivo da devolução.');
      return;
    }

    const id = submissionId || `sub-${currentUser.institutionId}-${selectedYear}`;
    const savedSubs = localStorage.getItem('stat_submissions');
    const parsedSubmissions: Submission[] = savedSubs ? JSON.parse(savedSubs) : [];
    const index = parsedSubmissions.findIndex(
      s => s.institutionId === currentUser.institutionId && s.year === selectedYear
    );

    let nextSub: Submission;
    if (index !== -1) {
      nextSub = {
        ...parsedSubmissions[index],
        status: 'draft',
        notes: notes.trim(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      nextSub = {
        id,
        institutionId: currentUser.institutionId || '',
        institutionName: currentUser.institutionName || 'Instituição',
        province: currentUser.province || 'Maputo',
        year: selectedYear,
        data: formData,
        status: 'draft',
        sentToProvince: false,
        notes: notes.trim(),
        updatedAt: new Date().toISOString(),
      };
    }

    onSaveSubmission(nextSub);
    setCurrentSubmission(nextSub);
    if (onRefreshData) onRefreshData();
    alert('O relatório foi recusado e devolvido ao Focal Point com as vossas notas de correção.');
  };

  // Focal Point submits the SIGNED report to Ministry & Provincial Rep
  const handleFocalPointSubmitMinistry = async () => {
    let provRep: any = null;
    let regRep: any = null;
    const iesProvince = currentUser.province || 'Maputo';
    const iesRegion = iesProvince ? PROVINCE_REGIONS[iesProvince] : currentUser.region || 'Sul';

    try {
      const stored = localStorage.getItem('stat_registered_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        const allUsers: User[] = parsed.map((item: any) => item.user).filter(Boolean);
        
        // Find Provincial Representative for the IES's province
        provRep = allUsers.find(
          (u: any) => ['RepresentanteProvincial', 'provincial'].includes(u.role) && u.province === iesProvince
        );
        
        // Find Regional Representative for the IES's region
        if (iesRegion) {
          regRep = allUsers.find(
            (u: any) => ['RepresentanteRegional', 'regional'].includes(u.role) && (u.region === iesRegion || (u.province && PROVINCE_REGIONS[u.province] === iesRegion))
          );
        }
      }
    } catch (e) {
      console.error('Error finding provincial or regional representatives', e);
    }

    let confirmMsg = `Confirma a submissão formal com assinatura digital de ${currentSubmission?.signedByName || 'Órgão Máximo'} para o Ministério?`;
    
    if (provRep || regRep) {
      confirmMsg += `\n\nEsta submissão será enviada COM CONHECIMENTO dos representantes locais identificados da sua província e região:`;
      if (provRep) {
        confirmMsg += `\n- Representante Provincial: ${provRep.name} (${iesProvince})`;
      }
      if (regRep) {
        confirmMsg += `\n- Representante Regional: ${regRep.name} (Região ${iesRegion})`;
      }
    } else {
      confirmMsg += `\n\nNota: Nenhum representante provincial ou regional foi registado/identificado para a província de ${iesProvince} no sistema. A submissão seguirá diretamente para a Direcção Nacional.`;
    }

    const proceed = window.confirm(confirmMsg);
    if (!proceed) return;

    const id = submissionId || `sub-${currentUser.institutionId}-${selectedYear}`;
    const savedSubs = localStorage.getItem('stat_submissions');
    const parsedSubmissions: Submission[] = savedSubs ? JSON.parse(savedSubs) : [];
    const index = parsedSubmissions.findIndex(
      s => s.institutionId === currentUser.institutionId && s.year === selectedYear
    );

    let nextSub: Submission;
    const updateObj = {
      status: 'pending_central' as const,
      sentToProvince: true, // Auto share with Representative Provincial
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Add info about who received knowledge of this submission
      provincialRepCc: provRep ? provRep.name : undefined,
      regionalRepCc: regRep ? regRep.name : undefined,
    };

    if (index !== -1) {
      nextSub = {
        ...parsedSubmissions[index],
        ...updateObj,
      };
    } else {
      nextSub = {
        id,
        institutionId: currentUser.institutionId || '',
        institutionName: currentUser.institutionName || 'Instituição',
        province: iesProvince,
        year: selectedYear,
        data: formData,
        sentToProvince: true,
        ...updateObj,
      };
    }

    onSaveSubmission(nextSub);
    setCurrentSubmission(nextSub);

    // Send Real-Time Alert Messages in system with their knowledge
    const recipientIds: string[] = [];
    const recipientNames: string[] = [];
    
    if (provRep) {
      recipientIds.push(provRep.id);
      recipientNames.push(provRep.name);
    }
    if (regRep) {
      recipientIds.push(regRep.id);
      recipientNames.push(regRep.name);
    }

    // Also include national/central team to notify them of the new submission
    try {
      const stored = localStorage.getItem('stat_registered_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        const allUsers: User[] = parsed.map((item: any) => item.user).filter(Boolean);
        const centralReps = allUsers.filter(u => ['Ministerial', 'central', 'nacional', 'sistema'].includes(u.role));
        centralReps.forEach(cr => {
          if (!recipientIds.includes(cr.id)) {
            recipientIds.push(cr.id);
            recipientNames.push(cr.name);
          }
        });
      }
    } catch (err) {
      console.error(err);
    }

    if (recipientIds.length > 0) {
      const autoMsg = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        senderInstName: currentUser.institutionName || 'IES',
        recipientIds,
        recipientNames,
        title: `📢 Submissão de Dados Anuais - ${selectedYear}`,
        content: `Prezados,\n\nA IES [${currentUser.institutionName || 'Nossa Instituição'}] submeteu formalmente os dados recolhidos relativos ao ano académico ${selectedYear}.\n\nEsta submissão foi enviada com a assinatura digital do Órgão Máximo (${nextSub.signedByName || 'Assinado'}) e enviada com o conhecimento do Representante Provincial (${provRep ? provRep.name : 'Não registado/Nenhum'}) e do Representante Regional (${regRep ? regRep.name : 'Não registado/Nenhum'}) correspondente à sua localização (${iesProvince} / Região ${iesRegion}).`,
        createdAt: new Date().toISOString(),
        readBy: []
      };
      
      try {
        await setDoc(doc(db, 'messages', autoMsg.id), autoMsg);
      } catch (msgErr) {
        console.error("Error creating auto notification message:", msgErr);
      }
    }

    if (onRefreshData) onRefreshData();

    let alertMsg = 'Submetido com sucesso ao Ministério!';
    if (provRep || regRep) {
      alertMsg += '\nEnviado com conhecimento de:';
      if (provRep) alertMsg += `\n- Representante Provincial (${provRep.name})`;
      if (regRep) alertMsg += `\n- Representante Regional (${regRep.name})`;
    }
    alert(alertMsg);
  };

  return (
    <div className="bg-white border-[3px] border-black rounded-[22px] p-5 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
      <div className="flex items-center justify-between pb-2 border-b-2 border-slate-900">
        <h4 className=" font-black text-slate-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
          ⛓️ Fluxo de Trabalho e Assinatura
        </h4>
        <span className="text-xs bg-blue-650 text-white font-extrabold px-2 py-0.5 rounded font-mono uppercase tracking-tight">
          Sinfone-IES
        </span>
      </div>

      {/* RENDER FOR INTERNAL TECHNICAL USER */}
      {currentUser.role === 'ies_interno' && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border-2 border-amber-200 rounded-xl">
            <span className="text-xs text-amber-800 font-extrabold uppercase block tracking-wider ">Seus Eixos de Coleta Atribuídos</span>
            <span className="text-xs text-slate-900 font-black  mt-1 block uppercase">
              {currentUser.assignedEixo ? currentUser.assignedEixo.split(',').map(e => EIXO_LABELS[e.trim()] || e.trim()).join(', ') : 'Não atribuído'}
            </span>
            <p className="text-xs text-slate-500 mt-1.5  leading-relaxed">
              Você foi designado(a) pelo Focal Point da sua IES para preencher estes dados de forma autónoma. Após completar, submeta cada eixo para a revisão do Focal Point.
            </p>
          </div>

          {(currentUser.assignedEixo ? currentUser.assignedEixo.split(',') : []).map(eixoKey => {
            const trimmedEixo = eixoKey.trim();
            const status = currentSubmission?.eixosStatus?.[trimmedEixo] || 'draft';
            
            return (
              <div key={trimmedEixo} className="border border-slate-100 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-extrabold uppercase tracking-widest block font-mono">Status do {trimmedEixo}:</span>
                  {status === 'sent_to_focal_point' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-black uppercase tracking-tight bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg">
                      <CheckCircle2 className="h-3 w-3" /> Enviado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-black uppercase tracking-tight bg-amber-100 border border-amber-300 text-amber-800 rounded-lg">
                      <AlertTriangle className="h-3 w-3 animate-bounce" /> Em preenchimento
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleInternalSaveDraft(trimmedEixo)}
                    disabled={activeSubStatus === 'pending_central' || activeSubStatus === 'approved'}
                    className="flex items-center justify-center gap-1.5 border-[2px] border-black bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 px-2 rounded-lg transition-all cursor-pointer disabled:opacity-40"
                  >
                    <Save className="h-3 w-3 text-slate-600" /> Salvar {trimmedEixo}
                  </button>
                  <button
                    onClick={() => handleInternalSubmitEixo(trimmedEixo)}
                    disabled={
                      activeSubStatus === 'pending_central' || 
                      activeSubStatus === 'approved' || 
                      status === 'sent_to_focal_point'
                    }
                    className="flex items-center justify-center gap-1.5 border-[2px] border-black bg-[#fec107] hover:bg-[#fec107]/90 text-black text-xs font-black py-2 px-2 rounded-lg transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] disabled:opacity-40 disabled:shadow-none"
                  >
                    <Send className="h-3 w-3" /> Enviar {trimmedEixo}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RENDER FOR FOCAL POINT / IES ADMIN */}
      {['ies', 'FocalPoint'].includes(currentUser.role) && (
        <div className="space-y-4">
          <div className="text-sm text-slate-500  leading-relaxed">
            Consulte a integridade de preenchimento de cada eixo pelos seus técnicos institucionais designados:
          </div>

          {/* Eixos Grid Status */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {Object.keys(EIXOS_MAP).map(eixoKey => {
              const eixoInfo = getEixoStatus(eixoKey);
              return (
                <div key={eixoKey} className="border border-slate-100 rounded-xl p-2.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                  <div className="min-w-0">
                    <span className="font-extrabold text-slate-900 block truncate uppercase leading-none">{eixoKey}</span>
                    <span className="text-xs text-slate-450 truncate block mt-0.5">{EIXO_LABELS[eixoKey]}</span>
                    {eixoInfo.user && (
                      <span className="text-xs text-blue-600 font-medium block mt-1">Designado: {eixoInfo.user}</span>
                    )}
                  </div>
                  <div>
                    {eixoInfo.status === 'sent_to_focal_point' ? (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-255 px-2 py-0.5 rounded text-xs uppercase font-black">
                        Preenchido
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-800 border border-amber-255 px-2 py-0.5 rounded text-xs uppercase font-black">
                        Pendente
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submission life stages panel */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-150 space-y-2">
            <span className="text-xs text-slate-450 font-black uppercase tracking-wider font-mono block">Status de Fluxo de Assinatura:</span>
            <div className="text-xs">
              {activeSubStatus === 'not_created' && (
                <span className="font-extrabold text-slate-500 uppercase">⌛ Rascunho Interno na IES</span>
              )}
              {activeSubStatus === 'draft' && (
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-600 uppercase">⌛ Em preparação (Modo Focal Point)</span>
                  {currentSubmission?.notes && (
                    <div className="bg-red-50 text-red-950 p-2 rounded border border-red-150 text-xs mt-1 ">
                      <strong>Motivo de Devolução do Reitor:</strong> "{currentSubmission.notes}"
                    </div>
                  )}
                </div>
              )}
              {activeSubStatus === 'pending_orgao_maximo' && (
                <div className="space-y-1">
                  <span className="font-extrabold text-amber-700 uppercase flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 animate-pulse" /> 
                    {currentSubmission?.signedByOrgaoMaximo ? 'Assinado pelo Reitor (Aguardando Devolução)' : 'Pendente de Assinatura (No Reitor)'}
                  </span>
                  <p className="text-xs text-slate-500">
                    {currentSubmission?.signedByOrgaoMaximo 
                      ? 'O Reitor já assinou digitalmente o ficheiro. Aguardando que efetue o envio de regresso ao Focal Point.'
                      : `O relatório foi enviado para o Dirigente Máximo ${iesRectorUser ? `[${iesRectorUser.name}]` : ''} e aguarda revisão e assinatura legal.`}
                  </p>
                </div>
              )}
              {activeSubStatus === 'signed_focal_point' && (
                <div className="space-y-1">
                  <span className="font-extrabold text-emerald-700 uppercase flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Assinado por: {currentSubmission?.signedByName}
                  </span>
                  <p className="text-xs text-slate-500">
                    O relatório de {selectedYear} foi verificado e assinado digitalmente pelo Reitor/Diretor. Está pronto para o envio central.
                  </p>
                </div>
              )}
              {activeSubStatus === 'pending_central' && (
                <span className="font-extrabold text-blue-700 uppercase flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" /> Submetido ao Ministério & Província
                </span>
              )}
              {activeSubStatus === 'approved' && (
                <span className="font-extrabold text-[#2e7d32] uppercase flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-655" /> Aprovado Formalmente pelo MEC
                </span>
              )}
            </div>
          </div>

          {/* Focal Point buttons */}
          <div className="pt-1">
            {activeSubStatus === 'draft' || activeSubStatus === 'not_created' ? (
              <div className="space-y-2">
                {iesRectorUser && (
                  <div className="text-xs text-slate-500 font-medium bg-blue-50/50 p-2 rounded-lg border border-blue-100 flex items-center gap-1.5 leading-snug">
                    <UserCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>Será enviado para o Reitor registado: <strong className="text-slate-800">{iesRectorUser.name}</strong></span>
                  </div>
                )}
                <button
                  onClick={handleFocalPointSendToOrgaoMaximo}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#fec107] border-2 border-black hover:bg-[#fec107]/90 text-black  font-black py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                >
                  <PenTool className="h-4 w-4" /> Enviar para Assinatura do Reitor
                </button>
              </div>
            ) : null}

            {activeSubStatus === 'signed_focal_point' ? (
              <button
                onClick={handleFocalPointSubmitMinistry}
                className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 border-2 border-black hover:bg-emerald-700 text-white  font-black py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)]"
              >
                <Send className="h-4 w-4" /> Submeter ao Ministério e Província
              </button>
            ) : null}

            {activeSubStatus === 'pending_orgao_maximo' && (
              <p className="text-xs text-slate-400  italic text-center leading-normal">
                {currentSubmission?.signedByOrgaoMaximo 
                  ? 'Aguardando que o Reitor envie o ficheiro assinado de regresso à sua Área de Trabalho.' 
                  : 'Aguarde que o Reitor / Diretor assine o relatório para proceder à submissão definitiva.'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* RENDER FOR ORGAO MAXIMO (REITOR / DIRECTOR) */}
      {currentUser.role === 'OrgaoMaximoIES' && (
        <div className="space-y-4">
          <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl space-y-1">
            <span className="text-xs text-red-800 font-extrabold uppercase block tracking-wider ">Área de Revisão do Reitor / Órgão Máximo</span>
            <span className="text-xs text-slate-900 font-black  block truncate uppercase">
              {currentUser.institutionName}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-150 rounded-lg p-3 space-y-2">
            <span className="text-xs text-slate-450 font-black uppercase tracking-wider block font-mono">Status Atual do Relatório de {selectedYear}:</span>
            <div className="text-xs">
              {activeSubStatus === 'pending_orgao_maximo' ? (
                <div className="space-y-1">
                  <span className="font-extrabold text-red-700 uppercase flex items-center gap-1 animate-pulse">
                    ⚠️ Pendente de Assinatura
                  </span>
                  <p className="text-xs text-slate-500 leading-normal">
                    O Focal Point já compilou todas as seções. Por favor, analise a consistência dos dados nas abas e proceda com a assinatura legal para validação do ministério.
                  </p>
                </div>
              ) : activeSubStatus === 'signed_focal_point' ? (
                <span className="font-extrabold text-emerald-700 uppercase flex items-center gap-1">
                  ✓ Assinado por si e devolvido ao Focal Point
                </span>
              ) : (
                <span className="font-extrabold text-slate-500 uppercase">
                  ⌛ Em preenchimento na equipa técnica ({activeSubStatus})
                </span>
              )}
            </div>
          </div>

          {activeSubStatus === 'pending_orgao_maximo' && (
            <div className="space-y-3 pt-2">
              {currentSubmission?.signedByOrgaoMaximo ? (
                <div className="space-y-3 p-3 bg-emerald-50 border-2 border-emerald-500 rounded-xl">
                  <span className="text-xs text-emerald-800 font-extrabold uppercase  tracking-tight block">✓ Documento Assinado</span>
                  <p className="text-xs text-slate-800 font-medium  leading-relaxed">
                    Assinado por: <strong>{currentSubmission.signedByName}</strong> <br />
                    Data: <span className="font-mono text-xs text-slate-500">{new Date(currentSubmission.signedAt!).toLocaleString()}</span>
                  </p>
                  
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      onClick={handleOrgaoMaximoReturnToFocalPoint}
                      className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 border-2 border-black hover:bg-emerald-700 text-white  font-black py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                    >
                      <Send className="h-4 w-4" /> Enviar de Volta ao Focal Point (Ficheiro Assinado)
                    </button>
                    
                    <button
                      onClick={() => setIsSigning(true)}
                      className="text-center text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                    >
                      Alterar Nome da Assinatura
                    </button>
                  </div>
                </div>
              ) : isSigning ? (
                <div className="space-y-3 p-3 bg-slate-50 border-2 border-black rounded-xl">
                  <span className="text-xs text-slate-950 font-black uppercase  tracking-tight block">Firma da Assinatura Digital</span>
                  <input
                    type="text"
                    required
                    placeholder="Nome Completo do Reitor / Diretor"
                    value={orgaoMaximoName}
                    onChange={(e) => setOrgaoMaximoName(e.target.value)}
                    className="w-full bg-white border-2 border-black px-3 py-2 rounded-lg text-xs placeholder:text-slate-400 "
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsSigning(false)}
                      className="flex-1 bg-slate-100 border-[2px] border-black text-slate-800 text-xs font-bold py-2 px-3 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleOrgaoMaximoSign}
                      className="flex-1 bg-emerald-600 border-[2px] border-black text-white text-xs font-black py-2 px-3 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    >
                      Confirmar Assinatura
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setOrgaoMaximoName(currentUser.name || '');
                      setIsSigning(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#fec107] border-2 border-black hover:bg-[#fec107]/90 text-black  font-black py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                  >
                    <PenTool className="h-4 w-4" /> Assinar Relatório
                  </button>
                  <button
                    onClick={handleOrgaoMaximoReject}
                    className="w-full flex items-center justify-center gap-1.5 bg-red-100 border-2 border-black hover:bg-red-200 text-red-800  font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    <CornerUpLeft className="h-4 w-4" /> Devolver p/ Retificação (Recusar)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* HISTÓRICO DE CÓPIAS DE FICHEIROS ENVIADOS */}
      {submissionCopies.length > 0 && (
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-extrabold uppercase block tracking-wider ">
              📂 Cópia dos Ficheiros de Envio
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">
              {submissionCopies.length} {submissionCopies.length === 1 ? 'ficheiro' : 'ficheiros'}
            </span>
          </div>
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar">
            {submissionCopies.map((copy) => {
              const handleDownloadJSON = () => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(copy, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", copy.fileName);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              };

              return (
                <div key={copy.id} className="p-2 bg-slate-50 border border-slate-150 rounded-lg flex flex-col gap-1 text-sm hover:bg-slate-100 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-850 truncate max-w-[170px]" title={copy.fileName}>
                      📄 {copy.fileName}
                    </span>
                    <span className={`px-1 rounded-[4px] text-xs font-extrabold uppercase ${
                      copy.status === 'signed_focal_point' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {copy.statusLabel || copy.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                    <span>Por: {copy.copiedBy}</span>
                    <span>
                      {new Date(copy.copiedAt).toLocaleDateString()} {new Date(copy.copiedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100 mt-1">
                    <span className="text-xs text-slate-400 italic">Ano: {copy.year}</span>
                    <button
                      onClick={handleDownloadJSON}
                      className="text-xs bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-2 py-0.5 rounded font-bold cursor-pointer transition-colors"
                    >
                      📥 Baixar JSON
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
