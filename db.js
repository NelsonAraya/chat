const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_PATH = path.join(__dirname, 'data.json');
const MSGS_PATH = path.join(__dirname, 'messages.json');
const LEGACY_PATH = path.join(__dirname, 'chat-data.json');

let data = { rooms: [], messages: [], users: [] };

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function load() {
  // Migración desde chat-data.json (una sola vez)
  if (fs.existsSync(LEGACY_PATH) && !fs.existsSync(DATA_PATH)) {
    try {
      const legacy = JSON.parse(fs.readFileSync(LEGACY_PATH, 'utf8'));
      data.rooms = legacy.rooms || [];
      data.messages = legacy.messages || [];
      data.users = legacy.users || [];
      save();
      fs.renameSync(LEGACY_PATH, LEGACY_PATH + '.bak');
      console.log('[DB] chat-data.json migrado a data.json + messages.json');
    } catch (e) {
      console.error('[DB] Error migrando chat-data.json:', e.message);
    }
  }

  // Cargar data.json (usuarios + salas)
  if (fs.existsSync(DATA_PATH)) {
    try {
      const dataFile = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
      data.rooms = dataFile.rooms || [];
      data.users = dataFile.users || [];
    } catch {
      data.rooms = [];
      data.users = [];
    }
  } else {
    data.rooms = [];
    data.users = [];
  }

  // Cargar messages.json (solo historial)
  if (fs.existsSync(MSGS_PATH)) {
    try {
      data.messages = JSON.parse(fs.readFileSync(MSGS_PATH, 'utf8'));
    } catch {
      data.messages = [];
    }
  } else {
    data.messages = [];
  }

  if (!Array.isArray(data.messages)) data.messages = [];

  // Asegurar campo role en todos los usuarios
  data.users.forEach(u => {
    if (!u.role) u.role = 'user';
  });

  // Asegurar sala general
  const general = data.rooms.find(r => r.name === 'general');
  if (!general) {
    data.rooms.push({
      name: 'general',
      created_by: 'sistema',
      created_at: new Date().toISOString(),
      password: null,
      temporary: false
    });
  } else {
    if (general.password === undefined) general.password = null;
    if (general.temporary === undefined) general.temporary = false;
  }

  // Asegurar que admin tenga role admin
  const adminUser = data.users.find(u => u.username === 'admin');
  if (adminUser) adminUser.role = 'admin';

  // Asegurar usuario admin por defecto si no hay usuarios
  if (data.users.length === 0) {
    data.users.push({
      username: 'admin',
      password: hashPassword('admin'),
      role: 'admin',
      created_at: new Date().toISOString()
    });
  }

  save();
}

function save() {
  fs.writeFileSync(DATA_PATH, JSON.stringify({ users: data.users, rooms: data.rooms }, null, 2));
  fs.writeFileSync(MSGS_PATH, JSON.stringify(data.messages, null, 2));
}

load();

module.exports = { data, save, hashPassword };
