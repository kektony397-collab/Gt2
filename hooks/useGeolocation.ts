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

  // Define stable callbacks for success and error
  const handleSuccess: PositionCallback = useCallback((position) => {
    setGeoState((prev) => ({
      ...prev,
      isTracking: true,
      hasPermission: true, // If we get a success, we must have permission
      coords: position.coords,
      error: null,
    }));
    
    const speedKmh = position.coords.speed ? position.coords.speed * 3.6 : 0;
    
    // FIX: The updater logic was incorrect. It should be a single function that returns a partial state object.
    updateBikeState((prev) => ({
        speedKmh: speedKmh,
        totalDistanceKm: prev.totalDistanceKm + (speedKmh / 3600), // distance = speed * time (assuming 1s ticks)
    }));

  }, [updateBikeState]);

  const handleError: PositionErrorCallback = useCallback((error) => {
    setGeoState((prev) => ({
      ...prev,
      isTracking: false,
      hasPermission: error.code !== error.PERMISSION_DENIED ? prev.hasPermission : false,
      error: error,
    }));
  }, []);

  // Effect to monitor permission changes from the Permissions API
  // This updates the UI if the user changes permissions in browser settings.
  useEffect(() => {
    if (!geoState.isAvailable) return;

    let permissionStatus: PermissionStatus;

    const queryPermissions = async () => {
        try {
            permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
            setGeoState(prev => ({...prev, hasPermission: permissionStatus.state === 'granted'}));
            permissionStatus.onchange = () => {
                 setGeoState(prev => ({...prev, hasPermission: permissionStatus.state === 'granted'}));
            };
        } catch (e) {
            console.error("Could not query geolocation permissions:", e);
        }
    }
    queryPermissions();

    return () => {
        if (permissionStatus) {
            permissionStatus.onchange = null;
        }
    };
  }, [geoState.isAvailable]);


  // Stable function to start tracking, preventing re-render loops
  const startTracking = useCallback(() => {
    if (!geoState.isAvailable || watchIdRef.current !== null) {
      return;
    }
    
    // This call will trigger the browser's permission prompt if needed
    watchIdRef.current = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        GEOLOCATION_OPTIONS
    );
  }, [geoState.isAvailable, handleSuccess, handleError]);

  // Stable function to stop tracking
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
