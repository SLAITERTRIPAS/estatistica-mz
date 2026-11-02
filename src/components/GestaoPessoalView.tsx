import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  GraduationCap,
  Key,
  Database
} from 'lucide-react';
import { User } from '../types';
import { deleteDoc, doc } from 'firebase/firestore';
import { saveAccountToFirestore, deleteAccountFromFirestore } from '../lib/firebase';

interface GestaoPessoalViewProps {
  currentUser: User;
  onBackToDashboard: () => void;
  db: any;
}

const EIXO_OPTIONS = [
  'Eixo 1',
  'Eixo 2',
  'Eixo 3',
  'Eixo 4',
  'Eixo 5',
  'Eixo 6',
  'Eixo 7',
  'Eixo 8',
];

const EIXO_LABELS_FULL: Record<string, string> = {
  'Eixo 1': 'Eixo I: Identificação da Entidade',
  'Eixo 2': 'Eixo II: Corpo Discente (Alunos)',
  'Eixo 3': 'Eixo III: Corpo Docente (Professores)',
  'Eixo 4': 'Eixo IV: Investigadores e Pesquisa',
  'Eixo 5': 'Eixo V: Corpo Técnico Administrativo (CTA)',
  'Eixo 6': 'Eixo VI: Recursos Financeiros',
  'Eixo 7': 'Eixo VII: Infraestrutura e Bibliotecas',
  'Eixo 8': 'Eixo VIII: Previsões de Estudantes',
};

