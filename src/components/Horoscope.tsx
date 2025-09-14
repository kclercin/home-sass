import React, { useState, useEffect } from 'react';
import bowArrow from '../assets/bow-arrow.svg';
interface HoroscopeData {
  sign: string;
  date: string;
  horoscope: string;
  mood: string;
  color: string;
  lucky_number: string;
  lucky_time: string;
}

const Horoscope: React.FC = () => {
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchHoroscope = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Vérifier si l'horoscope du jour est déjà en cache
        const today = new Date().toLocaleDateString('fr-FR');
        const cachedHoroscope = localStorage.getItem('horoscope_capricorn');
        
        if (cachedHoroscope) {
          const parsedData = JSON.parse(cachedHoroscope);
          if (parsedData.date === today) {
            // Utiliser les données en cache
            setHoroscopeData(parsedData);
            setLoading(false);
            return;
          }
        }
        
        // Appel à l'API VedicAstroAPI pour le Capricorne
        const response = await fetch('https://vedicastroapi.com/horoscope/daily?sign=capricorn&date=today');
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ajouter la date actuelle aux données
        const horoscopeWithDate = {
          ...data,
          date: today
        };
        
        // Stocker dans le localStorage
        localStorage.setItem('horoscope_capricorn', JSON.stringify(horoscopeWithDate));
        
        setHoroscopeData(horoscopeWithDate);
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'horoscope:', err);
        setError('Impossible de charger l\'horoscope');
        // Données de fallback en cas d'erreur
        const fallbackData = {
          sign: 'Capricorne',
          date: new Date().toLocaleDateString('fr-FR'),
          horoscope: 'Les étoiles vous sourient aujourd\'hui ! Votre détermination et votre persévérance vous mèneront vers le succès.',
          mood: 'Déterminé',
          color: 'Marron',
          lucky_number: '8',
          lucky_time: '14h-16h'
        };
        setHoroscopeData(fallbackData);
        // Stocker aussi les données de fallback
        localStorage.setItem('horoscope_capricorn', JSON.stringify(fallbackData));
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscope();
  }, []);

  if (loading) {
    return (
      <div className="">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔮</span>
            <p className="text-lg font-semibold text-gray-700">Horoscope</p>
          </div>
          <p className="text-lg text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error && !horoscopeData) {
    return (
      <div className="">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔮</span>
            <p className="text-lg font-semibold text-gray-700">Horoscope</p>
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
          <span className="text-lg">🔮</span>
          <p className="text-lg font-semibold text-gray-700">
            Horoscope du jour
            {horoscopeData && (
            <span className="text-sm text-gray-600 mb-2">
                &nbsp;-&nbsp;{horoscopeData.date}
              </span>
            )}
          </p>
        </div>
        
        {horoscopeData && (
          <div className="flex items-start gap-8">
            <div className="flex items-center justify-center">
              <img src={bowArrow} alt="bow-arrow" className="w-20 h-20 fill-gray-700" />
            </div>
            <div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {horoscopeData.horoscope}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="bg-white/20 rounded p-2">
                  <p className="font-semibold text-gray-600">Humeur</p>
                  <p className="text-gray-700">{horoscopeData.mood}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Horoscope;
