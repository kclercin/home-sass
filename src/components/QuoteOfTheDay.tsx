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
      citation: "En 1995, le film Dilwale Dulhania Le Jayenge a redonné un souffle au cinéma indien. Devenu absolument culte, il est encore projeté plus de 25 ans (en 2022) après sa sortie au cinéma Maratha Mandir de Bombay."
    },
    {
      date: "2025-09-15",
      citation: "En 1995, le film Dilwale Dulhania Le Jayenge a redonné un souffle au cinéma indien. Devenu absolument culte, il est encore projeté plus de 25 ans (en 2022) après sa sortie au cinéma Maratha Mandir de Bombay."
    },
    {
      date: "2025-09-16",
      citation: 'La chanson "The lion sleeps tonight" a été créée en Afrique du sud en 1939 par Solomon Linda sous le nom de "Mbube", nous pouvions entendre les coeurs répéter "Uyimbube, uyimbube", ce qui veut dire "Tu es un lion". Lors de l\'exportation de cette chanson, uyimbube s\'est transformé en "awimoweh" qui ne veut rien dire. La chanson a été rendu célébre en 1960 par le groupe The Tokens.'
    },
    {
      date: "2025-09-17",
      citation: "Dans les années fin 80, l'actrice Sophie Lloyd rêve d’entrer dans le prestigieuse société Magic circle, une société de magiciens située à Londres, réputée ses critères d’admission stricts… réservés jusqu’alors aux hommes. Pour contourner cette règle, elle se fait passer pour un homme et intègre la société, mais lorsque cette dernière autorise finalement l'intégration des femmes, l'actrice révèle son secret et les responsables étant vexés de la supercherie, elle est expulsée de la société. Elle a cependant été réintégrée récemment, avec les excuses officielles. :)"
    }
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
