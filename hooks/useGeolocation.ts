
import { useState, useCallback, useRef, useEffect } from 'react';
import type { GeolocationState } from '../types';
import { useAppStore } from '../store';

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

export const useGeolocation = () => {
  const updateBikeState = useAppStore((state) => state.updateBikeState);
  const [geoState, setGeoState] = useState<GeolocationState>({
    isAvailable: 'geolocation' in navigator,
    hasPermission: null,
    isTracking: false,
    coords: null,
    error: null,
  });
  const watchIdRef = useRef<number | null>(null);

  const handleSuccess: PositionCallback = (position) => {
    // Here you would integrate a Kalman filter for smoothing
    // const smoothedCoords = kalmanFilter.update(position.coords);
    
    setGeoState((prev) => ({
      ...prev,
      isTracking: true,
      coords: position.coords,
      error: null,
    }));
    
    // Convert speed from m/s to km/h
    const speedKmh = position.coords.speed ? position.coords.speed * 3.6 : 0;
    
    updateBikeState({
        speedKmh: speedKmh,
        // Distance calculation should be more sophisticated, this is a simplification
        // It should accumulate distance between points.
        // For now, let's just increment it for demonstration.
        totalDistanceKm: (prev) => prev.totalDistanceKm + (speedKmh / 3600), // distance = speed * time (1s)
    });

  };

  const handleError: PositionErrorCallback = (error) => {
    setGeoState((prev) => ({
      ...prev,
      isTracking: false,
      error: error,
    }));
    if (error.code === error.PERMISSION_DENIED) {
        setGeoState((prev) => ({ ...prev, hasPermission: false }));
    }
  };

  const startTracking = useCallback(() => {
    if (!geoState.isAvailable) {
      console.warn('Geolocation is not available on this device.');
      return;
    }
    
    navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
        setGeoState((prev) => ({...prev, hasPermission: permissionStatus.state === 'granted'}));
        
        if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
            if (watchIdRef.current === null) {
                watchIdRef.current = navigator.geolocation.watchPosition(
                    handleSuccess,
                    handleError,
                    GEOLOCATION_OPTIONS
                );
            }
        }
        
        permissionStatus.onchange = () => {
            setGeoState((prev) => ({...prev, hasPermission: permissionStatus.state === 'granted'}));
        };
    });
  }, [geoState.isAvailable, updateBikeState]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setGeoState((prev) => ({ ...prev, isTracking: false }));
    }
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
      return () => stopTracking();
  }, [stopTracking]);


  return { geoState, startTracking, stopTracking };
};
