
import { create } from 'zustand';
import { createBikeStateSlice, BikeStateSlice } from './bikeStateSlice';
import { createSettingsSlice, SettingsSlice } from './settingsSlice';
import { createHistorySlice, HistorySlice } from './historySlice';

export type AppState = BikeStateSlice & SettingsSlice & HistorySlice;

export const useAppStore = create<AppState>()((...a) => ({
    ...createBikeStateSlice(...a),
    ...createSettingsSlice(...a),
    ...createHistorySlice(...a),
}));
