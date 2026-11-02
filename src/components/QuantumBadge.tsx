import React from 'react';
import { Atom, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';

interface QuantumBadgeProps {
  score?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  pulse?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function QuantumBadge({
  score = 96.4,
  label = 'Coerência Quântica',
  size = 'md',
  showIcon = true,
  pulse = true,
  onClick,
  className = ''
}: QuantumBadgeProps) {
  const isHigh = score >= 90;
  const isMed = score >= 75 && score < 90;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-bold'
  };

  const colorClasses = isHigh
    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-emerald-900/30'
    : isMed
    ? 'bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-amber-900/30'
    : 'bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-rose-900/30';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full border shadow-sm font-mono transition-all duration-300 ${sizeClasses[size]} ${colorClasses} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'
      } ${className}`}
      title={`IA Quântica SIGDE: Coerência Estatística de ${score}%`}
    >
      {showIcon && (
        <span className="relative flex items-center justify-center">
          <Atom className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} animate-spin`} style={{ animationDuration: '8s' }} />
          {pulse && isHigh && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
          )}
        </span>
      )}
      <span className="font-semibold tracking-wide">{label}:</span>
      <span className="font-black">{score.toFixed(1)}%</span>
    </button>
  );
}
