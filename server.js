const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const db = mysql.createConnection({
  host: 'junction.proxy.rlwy.net',
  user: 'root',
  password: 'unbMfsgCHiFtAABNCOBMogeyZfREyzuu',
  database: 'railway',
  port: 23523
})

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

app.get('/equipos', (req, res) => {
  const query = 'SELECT * FROM equipos';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los equipos:', err);
      res.status(500).send({ message: 'Error al obtener los equipos' });
    } else {
      res.send(results);
    }
  });
});

// API para obtener todos los partidos
app.get('/partidos', (req, res) => {
  const query = `
    SELECT
      e1.nombre AS equipo_local,
      e1.logo AS local_logo,
      e2.nombre AS equipo_visitante,
      e2.logo AS visitante_logo,
      p.fecha,
      p.resultado,
      p.img
    FROM
      partidos p
    INNER JOIN equipos e1 ON
      p.equipo_local = e1.id
    INNER JOIN equipos e2 ON
      p.equipo_visitante = e2.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los partidos:', err);
      res.status(500).send({ message: 'Error al obtener los partidos' });
    } else {
      res.send(results);
    }
  });
});

// API para obtener todos la tabla de posiciones
app.get('/puntos', (req, res) => {
  const query = `
    select
      e.nombre as equipo,
      p.juegos_jugados,
      p.juegos_ganados,
      p.juegos_empatados,
      p.juegos_perdidos,
      p.goles_favor,
      p.goles_contra,
      p.diferencia_goles,
      p.puntos 
    from posiciones p
    inner join equipos e ON p.equipo = e.id 
    order by puntos desc
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los partidos:', err);
      res.status(500).send({ message: 'Error al obtener los partidos' });
    } else {
      res.send(results);
    }
  });
});

// API para realizar una apuesta
app.post('/apuestas', (req, res) => {
  const { partido, equipo_apostado, cantidad } = req.body;
  const query = 'INSERT INTO apuestas (partido, equipo_apostado, cantidad) VALUES (?, ?, ?)';
  db.query(query, [partido, equipo_apostado, cantidad], (err, results) => {
    if (err) {
      console.error('Error al realizar la apuesta:', err);
      res.status(500).send({ message: 'Error al realizar la apuesta' });
    } else {
      res.send({ message: 'Apuesta realizada con éxito' });
    }
  });
});

app.get('/', (req, res) => {
  const query = 'SELECT * FROM equipos';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los equipos:', err);
      res.status(500).send({ message: 'Error al obtener los equipos' });
    } else {
      res.send(results);
    }
  });
});

app.listen(3002, () => {
  console.log('Servidor escuchando en el puerto 3002');
});