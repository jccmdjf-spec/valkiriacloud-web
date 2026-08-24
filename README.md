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

La web es actualmente una landing page estática servida directamente por Nginx.

Archivo productivo principal:

/var/www/valkiria/index.html

## Repositorio de trabajo

/home/ultranet/valkiriacloud-web

El directorio /var/www/valkiria no se utiliza como repositorio Git.

## Flujo objetivo

Local / Claude / Codex -> GitHub -> servidor -> /var/www/valkiria

## Seguridad

No versionar credenciales, secretos, archivos .env, llaves SSH, tokens, backups ni archivos temporales del servidor.
