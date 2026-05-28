# Chat CORMUDESI

Sistema de chat interno para redes LAN. Basado en Node.js + Express + Socket.IO con almacenamiento en JSON.

## Requisitos

- Node.js v18 o superior
- npm (incluido con Node.js)
- Red LAN con cable o WiFi
- Puertos **3000** y **3443** abiertos en el firewall del servidor

## Instalación

```bash
# 1. Clonar el repositorio en el servidor
git clone <url-del-repo>
cd chat-cormudesi

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor
npm start
```

## Acceder desde la LAN

No necesitas configurar nada. La IP se detecta automáticamente.

1. En el servidor corre `npm start`. Verás algo como:

   ```
   ║  →  http://192.168.1.51:3000
   ```

2. Desde **cualquier PC de la red** abre el navegador y ve a esa dirección:

   ```
   http://192.168.1.51:3000
   ```

3. El servidor **redirige automáticamente a HTTPS** para que la grabación de audio funcione.

4. La **primera vez** verás la advertencia del navegador:
   - **Chrome/Edge:** clic en **Avanzado → Ir a 192.168.1.51 (no seguro)**
   - **Firefox:** clic en **Avanzado → Aceptar riesgo y continuar**

   Esto se ve **solo la primera vez por PC**. Después el navegador lo recuerda.

## Primer uso

Al iniciar el servidor por primera vez se crea automáticamente:

- **Usuario:** `admin`
- **Contraseña:** `admin`

Cambia la contraseña del admin después del primer ingreso.

## Puertos personalizados

Si los puertos default (3000 y 3443) están ocupados, puedes cambiarlos:

```bash
HTTP_PORT=3000 HTTPS_PORT=3443 npm start
```

## Archivos que se modifican al cambiar de red

**Ninguno.** La IP se detecta automáticamente con el sistema. Solo clonas, instalas e inicias.

## Firewall

Asegúrate de tener abiertos los puertos 3000 y 3443 en el firewall de Windows:

```
Windows + R → "wf.msc" → Reglas de entrada → Nueva regla → Puerto
→ TCP → puertos: 3000,3443 → Permitir → ...
```

## Comandos

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor |
| `npm run dev` | Inicia con reinicio automático al editar código |
| `Ctrl + C` | Detiene el servidor |

## Persistencia de datos

- Los mensajes, usuarios y salas se guardan en `chat-data.json`
- Los archivos adjuntos se guardan en la carpeta `uploads/`
- El certificado SSL se guarda en `certs/` (se genera solo la primera vez)
- Si eliminas `chat-data.json` se regenera automáticamente al reiniciar

## Estructura del proyecto

```
chat-cormudesi/
├── index.js              # Servidor (HTTP redirige a HTTPS)
├── db.js                 # Persistencia JSON + hash de contraseñas
├── socket-handler.js     # Eventos de Socket.IO
├── package.json
├── certs/                # Certificado SSL (se genera solo)
├── uploads/              # Archivos adjuntos (se crea al iniciar)
├── public/
│   ├── index.html        # Interfaz de usuario
│   ├── styles.css        # Estilos
│   ├── app.js            # Lógica del cliente
│   └── img/
│       └── logo.png      # Logo de CORMUDESI
└── chat-data.json        # Base de datos JSON (se genera automáticamente)
```

## Licencia

Desarrollado por Unidad de Informática - CORMUDESI
