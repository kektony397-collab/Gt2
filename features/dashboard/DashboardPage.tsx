import React, { useState, useCallback } from 'react';
import { useAppStore } from '../../store';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useFuelCalculator } from '../../hooks/useFuelCalculator';
import Speedometer from './components/Speedometer';
import FuelGauge from './components/FuelGauge';
import Odometer from './components/Odometer';
import TripInfo from './components/TripInfo';
import AiReminder from './components/AiReminder';

const DashboardPage: React.FC = () => {
    const { geoState, startTracking, stopTracking } = useGeolocation();
    const [isTripActive, setIsTripActive] = useState(false);
    
    const { speedKmh, totalDistanceKm } = useAppStore((state) => state.bikeState);
    const { estimatedRangeKm, fuelPercentage } = useFuelCalculator();
    
    const handleToggleTrip = useCallback(() => {
        setIsTripActive(prev => {
            const nextState = !prev;
            if (nextState) {
                startTracking();
            } else {
                stopTracking();
            }
            return nextState;
        });
    }, [startTracking, stopTracking]);

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex justify-between items-center">
                 <h1 className="text-2xl font-bold text-brand-text-primary">Smart Dashboard</h1>
                 <button
                    onClick={handleToggleTrip}
                    className={`font-bold py-2 px-5 rounded-lg transition-all duration-300 text-brand-bg shadow-md ${
                        isTripActive 
                        ? 'bg-brand-secondary shadow-glow-secondary' 
                        : 'bg-brand-accent shadow-glow-primary'
                    }`}
                >
                    {isTripActive ? 'End Trip' : 'Start Trip'}
                </button>
            </div>
            
            <div className="flex-grow grid grid-cols-2 grid-rows-3 gap-4">
                <div className="col-span-2 row-span-2 bg-brand-surface rounded-2xl p-4 flex items-center justify-center">
                    <Speedometer speed={speedKmh} />
                </div>
                
                <div className="col-span-1 bg-brand-surface rounded-2xl p-4 flex flex-col items-center justify-center">
                   <FuelGauge fuelPercentage={fuelPercentage} />
                </div>

                <div className="col-span-1 bg-brand-surface rounded-2xl p-4 flex flex-col items-center justify-center">
                    <Odometer distance={totalDistanceKm} />
                </div>
            </div>

            <TripInfo range={estimatedRangeKm} />
            <AiReminder />
        </div>
    );
};

export default DashboardPage;