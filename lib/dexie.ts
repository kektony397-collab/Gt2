import Dexie, { type Table } from 'dexie';
import type { Settings, RefuelRecord, TripLog } from '../types';

export class MySubClassedDexie extends Dexie {
  // This table is used as a generic key-value store for Zustand slices.
  // The value can be a Settings object, a History object, etc.
  // Using `any` to accurately reflect its dynamic nature.
  settings!: Table<{ key: string, value: any }>;
  refuelRecords!: Table<RefuelRecord>;
  tripLogs!: Table<TripLog>;

  constructor() {
    super('smartBikeDB');
    // FIX: Cast `this` to the base Dexie type to resolve a TypeScript error.
    // This can be necessary when the type checker fails to infer inherited methods
    // on a subclass instance inside its own constructor.
    (this as Dexie).version(1).stores({
      settings: 'key', // Simple key-value for settings, history, etc.
      refuelRecords: '++id, timestamp',
      tripLogs: '++id, startTimestamp',
    });
  }
}

export const db = new MySubClassedDexie();