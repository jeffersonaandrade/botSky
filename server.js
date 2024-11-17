const fastify = require('fastify')({ logger: true });
const flightsRoutes = require('./routes/flights');
const returnFlightsRoutes = require('./routes/returnFlights');
const flightsScraping = require('./routes/flightsScraping');

// Registrar as rotas
fastify.register(flightsRoutes);
fastify.register(returnFlightsRoutes);
fastify.register(flightsScraping);

// Função para iniciar o servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3030 });
    console.log('Servidor rodando em http://localhost:3030');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
