# AP Servicios — Sitio web

Sitio de una página para **AP Servicios**, proveedor de construcción, adecuación,
mantenimiento, logística y suministro industrial en Panamá.

## Stack

**HTML + CSS + JavaScript puro (vanilla).** No usa React, Vue, Svelte ni Next.js.

**Vite** está presente únicamente como herramienta de compilación: servidor de
desarrollo con recarga en caliente, minificado de CSS/JS y hashing de nombres de
archivo para el cacheo. No impone ningún framework sobre el código.

Si prefieres prescindir de Vite, el sitio funciona igual sirviendo la carpeta con
cualquier servidor estático: no hay nada que transpilar. Lo único que no funciona
es abrir `index.html` con doble clic, porque las rutas de los recursos son
absolutas (`/img/...`) y `file://` no las resuelve.

## Puesta en marcha

```bash
npm install
npm run dev      # http://localhost:5173
```

## Compilar para producción

```bash
npm run build    # genera dist/
npm run preview  # sirve dist/ para revisarlo antes de publicar
```

Sube el contenido de `dist/` a cualquier hosting estático (Netlify, Vercel,
GitHub Pages, Cloudflare Pages o un hosting tradicional por FTP).

> Si publicas bajo un subdirectorio —por ejemplo `usuario.github.io/ap-servicios-web/`—
> cambia `base` en `vite.config.js` a `'/ap-servicios-web/'` y vuelve a compilar.
> Con `base: '/'` las rutas absolutas apuntarían a la raíz del dominio y los
> recursos darían 404.

## Estructura

```
ap-servicios-web/
├── index.html              Marcado completo. Los iconos van como SVG en línea.
├── package.json
├── vite.config.js
├── .editorconfig
├── .gitignore
├── src/
│   ├── styles/
│   │   └── main.css        Todos los estilos (~32 KB)
│   └── js/
│       └── main.js         Toda la lógica (~12 KB)
└── public/                 Se copia tal cual a dist/, conservando las rutas
    ├── img/
    │   ├── hero-1.jpg      Fotos del carrusel de portada
    │   ├── hero-2.jpg
    │   ├── hero-3.jpg
    │   ├── hero-4.jpg
    │   ├── nosotros.jpg    Sección "Quiénes Somos"
    │   ├── cta.jpg         Franja de contacto
    │   └── servicios/      Una foto por línea de servicio (1200x675)
    │       ├── 01-construccion.jpg    07-fletes.jpg
    │       ├── 02-techos.jpg          08-suministro.jpg
    │       ├── 03-pisos.jpg           09-planos.jpg
    │       ├── 04-mantenimiento.jpg   10-metalmecanica.jpg
    │       ├── 05-plomeria.jpg        11-jardineria.jpg
    │       └── 06-electricos.jpg
    ├── logo-blanco.png     Logo para fondos oscuros (cabecera y pie)
    ├── logo.png            Logo en color de marca, para fondos claros
    ├── favicon.ico
    ├── favicon.png
    ├── apple-touch-icon.png
    └── og-image.jpg        Vista previa al compartir el enlace
```

## Qué hace el JavaScript

Todo vive en `src/js/main.js`, dentro de una IIFE, sin dependencias externas:

- **Carrusel de portada.** Cuatro fotos que se acercan lentamente (escala 1.02 →
  1.16 en 13 s) y se relevan con un fundido de 2 s. Se detiene solo si la pestaña
  se oculta o la portada sale de pantalla, y respeta `prefers-reduced-motion`.
  Las fotos 2 a 4 se cargan después del `load` para no frenar la primera pintada.
- **Cabecera** que cambia de fondo al bajar, y menú lateral en móvil.
- **Aparición progresiva** de secciones con `IntersectionObserver`.
- **Contadores** de la portada, animados una sola vez al entrar en pantalla.
- **Formulario de cotización.** Ver más abajo.
- **Año del pie**, calculado en tiempo de ejecución.

## Decisiones de diseño

- **Color de marca `#73101D`**, medido sobre el logo original.
- **Fotos a color, sin tinte.** La legibilidad del texto blanco la da un velo
  neutro (`rgba(10,12,15,…)`), nunca un degradado del color de marca.
- **Iconos como SVG en línea**, no una fuente de iconos: no hay CDN ni petición
  extra, y no dependen de que cargue una fuente para verse.
- **Tipografías** Barlow Condensed e Inter, desde Google Fonts. Es el único
  recurso externo del sitio.

## El formulario de cotización

Al ser un sitio estático no hay backend que reciba el POST. El formulario arma
el mensaje con todos los campos y abre **WhatsApp** al número de AP Servicios.

Para cambiarlo a correo, edita estas tres constantes en `src/js/main.js`:

```js
const WHATSAPP = '50764914987';   // +507 6491-4987
const EMAIL    = '';              // pendiente: correo de AP Servicios
const DESTINO  = 'whatsapp';      // 'whatsapp' | 'correo'
```

Si algún día hay backend, el punto de cambio es el `addEventListener('submit', …)`
del final del archivo.

## Contenido del sitio

El sitio cubre las **11 líneas de servicio** de AP Servicios, cada una con su
propia foto de cabecera: construcción y adecuaciones, techos y cubiertas, pisos
epóxicos, mantenimiento de instalaciones, plomería, servicios eléctricos, fletes
y logística, compras y suministro industrial, planos y modelado 3D, fabricación
metálica y herrería, y jardinería.

Incluye además una sección de **certificaciones y personal calificado**
(electricistas con licencia vigente, trabajos en altura y espacios confinados,
operadores de equipos de elevación y formación continua).

## Créditos de las imágenes

Portada y secciones generales: [Unsplash](https://unsplash.com) y
[Pexels](https://pexels.com), bajo licencias que permiten el uso comercial.
Iconos de [Font Awesome Free 6](https://fontawesome.com) (CC BY 4.0), incrustados
como SVG.

> **Fotos de servicios.** Las once imágenes de `public/img/servicios/` provienen
> del documento del cliente. La de fletes venía con marca de agua de 123RF y fue
> sustituida por una equivalente de Pexels. **Conviene confirmar la procedencia y
> licencia de las diez restantes antes de publicar el sitio**, ya que llegaron sin
> atribución.

## Pendiente

- **Redes sociales.** Hay un comentario en el pie de `index.html` con el formato
  exacto para reponer los enlaces de Facebook, Instagram y LinkedIn.
- **Correo corporativo**, si se prefiere que el formulario llegue ahí.
