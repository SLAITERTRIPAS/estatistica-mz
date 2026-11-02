import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface TestUserListProps {
  accounts: any[];
  onSelectAccount: (account: any) => void;
}

export default function TestUserList({ accounts, onSelectAccount }: TestUserListProps) {
  const [isOpen, setIsOpen] = useState(false);
  console.log('DEBUG: TestUserList rendering. Accounts received:', accounts ? accounts.length : 'null');
  
  const hierarchy = ['Nacional / Ministerial', 'Regional', 'Provincial', 'Institucional / IES'];
  
  const groupedUsers = accounts.reduce((acc, curr) => {
    const role = curr.user?.role;
    let level = 'Outros';
    if (['Ministerial', 'central', 'nacional', 'sistema'].includes(role)) level = 'Nacional / Ministerial';
    else if (['regional', 'RepresentanteRegional'].includes(role)) level = 'Regional';
    else if (['provincial', 'RepresentanteProvincial'].includes(role)) level = 'Provincial';
    else if (['OrgaoMaximoIES', 'FocalPoint', 'ies', 'ies_interno'].includes(role)) level = 'Institucional / IES';
    
    if (!acc[level]) acc[level] = [];
    acc[level].push(curr);
    return acc;
  }, {} as Record<string, any[]>);

  if (accounts.length === 0) return null;

  return (
    <div className="relative mt-4 w-full">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-amber-50 border-2 border-amber-200 hover:border-amber-400 text-amber-950 font-black text-sm px-5 py-3 rounded-xl transition-all shadow-[2px_2px_0px_rgba(217,119,6,0.3)]"
      >
        <span>🧪 Aceder como Usuário de Teste</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-900 rounded-xl shadow-2xl max-h-96 overflow-y-auto custom-scrollbar p-2">
          {hierarchy.map(level => {
            const users = groupedUsers[level];
            if (!users || users.length === 0) return null;
            return (
              <div key={level} className="mb-3">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1 px-2 pb-1 border-b border-slate-100">{level}</h4>
                {users.map((acc, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      onSelectAccount(acc);
                      setIsOpen(false);
                    }}
                    className="p-2 hover:bg-emerald-50 cursor-pointer rounded-lg border border-transparent hover:border-emerald-200 transition-all flex flex-col"
                  >
                    <p className="text-xs font-black text-slate-900">{acc.user.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-mono">{acc.user.role}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
