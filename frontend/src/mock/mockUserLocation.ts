import { useState, useEffect } from 'react';

interface GeolocationState {
  loading: boolean;
  error: (Error | GeolocationPositionError | null);  
  latitude: number | null;
  longitude: number | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        loading: false,
        error: new Error("Trình duyệt không hỗ trợ Geolocation"),
      }));
      return;
    }

    let mounted = true;

    const onSuccess = (position: GeolocationPosition) => {
      if (!mounted) return;
      setState({
        loading: false,
        error: null,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      if (!mounted) return;
      setState({
        loading: false,
        error: error,
        latitude: null,
        longitude: null,
      });
    };

    // Prefer watchPosition so we receive continuous updates. Fall back to
    // getCurrentPosition if watchPosition is unavailable.
    let watchId: number | null = null;
    try {
      if (typeof navigator.geolocation.watchPosition === 'function') {
        watchId = navigator.geolocation.watchPosition(onSuccess, onError);
      } else {
        // Older environments: poll periodically using getCurrentPosition
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        const pollId = window.setInterval(() => {
          navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }, 2000);
        // store as negative id to signal we need to clearInterval on cleanup
        watchId = -pollId;
      }
    } catch (err) {
      // If anything throws while attempting to watch, fall back to single read
      try {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
      } catch (e) {
        onError(e as GeolocationPositionError);
      }
    }

    return () => {
      mounted = false;
      if (watchId !== null) {
        if (watchId >= 0) {
          try {
            navigator.geolocation.clearWatch(watchId);
          } catch (_) {
            // ignore
          }
        } else {
          // negative watchId indicates setInterval id
          window.clearInterval(-watchId);
        }
      }
    };

  }, []); // Chạy 1 lần khi hook được mount

  return state;
};