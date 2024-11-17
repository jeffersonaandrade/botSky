// routes/flights.js
const axios = require('axios');

// Chaves da API
const API_HOST = 'sky-scanner3.p.rapidapi.com';
const API_KEY = '9c632aab22msh67fd7fafc0845a2p1d499cjsna8efe4e8ea4d';

async function flightsRoutes(fastify, options) {
  // Endpoint de pesquisa de voos
  fastify.get('/rest/v1/flights/search', async (request, reply) => {
    const { fromEntityId, toEntityId } = request.query;

    // Calculando a data de partida (hoje + 1 dia)
    const today = new Date();
    const departDate = new Date(today);
    departDate.setDate(today.getDate() + 1);

    const formattedDate = departDate.toISOString().split('T')[0];

    try {
      const response = await axios.get(`https://sky-scanner3.p.rapidapi.com/flights/price-calendar`, {
        params: {
          fromEntityId,
          toEntityId,
          departDate: formattedDate,
          market: 'BR',
          locale: 'pt-BR',
          currency: 'BRL'
        },
        headers: {
          'x-rapidapi-host': API_HOST,
          'x-rapidapi-key': API_KEY,
        },
      });

      console.log('Resposta da API:', response.data);

      const days = response.data.data.flights.days;
      const cheapFlights = days.filter(day => day.group === "low" || day.group === "medium");
      const sortedCheapFlights = cheapFlights.sort((a, b) => a.price - b.price);
      const topFiveCheapFlights = sortedCheapFlights.slice(0, 5);

      return { cheapFlights: topFiveCheapFlights };
    } catch (error) {
      console.error('Erro ao buscar passagens:', error.message);
      reply.code(500).send({ error: 'Erro ao buscar passagens' });
    }
  });
}

module.exports = flightsRoutes;
