
export interface Settings {
  bikeName: string;
  tankCapacityLiters: number;
  avgConsumptionLitersPer100Km: number;
  unitSystem: 'metric' | 'imperial';
}

export interface RefuelRecord {
  id: number;
  timestamp: number;
  liters: number;
  cost?: number;
  odometer: number;
  isPartial: boolean;
  notes?: string;
}

export interface TripLog {
  id: number;
  startTimestamp: number;
  endTimestamp: number;
  distanceKm: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
}

export interface GeolocationState {
  isAvailable: boolean;
  hasPermission: boolean | null;
  isTracking: boolean;
  coords: {
    latitude: number;
    longitude: number;
    speed: number | null; // m/s
    altitude: number | null;
    accuracy: number;
  } | null;
  error: GeolocationPositionError | null;
}
