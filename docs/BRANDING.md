# Branding visual del sitio público

**TASK:** TASK-20260824-002
**Fecha:** 24 de agosto de 2026
**Alcance:** logo, favicon y paleta de la Home pública.

## Origen del isotipo

El propietario entregó el logo de **Valkiria Technology** como imagen dentro de
la conversación, no como archivo en el repositorio. No fue posible incorporar el
binario original, así que el isotipo se **reprodujo como SVG vectorial** a partir
de esa imagen, conservando geometría, proporciones y colores.

Archivo: [`assets/img/valkiria-isotipo.svg`](../assets/img/valkiria-isotipo.svg)

- Tres galones descendentes anidados, con las proporciones del original.
- Los dos superiores en azul marino con pliegue central (ala izquierda más
  clara, ala derecha más profunda); el inferior en ámbar.
- Cada galón se dibuja completo y sobre él se superpone el ala izquierda, para
  evitar una costura de antialiasing en el vértice.
- `viewBox` 256×194 (relación 1,32:1).

**Pendiente del propietario:** entregar el archivo vectorial original
(AI/SVG/EPS). Si existe, debe reemplazar esta reproducción, que es fiel pero no
es el asset de origen.

## Uso del logo en el sitio

| Lugar | Tratamiento |
| --- | --- |
| Cabecera | Isotipo a 34×26 px + «ValkiriaCloud» en la tipografía del sitio. |
| Pie | Mismo bloque de marca que la cabecera. |
| Favicon | [`assets/img/favicon.svg`](../assets/img/favicon.svg) |

No se reproduce el logotipo completo (isotipo + palabra «VALKIRIA» + filete
ámbar + «TECNOLOGY») porque exigiría rehacer su tipografía, y una tipografía
aproximada sería un error de identidad. En su lugar, la cabecera combina el
isotipo real con el nombre del **producto**, que es lo que corresponde a un sitio
de producto: la marca corporativa aparece en el pie como texto.

El favicon usa una teja blanca con los colores reales del isotipo, para que sea
legible tanto en cromo claro como oscuro del navegador. Sus galones se engrosan
respecto al original **solo** para conservar nitidez a 16 px.

### Discrepancia detectada

El logo entregado dice **«TECNOLOGY»**. El texto del sitio y los briefs de
las TASK dicen **«Technology»**. No se corrigió ninguno de los dos por
iniciativa propia: el sitio conserva «Valkiria Technology» en texto, según el
brief. **Requiere decisión del propietario** sobre cuál es la forma correcta.

## Paleta

Derivada de los colores del logo. Un dominante, un acento, una familia de
neutros cálidos.

| Rol | Token | Valor | Uso |
| --- | --- | --- | --- |
| Dominante | `--navy-900` | `#16273F` | Texto principal, CTA primario, panel invertido |
| | `--navy-600` | `#2E5876` | Enlaces, eyebrow, iconos |
| | `--navy-500` | `#3A6786` | Galón claro del isotipo |
| Acento | `--amber-500` | `#E09A1F` | Filetes, borde superior de pasos, indicador activo |
| | `--amber-600` | `#8A5705` | Única variante ámbar usada como **texto** (AA sobre claro) |
| Fondo | `--bg` | `#FBFAF8` | Marfil: fondo dominante de página |
| Superficie | `--surface` | `#FFFFFF` | Tarjetas |
| Alterna | `--surface-2` | `#F4F2EE` | Secciones alternadas y pie |
| Borde | `--line` / `--line-strong` | `#E4E1DA` / `#CFCBC2` | |
| Texto | `--text` / `--text-2` / `--muted` | `#16273F` / `#3E4C5F` / `#5D6B7D` | |
| Estados | `--ok` / `--warn` / `--idle` | `#16794C` / `#8A5705` / `#6B7787` | Siempre con etiqueta textual, nunca solo color |

