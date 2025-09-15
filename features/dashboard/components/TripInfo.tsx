
import React from 'react';

interface TripInfoProps {
  range: number;
}

const TripInfo: React.FC<TripInfoProps> = ({ range }) => {
  return (
    <div className="bg-brand-surface rounded-2xl p-4 flex justify-around text-center">
      <div>
        <p className="text-xs text-brand-text-secondary">EST. RANGE</p>
        <p className="font-mono text-2xl font-bold text-brand-accent">{range.toFixed(0)} km</p>
      </div>
      <div>
        <p className="text-xs text-brand-text-secondary">TRIP TIME</p>
        <p className="font-mono text-2xl font-bold text-brand-accent">00:42:15</p>
      </div>
      <div>
        <p className="text-xs text-brand-text-secondary">AVG. SPEED</p>
        <p className="font-mono text-2xl font-bold text-brand-accent">67 km/h</p>
      </div>
    </div>
  );
};

export default TripInfo;
