
import React from 'react';

interface SpeedometerProps {
  speed: number;
}

const Speedometer: React.FC<SpeedometerProps> = ({ speed }) => {
  const normalizedSpeed = Math.min(speed, 240); // Max speed for visualization
  const rotation = (normalizedSpeed / 240) * 270 - 135;

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <svg className="absolute w-full h-full" viewBox="0 0 200 200">
        {/* Background Arc */}
        <path
          d="M 30 150 A 70 70 0 1 1 170 150"
          fill="none"
          stroke="rgba(0, 246, 255, 0.1)"
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* Foreground Arc */}
        <path
          d="M 30 150 A 70 70 0 1 1 170 150"
          fill="none"
          stroke="url(#speedGradient)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray="329.86"
          strokeDashoffset={329.86 * (1 - normalizedSpeed / 240)}
          className="transition-all duration-200"
        />
        <defs>
          <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FF85" />
            <stop offset="100%" stopColor="#00F6FF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="z-10 text-center">
        <span className="font-mono text-7xl font-bold text-brand-primary tracking-tighter">
          {Math.round(speed)}
        </span>
        <p className="text-brand-text-secondary font-medium -mt-2">km/h</p>
      </div>
    </div>
  );
};

export default Speedometer;
