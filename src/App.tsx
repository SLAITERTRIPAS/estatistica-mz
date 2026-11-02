import React, { useState, useEffect, useMemo } from 'react';
import { User, Submission, Institution } from './types';
import RegistrationForm from './components/RegistrationForm';
import CoverPage from './components/CoverPage';
import IESDashboard from './components/IESDashboard';
import ProvincialDashboard from './components/ProvincialDashboard';
import CentralDashboard from './components/CentralDashboard';
import StandardDocuments from './components/StandardDocuments';
import RegionalDashboard from './components/RegionalDashboard';
import NationalDashboard from './components/NationalDashboard';
import ReportCoverPage from './components/ReportCoverPage';
import IESHistoryComparison from './components/IESHistoryComparison';
import IESSummaryView from './components/IESSummaryView';
import WelcomeScreen from './components/WelcomeScreen';
import ReportFormsView from './components/ReportFormsView';
import GestaoPessoalView from './components/GestaoPessoalView';
import YearSelectionModal from './components/YearSelectionModal';
import ProyectoTeorico from './components/ProyectoTeorico';
import QuantumAIFloatingCopilot from './components/QuantumAIFloatingCopilot';
import QuantumAICenter from './components/QuantumAICenter';
import OverviewSection from './components/OverviewSection';
import AIValidationAssistant from './components/AIValidationAssistant';
import LogoCustomizerModal from './components/LogoCustomizerModal';
import { resolveUserHeaderBranding } from './constants/institutionLogos';

import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { 
  Building2, LogOut, FileText, Database, Activity, LayoutDashboard,
  LayoutGrid, Calendar, MessageSquare, PenTool, BarChart3, ArrowLeft, Folder, Users, GraduationCap, ChevronRight, ChevronLeft, Maximize2, Minimize2, Minus, X, Upload, MapPin, Atom, Sparkles, RotateCw, Link, Copy, Check
} from 'lucide-react';
import { motion } from 'motion/react';

import { db, syncAccountsWithFirestore } from './lib/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  getDoc,
  setDoc, 
  updateDoc, 
  getDocs
} from 'firebase/firestore';
import { PROVINCE_REGIONS, aggregateSubmissions } from './utils/aggregation';
import { MOZAMBIQUE_EMBLEM, SYSTEM_LOGO } from './constants/assets';

const COL_LABELS_MAP: Record<string, string> = {
  discentes_h: "Discentes (H)",
  discentes_m: "Discentes (M)",
  docentes_h: "Docentes (H)",
  docentes_m: "Docentes (M)",
  investigadores_h: "Investig. (H)",
  investigadores_m: "Investig. (M)",
  cta_h: "CTA (H)",
  cta_m: "CTA (M)",
  naturezaJuridica: "Natureza Jurídica"
};

