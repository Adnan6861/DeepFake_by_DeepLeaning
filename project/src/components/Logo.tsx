import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  showBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  showBadge = true,
  className = '',
  onClick,
}) => {
  // Size presets
  const sizeMap = {
    sm: {
      box: 'w-8 h-8 rounded-lg',
      img: 'w-full h-full',
      title: 'text-sm',
      sub: 'text-[9px]',
      dot: 'w-2 h-2',
    },
    md: {
      box: 'w-10 h-10 rounded-xl',
      img: 'w-full h-full',
      title: 'text-base sm:text-lg',
      sub: 'text-[10px]',
      dot: 'w-2.5 h-2.5',
    },
    lg: {
      box: 'w-14 h-14 rounded-2xl',
      img: 'w-full h-full',
      title: 'text-xl sm:text-2xl',
      sub: 'text-xs',
      dot: 'w-3 h-3',
    },
    xl: {
      box: 'w-20 h-20 rounded-3xl',
      img: 'w-full h-full',
      title: 'text-2xl sm:text-3xl',
      sub: 'text-sm',
      dot: 'w-3.5 h-3.5',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center space-x-3 select-none group transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Insignia Icon Container */}
      <div className="relative shrink-0">
        <div
          className={`${currentSize.box} bg-slate-950 border border-cyan-500/30 overflow-hidden flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 group-hover:scale-105 group-hover:border-cyan-400 transition-all duration-300 ring-1 ring-white/10`}
        >
          <img
            src="/logo.png"
            alt="Deepfake Detective"
            className={`${currentSize.img} object-cover rounded-lg`}
            loading="eager"
          />
        </div>

        {/* Live Forensic Status Indicator */}
        {showBadge && (
          <span
            className={`absolute -bottom-0.5 -right-0.5 ${currentSize.dot} rounded-full bg-emerald-400 border-2 border-slate-900 shadow-[0_0_8px_#34d399] animate-pulse`}
            title="AI Detection Engine Active"
          />
        )}
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center space-x-1 font-extrabold tracking-tight leading-tight">
            <span className={`${currentSize.title} text-white`}>Deepfake</span>
            <span
              className={`${currentSize.title} text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-teal-300`}
            >
              Detective
            </span>
          </div>

          {showSubtitle && (
            <p
              className={`${currentSize.sub} text-slate-400 font-mono tracking-wider uppercase font-medium mt-0.5 flex items-center space-x-1`}
            >
              <span>AI Media Forensics</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};
