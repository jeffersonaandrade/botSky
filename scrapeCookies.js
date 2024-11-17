const fs = require('fs');
const { chromium } = require('playwright');

const aeroIdas = ["REC", "FOR", "FEN"];
const aeroVoltas = ["SSA", "GIG", "BSB"];
let allResults = {};

async function typeSlowly(page, selector, text, delay = 200) {
  for (const char of text) {
    await page.type(selector, char);
    await page.waitForTimeout(delay);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  page.on('response', async (response) => {
    if (response.url().includes('https://www.skyscanner.com.br/g/search-intent/v1/pricecalendar')) {
      const responseBody = await response.json();

      if (responseBody.flights && responseBody.flights.days) {
        const days = responseBody.flights.days;
        const cheapFlights = days.filter(day => day.group === "low" || day.group === "medium");
        const sortedCheapFlights = cheapFlights.sort((a, b) => a.price - b.price);
        const topFiveCheapFlights = sortedCheapFlights.slice(0, 5);

        if (topFiveCheapFlights.length > 0) {
          const key = `from-${currentAeroIda}to-${currentAeroVolta}`;
          if (!allResults[key]) {
            allResults[key] = { ida: null, volta: null };
          }

          if (!allResults[key].ida) {
            allResults[key].ida = topFiveCheapFlights;
            console.log(`Top 5 passagens de ida mais baratas (${currentAeroIda} -> ${currentAeroVolta}):`, topFiveCheapFlights);
          } else if (!allResults[key].volta) {
            allResults[key].volta = topFiveCheapFlights;
            console.log(`Top 5 passagens de volta mais baratas (${currentAeroVolta} -> ${currentAeroIda}):`, topFiveCheapFlights);
          }

          fs.writeFileSync(`top-five-cheap-flights-${key}.json`, JSON.stringify(allResults[key], null, 2));
        }
      }
    }
  });

  await page.goto('https://www.skyscanner.com.br');

  for (const aeroIda of aeroIdas) {
    for (const aeroVolta of aeroVoltas) {
      currentAeroIda = aeroIda;
      currentAeroVolta = aeroVolta;

      console.log(`Buscando voos de ${aeroIda} para ${aeroVolta}...`);

      await page.fill('#originInput-input', '');
      await page.fill('#destinationInput-input', '');

      // Digita o aeroporto de origem com atraso
      await page.waitForSelector('#originInput-input', { state: 'attached' });
      await typeSlowly(page, '#originInput-input', aeroIda);
      await page.waitForTimeout(3000);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      // Digita o aeroporto de destino com atraso
      await typeSlowly(page, '#destinationInput-input', aeroVolta);
      await page.waitForTimeout(1000);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      await page.click('[data-testid="depart-btn"]');
      await page.waitForSelector('button[class^="BpkSelectableChip_bpk-chip__OWZlN BpkSelectableChip_bpk-chip--default__MDRlZ ChipDropdown"]');
      await page.click('button[class^="BpkSelectableChip_bpk-chip__OWZlN BpkSelectableChip_bpk-chip--default__MDRlZ ChipDropdown"]');

      // Digita a volta
      await page.waitForSelector('#originInput-input', { state: 'attached' });
      await typeSlowly(page, '#originInput-input', aeroVolta);
      await page.waitForTimeout(2000);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      await typeSlowly(page, '#destinationInput-input', aeroIda);
      await page.waitForTimeout(1000);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      await page.click('[data-testid="depart-btn"]');
      await page.waitForSelector('button[class^="BpkSelectableChip_bpk-chip__OWZlN BpkSelectableChip_bpk-chip--default__MDRlZ ChipDropdown"]');
      await page.click('button[class^="BpkSelectableChip_bpk-chip__OWZlN BpkSelectableChip_bpk-chip--default__MDRlZ ChipDropdown"]');

      await page.waitForTimeout(5000); 
    }
  }

  await browser.close();
})();
