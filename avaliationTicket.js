const fs = require('fs');
const path = require('path');

// Função para determinar o nível de desconto
function getDiscountLevel(price, averagePrice) {
  const discountPercentage = ((averagePrice - price) / averagePrice) * 100;

  if (discountPercentage <= 15) {
    return 1; // Nível 1: Desconto baixo
  } else if (discountPercentage > 15 && discountPercentage <= 40) {
    return 2; // Nível 2: Desconto médio
  } else {
    return 3; // Nível 3: Desconto alto
  }
}

// Função para ler o JSON e retornar as 5 ofertas mais baratas e a média dos preços
function getTopFiveCheapFlights(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    // Verifique se o objeto JSON tem a estrutura esperada
    if (jsonData && jsonData.flights && jsonData.flights.days) {
      const days = jsonData.flights.days;

      // Filtra as ofertas "low" ou "medium" e ordena pelo preço
      const cheapFlights = days.filter(day => day.group === "low" || day.group === "medium");
      const total = cheapFlights.reduce((sum, flight) => sum + flight.price, 0);
      const averagePrice = (cheapFlights.length > 0) ? (total / cheapFlights.length) : 0;

      const flightsWithDiscount = cheapFlights.map(flight => {
        const discountLevel = getDiscountLevel(flight.price, averagePrice);
        const discountPercentage = (((averagePrice - flight.price) / averagePrice) * 100).toFixed(2);
        return { ...flight, discountLevel, discountPercentage }; // Adiciona o nível de desconto e o percentual de desconto a cada voo
      });

      // Ordena pelo preço e seleciona os 5 mais baratos
      const sortedCheapFlights = flightsWithDiscount.sort((a, b) => a.price - b.price);
      const topFiveCheapFlights = sortedCheapFlights.slice(0, 5);

      return { topFiveCheapFlights, averagePrice };
    } else {
      console.log(`Estrutura inesperada no arquivo: ${filePath}`);
      return { topFiveCheapFlights: [], averagePrice: 0 };
    }
  } catch (error) {
    console.error(`Erro ao processar o arquivo ${filePath}:`, error.message);
    return { topFiveCheapFlights: [], averagePrice: 0 };
  }
}

// Caminhos dos arquivos JSON
const vooIdaPath = path.join(__dirname, 'vooIda.json');
const vooVoltaPath = path.join(__dirname, 'vooVolta.json');

// Obtem as 5 melhores ofertas de ida e o valor médio
const { topFiveCheapFlights: topFiveIda, averagePrice: averagePriceIda } = getTopFiveCheapFlights(vooIdaPath);
console.log('---------------- INFORMAÇÕES DE IDA ----------------');
console.log("Top 5 ofertas de ida mais baratas:", topFiveIda);
console.log("Valor médio das passagens de ida:", averagePriceIda.toFixed(2));

// Obtem as 5 melhores ofertas de volta e o valor médio
const { topFiveCheapFlights: topFiveVolta, averagePrice: averagePriceVolta } = getTopFiveCheapFlights(vooVoltaPath);
console.log('---------------- INFORMAÇÕES DE VOLTA ----------------');
console.log("Top 5 ofertas de volta mais baratas:", topFiveVolta);
console.log("Valor médio das passagens de volta:", averagePriceVolta.toFixed(2));
console.log(`Valor médio de ida e volta: ${(averagePriceVolta + averagePriceIda).toFixed(2)}`);
console.log('---------------- FIM DO PROCESSO. ----------------');
