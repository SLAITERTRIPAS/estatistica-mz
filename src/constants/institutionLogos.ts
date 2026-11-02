import { User, Institution } from '../types';
import { MOZAMBIQUE_EMBLEM, SYSTEM_LOGO } from './assets';

export interface PredefinedLogo {
  id: string;
  name: string;
  shortName: string;
  category: 'universidade' | 'provincial' | 'ministerial' | 'tecnologia';
  svgDataUri: string;
}

// Crisp inline SVG Data URIs for Mozambique Higher Education Institutions, Provincial Directorates and Ministerial Departments
export const PREDEFINED_LOGOS: PredefinedLogo[] = [
  {
    id: 'uem',
    name: 'Universidade Eduardo Mondlane',
    shortName: 'UEM',
    category: 'universidade',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%230b1e36"/><circle cx="60" cy="60" r="48" fill="none" stroke="%23fec107" stroke-width="4"/><circle cx="60" cy="60" r="40" fill="%230f2b48"/><path d="M60 26 L76 56 L60 50 L44 56 Z" fill="%23fec107"/><path d="M36 62 Q60 52 84 62 L84 82 Q60 72 36 82 Z" fill="%23ffffff"/><path d="M60 53 L60 81" stroke="%230b1e36" stroke-width="2"/><text x="60" y="97" font-size="12" font-weight="900" font-family="sans-serif" fill="%23fec107" text-anchor="middle">UEM</text></svg>`
  },
  {
    id: 'up',
    name: 'Universidade Pedagógica de Maputo',
    shortName: 'UP-Maputo',
    category: 'universidade',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%23064e3b"/><circle cx="60" cy="60" r="48" fill="none" stroke="%2334d399" stroke-width="4"/><circle cx="60" cy="60" r="40" fill="%23047857"/><polygon points="60,28 78,52 68,52 68,82 52,82 52,52 42,52" fill="%23fef08a"/><circle cx="60" cy="40" r="6" fill="%23f97316"/><text x="60" y="97" font-size="12" font-weight="900" font-family="sans-serif" fill="%23ffffff" text-anchor="middle">UP</text></svg>`
  },
  {
    id: 'unizambeze',
    name: 'Universidade Zambeze',
    shortName: 'UniZambeze',
    category: 'universidade',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%230c4a6e"/><circle cx="60" cy="60" r="48" fill="none" stroke="%2338bdf8" stroke-width="4"/><circle cx="60" cy="60" r="40" fill="%230284c7"/><path d="M30 65 Q45 50 60 65 T90 65" fill="none" stroke="%23ffffff" stroke-width="6" stroke-linecap="round"/><path d="M30 77 Q45 62 60 77 T90 77" fill="none" stroke="%23fde047" stroke-width="5" stroke-linecap="round"/><polygon points="60,25 72,48 48,48" fill="%23fde047"/><text x="60" y="98" font-size="10" font-weight="900" font-family="sans-serif" fill="%23ffffff" text-anchor="middle">ZAMBEZE</text></svg>`
  },
  {
    id: 'unilurio',
    name: 'Universidade Lúrio',
    shortName: 'UniLúrio',
    category: 'universidade',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%231e1b4b"/><circle cx="60" cy="60" r="48" fill="none" stroke="%23818cf8" stroke-width="4"/><circle cx="60" cy="60" r="40" fill="%23312e81"/><path d="M60 25 L88 78 L32 78 Z" fill="none" stroke="%23a5b4fc" stroke-width="5"/><circle cx="60" cy="52" r="10" fill="%23fbbf24"/><text x="60" y="98" font-size="11" font-weight="900" font-family="sans-serif" fill="%23ffffff" text-anchor="middle">LÚRIO</text></svg>`
  },
  {
    id: 'unilicungo',
    name: 'Universidade Licungo',
    shortName: 'UniLicungo',
    category: 'universidade',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%23831843"/><circle cx="60" cy="60" r="48" fill="none" stroke="%23f472b6" stroke-width="4"/><circle cx="60" cy="60" r="40" fill="%239d174d"/><path d="M40 78 L60 30 L80 78" fill="none" stroke="%23fbcfe8" stroke-width="6" stroke-linecap="round"/><circle cx="60" cy="62" r="8" fill="%23fde047"/><text x="60" y="98" font-size="10" font-weight="900" font-family="sans-serif" fill="%23ffffff" text-anchor="middle">LICUNGO</text></svg>`
  },
  {
    id: 'isctem',
    name: 'Instituto Superior de Ciências e Tecnologia',
    shortName: 'ISCTEM',
    category: 'universidade',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%2318181b"/><circle cx="60" cy="60" r="48" fill="none" stroke="%2306b6d4" stroke-width="4"/><circle cx="60" cy="60" r="40" fill="%2327272a"/><path d="M42 42 H78 V54 H66 V78 H54 V54 H42 Z" fill="%2322d3ee"/><circle cx="60" cy="32" r="5" fill="%23facc15"/><text x="60" y="98" font-size="11" font-weight="900" font-family="sans-serif" fill="%23ffffff" text-anchor="middle">ISCTEM</text></svg>`
  },
  {
    id: 'ucm',
    name: 'Universidade Católica de Moçambique',
    shortName: 'UCM',
    category: 'universidade',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%23450a0a"/><circle cx="60" cy="60" r="48" fill="none" stroke="%23fca5a5" stroke-width="4"/><circle cx="60" cy="60" r="40" fill="%237f1d1d"/><path d="M60 25 V80 M42 45 H78" stroke="%23fef08a" stroke-width="7" stroke-linecap="round"/><text x="60" y="98" font-size="12" font-weight="900" font-family="sans-serif" fill="%23ffffff" text-anchor="middle">UCM</text></svg>`
  },
  {
    id: 'isutc',
    name: 'Inst. Sup. de Transportes e Comunicações',
    shortName: 'ISUTC',
    category: 'universidade',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%230f172a"/><circle cx="60" cy="60" r="48" fill="none" stroke="%2338bdf8" stroke-width="4"/><circle cx="60" cy="60" r="40" fill="%231e293b"/><path d="M35 50 Q60 30 85 50 T60 85 Z" fill="none" stroke="%2338bdf8" stroke-width="4"/><circle cx="60" cy="55" r="7" fill="%23f59e0b"/><text x="60" y="98" font-size="11" font-weight="900" font-family="sans-serif" fill="%23ffffff" text-anchor="middle">ISUTC</text></svg>`
  },
  {
    id: 'provincial_padrao',
    name: 'Gabinete Provincial de Educação e Ensino Superior',
    shortName: 'Provincial',
    category: 'provincial',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%2314532d"/><circle cx="60" cy="60" r="48" fill="none" stroke="%23facc15" stroke-width="4"/><circle cx="60" cy="60" r="40" fill="%2315803d"/><path d="M60 28 L82 48 L72 78 L48 78 L38 48 Z" fill="%23fef08a"/><path d="M60 35 L60 70 M48 52 L72 52" stroke="%2314532d" stroke-width="3"/><text x="60" y="98" font-size="10" font-weight="900" font-family="sans-serif" fill="%23ffffff" text-anchor="middle">PROVÍNCIA</text></svg>`
  },
  {
    id: 'dnes_nacional',
    name: 'Direcção Nacional de Ensino Superior (DNES/MEC)',
    shortName: 'DNES-MEC',
    category: 'ministerial',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%230b0b29"/><circle cx="60" cy="60" r="48" fill="none" stroke="%23fec107" stroke-width="4"/><circle cx="60" cy="60" r="40" fill="%231e1e4a"/><polygon points="60,24 72,42 92,42 76,55 82,75 60,62 38,75 44,55 28,42 48,42" fill="%23fec107"/><text x="60" y="98" font-size="11" font-weight="900" font-family="sans-serif" fill="%23ffffff" text-anchor="middle">DNES</text></svg>`
  },
  {
    id: 'admin_sistema',
    name: 'Administração Suprema de TI e Soberania Digital',
    shortName: 'TI-SUPREMO',
    category: 'tecnologia',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%23020617"/><circle cx="60" cy="60" r="48" fill="none" stroke="%233b82f6" stroke-width="4"/><circle cx="60" cy="60" r="40" fill="%230f172a"/><path d="M40 40 L60 25 L80 40 L80 80 L60 95 L40 80 Z" fill="none" stroke="%2360a5fa" stroke-width="4"/><circle cx="60" cy="60" r="10" fill="%23f59e0b"/><text x="60" y="98" font-size="9" font-weight="900" font-family="sans-serif" fill="%2393c5fd" text-anchor="middle">SIGDE-TI</text></svg>`
  }
];

