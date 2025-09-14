import React, { useState, useEffect } from 'react';

const AnniversaryTimer: React.FC = () => {
  const [timeUntilBirthday, setTimeUntilBirthday] = useState<string>('');
  const [isBirthdayToday, setIsBirthdayToday] = useState<boolean>(false);

  useEffect(() => {
    const updateBirthdayTimer = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth(); // 0-11 (décembre = 11)
      const currentDay = now.getDate();

      // Créer la date d'anniversaire pour cette année
      let birthdayThisYear = new Date(currentYear, 11, 2); // 2 décembre

      // Si l'anniversaire est déjà passé cette année, calculer pour l'année prochaine
      if (now > birthdayThisYear) {
        birthdayThisYear = new Date(currentYear + 1, 11, 2);
      }

      // Vérifier si c'est l'anniversaire aujourd'hui
      if (currentMonth === 11 && currentDay === 2) {
        setIsBirthdayToday(true);
        setTimeUntilBirthday('🎉 Joyeux Anniversaire ! 🎉');
        return;
      }

      setIsBirthdayToday(false);

      // Calculer la différence en millisecondes
      const timeDiff = birthdayThisYear.getTime() - now.getTime();

      // Convertir en jours, heures, minutes
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeUntilBirthday(`${days}j ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`);
      } else {
        setTimeUntilBirthday(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      }
    };

    updateBirthdayTimer();
    const timer = setInterval(updateBirthdayTimer, 60000); // Mise à jour chaque minute

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = () => {
    if (isBirthdayToday) return 'text-pink-600';
    return 'text-purple-600';
  };

  const getStatusIcon = () => {
    if (isBirthdayToday) return '🎂';
    return '🎁';
  };

  return (
    <div className="">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <p className="text-lg font-semibold text-gray-700">
            {isBirthdayToday ? 'Anniversaire' : 'Ma fête est dans...'}
          </p>
        </div>
        <p className={`text-2xl font-mono font-bold ${getStatusColor()}`}>
          {timeUntilBirthday}
        </p>
      </div>
    </div>
  );
};

export default AnniversaryTimer;
