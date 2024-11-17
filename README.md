Sistema de Busca de Ofertas de Voos

Descrição

Este sistema automatiza a recuperação de dados de voos de um site específico e processa as informações para identificar e retornar as melhores ofertas de passagens de ida e volta para os destinos desejados. É ideal para usuários que buscam economia e eficiência ao planejar suas viagens.

Funcionalidades

Conexão com o site para realizar buscas de voos.
Recuperação de ofertas com base em critérios definidos (destino, datas, preços, etc.).
Processamento de dados para identificar as melhores combinações de voos de ida e volta.
Retorno das melhores ofertas em um formato fácil de visualizar e utilizar.

Tecnologias Utilizadas:
Backend: [Node.js]
Bibliotecas de Scraping/Requests: [Axios e Playwright]

Como Funciona

O sistema realiza requisições para o site de voos especificado, simulando uma busca do usuário.
Os resultados da busca são coletados e analisados para identificar voos de ida e volta que atendem aos critérios.
As melhores ofertas são classificadas com base no preço e tempo de viagem.
As informações são retornadas para o usuário em formato JSON ou por meio de uma interface.

Requisitos
Node.js instalado.
API Key ou credenciais, caso necessário para acessar o site de voos.
Ferramentas de scraping configuradas (se for necessário acessar dados dinâmicos).

Como Configurar o Projeto

Clone o repositório:
git clone https://github.com/jeffersonaandrade/botSky.git

Instale as dependências:
npm install


Inicie o servidor:
node testCookies.js

