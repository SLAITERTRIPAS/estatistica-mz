import React, { useState } from 'react';
import { PROVINCES, DISTRICTS } from '../data';
import { User, UserRole, Institution } from '../types';
import { 
  UserPlus, Sparkles, LogIn, Shield, MapPin, Landmark, 
  BookOpen, Eye, EyeOff, Lock, Mail, Users, FileBarChart, CheckCircle2,
  ArrowLeft, Upload, Image as ImageIcon, Key, GraduationCap, Building2, Eye as EyeIcon,
  Trash2, Home, UserCheck, ShieldCheck, Globe, Layout, User as UserIcon, RotateCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { MOZAMBIQUE_EMBLEM } from '../constants/assets';
import { saveAccountToFirestore } from '../lib/firebase';
import TestUserList from './TestUserList';

interface RegistrationFormProps {
  onRegister: (newUser: User) => void;
  institutions: Institution[];
  onAddInstitution: (newInst: Institution) => void;
  onBackToCover?: () => void;
  activeTab: 'login' | 'register';
  onTabChange: (tab: 'login' | 'register') => void;
  registeredAccounts: any[];
}

export default function RegistrationForm({
  onRegister,
  institutions,
  onAddInstitution,
  onBackToCover,
  activeTab,
  onTabChange,
  registeredAccounts,
}: RegistrationFormProps) {
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Step state for Multi-page Registration (Página 1, 2, 3)
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1);

  // PAGINA 1: Dados do Usuário
  const [name, setName] = useState('');
  const [nuit, setNuit] = useState('');
  const [numBI, setNumBI] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [optionalEmail, setOptionalEmail] = useState('');
  const [regRole, setRegRole] = useState<UserRole | 'sistema' | ''>('');
  const [adminProvince, setAdminProvince] = useState(PROVINCES[0].name);
  const [adminRegion, setAdminRegion] = useState<'Sul' | 'Centro' | 'Norte'>('Sul');

  // PAGINA 2: Credenciais de Acesso
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // PAGINA 3: Registar Instituição
  const [newInstName, setNewInstName] = useState('');
  const [newInstAbbreviation, setNewInstAbbreviation] = useState('');
  const [newInstRector, setNewInstRector] = useState('');
  const [newInstProvince, setNewInstProvince] = useState(PROVINCES[0].name);
  const [newInstDistrict, setNewInstDistrict] = useState(DISTRICTS[PROVINCES[0].name]?.[0] || '');
  const [newInstType, setNewInstType] = useState<'Pública' | 'Privada'>("Pública");
  const [newInstStartYear, setNewInstStartYear] = useState('');
  const [newInstCourses, setNewInstCourses] = useState(''); // Lista de cursos separados por vírgula
  const [newInstShortCourses, setNewInstShortCourses] = useState(''); // Cursos de curta duração
  const [newInstNuit, setNewInstNuit] = useState('');
  const [newInstAddress, setNewInstAddress] = useState('');
  const [newInstWebsite, setNewInstWebsite] = useState('');
  const [newInstContact, setNewInstContact] = useState('');
  const [newInstEmail, setNewInstEmail] = useState('');
  
  // Responsável
  const [respNome, setRespNome] = useState('');
  const [respFuncao, setRespFuncao] = useState('Reitor(a)');
  const [respContacto, setRespContacto] = useState('');
  const [respEmail, setRespEmail] = useState('');

  // Focal Point
  const [focalNome, setFocalNome] = useState('');
  const [focalFuncao, setFocalFuncao] = useState('');
  const [focalContacto, setFocalContacto] = useState('');
  const [focalEmail, setFocalEmail] = useState('');

  // Delegações
  const [newDelegName, setNewDelegName] = useState('');
  const [newDelegTipo, setNewDelegTipo] = useState<'Delegacao' | 'Extensao'>('Delegacao');
  const [newDelegProv, setNewDelegProv] = useState(PROVINCES[0].name);
  const [newDelegDist, setNewDelegDist] = useState(DISTRICTS[PROVINCES[0].name]?.[0] || '');
  const [newDelegEndereco, setNewDelegEndereco] = useState('');
  const [newDelegContact, setNewDelegContact] = useState('');
  const [delegacoes, setDelegacoes] = useState<any[]>([]);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>(''); // em base64 para preview
  const [profileImageUrl, setProfileImageUrl] = useState<string>(''); // imagem do utilizador
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingProfile, setIsDraggingProfile] = useState(false);

  // Sync district options when province changes
  const handleProvinceChange = (provName: string) => {
    setNewInstProvince(provName);
    const districts = DISTRICTS[provName] || [];
    setNewInstDistrict(districts[0] || '');
  };

  const handleAdminProvinceChange = (provName: string) => {
    setAdminProvince(provName);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail) {
      setLoginError('Por favor introduza o seu e-mail ou NUIT.');
      return;
    }

    const trimmedLogin = loginEmail.toLowerCase().trim();

    // Credenciais de Acesso do Programador / Administrador do Sistema
    const isProgrammer = 
      trimmedLogin === 'admin.sistema@sige.gov.mz' || 
      trimmedLogin === 'slaitertripas@gmail.com' ||
      trimmedLogin === 'st849547771' ||
      trimmedLogin === 'programador@sige.gov.mz' ||
      trimmedLogin === 'dev@sige.gov.mz' ||
      trimmedLogin === '999999999';

    if (isProgrammer) {
      const isAdminSupremo = trimmedLogin === 'slaitertripas@gmail.com' || trimmedLogin === 'st849547771';
      const requiredPass = isAdminSupremo ? '231383' : 'Admin2026!';
      
      if (loginPassword === requiredPass || loginPassword === 'DemoPass123!' || loginPassword === 'admin') {
        const programmerUser: User = {
          id: isAdminSupremo ? 'ST849547771' : 'dev-programador-sistema',
          name: isAdminSupremo ? 'SLAITER TRIPAS' : 'Programador (Administrador do Sistema)',
          email: 'slaitertripas@gmail.com',
          nuit: isAdminSupremo ? 'ST849547771' : '999999999',
          role: 'sistema',
          accountStatus: 'active',
          isOwner: isAdminSupremo,
          isProgrammer: true,
          efetivo: false,
          systemId: isAdminSupremo ? 'ST849547771' : undefined
        };
        onRegister(programmerUser);
        return;
      } else {
        setLoginError('Palavra-passe incorreta para as credenciais administrativas.');
        return;
      }
    }

    // Check custom registered users from localStorage
    const savedRegs = localStorage.getItem('stat_registered_accounts');
    const registeredList = savedRegs ? JSON.parse(savedRegs) : [];
    
    const matchedCustom = registeredList.find(
      (acc: any) => 
        acc.email.toLowerCase() === trimmedLogin || 
        (acc.user.email && acc.user.email.toLowerCase() === trimmedLogin) ||
        (acc.user.nuit && acc.user.nuit === trimmedLogin)
    );

    if (matchedCustom) {
      // Auto-activate if pending/test
      if (matchedCustom.user.accountStatus !== 'active') {
        matchedCustom.user.accountStatus = 'active';
        
        // Update in localStorage
        const updatedList = registeredList.map((acc: any) => 
          acc.email === matchedCustom.email ? { ...acc, user: matchedCustom.user } : acc
        );
        localStorage.setItem('stat_registered_accounts', JSON.stringify(updatedList));
        
        // Sync to Firestore
        saveAccountToFirestore(matchedCustom.email, matchedCustom.password, matchedCustom.user);
      }
      
      onRegister(matchedCustom.user);
      return;
    }

    setLoginError('Credenciais incorretas ou conta inexistente. Crie uma nova conta no separador "Novo Registo"!');
  };

  // Navigations with rigorous checks
  const handleGoToStep2 = () => {
    
    if (!nuit.trim()) {
      alert('Por favor, preencha o NUIT.');
      return;
    }
    if (nuit.trim().length !== 9 || isNaN(Number(nuit))) {
      alert('O NUIT (Número Único de Identificação Tributária) deve conter exatamente 9 dígitos numéricos.');
      return;
    }
    
    
    

    setRegStep(2);
  };

  const handleGoToStep3 = () => {
    if (!regPassword) {
      alert('Por favor, crie uma palavra-passe de segurança.');
      return;
    }
    if (regPassword.length < 6) {
      alert('A palavra-passe deve conter pelo menos 6 dígitos/caracteres correspondentes.');
      return;
    }
    if (regPassword !== confirmPassword) {
      alert('A confirmação da palavra-passe não coincide com a senha criada.');
      return;
    }

    setRegStep(3);
  };

  const handleAutoActivate = (account: any) => {
    if (account.user.accountStatus !== 'active') {
      account.user.accountStatus = 'active';
      // Sync to Firestore
      saveAccountToFirestore(account.email, account.password, account.user);
    }
    onRegister(account.user);
  };

  const handleAddDelegation = () => {
    if (!newDelegName.trim()) return;
    const newDeleg = {
      id: Math.random().toString(36).substring(7),
      nome: newDelegName.trim(),
      tipo: newDelegTipo,
      provincia: newDelegProv,
      distrito: newDelegDist,
      endereco: newDelegEndereco.trim(),
      contacto: newDelegContact.trim()
    };
    setDelegacoes([...delegacoes, newDeleg]);
    // Reset fields
    setNewDelegName('');
    setNewDelegEndereco('');
    setNewDelegContact('');
  };

  const removeDelegation = (id: string) => {
    setDelegacoes(delegacoes.filter(d => d.id !== id));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify NUIT duplication in existing records
    const savedRegs = localStorage.getItem('stat_registered_accounts');
    const registeredList = savedRegs ? JSON.parse(savedRegs) : [];
    const customExists = registeredList.some((acc: any) => acc.user?.nuit === nuit.trim());

    if (customExists) {
      alert('Este NUIT já se encontra registado para uma conta no sistema.');
      return;
    }

    let newUser: User;

    if (['ies', 'FocalPoint', 'OrgaoMaximoIES'].includes(regRole || '')) {
      // Final checks on Step 3 for IES
      
      
      
      
      

      // Create unique ID for the new custom institution
      const createdInstId = 'inst-' + Math.random().toString(36).substring(2, 11);
      const newInst: Institution = {
        id: createdInstId,
        name: newInstName.trim(),
        province: newInstProvince,
        district: newInstDistrict,
        rector: newInstRector.trim(),
        type: newInstType,
        abbreviation: newInstAbbreviation.trim().toUpperCase(),
        startYear: Number(newInstStartYear.trim()),
        nuit: newInstNuit.trim(),
        address: newInstAddress.trim(),
        website: newInstWebsite.trim(),
        contact: newInstContact.trim(),
        email: newInstEmail.trim(),
        courses: newInstCourses.split(',').map(c => c.trim()).filter(Boolean),
        shortCourses: newInstShortCourses.split(',').map(c => c.trim()).filter(Boolean),
        logoUrl: logoUrl,
        responsavel: {
          nome: respNome.trim(),
          funcao: respFuncao.trim(),
          contacto: respContacto.trim(),
          email: respEmail.trim(),
        },
        focalPoint: {
          nome: focalNome.trim(),
          funcao: focalFuncao.trim(),
          contacto: focalContacto.trim(),
          email: focalEmail.trim(),
        },
        delegacoes: delegacoes,
      };

      // Add new institution to state list
      onAddInstitution(newInst);

        newUser = {
        id: 'usr-' + Math.random().toString(36).substring(2, 11),
        name: name.trim(),
        email: nuit.trim(), // login is their NUI / NUIT
        nuit: nuit.trim(),
        numBI: numBI.trim(),
        personalEmail: personalEmail.trim(),
        optionalEmail: optionalEmail.trim() ? optionalEmail.trim() : undefined,
        role: regRole === 'FocalPoint' ? 'FocalPoint' : (regRole === 'OrgaoMaximoIES' ? 'OrgaoMaximoIES' : 'ies'),
        province: newInstProvince,
        institutionId: createdInstId,
        institutionName: `${newInstName.trim()} (${newInstAbbreviation.trim().toUpperCase()})`,
        affectedByNational: false,
        accountStatus: 'pending',
        photoURL: profileImageUrl || undefined
      };
    } else {
      newUser = {
        id: 'usr-' + Math.random().toString(36).substring(2, 11),
        name: name.trim(),
        email: nuit.trim(), // login is their NUI / NUIT
        nuit: nuit.trim(),
        numBI: numBI.trim(),
        personalEmail: personalEmail.trim(),
        optionalEmail: optionalEmail.trim() ? optionalEmail.trim() : undefined,
        role: regRole as UserRole,
        province: regRole === 'RepresentanteProvincial' ? adminProvince : undefined,
        region: regRole === 'RepresentanteRegional' ? adminRegion : undefined,
        affectedByNational: false,
        accountStatus: 'pending',
        photoURL: profileImageUrl || undefined
      };
    }

    // Store in simulated localized database
    const updatedList = [...registeredList, { email: nuit.trim(), password: regPassword, user: newUser }];
    localStorage.setItem('stat_registered_accounts', JSON.stringify(updatedList));

    // Save to Firebase Firestore for cloud persistence
    saveAccountToFirestore(nuit.trim(), regPassword, newUser);

    const roleMap: Record<string, string> = {
      ies: 'Gabinete da IES',
      FocalPoint: 'Focal Point Institucional',
      OrgaoMaximoIES: 'Órgão Máximo da IES',
      RepresentanteProvincial: 'Gabinete Provincial de Estatística',
      RepresentanteRegional: 'Gabinete Regional de Estatística',
      provincial: 'Gabinete Provincial de Estatística',
      regional: 'Gabinete Regional de Estatística',
      Ministerial: 'Técnico Ministerial (MEC / DNES)',
      central: 'Administrador Central (DGES)',
      nacional: 'Direcção Nacional',
      sistema: 'Administrador do Sistema / Programador (TI)'
    };

    alert(`Sucesso! Utilizador do nível de [${roleMap[regRole]}] registado com sucesso no Ministério de Ensino (SIGDE- ONLINE).\nA sua conta foi colocada como Pendente até validação por parte da Direcção Nacional.\nSerá redirecionado à sua Área de Trabalho.`);
    onRegister(newUser);
  };

  return (
    <div id="sinagedees-container" className="max-w-md mx-auto p-4 md:p-6">
      <div className="text-center mb-6 space-y-3">
        <div className="relative p-1 flex items-center justify-center w-[2.9rem] h-[2.9rem] mx-auto overflow-hidden bg-transparent hover:scale-110 transition-transform duration-300">
          <img 
            src={MOZAMBIQUE_EMBLEM}
            alt="Emblema de Moçambique" 
            className="w-full h-full object-contain mix-blend-multiply [filter:contrast(106%)_brightness(102%)]"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
            Sigde-Online — Registo integrado
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Coleta de Informações Estatísticas do Ensino Superior de Moçambique
          </p>
        </div>
      </div>

      <div className="flex bg-slate-200/60 p-1.5 rounded-xl mb-6 border border-slate-350">
        <button
          onClick={() => onTabChange('login')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'login' ? 'bg-white text-emerald-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
          }`}
          id="tab-select-login"
        >
          Acesso ao Sistema
        </button>
        <button
          onClick={() => {
            onTabChange('register');
            setRegStep(1);
          }}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'register' ? 'bg-white text-emerald-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
          }`}
          id="tab-select-register"
        >
          Novo Registo (3 Páginas)
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/85 p-6 md:p-8">
        
        {activeTab === 'login' ? (
          /* ================= LOGIN TAB ================= */
          <form onSubmit={handleCustomLogin} className="space-y-5">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm font-semibold">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1.5">E-mail / Nuit de acesso</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="Insira o seu Email ou NUIT de 9 dígitos"
                  className="w-full text-sm pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-500 focus:bg-white text-slate-800 font-medium"
                />
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1.5">Palavra-passe / Pin</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full text-sm pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-500 focus:bg-white text-slate-800 font-medium"
                />
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-4 px-4 rounded-xl text-sm transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] mt-4 tracking-[0.2em] border-2 border-black active:translate-y-[1px]"
            >
              Aceder ao sistema seguro (Login)
            </button>

            <TestUserList accounts={registeredAccounts} onSelectAccount={handleAutoActivate} />

            <div className="pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Utilize as credenciais oficiais fornecidas na capa <br /> ou pelo Gabinete de Coordenação.
              </p>
            </div>
          </form>
        ) : (
          /* ================= REGISTER FLOW (3 STEPS) ================= */
          <div className="space-y-6">
            
            {/* Visual Multi-step Stepper Header */}
            <div className="flex items-center justify-between px-1 mb-2">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center flex-1 last:flex-initial">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all ${
                      regStep === num
                        ? 'bg-emerald-600 text-white border-emerald-600 scale-110 shadow-sm'
                        : regStep > num
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-500'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      {regStep > num ? <CheckCircle2 className="h-5 w-5 stroke-[3]" /> : num}
                    </div>
                    <span className={`text-xs tracking-wider font-bold mt-1 ${
                      regStep === num ? 'text-emerald-700 font-black' : 'text-slate-400'
                    }`}>
                      {num === 1 ? 'Nível' : num === 2 ? 'Pessoal' : 'Finalização'}
                    </span>
                  </div>
                  {num < 3 && (
                    <div className={`h-0.5 flex-1 mx-2 transition-colors ${
                      regStep > num ? 'bg-emerald-500' : 'bg-slate-250'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content renders based on regStep */}
            {regStep === 1 && (
              /* Página 1 Form: Seleção de Nível */
              <div className="space-y-4">
                <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 text-center">
                  <h4 className="text-[16px] font-black text-emerald-900 tracking-tight">Registo de novo acesso</h4>
                  <p className="text-sm text-emerald-700 mt-1 font-medium italic">Selecione o seu nível de atuação para iniciar o formulário em 3 passos</p>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-black text-slate-500 tracking-[0.2em] text-center mb-2">Eu sou um(a):</label>
                  
                  <div className="relative group">
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full pl-12 pr-10 py-4 bg-white border-2 border-slate-100 rounded-xl focus:border-emerald-500 focus:outline-none transition-all text-sm font-black text-slate-800 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Selecione o seu perfil de atuação...</option>
                      <option value="ies">Representante da IES</option>
                      <option value="FocalPoint">Focal Point Institucional</option>
                      <option value="OrgaoMaximoIES">Órgão Máximo da IES (Reitoria)</option>
                      <option value="RepresentanteProvincial">Gabinete Provincial de Estatística</option>
                      <option value="RepresentanteRegional">Gabinete Regional de Estatística</option>
                      <option value="Ministerial">Técnico Ministerial (MEC / DNES)</option>
                      <option value="sistema">Administrador do Sistema / Programador (TI)</option>
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ArrowLeft className="h-5 w-5 text-slate-300 -rotate-90" />
                    </div>
                  </div>

                  <button
                    disabled={!regRole}
                    onClick={() => setRegStep(2)}
                    className={`w-full py-5 rounded-xl text-sm font-black tracking-[0.2em] transition-all border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none mt-4 ${
                      regRole 
                        ? 'bg-emerald-600 text-white border-black cursor-pointer hover:bg-emerald-700' 
                        : 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed opacity-50 shadow-none translate-y-0'
                    }`}
                  >
                    Prosseguir para Dados Pessoais
                  </button>

                  <div className="bg-slate-50 p-5 rounded-xl border border-dotted border-slate-300 mt-4">
                    <p className="text-xs text-slate-500 leading-relaxed text-center font-medium">
                      O acesso aos níveis <strong>Administrador Nacional</strong> e <strong>Sistema</strong> é restrito e deve ser solicitado diretamente ao Departamento de Tecnologias.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {regStep === 2 && (
              /* Página 2 Form: Dados Pessoais */
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <UserIcon className="h-5 w-5 text-emerald-600" />
                  <div>
                    <h4 className="text-sm font-black text-emerald-900">Identificação pessoal</h4>
                    <p className="text-xs text-emerald-700 font-medium">Nível selecionado: <span className="font-black">{regRole}</span></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 tracking-wider mb-1">Nome completo</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome completo do responsável"
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 tracking-wider mb-1">Nuit (9 dígitos)</label>
                      <input
                        type="text"
                        required
                        maxLength={9}
                        value={nuit}
                        onChange={(e) => setNuit(e.target.value.replace(/\D/g, ''))}
                        placeholder="Ex: 512345678"
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-800 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 tracking-wider mb-1">Bi (Identidade)</label>
                      <input
                        type="text"
                        required
                        value={numBI}
                        onChange={(e) => setNumBI(e.target.value)}
                        placeholder="Ex: 110200340A"
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  {regRole === 'RepresentanteProvincial' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 tracking-wider mb-1">Província de atuação</label>
                      <select
                        value={adminProvince}
                        onChange={(e) => setAdminProvince(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-emerald-500"
                      >
                        {PROVINCES.map((p) => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {regRole === 'RepresentanteRegional' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 tracking-wider mb-1">Região de atuação</label>
                      <select
                        value={adminRegion}
                        onChange={(e) => setAdminRegion(e.target.value as any)}
                        className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-emerald-500"
                      >
                        <option value="Sul">Sul</option>
                        <option value="Centro">Centro</option>
                        <option value="Norte">Norte</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-600 tracking-wider mb-1">Email pessoal / de contacto</label>
                    <input
                      type="email"
                      required
                      value={personalEmail}
                      onChange={(e) => setPersonalEmail(e.target.value)}
                      placeholder="Ex: joao.mateus@gmail.com"
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Fotografia do Utilizador (Opcional)</label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingProfile(true); }}
                      onDragLeave={() => setIsDraggingProfile(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingProfile(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          const file = e.dataTransfer.files[0];
                          const reader = new FileReader();
                          reader.onloadend = () => setProfileImageUrl(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                        isDraggingProfile
                          ? 'border-emerald-500 bg-emerald-100/50'
                          : profileImageUrl 
                            ? 'border-emerald-400 bg-emerald-50/10'
                            : 'border-slate-350 hover:border-emerald-400 hover:bg-emerald-50/10'
                      }`}
                      onClick={() => document.getElementById('profile-image-picker')?.click()}
                    >
                      <input
                        type="file"
                        id="profile-image-picker"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                      {profileImageUrl ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative w-16 h-16 bg-white border border-slate-200 rounded-full overflow-hidden shadow-md flex items-center justify-center mx-auto">
                            <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <RotateCw className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <span className="text-xs text-emerald-800 font-black uppercase">Alterar Fotografia</span>
                        </div>
                      ) : (
                        <div className="space-y-1 py-1">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-1">
                             <ImageIcon className="h-5 w-5 text-slate-400" />
                          </div>
                          <p className="text-xs text-slate-500 font-bold uppercase">Clique ou arraste a sua foto</p>
                          <p className="text-xs text-slate-400 font-medium italic">Formatos: PNG, JPG (Máx. 2MB)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl text-xs transition-colors"
                    >
                      Alterar Nível
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (name && nuit && numBI && personalEmail) {
                          setRegStep(3);
                        } else {
                          alert("Por favor, preencha todos os campos obrigatórios.");
                        }
                      }}
                      className="flex-[2] bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm uppercase tracking-wider"
                    >
                      Continuar para Credenciais
                    </button>
                  </div>
                </div>
              </div>
            )}

            {regStep === 3 && (
              /* Página 3 Form: Finalização e Instituição */
              <form onSubmit={handleRegisterSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                
                <div className="bg-slate-900 p-4 rounded-xl text-white">
                  <h4 className="text-xs font-black tracking-widest text-emerald-400 mb-2">Credenciais de acesso</h4>
                  <div className="space-y-4">
                     <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex justify-between items-center">
                        <div>
                          <label className="block text-xs font-bold text-white/50 mb-0.5">Usuário (Nuit)</label>
                          <p className="text-lg font-mono font-black text-white">{nuit}</p>
                        </div>
                        <Key className="h-6 w-6 text-emerald-500 opacity-50" />
                     </div>
                     <div>
                      <label className="block text-xs font-bold text-white/50 uppercase mb-1">Definir PIN de Acesso (6 dígitos)</label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          maxLength={6}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Digite 6 números"
                          className="w-full text-sm pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-mono font-black focus:outline-emerald-500"
                        />
                        <Lock className="absolute left-3 top-3.5 h-4 w-4 text-white/30" />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3 top-3.5"
                        >
                          {showRegPassword ? <EyeOff className="h-4 w-4 text-white/50" /> : <Eye className="h-4 w-4 text-white/50" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {['ies', 'FocalPoint', 'OrgaoMaximoIES'].includes(regRole || '') ? (
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                       <h3 className="text-xs font-black text-slate-900 tracking-wider mb-4 flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-emerald-600" />
                          1. Identificação e localização
                       </h3>
                       
                       <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Nome da Instituição/Universidade</label>
                            <input
                              type="text"
                              
                              value={newInstName}
                              onChange={(e) => setNewInstName(e.target.value)}
                              placeholder="Ex: Universidade de Educação e Tecnologias de Tete"
                              className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-emerald-500 text-slate-800"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                               <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Sigla</label>
                               <input
                                 type="text"
                                 
                                 placeholder="Ex: UDET"
                                 value={newInstAbbreviation}
                                 onChange={(e) => setNewInstAbbreviation(e.target.value)}
                                 className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-emerald-500 font-bold uppercase"
                               />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">NUIT da Instituição</label>
                               <input
                                 type="text"
                                 
                                 placeholder="Ex: 400123456"
                                 value={newInstNuit}
                                 onChange={(e) => setNewInstNuit(e.target.value.replace(/\D/g, ''))}
                                 className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-emerald-500 font-mono"
                               />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                               <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Controlo</label>
                               <select
                                 value={newInstType}
                                 onChange={(e) => setNewInstType(e.target.value as any)}
                                 className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800"
                               >
                                 <option value="Pública">Pública</option>
                                 <option value="Privada">Privada</option>
                               </select>
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Ano de Início Funcionamento</label>
                               <input
                                 type="text"
                                 
                                 maxLength={4}
                                 placeholder="Ex: 1962"
                                 value={newInstStartYear}
                                 onChange={(e) => setNewInstStartYear(e.target.value.replace(/\D/g, ''))}
                                 className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-emerald-500 font-mono"
                               />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                             <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Província</label>
                                <select
                                  value={newInstProvince}
                                  onChange={(e) => handleProvinceChange(e.target.value)}
                                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800"
                                >
                                  {PROVINCES.map((p) => (
                                    <option key={p.id} value={p.name}>{p.name}</option>
                                  ))}
                                </select>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Distrito</label>
                                <select
                                  value={newInstDistrict}
                                  onChange={(e) => setNewInstDistrict(e.target.value)}
                                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
                                >
                                  {(DISTRICTS[newInstProvince] || []).map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                  ))}
                                </select>
                             </div>
                          </div>

                          <div>
                             <label className="block text-xs font-bold text-slate-600 tracking-wider mb-1">Endereço físico (Sede)</label>
                             <input
                               type="text"
                               value={newInstAddress}
                               onChange={(e) => setNewInstAddress(e.target.value)}
                               placeholder="Rua, Bairro, Edifício principal"
                               className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-emerald-500 text-slate-800"
                             />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                             <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Website</label>
                                <input
                                  type="text"
                                  value={newInstWebsite}
                                  onChange={(e) => setNewInstWebsite(e.target.value)}
                                  placeholder="www.exemplo.ac.mz"
                                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-emerald-500 text-slate-800"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Contacto Institucional</label>
                                <input
                                  type="text"
                                  value={newInstContact}
                                  onChange={(e) => setNewInstContact(e.target.value)}
                                  placeholder="+258 84 123 4567"
                                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-emerald-500 text-slate-800"
                                />
                             </div>
                          </div>

                          <div>
                             <label className="block text-xs font-bold text-slate-600 tracking-wider mb-1">E-mail institucional</label>
                             <input
                               type="email"
                               value={newInstEmail}
                               onChange={(e) => setNewInstEmail(e.target.value)}
                               placeholder="info@universidade.ac.mz"
                               className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-emerald-500 text-slate-800"
                             />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Logotipo (Upload)</label>
                            <div
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                                isDragging
                                  ? 'border-emerald-500 bg-emerald-100/50'
                                  : logoUrl 
                                    ? 'border-emerald-400 bg-emerald-50/10'
                                    : 'border-slate-350 hover:border-emerald-400 hover:bg-emerald-50/10'
                              }`}
                              onClick={() => document.getElementById('logo-step-picker')?.click()}
                            >
                              <input
                                type="file"
                                id="logo-step-picker"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              {logoUrl ? (
                                <div className="flex flex-col items-center gap-1">
                                  <div className="relative w-12 h-12 bg-white border border-slate-100 rounded-full overflow-hidden shadow-xs flex items-center justify-center mx-auto">
                                    <img src={logoUrl} alt="Logotipo" className="w-full h-full object-contain mix-blend-multiply" style={{ mixBlendMode: 'multiply' }} />
                                  </div>
                                  <span className="text-xs text-emerald-800 font-black">Alterar Imagem</span>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <Upload className="h-5 w-5 text-slate-400 mx-auto" />
                                  <p className="text-xs font-bold text-slate-700">Arraste ou clique aqui</p>
                                </div>
                              )}
                            </div>
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                       <h3 className="text-xs font-black text-slate-900 tracking-wider mb-4 flex items-center gap-2">
                          <Users className="h-4 w-4 text-emerald-600" />
                          2. Responsável da IES (Reitor/Director)
                       </h3>
                       <div className="space-y-4">
                          <div>
                             <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Nome do Responsável Máximo</label>
                             <input
                               type="text"
                               
                               value={respNome}
                               onChange={(e) => {
                                  setRespNome(e.target.value);
                                  if (!newInstRector) setNewInstRector(e.target.value);
                               }}
                               placeholder="Ex: Prof. Dr. Orlando Quilambo"
                               className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-emerald-500 text-slate-800"
                             />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                             <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Cargo / Função</label>
                                <input
                                  type="text"
                                  value={respFuncao}
                                  onChange={(e) => setRespFuncao(e.target.value)}
                                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Contacto Direto</label>
                                <input
                                  type="text"
                                  value={respContacto}
                                  onChange={(e) => setRespContacto(e.target.value)}
                                  placeholder="+258 8x xxx xxxx"
                                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                                />
                             </div>
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Email do Responsável</label>
                             <input
                               type="email"
                               value={respEmail}
                               onChange={(e) => setRespEmail(e.target.value)}
                               placeholder="reitoria@exemplo.ac.mz"
                               className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100">
                       <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          3. Ponto Focal (Quem irá preencher o SIGDE- ONLINE)
                       </h3>
                       <div className="space-y-4">
                          <div>
                             <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Nome Completo do Focal Point</label>
                             <input
                               type="text"
                               
                               value={focalNome}
                               onChange={(e) => setFocalNome(e.target.value)}
                               placeholder="Ex: Engenheiro Carlos Manjate"
                               className="w-full text-xs px-3 py-2.5 bg-white border border-emerald-200 rounded-lg focus:outline-emerald-500 text-slate-800"
                             />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                             <div>
                                <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Função / Departamento</label>
                                <input
                                  type="text"
                                  value={focalFuncao}
                                  onChange={(e) => setFocalFuncao(e.target.value)}
                                  placeholder="TI / Registo Académico"
                                  className="w-full text-xs px-3 py-2.5 bg-white border border-emerald-200 rounded-lg text-slate-800"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Contacto Telemóvel</label>
                                <input
                                  type="text"
                                  value={focalContacto}
                                  onChange={(e) => setFocalContacto(e.target.value)}
                                  className="w-full text-xs px-3 py-2.5 bg-white border border-emerald-200 rounded-lg text-slate-800"
                                />
                             </div>
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Email Institucional do Ponto Focal</label>
                             <input
                               type="email"
                               value={focalEmail}
                               onChange={(e) => setFocalEmail(e.target.value)}
                               className="w-full text-xs px-3 py-2.5 bg-white border border-emerald-200 rounded-lg text-slate-800"
                            />
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                       <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                          4. Delegações e Extensões (Se houver)
                       </h3>
                       
                       <div className="space-y-4">
                          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-3">
                             <div className="grid grid-cols-2 gap-2">
                                <div>
                                   <label className="text-xs font-bold text-slate-500 uppercase">Nome da Delegação</label>
                                   <input
                                     type="text"
                                     value={newDelegName}
                                     onChange={(e) => setNewDelegName(e.target.value)}
                                     placeholder="Ex: Delegação de Beira"
                                     className="w-full text-sm px-2 py-1.5 border rounded"
                                   />
                                </div>
                                <div>
                                   <label className="text-xs font-bold text-slate-500 uppercase">Tipo</label>
                                   <select
                                     value={newDelegTipo}
                                     onChange={(e) => setNewDelegTipo(e.target.value as any)}
                                     className="w-full text-sm px-2 py-1.5 border rounded"
                                   >
                                      <option value="Delegacao">Delegação</option>
                                      <option value="Extensao">Extensão</option>
                                   </select>
                                </div>
                             </div>
                             <div className="grid grid-cols-2 gap-2">
                                <div>
                                   <label className="text-xs font-bold text-slate-500 uppercase">Província</label>
                                   <select
                                     value={newDelegProv}
                                     onChange={(e) => {
                                        setNewDelegProv(e.target.value);
                                        setNewDelegDist(DISTRICTS[e.target.value]?.[0] || '');
                                     }}
                                     className="w-full text-sm px-2 py-1.5 border rounded"
                                   >
                                      {PROVINCES.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                   </select>
                                </div>
                                <div>
                                   <label className="text-xs font-bold text-slate-500 uppercase">Distrito</label>
                                   <select
                                     value={newDelegDist}
                                     onChange={(e) => setNewDelegDist(e.target.value)}
                                     className="w-full text-sm px-2 py-1.5 border rounded"
                                   >
                                      {(DISTRICTS[newDelegProv] || []).map(d => <option key={d} value={d}>{d}</option>)}
                                   </select>
                                </div>
                             </div>
                             <button
                               type="button"
                               onClick={handleAddDelegation}
                               className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 rounded text-xs font-black uppercase transition-colors"
                             >
                                Adicionar Delegação à Lista
                             </button>
                          </div>

                          {delegacoes.length > 0 && (
                             <div className="space-y-2">
                                {delegacoes.map((d) => (
                                   <div key={d.id} className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-100 rounded-lg animate-in fade-in slide-in-from-right-2">
                                      <div className="text-xs">
                                         <span className="font-black text-emerald-900 block">{d.nome} ({d.tipo})</span>
                                         <span className="text-emerald-700 block text-xs">{d.provincia} — {d.distrito}</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeDelegation(d.id)}
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                      >
                                         <Trash2 className="h-4 w-4" />
                                      </button>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                       <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-emerald-600" />
                          5. Oferta Acadêmica
                       </h3>
                       <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Cursos de Graduação (Separados por vírgula)</label>
                            <textarea
                              placeholder="Lisenciatura em Direito, Engenharia de Minas, Medicina..."
                              value={newInstCourses}
                              onChange={(e) => setNewInstCourses(e.target.value)}
                              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-emerald-500 text-slate-800 min-h-[80px]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Cursos de Curta Duração / Certificações</label>
                            <textarea
                              placeholder="Gestão de Projectos, Informática Básica..."
                              value={newInstShortCourses}
                              onChange={(e) => setNewInstShortCourses(e.target.value)}
                              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-emerald-500 text-slate-800 min-h-[80px]"
                            />
                          </div>
                       </div>
                    </div>
                </div>
                ) : !['nacional', 'sistema'].includes(regRole || '') ? (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                      <h4 className="text-sm font-black text-emerald-900 uppercase">Validação de Conta Governamental</h4>
                      <p className="text-xs text-emerald-800 mt-1">Sendo um utilizador de nível <strong>{regRole}</strong>, a sua conta será registada no servidor central do MEC para auditoria imediata.</p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">NOME:</span>
                        <span className="text-slate-900 font-black">{name}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">NUIT:</span>
                        <span className="text-slate-900 font-black">{nuit}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">NÍVEL:</span>
                        <span className="text-slate-900 font-black uppercase text-emerald-700">{regRole}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 italic text-center">Clique em "Finalizar Registo" para enviar o seu pedido de acesso à Direcção Nacional.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <span className="text-xs font-black text-red-800 uppercase block mb-1">Aviso de Segurança</span>
                      <p className="text-xs text-red-700 leading-normal font-bold">
                        Por orientações do sistema, todos os administradores (Provincial, Regional, ou Nacional) devem ser registados exclusivamente pelo Administrador Nacional.
                      </p>
                      <p className="text-xs text-red-600 mt-2 font-mono leading-relaxed">
                        Dirija-se ao seu Administrador Nacional para requisitar as suas credenciais. Na área de trabalho do mesmo existe um painel de Gestão de Usuários para o efeito.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRegStep(2)}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Anterior
                  </button>
                  {regRole && !['nacional', 'sistema', 'Ministerial', 'RepresentanteProvincial', 'RepresentanteRegional'].includes(regRole) && (
                    <button
                      type="submit"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5 uppercase  tracking-widest"
                    >
                      Finalizar Registo
                    </button>
                  )}
                  {['Ministerial', 'RepresentanteProvincial', 'RepresentanteRegional'].includes(regRole || '') && (
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white font-black py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5 uppercase  tracking-widest"
                    >
                      Solicitar Acesso
                    </button>
                  )}
                </div>
              </form>
            )}

          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <button 
          onClick={onBackToCover}
          className="text-slate-400 hover:text-slate-600 flex items-center gap-2 mx-auto text-xs font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar à Página Inicial
        </button>
      </div>

    </div>
  );
}
