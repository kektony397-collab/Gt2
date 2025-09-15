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


// FIX: Corrected Zustand persist middleware typings. By inlining the state creator function directly into the `persist` call, we allow TypeScript to correctly infer the types for the middleware-enhanced `set` function, resolving the type mismatch error.
export const createHistorySlice: StateCreator<
    AppState,
    [],
    [['zustand/persist', unknown]],
    HistorySlice
> = persist(
    (set) => ({
        refuelHistory: sampleRefuelHistory,
        tripHistory: [],
        addRefuelRecord: (record) => set((state) => ({
            refuelHistory: [...state.refuelHistory, { ...record, id: record.id || Date.now() }],
        })),
        addTripLog: (log) => set((state) => ({
            tripHistory: [...state.tripHistory, log],
        })),
    }),
    {
        name: 'smart-bike-history',
        storage: dexieStorage,
    }
);