El ámbar de marca (`#E09A1F`) se reserva para filetes y elementos gráficos. Como
texto no alcanza AA sobre fondo claro, por eso existe `--amber-600`.

### Ritmo de secciones

Alternancia marfil → gris cálido → marfil. **No hay secciones oscuras a sangre.**
El único anclaje invertido es el panel de CTA final (navy contenido y
redondeado), que da contraste sin volver oscura la página.

## Rasgos de plantilla genérica retirados

- Fondo de página oscuro (`#070b12`) en toda la web.
- Glows radiales en el hero y en el CTA final.
- `backdrop-filter: blur()` en la cabecera (glassmorphism).
- Acentos cian (`#38bdf8`) y violeta (`#818cf8`), incluidos textos con degradado.
- 18 recuadros teñidos y redondeados alrededor de cada icono.
- Sombras negras profundas.

Verificado: **0 gradientes** y **0 `backdrop-filter`** en `assets/css/site.css`.

## Referencias revisadas

`MasuRii/ModernSaaS-LandingPage-Template` (sistema de tokens por escala
primitiva), `Blazity/next-saas-starter` (styled-components sin librería de UI),
`UniFolios/SaaSLand` (inversión de color como jerarquía, ritmo vertical amplio)
y `bear2u/my-skills → landing-page-guide-v2` (regla 60/30/10 y catálogo de
rasgos «AI genérico» a evitar).

De `landing-page-guide-v2` se adoptó la proporción 60/30/10 y el rechazo al
degradado violeta, pero **se descartó** deliberadamente su recomendación de
fondos ricos con mallas de degradado, ruido y capas: contradice la dirección
sobria pedida por el propietario.

## Contenido no tocado

Esta TASK no modificó claims, narrativa, estructura comercial ni CTA. La
auditoría vigente de afirmaciones sigue siendo
[`docs/PRODUCT_SOURCE_MAP.md`](PRODUCT_SOURCE_MAP.md).

---

# Dirección visual Enterprise — TASK-20260824-003

**Fecha:** 24 de agosto de 2026
**Estado:** vigente. **Sustituye la paleta y el tratamiento de secciones** descritos
más arriba (que quedan como registro histórico de la TASK-20260824-002). El
origen del isotipo y las salvedades de marca siguen vigentes sin cambios.

## Motivo

El propietario revisó la versión desplegada y la percepción seguía siendo la de
una plantilla SaaS/IA: cabecera demasiado oscura, iconos protagonistas, paleta
todavía «theme» y falta de presencia de empresa consolidada.

## Referencia primaria

`rampstackco/saas-landing-theme` — el llamado **Polished Standard**: las
convenciones que el lector ya sabe leer, de modo que nada en la página deba
aprenderse antes de poder evaluarse. Se trasladaron sus principios, no su código
ni su marca: fondos neutros limpios, un solo acento restringido, sombras bajo
0.12 de alpha, radios medios, ritmo generoso, escala tipográfica con distancia
real entre pasos y separación entre tokens, componentes y secciones.

Secundarias: `hannah-wright/saas-landing-page-template` (HTML semántico con
tokens centralizados), `themesberg/landwind` (secuencia clásica de marketing) y
`documenso/design` (disciplina de tokens y assets de marca).

Se **retiran** como guía estética `MasuRii/ModernSaaS-LandingPage-Template` y
`launch-ui/launch-ui`: su lenguaje (glow, mesh, glass, bento por costumbre) fue
rechazado por el propietario.

## Proporción de color 80 / 15 / 5

| Proporción | Rol | Valores |
| --- | --- | --- |
| ~80 % | Blanco y neutros muy claros | `--ground: #FFFFFF`, `--surface-muted: #F6F7F9` |
| ~15 % | Navy para texto y controles | `--ink: #16273F`, `--ink-muted: #4C5769`, `--ink-subtle: #5C6878`, `--brand: #16273F` |
| ~5 % | Ámbar como microdetalle | `--accent: #E09A1F` (filetes), `--accent-ink: #8A5705` (texto AA) |

