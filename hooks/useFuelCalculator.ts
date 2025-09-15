
import { useAppStore } from '../store';

export const useFuelCalculator = () => {
    const { tankCapacityLiters, avgConsumptionLitersPer100Km } = useAppStore((state) => state.settings);
    const refuelHistory = useAppStore((state) => state.refuelHistory);
    const totalDistanceKm = useAppStore((state) => state.bikeState.totalDistanceKm);

    // Safeguard to prevent division by zero, which would crash the app.
    if (tankCapacityLiters <= 0 || avgConsumptionLitersPer100Km <= 0) {
        return {
            currentFuelLiters: 0,
            fuelPercentage: 0,
            estimatedRangeKm: 0,
        };
    }

    // Find the last full refuel to use as a baseline
    const lastFullRefuel = [...refuelHistory]
        .sort((a, b) => b.timestamp - a.timestamp)
        .find(r => !r.isPartial);

    const distanceSinceLastFill = lastFullRefuel ? totalDistanceKm - lastFullRefuel.odometer : totalDistanceKm;

    const fuelConsumedLiters = (distanceSinceLastFill / 100) * avgConsumptionLitersPer100Km;

    const currentFuelLiters = Math.max(0, tankCapacityLiters - fuelConsumedLiters);

    const fuelPercentage = (currentFuelLiters / tankCapacityLiters) * 100;

    const estimatedRangeKm = (currentFuelLiters / avgConsumptionLitersPer100Km) * 100;

    return {
        currentFuelLiters,
        fuelPercentage,
        estimatedRangeKm,
    };
};
