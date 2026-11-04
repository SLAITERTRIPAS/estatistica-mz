import React, { useState, useEffect } from 'react';
import { X, Search, RefreshCw, MapPin, ChevronDown, ChevronUp, Wind, Droplets, Thermometer, CloudSun } from 'lucide-react';
import { ProvinceWeather, DistrictWeather } from '../data/mozambiqueWeather';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProvince?: string;
  userDistrict?: string;
  currentWeather?: {
    location: string;
    temp: number;
    max: number;
    min: number;
    condition: string;
    icon: string;
    humidity?: number;
    windSpeed?: number;
  } | null;
  onSelectDistrict?: (district: DistrictWeather, province: ProvinceWeather) => void;
}

export default function WeatherModal({
  isOpen,
  onClose,
  userProvince,
  userDistrict,
  currentWeather,
  onSelectDistrict
}: WeatherModalProps) {
  const [provinces, setProvinces] = useState<ProvinceWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'Todas' | 'Sul' | 'Centro' | 'Norte'>('Todas');
  const [expandedProvinces, setExpandedProvinces] = useState<Record<string, boolean>>({});
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchAllWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/weather/all');
      if (res.ok) {
        const data = await res.json();
        if (data.provinces) {
          setProvinces(data.provinces);
          setLastUpdated(new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          
          // Auto-expand user's province
          if (userProvince) {
            const pMatch = data.provinces.find((p: ProvinceWeather) => 
              p.name.toLowerCase().includes(userProvince.toLowerCase()) || 
              userProvince.toLowerCase().includes(p.name.toLowerCase())
            );
            if (pMatch) {
              setExpandedProvinces(prev => ({ ...prev, [pMatch.id]: true }));
            }
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch /api/weather/all:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAllWeather();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleProvince = (id: string) => {
    setExpandedProvinces(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    provinces.forEach(p => { allExpanded[p.id] = true; });
    setExpandedProvinces(allExpanded);
  };

  const collapseAll = () => {
    setExpandedProvinces({});
  };

  // Filter provinces and districts by search query and region
  const filteredProvinces = provinces.filter(prov => {
    if (selectedRegion !== 'Todas' && prov.region !== selectedRegion) {
      return false;
    }

    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const matchesProvince = prov.name.toLowerCase().includes(query) || prov.capital.toLowerCase().includes(query);
    const matchesAnyDistrict = prov.districts.some(d => d.name.toLowerCase().includes(query));

    return matchesProvince || matchesAnyDistrict;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0b0f19] border-2 border-[#fec107]/60 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#111827] px-6 py-4 border-b border-[#fec107]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-xl shadow-lg border border-amber-300">
              ☀️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide uppercase">
                  Boletim Meteorológico Nacional de Moçambique
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#00df82]/20 text-[#00df82] border border-[#00df82]/40 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  Tempo Real
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Monitorização Climatológica das 11 Províncias e Distritos • SIGDE / DNES
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-slate-700"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User's Current Location Highlight Banner */}
        {currentWeather && (
          <div className="bg-gradient-to-r from-[#141b2d] via-[#1a233b] to-[#141b2d] px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentWeather.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00df82]" />
                    Localização Detetada do Utilizador:
                  </span>
                  <span className="text-xs font-black text-[#00df82] uppercase bg-[#00df82]/10 px-2 py-0.5 rounded border border-[#00df82]/30">
                    {userProvince || currentWeather.location}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-white font-mono">{currentWeather.temp}°C</span>
                  <span className="text-xs font-bold text-amber-400">{currentWeather.condition}</span>
                  <span className="text-xs text-slate-400">
                    (Máx: <strong className="text-white">{currentWeather.max}°C</strong> / Mín: <strong className="text-white">{currentWeather.min}°C</strong>)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-300 bg-[#0d1322] px-3.5 py-1.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span>Humidade: <strong>{currentWeather.humidity ?? 65}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-emerald-400" />
                <span>Vento: <strong>{currentWeather.windSpeed ?? 14} km/h</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Search, Filter & Actions Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-[#0d1322] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shrink-0">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar província ou distrito (ex: Tete, Cahora-Bassa, Matola, Beira, Gurué, Palma)..."
              className="w-full bg-[#151c2e] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#fec107] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Region selector filter buttons */}
          <div className="flex items-center gap-1 bg-[#151c2e] p-1 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full">
            {(['Todas', 'Sul', 'Centro', 'Norte'] as const).map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedRegion === reg
                    ? 'bg-[#fec107] text-[#0b0f19] shadow-sm font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {reg === 'Todas' ? 'Todas as Províncias' : `Região ${reg}`}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={fetchAllWeather}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer disabled:opacity-50"
              title="Atualizar leituras meteorológicas"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#fec107]' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
            <button
              onClick={expandAll}
              className="px-2.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
              title="Expandir todos os distritos"
            >
              + Distritos
            </button>
            <button
              onClick={collapseAll}
              className="px-2.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
              title="Recolher todos"
            >
              -
            </button>
          </div>
        </div>

        {/* Scrollable Content: Provinces and Districts */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          {loading && provinces.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-[#fec107]" />
              <p className="text-sm font-bold tracking-wide">A carregar dados meteorológicos de todas as províncias e distritos de Moçambique...</p>
            </div>
          ) : filteredProvinces.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <p className="text-lg">🔍 Nenhuma província ou distrito encontrado para "{searchQuery}".</p>
              <p className="text-xs text-slate-500">Tente pesquisar por outro nome como "Tete", "Chimoio", "Nampula", "Xai-Xai" ou "Lichinga".</p>
            </div>
          ) : (
            filteredProvinces.map(prov => {
              const isExpanded = !!expandedProvinces[prov.id];
              const isUserProvince = userProvince && (
                prov.name.toLowerCase().includes(userProvince.toLowerCase()) || 
                userProvince.toLowerCase().includes(prov.name.toLowerCase())
              );

              // Filter districts within this province if query matches
              const visibleDistricts = searchQuery.trim() 
                ? prov.districts.filter(d => 
                    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    prov.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                : prov.districts;

              return (
                <div 
                  key={prov.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isUserProvince 
                      ? 'border-[#00df82] bg-[#10192e] shadow-[0_0_15px_rgba(0,223,130,0.15)]' 
                      : 'border-slate-800 bg-[#111726] hover:border-slate-700'
                  }`}
                >
                  {/* Province Header Accordion Item */}
                  <div 
                    onClick={() => toggleProvince(prov.id)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors select-none"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-[#1b233a] border border-slate-700/80 flex items-center justify-center text-2xl shadow-inner shrink-0">
                        {prov.icon}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                            {prov.name}
                          </h3>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            prov.region === 'Sul' ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' :
                            prov.region === 'Centro' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                            'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          }`}>
                            Região {prov.region}
                          </span>
                          {isUserProvince && (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-[#00df82] text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
                              📍 Província do Utilizador
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-2">
                          <span>Capital / Sede: <strong>{prov.capital}</strong></span>
                          <span>•</span>
                          <span>{prov.districts.length} Distritos Registados</span>
                        </p>
                      </div>
                    </div>

                    {/* Temperature and Controls */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-black text-white font-mono leading-none">
                          {prov.temp}°C
                        </div>
                        <div className="text-[11px] font-bold text-amber-400 mt-1">
                          {prov.condition}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Máx: {prov.max}°C | Mín: {prov.min}°C
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Districts Grid (Expandable) */}
                  {isExpanded && (
                    <div className="border-t border-slate-800/80 bg-[#0d121f] p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 text-xs gap-1">
                        <span className="font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#fec107]" />
                          Distritos de {prov.name} ({visibleDistricts.length})
                        </span>
                        <span className="text-[#00df82] font-mono text-[11px] font-bold">
                          💡 Clique em qualquer distrito para aplicar ao cabeçalho
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                        {visibleDistricts.map(dist => {
                          const isHighlightedDistrict = userDistrict && dist.name.toLowerCase().includes(userDistrict.toLowerCase());

                          return (
                            <div 
                              key={dist.name}
                              onClick={() => {
                                onSelectDistrict?.(dist, prov);
                                onClose();
                              }}
                              className={`p-3 rounded-xl border transition-all cursor-pointer group hover:scale-[1.02] active:scale-95 ${
                                isHighlightedDistrict
                                  ? 'bg-[#00df82]/15 border-[#00df82] text-white shadow-[0_0_12px_rgba(0,223,130,0.25)]'
                                  : 'bg-[#151c2d] border-slate-800/90 hover:border-[#fec107] hover:bg-[#1a233b] text-slate-200'
                              }`}
                              title={`Clique para aplicar a temperatura de ${dist.name} (${prov.name}) no cabeçalho do sistema`}
                            >
                              <div className="flex items-start justify-between gap-1 mb-1.5">
                                <div className="min-w-0 flex-1">
                                  <span className="font-black text-xs leading-tight text-white line-clamp-1 group-hover:text-[#fec107] transition-colors" title={dist.name}>
                                    {dist.name}
                                  </span>
                                  <span className="text-[9px] text-[#00df82] font-mono block opacity-0 group-hover:opacity-100 transition-opacity">
                                    Aplicar no cabeçalho ➔
                                  </span>
                                </div>
                                <span className="text-lg shrink-0">{dist.icon}</span>
                              </div>

                              <div className="flex items-baseline justify-between mt-1">
                                <span className="text-lg font-black font-mono text-white group-hover:text-[#fec107] transition-colors">
                                  {dist.temp}°C
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {dist.min}°C / {dist.max}°C
                                </span>
                              </div>

                              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                                <span>💧 {dist.humidity}%</span>
                                <span>💨 {dist.windSpeed} km/h</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#111827] px-6 py-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00df82] animate-pulse"></span>
            <span>Serviço Meteorológico Oficial SIGDE-ONLINE</span>
            {lastUpdated && <span className="font-mono text-slate-500">• Última atualização: {lastUpdated}</span>}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            Fechar Painel
          </button>
        </div>
      </div>
    </div>
  );
}
