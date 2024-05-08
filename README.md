
<div align="center">
   Batalha de Herois 🦸🏻‍♂️⚔🦹🏻‍♀️
</div>

<p align="center">
  <img src="https://static.wikia.nocookie.net/marvel/images/d/dc/DC_Universe_001.jpg/revision/latest?cb=20170815151903&path-prefix=pt-br"/>
</p>

Bem-vindos a Batalha de Herois (DC), em Backend. Fazendo um Crud completo.

## Tecnologias Utilizadas
- Node.js.
- Express.
- PostgreSQL.

## Funcionalidades
-Criação do CRUD completo, dos personagem. 
-Criação da Batalha junto o Historico.

## Iniciação do Projeto💫

## Instalações inicial 
- npm init -y
- npm install express pg
- npm instal -g nodemon

logo após:
entre no arquivo package.json. No paragrafo script adicione  "dev": "nodemon index.js".

## Banco de Dados(Sql)
-Coloque sua senha.
-Crie uma DATABASE do seu Projeto 
-Crie tabelas herois e historico que tenha sua relação 

## Arquivo Index.js 
- Coloque suas informação do Banco como: user/host/database/password/port.

Logo após entre no terminal 

npm run dev ou pode ser nmp run start.

## PORT 
coloque sua porta http://localhost:3000.

## Rotas no insomnia ou na extensão Thunder Client 

- GET/http://localhost:3000/ rota para verifica servidor.
- GET /herois: Retorna todos os herois.
- GET /herois/1: Retorna para pegar ID.
- POST /herois: Cria um novo heroi.
- PUT /herois: Atualizar heroi.
- DELETE /herois: Deleta um heroi.
- GET /herois/nome/:nome: Filtro por nome.
- GET /herois/poder/:poder/ Filtro por poder.
- GET /batalhar/1/3: Retorna o Vecedor e o Perdedor.
- GET /historico/: Retona o dia da batalha.

![Estrutura](/assets/rotas.png)



