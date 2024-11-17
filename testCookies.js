const fs = require('fs');
const path = require('path');

// Caminho do arquivo JSON
const cookiesFilePath = path.join(__dirname, 'C:/Users/Administrador/Documents/meu-bot/cookies.json');

// Função para ler o arquivo JSON
function getCookiesData() {
  try {
    const data = fs.readFileSync(cookiesFilePath, 'utf8');
    const cookies = JSON.parse(data);

    // Verifica se a estrutura é um array de cookies
    if (Array.isArray(cookies)) {
      // Retorna os cookies mapeados para um objeto de variáveis
      return cookies.reduce((acc, cookie) => {
        // A chave do objeto será o nome do cookie
        acc[cookie.name] = cookie.value;
        return acc;
      }, {});
    }
    return {};
  } catch (err) {
    console.error("Erro ao ler o arquivo cookies.json", err);
    return null;
  }
}

// Usando as informações do cookies.json
const cookies = getCookiesData();

// Função para gerar as variáveis no formato "nome=valor"
function formatCookieVariable(name) {
  const value = cookies[name] || '';
  const formatted = value ? `${name}=${value}` : '';
  console.log(`Variável formatada: ${formatted}`);  // Log para entender como a variável está ficando
  return formatted;
}

// Variáveis preenchidas com os valores do arquivo JSON
const px3 = formatCookieVariable("_px3");
const pxhd = formatCookieVariable("_pxhd");
const pxcts = formatCookieVariable("_pxcts");
const scanner = formatCookieVariable("scanner");
const ssculture = formatCookieVariable("ssCulture");
const ssab = formatCookieVariable("ssab");
const jha = formatCookieVariable("jha");
const experiment_allocation_id = formatCookieVariable("experimentAllocationId");
const secureSka = formatCookieVariable("secureSka");
const traveller_context = formatCookieVariable("traveller_context");
const device_guid = formatCookieVariable("deviceGuid");
const cto_bundle = formatCookieVariable("ctoBundle");
const abgroup = formatCookieVariable("abGroup");
const pxvid = formatCookieVariable("pxvid");
const gcl_au = formatCookieVariable("gcl_au");
const ga_Xeem = formatCookieVariable("gaXeem");
const ga = formatCookieVariable("ga");
const secure_anon_token = formatCookieVariable("secureAnonToken");
const secure_anon_csrf_token = formatCookieVariable("secureAnonCsrf");
const qsiSZn = formatCookieVariable("qsiSZn");
const ssaBoverrides = formatCookieVariable("ssaBoverrides");

// Função para combinar as partes dos cookies
function getCombinedCookies() {
  const combined = `${px3}${qsiSZn}${ssaBoverrides}${secure_anon_csrf_token}${secure_anon_token}${ga}${ga_Xeem}${gcl_au}${pxhd}${pxvid}${abgroup}${cto_bundle}${device_guid}${traveller_context}${experiment_allocation_id}${secureSka}${scanner}${pxcts}${jha}${ssab}${ssculture}`;
  console.log(`Cookies combinados: ${combined}`);  // Log para mostrar como os cookies ficam no formato combinado
  return combined;
}

// Exemplo de como a variável combinada seria exportada ou utilizada
const combinedCookies = getCombinedCookies();

// Se você quiser testar diretamente no console
console.log("Cookies combinados para testar:", combinedCookies);

