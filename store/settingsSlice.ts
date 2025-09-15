
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

export const createSettingsSlice: StateCreator<AppState, [], [], SettingsSlice> = (set) => ({
    ...persist<SettingsSlice>(
        (set) => ({
            settings: defaultSettings,
            setSettings: (settings) => set({ settings }),
        }),
        {
            name: 'smart-bike-settings',
            storage: dexieStorage,
        }
    )(set, (state) => state, {} as any),
});
