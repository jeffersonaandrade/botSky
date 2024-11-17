const axios = require('axios');
const fs = require('fs');

async function flightsScrapingRoutes(fastify, options) {
  fastify.get('/fetch-flights', async (request, reply) => {
    const skyscannerURLCalendar = "https://www.skyscanner.com.br/g/search-intent/v1/pricecalendar";


    const originRelevantFlightSkyId = "REC";
    const destinationRelevantFlightSkyId = "SSA";

    
    // Lê o arquivo JSON com os cookies e formata como uma string "name=value"
    const cookiesData = JSON.parse(fs.readFileSync('C:/Users/Administrador/Documents/meu-bot/cookies.json', 'utf8'));
    const cookiesString = cookiesData.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

    try {
      // Definindo o corpo da requisição conforme o `data-raw`
      const data = {
        originRelevantFlightSkyId: originRelevantFlightSkyId,
        destinationRelevantFlightSkyId: destinationRelevantFlightSkyId
      };

      // Configuração da requisição com axios
      const response = await axios.post(skyscannerURLCalendar, data, {
        headers: {
          "Accept": "*/*",
          "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          "Content-Type": "application/json",
          "cookie": cookiesString,
          "origin": "https://www.skyscanner.com.br",
          "priority": "u=1, i",
          "referer": "https://www.skyscanner.com.br/",
          "sec-ch-ua": '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-model": "",
          "sec-ch-ua-platform": "Windows",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
          xSkyscannerClient: "banana",
          xSkyscannerCurrency: "BRL",
          xSkyscannerLocale: "pt-BR",
          xSkyscannerMarket: "BR"
        }
      });

      // Checa se a resposta foi bem-sucedida
      if (response.status !== 200) {
        return reply.status(response.status).send({ error: 'Erro na requisição ao Skyscanner' });
      }

      // Retorna o JSON da resposta para o cliente
      return reply.send(response.data);

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Erro no servidor ao buscar dados do Skyscanner' });
    }
  });
}

module.exports = flightsScrapingRoutes;
