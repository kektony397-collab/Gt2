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

// FIX: Corrected StateCreator middleware typings and explicitly typed the initializer
// to solve type inference issues with `persist` on a slice.
const settingsCreator: StateCreator<AppState, [], [], SettingsSlice> = (set) => ({
    settings: defaultSettings,
    setSettings: (settings) => set({ settings }),
});

export const createSettingsSlice: StateCreator<
    AppState,
    [], // Mps (middlewares for set/get) should be empty for a slice expecting vanilla args
    [['zustand/persist', unknown]], // Mcs (middlewares for the creator) is where `persist` belongs
    SettingsSlice
> = persist(
    settingsCreator,
    {
        name: 'smart-bike-settings',
        storage: dexieStorage,
    }
);
