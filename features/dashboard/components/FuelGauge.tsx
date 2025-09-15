
import React from 'react';

interface FuelGaugeProps {
    fuelPercentage: number;
}

const FuelGauge: React.FC<FuelGaugeProps> = ({ fuelPercentage }) => {
    const height = `${fuelPercentage}%`;
    const color = fuelPercentage > 50 ? 'bg-brand-accent' : fuelPercentage > 20 ? 'bg-yellow-400' : 'bg-red-500';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h3 className="text-sm font-bold text-brand-text-secondary mb-2">FUEL</h3>
            <div className="relative w-12 h-24 bg-brand-bg border-2 border-brand-primary/20 rounded-lg overflow-hidden">
                <div 
                    className={`absolute bottom-0 w-full ${color} transition-all duration-500`} 
                    style={{ height }}
                ></div>
            </div>
            <p className="font-mono text-xl font-bold mt-2 text-brand-primary">{fuelPercentage.toFixed(0)}%</p>
        </div>
    );
};

export default FuelGauge;
