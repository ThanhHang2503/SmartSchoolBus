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

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        loading: false,
        error: null,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setState({
        loading: false,
        error: error,
        latitude: null,
        longitude: null,
      });
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

  }, []); // Chạy 1 lần khi hook được mount

  return state;
};