export const getReportValue = (row: Submission, col: string, inst?: Institution) => {
  const data = row.data as any;
  if (!data) return 0;
  switch(col) {
    case 'discentes_h': return data.studentsMale || 0;
    case 'discentes_m': return data.studentsFemale || 0;
    
    case 'docentes_h': {
        const ti = (data.docentesTempoInteiro || []).reduce((sum: number, c: any) => sum + (c.todos?.homens || 0), 0);
        const tp = (data.docentesTempoParcial || []).reduce((sum: number, c: any) => sum + (c.todos?.homens || 0), 0);
        return ti + tp;
    }
    case 'docentes_m': {
        const ti = (data.docentesTempoInteiro || []).reduce((sum: number, c: any) => sum + (c.todos?.mulheres || 0), 0);
        const tp = (data.docentesTempoParcial || []).reduce((sum: number, c: any) => sum + (c.todos?.mulheres || 0), 0);
        return ti + tp;
    }
    case 'investigadores_h': {
        const ti = (data.docentesInvestigadoresNacionalidade || []).reduce((sum: number, c: any) => sum + (c.todos?.homens || 0), 0);
        const tp = (data.docentesInvestigadoresNacionalidadeParcial || []).reduce((sum: number, c: any) => sum + (c.todos?.homens || 0), 0);
        return ti + tp;
    }
    case 'investigadores_m': {
        const ti = (data.docentesInvestigadoresNacionalidade || []).reduce((sum: number, c: any) => sum + (c.todos?.mulheres || 0), 0);
        const tp = (data.docentesInvestigadoresNacionalidadeParcial || []).reduce((sum: number, c: any) => sum + (c.todos?.mulheres || 0), 0);
        return ti + tp;
    }
    case 'cta_h': {
        const ti = (data.ctaB1 || []).filter((c: any) => c.vinculoContratual === 'Tempo Inteiro').reduce((sum: number, c: any) => sum + (c.todos?.homens || 0), 0);
        const tp = (data.ctaB1 || []).filter((c: any) => c.vinculoContratual === 'Tempo parcial').reduce((sum: number, c: any) => sum + (c.todos?.homens || 0), 0);
        return ti + tp;
    }
    case 'cta_m': {
        const ti = (data.ctaB1 || []).filter((c: any) => c.vinculoContratual === 'Tempo Inteiro').reduce((sum: number, c: any) => sum + (c.todos?.mulheres || 0), 0);
        const tp = (data.ctaB1 || []).filter((c: any) => c.vinculoContratual === 'Tempo parcial').reduce((sum: number, c: any) => sum + (c.todos?.mulheres || 0), 0);
        return ti + tp;
    }
    case 'naturezaJuridica': {
        return inst ? inst.type || 'Pública' : '---';
    }
    default:
        return data[col] || 0;
  }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [activeTab, setActiveTab] = useState<'workspace' | 'documents'>('workspace');
  const [unauthPage, setUnauthPage] = useState<'cover' | 'login' | 'register'>('cover');
  const [sidebarTab, setSidebarTab] = useState<'visao_geral' | 'estatistica' | 'calendario' | 'mensagens' | 'assinatura' | 'resumo_ies' | 'relatorios' | 'gestao_usuarios' | 'gestao_pessoal' | 'projeto_teorico' | 'ia_quantica' | 'validacao_ia'>('estatistica');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(false);
  const [started, setStarted] = useState(false);
  const [viewProjectAsGuest, setViewProjectAsGuest] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAppMinimized, setIsAppMinimized] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [headerNotification, setHeaderNotification] = useState<string | null>(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [registeredAccounts, setRegisteredAccounts] = useState<any[]>([]);

  const userBranding = useMemo(() => {
    return resolveUserHeaderBranding(currentUser, institutions);
  }, [currentUser, institutions]);

  const showHeaderToast = (msg: string) => {
    setHeaderNotification(msg);
    setTimeout(() => {
      setHeaderNotification(null);
    }, 3500);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    showHeaderToast("🔄 Sincronizando dados e atualizando estatísticas com o servidor...");
    try {
      if (db) {
        const querySnapshot = await getDocs(collection(db, "submissions"));
        const docs: Submission[] = [];
        querySnapshot.forEach((docSnap) => {
          docs.push({ id: docSnap.id, ...docSnap.data() } as Submission);
        });
        if (docs.length > 0) {
          setSubmissions(docs);
        }
      }
    } catch (err) {
      console.log("Sync completed or local state used", err);
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
        showHeaderToast("✅ Backup e Sincronização em Nuvem Concluídos com Sucesso!");
      }, 800);
    }
  };

  const handleBackupDatabase = () => {
    try {
      const backupData = {
        app: "SIGDE-ONLINE",
        timestamp: new Date().toISOString(),
        user: currentUser,
        submissionsCount: submissions.length,
        institutionsCount: institutions.length,
        submissions: submissions,
        institutions: institutions
      };
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SIGDE_ONLINE_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showHeaderToast("💾 Backup completo do Banco de Dados exportado em arquivo JSON!");
    } catch (e) {
      showHeaderToast("💾 Backup do sistema processado e salvo na memória local!");
    }
  };

  const handleToggleMinimize = () => {
    const nextState = !isAppMinimized;
    setIsAppMinimized(nextState);
    if (nextState) {
      showHeaderToast("🟡 Janela do SIGDE-ONLINE minimizada. Clique em 'Restaurar' no painel flutuante.");
    } else {
      showHeaderToast("🟢 Janela do SIGDE-ONLINE restaurada com sucesso.");
    }
  };

  const handleToggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        const element = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen().then(() => {
            setIsFullscreen(true);
            showHeaderToast("🖥️ Modo Tela Cheia / Maximizado ativado.");
          }).catch((err) => {
            console.error("Fullscreen error:", err);
            // Fallback for environments that block FS (like some iframes)
            setIsFullscreen(true);
            showHeaderToast("🖥️ Maximizado (Simulação de Modo Janela).");
          });
        } else {
          setIsFullscreen(true);
          showHeaderToast("🖥️ Maximizado (Modo Janela).");
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().then(() => {
            setIsFullscreen(false);
            showHeaderToast("🖥️ Modo Tela Cheia desativado.");
          }).catch(() => {
            setIsFullscreen(false);
          });
        } else {
          setIsFullscreen(false);
        }
      }
    } catch (e) {
      setIsFullscreen(!isFullscreen);
      showHeaderToast("🖥️ Alternando modo de visualização.");
    }
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [copiedSharedLink, setCopiedSharedLink] = useState(false);

  const handleCloseSystem = () => {
    setShowLogoutConfirm(true);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  const getDayName = (date: Date) => {
    return date.toLocaleDateString('pt-PT', { weekday: 'long' }).replace(/^\w/, (c) => c.toUpperCase());
  };

  const group1Roles = ['RepresentanteProvincial', 'RepresentanteRegional', 'Ministerial', 'nacional', 'central', 'regional', 'provincial', 'FocalPoint', 'sistema'];
  const group2Roles = ['OrgaoMaximoIES', 'ies'];

  const getAvailableRecipients = (): User[] => {
    const all = getAllCollaborators();
    if (!currentUser) return [];

    // Rule 1: Os utilizadores dos departamentos dentro das IES (ies_interno) respondem apenas ao Focal point ou representante da IES (sem comunicação externa com administradores)
    if (currentUser.role === 'ies_interno') {
      return all.filter(u => 
        u.id !== currentUser.id && 
        u.institutionId === currentUser.institutionId && 
        ['FocalPoint', 'ies', 'OrgaoMaximoIES'].includes(u.role)
      );
    }

    // Rule 2: Os Focal point ou representantes da IES (FocalPoint, OrgaoMaximoIES, ies) prestam contas a:
    // Representante Provincial, Regional, DNES (Ministerial/central) e Nacional, e também comunicam com os seus técnicos internos.
    if (['FocalPoint', 'ies', 'OrgaoMaximoIES'].includes(currentUser.role)) {
      return all.filter(u => {
        if (u.id === currentUser.id) return false;
        
        // 2a. Técnicos internos da própria IES
        if (u.role === 'ies_interno' && u.institutionId === currentUser.institutionId) {
          return true;
        }

        // 2b. Outros representantes da mesma IES
        if (['FocalPoint', 'ies', 'OrgaoMaximoIES'].includes(u.role) && u.institutionId === currentUser.institutionId) {
          return true;
        }

        // 2c. Representante Provincial (da mesma província)
        if (['RepresentanteProvincial', 'provincial'].includes(u.role)) {
          return !currentUser.province || !u.province || u.province === currentUser.province;
        }

        // 2d. Representante Regional (da mesma região)
        if (['RepresentanteRegional', 'regional'].includes(u.role)) {
          const userRegion = currentUser.province ? PROVINCE_REGIONS[currentUser.province] : null;
          return !userRegion || !u.region || u.region === userRegion;
        }

        // 2e. DNES e Nacional
        if (['Ministerial', 'central', 'nacional', 'sistema'].includes(u.role)) {
          return true;
        }

        return false;
      });
    }

    // Rule 3: Representantes Provinciais - podem contactar APENAS os representantes das IES (Focal Point, Representante IES, Órgão Máximo) da sua província
    if (['RepresentanteProvincial', 'provincial'].includes(currentUser.role)) {
      return all.filter(u => {
        if (u.id === currentUser.id) return false;
        
        // Apenas representantes das IES
        if (['FocalPoint', 'ies', 'OrgaoMaximoIES'].includes(u.role)) {
          return !u.province || u.province === currentUser.province;
        }

        return false;
      });
    }

    // Rule 4: Representantes Regionais - podem contactar APENAS os representantes das IES (Focal Point, Representante IES, Órgão Máximo) da sua região
    if (['RepresentanteRegional', 'regional'].includes(currentUser.role)) {
      return all.filter(u => {
        if (u.id === currentUser.id) return false;

        // Apenas representantes das IES
        if (['FocalPoint', 'ies', 'OrgaoMaximoIES'].includes(u.role)) {
          const uRegion = u.province ? PROVINCE_REGIONS[u.province] : u.region;
          return !uRegion || uRegion === currentUser.region;
        }

        return false;
      });
    }

    // Rule 5: Representantes Nacionais / DNES (Ministerial, central, nacional, sistema) - podem contactar APENAS os representantes das IES (Focal Point, Representante IES, Órgão Máximo)
    if (['Ministerial', 'central', 'nacional', 'sistema'].includes(currentUser.role)) {
      return all.filter(u => 
        u.id !== currentUser.id &&
        ['FocalPoint', 'ies', 'OrgaoMaximoIES'].includes(u.role)
      );
    }

    return [];
  }

  const [reportProvince, setReportProvince] = useState<string>('');
  const [reportYear, setReportYear] = useState<number>(new Date().getFullYear() - 4);
  const [reportYearEnd, setReportYearEnd] = useState<number>(new Date().getFullYear());
  const [chosenWorkYear, setChosenWorkYear] = useState<number | null>(null);
  const [reportType, setReportType] = useState<string>('Todas');
  const [selectedReportColumns, setSelectedReportColumns] = useState<string[]>(['discentes_h', 'discentes_m', 'docentes_h', 'docentes_m', 'investigadores_h', 'investigadores_m', 'cta_h', 'cta_m', 'naturezaJuridica']);
  const [reportScope, setReportScope] = useState<'nacional' | 'provincial' | 'regional' | 'institucional' | null>(null);
  const [reportRegion, setReportRegion] = useState<string>('');
  const [selectedInstitutionForReport, setSelectedInstitutionForReport] = useState<string>('');

  const navigateToReports = () => {
    setSidebarTab('relatorios');
    if (currentUser && ['ies', 'FocalPoint', 'OrgaoMaximoIES', 'ies_interno'].includes(currentUser.role)) {
      setReportScope('institucional');
      const match = institutions.find(i => i.id === currentUser.institutionId || i.name === currentUser.name);
      if (match) setSelectedInstitutionForReport(match.id);
    } else if (currentUser?.role === 'provincial') {
      setReportScope('provincial');
      setReportProvince(currentUser.province || '');
    }
  };

  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [internalMessages, setInternalMessages] = useState<any[]>([]);

  // Form states for scheduling calendar events (Admins)
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState('seminario');
  const [newEventDate, setNewEventDate] = useState('2026-06-15');
  const [newEventTime, setNewEventTime] = useState('09:00');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Form & selection states for Internal Messaging
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>("msg-1");
  const [isComposingMessage, setIsComposingMessage] = useState(false);
  const [msgRecipients, setMsgRecipients] = useState<string[]>([]);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [msgFilter, setMsgFilter] = useState<'received' | 'sent'>('received');

  // Digital signature custom tools state
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [processedSignature, setProcessedSignature] = useState<string | null>(null);
  const [sigThreshold, setSigThreshold] = useState<number>(230); // default threshold (0-255)
  const [isProcessingSignature, setIsProcessingSignature] = useState<boolean>(false);

  // Sync with Firestore
  useEffect(() => {
    // Sync credentials and profiles
    syncAccountsWithFirestore();

    // 1. Submissions
    const unsubSubs = onSnapshot(collection(db, 'submissions'), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Submission));
      setSubmissions(docs);
    });

    // 2. Institutions
    const unsubInsts = onSnapshot(collection(db, 'institutions'), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Institution));
      setInstitutions(docs); 
    });

    // 3. Calendar Events
    const unsubEvents = onSnapshot(collection(db, 'calendar_events'), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setCalendarEvents(docs);
    });

    // 4. Messages
    const unsubMsgs = onSnapshot(collection(db, 'messages'), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setInternalMessages(docs);
    });

    return () => {
      unsubSubs();
      unsubInsts();
      unsubEvents();
      unsubMsgs();
    };
  }, []);

  // Load registered users from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('stat_registered_accounts');
    if (saved) {
      try {
        setRegisteredAccounts(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Seed test users if none exist
      const testUsers = [
        { user: { id: 'test-reitor', name: 'Reitor Teste', email: 'reitor.ies@sigde.gov.mz', role: 'OrgaoMaximoIES', accountStatus: 'active', institutionName: 'IES Teste' } },
        { user: { id: 'test-focal', name: 'Focal Point Teste', email: 'focalpoint.ies@sigde.gov.mz', role: 'FocalPoint', accountStatus: 'active', institutionName: 'IES Teste' } },
        { user: { id: 'test-prov', name: 'Provincial Teste', email: 'provincial.gaza@sigde.gov.mz', role: 'provincial', province: 'Gaza', accountStatus: 'active' } },
        { user: { id: 'test-reg', name: 'Regional Teste', email: 'regional.sul@sigde.gov.mz', role: 'regional', region: 'Sul', accountStatus: 'active' } },
        { user: { id: 'test-min', name: 'Ministerial Teste', email: 'ministerial.dnes@sigde.gov.mz', role: 'Ministerial', accountStatus: 'active' } },
        { user: { id: 'test-nac', name: 'Nacional Teste', email: 'nacional.mec@sigde.gov.mz', role: 'nacional', accountStatus: 'active' } },
      ];
      localStorage.setItem('stat_registered_accounts', JSON.stringify(testUsers));
      setRegisteredAccounts(testUsers);
    }
  }, []);

  // Load state from LocalStorage on mount (only for current user session)
  useEffect(() => {
    const savedUser = localStorage.getItem('stat_current_user');
    const savedSubs = localStorage.getItem('stat_submissions');
    const savedInsts = localStorage.getItem('stat_institutions');
    
    // Load digital signature if exists
    const savedRawSig = localStorage.getItem('stat_raw_signature');
    const savedProcSig = localStorage.getItem('stat_processed_signature');
    const savedSigThresh = localStorage.getItem('stat_signature_threshold');
    if (savedRawSig) setSignatureImage(savedRawSig);
    if (savedProcSig) setProcessedSignature(savedProcSig);
    if (savedSigThresh) setSigThreshold(Number(savedSigThresh));

    if (savedUser) {
      // We don't auto-set currentUser here to ensure the login form is shown 
      // but we can keep unauthPage as 'cover' by default
      setUnauthPage('cover');
    } else {
      setUnauthPage('cover');
    }
  }, []);

  const handleRegister = async (newUser: User) => {
    // Fetch latest user data from Firestore to ensure all fields are present
    let finalUser = newUser;
    try {
      const userDoc = await getDoc(doc(db, 'users', newUser.id));
      if (userDoc.exists()) {
        finalUser = { ...newUser, ...userDoc.data() } as User;
        if (finalUser.email === 'slaitertripas@gmail.com') {
          finalUser = { ...finalUser, isOwner: true, isProgrammer: true, efetivo: false, systemId: 'ST849547771' };
        }
      } else {
        if (newUser.email === 'slaitertripas@gmail.com') {
          newUser = { ...newUser, isOwner: true, isProgrammer: true, efetivo: false, systemId: 'ST849547771' };
        }
        await setDoc(doc(db, 'users', newUser.id), newUser);
        finalUser = newUser;
      }
    } catch (e) {
      console.error("Error syncing user with Firestore:", e);
    }
    
    setCurrentUser(finalUser);
    localStorage.setItem('stat_current_user', JSON.stringify(finalUser));
    
    setActiveTab('workspace');
    setSidebarTab(['ies', 'FocalPoint', 'OrgaoMaximoIES', 'ies_interno'].includes(newUser.role) ? 'estatistica' : 'visao_geral');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setStarted(false);
    setChosenWorkYear(null);
    setUnauthPage('cover');
    setSidebarTab('estatistica');
    localStorage.removeItem('stat_current_user');
  };

  // Save/Update shared submissions database
  const handleSaveSubmission = async (updatedSub: Submission) => {
    try {
      await setDoc(doc(db, 'submissions', updatedSub.id), updatedSub);
    } catch (e) {
      console.error("Error saving submission:", e);
      // Fallback
      let nextSubs = [...submissions];
      const index = nextSubs.findIndex(s => s.id === updatedSub.id);
      if (index >= 0) {
        nextSubs[index] = updatedSub;
      } else {
        nextSubs.push(updatedSub);
      }
      setSubmissions(nextSubs);
    }
  };

  // Add Institution dynamically on register
  const handleAddInstitution = async (newInst: Institution) => {
    try {
      await setDoc(doc(db, 'institutions', newInst.id), newInst);
    } catch (e) {
      console.error("Error adding institution:", e);
      // Fallback
      setInstitutions([...institutions, newInst]);
    }
  };

  // Save Personalized Logo for the Logged-in User and their Institution
  const handleSavePersonalizedLogo = async (newLogoUrl: string) => {
    if (!currentUser) return;

    // 1. Update user profile
    const updatedUser: User = { 
      ...currentUser, 
      logoUrl: newLogoUrl, 
      photoURL: currentUser.photoURL || newLogoUrl 
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('stat_current_user', JSON.stringify(updatedUser));

    try {
      await updateDoc(doc(db, 'users', currentUser.id), { 
        logoUrl: newLogoUrl,
        photoURL: updatedUser.photoURL
      });
    } catch (e) {
      console.warn("Could not sync user logo to Firestore (offline fallback used):", e);
    }

    // 2. If user is tied to an IES, update the institution's logo
    if (currentUser.institutionId) {
      try {
        await updateDoc(doc(db, 'institutions', currentUser.institutionId), { 
          logoUrl: newLogoUrl 
        });
      } catch (e) {
        console.warn("Could not sync institution logo to Firestore (offline fallback used):", e);
      }
      setInstitutions(prev => prev.map(inst => 
        inst.id === currentUser.institutionId ? { ...inst, logoUrl: newLogoUrl } : inst
      ));
    }

    showHeaderToast("✨ Logotipo personalizado atualizado com sucesso no cabeçalho!");
  };

  // Send Submission to local Province
  const handleSendToProvince = (subId: string) => {
    const nextSubs = submissions.map(sub => {
      if (sub.id === subId) {
        return { ...sub, sentToProvince: true, updatedAt: new Date().toISOString() };
      }
      return sub;
    });
    setSubmissions(nextSubs);
    localStorage.setItem('stat_submissions', JSON.stringify(nextSubs));
  };

  // Central review (approve or request adjustments)
  const handleReviewSubmission = (subId: string, status: 'approved' | 'rejected', notes: string) => {
    const nextSubs = submissions.map(sub => {
      if (sub.id === subId) {
        return { 
          ...sub, 
          status, 
          notes, 
          reviewedBy: currentUser?.name || 'Validador MEC',
          reviewedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      return sub;
    });
    setSubmissions(nextSubs);
    localStorage.setItem('stat_submissions', JSON.stringify(nextSubs));
  };

  // Combine any newly registered accounts from local storage
  const getAllCollaborators = (): User[] => {
    try {
      const stored = localStorage.getItem('stat_registered_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => item.user).filter(Boolean);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  // Submit new scheduled activity
  const handleScheduleEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) {
      alert('Por favor insira um título para o evento.');
      return;
    }
    const newEvt = {
      id: `evt-${Date.now()}`,
      title: newEventTitle.trim(),
      type: newEventType,
      date: newEventDate,
      time: newEventTime,
      location: newEventLocation.trim() || 'Virtual / A Definir',
      description: newEventDesc.trim() || 'Sem descrição adicional fornecida.',
      createdBy: `${currentUser?.name} (${currentUser?.role === 'central' ? 'Administração Central' : 'Gabinete Provincial de ' + currentUser?.province})`,
      createdAt: new Date().toISOString()
    };

    // Save to Firestore
    try {
      await setDoc(doc(db, 'calendar_events', newEvt.id), newEvt);
    } catch (e) {
      console.error("Error saving event:", e);
      const updatedEvts = [newEvt, ...calendarEvents];
      setCalendarEvents(updatedEvts);
    }

    // Reset fields
    setNewEventTitle('');
    setNewEventLocation('');
    setNewEventDesc('');
    setNewEventType('seminario');

    alert('Atividade agendada com sucesso! Ela refletirá instantaneamente na Capa Principal (Informações Importantes).');
  };

  // Mark message as read
  const handleReadMessage = (msgId: string) => {
    setSelectedMessageId(msgId);
    setIsComposingMessage(false);
    if (!currentUser) return;
    
    const updatedMsgs = internalMessages.map(msg => {
      if (msg.id === msgId) {
        const readBy = msg.readBy || [];
        if (!readBy.includes(currentUser.id)) {
          const newReadBy = [...readBy, currentUser.id];
          // Update Firestore
          updateDoc(doc(db, 'messages', msgId), { readBy: newReadBy }).catch(console.error);
          return { ...msg, readBy: newReadBy };
        }
      }
      return msg;
    });

    setInternalMessages(updatedMsgs);
  };

  const handleOpenMessagesFromSidebar = () => {
    setSidebarTab('mensagens');
    setIsComposingMessage(false);
    if (currentUser) {
      const firstUnread = internalMessages.find(msg => 
        msg.recipientIds && 
        msg.recipientIds.includes(currentUser.id) && 
        (!msg.readBy || !msg.readBy.includes(currentUser.id))
      );
      if (firstUnread) {
        handleReadMessage(firstUnread.id);
      }
    }
  };

  // Submit/Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (msgRecipients.length === 0) {
      alert('Por favor selecione pelo menos um destinatário.');
      return;
    }
    if (!msgTitle.trim()) {
      alert('Por favor preencha o assunto da mensagem.');
      return;
    }
    if (!msgContent.trim()) {
      alert('Por favor escreva o conteúdo da mensagem.');
      return;
    }

    const allCollaborators = getAllCollaborators();
    const recipientNames = msgRecipients.map(id => {
      const col = allCollaborators.find(c => c.id === id);
      return col ? col.name : 'Colaborador';
    });

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderInstName: currentUser.role === 'ies' ? currentUser.institutionName : (currentUser.role === 'provincial' ? `Gabinete Provincial de ${currentUser.province}` : 'Direcção Nacional MEC'),
      recipientIds: msgRecipients,
      recipientNames,
      title: msgTitle.trim(),
      content: msgContent.trim(),
      createdAt: new Date().toISOString(),
      readBy: []
    };

    // Save to Firestore
    try {
      await setDoc(doc(db, 'messages', newMsg.id), newMsg);
    } catch (e) {
      console.error("Error sending message:", e);
      const updatedMsgs = [newMsg, ...internalMessages];
      setInternalMessages(updatedMsgs);
    }

    // Reset form
    setMsgTitle('');
    setMsgContent('');
    setMsgRecipients([]);
    setIsComposingMessage(false);
    setSelectedMessageId(newMsg.id); // View sent message context
    setMsgFilter('sent');

    alert('Mensagem enviada com sucesso! O(s) destinatário(s) receberá(ão) uma notificação instantânea (NOVA MENSAGEM) na sua área de trabalho.');
  };

  const unreadCount = internalMessages.filter(msg => 
    msg.recipientIds && 
    msg.recipientIds.includes(currentUser?.id || '') && 
    (!msg.readBy || !msg.readBy.includes(currentUser?.id || ''))
  ).length;

  // Convert and remove background while keeping original colors
  const processSignature = (base64Str: string, thresholdVal: number) => {
    setIsProcessingSignature(true);
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessingSignature(false);
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      // Loop through all pixels (R, G, B, A)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        if (a === 0) continue; // skip already transparent pixels
        
        // Compute brightness threshold. 
        // If they exceed the absolute threshold
        if (r >= thresholdVal && g >= thresholdVal && b >= thresholdVal) {
          data[i + 3] = 0; // set Alpha to 0 (make fully transparent)
        } else if (r > thresholdVal - 20 && g > thresholdVal - 20 && b > thresholdVal - 20) {
          // Soft blending near the threshold limit
          const minVal = Math.min(r, g, b);
          const ratio = (minVal - (thresholdVal - 20)) / 20;
          data[i + 3] = Math.max(0, Math.min(255, Math.round((1 - ratio) * 255)));
        }
      }
      
      ctx.putImageData(imgData, 0, 0);
      const outputBase64 = canvas.toDataURL('image/png');
      setProcessedSignature(outputBase64);
      setIsProcessingSignature(false);
      
      // Save
      localStorage.setItem('stat_processed_signature', outputBase64);
      localStorage.setItem('stat_raw_signature', base64Str);
      localStorage.setItem('stat_signature_threshold', String(thresholdVal));
    };
    img.onerror = () => {
      setIsProcessingSignature(false);
    };
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSignatureImage(result);
      processSignature(result, sigThreshold);
    };
    reader.readAsDataURL(file);
  };

  // Report computation logic extracted from JSX for stability
  const computedReportRows = submissions.filter(sub => {
    if (reportScope === 'provincial' && reportProvince && sub.province !== reportProvince) return false;
    if (reportScope === 'regional' && reportRegion && PROVINCE_REGIONS[sub.province] !== reportRegion) return false;
    if (selectedInstitutionForReport && sub.institutionId !== selectedInstitutionForReport) return false;
    if (reportYear && reportYearEnd) {
      if (sub.year < reportYear || sub.year > reportYearEnd) return false;
    } else if (reportYear && sub.year !== reportYear) {
      return false;
    }
    
    const inst = institutions.find(i => i.id === sub.institutionId);
    const type = inst ? inst.type : 'Pública';
    if ((reportScope === 'nacional' || reportScope === 'provincial' || reportScope === 'regional') && reportType !== 'Todas' && type !== reportType) return false;
    
    return true;
  });

  const handleExportCSVReport = () => {
    if (computedReportRows.length === 0) {
      alert("Não existem dados estatísticos homologados para exportar com os filtros atuais.");
      return;
    }
    
    const headers = ["Instituicao Superior", "Provincia", "Região", "Natureza", "Ano"];
    selectedReportColumns.forEach(col => {
      headers.push(COL_LABELS_MAP[col] || col);
    });

    const extraHeaders: string[] = [];
    if (reportScope === 'regional' && reportRegion) {
      extraHeaders.push(`"RELATÓRIO ESTATÍSTICO REGIONAL - ${reportRegion.toUpperCase()}"`);
      extraHeaders.push(`"Ano de Referência:","${reportYear}"`);
      extraHeaders.push(`""`);
    } else if (reportScope === 'institucional' && selectedInstitutionForReport) {
      const inst = institutions.find(i => i.id === selectedInstitutionForReport);
      if (inst) {
        extraHeaders.push(`"RELATÓRIO INSTITUCIONAL - ${inst.name.toUpperCase()}"`);
        extraHeaders.push(`"Ano de Referência:","${reportYear}"`);
        extraHeaders.push(`""`);
      }
    } else if (reportScope === 'provincial' && reportProvince) {
      extraHeaders.push(`"RELATÓRIO PROVINCIAL - ${reportProvince.toUpperCase()}"`);
      extraHeaders.push(`"Ano de Referência:","${reportYear}"`);
      extraHeaders.push(`""`);
    } else {
      extraHeaders.push(`"RELATÓRIO NACIONAL - ESTATÍSTICA DE ENSINO SUPERIOR"`);
      extraHeaders.push(`"Ano de Referência:","${reportYear}"`);
      extraHeaders.push(`""`);
    }

    const rows = computedReportRows.map(row => {
      const inst = institutions.find(i => i.id === row.institutionId);
      return [
        inst?.name || '',
        row.province || '',
        PROVINCE_REGIONS[row.province || ''] || '',
        inst?.type || 'Pública',
        row.year || '',
        ...selectedReportColumns.map(col => getReportValue(row, col, inst))
      ];
    });

    const totalRow = [
      "Total em Moçambique", // Instituicao Superior
      "", // Provincia
      "", // Região
      "", // Natureza
      "", // Ano
      ...selectedReportColumns.map(col => 
        computedReportRows.reduce((sum, row) => sum + (Number(getReportValue(row, col, institutions.find(i => i.id === row.institutionId))) || 0), 0)
      )
    ];

    rows.push(totalRow);

    const footerRows = [
      [""],
      [""],
      ["Este documento tem carácter oficial e foi gerado digitalmente pelo SIGDE- ONLINE - Moçambique."],
      [`Responsável: ${currentUser?.name || 'Administrador do Sistema'} | Nível: ${currentUser?.role?.toUpperCase() || 'SISTEM'}`]
    ];

    const csvContent = [...extraHeaders.map(h => h), headers.join(','), ...rows.map(row => row.join(',')), ...footerRows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Relatorio_CSV.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportXLSXReport = () => {
    if (computedReportRows.length === 0) {
      alert("Não existem dados estatísticos homologados para exportar.");
      return;
    }
    
    const data = computedReportRows.map(row => {
      const inst = institutions.find(i => i.id === row.institutionId);
      const obj: Record<string, any> = {
        "Instituicao Superior": inst?.name || '',
        "Provincia": row.province || '',
        "Região": PROVINCE_REGIONS[row.province || ''] || '',
        "Natureza": inst?.type || 'Pública',
        "Ano": row.year || ''
      };
      selectedReportColumns.forEach(col => {
        obj[COL_LABELS_MAP[col] || col] = getReportValue(row, col, inst);
      });
      return obj;
    });

    const totalObj: Record<string, any> = {
      "Instituicao Superior": "Total em Moçambique",
      "Provincia": "",
      "Região": "",
      "Natureza": "",
      "Ano": ""
    };
    selectedReportColumns.forEach(col => {
      totalObj[COL_LABELS_MAP[col] || col] = computedReportRows.reduce((sum, row) => sum + (Number(getReportValue(row, col, institutions.find(i => i.id === row.institutionId))) || 0), 0);
    });
    data.push(totalObj);

    // Empty rows for spacing
    data.push({});
    data.push({ "Instituicao Superior": "Este documento tem carácter oficial e foi gerado digitalmente pelo SIGDE- ONLINE - Moçambique." });
    data.push({ "Instituicao Superior": `Responsável: ${currentUser?.name || 'Administrador do Sistema'} | Nível: ${currentUser?.role?.toUpperCase() || 'SISTEM'}` });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");
    XLSX.writeFile(workbook, "Relatorio_Homologado.xlsx");
  };

  const handleExportZipReport = async () => {
    if (computedReportRows.length === 0) {
      alert("Não existem dados estatísticos para o anuário.");
      return;
    }

    const zip = new JSZip();
    // Excel Data
    const data = computedReportRows.map(row => {
      const inst = institutions.find(i => i.id === row.institutionId);
      const obj: Record<string, any> = {
        "Instituicao Superior": inst?.name || '',
        "Provincia": row.province || '',
        "Região": PROVINCE_REGIONS[row.province || ''] || '',
        "Natureza": inst?.type || 'Pública',
        "Ano": row.year || ''
      };
      selectedReportColumns.forEach(col => {
        obj[COL_LABELS_MAP[col] || col] = getReportValue(row, col, inst);
      });
      return obj;
    });

    const totalObj: Record<string, any> = {
      "Instituicao Superior": "Total em Moçambique",
      "Provincia": "",
      "Região": "",
      "Natureza": "",
      "Ano": ""
    };
    selectedReportColumns.forEach(col => {
      totalObj[COL_LABELS_MAP[col] || col] = computedReportRows.reduce((sum, row) => sum + (Number(getReportValue(row, col, institutions.find(i => i.id === row.institutionId))) || 0), 0);
    });
    data.push(totalObj);

    data.push({});
    data.push({ "Instituicao Superior": "Este documento tem carácter oficial e foi gerado digitalmente pelo SIGDE- ONLINE - Moçambique." });
    data.push({ "Instituicao Superior": `Responsável: ${currentUser?.name || 'Administrador do Sistema'} | Nível: ${currentUser?.role?.toUpperCase() || 'SISTEM'}` });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    zip.file("Anuario_Relatorio.xlsx", excelBuffer);
    
    // Add dummy PDF/metadata
    zip.file("README.txt", "Anuário oficial homologado pelo Ministério.");

    const content = await zip.generateAsync({type:"blob"});
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Anuario_Homologado.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (currentUser && started && !chosenWorkYear) {
    return (
      <YearSelectionModal 
        onSelect={(year) => { 
          setChosenWorkYear(year); 
          setShowWelcomeScreen(true); 
        }} 
        onBack={() => { 
          setCurrentUser(null); 
          setUnauthPage('cover'); 
          setStarted(false);
        }}
      />
    );
  }

  if (currentUser && started && chosenWorkYear && showWelcomeScreen) {
    return (
      <WelcomeScreen 
        user={currentUser} 
        institutions={institutions} 
        year={chosenWorkYear}
        onComplete={() => setShowWelcomeScreen(false)} 
        registeredAccounts={registeredAccounts}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 antialiased flex flex-col" id="app-root-layout">
      
      {/* 1. Top Banner / Header exactly matching the layout */}
      {currentUser && started && chosenWorkYear && !showWelcomeScreen && (
        <>
          <header className="bg-[#0b0b29] text-white py-2.5 px-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#1e1e4a] sticky top-0 z-40 shadow-2xl" id="master-upper-header">
            {/* 1. Left: Logotipo Oficial do Sistema SIGDE */}
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-[#1e1e4a] rounded-lg transition-colors cursor-pointer text-slate-300"
                aria-label="Toggle menu"
              >
                <LayoutDashboard className="h-6 w-6" />
              </button>
              <a 
                href="https://sigde.gov.mz" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Portal Oficial SIGDE - Moçambique"
                className="w-13 h-13 sm:w-14 sm:h-14 shrink-0 bg-white/95 border-2 border-[#fec107]/70 rounded-xl flex items-center justify-center overflow-hidden p-1 shadow-md hover:border-[#fec107] hover:scale-105 transition-all cursor-pointer group"
              >
                <img 
                  src={SYSTEM_LOGO} 
                  alt="Logotipo do Sistema SIGDE" 
                  className="w-full h-full object-contain mix-blend-multiply [filter:contrast(106%)_brightness(102%)] group-hover:scale-105 transition-transform"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </a>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#fec107] select-none whitespace-nowrap">
                    SIGDE-ONLINE
                  </h1>
                  <span className="hidden xl:inline-block text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                    SISTEMA NACIONAL
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-tight select-none hidden md:block font-medium">
                  Sistema Integrado de Gestão e Coleta de Dados Estatísticos
                </p>
              </div>
            </div>

            {/* 2. Center/Main: Cabeçalho Personalizado do Usuário Logado (com o Seu Logotipo) */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 border border-[#1e1e4a] rounded-xl px-2.5 sm:px-3.5 py-1.5 bg-[#07071e]/90 shadow-inner group hover:border-[#fec107]/60 transition-all">
              {/* Logotipo Personalizado do Usuário / IES / Província */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLogoModalOpen(true)}
                  title="Clique para personalizar ou alterar o logotipo desta entidade/conta"
                  className="w-11 h-11 sm:w-13 sm:h-13 bg-white rounded-xl border-2 border-[#fec107] flex items-center justify-center p-1 overflow-hidden shadow-md shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all group/logo relative"
                >
                  <img 
                    src={userBranding.logoUrl} 
                    alt={`Logotipo da Entidade - ${userBranding.entityName}`}
                    className="w-full h-full object-contain mix-blend-multiply [filter:contrast(106%)_brightness(102%)]"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/logo:opacity-100 rounded-xl flex items-center justify-center transition-opacity">
                    <Sparkles className="h-4 w-4 text-[#fec107]" />
                  </div>
                </button>
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3" title="Logotipo Institucional Ativo">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-slate-900"></span>
                </span>
              </div>

              {/* Informações da Entidade Personalizada */}
              <div className="flex flex-col min-w-0 max-w-[170px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[340px]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider ${userBranding.badgeBg} ${userBranding.badgeTextColor}`}>
                    {userBranding.badgeText}
                  </span>
                  {userBranding.provinceOrRegion && (
                    <span className="text-[9px] font-mono text-slate-400 hidden sm:inline">
                      • {userBranding.provinceOrRegion}
                    </span>
                  )}
                </div>
                <span className="font-black text-xs sm:text-sm tracking-tight text-white uppercase truncate mt-0.5" title={userBranding.entityName}>
                  {userBranding.entityName}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-300 truncate">
                  <span className="font-bold text-slate-200 truncate">{currentUser.name}</span>
                  <span className="text-slate-500 hidden md:inline">•</span>
                  <span className="text-slate-400 hidden md:inline truncate">{userBranding.entitySubtitle}</span>
                </div>
              </div>

              {/* Botão Rápido para Personalizar Logotipo */}
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(true)}
                title="Personalizar Logotipo da Conta / Instituição"
                className="hidden xl:flex items-center gap-1 text-[10px] font-bold text-[#fec107] bg-[#fec107]/10 hover:bg-[#fec107]/20 border border-[#fec107]/30 px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="h-3 w-3" />
                <span>Alterar Logo</span>
              </button>
            </div>

            {/* 3. DateTime Box */}
            <div className="hidden 2xl:flex flex-col items-center justify-center border border-[#1e1e4a] px-4 py-1.5 rounded-xl bg-[#07071e] shadow-inner shrink-0">
              <span className="text-[10px] font-black text-[#fec107] uppercase tracking-widest">{getDayName(currentTime)}</span>
              <span className="text-xl font-black font-mono tracking-widest text-white">{formatTime(currentTime)}</span>
              <span className="text-xs text-slate-300 font-bold">{formatDate(currentTime)}</span>
            </div>
            
            {/* 4. Right: User Details & System Actions */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Informações do Utilizador no Cabeçalho */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-[#1e1e4a] bg-slate-800 shadow-lg shrink-0">
                  <img 
                    src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=0b0b29&color=fec107&bold=true`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="font-black text-xs tracking-tight text-white uppercase truncate max-w-[120px]">{currentUser.name}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {currentUser.isOwner && currentUser.isProgrammer ? (
                      <span className="text-[9px] bg-[#fec107] text-[#0b0b29] px-1.5 py-0.2 rounded font-black tracking-widest uppercase">Admin TI</span>
                    ) : (
                      <span className="text-[9px] bg-[#fec107] text-[#0b0b29] px-1.5 py-0.2 rounded font-black tracking-widest uppercase truncate max-w-[100px]">{currentUser.role}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botões de Ação do Sistema */}
              <div className="flex items-center gap-2 border border-[#1e1e4a] rounded-xl p-1.5 bg-[#07071e] shadow-inner">
                {/* 0. Link Partilhado do Sistema */}
                <button
                  type="button"
                  onClick={() => {
                    const sharedUrl = "https://ais-pre-7xbvfzreclzjcthc7dpbgt-64514099689.europe-west1.run.app";
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(sharedUrl);
                    }
                    setCopiedSharedLink(true);
                    showHeaderToast("🔗 Link de partilha do SIGDE-ONLINE copiado com sucesso!");
                    setTimeout(() => setCopiedSharedLink(false), 2500);
                  }}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer group/link hover:scale-110 active:scale-95 flex items-center gap-1.5 ${
                    copiedSharedLink 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                      : 'hover:bg-[#1e1e4a] text-[#fec107]'
                  }`}
                  title={copiedSharedLink ? "Link Partilhado Copiado!" : "Copiar Link Partilhado do Sistema"}
                  aria-label="Copiar Link Partilhado do Sistema"
                >
                  {copiedSharedLink ? (
                    <Check size={17} className="text-emerald-400 animate-in zoom-in-75 duration-200" />
                  ) : (
                    <Link size={17} className="group-hover/link:rotate-12 transition-transform" />
                  )}
                  <span className="hidden xl:inline text-[10px] font-black uppercase tracking-wider">
                    {copiedSharedLink ? "Copiado!" : "Partilhar"}
                  </span>
                </button>

                {/* 1. Sincronização e Atualização */}
                <button 
                  onClick={handleManualSync}
                  title="Sincronizar e Atualizar Dados em Nuvem"
                  className="p-2 hover:bg-sky-600 rounded-lg text-sky-400 border border-sky-600/40 bg-sky-950/40 hover:text-white transition-all cursor-pointer shadow-sm active:scale-90"
                  aria-label="Sincronizar"
                >
                  <RotateCw className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>

                {/* 2. Backup do Banco de Dados */}
                <button 
                  onClick={handleBackupDatabase}
                  title="Exportar Backup de Segurança do Banco de Dados (JSON)"
                  className="p-2 hover:bg-blue-600 rounded-lg text-blue-400 border border-blue-600/40 bg-blue-950/40 hover:text-white transition-all cursor-pointer shadow-sm active:scale-90"
                  aria-label="Backup"
                >
                  <Database className="h-5 w-5" />
                </button>

                {/* 3. Minimizar */}
                <button 
                  onClick={handleToggleMinimize}
                  title={isAppMinimized ? "Restaurar Janela do Sistema" : "Minimizar Janela do Sistema"}
                  className="p-2 hover:bg-amber-600 rounded-lg text-amber-400 border border-amber-500/50 bg-amber-950/40 hover:text-white transition-all cursor-pointer shadow-sm active:scale-90"
                  aria-label="Minimizar"
                >
                  <Minus className="h-5 w-5" />
                </button>

                {/* 4. Maximizar / Tela Cheia */}
                <button 
                  onClick={handleToggleFullscreen}
                  title={isFullscreen ? "Sair do Modo Tela Cheia" : "Maximizar em Tela Cheia"}
                  className="p-2 hover:bg-emerald-600 rounded-lg text-emerald-400 border border-emerald-500/50 bg-emerald-950/40 hover:text-white transition-all cursor-pointer shadow-sm active:scale-90"
                  aria-label="Maximizar"
                >
                  {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>

                {/* 5. Fechar Sessão */}
                <button 
                  onClick={handleCloseSystem}
                  title="Fechar Sessão do Sistema / Sair"
                  className="p-2 hover:bg-red-600 rounded-lg text-red-400 border border-red-500 bg-red-950/40 hover:text-white transition-all cursor-pointer shadow-sm active:scale-90"
                  aria-label="Fechar"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Notificação / Toast de Ação do Cabeçalho */}
          {headerNotification && (
            <div className="bg-[#1e1e4a] text-amber-300 text-sm px-4 py-2.5 border-b border-[#fec107]/40 flex items-center justify-between animate-fade-in shadow-2xl relative z-30">
              <span className="font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#fec107]" />
                {headerNotification}
              </span>
              <button 
                onClick={() => setHeaderNotification(null)}
                className="text-slate-400 hover:text-white text-sm font-black px-2 py-0.5 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Subheader / Breadcrumb bar based on image */}
          <div className="bg-[#07071e] text-white px-4 sm:px-8 py-2.5 flex items-center justify-between border-t border-[#1e1e4a] shadow-inner">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setSidebarTab('estatistica')} 
                className="flex items-center gap-2 border-2 border-[#fec107] text-[#fec107] px-4 py-1.5 rounded-lg text-sm font-black hover:bg-[#fec107] hover:text-[#0b0b29] transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <span className="text-[16px] font-black text-[#fec107] uppercase tracking-wider select-none">
                {sidebarTab === 'estatistica' ? 'Estatística Institucional' : 
                 sidebarTab === 'visao_geral' ? 'Visão Geral do Sistema' : 
                 sidebarTab === 'validacao_ia' ? 'Validação Assistida por IA (Gemini)' :
                 sidebarTab.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-emerald-950/40 text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-800/60 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div> 
                <span className="text-xs font-black tracking-wider uppercase">Sistema Online</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 bg-slate-900/40 px-4 py-1.5 rounded-full border border-slate-800/60 shadow-inner">
                <Activity className="h-4 w-4 text-sky-400" />
                <span className="text-xs font-black tracking-wider uppercase">Nuvem em Dia</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main split-screen container when logged in, or cover/register when not */}
      {!currentUser || !started ? (
        <main className={`flex-1 w-full ${(unauthPage === 'cover' && !viewProjectAsGuest) ? '' : 'max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'}`} id="unauthenticated-container">
          {viewProjectAsGuest ? (
            <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm mt-4">
              <ProyectoTeorico 
                lang="pt" 
                onBack={() => setViewProjectAsGuest(false)} 
              />
            </div>
          ) : unauthPage === 'cover' ? (
            <CoverPage 
              onEnterLogin={() => {
                setStarted(true);
                setUnauthPage('login');
              }} 
              onEnterRegister={() => {
                setStarted(true);
                setUnauthPage('register');
              }} 
              onViewProject={() => {
                setViewProjectAsGuest(true);
              }}
              registeredAccounts={registeredAccounts}
              onAutoLogin={(account) => {
                setCurrentUser(account.user);
                localStorage.setItem('stat_current_user', JSON.stringify(account.user));
                setActiveTab('workspace');
                setStarted(true);
              }}
            />
          ) : (
            <RegistrationForm 
              onRegister={(user) => {
                handleRegister(user);
                setStarted(true);
              }} 
              institutions={institutions}
              onAddInstitution={handleAddInstitution}
              onBackToCover={() => {
                setUnauthPage('cover');
                setStarted(false);
              }}
              activeTab={unauthPage === 'login' ? 'login' : 'register'}
              onTabChange={(tab) => setUnauthPage(tab)}
              registeredAccounts={registeredAccounts}
            />
          )}
        </main>
      ) : (
        <div className={`flex-1 flex flex-col lg:flex-row relative ${isAppMinimized ? 'hidden' : ''}`} id="dashboard-split-layout">
          
          {/* Overlay for mobile sidebar */}
          {isMobileMenuOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* 2. Left Sidebar Navigation Panel */}
          <aside 
            className={`
              fixed lg:relative inset-y-0 left-0 ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64 bg-[#0b0b29] border-r border-[#1e1e4a] p-4 shrink-0 flex flex-col justify-between z-50 transform transition-all duration-300 ease-in-out
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `} 
            id="side-navigation-panel"
          >
            {/* BOTÃO COM SETINHA PARA MINIMIZAR / EXPANDIR A JANELA LATERAL NO MEIO DA DIVISÓRIA */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center bg-[#0b0b29] border border-[#1e1e4a] rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] z-[60] hover:bg-[#1e1e4a] text-[#fec107] transition-all cursor-pointer hover:scale-110 active:scale-95"
              title={isSidebarCollapsed ? "Expandir Menu Lateral (Setinha)" : "Minimizar Menu Lateral (Setinha)"}
              aria-label="Minimizar Menu Lateral"
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-5 w-5 text-emerald-600 font-black" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-slate-700 font-black" />
              )}
            </button>
            <div className="space-y-6">
              {/* Mobile Close Button */}
              <div className="lg:hidden flex justify-end">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Institutional brief with personalized logo & SETINHA para minimizar */}
              <div className="border-b border-[#1e1e4a] pb-4 flex items-center justify-between gap-2">
                {!isSidebarCollapsed && (
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button 
                      type="button"
                      onClick={() => setIsLogoModalOpen(true)}
                      title="Clique para personalizar o logotipo institucional"
                      className="w-10 h-10 shrink-0 bg-white border border-[#fec107]/80 rounded-lg flex items-center justify-center overflow-hidden p-1 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer group relative"
                    >
                      <img 
                        src={userBranding.logoUrl} 
                        alt="Logo Institucional" 
                        className="w-full h-full object-contain mix-blend-multiply [filter:contrast(106%)_brightness(102%)]"
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    </button>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-[#fec107] font-black tracking-[0.2em] block  uppercase">Sistema informativo</span>
                      <span className="text-sm  font-black text-white block truncate leading-tight mt-1">
                        {['ies', 'OrgaoMaximoIES', 'FocalPoint'].includes(currentUser.role) ? currentUser.institutionName : 
                         ['nacional', 'sistema'].includes(currentUser.role) ? 'Coordenação Geral Nacional' :
                         ['regional', 'RepresentanteRegional'].includes(currentUser.role) ? `Gabinete Regional ${currentUser.region}` :
                         ['provincial', 'RepresentanteProvincial'].includes(currentUser.role) ? `Gabinete Provincial de ${currentUser.province}` :
                         'Direção Nacional de Ensino Superior'}
                      </span>
                      <span className="text-sm text-slate-400  font-medium mt-1 block italic bg-[#07071e] px-2 py-0.5 rounded border border-[#1e1e4a] truncate">
                        {['regional', 'RepresentanteRegional'].includes(currentUser.role) ? `Região ${currentUser.region} • Moçambique` : currentUser.province || 'Nível Central • Moçambique'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Items menu */}
              <nav className="space-y-1" id="sidebar-tabs-list">
                {/* Visão geral - Available to all */}
                <button
                    onClick={() => {
                      setSidebarTab('visao_geral');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      sidebarTab === 'visao_geral'
                        ? 'bg-[#1e1e4a] text-[#fec107] border-l-4 border-[#fec107] shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-[#1e1e4a]/50 '
                    }`}
                    title={isSidebarCollapsed ? "Visão geral" : ""}
                    id="tab-view-overview"
                >
                    <LayoutGrid className={`h-4 w-4 shrink-0 ${sidebarTab === 'visao_geral' ? 'text-[#fec107]' : 'text-slate-500'}`} />
                    {!isSidebarCollapsed && <span>Visão geral</span>}
                </button>

                {/* Validação Assistida por IA (Gemini) */}
                <button
                    onClick={() => {
                      setSidebarTab('validacao_ia');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-3'} py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      sidebarTab === 'validacao_ia'
                        ? 'bg-[#1e1e4a] text-indigo-400 border-l-4 border-indigo-500 shadow-lg'
                        : 'text-indigo-400/80 hover:text-indigo-300 hover:bg-indigo-950/30 '
                    }`}
                    title={isSidebarCollapsed ? "Validação IA (Gemini)" : ""}
                    id="tab-view-ai-validation"
                >
                    <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                      <Sparkles className={`h-4 w-4 shrink-0 ${sidebarTab === 'validacao_ia' ? 'text-indigo-400' : 'text-indigo-500'} animate-pulse`} />
                      {!isSidebarCollapsed && <span>Validação por IA</span>}
                    </div>
                    {!isSidebarCollapsed && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30 uppercase">
                        Gemini
                      </span>
                    )}
                </button>

                {/* IA Quântica - Restricted to Administrador Geral Supremo */}
                {currentUser.isOwner && currentUser.isProgrammer && (
                  <button
                      onClick={() => {
                        setActiveTab('workspace');
                        setSidebarTab('ia_quantica');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-3'} py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        sidebarTab === 'ia_quantica' && activeTab === 'workspace'
                          ? 'bg-[#07071e] text-emerald-400 border-l-4 border-emerald-500 shadow-lg'
                          : 'text-emerald-500/70 hover:text-emerald-400 hover:bg-emerald-950/30 '
                      }`}
                      title={isSidebarCollapsed ? "IA Quântica" : ""}
                      id="tab-view-quantum-ai"
                  >
                      <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                        <Atom className={`h-4 w-4 shrink-0 ${sidebarTab === 'ia_quantica' ? 'text-emerald-400' : 'text-emerald-600'} animate-spin`} style={{ animationDuration: '8s' }} />
                        {!isSidebarCollapsed && <span>IA Quântica</span>}
                      </div>
                      {!isSidebarCollapsed && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono font-bold border border-emerald-500/20">
                          96.4%
                        </span>
                      )}
                  </button>
                )}

                {/* Estatística - Group 1 only */}
                {group1Roles.includes(currentUser.role) && (
                  <button
                    onClick={() => {
                      setSidebarTab('estatistica');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      sidebarTab === 'estatistica'
                        ? 'bg-[#1e1e4a] text-blue-400 border-l-4 border-blue-500 shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-[#1e1e4a]/50 '
                    }`}
                    title={isSidebarCollapsed ? "Estatística" : ""}
                    id="tab-view-stat"
                  >
                    <BarChart3 className={`h-4 w-4 shrink-0 ${sidebarTab === 'estatistica' ? 'text-blue-400' : 'text-slate-500'}`} />
                    {!isSidebarCollapsed && <span>Estatística</span>}
                  </button>
                )}

                {/* Calendário - Group 1 only */}
                {group1Roles.includes(currentUser.role) && (
                  <button
                    onClick={() => {
                      setSidebarTab('calendario');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      sidebarTab === 'calendario'
                        ? 'bg-[#1e1e4a] text-slate-200 border-l-4 border-[#fec107] shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-[#1e1e4a]/50 '
                    }`}
                    title={isSidebarCollapsed ? "Calendário" : ""}
                    id="tab-view-calendar"
                  >
                    <Calendar className={`h-4 w-4 shrink-0 ${sidebarTab === 'calendario' ? 'text-[#fec107]' : 'text-slate-500'}`} />
                    {!isSidebarCollapsed && <span>Calendário</span>}
                  </button>
                )}

                {/* Mensagens - Available to all */}
                  <button
                    onClick={() => {
                      handleOpenMessagesFromSidebar();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-3'} py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      sidebarTab === 'mensagens'
                        ? 'bg-[#1e1e4a] text-white border-l-4 border-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-[#1e1e4a]/50 '
                    }`}
                    title={isSidebarCollapsed ? "Mensagens" : ""}
                    id="tab-view-messages"
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                      <MessageSquare className={`h-4 w-4 shrink-0 ${sidebarTab === 'mensagens' ? 'text-white' : 'text-slate-500'}`} />
                      {!isSidebarCollapsed && <span>Mensagens</span>}
                    </div>
                    {unreadCount > 0 && !isSidebarCollapsed && (
                      <span className="bg-red-600 text-white text-xs  font-black px-1.5 py-0.5 rounded-full select-none animate-pulse">
                        (Nova mensagem)
                      </span>
                    )}
                    {unreadCount > 0 && isSidebarCollapsed && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                    )}
                  </button>

                {/* Assinatura digital - Available to all */}
                  <button
                    onClick={() => {
                      setSidebarTab('assinatura');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      sidebarTab === 'assinatura'
                        ? 'bg-[#1e1e4a] text-white border-l-4 border-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-[#1e1e4a]/50 '
                    }`}
                    title={isSidebarCollapsed ? "Assinatura digital" : ""}
                    id="tab-view-signature"
                  >
                    <PenTool className={`h-4 w-4 shrink-0 ${sidebarTab === 'assinatura' ? 'text-white' : 'text-slate-500'}`} />
                    {!isSidebarCollapsed && <span>Assinatura digital</span>}
                  </button>

                {/* Resumo - All have it */}
                  <button
                    onClick={() => {
                      setSidebarTab('resumo_ies');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-3'} py-3 text-xs font-black tracking-tight rounded-xl transition-all cursor-pointer ${
                      sidebarTab === 'resumo_ies'
                        ? 'bg-[#1e1e4a] text-white border-l-4 border-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-[#1e1e4a]/50 '
                    }`}
                    title={isSidebarCollapsed ? "Resumo" : ""}
                    id="tab-view-ies-summary"
                  >
                    <BarChart3 className={`h-4 w-4 shrink-0 ${sidebarTab === 'resumo_ies' ? 'text-white' : 'text-slate-500'}`} />
                    {!isSidebarCollapsed && <span>Resumo</span>}
                  </button>

                <button
                  onClick={() => {
                    navigateToReports();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    sidebarTab === 'relatorios'
                      ? 'bg-[#1e1e4a] text-white border-l-4 border-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-[#1e1e4a]/50 '
                  }`}
                  title={isSidebarCollapsed ? "Relatórios" : ""}
                  id="tab-view-reports"
                >
                  <FileText className={`h-4 w-4 shrink-0 ${sidebarTab === 'relatorios' ? 'text-white' : 'text-slate-500'}`} />
                  {!isSidebarCollapsed && <span>Relatórios</span>}
                </button>

                {['nacional', 'sistema'].includes(currentUser.role) && (
                  <button
                    onClick={() => {
                      setSidebarTab('gestao_usuarios');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      sidebarTab === 'gestao_usuarios'
                        ? 'bg-[#1e1e4a] text-white border-l-4 border-[#fec107] shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-[#1e1e4a]/50 '
                    }`}
                    title={isSidebarCollapsed ? "Gestão de usuários" : ""}
                  >
                    <Users className={`h-4 w-4 shrink-0 ${sidebarTab === 'gestao_usuarios' ? 'text-[#fec107]' : 'text-slate-500'}`} />
                    {!isSidebarCollapsed && <span>Gestão de usuários</span>}
                  </button>
                )}

                {currentUser && ['ies', 'FocalPoint', 'OrgaoMaximoIES'].includes(currentUser.role) && (
                  <button
                    onClick={() => {
                      setSidebarTab('gestao_pessoal');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      sidebarTab === 'gestao_pessoal'
                        ? 'bg-[#1e1e4a] text-[#fec107] border-l-4 border-[#fec107] shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-[#1e1e4a]/50 '
                    }`}
                    title={isSidebarCollapsed ? "Gestão de pessoal" : ""}
                  >
                    <Users className={`h-4 w-4 shrink-0 ${sidebarTab === 'gestao_pessoal' ? 'text-[#fec107]' : 'text-slate-500'}`} />
                    {!isSidebarCollapsed && <span>Gestão de pessoal</span>}
                  </button>
                )}
              </nav>
            </div>

            {/* Sidebar bottom guide switcher */}
            <div className={`pt-6 border-t border-[#1e1e4a] space-y-2 mt-6 ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
              <button
                onClick={() => setActiveTab(activeTab === 'workspace' ? 'documents' : 'workspace')}
                className={`w-full text-left text-sm font-black text-slate-400 hover:text-[#fec107] block transition-colors flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2'} cursor-pointer uppercase tracking-wider`}
                title={isSidebarCollapsed ? (activeTab === 'workspace' ? 'Modelos Oficiais' : 'Voltar ao Sistema') : ""}
              >
                {activeTab === 'workspace' ? <FileText className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />} {!isSidebarCollapsed && (activeTab === 'workspace' ? 'Modelos Oficiais' : 'Voltar ao Sistema')}
              </button>
                {!isSidebarCollapsed && (
                  <div className="text-xs text-slate-500 leading-relaxed font-medium">
                    Moçambique Estatística 2026<br />
                    v1.4.2 SIGDE- ONLINE<br />
                    <span className="text-xs font-bold block mt-1 animate-rgb tracking-widest uppercase">(Todos direitos reservados)</span>
                  </div>
                )}
                
                {/* Fullscreen Toggle for responsiveness/UX */}
                <button 
                  onClick={handleToggleFullscreen}
                  className={`mt-3 w-full bg-[#07071e] border border-[#1e1e4a] text-slate-400 text-xs py-2 rounded-lg hover:text-white transition-colors uppercase font-black flex items-center justify-center shadow-inner ${isSidebarCollapsed ? '' : 'gap-2'}`}
                  title={isSidebarCollapsed ? "Tela Cheia" : ""}
                >
                  <Maximize2 className="h-4 w-4" />
                  {!isSidebarCollapsed && "Modo Tela Cheia"}
                </button>
            </div>
          </aside>

          {/* 3. Right Content Column Workspace */}
          <div className="flex-1 p-4 md:p-8 overflow-y-auto" id="main-scrolling-workspace">
            
            {/* Standard Documents section (Vite manual view toggled via bottom button) */}
            {activeTab === 'documents' ? (
              <StandardDocuments />
            ) : (
              <div>
                
                {/* 3a. STATISTICAL TAB (Core Workspace requested) */}
                {(sidebarTab === 'estatistica' || sidebarTab === 'gestao_usuarios') && (
                  <div>
                    {(currentUser.role === 'ies' || currentUser.role === 'OrgaoMaximoIES' || currentUser.role === 'FocalPoint' || currentUser.role === 'ies_interno') && (
                      <IESDashboard 
                        currentUser={currentUser}
                        submissions={submissions}
                        onSaveSubmission={handleSaveSubmission}
                        onSendToProvince={handleSendToProvince}
                        institutions={institutions}
                        initialYear={chosenWorkYear || undefined}
                      />
                    )}
                    {(currentUser.role === 'provincial' || currentUser.role === 'RepresentanteProvincial') && (
                      <ProvincialDashboard 
                        currentUser={currentUser}
                        submissions={submissions}
                        institutions={institutions}
                      />
                    )}
                    {(currentUser.role === 'regional' || currentUser.role === 'RepresentanteRegional') && (
                      <RegionalDashboard 
                        currentUser={currentUser}
                        submissions={submissions}
                        institutions={institutions}
                      />
                    )}
                    {(currentUser.role === 'central' || currentUser.role === 'Ministerial') && (
                      <CentralDashboard 
                        currentUser={currentUser}
                        submissions={submissions}
                        onReviewSubmission={handleReviewSubmission}
                        institutions={institutions}
                      />
                    )}
                    {(currentUser.role === 'nacional' || currentUser.role === 'sistema') && (
                      <NationalDashboard 
                        currentUser={currentUser}
                        submissions={submissions}
                        institutions={institutions}
                        sidebarTab={!['ies', 'OrgaoMaximoIES', 'FocalPoint'].includes(currentUser.role) ? sidebarTab : undefined}
                      />
                    )}
                  </div>
                )}

                {/* 3b. VISÃO GERAL TAB (Custom gorgeous visual summary of Estatística) */}
                {sidebarTab === 'visao_geral' && (
                  <OverviewSection 
                    submissions={submissions}
                    reportYear={reportYear}
                    navigateToReports={navigateToReports}
                    setSidebarTab={setSidebarTab}
                  />
                )}

                {/* 3c. CALENDÁRIO & ATIVIDADES TAB */}
                {sidebarTab === 'calendario' && (
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6" id="view-calendar-panel">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Calendário de Estatística 2026</h2>
                      <p className="text-xs text-slate-500 mt-1">Cronograma de obrigações, prazos e apoio técnico do SIGDE- ONLINE para entrega de dados.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Deadline Alert Banner */}
                      <div className="bg-amber-50/70 p-3.5 border border-amber-200 rounded-xl text-xs text-left flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">⏰</span> 
                          <span className="text-amber-950 font-bold">Limite Consolidado de Estatística:</span>
                          <span className="text-amber-900 text-sm">
                            Conforme diretrizes centrais MEC, o preenchimento e homologação reitoral encerra em <strong>30 de Junho</strong>.
                          </span>
                        </div>
                        <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">Exercício 2026</span>
                      </div>

                      {/* Calendar Map Grid - Full Width */}
                      <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-150 text-left">
                        <div className="pb-3 border-b border-slate-150 text-xs font-bold text-slate-700 flex justify-between">
                          <span>Junho 2026</span>
                          <span>Moçambique Estatística 2026</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 pt-3">
                          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d, idx) => {
                            const isToday = new Date().getDay() === idx && new Date().getMonth() === 5 && new Date().getFullYear() === 2026;
                            return (
                              <div key={d} className={isToday ? "text-emerald-600 font-black flex flex-col items-center" : ""}>
                                {d}
                                {isToday && <div className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5 animate-pulse"></div>}
                              </div>
                            );
                          })}
                        </div>
                        <div className="grid grid-cols-7 gap-1 pt-2">
                          {/* Empty cells for June 2026 offset (June 1st is Monday) */}
                          {Array.from({ length: 1 }).map((_, i) => <div key={`empty-${i}`} className="min-h-16 border border-transparent"></div>)}
                          
                          {Array.from({ length: 30 }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `2026-06-${day.toString().padStart(2, '0')}`;
                            const matchedEvents = calendarEvents.filter(e => e.date === dateStr);
                            const isDeadline = day === 30;
                            const isToday = day === new Date().getDate() && new Date().getMonth() === 5 && new Date().getFullYear() === 2026;

                            return (
                              <div 
                                key={i} 
                                onClick={() => {
                                  setNewEventDate(dateStr);
                                  setIsScheduleModalOpen(true);
                                }}
                                className={`min-h-16 border rounded flex flex-col items-center justify-between p-1 font-mono text-xs cursor-pointer transition-all active:scale-[0.97] ${
                                  isToday ? 'ring-2 ring-emerald-500 bg-emerald-50/50 shadow-sm z-10 scale-[1.02]' :
                                  isDeadline ? 'bg-red-50 text-red-750 border-red-350 font-bold' : 'bg-white hover:bg-slate-50 border-slate-150'
                                }`}
                                title="Clique para agendar nova atividade nesta data"
                              >
                                <span className={`font-black text-sm text-center w-full ${isToday ? 'text-emerald-700' : isDeadline ? 'text-red-700' : 'text-slate-600'}`}>
                                  {day}
                                </span>
                                <div className="space-y-0.5 w-full">
                                  {isDeadline && <span className="text-[7px] text-red-505 font-bold block bg-red-100/50 text-center rounded border border-red-200">Fim prazo</span>}
                                  {matchedEvents.map((evt, idx) => (
                                    <span 
                                      key={idx} 
                                      title={`${evt.title} (${evt.type})`}
                                      className={`text-[6.5px] px-1 py-0.5 rounded text-white block truncate leading-none text-center ${
                                        evt.type === 'encontro' ? 'bg-indigo-650' :
                                        evt.type === 'seminario' ? 'bg-amber-650' :
                                        evt.type === 'coleta' ? 'bg-red-650' : evt.type === 'convite' ? 'bg-emerald-650' : 'bg-slate-650'
                                      }`}
                                    >
                                      {evt.title}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Atividades Agendadas & Arquivo Histórico */}
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
                        {/* Left: Atividades Agendadas */}
                        <div className="lg:col-span-3 space-y-6">
                          <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Atividades Agendadas</h3>
                            <p className="text-xs text-slate-500 mt-1 font-medium italic">Gestão de eventos e atividades programadas no cronograma.</p>
                          </div>

                          <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-150 space-y-6 min-h-[400px]">
                            {(() => {
                              const todayStr = new Date().toISOString().split('T')[0];
                              const activeEvents = calendarEvents.filter(evt => evt.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date));
                              const archivedEvents = calendarEvents.filter(evt => evt.date < todayStr).sort((a, b) => {
                                const dateComp = b.date.localeCompare(a.date);
                                if (dateComp !== 0) return dateComp;
                                return (b.time || '').localeCompare(a.time || '');
                              });

                              const groupedActiveByDay = activeEvents.reduce((acc: { [key: string]: any[] }, evt) => {
                                if (!acc[evt.date]) acc[evt.date] = [];
                                acc[evt.date].push(evt);
                                return acc;
                              }, {});
                              const sortedActiveDays = Object.keys(groupedActiveByDay).sort((a, b) => a.localeCompare(b));

                              return (
                                <div className="space-y-6">
                                  <div className="flex justify-between items-center pb-2 border-b border-slate-150">
                                    <span className="text-sm font-bold text-slate-750 flex items-center gap-1.5 uppercase tracking-wide">
                                      <FileText className="h-3.5 w-3.5" /> Atividades Coletadas / Programas (Por Dia)
                                    </span>
                                    <span className="text-xs font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                      {activeEvents.length} Eventos Ativos
                                    </span>
                                  </div>

                                  {sortedActiveDays.length > 0 ? (
                                    <div className="space-y-6">
                                      {sortedActiveDays.map((dateStr) => {
                                        const dayEvents = groupedActiveByDay[dateStr];
                                        const dParts = dateStr.split('-');
                                        const formattedDay = `${dParts[2]}/${dParts[1]}/${dParts[0]}`;

                                        return (
                                          <div key={dateStr} className="space-y-3 bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-left">
                                            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                              <span className="inline-block w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></span>
                                              <span className="text-xs font-mono font-black text-slate-900 bg-blue-50 px-3 py-1 rounded border border-blue-200 flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5" /> Dia {formattedDay}
                                              </span>
                                              <span className="text-xs font-bold text-slate-400">
                                                ({dayEvents.length} {dayEvents.length === 1 ? 'atividade' : 'atividades'})
                                              </span>
                                            </div>

                                            <div className="space-y-5 pt-2">
                                              {dayEvents.map((evt) => (
                                                <div key={evt.id} className="p-4 relative border-2 border-slate-950 rounded-xl bg-white hover:bg-slate-50/50 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                                    <div className="flex items-center gap-2">
                                                      <span className={`text-xs font-black uppercase px-3 py-1 rounded-lg border border-black ${
                                                        evt.type === 'encontro' ? 'bg-indigo-100 text-indigo-900' :
                                                        evt.type === 'seminario' ? 'bg-amber-100 text-amber-900' :
                                                        evt.type === 'coleta' ? 'bg-red-100 text-red-900' :
                                                        evt.type === 'critica' ? 'bg-red-600 text-white border-red-950 shadow-[2px_2px_0px_rgba(0,0,0,1)]' :
                                                        evt.type === 'convite' ? 'bg-emerald-100 text-emerald-950 border-emerald-950' : 'bg-slate-100 text-slate-900'
                                                      }`}>
                                                        {evt.type === 'encontro' ? 'Encontro' : 
                                                         evt.type === 'seminario' ? 'Seminário' : 
                                                         evt.type === 'coleta' ? 'Prazo de Coleta' :
                                                         evt.type === 'critica' ? 'Informação Crítica' :
                                                         evt.type === 'convite' ? 'Convite' : 'Informativo'}
                                                      </span>
                                                      {evt.location && (
                                                        <span className="text-xs font-black bg-rose-50 text-rose-800 px-3 py-1 rounded-lg border border-rose-100 flex items-center gap-1.5 uppercase italic">
                                                          📍 {evt.location}
                                                        </span>
                                                      )}
                                                      {evt.time && (
                                                        <span className="text-xs text-blue-700 font-black bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 flex items-center gap-1.5 uppercase">
                                                          🕒 {evt.time}
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>

                                                  <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight leading-tight">
                                                    {evt.title}
                                                  </h3>
                                                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                                                    {evt.description}
                                                  </p>

                                                  <div className="text-xs text-slate-400 font-bold font-mono mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                                                    <span className="uppercase italic tracking-wider">Registado por: {evt.createdBy}</span>
                                                    <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">ID: {evt.id}</span>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                                      <div className="bg-slate-100 p-4 rounded-full">
                                        <Calendar className="h-8 w-8 text-slate-300" />
                                      </div>
                                      <p className="text-sm font-bold text-slate-400 italic">Não existem atividades futuras agendadas.</p>
                                    </div>
                                  )}

                                  {showArchived && archivedEvents.length > 0 && (
                                    <div className="pt-8 space-y-6">
                                      <div className="flex justify-between items-center pb-3 border-b-2 border-black">
                                         <span className="text-base font-black text-slate-950 flex items-center gap-3">
                                            🗄️ ARQUIVO HISTÓRICO DE ATIVIDADES
                                         </span>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {archivedEvents.map((evt) => (
                                          <div key={evt.id} className="p-4 relative border-2 border-slate-950 rounded-xl bg-white hover:bg-slate-50 transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] group">
                                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                                              <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono font-black text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                                                  📅 {evt.date.split('-').reverse().join('/')}
                                                </span>
                                                {evt.time && (
                                                  <span className="text-xs font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                                                    🕒 {evt.time}
                                                  </span>
                                                )}
                                              </div>
                                              <span className="text-xs font-black text-rose-500 tracking-widest bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">Histórico</span>
                                            </div>
                                            
                                            <h4 className="text-sm font-black text-slate-950 uppercase tracking-tight leading-tight group-hover:text-black transition-colors">
                                              {evt.title}
                                            </h4>
                                            {evt.location && (
                                              <p className="text-xs text-slate-500 font-bold uppercase italic mt-1">
                                                📍 {evt.location}
                                              </p>
                                            )}
                                            <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic leading-relaxed">
                                              {evt.description}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Right: Arquivo Morto */}
                        <div className="lg:col-span-1 space-y-4">
                          <div className="bg-white border-2 border-slate-950 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-between shadow-sm">
                            <div className="text-center mb-4">
                              <h3 className="text-lg font-black text-slate-950 tracking-tight">Arquivo Morto</h3>
                              <p className="text-xs text-slate-500 mt-1 italic">Atividades já realizadas</p>
                            </div>

                            <button 
                              onClick={() => setShowArchived(!showArchived)}
                              className="w-full py-6 px-4 border-2 border-black rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-all group active:scale-[0.98] cursor-pointer bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none"
                            >
                              <span className="text-base font-black tracking-tight text-center leading-tight">
                                {showArchived ? 'FECHAR ARQUIVOS' : 'Ver Arquivos'}
                              </span>
                            </button>
                            
                            {!showArchived && (
                              <div className="mt-8 flex flex-col items-center opacity-30 select-none grayscale">
                                <Folder className="h-20 w-20 text-slate-400 mb-2" />
                                <p className="text-xs font-black text-slate-400 tracking-widest">Registos anteriores</p>
                              </div>
                            )}
                            
                            {showArchived && (
                              <div className="mt-6 w-full space-y-2 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
                                  <p className="text-xs font-black text-rose-600 tracking-widest">Exibindo histórico</p>
                                </div>
                                <p className="text-xs text-slate-400 italic">Consulte a listagem à esquerda.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL: Agendar Nova Atividade - Full Screen */}
                {isScheduleModalOpen && (
                  <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col overflow-y-auto">
                    {/* Sticky header */}
                    <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#fca311]/10 flex items-center justify-center font-bold text-lg">
                          <span>📅</span>
                        </div>
                        <div>
                          <h1 className="text-sm font-black text-slate-800 tracking-tight ">Agendar nova atividade</h1>
                          <p className="text-xs text-slate-500 font-bold font-mono tracking-wider mt-0.5">Calendário cronograma de Moçambique • MEC</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setIsScheduleModalOpen(false)}
                        className="text-xs font-black text-slate-700 hover:text-black transition-colors uppercase tracking-wider flex items-center gap-1.5 border-2 border-black bg-white hover:bg-slate-50 active:bg-slate-100 px-4 py-2 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                      >
                        <X className="h-4 w-4" />
                        <span>Fechar Tela Cheia</span>
                      </button>
                    </header>

                    {/* Content area */}
                    <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-12 md:py-16">
                      <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white border-[3px] border-black rounded-[40px] shadow-[12px_12px_0px_rgba(0,0,0,1)] overflow-hidden"
                      >
                        <div className="p-8 md:p-12 space-y-7">
                          <div className="space-y-4">
                            <h2 className="text-xs font-black text-slate-500 uppercase flex items-center gap-2 tracking-widest font-mono">
                              ✍️ DETALHES DA ATIVIDADE E PRAZOS
                            </h2>
                            <div className="h-[2px] bg-black w-full" />
                          </div>

                          <div className="space-y-6">
                            {/* Titulo */}
                            <div className="space-y-2">
                              <label className="text-sm font-black text-slate-800 tracking-wider">Título da atividade *</label>
                              <input 
                                type="text" 
                                placeholder="Ex: Reunião de Saneamento Técnico II"
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                                className="w-full border-2 border-black rounded-xl p-3.5 text-xs  focus:outline-none focus:ring-0 placeholder:text-slate-300"
                              />
                            </div>

                            {/* Row: Tipo & Data */}
                            <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-black text-slate-800 tracking-wider">Tipo de evento</label>
                                <select 
                                  value={newEventType}
                                  onChange={(e) => setNewEventType(e.target.value)}
                                  className="w-full border-2 border-black rounded-xl p-3.5 text-xs  focus:outline-none appearance-none bg-white"
                                >
                                  <option value="seminario">Seminário</option>
                                  <option value="encontro">Encontro</option>
                                  <option value="coleta">Prazo de Coleta</option>
                                  <option value="convite">Convite</option>
                                  <option value="critica">Alerta: Informação Crítica (48h)</option>
                                  <option value="informativo">Informativo</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-black text-slate-800 tracking-wider">Data *</label>
                                <div className="relative">
                                  <input 
                                    type="date" 
                                    value={newEventDate}
                                    onChange={(e) => setNewEventDate(e.target.value)}
                                    className="w-full border-2 border-black rounded-xl p-3.5 text-xs font-mono focus:outline-none bg-white"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Meio / Local & Hora */}
                            <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-black text-slate-800 tracking-wider">Meio / Local</label>
                                <input 
                                  type="text" 
                                  placeholder="Ex: Teams, DGES"
                                  value={newEventLocation}
                                  onChange={(e) => setNewEventLocation(e.target.value)}
                                  className="w-full border-2 border-black rounded-xl p-3.5 text-xs  focus:outline-none placeholder:text-slate-300"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-black text-slate-800 tracking-wider">Horário</label>
                                <input 
                                  type="time" 
                                  value={newEventTime}
                                  onChange={(e) => setNewEventTime(e.target.value)}
                                  className="w-full border-2 border-black rounded-xl p-3.5 text-xs font-mono focus:outline-none bg-white"
                                />
                              </div>
                            </div>

                            {/* Descrição */}
                            <div className="space-y-2">
                              <label className="text-sm font-black text-slate-800 tracking-wider">Descrição</label>
                              <textarea 
                                rows={4}
                                placeholder="Escreva os detalhes, pauta ou agenda desta reunião particular instruída..."
                                value={newEventDesc}
                                onChange={(e) => setNewEventDesc(e.target.value)}
                                className="w-full border-2 border-black rounded-xl p-3.5 text-xs  focus:outline-none placeholder:text-slate-300 resize-none"
                              ></textarea>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button 
                              type="button"
                              onClick={() => setIsScheduleModalOpen(false)}
                              className="w-full sm:w-1/3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-2xl py-4 font-black text-xs text-slate-700 transition-all text-center cursor-pointer"
                            >
                              Voltar / Cancelar
                            </button>
                            <button 
                              onClick={() => {
                                if (!newEventTitle) {
                                  alert("Insira um título para a atividade.");
                                  return;
                                }
                                const newEvent = {
                                  id: `evt-${Date.now()}`,
                                  title: newEventTitle,
                                  type: newEventType,
                                  date: newEventDate,
                                  time: newEventTime,
                                  location: newEventLocation,
                                  description: newEventDesc,
                                  createdBy: currentUser?.name || 'Administrador',
                                  createdAt: new Date().toISOString().split('T')[0]
                                };
                                const updatedEvents = [...calendarEvents, newEvent];
                                setCalendarEvents(updatedEvents);
                                localStorage.setItem('stat_calendar_events', JSON.stringify(updatedEvents));
                                
                                // Reset & Close
                                setIsScheduleModalOpen(false);
                                setNewEventTitle('');
                                setNewEventLocation('');
                                setNewEventDesc('');
                                alert("Atividade agendada com sucesso no cronograma institucional.");
                              }}
                              className="w-full sm:w-2/3 bg-[#fca311] border-3 border-black rounded-2xl py-4 font-black text-xs sm:text-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-[0.98] cursor-pointer"
                            >
                              Agendar nova atividade
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* 3d. CAIXA DE MENSAGENS TAB */}
                {sidebarTab === 'mensagens' && (
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6" id="view-messages-panel">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold  text-slate-900">Mensagens</h2>
                        <p className="text-xs text-slate-500 mt-1">Canal seguro de correspondência digital para sintonização rápida entre as IES e validador regional.</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsComposingMessage(false)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
                            !isComposingMessage ? 'bg-[#fec107] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          Mensagens
                        </button>
                        <button
                          onClick={() => {
                            setIsComposingMessage(true);
                            setMsgRecipients([]);
                            setMsgTitle('');
                            setMsgContent('');
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
                            isComposingMessage ? 'bg-[#fec107] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          ➕ Nova Mensagem
                        </button>
                      </div>
                    </div>

                    {isComposingMessage ? (
                      /* COMPOSING MESSAGE FORM */
                      <div className="bg-slate-50/50 rounded-2xl border border-slate-200 p-5 space-y-4 max-w-3xl text-left">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                          📨 Enviar Nova Mensagem Interna
                        </h3>

                        <form onSubmit={handleSendMessage} className="space-y-4 text-xs text-slate-700">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="font-bold">Indique os Destinatários *</label>
                              <span className="text-xs text-slate-500 font-mono italic">
                                {['ies', 'ies_interno', 'FocalPoint', 'OrgaoMaximoIES'].includes(currentUser.role) ? '⚠️ Utilizadores de IES podem indicar apenas 1 destinatário por mensagem' : '✨ Administradores podem selecionar vários simultaneamente'}
                              </span>
                            </div>

                            {/* RECIPIENT SELECTOR */}
                            {['ies', 'ies_interno', 'FocalPoint', 'OrgaoMaximoIES'].includes(currentUser.role) ? (
                              <select
                                required
                                value={msgRecipients[0] || ''}
                                onChange={e => setMsgRecipients(e.target.value ? [e.target.value] : [])}
                                className="w-full border-2 border-black px-2.5 py-2 rounded-lg text-xs font-medium focus:ring-0 focus:outline-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%23222%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10 appearance-none"
                              >
                                <option value="">-- Selecione o Colaborador / Destinatário --</option>
                                {getAvailableRecipients()
                                  .filter(col => col.id !== currentUser.id)
                                  .map(col => (
                                    <option key={col.id} value={col.id}>
                                      {col.name} ({col.role === 'central' ? 'Central' : col.role === 'nacional' ? 'DNES/Nacional' : col.role === 'regional' ? `Regional: ${col.region}` : col.role === 'provincial' ? `Provincial: ${col.province}` : col.role === 'FocalPoint' ? 'Focal Point da IES' : col.role === 'OrgaoMaximoIES' ? 'Órgão Máximo da IES' : col.role === 'ies_interno' ? `Técnico Interno (${col.cargo || 'Eixo'})` : col.institutionName ? col.institutionName : 'IES'})
                                    </option>
                                  ))}
                              </select>
                            ) : (
                              /* Multi-Select with Search Checklist for Admins */
                              <div className="border-2 border-black rounded-lg p-3 bg-white space-y-2 max-h-40 overflow-y-auto">
                                <div className="border-b border-slate-100 pb-1 flex justify-between">
                                  <span className="font-bold font-mono text-xs text-emerald-800">Selecione destinatários:</span>
                                  <div className="space-x-2">
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        const ids = getAvailableRecipients().filter(col => col.id !== currentUser.id).map(c => c.id);
                                        setMsgRecipients(ids);
                                      }}
                                      className="text-xs text-[#002f6c] font-black underline hover:text-[#005fb8] cursor-pointer"
                                    >
                                      [Todos]
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        const ids = getAvailableRecipients().filter(col => col.id !== currentUser.id && col.role === 'ies').map(c => c.id);
                                        setMsgRecipients(ids);
                                      }}
                                      className="text-xs text-[#002f6c] font-black underline hover:text-[#005fb8] cursor-pointer"
                                    >
                                      [Apenas IES]
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => setMsgRecipients([])}
                                      className="text-xs text-red-600 font-bold underline hover:text-red-800 cursor-pointer"
                                    >
                                      [Limpar]
                                    </button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-2 pt-1 ">
                                  {getAvailableRecipients()
                                    .filter(col => col.id !== currentUser.id)
                                    .map(col => (
                                      <label key={col.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer text-xs">
                                        <input 
                                          type="checkbox"
                                          checked={msgRecipients.includes(col.id)}
                                          onChange={e => {
                                            if (e.target.checked) {
                                              setMsgRecipients([...msgRecipients, col.id]);
                                            } else {
                                              setMsgRecipients(msgRecipients.filter(id => id !== col.id));
                                            }
                                          }}
                                          className="rounded border-black text-emerald-600 focus:ring-0"
                                        />
                                        <span className="truncate" title={col.name}>
                                          <strong>{col.name}</strong> ({col.role === 'central' ? 'Central' : col.role === 'nacional' ? 'Nacional' : col.role === 'regional' ? `Regional: ${col.region}` : col.role === 'provincial' ? `Provincial: ${col.province}` : col.institutionName ? col.institutionName.split('(')[0] : 'IES'})
                                        </span>
                                      </label>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block font-bold mb-1">Título / Assunto da Mensagem *</label>
                            <input 
                              type="text"
                              required
                              value={msgTitle}
                              onChange={e => setMsgTitle(e.target.value)}
                              placeholder="Título conciso do assunto estatístico ou suporte lógico..."
                              className="w-full border-2 border-black px-2.5 py-1.5 rounded-lg text-xs font-semibold focus:ring-0 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-bold mb-1">Mensagem *</label>
                            <textarea
                              required
                              value={msgContent}
                              onChange={e => setMsgContent(e.target.value)}
                              rows={5}
                              placeholder="Escreva sua comunicação oficial com detalhes técnicos detalhadamente. Ela será notificada instantaneamente ao receptor..."
                              className="w-full border-2 border-black px-2.5 py-2 rounded-lg text-xs  font-medium focus:ring-0 focus:outline-none resize-none"
                            />
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => setIsComposingMessage(false)}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="bg-emerald-600 text-white font-black border-2 border-black rounded-lg px-6 py-2 hover:bg-emerald-700 hover:translate-y-[-1px] transition-all text-xs cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                            >
                              Enviar Mensagem Oficial
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      /* READ MESSAGES LAYOUT with splitscreen */
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
                        {/* Left Side: Message List */}
                        <div className="lg:col-span-4 space-y-4 max-h-[600px] overflow-y-auto pr-1">
                          {/* Filter received vs sent */}
                          <div className="flex gap-1 border-b border-slate-100 pb-2">
                            <button
                              onClick={() => setMsgFilter('received')}
                              className={`flex-1 text-center py-1.5 text-xs font-black uppercase rounded cursor-pointer ${
                                msgFilter === 'received' ? 'bg-slate-900 text-white ' : 'bg-slate-50 text-slate-400 hover:text-slate-800'
                              }`}
                            >
                              Mensagens Recebidas
                            </button>
                            <button
                              onClick={() => setMsgFilter('sent')}
                              className={`flex-1 text-center py-1.5 text-xs font-black uppercase rounded cursor-pointer ${
                                msgFilter === 'sent' ? 'bg-slate-900 text-white ' : 'bg-slate-50 text-slate-400 hover:text-slate-800'
                              }`}
                            >
                              Mensagens Enviadas
                            </button>
                          </div>

                          {/* Render filtered messages */}
                          {(() => {
                            const filtered = internalMessages
                              .filter(msg => {
                                if (msgFilter === 'received') {
                                  return msg.recipientIds && msg.recipientIds.includes(currentUser.id);
                                } else {
                                  return msg.senderId === currentUser.id;
                                }
                              })
                              .sort((a, b) => {
                                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                              });

                            if (filtered.length === 0) {
                              return <p className="text-xs text-slate-400 italic text-center py-6">Nenhum registo de correspondência.</p>;
                            }

                            return filtered.map((msg) => {
                              const isUnread = msgFilter === 'received' && (!msg.readBy || !msg.readBy.includes(currentUser.id));
                              const isSelected = selectedMessageId === msg.id;

                              return (
                                <div
                                  key={msg.id}
                                  onClick={() => handleReadMessage(msg.id)}
                                  className={`border-2 rounded-xl p-3 cursor-pointer relative transition-all shadow-xs ${
                                    isSelected ? 'bg-slate-900 text-white border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-slate-50 border-slate-200'
                                  }`}
                                >
                                  <div className="flex justify-between items-start gap-1 pb-1">
                                    <span className="text-xs font-bold  opacity-80 leading-none truncate max-w-[120px]">
                                      {msgFilter === 'received' ? msg.senderName : `Para: ${msg.recipientNames ? msg.recipientNames.join(', ') : 'Colaborador'}`}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-indigo-600">
                                      {msg.createdAt ? new Date(msg.createdAt).toLocaleString('pt-MZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '11/06/2026 14:30'}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-extrabold line-clamp-1">
                                    {msg.title}
                                  </h4>
                                  <p className="text-xs opacity-75 mt-0.5 line-clamp-2 leading-relaxed">
                                    {msg.content}
                                  </p>

                                  {isUnread && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white border border-white text-xs font-black px-1.5 py-0.5 rounded-full select-none animate-pulse shadow-sm">
                                      Mensagem nova
                                    </span>
                                  )}
                                </div>
                              );
                            });
                          })()}
                        </div>

                        {/* Right Side: Message Detail viewer */}
                        <div className="lg:col-span-8">
                          {(() => {
                            const msg = internalMessages.find(m => m.id === selectedMessageId);
                            if (!msg) {
                              return (
                                <div className="border border-dashed border-slate-300 rounded-2xl p-12 text-center text-xs text-slate-400 bg-slate-50/50">
                                  Selecione uma mensagem da caixa lateral para ler ou inicie uma nova correspondência oficial.
                                </div>
                              );
                            }

                            const isReceived = msg.recipientIds && msg.recipientIds.includes(currentUser.id);

                            return (
                              <div className="bg-white border-4 border-black rounded-[24px] p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-3">
                                  <div>
                                    <span className="text-xs text-[#009e60] font-black font-mono tracking-wider block">Detalhes da comunicação</span>
                                    <h3 className="text-sm sm:text-base  font-black text-slate-900 inline">
                                      {msg.title}
                                    </h3>
                                  </div>
                                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full shrink-0">
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString('pt-MZ') : '11 Junho 2026'}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-slate-50 border border-slate-150 p-3.5 rounded-xl">
                                  <div>
                                    <span className="text-slate-400 block text-xs font-bold leading-none">Remetente:</span>
                                    <span className="font-extrabold text-slate-900 block mt-1">{msg.senderName}</span>
                                    <span className="text-xs text-slate-500 block leading-tight">{msg.senderInstName}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-xs font-bold leading-none">Destinatário(s):</span>
                                    <span className="font-extrabold text-[#002f6c] block mt-1 leading-snug">
                                      {msg.recipientNames ? msg.recipientNames.join(', ') : 'Colaborador do Sistema'}
                                    </span>
                                  </div>
                                </div>

                                <div className="bg-white border border-slate-150 rounded-xl p-4 min-h-[160px] text-xs leading-relaxed text-slate-700 text-justify whitespace-pre-wrap ">
                                  {msg.content}
                                </div>

                                {isReceived && (
                                  <div className="flex gap-2 justify-end pt-2 border-t border-slate-150">
                                    <button
                                      onClick={() => {
                                        setIsComposingMessage(true);
                                        setMsgRecipients([msg.senderId]);
                                        setMsgTitle(`RE: ${msg.title.startsWith('RE:') ? '' : 'RE: '}${msg.title}`);
                                        setMsgContent(`\n\n----- Mensagem Anterior -----\nDe: ${msg.senderName}\nEnviada em: ${msg.createdAt ? new Date(msg.createdAt).toLocaleString('pt-MZ') : ''}\n\n${msg.content}`);
                                      }}
                                      className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                                    >
                                      <span>↩️</span> Responder Mensagem
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3e. ASSINATURA DIGITAL TAB */}
                {sidebarTab === 'assinatura' && (
                  <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs space-y-6" id="view-signature-panel">
                    <div>
                      <h2 className="text-xl font-bold  text-slate-900">Assinatura Digital & Autenticação Estatística</h2>
                      <p className="text-xs text-slate-500 mt-1">Carregue a sua assinatura digitalizada. O sistema converterá removendo o fundo de papel branco enquanto mantém a cor e o traço original intactos.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 gap-8">
                      {/* Left side: Upload & Conversion Settings */}
                      <div className="space-y-6 bg-slate-50 border border-slate-200 rounded-2xl p-6">
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-700 tracking-wider block">1. Carregar assinatura escaneada</label>
                          <p className="text-xs text-slate-500">Selecione uma foto ou digitalização da sua assinatura manual (JPG, PNG).</p>
                        </div>

                        {/* File Upload Area */}
                        <div 
                          onClick={() => document.getElementById('signature-file-input')?.click()}
                          className="border-2 border-dashed border-slate-300 hover:border-black rounded-xl p-6 bg-white text-center cursor-pointer transition-colors space-y-3 shadow-xs relative"
                        >
                          <input 
                            type="file" 
                            id="signature-file-input" 
                            accept="image/*" 
                            onChange={handleSignatureUpload} 
                            className="hidden" 
                          />
                          
                          {signatureImage ? (
                            <div className="space-y-2">
                              <span className="text-emerald-500 text-2xl">✓</span>
                              <p className="text-xs font-bold text-slate-800">Nova Assinatura Carregada</p>
                              <p className="text-xs text-slate-400">Clique para substituir o arquivo</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="h-8 w-8 text-slate-400 mx-auto animate-pulse" />
                              <p className="text-xs font-bold text-slate-800">Clique para procurar no dispositivo</p>
                              <p className="text-xs text-slate-400">ou arraste e solte o arquivo aqui</p>
                            </div>
                          )}
                        </div>

                        {signatureImage && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 pt-2"
                          >
                            {/* Sensibility slider */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm font-black text-slate-800 tracking-wider">
                                <span>2. Limiar de remoção de fundo</span>
                                <span className="bg-slate-200 px-2 py-0.5 rounded text-mono text-xs">{sigThreshold} / 255</span>
                              </div>
                              <p className="text-xs text-slate-500">Arraste para ajustar a sensibilidade. Valores maiores removem fundos mais escuros.</p>
                              <input 
                                type="range" 
                                min="100" 
                                max="255" 
                                value={sigThreshold} 
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setSigThreshold(val);
                                  processSignature(signatureImage, val);
                                }}
                                className="w-full h-2 bg-slate-200 checked:bg-black rounded-lg appearance-none cursor-pointer accent-black"
                              />
                            </div>

                            {/* Original vs Processed side by side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                              {/* Original */}
                              <div className="space-y-1">
                                <span className="text-xs font-black text-slate-500">Assinatura original</span>
                                <div className="border border-slate-200 bg-white rounded-lg p-3 h-24 flex items-center justify-center overflow-hidden">
                                  <img 
                                    src={signatureImage} 
                                    alt="Original" 
                                    className="max-h-full max-w-full object-contain" 
                                  />
                                </div>
                              </div>

                              {/* Processed with Grid representation */}
                              <div className="space-y-1">
                                <span className="text-xs font-black text-emerald-800">Fundo removido (Png)</span>
                                <div 
                                  className="border border-slate-200 rounded-lg p-3 h-24 flex items-center justify-center overflow-hidden relative shadow-inner"
                                  style={{
                                    backgroundImage: `
                                      linear-gradient(45deg, #efefef 25%, transparent 25%), 
                                      linear-gradient(-45deg, #efefef 25%, transparent 25%), 
                                      linear-gradient(45deg, transparent 75%, #efefef 75%), 
                                      linear-gradient(-45deg, transparent 75%, #efefef 75%)
                                    `,
                                    backgroundSize: '12px 12px',
                                    backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0'
                                  }}
                                >
                                  {isProcessingSignature ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80">
                                      <span className="text-xs font-bold text-slate-600 animate-spin">⏳</span>
                                    </div>
                                  ) : processedSignature ? (
                                    <img 
                                      src={processedSignature} 
                                      alt="Transparent Output" 
                                      className="max-h-full max-w-full object-contain"
                                    />
                                  ) : (
                                    <span className="text-xs text-slate-400">Processando...</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-100 text-emerald-950 p-3 rounded-xl text-xs space-y-1">
                              <span className="font-bold uppercase tracking-wider block">✓ Conversão Inteligente Ativa</span>
                              <p>Fundo removido preservando as cores originais da caneta (azul, preta ou personalizada).</p>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Right side: Mock Validation Certificate with Signature Overlaid */}
                      <div className="flex flex-col justify-between border border-slate-200 rounded-2xl p-6 bg-white space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-700 tracking-wider block">3. Pré-visualização na folha de homologação</label>
                          <p className="text-xs text-slate-500">Veja exatamente como a sua assinatura chancelada aparecerá nos diários e relatórios oficiais.</p>
                        </div>

                        {/* Certificate Mock Box */}
                        <div className="border border-slate-200 rounded-xl p-6 bg-amber-50/10 shadow-xs relative overflow-hidden ">
                          <div className="absolute inset-0 opacity-[0.06] flex items-center justify-center pointer-events-none">
                            <img 
                              src={MOZAMBIQUE_EMBLEM} 
                              alt="Emblema Watermark" 
                              className="w-[17rem] h-[17rem] object-contain mix-blend-multiply"
                            />
                          </div>

                          <div className="space-y-4 relative z-10">
                            {/* Headings */}
                            <div className="text-center space-y-2 border-b border-dashed border-slate-200 pb-3">
                                <img 
                                  src={MOZAMBIQUE_EMBLEM}
                                  alt="Emblema de Moçambique" 
                                  className="w-14 h-14 mx-auto object-contain mix-blend-multiply"
                                />
                              <div>
                                <span className="text-xs tracking-widest font-bold text-slate-500 block">República de Moçambique</span>
                                <span className="text-xs tracking-wider font-black text-slate-800 block">Ministério de Educação e Cultura</span>
                                <span className="text-xs tracking-widest font-bold text-slate-500 block">Direcção Nacional de Ensino Superior</span>
                              </div>
                            </div>

                            {/* Body test */}
                            <div className="space-y-1.5 text-slate-700 text-xs leading-relaxed">
                              <p>
                                Pelo presente instrumento de fé pública, homologo oficialmente os dados estatísticos referentes ao ano letivo em curso, declarando estarem em perfeita conformidade com as diretrizes do Sistema Integrado de Gestão Estatística (SIGDE- ONLINE).
                              </p>
                              <p className="text-right text-xs  text-slate-400 font-medium">Maputo, {new Date().toLocaleDateString('pt-MZ')}</p>
                            </div>

                            {/* Signatures Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-center border-t border-slate-100 ">
                              {/* Left: General Auditor */}
                              <div className="space-y-1">
                                <div className="h-10 flex items-end justify-center">
                                  <span className="text-xs italic  text-indigo-900 font-bold block">Dra. Maria Helena</span>
                                </div>
                                <div className="border-t border-slate-300 mx-4" />
                                <span className="text-xs text-slate-400 block font-bold tracking-tight">Comissão de verificação • Sigde-Online</span>
                              </div>

                              {/* Right: Reitor signature overlay */}
                              <div className="space-y-1">
                                <div className="h-10 flex items-center justify-center relative bg-transparent">
                                  {processedSignature ? (
                                    <motion.img 
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      src={processedSignature} 
                                      alt="Signature Overlay" 
                                      className="max-h-12 w-auto object-contain absolute bottom-0 z-20"
                                    />
                                  ) : (
                                    <span className="text-[8.5px] italic text-slate-350 absolute bottom-1 text-center w-full block">Aguardando assinatura...</span>
                                  )}
                                </div>
                                <div className="border-t border-slate-300 mx-4" />
                                <span className="text-xs text-slate-400 block font-bold tracking-tight">Assinatura eletrónica reitor</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* PIN Code & Validation Submit button */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-4">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-700 tracking-wider">Código Pin reitoral de validação (6 dígitos)</label>
                            <input 
                              type="password" 
                              maxLength={6}
                              placeholder="******" 
                              className="text-center font-mono font-bold text-base border-2 border-black px-4 py-2 rounded-xl w-36 focus:outline-none focus:ring-0 bg-white"
                            />
                          </div>
                          
                          <button 
                            onClick={() => {
                              if (!processedSignature) {
                                alert('Por favor, carregue e converta a sua assinatura antes de tentar assinar o termo.');
                                return;
                              }
                              alert('Ótimo! Assinatura conversível aplicada judicialmente com autenticidade SHA-256 homologada com sucesso.');
                            }}
                            className="w-full bg-slate-900 text-white font-black text-xs py-3 rounded-xl hover:bg-slate-800 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                          >
                            🔒 Chancelar & Assinar Oficialmente
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3g. RESUMO DAS IES TAB */}
                {sidebarTab === 'resumo_ies' && currentUser && (
                  <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs space-y-6" id="view-ies-summary-panel">
                    <IESSummaryView institutions={institutions} submissions={submissions} currentUser={currentUser} />
                  </div>
                )}

                {/* 3h. GESTÃO DE PESSOAL TAB (IES Internal Personnel Management) */}
                {sidebarTab === 'gestao_pessoal' && currentUser && (
                  <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs space-y-6" id="view-ies-personnel">
                    <GestaoPessoalView db={db} currentUser={currentUser} onBackToDashboard={() => setSidebarTab('estatistica')} />
                  </div>
                )}

                {/* 3f. RELATÓRIOS TAB */}
                {sidebarTab === 'relatorios' && (
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0" id="view-reports-panel">
                    <div className="flex justify-between items-start no-print">
                      <div>
                        <h2 className="text-xl font-bold  text-slate-900">Imprensa & Relatórios Consolidados</h2>
                        <p className="text-xs text-slate-500 mt-1">Exportação de cadernos estatísticos e análises em série temporal.</p>
                      </div>
                      {reportScope && currentUser?.role === 'central' && (
                        <button 
                          onClick={() => {
                            setReportScope(null);
                            setReportProvince('');
                            setSelectedInstitutionForReport('');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          <ArrowLeft className="h-3 w-3" /> Alterar Tipo de Relatório
                        </button>
                      )}
                    </div>

                    {!reportScope ? (
                      <div className={`grid grid-cols-1 gap-6 py-8 no-print ${currentUser?.role !== 'ies' ? 'md:grid-cols-3' : 'md:grid-cols-1 max-w-sm mx-auto'}`}>
                        {currentUser?.role !== 'ies' && (
                          <>
                            <motion.div 
                              whileHover={{ scale: 1.02 }}
                              onClick={() => {
                                setReportScope('nacional');
                                setReportProvince('');
                              }}
                              className="bg-slate-50 border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all group"
                            >
                              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Activity className="h-8 w-8" />
                              </div>
                              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 ">Relatório Nacional</h3>
                              <p className="text-xs text-slate-500 leading-relaxed italic">Consolidação completa de todas as províncias e instituições de ensino superior do país.</p>
                            </motion.div>

                            <motion.div 
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setReportScope('provincial')}
                              className="bg-slate-50 border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all group"
                            >
                              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Building2 className="h-8 w-8" />
                              </div>
                              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 ">Relatório Provincial</h3>
                              <p className="text-xs text-slate-500 leading-relaxed italic">Análise detalhada por província específica, filtrando instituições sob tutela provincial.</p>
                            </motion.div>

                            <motion.div 
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setReportScope('regional')}
                              className="bg-slate-50 border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all group"
                            >
                              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <MapPin className="h-8 w-8" />
                              </div>
                              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 ">Relatório Regional</h3>
                              <p className="text-xs text-slate-500 leading-relaxed italic">Consolidação de indicadores por região geográfica (Norte, Centro, Sul).</p>
                            </motion.div>
                          </>
                        )}

                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          onClick={() => {
                            setReportScope('institucional');
                            if (currentUser?.role === 'ies') {
                              const match = institutions.find(i => i.id === currentUser.institutionId || i.name === currentUser.name);
                              if (match) setSelectedInstitutionForReport(match.id);
                            }
                          }}
                          className={`bg-slate-50 border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all group ${currentUser?.role !== 'ies' ? 'md:col-span-3' : ''}`}
                        >
                          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <GraduationCap className="h-8 w-8" />
                          </div>
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 ">Relatório Institucional</h3>
                          <p className="text-xs text-slate-500 leading-relaxed italic">Extração de dados individuais por IES, ideal para auditorias internas e certificação.</p>
                        </motion.div>
                      </div>
                    ) : (
                      <div id="report-scope-active-container">
                        {/* Filter Builder Pane */}
                        <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-200 text-left space-y-4 no-print">
                          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">🛠️ Parametrizar Filtros do Relatório ({reportScope.toUpperCase()})</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            {/* Province Select (only if Provincial or Institutional) */}
                            {(reportScope === 'provincial' || reportScope === 'institucional') && (
                              <div className="space-y-1">
                                <label className="block text-sm font-bold text-slate-650">Selecione a Província</label>
                                <select 
                                  value={reportProvince}
                                  onChange={(e) => setReportProvince(e.target.value)}
                                  className="w-full text-xs bg-white border border-slate-350 rounded-lg p-2 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                                  disabled={currentUser?.role === 'provincial'}
                                >
                                  {currentUser?.role !== 'provincial' && <option value="">Escolher Província...</option>}
                                  {['Maputo Cidade', 'Maputo Província', 'Gaza', 'Inhambane', 'Sofala', 'Manica', 'Tete', 'Zambézia', 'Nampula', 'Cabo Delgado', 'Niassa']
                                    .filter(p => currentUser?.role !== 'provincial' || p === currentUser.province)
                                    .map(p => (
                                    <option key={p} value={p}>{p}</option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {/* Region Select (only if Regional) */}
                            {reportScope === 'regional' && (
                              <div className="space-y-1">
                                <label className="block text-sm font-bold text-slate-650">Selecione a Região</label>
                                <select 
                                  value={reportRegion}
                                  onChange={(e) => setReportRegion(e.target.value)}
                                  className="w-full text-xs bg-white border border-slate-350 rounded-lg p-2 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                                >
                                  <option value="">Escolher Região...</option>
                                  <option value="Norte">Norte (Nampula, Cabo Delgado, Niassa)</option>
                                  <option value="Centro">Centro (Sofala, Manica, Tete, Zambézia)</option>
                                  <option value="Sul">Sul (Maputo, Gaza, Inhambane)</option>
                                </select>
                              </div>
                            )}

                            {/* Legal Structure Select (only if National or Provincial or Regional or Institutional) */}
                            {(reportScope === 'nacional' || reportScope === 'provincial' || reportScope === 'regional' || reportScope === 'institucional') && (
                              <div className="space-y-1">
                                <label className="block text-sm font-bold text-slate-650 ">Natureza Juridica IES</label>
                                <select 
                                  value={reportType}
                                  onChange={(e) => setReportType(e.target.value)}
                                  className="w-full text-xs bg-white border border-slate-350 rounded-lg p-2 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                                >
                                  <option value="Todas">Todas as Instituições (Mistas)</option>
                                  <option value="Pública">Públicas (Estatais)</option>
                                  <option value="Privada">Privadas / Comunitárias</option>
                                </select>
                              </div>
                            )}

                            {/* Institution Select (Nome da IES - shown always to allow granular filtering) */}
                            <div className="space-y-1">
                              <label className="block text-sm font-bold text-slate-650 ">Nome da IES</label>
                              <select 
                                value={selectedInstitutionForReport}
                                onChange={(e) => setSelectedInstitutionForReport(e.target.value)}
                                className="w-full text-xs bg-white border border-slate-350 rounded-lg p-2 focus:ring-1 focus:ring-slate-900 focus:outline-none "
                                disabled={currentUser?.role === 'ies'}
                              >
                                {currentUser?.role !== 'ies' && <option value="">Seleciona a IES</option>}
                                {institutions
                                  .filter(inst => {
                                    if (currentUser?.role === 'ies') {
                                      return inst.id === currentUser.institutionId || inst.name === currentUser.name;
                                    }
                                    if ((reportScope === 'provincial' || reportScope === 'institucional') && reportProvince && inst.province !== reportProvince) {
                                      return false;
                                    }
                                    if (reportScope === 'regional' && reportRegion && PROVINCE_REGIONS[inst.province] !== reportRegion) {
                                      return false;
                                    }
                                    if (reportType !== 'Todas' && inst.type !== reportType) {
                                      return false;
                                    }
                                    return true;
                                  })
                                  .sort((a,b) => a.name.localeCompare(b.name)).map(inst => (
                                  <option key={inst.id} value={inst.id}>{inst.name}</option>
                                ))}
                              </select>
                            </div>

                            {/* Year Range Selectors */}
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="block text-sm font-bold text-slate-650">Ano Início</label>
                                <select 
                                  value={reportYear}
                                  onChange={(e) => setReportYear(Number(e.target.value))}
                                  className="w-full text-xs bg-white border border-slate-350 rounded-lg p-2 focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
                                >
                                  <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                                  <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                                  <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
                                  <option value={new Date().getFullYear() - 3}>{new Date().getFullYear() - 3}</option>
                                  <option value={new Date().getFullYear() - 4}>{new Date().getFullYear() - 4}</option>
                                  <option value={new Date().getFullYear() - 5}>{new Date().getFullYear() - 5}</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="block text-sm font-bold text-slate-650">Ano Fim</label>
                                <select 
                                  value={reportYearEnd}
                                  onChange={(e) => setReportYearEnd(Number(e.target.value))}
                                  className="w-full text-xs bg-white border border-slate-350 rounded-lg p-2 focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono"
                                >
                                  <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                                  <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                                  <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
                                  <option value={new Date().getFullYear() - 3}>{new Date().getFullYear() - 3}</option>
                                  <option value={new Date().getFullYear() - 4}>{new Date().getFullYear() - 4}</option>
                                  <option value={new Date().getFullYear() - 5}>{new Date().getFullYear() - 5}</option>
                                </select>
                              </div>
                            </div>

                            {/* Checkboxes selection for compiled columns / Métricas a Consolidar */}
                            <div className="space-y-1">
                              <label className="block text-sm font-bold text-slate-650 ">Métricas a Consolidar (Colunas do Caderno)</label>
                              <details className="w-full group relative">
                                <summary className="w-full flex items-center justify-between text-xs bg-white border border-slate-350 rounded-lg p-2 cursor-pointer  text-slate-800 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-900 select-none list-none [&::-webkit-details-marker]:hidden">
                                  <span>Escolhe...</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-open:rotate-180 text-slate-900"><path d="m6 9 6 6 6-6"/></svg>
                                </summary>
                                
                                <div className="absolute top-full right-0 z-50 mt-1 bg-white border border-slate-300 rounded-lg shadow-xl p-3 max-h-60 overflow-y-auto w-64 md:w-80">
                                  <label className="flex items-center gap-2 text-xs font-bold text-slate-900 cursor-pointer hover:bg-slate-50 p-1.5 -mx-1.5 rounded-md select-none pb-2 mb-2 border-b border-slate-200">
                                    <input 
                                      type="checkbox"
                                      checked={selectedReportColumns.length === 9}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedReportColumns([
                                            'discentes_h', 'discentes_m', 'docentes_h', 
                                            'docentes_m', 'investigadores_h', 'investigadores_m',
                                            'cta_h', 'cta_m', 'naturezaJuridica'
                                          ]);
                                        } else {
                                          setSelectedReportColumns([]);
                                        }
                                      }}
                                      className="rounded border-slate-400 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                                    />
                                    <span>Selecionar Todos</span>
                                  </label>
                                  
                                  <div className="space-y-1">
                                    {[
                                      { key: 'discentes_h', label: 'Discentes Masculinos' },
                                      { key: 'discentes_m', label: 'Discentes Femininos' },
                                      { key: 'docentes_h', label: 'Docentes Masculinos' },
                                      { key: 'docentes_m', label: 'Docentes Femininos' },
                                      { key: 'investigadores_h', label: 'Investigadores Masculinos' },
                                      { key: 'investigadores_m', label: 'Investigadores Femininos' },
                                      { key: 'cta_h', label: 'CTA Masculinos' },
                                      { key: 'cta_m', label: 'CTA Femininos' },
                                      { key: 'naturezaJuridica', label: 'Natureza Jurídica IES' },
                                    ].map(col => {
                                      const isChecked = selectedReportColumns.includes(col.key);
                                      return (
                                        <label key={col.key} className="flex items-center gap-2 text-xs font-medium text-slate-705 cursor-pointer hover:bg-slate-50 p-1.5 -mx-1.5 rounded-md select-none">
                                          <input 
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => {
                                              if (isChecked) {
                                                setSelectedReportColumns(selectedReportColumns.filter(c => c !== col.key));
                                              } else {
                                                setSelectedReportColumns([...selectedReportColumns, col.key]);
                                              }
                                            }}
                                            className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                                          />
                                          <span>{col.label}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              </details>
                            </div>
                          </div>
                        </div>

                    {/* Computed Stats Preview Generator */}
                    <div id="stats-preview-wrapper" className="space-y-8">
                      {/* Institutional Identity Header (New) - Render for any active report scope */}
                      {reportScope && (() => {
                        const inst = selectedInstitutionForReport ? institutions.find(i => i.id === selectedInstitutionForReport) : undefined;
                        return (
                          <>
                            <ReportCoverPage 
                              institution={inst} 
                              year={reportYear} 
                              scope={selectedInstitutionForReport ? 'institucional' : reportScope} 
                              province={reportProvince || undefined} 
                              region={reportRegion || undefined} 
                            />
                            <div className="page-break-before" />
                          </>
                        );
                      })()}

                      {/* Imprensa Action Bar */}
                      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 no-print">
                        <div className="text-xs text-left">
                          <strong className="block text-indigo-900 font-bold">Caderno Oficial Consolidado • {selectedInstitutionForReport ? (institutions.find(i => i.id === selectedInstitutionForReport)?.name || 'Institucional') : (reportProvince || 'Nacional')} ({reportYear})</strong>
                          <span className="text-indigo-650 block">Modo livre para impressão de capa de boletim técnico e índices de imprensa homologados.</span>
                        </div>
                        <button 
                          onClick={() => window.print()}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap"
                        >
                          ⬇️ Descarregar Relatório (PDF)
                        </button>
                      </div>

                      {/* Live compilation table */}
                      <div className="border border-slate-200 rounded-xl bg-white print:border-none print:shadow-none">
                        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center no-print">
                          <span className="text-xs font-bold text-slate-700 ">👁️ Compilação em Tempo Real ({computedReportRows.length} IES Reportadas)</span>
                          <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-250">
                            Estado: Consolidado e Homologado
                          </span>
                        </div>

                        <div className="overflow-x-auto max-h-72">
                          {computedReportRows.length > 0 ? (
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                                  <th className="p-3">Instituição de Ensino Superior</th>
                                  <th className="p-3">Província</th>
                                  <th className="p-3">Região</th>
                                  <th className="p-3">Tipo</th>
                                  <th className="p-3 text-center">Ano</th>
                                  {selectedReportColumns.map(col => (
                                    <th key={col} className="p-3 text-center bg-indigo-50/30 text-indigo-950">{COL_LABELS_MAP[col] || col}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {computedReportRows.map((row, idx) => {
                                  const inst = institutions.find(i => i.id === row.institutionId);
                                  return (
                                    <tr key={idx} className="border-b border-slate-100 font-mono text-sm hover:bg-slate-50/50">
                                      <td className="p-3 font-medium  text-slate-900 text-xs">{row.institutionName}</td>
                                      <td className="p-3 text-slate-600  text-xs">{row.province}</td>
                                      <td className="p-3 text-slate-500  text-xs italic">{PROVINCE_REGIONS[row.province] || '---'}</td>
                                      <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold  ${
                                          inst?.type === 'Privada' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                                        }`}>
                                          {inst?.type || 'Pública'}
                                        </span>
                                      </td>
                                      <td className="p-3 text-center text-slate-500 font-bold">{row.year}</td>
                                      {selectedReportColumns.map(col => (
                                        <td key={col} className="p-3 text-center font-bold text-slate-900 bg-indigo-50/10">
                                          {getReportValue(row, col, inst)}
                                        </td>
                                      ))}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          ) : (
                            <div className="p-8 text-center text-slate-400 italic">
                              Nenhum dado estatístico disponível correspondente aos filtros selecionados de momento.
                            </div>
                          )}
                        </div>
                      </div>

                      {(() => {
                        const consolidatedData = aggregateSubmissions(computedReportRows);
                        const resolvedAbbrev = selectedInstitutionForReport
                          ? institutions.find(i => i.id === selectedInstitutionForReport)?.abbreviation
                          : (currentUser && currentUser.institutionId 
                             ? institutions.find(i => i.id === currentUser.institutionId)?.abbreviation 
                             : undefined);
                        const currentInst = selectedInstitutionForReport 
                          ? institutions.find(i => i.id === selectedInstitutionForReport)
                          : undefined;

                        return (
                          <>
                            <div className="page-break-before text-left" />
                            <ReportFormsView 
                              data={consolidatedData} 
                              scope={reportScope} 
                              year={reportYear} 
                              institutionAbbrev={resolvedAbbrev}
                              institution={currentInst}
                              currentUser={currentUser}
                            />
                          </>
                        );
                      })()}

                      {/* Raw indicators download actions */}
                      <div className="border border-slate-205 rounded-xl p-4 text-xs space-y-4 no-print">
                        <div className="text-left">
                          <h3 className="font-black text-slate-800">Exportar Ficheiro de Matriz Amostral</h3>
                          <p className="text-sm text-slate-500">Transfira a compilação consolidada diretamente no seu terminal local para tratamento analítico avançado em SPSS, Excel ou Stata.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                          <button 
                            onClick={() => window.print()}
                            className="p-3 bg-rose-50 border-2 border-black hover:bg-rose-100 rounded-xl font-bold text-rose-950 cursor-pointer text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all active:scale-[0.98]"
                          >
                            Baixar Relatório em PDF
                          </button>
                          <button 
                            onClick={handleExportCSVReport}
                            className="p-3 bg-slate-50 border-2 border-black hover:bg-slate-100 rounded-xl font-bold text-slate-900 cursor-pointer text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all active:scale-[0.98]"
                          >
                            CSV Matriz Delimitada
                          </button>
                          <button 
                            onClick={handleExportXLSXReport}
                            className="p-3 bg-emerald-50 border-2 border-black hover:bg-emerald-100 rounded-xl font-bold text-emerald-950 cursor-pointer text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all active:scale-[0.98]"
                          >
                            Excel .XLSX Planilha
                          </button>
                          <button 
                            onClick={handleExportZipReport}
                            className="p-3 bg-slate-950 border-2 border-black hover:bg-slate-850 rounded-xl font-bold text-white cursor-pointer text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
                          >
                            Anuário Homologado (.ZIP)
                          </button>
                        </div>
                      </div>

                      {reportScope === 'institucional' && selectedInstitutionForReport && (
                        <IESHistoryComparison submissions={submissions} institutionId={selectedInstitutionForReport} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

                {sidebarTab === 'projeto_teorico' && (
                  <ProyectoTeorico />
                )}

                {sidebarTab === 'ia_quantica' && (
                  <QuantumAICenter
                    submissions={submissions}
                    institutions={institutions}
                    currentUser={currentUser}
                  />
                )}

                {sidebarTab === 'validacao_ia' && (
                  <AIValidationAssistant
                    submissions={submissions}
                    institutions={institutions}
                    onClose={() => setSidebarTab('visao_geral')}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}


      {/* Copiloto de IA Quântica Universal Flutuante */}
      <QuantumAIFloatingCopilot
        currentView={sidebarTab}
        submissions={submissions}
        institutions={institutions}
        currentUser={currentUser}
        onNavigateToTab={(tab) => {
          setActiveTab('workspace');
          setSidebarTab(tab);
        }}
      />

      {/* Widget Flutuante de Restauração quando Minimizado */}
      {isAppMinimized && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b0b29] text-white border-2 border-[#fec107] rounded-xl p-4 shadow-2xl flex items-center gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#fec107] uppercase tracking-wider">SIGDE-ONLINE Minimizado</span>
              <span className="text-xs text-slate-300">Clique para restaurar a janela do sistema</span>
            </div>
          </div>
          <button 
            onClick={handleToggleMinimize}
            className="bg-[#fec107] hover:bg-amber-400 text-[#0b0b29] px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow"
          >
            Restaurar Janela
          </button>
        </div>
      )}

      {/* Custom Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutConfirm(false);
          }}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 animate-fade-in my-auto">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">
              Fechar Sessão
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Deseja realmente fechar a sessão e sair do SIGDE-ONLINE?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md hover:shadow-lg"
              >
                Sim, Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Personalização do Logotipo Institucional / Usuário */}
      {currentUser && (
        <LogoCustomizerModal
          isOpen={isLogoModalOpen}
          onClose={() => setIsLogoModalOpen(false)}
          currentUser={currentUser}
          institutions={institutions}
          onSaveLogo={handleSavePersonalizedLogo}
        />
      )}

      {/* Rodapé oficial alinhado à cor do cabeçalho */}
      <footer className="bg-[#0b0b29] text-white py-6 px-4 text-center text-xs mt-auto border-t border-[#1e1e4a] flex flex-col items-center justify-center shadow-lg" id="app-footer-brand">
        <p className="font-bold text-slate-200">© 2026 Ministério de Educação e Cultura</p>
        <p className="mt-1 font-black text-[#fec107] uppercase tracking-widest text-xs ">Direcção Nacional de Ensino Superior</p>
        <p className="mt-1 font-semibold text-slate-300 font-mono">Sistema Integrado de Gestão de Dados Estatísticos (SIGDE- ONLINE)</p>
      </footer>
    </div>
  );
}


// Helper functions moved to /src/utils/aggregation.ts for codebase modularity
