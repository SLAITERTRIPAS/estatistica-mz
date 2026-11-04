import React, { useState, useEffect } from 'react';
import { User } from '../types';
import WeatherModal from './WeatherModal';
import { DistrictWeather, ProvinceWeather } from '../data/mozambiqueWeather';

interface WeatherWidgetProps {
  currentUser?: User;
}

export default function WeatherWidget({ currentUser }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<{
    location: string;
    province: string;
    district: string;
    temp: number;
    max: number;
    min: number;
    condition: string;
    icon: string;
    humidity?: number;
    windSpeed?: number;
    loading: boolean;
  }>(() => {
    // Check if user previously selected a specific district
    try {
      const saved = localStorage.getItem('stat_selected_district_weather');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.temp !== undefined) {
          return { ...parsed, loading: false };
        }
      }
    } catch {}

    return {
      location: currentUser?.province ? `${currentUser.province.toUpperCase()}` : 'TETE / CAHORA-BASSA',
      province: currentUser?.province || 'Tete',
      district: 'Cahora-Bassa',
      temp: 32,
      max: 35,
      min: 24,
      condition: 'Ensolarado',
      icon: '☀️',
      humidity: 52,
      windSpeed: 12,
      loading: true
    };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // If user already explicitly picked a district, keep it unless province changed
    const savedDistrict = localStorage.getItem('stat_selected_district_weather');
    if (savedDistrict) {
      try {
        const parsed = JSON.parse(savedDistrict);
        if (parsed && parsed.temp !== undefined) {
          setWeatherData({ ...parsed, loading: false });
          return;
        }
      } catch {}
    }

    const loadWeather = async (lat?: number, lon?: number) => {
      try {
        const queryParams = new URLSearchParams();
        if (lat !== undefined && lon !== undefined) {
          queryParams.set('lat', lat.toString());
          queryParams.set('lon', lon.toString());
        } else if (currentUser?.province) {
          queryParams.set('province', currentUser.province);
        }

        const res = await fetch(`/api/weather?${queryParams.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (isMounted && data.success) {
          setWeatherData({
            location: data.location || data.province || 'MOÇAMBIQUE',
            province: data.province || currentUser?.province || 'Tete',
            district: data.district || 'Centro',
            temp: data.temp ?? 28,
            max: data.max ?? 32,
            min: data.min ?? 22,
            condition: data.condition || 'Ensolarado',
            icon: data.icon || '☀️',
            humidity: data.humidity,
            windSpeed: data.windSpeed,
            loading: false
          });
        }
      } catch (err) {
        if (isMounted) {
          const userProv = currentUser?.province || 'Tete';
          setWeatherData(prev => ({
            ...prev,
            location: userProv.toUpperCase(),
            province: userProv,
            temp: userProv === 'Niassa' ? 25 : userProv === 'Tete' ? 34 : 29,
            max: userProv === 'Tete' ? 38 : 32,
            min: 22,
            loading: false
          }));
        }
      }
    };

    // Try HTML5 Geolocation with a safe 3s timeout
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (isMounted) {
            loadWeather(position.coords.latitude, position.coords.longitude);
          }
        },
        () => {
          if (isMounted) {
            loadWeather();
          }
        },
        { timeout: 3000, maximumAge: 300000 }
      );
    } else {
      loadWeather();
    }

    return () => {
      isMounted = false;
    };
  }, [currentUser?.province]);

  // Handler for when user clicks on a district in the modal
  const handleSelectDistrict = (dist: DistrictWeather, prov: ProvinceWeather) => {
    const updated = {
      location: `${dist.name.toUpperCase()} (${prov.name.toUpperCase()})`,
      province: prov.name,
      district: dist.name,
      temp: dist.temp,
      max: dist.max,
      min: dist.min,
      condition: dist.condition,
      icon: dist.icon,
      humidity: dist.humidity,
      windSpeed: dist.windSpeed,
      loading: false
    };

    setWeatherData(updated);
    try {
      localStorage.setItem('stat_selected_district_weather', JSON.stringify(updated));
    } catch {}
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all select-none text-left focus:outline-none"
        title="Clique para abrir o Boletim Meteorológico e selecionar qualquer província ou distrito para o cabeçalho"
        type="button"
      >
        <span className="text-sm shrink-0">{weatherData.icon}</span>
        <span className="uppercase tracking-tight font-bold text-[10px] sm:text-[11px] text-[#fec107] flex items-center gap-1">
          <span>CLIMA: {weatherData.location} {weatherData.temp}°C</span>
          <span className="text-slate-400 font-normal">
            (MÁX: {weatherData.max}°C / MÍN: {weatherData.min}°C)
          </span>
          <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded border border-amber-400/30 font-black ml-1">
            + Distritos
          </span>
        </span>
        {weatherData.loading && <span className="ml-0.5 animate-pulse text-[#fec107]">...</span>}
      </button>

      {/* Modal containing all 11 provinces & districts with real temperature */}
      <WeatherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userProvince={currentUser?.province || weatherData.province}
        userDistrict={weatherData.district}
        currentWeather={weatherData}
        onSelectDistrict={handleSelectDistrict}
      />
    </>
  );
}
