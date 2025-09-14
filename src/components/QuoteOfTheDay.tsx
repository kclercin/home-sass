import React, { useState, useEffect } from 'react';
import Card from './Card';

interface Quote {
  date: string;
  citation: string;
  videoYoutube?: string;
}

const QuoteOfTheDay: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  // Tableau de citations avec les clés demandées
  const quotes: Quote[] = [
    {
      date: "2025-09-14",
      citation: "La vie est ce qui arrive pendant que vous êtes occupé à faire d'autres projets."
    },
  ];

  // Fonction pour obtenir la citation du jour basée sur la date actuelle
  const getQuoteOfTheDay = (): Quote | null => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Chercher une citation pour la date d'aujourd'hui
    const quoteForToday = quotes.find(quote => quote.date === todayString);
    
    if (quoteForToday) {
      return quoteForToday;
    }
    
    return null;
  };

  useEffect(() => {
    const quote = getQuoteOfTheDay();
    setCurrentQuote(quote);
  }, []);

  if (!currentQuote) {
    return null;
  }

  return (
    <Card level="lg">
      <div className="space-y-2">
        <div className="mb-0">
          <h2 className="text-lg font-semibold text-gray-700">Le savais-tu ?</h2>
        </div>
        
        <div className="">
          <blockquote className="text-lg italic text-gray-900 leading-relaxed">
            {currentQuote.citation}
          </blockquote>
        </div>
      </div>
    </Card>
  );
};

export default QuoteOfTheDay;
