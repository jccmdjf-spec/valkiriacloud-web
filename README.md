# ValkiriaCloud Web

Sitio web público de ValkiriaCloud, la marca paraguas de las aplicaciones de Valkiria
Technology. Hoy hay una aplicación disponible: la Plataforma ISP.

## Dominios

- https://valkiriacloud.com
- https://www.valkiriacloud.com

HTTP redirige (301) a HTTPS. Plataforma: https://isp.valkiriacloud.com.

La forma de trabajar (autoridad, QA, despliegue, qué puede hacer un agente sin
preguntar) está en [`docs/OPERATIONS.md`](docs/OPERATIONS.md); `CLAUDE.md` es su
resumen para agentes.

## Producción

- Servidor: 45.196.223.3
- SSH: puerto 52200
- Usuario operativo: ultranet
- Document root: /var/www/valkiria
- Configuración Nginx: /etc/nginx/conf.d/valkiria-landing.conf

## Arquitectura actual

La web es una landing page estática servida directamente por Nginx. No hay
build step, package manager ni dependencias externas: se sirve tal cual.

Estructura del sitio:

```
index.html                (marca paraguas)
aplicaciones/index.html   (hub: destino de «Ingresar»)
isp/index.html            (Plataforma ISP)
privacidad/index.html
terminos/index.html
eliminacion-datos/index.html
assets/
  css/site.css
  js/site.js
  js/privacy-request.js
  img/favicon.svg
  img/valkiria-isotipo.svg
integrations/google-apps-script/privacy-requests/   (no se publica)
docs/                                               (no se publica)
```

Raíz productiva:

/var/www/valkiria/

Al desplegar se copian `index.html`, `assets/`, `aplicaciones/`, `isp/`, `privacidad/`, `terminos/` y
`eliminacion-datos/`. No se copian `.git`, `docs`, `integrations`, `README.md` ni
`CLAUDE.md`. El procedimiento completo está en `docs/OPERATIONS.md`.

## Contenido y claims

Las afirmaciones publicadas en la Home se auditan contra el repositorio de
producto `jccmdjf-spec/ultranet-isp-v3`. La clasificación vigente vive en
[`docs/PRODUCT_SOURCE_MAP.md`](docs/PRODUCT_SOURCE_MAP.md).

No se publican cifras, estados comerciales por módulo, integraciones, SLA ni
capacidades técnicas sin evidencia en código o documentación vigente.

## Identidad visual

El logo, el favicon y la paleta se documentan en
[`docs/BRANDING.md`](docs/BRANDING.md), incluida la procedencia del isotipo y
los pendientes de marca.

## Repositorio de trabajo

/home/ultranet/valkiriacloud-web

El directorio /var/www/valkiria no se utiliza como repositorio Git.

## Flujo objetivo

Local / Claude / Codex -> GitHub/main -> servidor (`git pull --ff-only`) -> /var/www/valkiria

## Seguridad

No versionar credenciales, secretos, archivos .env, llaves SSH, tokens, backups ni archivos temporales del servidor.
