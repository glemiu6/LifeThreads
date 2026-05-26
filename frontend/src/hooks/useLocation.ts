import { useState } from 'react';
import api from '../api/client';

interface LocationState {
  address: string;
  loading: boolean;
  error: string;
}

export function useAutoLocation() {
  const [location, setLocation] = useState<LocationState>({
    address: '',
    loading: false,
    error: ''
  });

  const detect = async () => {
    setLocation(prev => ({ ...prev, loading: true, error: '' }));

    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, loading: false, error: 'Geolocalização não suportada.' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await api.get(`/api/entries/location?lat=${latitude}&lng=${longitude}`);
          setLocation({ address: res.data.address, loading: false, error: '' });
        } catch {
          
          setLocation({
            address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            loading: false,
            error: ''
          });
        }
      },
      async () => {
        
        try {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          const address = `${data.city}, ${data.region}, ${data.country_name}`;
          setLocation({ address, loading: false, error: '' });
        } catch {
          setLocation({ address: '', loading: false, error: 'Não foi possível obter a localização.' });
        }
      },
      {
        timeout: 30000,       
        maximumAge: 600000,   
        enableHighAccuracy: false  
      }
    );
  };

  const setAddress = (address: string) =>
    setLocation(prev => ({ ...prev, address }));

  return { ...location, detect, setAddress };
}