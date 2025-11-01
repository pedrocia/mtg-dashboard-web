
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');
const q = require('./queries');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health
app.get('/api/health', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT version();');
    res.json({ ok: true, version: rows[0].version });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// KPIs
app.get('/api/kpis', async (req, res) => {
  try {
    const [t1, t2, t3, t4] = await Promise.all([
      pool.query(q.kpis.totalTorneios),
      pool.query(q.kpis.totalJogadores),
      pool.query(q.kpis.totalDecks),
      pool.query(q.kpis.premioTotal)
    ]);
    res.json({
      totalTorneios: t1.rows[0].v,
      totalJogadores: t2.rows[0].v,
      totalDecks: t3.rows[0].v,
      premioTotal: t4.rows[0].v
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Top players
app.get('/api/top-players', async (req, res) => {
  try {
    const { rows } = await pool.query(q.topPlayers);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Deck winrate
app.get('/api/deck-winrate', async (req, res) => {
  try {
    const { rows } = await pool.query(q.deckWinrate);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Cards popularity
app.get('/api/cards-popularity', async (req, res) => {
  try {
    const { rows } = await pool.query(q.cardsPopularity);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Filters
app.get('/api/locations', async (req, res) => {
  try {
    const { rows } = await pool.query(q.locations);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});
app.get('/api/formats', async (req, res) => {
  try {
    const { rows } = await pool.query(q.formats);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Tournaments list (for dropdowns)
app.get('/api/tournaments/list', async (req, res) => {
  try {
    const { rows } = await pool.query(q.tournamentsList);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Tournaments with filters
app.get('/api/tournaments', async (req, res) => {
  try {
    const cidade = req.query.cidade || null;
    const formato = req.query.formato || null;
    const { rows } = await pool.query(q.tournaments, [cidade, formato]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Metagame by torneio id
app.get('/api/metagame', async (req, res) => {
  try {
    const id = parseInt(req.query.id_torneio, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: "id_torneio inválido" });
    const { rows } = await pool.query(q.metagameByTorneioId, [id]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server on http://localhost:${port}`);
});


// Players search (by name, aggregated stats)
app.get('/api/players', async (req, res) => {
  try {
    const nome = (req.query.nome || '').trim();
    const sql = `
      SELECT j.id_jogador, j.nome_jogador,
             COALESCE(SUM(c.pontos_totais),0) AS pontos_total,
             COALESCE(SUM(c.vitorias),0) AS vitorias,
             COALESCE(SUM(c.derrotas),0) AS derrotas,
             COALESCE(SUM(c.premios),0) AS premio_total
      FROM jogador j
      LEFT JOIN classificacao c ON c.id_jogador = j.id_jogador
      WHERE ($1 = '' OR j.nome_jogador ILIKE '%' || $1 || '%')
      GROUP BY j.id_jogador, j.nome_jogador
      ORDER BY premio_total DESC, pontos_total DESC;
    `;
    const { rows } = await pool.query(sql, [nome]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});
