import React from 'react';
import { Institution } from '../types';
import { MOZAMBIQUE_EMBLEM } from '../constants/assets';

interface ReportCoverPageProps {
  institution?: Institution;
  year: number;
  scope?: 'nacional' | 'regional' | 'provincial' | 'institucional';
  province?: string;
  region?: string;
}

export default function ReportCoverPage({ institution, year, scope = 'institucional', province, region }: ReportCoverPageProps) {
  // Get label based on requested spec: RELATÓRIO (REGIONAL, PROVINCIAL, INSTITUCIONAL) DE DADOS ESTATÍSTICOS REFERENTE AO ANO (N-1)
  const getReportTitle = () => {
    const scopeUpper = (scope || 'institucional').toUpperCase();
    return `RELATÓRIO ${scopeUpper} DE DADOS ESTATÍSTICOS REFERENTE AO ANO ${year - 1}`;
  };

  const getEntityName = () => {
    if (scope === 'institucional' && institution) {
      return institution.name.toUpperCase();
    }
    if (scope === 'provincial') {
      return `PROVÍNCIA DE ${province || 'TODAS AS PROVÍNCIAS'}`.toUpperCase();
    }
    if (scope === 'regional') {
      return `REGIÃO ${region || 'TODAS AS REGIÕES'}`.toUpperCase();
    }
    return 'DADOS ESTATÍSTICOS DE NÍVEL NACIONAL CONSOLIDADO';
  };

  return (
    <div 
      className="cover-page bg-white border-[3px] border-slate-950 rounded-[24px] p-12 shadow-[6px_6px_0px_rgba(0,0,0,1)] print:shadow-none print:border-none print:rounded-none min-h-[850px] flex flex-col items-center justify-between text-center" 
      id="sige-report-printable-cover"
     
    >
      
      {/* 1. Official Header block requested by user */}
      <div className="space-y-4 w-full flex flex-col items-center">
        <img 
          src={MOZAMBIQUE_EMBLEM} 
          alt="Emblema de Moçambique" 
          className="w-44 aspect-[238/180] object-contain mb-4 mix-blend-multiply [filter:contrast(106%)_brightness(102%)]" 
          style={{ mixBlendMode: 'multiply' }}
        />
        <div className="space-y-1.5">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-widest leading-tight">
            REPÚBLICA DE MOÇAMBIQUE
          </h1>
          <h2 className="text-sm md:text-base font-black text-slate-800 uppercase tracking-widest leading-tight">
            MINISTÉRIO DE EDUCAÇÃO E CULTURA
          </h2>
          <h3 className="text-xs md:text-sm font-black text-slate-750 uppercase tracking-wider">
            DIRECÇÃO NACIONAL DE ENSINO SUPERIOR
          </h3>
        </div>
        <div className="w-40 h-1 bg-[#009E60] my-4 rounded"></div>
      </div>

      {/* 2. Main Title section block */}
      <div className="border-y-4 border-slate-950 py-10 w-full my-8 bg-slate-50/50 px-6">
        <h4 className="text-md sm:text-lg font-black text-emerald-800 uppercase tracking-[0.15em] mb-4 leading-relaxed">
          {getReportTitle()}
        </h4>
        <h5 className="text-2xl sm:text-4xl font-extrabold text-slate-900 uppercase tracking-tight leading-snug">
          {getEntityName()}
        </h5>
      </div>

      {/* 3. Operational details & metadata footer */}
      <div className="w-full max-w-xl mx-auto border border-slate-200/90 bg-slate-50/70 p-8 rounded-[24px] text-left space-y-4 shadow-sm" id="sige-metadata-card">
        
        {/* Row 1: SISTEMA */}
        <div className="flex justify-between items-baseline border-b border-slate-100 pb-3">
          <span className="text-slate-800 font-extrabold uppercase tracking-widest text-xs sm:text-sm">
            SISTEMA:
          </span>
          <span className="text-slate-900 font-black text-sm sm:text-base tracking-tight">
            SIGDE- ONLINE - MOÇAMBIQUE
          </span>
        </div>

        {/* Row 2: ANO DE RECOLHA */}
        <div className="flex justify-between items-baseline border-b border-slate-100 pb-3">
          <span className="text-slate-800 font-extrabold uppercase tracking-widest text-xs sm:text-sm">
            ANO DE RECOLHA:
          </span>
          <span className="text-slate-900 font-black text-base sm:text-lg">
            {year}
          </span>
        </div>

        {/* Row 3: ANO DE REFERÊNCIA */}
        <div className="flex justify-between items-baseline border-b border-slate-100 pb-3">
          <span className="text-slate-800 font-extrabold uppercase tracking-widest text-xs sm:text-sm">
            ANO DE REFERÊNCIA:
          </span>
          <span className="text-slate-900 font-black text-base sm:text-lg text-emerald-800">
            {year - 1}
          </span>
        </div>

        {/* Row 4: Level indicator based on scope */}
        {scope === 'institucional' && institution && (
          <div className="flex justify-between items-baseline pb-1">
            <span className="text-slate-800 font-extrabold uppercase tracking-widest text-xs sm:text-sm">
              INSTITUIÇÃO:
            </span>
            <span className="text-slate-900 font-black text-sm sm:text-base text-right pl-6 border-b border-dashed border-slate-200">
              {institution.name.toUpperCase()}
            </span>
          </div>
        )}

        {scope === 'provincial' && (
          <div className="flex justify-between items-baseline pb-1">
            <span className="text-slate-800 font-extrabold uppercase tracking-widest text-xs sm:text-sm">
              GABINETE PROVINCIAL:
            </span>
            <span className="text-slate-900 font-black text-sm sm:text-base text-right">
              {(province || 'TODAS').toUpperCase()}
            </span>
          </div>
        )}

        {scope === 'regional' && (
          <div className="flex justify-between items-baseline pb-1">
            <span className="text-slate-800 font-extrabold uppercase tracking-widest text-xs sm:text-sm">
              GABINETE REGIONAL:
            </span>
            <span className="text-slate-900 font-black text-sm sm:text-base text-right">
              {`REGIÃO ${region || 'TODAS'}`.toUpperCase()}
            </span>
          </div>
        )}

        {scope === 'nacional' && (
          <div className="flex justify-between items-baseline pb-1">
            <span className="text-slate-800 font-extrabold uppercase tracking-widest text-xs sm:text-sm">
              COORDENAÇÃO NACIONAL:
            </span>
            <span className="text-slate-900 font-black text-sm sm:text-base text-right">
              TODAS AS PROVÍNCIAS
            </span>
          </div>
        )}
      </div>

      <div className="mt-8 border-t border-slate-950 pt-4 w-full text-center">
         <p className="text-xs font-bold text-slate-950">Este documento tem carácter oficial e foi gerado digitalmente pelo SIGDE- ONLINE - Moçambique.</p>
         <p className="text-xs text-slate-800">Responsável: Administrador do Sistema | Nível: SISTEM</p>
      </div>

    </div>
  );
}
