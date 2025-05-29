const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let reservas = {};
const archivo = 'reservas.json';

// Cargar reservas previas si el archivo existe
if (fs.existsSync(archivo)) {
  const data = fs.readFileSync(archivo);
  try {
    reservas = JSON.parse(data);
  } catch (err) {
    reservas = {};
    console.log("⚠️ Archivo de reservas corrupto, se reinicia.");
  }
}

// Obtener todas las reservas
app.get('/reservas', (req, res) => {
  res.json(reservas);
});

// Guardar una reserva
app.post('/reservar', (req, res) => {
  const { cancha, dia, hora, nombre, telefono } = req.body;

  if (!cancha || !dia || !hora || !nombre || !telefono) {
    return res.status(400).json({ error: 'Faltan datos para reservar' });
  }

  const key = `${cancha}-${dia}-${hora}`;

  if (reservas[key]) {
    return res.status(400).json({ error: 'Ya está reservado' });
  }

  reservas[key] = { nombre, telefono };
  guardar();
  res.sendStatus(200);
});

// Cancelar una reserva
app.post('/cancelar', (req, res) => {
  const { cancha, dia, hora } = req.body;
  const key = `${cancha}-${dia}-${hora}`;
  delete reservas[key];
  guardar();
  res.sendStatus(200);
});

// Guardar en archivo JSON
function guardar() {
  fs.writeFileSync(archivo, JSON.stringify(reservas, null, 2));
}

app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
