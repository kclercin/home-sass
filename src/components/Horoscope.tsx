import React, { useState, useEffect } from 'react';
import bowArrow from '../assets/bow-arrow.svg';
interface HoroscopeData {
  response: Record<string, {
    score: number;
    split_response: string;
  }>;
  date: string;
}

// En affichant votre sourire, vous répandez du bonheur dans la journée de quelqu'un, transformant des moments ordinaires en souvenirs extraordinaires.

const horoscopeTypes = {
  career: {
    title: "Carrière",
  },
  finances: {
    title: "Finances",
  },
  health: {
    title: "Santé",
  },
  physique: {
    title: "Physique",
  },
  status: {
    title: "Statut",
  },
  total_score: {
    title: "Global",
  }
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
        // extract the date in the format DD/MM/YYYY
        const today = new Date().toLocaleDateString('fr-FR');
        const cachedHoroscope = localStorage.getItem('horoscope_sagittarius');
        
        if (cachedHoroscope) {
          const parsedData = JSON.parse(cachedHoroscope);
          if (parsedData.date === today) {
            // Utiliser les données en cache
            setHoroscopeData(parsedData);
            setLoading(false);
            return;
          }
        }
        
        // Appel à l'API VedicAstroAPI pour le Sagittarius
        const response = await fetch(`https://api.vedicastroapi.com/v3-json/western/daily-horoscope?zodiac=9&date=${today}&api_key=05f36bc9-b650-5c5f-84cf-1cf66b8e42cc&lang=fr&split=true&type=big`);
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        
        // Ajouter la date actuelle aux données
        const horoscopeWithDate = {
          response: data?.response?.bot_response,
          date: today
        };
        // Stocker dans le localStorage
        localStorage.setItem('horoscope_sagittarius', JSON.stringify(horoscopeWithDate));
        
        setHoroscopeData(horoscopeWithDate);
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'horoscope:', err);
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
            Horoscope
          </p>
        </div>
        
        {horoscopeData && (
          <div className="flex items-start gap-8">
            <div className="flex items-center justify-center">
              <img src={bowArrow} alt="bow-arrow" className="w-20 h-20 fill-gray-700" />
            </div>
            <div className="space-y-2">
              {Object.keys(horoscopeTypes).filter((type) => horoscopeData.response[type]).map((type) => {
                const typeData = horoscopeTypes[type as keyof typeof horoscopeTypes];
                return (
                  <div key={typeData.title}>
                    <h3 className="text-sm text-gray-700 leading-relaxed font-semibold">
                      {typeData.title}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {horoscopeData.response[type].split_response}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Horoscope;
