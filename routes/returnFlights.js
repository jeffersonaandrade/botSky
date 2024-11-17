// routes/returnFlights.js
const axios = require('axios');

// Chaves da API
const API_HOST = 'sky-scanner3.p.rapidapi.com';
const API_KEY = '9c632aab22msh67fd7fafc0845a2p1d499cjsna8efe4e8ea4d';

async function returnFlightsRoutes(fastify, options) {
  // Novo endpoint para pesquisa de voos de retorno
  fastify.get('/rest/v1/flights/return', async (request, reply) => {
    const { fromEntityId, toEntityId, departDate } = request.query;

    // Calculando a data de retorno (5 dias após a data de partida)
    const returnDate = new Date(departDate);
    returnDate.setDate(returnDate.getDate() + 5);
    const formattedReturnDate = returnDate.toISOString().split('T')[0];

    try {
      const response = await axios.get(`https://sky-scanner3.p.rapidapi.com/flights/price-calendar-return`, {
        params: {
          fromEntityId: toEntityId, // O destino da ida agora é a origem
          toEntityId: fromEntityId,   // A origem da ida agora é o destino
          departDate: departDate,
          returnDate: formattedReturnDate,
          market: 'BR',
          locale: 'pt-BR',
          currency: 'BRL'
        },
        headers: {
          'x-rapidapi-host': API_HOST,
          'x-rapidapi-key': API_KEY,
        },
      });

      console.log('Resposta da API de retorno:', response.data);

      const days = response.data.data.flights.days;
      const cheapReturnFlights = days.filter(day => day.group === "low" || day.group === "medium");
      const sortedCheapReturnFlights = cheapReturnFlights.sort((a, b) => a.price - b.price);
      const topFiveCheapReturnFlights = sortedCheapReturnFlights.slice(0, 5);

      return { cheapReturnFlights: topFiveCheapReturnFlights };
    } catch (error) {
      console.error('Erro ao buscar passagens de retorno:', error.message);
      reply.code(500).send({ error: 'Erro ao buscar passagens de retorno' });
    }
  });
}

module.exports = returnFlightsRoutes;