export interface HeaderUserBranding {
  logoUrl: string;
  entityName: string;
  entitySubtitle: string;
  badgeText: string;
  badgeBg: string;
  badgeTextColor: string;
  provinceOrRegion?: string;
  isPersonalized: boolean;
}

/**
 * Resolves the personalized logo and entity metadata for any logged-in user.
 */
export function resolveUserHeaderBranding(user: User | null, institutions: Institution[]): HeaderUserBranding {
  if (!user) {
    return {
      logoUrl: SYSTEM_LOGO,
      entityName: 'SISTEMA INTEGRADO DE GESTÃO ESTATÍSTICA',
      entitySubtitle: 'República de Moçambique • DNES',
      badgeText: 'PÚBLICO',
      badgeBg: 'bg-slate-800',
      badgeTextColor: 'text-slate-300',
      isPersonalized: false
    };
  }

  // 1. Check if user is associated with an IES
  const isIESRole = ['ies', 'OrgaoMaximoIES', 'FocalPoint', 'ies_interno'].includes(user.role);
  if (isIESRole) {
    const foundInst = institutions.find(i => i.id === user.institutionId || (user.institutionName && i.name.toLowerCase().includes(user.institutionName.toLowerCase())));
    
    // Check if institution has explicit logoUrl, or user has logoUrl/photoURL
    let logo = foundInst?.logoUrl || user.logoUrl || user.photoURL;
    
    // Fallback matching by institution acronym/name
    if (!logo && (foundInst || user.institutionName)) {
      const nameToCheck = (foundInst?.name || user.institutionName || '').toLowerCase();
      const abbrToCheck = (foundInst?.abbreviation || '').toLowerCase();

      if (nameToCheck.includes('eduardo mondlane') || abbrToCheck === 'uem') {
        logo = PREDEFINED_LOGOS.find(p => p.id === 'uem')?.svgDataUri;
      } else if (nameToCheck.includes('pedagógica') || abbrToCheck === 'up') {
        logo = PREDEFINED_LOGOS.find(p => p.id === 'up')?.svgDataUri;
      } else if (nameToCheck.includes('zambeze') || abbrToCheck === 'unizambeze') {
        logo = PREDEFINED_LOGOS.find(p => p.id === 'unizambeze')?.svgDataUri;
      } else if (nameToCheck.includes('lúrio') || abbrToCheck === 'unilurio') {
        logo = PREDEFINED_LOGOS.find(p => p.id === 'unilurio')?.svgDataUri;
      } else if (nameToCheck.includes('licungo') || abbrToCheck === 'unilicungo') {
        logo = PREDEFINED_LOGOS.find(p => p.id === 'unilicungo')?.svgDataUri;
      } else if (nameToCheck.includes('isctem')) {
        logo = PREDEFINED_LOGOS.find(p => p.id === 'isctem')?.svgDataUri;
      } else if (nameToCheck.includes('católica') || abbrToCheck === 'ucm') {
        logo = PREDEFINED_LOGOS.find(p => p.id === 'ucm')?.svgDataUri;
      } else if (nameToCheck.includes('isutc')) {
        logo = PREDEFINED_LOGOS.find(p => p.id === 'isutc')?.svgDataUri;
      }
    }

    if (!logo) {
      logo = PREDEFINED_LOGOS.find(p => p.id === 'uem')?.svgDataUri || SYSTEM_LOGO;
    }

    const instName = foundInst?.name || user.institutionName || 'Instituição de Ensino Superior';
    const instAbbr = foundInst?.abbreviation ? ` (${foundInst.abbreviation})` : '';

    return {
      logoUrl: logo,
      entityName: `${instName}${instAbbr}`,
      entitySubtitle: user.role === 'OrgaoMaximoIES' ? 'Gabinete do Reitor / Órgão Máximo' : 'Ponto Focal Estatístico Institucional',
      badgeText: user.role === 'OrgaoMaximoIES' ? 'REITORIA / LIDERANÇA' : 'IES • PONTO FOCAL',
      badgeBg: 'bg-emerald-500/20 border border-emerald-500/40',
      badgeTextColor: 'text-emerald-300',
      provinceOrRegion: foundInst?.province || user.province,
      isPersonalized: true
    };
  }

  // 2. Provincial Level
  if (user.role === 'provincial' || user.role === 'RepresentanteProvincial') {
    const provLogo = user.logoUrl || user.photoURL || PREDEFINED_LOGOS.find(p => p.id === 'provincial_padrao')?.svgDataUri || MOZAMBIQUE_EMBLEM;
    const provName = user.province || 'Geral';
    return {
      logoUrl: provLogo,
      entityName: `DIRECÇÃO PROVINCIAL DE ${provName.toUpperCase()}`,
      entitySubtitle: 'Gabinete Provincial de Estatística e Inquéritos',
      badgeText: `PROVÍNCIA DE ${provName.toUpperCase()}`,
      badgeBg: 'bg-amber-500/20 border border-amber-500/40',
      badgeTextColor: 'text-amber-300',
      provinceOrRegion: provName,
      isPersonalized: true
    };
  }

  // 3. Regional Level
  if (user.role === 'regional' || user.role === 'RepresentanteRegional') {
    const regLogo = user.logoUrl || user.photoURL || PREDEFINED_LOGOS.find(p => p.id === 'provincial_padrao')?.svgDataUri || MOZAMBIQUE_EMBLEM;
    const regName = user.region || 'Nacional';
    return {
      logoUrl: regLogo,
      entityName: `COORDENAÇÃO REGIONAL ${regName.toUpperCase()}`,
      entitySubtitle: 'Supervisão Territorial de Dados Estatísticos',
      badgeText: `REGIÃO ${regName.toUpperCase()}`,
      badgeBg: 'bg-cyan-500/20 border border-cyan-500/40',
      badgeTextColor: 'text-cyan-300',
      provinceOrRegion: regName,
      isPersonalized: true
    };
  }

  // 4. Central / National / Ministerial Level
  if (['nacional', 'central', 'Ministerial'].includes(user.role)) {
    const natLogo = user.logoUrl || user.photoURL || PREDEFINED_LOGOS.find(p => p.id === 'dnes_nacional')?.svgDataUri || MOZAMBIQUE_EMBLEM;
    return {
      logoUrl: natLogo,
      entityName: 'DIRECÇÃO NACIONAL DE ENSINO SUPERIOR (DNES)',
      entitySubtitle: 'Ministério de Educação e Cultura • Moçambique',
      badgeText: 'COORDENAÇÃO CENTRAL',
      badgeBg: 'bg-indigo-500/20 border border-indigo-500/40',
      badgeTextColor: 'text-indigo-300',
      isPersonalized: true
    };
  }

  // 5. System Administrator / Programmer
  if (user.role === 'sistema' || user.isProgrammer || user.isOwner) {
    // Strictly show the official system logo in the header for the general administrator/programmer
    return {
      logoUrl: SYSTEM_LOGO,
      entityName: 'ADMINISTRAÇÃO DO SISTEMA & PROGRAMAÇÃO',
      entitySubtitle: user.systemId ? `Engenharia Soberana • ID: ${user.systemId}` : 'Gestão Global de Arquitetura SIGDE',
      badgeText: 'ADMIN SUPREMO TI',
      badgeBg: 'bg-yellow-500/20 border border-yellow-500/40',
      badgeTextColor: 'text-[#fec107]',
      isPersonalized: true
    };
  }

  // Default Fallback
  return {
    logoUrl: user.logoUrl || user.photoURL || SYSTEM_LOGO,
    entityName: user.name,
    entitySubtitle: user.role.toUpperCase(),
    badgeText: user.role.toUpperCase(),
    badgeBg: 'bg-slate-800',
    badgeTextColor: 'text-slate-200',
    isPersonalized: true
  };
}
