import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from './index';
import type { RefuelRecord, TripLog } from '../types';
import { dexieStorage } from './storage';

export interface HistorySlice {
    refuelHistory: RefuelRecord[];
    tripHistory: TripLog[];
    addRefuelRecord: (record: Omit<RefuelRecord, 'id'> & { id?: number }) => void;
    addTripLog: (log: TripLog) => void;
}

const sampleRefuelHistory: RefuelRecord[] = [
    { id: 1, timestamp: 1672531200000, liters: 12.5, cost: 21.50, odometer: 9800, isPartial: false },
    { id: 2, timestamp: 1672963200000, liters: 11.8, cost: 20.90, odometer: 10250, isPartial: false },
    { id: 3, timestamp: 1673395200000, liters: 5.0, cost: 9.00, odometer: 10480, isPartial: true },
    { id: 4, timestamp: 1673827200000, liters: 13.1, cost: 22.75, odometer: 11100, isPartial: false },
    { id: 5, timestamp: 1674259200000, liters: 12.9, cost: 22.00, odometer: 12050, isPartial: false },
];


// FIX: Corrected StateCreator middleware typings and explicitly typed the initializer
// to solve type inference issues with `persist` on a slice.
const historyCreator: StateCreator<AppState, [], [], HistorySlice> = (set) => ({
    refuelHistory: sampleRefuelHistory,
    tripHistory: [],
    addRefuelRecord: (record) => set((state) => ({
        refuelHistory: [...state.refuelHistory, { ...record, id: record.id || Date.now() }],
    })),
    addTripLog: (log) => set((state) => ({
        tripHistory: [...state.tripHistory, log],
    })),
});

export const createHistorySlice: StateCreator<
    AppState,
    [], // Mps (middlewares for set/get) should be empty for a slice expecting vanilla args
    [['zustand/persist', unknown]], // Mcs (middlewares for the creator) is where `persist` belongs
    HistorySlice
> = persist(
    historyCreator,
    {
        name: 'smart-bike-history',
        storage: dexieStorage,
    }
);
