const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const multer = require('multer');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const UPLOADS_DIR = path.join(__dirname, 'uploads');
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = crypto.randomUUID() + ext;
    cb(null, name);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió archivo' });
  }
  res.json({
    url: '/uploads/' + req.file.filename,
    name: req.file.originalname,
    size: req.file.size,
    type: req.file.mimetype
  });
});

app.use('/uploads', express.static(UPLOADS_DIR));

const db = require('./db');
require('./socket-handler')(io, db);

const PORT = process.env.PORT || 3000;

const getLocalIP = () => {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
};

server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║        CHAT CORMUDESI                    ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║  Local:  http://localhost:${PORT}             ║`);
  console.log(`║  Red:    http://${ip}:${PORT}   ║`);
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
});
