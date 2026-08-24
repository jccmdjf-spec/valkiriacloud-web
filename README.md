# ValkiriaCloud Web

Sitio web público de ValkiriaCloud.

## Dominios

- http://valkiriacloud.com
- http://www.valkiriacloud.com

HTTPS está pendiente de corrección porque el certificado actual no coincide con www.valkiriacloud.com.

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
index.html
assets/
  css/site.css
  js/site.js
  img/favicon.svg
  img/valkiria-isotipo.svg
```

Raíz productiva:

/var/www/valkiria/

Al desplegar hay que copiar `index.html` **y** el directorio `assets/`; el
HTML referencia las hojas de estilo y el script por ruta relativa.

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

Local / Claude / Codex -> GitHub -> servidor -> /var/www/valkiria

## Seguridad

No versionar credenciales, secretos, archivos .env, llaves SSH, tokens, backups ni archivos temporales del servidor.
