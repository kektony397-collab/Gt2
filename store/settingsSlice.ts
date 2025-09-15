import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from './index';
import type { Settings } from '../types';
import { BIKE_SPECS } from '../constants';
import { dexieStorage } from './storage';

export interface SettingsSlice {
    settings: Settings;
    setSettings: (settings: Settings) => void;
}

const defaultSettings: Settings = {
    bikeName: 'My Bike',
    tankCapacityLiters: BIKE_SPECS.DEFAULT_TANK_CAPACITY,
    avgConsumptionLitersPer100Km: BIKE_SPECS.DEFAULT_AVG_CONSUMPTION,
    unitSystem: 'metric',
};

// FIX: Corrected Zustand persist middleware typings. By inlining the state creator function directly into the `persist` call, we allow TypeScript to correctly infer the types for the middleware-enhanced `set` function, resolving the type mismatch error.
export const createSettingsSlice: StateCreator<
    AppState,
    [],
    [['zustand/persist', unknown]],
    SettingsSlice
> = persist(
    (set) => ({
        settings: defaultSettings,
        setSettings: (settings) => set({ settings }),
    }),
    {
        name: 'smart-bike-settings',
        storage: dexieStorage,
    }
);
