const fs = require('fs');

// Lê o arquivo JSON com os cookies
const cookiesData = JSON.parse(fs.readFileSync('C:/Users/Administrador/Documents/meu-bot/cookies.json', 'utf8'));

// Extrai apenas o `name` e `value` de cada cookie e monta uma string no formato "name=value"
const cookiesString = cookiesData.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

// Salva o resultado no arquivo `cookies.txt`
fs.writeFileSync('cookies.txt', cookiesString);

console.log('Arquivo de cookies gerado com sucesso!');
