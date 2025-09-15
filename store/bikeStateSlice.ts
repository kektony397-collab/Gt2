
import type { StateCreator } from 'zustand';
import type { AppState } from './index';

export interface BikeState {
    speedKmh: number;
    totalDistanceKm: number; // This would be the bike's total odometer reading
}

export interface BikeStateSlice {
    bikeState: BikeState;
    updateBikeState: (updater: (prevState: BikeState) => Partial<BikeState> | Partial<BikeState>) => void;
}

export const createBikeStateSlice: StateCreator<AppState, [], [], BikeStateSlice> = (set) => ({
    bikeState: {
        speedKmh: 0,
        totalDistanceKm: 12548.2, // Starting odometer for demo purposes
    },
    updateBikeState: (updater) => set((state) => ({
        bikeState: {
            ...state.bikeState,
            ...(typeof updater === 'function' ? updater(state.bikeState) : updater),
        }
    })),
});
