import React, { useState, useEffect } from 'react';

const DateTime: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Mise à jour chaque seconde

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="">
      <div className="space-y-2">
        <p className="text-lg font-semibold text-gray-700" >
          {formatDate(currentDateTime).toLocaleUpperCase()}
        </p>
        <p className="text-2xl font-bold text-pink-600">
          {formatTime(currentDateTime)}
        </p>
      </div>
    </div>
  );
};

export default DateTime;
