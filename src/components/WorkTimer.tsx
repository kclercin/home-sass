import React, { useState, useEffect } from 'react';

const WorkTimer: React.FC = () => {
  const [workTime, setWorkTime] = useState<string>('');
  const [isWorkDay, setIsWorkDay] = useState<boolean>(false);
  const [isWorkEnded, setIsWorkEnded] = useState<boolean>(false);
  const [dayOfWeek, setDayOfWeek] = useState<number>(0);

  useEffect(() => {
    const updateWorkTime = () => {
      const now = new Date();
      const currentDayOfWeek = now.getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi
      setDayOfWeek(currentDayOfWeek);
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();

      // Vérifier si c'est un jour de travail (lundi à vendredi)
      const isWeekday = currentDayOfWeek >= 1 && currentDayOfWeek <= 5;
      setIsWorkDay(isWeekday);

      if (!isWeekday) {
        setWorkTime("Et non, on bosse pas le week-end !");
        setIsWorkEnded(false);
        return;
      }

      // Vérifier si c'est après 18h
      if (currentHour >= 18) {
        setIsWorkEnded(true);
        setWorkTime('Journée terminée ! 🎉');
        return;
      }

      // Vérifier si c'est entre 00h et 8h (dodo)
      if (currentHour >= 0 && currentHour < 8) {
        setIsWorkEnded(false);
        setWorkTime('Dodo');
        return;
      }

      // Vérifier si c'est entre 8h et 9h
      if (currentHour >= 8 && currentHour < 9) {
        setIsWorkEnded(false);
        setWorkTime('En route');
        return;
      }

      // Calculer le temps écoulé depuis 9h
      const startHour = 9;
      const startMinute = 0;
      const startSecond = 0;

      const totalStartSeconds = startHour * 3600 + startMinute * 60 + startSecond;
      const totalCurrentSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond;
      
      const elapsedSeconds = totalCurrentSeconds - totalStartSeconds;
      
      const hours = Math.floor(elapsedSeconds / 3600);
      const minutes = Math.floor((elapsedSeconds % 3600) / 60);

      setWorkTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      setIsWorkEnded(false);
    };

    updateWorkTime();
    const timer = setInterval(updateWorkTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = () => {
    if (!isWorkDay) return 'text-green-600';
    if (isWorkEnded) return 'text-green-600';
    return 'text-pink-600';
  };

  const getStatusIcon = () => {
    if (!isWorkDay) return '🏖️';
    if (isWorkEnded) return '🎉';
    if (workTime === 'En route') return '🚗';
    if (workTime === 'Dodo') return '😴';
    return '⏰';
  };

  return (
    <div className="">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <p className="text-lg font-semibold text-gray-700">
            Est-il l'heure de bosser ?
          </p>
        </div>
        <p className={`text-2xl font-mono font-bold ${getStatusColor()}`}>
          {workTime}
        </p>
        {isWorkDay && !isWorkEnded && (
          <p className="text-sm text-gray-500">
            Depuis 9h00
          </p>
        )}
        {isWorkDay && dayOfWeek === 2 && (
          <p className="text-sm text-blue-500 font-medium">
            C'est bientôt le week-end !
          </p>
        )}
      </div>
    </div>
  );
};

export default WorkTimer;
