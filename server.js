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
  reservas = JSON.parse(data);
}

// Obtener reservas
app.get('/reservas', (req, res) => {
  res.json(reservas);
});

// Guardar una reserva
app.post('/reservar', (req, res) => {
  const { dia, hora, nombre, telefono } = req.body;
  const key = `${dia}-${hora}`;
  if (reservas[key]) {
    return res.status(400).json({ error: 'Ya está reservado' });
  }
  reservas[key] = { nombre, telefono };
  guardar();
  res.sendStatus(200);
});

// Cancelar una reserva
app.post('/cancelar', (req, res) => {
  const { dia, hora } = req.body;
  const key = `${dia}-${hora}`;
  delete reservas[key];
  guardar();
  res.sendStatus(200);
});

// Guardar en archivo
function guardar() {
  fs.writeFileSync(archivo, JSON.stringify(reservas, null, 2));
}

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
