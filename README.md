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
   http://<IP-DEL-SERVIDOR>:3000
   ```

   Ejemplo: `http://192.168.1.51:3000`

3. El servidor **redirige automáticamente a HTTPS** para que la grabación de audio funcione.

## Instalar certificado de seguridad

Para eliminar la advertencia **"No es seguro"** del navegador (Chrome/Edge) y que aparezca un candado verde:

1. Abre `https://<IP-DEL-SERVIDOR>:3443` en el navegador.
   - Ejemplo: `https://192.168.1.51:3443`
   - La primera vez verás **"Su conexión no es privada"**
   - Haz clic en: **Avanzado → Ir a `<IP>` (sitio no seguro)**

2. En la pantalla de login verás un banner verde con **"Descargar certificado"**.

3. Haz clic en **Descargar certificado** → se descarga `Chat-CORMUDESI-cert.cer`.

4. Abre el archivo descargado y haz clic en **"Instalar certificado"**.

5. Sigue estos pasos:
   - **Máquina local** → **Siguiente**
   - **Colocar todos los certificados en el siguiente almacén** → **Examinar**
   - Selecciona **"Entidades de certificación raíz de confianza"** → **Aceptar**
   - **Siguiente** → **Finalizar**
   - Haz clic en **"Sí"** en el mensaje de seguridad

6. Vuelve a cargar la página `https://<IP-DEL-SERVIDOR>:3443`.
   - La advertencia ya no aparecerá.
   - El candado se mostrará como seguro.

> **Nota:** Si el servidor cambia de IP (ej: se conecta en otra red), el certificado se regenera automáticamente. Deberás descargar e instalar el nuevo certificado en cada PC cliente.

## Grabación de audio

La grabación de audio (micrófono) funciona solo en **HTTPS**. El servidor redirige automáticamente:

```
http://<IP-DEL-SERVIDOR>:3000  →  https://<IP-DEL-SERVIDOR>:3443
```

Solo presiona el botón 🎤 en el área de mensajes para grabar.

## Primer uso

Al iniciar el servidor por primera vez se crea automáticamente:

- **Usuario:** `admin`
- **Contraseña:** `admin`
- **Rol:** Administrador

Cambia la contraseña del admin después del primer ingreso. Usa el panel Admin (⚙) para crear usuarios y gestionar salas.

## Puertos personalizados

Si los puertos default (3000 y 3443) están ocupados, puedes cambiarlos:

```bash
HTTP_PORT=3001 HTTPS_PORT=3444 npm start
```

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

## Botón de Alerta

El chat incluye un botón de alerta (pánico) en la barra lateral izquierda.

- **Activarlo:** Haz clic en el botón rojo **Botón Alerta**
- **Qué hace:** Todos los usuarios conectados reciben un modal + sonido indicando quién solicita asistencia y su ubicación
- **Ubicación:** Haz clic en el ícono 📍 en el header para asignar tu ubicación actual (ej: "Oficina 302, Edificio Central")
- Si no has configurado ubicación se mostrará como "Indeterminada"
- El sonido de alerta se puede personalizar reemplazando `public/sounds/alerta.mp3`

## Panel de Administración

Los usuarios con rol **admin** ven una tercera pestaña ⚙ en la barra lateral con las siguientes capacidades:

### Estadísticas

Cuatro tarjetas en la parte superior del panel con:
- **Usuarios:** total de cuentas registradas
- **Conectados:** usuarios online en este momento
- **Mensajes:** total de mensajes enviados
- **Salas:** total de salas creadas

### Gestión de usuarios

Al hacer clic en ✏ junto a un usuario se abre un modal para:
- Cambiar nombre visible
- Cambiar rol (Usuario / Administrador)
- **Resetear contraseña** (campo opcional — si se deja vacío no se modifica)
- **Eliminar usuario** (botón rojo con confirmación)

> Reglas de seguridad: un admin no puede eliminarse a sí mismo, no puede eliminar al usuario `admin`, y no puede cambiar su propia contraseña desde este panel (debe usar el modal de cambio de contraseña normal).

### Gestión de salas

Cada sala fija (no temporal, excepto `#general`) tiene dos botones:
- 🔒/🔓 — Asignar o quitar contraseña de la sala
- 🗑 — Eliminar la sala (solo salas no temporales, excepto `#general`)

Las salas temporales se eliminan automáticamente al quedar vacías.

## Notificaciones no leídas

- Cada sala muestra un badge 🔴 con la cantidad de mensajes no leídos
- La pestaña **Salas** suma todos los no leídos en un badge general
- Al hacer clic en una sala o al volver a la pestaña del navegador, los contadores se reinician
- Los mensajes privados también muestran badge 🔴 en la pestaña **Privados**

## Persistencia de datos

- Los usuarios y salas se guardan en `data.json` (permanente)
- El historial de mensajes se guarda en `messages.json` (se puede borrar para limpiar el historial sin perder usuarios)
- Los archivos adjuntos se guardan en `uploads/`
- El certificado SSL se guarda en `certs/` (se genera automáticamente al iniciar con la IP actual)
- Si eliminas `data.json` o `messages.json` se regeneran automáticamente al reiniciar

## Estructura del proyecto

```
chat-cormudesi/
├── index.js              # Servidor (HTTP redirige a HTTPS)
├── db.js                 # Persistencia JSON separada + hash de contraseñas
├── socket-handler.js     # Eventos de Socket.IO
├── data.json             # Usuarios y salas (permanente)
├── messages.json         # Historial de mensajes (descartable)
├── package.json
├── certs/                # Certificado SSL (se genera al iniciar con la IP actual)
├── uploads/              # Archivos adjuntos (se crea al iniciar)
├── public/
│   ├── sounds/
│   │   └── alerta.mp3    # Sonido del botón de alerta
│   ├── index.html        # Interfaz de usuario
│   ├── styles.css        # Estilos
│   ├── app.js            # Lógica del cliente
│   └── img/
│       ├── logo.png      # Logo de CORMUDESI
│       ├── cert-01-download.png
│       ├── cert-02-open.png
│       ├── cert-03-install.png
│       ├── cert-04-local-machine.png
│       ├── cert-05-browse.png
│       ├── cert-06-trusted-root.png
│       ├── cert-07-finish.png
│       ├── cert-08-security.png
│       └── cert-09-done.png  # Pasos para instalar certificado
```

## Licencia

Desarrollado por Unidad de Informática - CORMUDESI
