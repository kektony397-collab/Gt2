import { useAppStore } from '../store';

export const useFuelCalculator = () => {
    // FIX: Use a single selector for all required state to ensure component reactivity.
    const { settings, refuelHistory, totalDistanceKm } = useAppStore((state) => ({
        settings: state.settings,
        refuelHistory: state.refuelHistory,
        totalDistanceKm: state.bikeState.totalDistanceKm,
    }));
    
    const { tankCapacityLiters, avgConsumptionLitersPer100Km } = settings;

    // Safeguard to prevent division by zero, which would crash the app.
    if (tankCapacityLiters <= 0 || avgConsumptionLitersPer100Km <= 0) {
        return {
            currentFuelLiters: 0,
            fuelPercentage: 0,
            estimatedRangeKm: 0,
        };
    }

    // Sort history once to easily find the latest records.
    const sortedHistory = [...refuelHistory].sort((a, b) => b.timestamp - a.timestamp);

    // Find the last full refuel to use as an anchor point.
    const lastFullRefuel = sortedHistory.find(r => !r.isPartial);

    let fuelAtLastFill = 0;
    let odometerAtLastFill = 0;
    let fuelAddedSinceLastFill = 0;

    if (lastFullRefuel) {
        // Assume tank was full after the last full refuel.
        fuelAtLastFill = tankCapacityLiters;
        odometerAtLastFill = lastFullRefuel.odometer;

        // Find all partial refuels that happened AFTER the last full one.
        const partialsSinceLastFull = sortedHistory.filter(
            r => r.isPartial && r.timestamp > lastFullRefuel.timestamp
        );
        
        fuelAddedSinceLastFill = partialsSinceLastFull.reduce((sum, record) => sum + record.liters, 0);

    } else {
        // If there are no full refuels, we can't accurately calculate.
        // As a fallback, assume the tank is at a default level or use partials.
        // For simplicity, we'll assume a half tank if no history exists.
        return {
            currentFuelLiters: tankCapacityLiters / 2,
            fuelPercentage: 50,
            estimatedRangeKm: (tankCapacityLiters / 2 / avgConsumptionLitersPer100Km) * 100,
        }
    }
    
    const distanceSinceLastFill = totalDistanceKm - odometerAtLastFill;
    const fuelConsumedLiters = (distanceSinceLastFill / 100) * avgConsumptionLitersPer100Km;

    const currentFuelLiters = Math.max(0, fuelAtLastFill + fuelAddedSinceLastFill - fuelConsumedLiters);

    const fuelPercentage = Math.min(100, (currentFuelLiters / tankCapacityLiters) * 100);

    const estimatedRangeKm = (currentFuelLiters / avgConsumptionLitersPer100Km) * 100;

    return {
        currentFuelLiters,
        fuelPercentage,
        estimatedRangeKm,
    };
};