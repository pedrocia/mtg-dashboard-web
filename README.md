
# MTG Web Dashboard (HTML/CSS/JS + Node/Express + Postgres)

UI agradável com **Bootstrap 5**, **Chart.js** e um backend **Express** mínimo que consome seu banco PostgreSQL (Neon).

## Passo a passo

1) **Banco no Neon** (ou Postgres local)
   - Crie o DB e rode **na ordem** os seus scripts: `MTG_CREATE.sql` e `MTG_POPULATE.sql`.

2) **Configurar o projeto**
   ```bash
   # 1. Entre na pasta do projeto
   cd mtg_web_dashboard
   # 2. Copie e preencha o .env
   cp .env.example .env
   # 3. Instale deps
   npm install
   ```

3) **Rodar em desenvolvimento**
   ```bash
   npm run dev
   # Abra http://localhost:3000
   ```

4) **Rodar em produção**
   ```bash
   npm start
   ```

5) **Deploy simples**
   - Suba no GitHub.
   - Hospede no Render/railway/fl0:
     - Serviço Web: `npm start`
     - Variáveis de ambiente: as do `.env` (PGHOST, PGDATABASE, etc.).

## Páginas
- **/** Visão Geral (KPIs, top premiações, win rate por deck)
- **/tournaments.html** filtros por cidade/formato
- **/players.html** busca de jogadores com consolidação de pontos/premiação
- **/decks.html** win rate + cartas mais usadas
- **/metagame.html** metagame por torneio

> O visual utiliza gradiente escuro, cartões com “glass”, cantos arredondados e foco em tipografia legível.
"# mtg-dashboard-web" 
"# mtg-dashboard-web" 
"# mtg-dashboard-web" 
"# mtg-dashboard-web" 