Los beige de la versión anterior (`#FBFAF8`, `#F4F2EE`, `#ECE9E3`) se retiran:
varios tonos cálidos visibles se leían como efecto estético. Los neutros pasan a
la familia fría `#E4E7EC` / `#D0D5DD` / `#98A2B3`.

El navy **no** se usa para cabecera completa ni para secciones a sangre. Las
secciones se separan con **filete de 1 px**, no con bloques de color.

## Reglas duras

| Regla | Valor |
| --- | --- |
| Iconos ordinarios | `--icon: 20px`, `--icon-sm: 17px`. Tope 24 px. Sin contenedores de icono. |
| Excepción de tamaño | Isotipo corporativo (28 px alto) y visuales de producto. |
| Cabecera | Fondo `--ground` blanco, 72 px, filete inferior. Sin blur, sin glass, sin glow. |
| Secciones oscuras a sangre | 0 |
| Degradados / `backdrop-filter` | 0 |
| Sombras | Alpha máximo 0.10. Separan la superficie; no la hacen flotar. |
| Radios | 6 / 10 / 14 px. Sin pills salvo estados. |
| Contenedor | 1200 px |
| Ritmo de sección | `clamp(52px, 7vw, 112px)` |
| Ancho de lectura | `--measure: 66ch`; ningún párrafo supera 72ch |

## Uso de superficies

Las tarjetas desaparecen como recurso de composición: **0 usos de `.card`**. Una
superficie con borde y sombra se reserva para el **visual de producto**
(`.product`), que es un objeto independiente y sí la justifica.

Para explicar capacidades se usan filas narrativas alternadas (`.row`), listas de
puntos (`.points`), una franja de cobertura con divisores (`.coverage`), columnas
de texto (`.trust`) y una matriz de dos columnas con filetes (`.matrix`).

## Estructura de la Home

1. Cabecera clara.
2. Hero a dos columnas: eyebrow, H1, párrafo, dos CTA, y **un único** visual de producto.
3. Franja de cobertura: cuatro áreas con divisores, sin tarjetas.
4. Tres filas narrativas alternadas (operación, finanzas, logística).
5. Red e infraestructura: texto, lista compacta y flujo de tres pasos con filetes.
6. Confianza: cuatro columnas de texto con icono de 17 px.
7. Integraciones: matriz enterprise de dos columnas.
8. Preguntas: acordeón sobre filetes, sin decoración.
9. CTA final **claro**, con filete ámbar y botón navy. Sin panel oscuro.
10. Pie claro con filete superior.

## Favicon

`assets/img/favicon.svg` se rehízo. Diagnóstico: producción ya servía los tres
galones, pero el navegador conservaba en caché el favicon de la TASK-001 (la «V»)
porque el nombre de archivo nunca cambió. Dos correcciones:

- **Versionado del `href`** con `?v=20260824-003`, y ruta absoluta desde `/`,
  en `icon` y `shortcut icon`. También se versionan CSS, JS e isotipo.
- **Legibilidad a 16 px**: el mark pasa de ocupar el 56 % al 84 % de la teja y
  los galones se engrosan. Conserva los tres niveles, navy y ámbar. No es una
  letra ni un símbolo inventado.

## Antipatrones prohibidos en esta dirección

Fondo de página oscuro · cabecera navy o negra · secciones oscuras a sangre ·
degradados de malla · glow · glassmorphism · neón · contenedores de icono de 40,
48 o 64 px · iconos como protagonistas · una tarjeta por párrafo · bento por
costumbre · dashboard futurista · títulos de 80–100 px · varios tonos beige como
efecto.

## Criterio de aceptación

La página debe verse profesional **impresa en escala de grises**. Si una sección
no se siente adecuada, se corrige jerarquía, espaciado, tipografía, proporción o
composición — nunca añadiendo color, sombra, borde, iconos o tarjetas.
