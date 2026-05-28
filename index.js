const express = require('express');
const http = require('http');
const https = require('https');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const multer = require('multer');
const selfsigned = require('selfsigned');

const app = express();

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

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

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

const start = async () => {
  // Generar o cargar certificado autofirmado persistente
  const CERTS_DIR = path.join(__dirname, 'certs');
  const KEY_PATH = path.join(CERTS_DIR, 'key.pem');
  const CERT_PATH = path.join(CERTS_DIR, 'cert.pem');

  let httpsOptions;
  if (fs.existsSync(KEY_PATH) && fs.existsSync(CERT_PATH)) {
    httpsOptions = {
      key: fs.readFileSync(KEY_PATH, 'utf8'),
      cert: fs.readFileSync(CERT_PATH, 'utf8'),
    };
  } else {
    if (!fs.existsSync(CERTS_DIR)) {
      fs.mkdirSync(CERTS_DIR, { recursive: true });
    }
    const attrs = [{ name: 'commonName', value: 'Chat CORMUDESI' }];
    const pems = await selfsigned.generate(attrs, { days: 365 * 5 });
    fs.writeFileSync(KEY_PATH, pems.private, 'utf8');
    fs.writeFileSync(CERT_PATH, pems.cert, 'utf8');
    httpsOptions = { key: pems.private, cert: pems.cert };
  }

  // Servidor HTTPS: sirve la app + Socket.IO
  const httpsServer = https.createServer(httpsOptions, app);
  const io = new Server();
  io.attach(httpsServer);

  require('./socket-handler')(io, db);

  // Servidor HTTP: solo redirige a HTTPS
  const httpServer = http.createServer((req, res) => {
    const host = req.headers.host?.split(':')[0] || getLocalIP();
    res.writeHead(301, { Location: `https://${host}:${HTTPS_PORT}${req.url}` });
    res.end();
  });

  httpServer.listen(HTTP_PORT, '0.0.0.0', () => {
    const ip = getLocalIP();
    console.log('');
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║           CHAT CORMUDESI                         ║');
    console.log('╠══════════════════════════════════════════════════╣');
    console.log(`║  Accede desde cualquier PC de la red:            ║`);
    console.log(`║  →  http://${ip}:${HTTP_PORT}                      ║`);
    console.log(`║                                                 ║`);
    console.log(`║  (redirige automáticamente a HTTPS)             ║`);
    console.log('╠══════════════════════════════════════════════════╣');
    console.log('║  HTTPS necesario para grabar audio              ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('');
  });

  httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
    const ip = getLocalIP();
    console.log(`[HTTPS] Seguro: https://${ip}:${HTTPS_PORT}`);
  });
};

start().catch(err => {
  console.error('Error al iniciar:', err);
  process.exit(1);
});
