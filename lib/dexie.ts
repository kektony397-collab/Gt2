import Dexie, { type Table } from 'dexie';
import type { Settings, RefuelRecord, TripLog } from '../types';

export class MySubClassedDexie extends Dexie {
  settings!: Table<{ key: string, value: Settings }>;
  refuelRecords!: Table<RefuelRecord>;
  tripLogs!: Table<TripLog>;

  constructor() {
    super('smartBikeDB');
    // FIX: Cast `this` to the base Dexie type to resolve a TypeScript error.
    // This can be necessary when the type checker fails to infer inherited methods
    // on a subclass instance inside its own constructor.
    (this as Dexie).version(1).stores({
      settings: 'key', // Simple key-value for settings
      refuelRecords: '++id, timestamp',
      tripLogs: '++id, startTimestamp',
    });
  }
}

export const db = new MySubClassedDexie();
