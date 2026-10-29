# ValkiriaCloud Web — guía para agentes

Sitio estático público de **VALKIRIA TECHNOLOGY / ValkiriaCloud — Plataforma ISP SaaS**.
Sin build ni dependencias: se sirve tal cual con Nginx. El runbook completo vive en
[`docs/OPERATIONS.md`](docs/OPERATIONS.md); léelo antes de auditar o desplegar.

## Reglas rápidas

- `GitHub/main` es la autoridad. Cadena: local → GitHub → servidor → `/var/www/valkiria`.
- Producción: `45.196.223.3`, SSH `52200`, usuario `ultranet`, checkout
  `/home/ultranet/valkiriacloud-web`. Sitio: `https://valkiriacloud.com` y `www`.
- Fuente funcional `jccmdjf-spec/ultranet-isp-v3`: **solo lectura**, nunca modificar.
- La validación visual se hace sobre la URL pública. No pedir al propietario que
  levante localhost.
- Marca pública: VALKIRIA TECHNOLOGY · ValkiriaCloud · Plataforma ISP SaaS.
  Nunca UltraNet ISP, `ultranet-isp-v3` ni NetControl.
- Dirección visual Enterprise 80/15/5 (blanco · navy · ámbar). Ver `docs/BRANDING.md`.
- Sin claims inventados; verificar contra `ultranet-isp-v3` (`docs/PRODUCT_SOURCE_MAP.md`).

## Autonomía

**Sin preguntar:** auditar, corregir HTML/CSS/JS/assets/legales/docs/`Code.gs`/README,
QA en la URL pública con el navegador integrado, commit con staging explícito y push
fast-forward a `main`, y preparar los comandos de servidor.

**Pedir al propietario:** entrar por SSH (solo contraseña; no la introduzcas ni pruebes
otras llaves: entrega los comandos y que los ejecute), el envío real de prueba del
formulario (correos reales + hoja de Google), la aprobación visual, y cualquier cambio
de claims, marca, Nginx, SSL, bases de datos, backend ISP o secretos.

**STOP y reportar:** preflight local ≠ `main` limpio con `HEAD...origin/main = 0 0`,
cambios inesperados en el servidor, `origin/main` adelantado antes del push, Apps Script
que no responde `"ok":true`, o un secreto real en Git.

**Nunca sin orden expresa:** `git reset --hard`, `clean -fd`, `stash`, `restore`,
`merge`, `rebase`, force-push, `git add .`.

## Orden de trabajo

1. Preflight local y comparación `LOCAL = origin/main = SERVER`.
2. Auditoría + QA público (1440, 1280, 1024, 390; overflow, texto ≥ 13 px, consola, 404).
3. Si hay cambios: `git diff --check`, `git add -- <archivos>`, commit, push.
4. Servidor (lo corre el propietario): preflight → backup → `git pull --ff-only` →
   `cp -a` de `index.html`, `assets`, `privacidad`, `terminos`, `eliminacion-datos` →
   `nginx -t`. Si no hay cambios y todo coincide, no hace falta publicar.
5. Validación pública con `curl` y entrega con el bloque de variables de la TASK.

Estado no comprobado → `NO_VERIFICADO` u `OWNER_REQUIRED`; nunca inventar resultados.

## Seguridad

No versionar credenciales, tokens de Meta, App Secret, secretos de Apps Script,
contraseñas SMTP, llaves SSH ni `.env`. La URL del Web App de Apps Script es pública
por diseño. En el web root no se copian `.git`, `docs`, `integrations`, `README.md`
ni `CLAUDE.md`.
