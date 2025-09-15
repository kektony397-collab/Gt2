
import React, { useEffect } from 'react';
import { useAppStore } from '../../store';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useFuelCalculator } from '../../hooks/useFuelCalculator';
import Speedometer from './components/Speedometer';
import FuelGauge from './components/FuelGauge';
import Odometer from './components/Odometer';
import TripInfo from './components/TripInfo';
import AiReminder from './components/AiReminder';

const DashboardPage: React.FC = () => {
    const { startTracking, stopTracking } = useGeolocation();
    const updateBikeState = useAppStore((state) => state.updateBikeState);
    const { speedKmh, totalDistanceKm } = useAppStore((state) => state.bikeState);
    const { estimatedRangeKm } = useFuelCalculator();
    
    // In a real app, you'd have a button to start/stop a trip
    useEffect(() => {
        startTracking();
        return () => stopTracking();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-full gap-4">
            <h1 className="text-2xl font-bold text-center text-brand-text-primary">Smart Dashboard</h1>
            
            <div className="flex-grow grid grid-cols-2 grid-rows-3 gap-4">
                <div className="col-span-2 row-span-2 bg-brand-surface rounded-2xl p-4 flex items-center justify-center">
                    <Speedometer speed={speedKmh} />
                </div>
                
                <div className="col-span-1 bg-brand-surface rounded-2xl p-4 flex flex-col items-center justify-center">
                   <FuelGauge fuelPercentage={75} />
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
