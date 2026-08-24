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
