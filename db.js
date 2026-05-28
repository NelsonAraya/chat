const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, 'chat-data.json');

let data = { rooms: [], messages: [], users: [] };

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function load() {
  if (fs.existsSync(DB_PATH)) {
    try {
      data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch {
      data = { rooms: [], messages: [], users: [] };
    }
  }

  if (!data.rooms) data.rooms = [];
  if (!data.messages) data.messages = [];
  if (!data.users) data.users = [];

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

  if (data.users.length === 0) {
    data.users.push({
      username: 'admin',
      password: hashPassword('admin'),
      created_at: new Date().toISOString()
    });
  }

  save();
}

function save() {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

load();

module.exports = { data, save, hashPassword };
