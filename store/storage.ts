
import type { StateStorage } from 'zustand/middleware';
import { db } from '../lib/dexie';

// This is a generic adapter for Zustand persist middleware to use Dexie
// It stores the entire persisted state slice under a single key.
export const dexieStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const item = await db.settings.get(name);
    return item ? JSON.stringify(item.value) : null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    // Note: 'value' from Zustand is already a stringified object.
    // We parse it to store it as an object in Dexie,
    // which is more robust for querying if needed later.
    await db.settings.put({ key: name, value: JSON.parse(value) });
  },
  removeItem: async (name: string): Promise<void> => {
    await db.settings.delete(name);
  },
};
