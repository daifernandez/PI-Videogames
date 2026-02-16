# Checklist de deploy

## Si el error es del **frontend** (React / Vercel Static / Netlify)

### 1. Variables de entorno
En la plataforma (Vercel → Settings → Environment Variables, Netlify → Site settings → Environment variables) debe existir:

- `REACT_APP_API_HOST` = URL de tu API (ej: `https://tu-api.vercel.app` o `https://tu-api.onrender.com`)

Sin esta variable el build puede pasar pero la app en producción no podrá conectar con la API.

### 2. Build command y publish directory
- **Build command:** `npm run build` (o `cd client && npm run build` si el repo tiene client y api en la raíz)
- **Publish directory:** `client/build` (si solo despliegas el frontend desde la raíz del repo)

### 3. Node
En `client/package.json` está `"engines": { "node": ">=16.x" }`. La plataforma debe usar Node 16+ (en Vercel/Netlify suele ser automático).

---

## Si el error es del **backend** (API en Vercel)

Tu `api/vercel.json` usa `"src": "index.js"`. En Vercel, cada ruta se trata como **serverless function**: se ejecuta un archivo que debe **exportar** un manejador (req, res), no hacer `server.listen()`.

Tu `api/index.js` actual:
- Hace `require("./src/app.js")` (el Express `server`)
- Llama a `syncDatabase()` y luego `server.listen(port)`

Eso vale para un servidor Node tradicional (Render, Railway, etc.), pero **no** para Vercel serverless tal como está.

Opciones:
- **Opción A:** Desplegar la API en **Render** o **Railway** (servidor persistente) y en Vercel solo el frontend.
- **Opción B:** Crear un entrypoint para Vercel que exporte la app Express (sin `listen`) y usar ese archivo en `vercel.json`. Ejemplo en este repo: ver archivo `api/vercel-serverless.js` si se añade.

---

## Errores típicos al hacer `npm run build` (client)

- **"Failed to compile"** → Revisar la pestaña de build en la plataforma; suele ser un error de sintaxis o de import en algún componente.
- **"Module not found"** → Ruta de import incorrecta o archivo movido.
- **"process is not defined"** → Usar `process.env.REACT_APP_*` solo en código que corre en el cliente; en Create React App eso es válido.

---

## Qué enviar para poder ayudarte

Copia y pega:
1. El **mensaje de error completo** del deploy (log de la plataforma).
2. **Plataforma** (Vercel, Netlify, Render, etc.) y si estás desplegando solo el client, solo la API, o ambos.

Con eso se puede indicar el cambio exacto (archivo y línea).
