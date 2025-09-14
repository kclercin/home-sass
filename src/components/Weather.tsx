import React, { useState, useEffect } from 'react';

interface WeatherData {
  current: {
    temperature: number;
    weathercode: number;
    time: string;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

interface WeatherPeriod {
  period: string;
  temperature: number;
  weathercode: number;
  time: string;
}

interface WeatherDayData {
  date: string;
  periods: WeatherPeriod[];
  location: { latitude: number; longitude: number };
  minTemperature: number;
  maxTemperature: number;
}

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherPeriod[]>([]);
  const [minTemperature, setMinTemperature] = useState<number>(0);
  const [maxTemperature, setMaxTemperature] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const getWeatherIcon = (weathercode: number) => {
    // Codes météo Open-Meteo
    if (weathercode === 0) return '☀️'; // Ciel dégagé
    if (weathercode <= 3) return '⛅'; // Partiellement nuageux
    if (weathercode <= 48) return '☁️'; // Nuageux
    if (weathercode <= 67) return '🌧️'; // Pluie
    if (weathercode <= 77) return '❄️'; // Neige
    if (weathercode <= 82) return '🌧️'; // Averses
    if (weathercode <= 86) return '❄️'; // Averses de neige
    if (weathercode <= 99) return '⛈️'; // Orage
    return '🌤️'; // Par défaut
  };

  const getWeatherDescription = (weathercode: number) => {
    if (weathercode === 0) return 'Ciel dégagé';
    if (weathercode <= 3) return 'Partiellement nuageux';
    if (weathercode <= 48) return 'Nuageux';
    if (weathercode <= 67) return 'Pluie';
    if (weathercode <= 77) return 'Neige';
    if (weathercode <= 82) return 'Averses';
    if (weathercode <= 86) return 'Averses de neige';
    if (weathercode <= 99) return 'Orage';
    return 'Variable';
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Vérifier si la météo du jour est déjà en cache
        const today = new Date().toLocaleDateString('fr-FR');
        const cachedWeather = localStorage.getItem('weather_daily');
        
        if (cachedWeather) {
          const parsedData: WeatherDayData = JSON.parse(cachedWeather);
          if (parsedData.date === today) {
            // Utiliser les données en cache
            setWeatherData(parsedData.periods);
            setMinTemperature(parsedData.minTemperature);
            setMaxTemperature(parsedData.maxTemperature);
            setLoading(false);
            return;
          }
        }
        
        // Obtenir la position actuelle de l'utilisateur
        const getCurrentPosition = (): Promise<{ latitude: number; longitude: number }> => {
          return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
              reject(new Error('Géolocalisation non supportée'));
              return;
            }
            
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                });
              },
              (error) => {
                console.warn('Erreur de géolocalisation:', error);
                // Fallback sur Paris si la géolocalisation échoue
                resolve({
                  latitude: 48.8566,
                  longitude: 2.3522
                });
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
              }
            );
          });
        };
        
        const { latitude, longitude } = await getCurrentPosition();
        
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe%2FParis`
        );
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        
        const data: WeatherData = await response.json();
        const minTemp = data.daily.temperature_2m_min[0];
        const maxTemp = data.daily.temperature_2m_max[0];
        
        const periods: WeatherPeriod[] = [
          {
            period: 'Matin',
            temperature: Math.round((minTemp + maxTemp) / 2),
            weathercode: data.daily.weathercode[0],
            time: '06h-12h'
          },
          {
            period: 'Après-midi',
            temperature: maxTemp,
            weathercode: data.daily.weathercode[0],
            time: '12h-18h'
          },
          {
            period: 'Soir',
            temperature: Math.round((minTemp + maxTemp) / 2) - 2,
            weathercode: data.daily.weathercode[0],
            time: '18h-00h'
          }
        ];
        
        // Stocker dans le localStorage avec la date
        const weatherWithDate: WeatherDayData = {
          date: today.toLocaleDateString('fr-FR'),
          periods: periods,
          location: { latitude, longitude },
          minTemperature: minTemp,
          maxTemperature: maxTemp
        };
        
        localStorage.setItem('weather_daily', JSON.stringify(weatherWithDate));
        
        setWeatherData(periods);
        setMinTemperature(minTemp);
        setMaxTemperature(maxTemp);
      } catch (err) {
        console.error('Erreur lors de la récupération de la météo:', err);
        setError('Impossible de charger la météo');
        // Données de fallback
        const fallbackMinTemp = 16;
        const fallbackMaxTemp = 22;
        const fallbackPeriods = [
          {
            period: 'Matin',
            temperature: 18,
            weathercode: 0,
            time: '06h-12h'
          },
          {
            period: 'Après-midi',
            temperature: fallbackMaxTemp,
            weathercode: 0,
            time: '12h-18h'
          },
          {
            period: 'Soir',
            temperature: fallbackMinTemp,
            weathercode: 0,
            time: '18h-00h'
          }
        ];
        
        setWeatherData(fallbackPeriods);
        setMinTemperature(fallbackMinTemp);
        setMaxTemperature(fallbackMaxTemp);
        
        // Stocker aussi les données de fallback
        const fallbackData: WeatherDayData = {
          date: new Date().toLocaleDateString('fr-FR'),
          periods: fallbackPeriods,
          location: { latitude: 48.8566, longitude: 2.3522 },
          minTemperature: fallbackMinTemp,
          maxTemperature: fallbackMaxTemp
        };
        localStorage.setItem('weather_daily', JSON.stringify(fallbackData));
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌤️</span>
            <p className="text-lg font-semibold text-gray-700">Météo</p>
          </div>
          <p className="text-lg text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error && weatherData.length === 0) {
    return (
      <div className="">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌤️</span>
            <p className="text-lg font-semibold text-gray-700">Météo</p>
          </div>
          <p className="text-lg text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌤️</span>
            <p className="text-lg font-semibold text-gray-700">
              Météo du jour
            </p>
          </div>
          {weatherData.length > 0 && (
            <div className="flex justify-between items-center ml-auto">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">{minTemperature}°C</p>
              </div>
              &nbsp;-&nbsp;
              <div className="text-center">
                <p className="text-lg font-bold text-red-600">{maxTemperature}°C</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Affichage des températures min/max */}
        
        {weatherData.length > 0 && (
          <div className="space-y-3">
            {weatherData.map((period, index) => (
              <div key={index} className="bg-white/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getWeatherIcon(period.weathercode)}</span>
                    <div>
                      <p className="font-semibold text-gray-700">{period.period}</p>
                      <p className="text-xs text-gray-600">{period.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">{period.temperature}°C</p>
                    <p className="text-xs text-gray-600">{getWeatherDescription(period.weathercode)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
