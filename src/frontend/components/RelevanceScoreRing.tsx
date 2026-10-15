import React from 'react';

interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onClick?: () => void;
}

export const RelevanceScoreRing: React.FC<Props> = ({
  score,
  size = 'md',
  showLabel = true,
  onClick
}) => {
  const radius = size === 'lg' ? 26 : size === 'md' ? 18 : 13;
  const stroke = size === 'lg' ? 4 : size === 'md' ? 3 : 2;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const dimension = radius * 2 + 4;

  // Deep wine for high match, warm ochre for strong, dark mocha for moderate
  const ringColor = score >= 90 ? '#581C2E' : score >= 80 ? '#8C6834' : '#473832';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`inline-flex items-center gap-2 ${onClick ? 'cursor-pointer group' : ''}`}
      title={onClick ? 'Inspect target match breakdown' : undefined}
    >
      <div className="relative inline-flex items-center justify-center">
        <svg height={dimension} width={dimension} className="transform -rotate-90">
          <circle
            stroke="#E5DDD1"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={dimension / 2}
            cy={dimension / 2}
          />
          <circle
            stroke={ringColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={dimension / 2}
            cy={dimension / 2}
          />
        </svg>
        <span
          className={`absolute font-serif font-bold tabular-nums text-[#1C1311] ${
            size === 'lg' ? 'text-sm' : size === 'md' ? 'text-[11px]' : 'text-[9.5px]'
          }`}
        >
          {score}
        </span>
      </div>

      {showLabel && (
        <div className="text-left leading-tight font-mono">
          <div className="text-[10px] tracking-wider uppercase font-semibold text-[#581C2E] group-hover:underline">
            Match
          </div>
          <div className="text-[11px] font-medium text-[#735E55]">
            {score >= 90 ? 'Top Fit' : score >= 80 ? 'Strong' : 'Moderate'}
          </div>
        </div>
      )}
    </div>
  );
};
