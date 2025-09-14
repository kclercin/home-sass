import React, { useState, useEffect } from 'react';

const ChristmasTimer: React.FC = () => {
  const [nightsUntilChristmas, setNightsUntilChristmas] = useState(0);

  useEffect(() => {
    const calculateNightsUntilChristmas = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      // Noël de cette année
      let christmas = new Date(currentYear, 11, 25); // 25 décembre (mois 11 car 0-indexé)
      
      // Si Noël est déjà passé cette année, calculer pour l'année prochaine
      if (now > christmas) {
        christmas = new Date(currentYear + 1, 11, 25);
      }
      
      // Calculer la différence en millisecondes
      const timeDiff = christmas.getTime() - now.getTime();
      
      // Convertir en jours et arrondir vers le haut pour avoir le nombre de nuits
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      setNightsUntilChristmas(daysDiff);
    };

    // Calculer immédiatement
    calculateNightsUntilChristmas();

    // Mettre à jour chaque minute
    const timer = setInterval(calculateNightsUntilChristmas, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="">
      <div className="space-y-2">
        <p className="text-lg font-semibold text-gray-700">
          Dodos avant noël...
        </p>
        <p className="text-2xl font-bold text-pink-600">
          {nightsUntilChristmas}
        </p>
      </div>
    </div>
  );
};

export default ChristmasTimer;
