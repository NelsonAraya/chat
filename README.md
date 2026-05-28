# Chat CORMUDESI

Sistema de chat interno para redes LAN. Basado en Node.js + Express + Socket.IO con almacenamiento en JSON.

## Requisitos

- Node.js v18 o superior
- npm (incluido con Node.js)
- Red LAN con IP fija en el servidor

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd chat-cormudesi

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor
npm start
```

## Primer uso

Al iniciar el servidor por primera vez se crea automáticamente:

- **Usuario:** `admin`
- **Contraseña:** `admin`

Se recomienda cambiar la contraseña del admin después del primer ingreso.

## Acceder desde la LAN

1. Averigua la IP del servidor:
   - Windows: `ipconfig`
   - Linux/Mac: `ip a` o `ifconfig`

2. Desde cualquier PC de la red abre el navegador y ve a:
   ```
   http://<IP-DEL-SERVIDOR>:3000
   ```

   Ejemplo: `http://192.168.1.51:3000`

## Comandos

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor |
| `npm run dev` | Inicia con reinicio automático al editar código (usar `--watch`) |
| `Ctrl + C` | Detiene el servidor |

## Persistencia de datos

- Los mensajes, usuarios y salas se guardan en `chat-data.json`
- Los archivos adjuntos se guardan en la carpeta `uploads/`
- Si se elimina `chat-data.json`, se regenera automáticamente al reiniciar el servidor con los valores por defecto

## Estructura del proyecto

```
chat-cormudesi/
├── index.js              # Servidor Express + Socket.IO
├── db.js                 # Lógica de persistencia JSON + hash de contraseñas
├── socket-handler.js     # Eventos de Socket.IO
├── package.json
├── public/
│   ├── index.html        # Interfaz de usuario
│   ├── styles.css        # Estilos
│   ├── app.js            # Lógica del cliente
│   └── img/
│       └── logo.png      # Logo de CORMUDESI
├── uploads/              # Archivos adjuntos (se crea al iniciar)
└── chat-data.json        # Base de datos JSON (se genera automáticamente)
```

## Licencia

Desarrollado por Unidad de Informática - CORMUDESI
