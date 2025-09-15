
import React from 'react';

interface OdometerProps {
  distance: number;
}

const MemoizedDigit: React.FC<{ digit: string }> = React.memo(({ digit }) => {
    return (
      <span className="bg-brand-bg text-brand-primary px-2 py-1 rounded-md text-3xl">
        {digit}
      </span>
    );
});

const Odometer: React.FC<OdometerProps> = ({ distance }) => {
  const formattedDistance = distance.toFixed(1).padStart(6, '0');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
        <h3 className="text-sm font-bold text-brand-text-secondary mb-2">ODOMETER</h3>
        <div className="flex items-center gap-1 font-mono font-bold">
            {formattedDistance.split('').map((digit, index) => 
                digit === '.' ? (
                    <span key={index} className="text-brand-primary text-3xl self-end pb-1">.</span>
                ) : (
                    <MemoizedDigit key={index} digit={digit} />
                )
            )}
        </div>
        <p className="font-mono text-lg mt-2 text-brand-text-secondary">km</p>
    </div>
  );
};

export default Odometer;
