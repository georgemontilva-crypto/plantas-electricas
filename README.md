# AKX — web de plantas eléctricas y energía solar

Sitio de la marca AKX: home, tienda con 27 equipos, ficha de cada producto con visor 3D, lista de cotización y contacto.

## Stack

- React 19 + Vite + TypeScript
- Three.js con `@react-three/fiber` y `@react-three/drei` para el 3D
- Express para servir el build y el endpoint `/api/contact` (correo vía Resend)
- Sin base de datos: el catálogo vive en `src/data/products.ts`

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # desarrollo en http://localhost:5173
npm run build      # typecheck + build de producción en dist/
npm start          # sirve dist/ y la API en http://localhost:3000
```

En desarrollo, el formulario de contacto llama a `/api/contact`, que Vite reenvía a `localhost:3000`. Para probarlo, deja corriendo `npm start` en otra terminal.

## Variables de entorno

Ver `.env.example`. El sitio funciona sin ninguna, pero el formulario de contacto solo envía correos si están estas dos:

| Variable | Para qué |
| --- | --- |
| `RESEND_API_KEY` | API key de Resend |
| `CONTACT_TO` | Correo que recibe las solicitudes (varios separados por coma) |
| `CONTACT_FROM` | Opcional. Remitente verificado en Resend |

Sin ellas, el formulario avisa al visitante que el mensaje no se envió y le ofrece WhatsApp o Instagram.

## Datos de contacto de la marca

`src/config/site.ts`. Lo que esté vacío no se muestra. Al poner `whatsapp` (solo dígitos, con código de país) aparecen los botones de WhatsApp en la ficha de producto, la cotización, el contacto y el pie.

## Catálogo

- `src/data/products.ts`: nombre, modelo, textos, datos destacados y ficha técnica de cada equipo. Todo sale de las fichas técnicas en PDF de la marca.
- `src/data/assets.json`: datos del modelo 3D de cada equipo (se genera, no se edita a mano).
- `public/products/`: fotos recortadas (`.webp`), su versión liviana de 560 px para tarjetas y móvil (`-sm.webp`), vistas extra (`-g1`, `-g2`…) con miniatura (`-th.webp`) y mapas de profundidad (`-depth.png`).

## Cómo está hecho el 3D

No hay archivos de modelos 3D de fábrica; los modelos se arman en el navegador a partir de las fotos de las fichas:

- **Extrusión** (inversores, baterías, estaciones 800 y 2400, plantas diésel): la foto frontal se convierte en un sólido con el contorno real del equipo y el fondo proporcional a sus medidas. Gira unos 50° a cada lado.
- **Relieve** (plantas portátiles menos la Mini 13.5, estación 6000): la foto en ¾ se desplaza con un mapa de profundidad estimado. Gira unos 17° a cada lado.
- **Foto** (AKX Mini 13.5): la imagen del equipo tal cual, sin relieve ni giro. Se activa con `"mode":"photo"` en `src/data/assets.json`.
- **Panel solar**: modelo procedural con las celdas y proporciones de la ficha. Gira 360°.

Si WebGL no está disponible, el visor muestra la foto del equipo.

## Despiece con scroll

Las plantas diésel (AKX 20 y AKX 27.5) tienen en su ficha una sección "Por dentro": al bajar la página la cabina se levanta y el equipo se abre en ocho piezas (cabina, motor, radiador, alternador, control, base y tanque, batería y escape).

- `src/data/despiece.ts`: nombre, texto y datos de cada pieza por equipo. Los datos salen de la ficha técnica.
- `src/three/ExplodedGenset.tsx`: el modelo. La cabina es el sólido real del producto; las piezas internas son una representación esquemática hecha con formas básicas, a escala de la cabina.
- `src/components/Despiece.tsx`: la sección fija, el panel de datos y la barra de piezas.

Para sumarle despiece a otro equipo de cabina cerrada basta con agregar su entrada en `despiece.ts`. Sin WebGL, la sección muestra las mismas piezas como lista.

## Despliegue en Railway

1. New Project → Deploy from GitHub repo → este repositorio.
2. Railway detecta Node y ejecuta `npm run build` y `npm start`.
3. En Variables, agregar `RESEND_API_KEY` y `CONTACT_TO`.
4. En Settings → Networking, generar el dominio o conectar el propio.