export default function GestaoPessoalView({
  currentUser,
  onBackToDashboard,
  db
}: GestaoPessoalViewProps) {
  const [internalUsers, setInternalUsers] = useState<User[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newCargo, setNewCargo] = useState('');

  const getEixosForCargo = (cargo: string): string[] => {
    switch (cargo) {
      case 'Recursos Humanos': return ['Eixo 3', 'Eixo 4', 'Eixo 5'];
      case 'Registo Académico': return ['Eixo 1', 'Eixo 2', 'Eixo 8'];
      case 'Departamento de Finanças': return ['Eixo 6'];
      case 'Departamento de Património': return ['Eixo 7'];
      case 'Repartição de Bolsa': return ['Eixo 2'];
      default: return [];
    }
  };

  const loadUsers = () => {
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
      console.error(e);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentUser.institutionId]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim() || !newCargo.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios, incluindo o Cargo.');
      return;
    }

    const assignedEixos = getEixosForCargo(newCargo);

    try {
      const stored = localStorage.getItem('stat_registered_accounts');
      const registeredList = stored ? JSON.parse(stored) : [];

      // Check if username already exists
      const exists = registeredList.some(
        (acc: any) => acc.email.toLowerCase() === newEmail.trim().toLowerCase()
      );

      if (exists) {
        alert('Este nome de utilizador ou email já existe no sistema.');
        return;
      }

      const generatedId = 'usr-ies-int-' + Math.random().toString(36).substring(2, 9);
      const newUser: User = {
        id: generatedId,
        name: newName.trim(),
        email: newEmail.trim(),
        role: 'ies_interno',
        institutionId: currentUser.institutionId || '',
        institutionName: currentUser.institutionName || 'Instituição',
        province: currentUser.province || 'Maputo',
        assignedEixo: assignedEixos.join(','),
        cargo: newCargo,
        eixoStatus: 'draft',
        accountStatus: 'active', // Automatically active
        createdBy: currentUser.id, // Add createdBy
      };

      const updatedList = [
        ...registeredList,
        {
          email: newEmail.trim().toLowerCase(),
          password: newPassword,
          user: newUser
        }
      ];

      localStorage.setItem('stat_registered_accounts', JSON.stringify(updatedList));
      
      // Save to Firebase Firestore
      await saveAccountToFirestore(newEmail.trim().toLowerCase(), newPassword, newUser);

      alert(`Utilizador interno [${newName.trim()}] (${newCargo}) registado com sucesso com acesso aos eixos: [${assignedEixos.join(', ')}]!`);

      // Reset form
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewCargo('');
      setShowAddForm(false);
      
      // Reload list
      loadUsers();
    } catch (e) {
      console.error(e);
      alert('Ocorreu um erro ao guardar o utilizador interno.');
    }
  };

  const handleDeleteUser = async (e: React.MouseEvent, userId: string, userName: string) => {
    e.stopPropagation();
    try {
      // 1. Verificação de permissão (baseada no localStorage se existir)
      const storedData = localStorage.getItem('stat_registered_accounts');
      let emailToDelete = '';
      if (storedData) {
        const registeredList = JSON.parse(storedData);
        const userToDelete = registeredList.find((acc: any) => acc.user?.id === userId);
        
        if (userToDelete) {
          if (userToDelete.user.createdBy && userToDelete.user.createdBy !== currentUser.id) {
             alert("Você não tem permissão para excluir este utilizador, pois não foi você quem o criou.");
             return;
          }
          emailToDelete = userToDelete.email;
        }
      }

      // 2. Confirmação
      const confirmDelete = window.confirm(
        `Confirma que deseja remover permanentemente o utilizador interno [${userName}]?\nIsto revogará o acesso dele ao sistema de preenchimento.`
      );
      if (!confirmDelete) return;

      // 3. Exclusão no Firestore (Fonte da verdade)
      await deleteDoc(doc(db, 'users', userId));
      if (emailToDelete) {
        await deleteAccountFromFirestore(emailToDelete);
      }

      // 4. Atualização do cache local (se aplicável)
      const updatedStored = localStorage.getItem('stat_registered_accounts');
      if (updatedStored) {
        const registeredList = JSON.parse(updatedStored);
        const updatedList = registeredList.filter((acc: any) => acc.user?.id !== userId);
        localStorage.setItem('stat_registered_accounts', JSON.stringify(updatedList));
      }
      
      // 5. Atualização do estado do componente
      setInternalUsers(prev => prev.filter(u => u.id !== userId));
        
      alert('Utilizador interno removido com sucesso!');
      loadUsers(); // Recarrega os dados do Firestore para garantir consistência
    } catch (e) {
      console.error('Erro na exclusão:', e);
      alert('Ocorreu um erro ao excluir o utilizador: ' + (e instanceof Error ? e.message : 'Erro desconhecido'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 border-2 border-black rounded-xl hover:bg-slate-55 transition-colors cursor-pointer"
            title="Voltar ao Painel"
          >
            <ArrowLeft className="h-5 w-5 text-slate-800" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl  font-black text-slate-950 uppercase tracking-tight">
              Gestão de Pessoal Interno
            </h2>
            <p className="text-xs text-slate-500 ">
              Registo, atribuição de eixos e coordenação de equipas de preenchimento interno para a IES.
            </p>
          </div>
        </div>

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-2 bg-[#fec107] border-2 border-black hover:bg-[#fec107]/90 text-black  font-black py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)]"
          >
            <UserPlus className="h-4 w-4" /> Registar Novo Utilizador
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Create/Add form */}
        {showAddForm && (
          <div className="lg:col-span-1 bg-white border-[3px] border-black rounded-[22px] p-5 shadow-[5px_5px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className=" font-black text-slate-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                📝 Novo Utilizador Interno
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-xs uppercase font-black text-slate-400 hover:text-black cursor-pointer"
              >
                Cancelar
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-xs text-slate-550 font-black uppercase tracking-wider block mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dr. Salvador Chissaque"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-black rounded-xl px-3 py-2 text-xs "
                />
              </div>

              <div>
                <label className="text-xs text-slate-550 font-black uppercase tracking-wider block mb-1">Nome de Utilizador / Email</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: salvador.uem@sige.ac.mz"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-black rounded-xl px-3 py-2 text-xs "
                />
              </div>

              <div>
                <label className="text-xs text-slate-550 font-black uppercase tracking-wider block mb-1">Palavra-passe / Senha</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Sua Palavra-Passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-black rounded-xl px-3 py-2 text-xs  pl-8"
                  />
                  <Key className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-550 font-black uppercase tracking-wider block mb-1">Departamento / Cargo</label>
                <select
                  required
                  value={newCargo}
                  onChange={(e) => setNewCargo(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-black rounded-xl px-3 py-2 text-xs "
                >
                  <option value="">Selecione...</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Registo Académico">Registo Académico</option>
                  <option value="Departamento de Finanças">Departamento de Finanças</option>
                  <option value="Departamento de Património">Departamento de Património</option>
                  <option value="Repartição de Bolsa">Repartição de Bolsa</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-slate-950 border-2 border-black hover:bg-slate-900 text-[#fec107]  font-black py-2.5 rounded-xl text-xs shadow-[2px_2px_0px_rgba(254,193,7,1)] hover:shadow-none transition-all cursor-pointer"
              >
                <UserPlus className="h-4 w-4" /> Registar e Conceder Acesso
              </button>
            </form>
          </div>
        )}

        {/* Right Side: List of users */}
        <div className={`bg-white border-[3px] border-black rounded-[22px] p-5 shadow-[5px_5px_0px_rgba(0,0,0,1)] ${showAddForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="pb-3 border-b border-slate-100 mb-4 flex items-center justify-between">
            <h3 className=" font-black text-slate-950 text-xs uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
              📋 Utilizadores Internos Registados ({internalUsers.length})
            </h3>
            <span className="text-xs bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded font-mono uppercase tracking-widest">
              INSTITUIÇÃO ATIVA
            </span>
          </div>

          {internalUsers.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="inline-flex items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-full">
                <Users className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <h4 className=" font-black text-slate-800 text-sm uppercase">Nenhum utilizador interno registado</h4>
                <p className="text-xs text-slate-400  max-w-sm mx-auto mt-1 leading-relaxed">
                  Crie contas para os seus técnicos delegando-lhes o preenchimento de eixos específicos (Corpo Docente, Discentes, Recursos Financeiros, etc.).
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {internalUsers.map((user) => (
                <div key={user.id} className="border-3 border-black rounded-2xl p-4 flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all bg-white relative">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <span className=" font-black text-base text-slate-950 block truncate uppercase leading-tight">
                          {user.name}
                        </span>
                        <span className="text-xs text-slate-450 block font-mono truncate mt-0.5">
                          Usuário: {user.email} {user.cargo ? `(${user.cargo})` : ''}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteUser(e, user.id, user.name)}
                        className="p-1 px-1.5 border border-red-200 text-red-650 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remover Acesso"
                      >
                        <Trash2 className="h-3.5 w-3.5 pointer-events-none" />
                      </button>
                    </div>

                     <div className="p-3 bg-blue-50/70 border-2 border-blue-105 rounded-xl">
                      <span className="text-xs text-blue-800 font-extrabold uppercase block tracking-wider font-mono">
                        ⚙️ EIXO(S) DE PREENCHIMENTO:
                      </span>
                      <span className="text-xs text-slate-950 font-black  mt-1 block uppercase">
                        {user.assignedEixo ? user.assignedEixo.split(',').map(e => EIXO_LABELS_FULL[e] || e).join(', ') : 'Qualquer'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 mt-4 text-slate-400 uppercase tracking-wider font-mono">
                    <span className="flex items-center gap-1 font-extrabold text-[#2e7d32]">
                      <CheckCircle className="h-3 w-3 text-green-655" /> ATIVO NO SISTEMA
                    </span>
                    <span>Nível Técnico</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
