# Operación, QA y despliegue

Runbook vigente del sitio público. Lo definió el propietario en
TASK-20261028-001 y se validó de extremo a extremo el 28 de octubre de 2026.
`CLAUDE.md` resume este documento; ante cualquier diferencia, manda este.

## Autoridad y cadena de publicación

`GitHub/main` es la autoridad. Todo lo demás debe converger a él:

```
Local → GitHub/main → checkout del servidor → /var/www/valkiria
      → https://valkiriacloud.com y https://www.valkiriacloud.com
```

| Elemento | Valor |
| --- | --- |
| Repositorio | `jccmdjf-spec/valkiriacloud-web` |
| Fuente funcional (solo lectura) | `jccmdjf-spec/ultranet-isp-v3` — no se modifica |
| Servidor | `45.196.223.3`, SSH `52200`, usuario `ultranet` |
| Checkout en servidor | `/home/ultranet/valkiriacloud-web` |
| Web root | `/var/www/valkiria` (no es un repo Git) |
| Nginx | `/etc/nginx/conf.d/valkiria-landing.conf` (copia en `docs/server/`) |
| Acceso a la plataforma | `https://isp.valkiriacloud.com` |

La validación visual final se hace sobre la URL pública. **No se pide levantar
localhost al propietario.**

## Qué puede hacer el agente sin preguntar

El propietario autorizó este flujo por adelantado, siempre que el QA esté verde:

- Auditar y leer cualquier archivo del repo y consultar la URL pública.
- Corregir HTML, CSS, JS, assets, páginas legales, docs, `Code.gs` versionado y README.
- Hacer commit con staging explícito y push a `main` (fast-forward, sin force).
- Preparar los comandos de servidor (backup, `git pull --ff-only`, copia de estáticos,
  `nginx -t`) y validar después por HTTP público.
- Usar el navegador integrado para QA sobre la URL pública.

## Qué requiere al propietario (o confirmación previa)

- **Entrar por SSH.** El servidor solo acepta contraseña desde la máquina del
  propietario; el agente no puede ni debe introducirla ni probar otras llaves.
  El propietario ejecuta los comandos que el agente le entregue y pega la salida.
- Prueba real del formulario: envía correos reales y escribe en la hoja de Google.
  Necesita una cuenta QA controlada; si no existe, se registra
  `FORM_SUBMIT_TEST=OWNER_REQUIRED` y las tres verificaciones de Workspace
  (`SHEET_ROW`, `TEAM_EMAIL`, `REQUESTER_CONFIRMATION`) quedan en `OWNER_REQUIRED`.
- Aprobación visual: `OWNER_VISUAL_APPROVAL=PENDING` es un estado final válido.
- Cambios de claims, marca (p. ej. «TECNOLOGY» vs «Technology», ver `BRANDING.md`),
  Nginx, SSL, certificados, bases de datos, backend ISP o `ultranet-isp-v3`.

## STOP: detener y reportar

- Preflight local distinto de: rama `main`, árbol limpio, `HEAD...origin/main = 0 0`.
- Cambios locales inesperados o commits por delante en el servidor.
- `origin/main` avanzó inesperadamente antes del push.
- El GET del Apps Script no devuelve `"ok":true`.
- Aparece un secreto real en Git (reportar ruta y tipo, sin reproducirlo).

## Comandos prohibidos sin orden expresa

`git reset --hard`, `git clean -fd`, `git stash`, `git restore`, `git merge`,
`git rebase`, force-push y `git add .` / `git add -A` (siempre
`git add -- <archivos>`).

## 1. Preflight local

```bash
git rev-parse --show-toplevel
git fetch origin
git branch --show-current
git status --short --branch
git rev-list --left-right --count HEAD...origin/main
git log -5 --oneline --decorate
```

## 2. Checklist de auditoría

- **Marca:** VALKIRIA TECHNOLOGY · ValkiriaCloud · Plataforma ISP SaaS. No usar
  UltraNet ISP, `ultranet-isp-v3` ni NetControl como marca pública (aparecen solo
  en README y `PRODUCT_SOURCE_MAP.md` como fuente funcional).
- **Dirección visual:** Enterprise, 80 % blanco/neutros · 15 % navy · 5 % ámbar.
  Sin dark full-page, gradientes, glow, glassmorphism, iconos gigantes ni cards por
  costumbre. Detalle en `BRANDING.md`. No rediseñar si no hace falta.
- **Claims:** no inventar; ante la duda, verificar contra `ultranet-isp-v3`
  (`PRODUCT_SOURCE_MAP.md`).
- **Redes** (`target="_blank" rel="noopener noreferrer"` y `aria-label`):
  - WhatsApp `https://wa.me/573334012896`
  - Instagram `https://www.instagram.com/valkiriacloud/`
  - Facebook `https://www.facebook.com/valkiriacloud`
- **Legales:** `/privacidad/`, `/terminos/`, `/eliminacion-datos/` responden 200 y
  tienen branding, footer, canonical, title, description y robots.
- **SEO:** title, description, canonical, Open Graph, Twitter, robots, favicon y
  JSON-LD en Home. No inventar `og:image`.
- **Accesibilidad:** `lang="es"`, un H1 por página, headings jerárquicos, labels,
  `aria-live`, focus visible, `alt`, no depender solo del color,
  `prefers-reduced-motion`.

### Formulario de privacidad (`/eliminacion-datos/`)

Campos: Nombre completo *, Documento de identidad *, Correo electrónico *,
Teléfono o WhatsApp, Número de servicio, contrato o referencia, Empresa / ISP
relacionada *, Tipo de solicitud *, Descripción *, Confirmación *.

- Documento y Empresa / ISP obligatorios. Referencia opcional **sin**
  «(opcional)» en la etiqueta.
- Checkbox alineado junto a su texto; texto funcional ≥ 13 px; sin overflow.
- `assets/js/privacy-request.js` apunta al Web App de Apps Script (URL pública por
  diseño, la validación real ocurre en el servidor):
  `https://script.google.com/macros/s/AKfycbykJJpQvqDvcra61gYAMF3q35hs_6F5jtBoXv1gSwU5N49oDrIM2eReKhpdXCm9IeXRfQ/exec`
- `integrations/google-apps-script/privacy-requests/Code.gs` debe conservar:
  validación de documento y empresa, `LockService`, `safeCell_`, `cleanLine_`,
  rate limit, honeypot, confirmación, `NOTIFICATION_EMAIL` e IDs `VK-PRIV-…`.
  Sin secretos: `SPREADSHEET_ID` y demás van en Script Properties.
- `docs/META_WHATSAPP_CONFIGURATION.md` conserva correo `info@valkiriacloud.com`,
  las tres URLs legales y el dominio `valkiriacloud.com`. Sin tokens ni App Secret.

### QA visual (sobre la URL pública)

Viewports 1440, 1280, 1024 y 390. Medir: overflow horizontal = 0 (un `-15` es la
barra de scroll, no overflow), nav móvil, hero, CTA, footer, redes, legales,
formulario, focus, contraste, targets táctiles, texto ≥ 13 px, consola JS sin
errores, enlaces rotos, assets 404. Al terminar, restablecer el viewport
(`resize_window` con preset `desktop`).

## 3. Verificación de producción (solo lectura)

```bash
for u in "/" "/privacidad/" "/terminos/" "/eliminacion-datos/"; do
  curl -sS -o /dev/null -w "$u = %{http_code}\n" "https://valkiriacloud.com$u"
done
curl -sS -o /dev/null -w 'WWW=%{http_code}\n' https://www.valkiriacloud.com/
for a in css/site.css js/site.js js/privacy-request.js img/favicon.svg img/valkiria-isotipo.svg; do
  curl -sS -o /dev/null -w "$a %{http_code}\n" "https://valkiriacloud.com/assets/$a"
done
curl -sSL "<URL del Apps Script>"   # {"ok":true,"service":"ValkiriaCloud privacy requests","status":"activo"}
```

Para detectar drift sin SSH, comparar el SHA-1 de cada archivo público contra el del
repo (normalizando CRLF con `tr -d '\r'`).

Verificar el endpoint en el JS público **sin asumir una sola línea** (la asignación
está partida en dos líneas):

```bash
curl -sS https://valkiriacloud.com/assets/js/privacy-request.js | tr -d '\n ' \
  | grep -cF "script.google.com/macros/s/AKfycbykJJpQvqDvcra61gYAMF3q35hs_6F5jtBoXv1gSwU5N49oDrIM2eReKhpdXCm9IeXRfQ/exec"
```

Formulario servido: deben aparecer «Documento de identidad», «Empresa / ISP
relacionada» y «Número de servicio, contrato o referencia», y **no** «referencia
(opcional)».

## 4. Commit y push

```bash
git diff --check
git diff --stat
git status --short --branch
git add -- archivo1 archivo2
git diff --cached --check
git diff --cached --stat
git commit            # sin commits vacíos
git fetch origin
git rev-list --left-right --count HEAD...origin/main   # debe seguir en N 0
git push origin main  # sin force
```

Mensaje sugerido para una validación sin cambios de producto:
`chore(web): valida y consolida producción ValkiriaCloud`.

## 5. Servidor (lo ejecuta el propietario por SSH)

Preflight, solo lectura:

```bash
cd /home/ultranet/valkiriacloud-web || exit 1
git status --short --branch
git fetch origin
git rev-list --left-right --count HEAD...origin/main
git log --oneline HEAD..origin/main
git log -3 --oneline --decorate
echo "SERVER_HEAD_SHA=$(git rev-parse HEAD)"
sudo nginx -t
for f in index.html privacidad/index.html terminos/index.html eliminacion-datos/index.html assets; do
  sudo diff -rq "$f" "/var/www/valkiria/$f" && echo "OK $f"
done
```

El servidor puede ir **detrás** de `origin/main`, nunca delante ni con drift
desconocido. Si `HEAD...origin/main = 0 0` y todos los `diff` dan OK, **no hace
falta backup, pull ni publicación**.

Si hay commits nuevos que publicar:

```bash
STAMP="$(date +%Y%m%d_%H%M%S)"
sudo tar -C /var/www -czf "/home/ultranet/valkiria_before_${STAMP}.tar.gz" valkiria
ls -lh "/home/ultranet/valkiria_before_${STAMP}.tar.gz"      # registrar la ruta

cd /home/ultranet/valkiriacloud-web || exit 1
git fetch origin
git pull --ff-only origin main
git rev-parse HEAD; git rev-parse origin/main                # deben coincidir

sudo cp -a index.html /var/www/valkiria/
sudo cp -a assets /var/www/valkiria/
sudo cp -a privacidad /var/www/valkiria/
sudo cp -a terminos /var/www/valkiria/
sudo cp -a eliminacion-datos /var/www/valkiria/
sudo nginx -t
```

No copiar al web root: `.git`, `docs`, `integrations`, `README.md`, `CLAUDE.md`.
No tocar Nginx ni SSL si ya están correctos. Después, repetir la sección 3.

## 6. Seguridad

Verificar que no haya en Git: credenciales de Google, secretos de Apps Script,
tokens o App Secret de Meta, contraseñas SMTP, llaves SSH privadas ni `.env`
reales. Si aparece uno real: STOP y reportar ruta y tipo sin reproducirlo.

## 7. Entrega final

Cerrar cada tarea con el bloque de variables de la TASK (`LOCAL_SHA_INICIAL`,
`ORIGIN_MAIN_SHA_INICIAL`, `SERVER_SHA_INICIAL`, `DRIFT_*`, `*_HTTP`, `QA_*`,
`FORM_SUBMIT_TEST`, `SECRETS_IN_GIT`, `DEPLOY`, `OWNER_VISUAL_APPROVAL`, …) y la
«definición de terminado». Nunca inventar resultados: lo no comprobado se marca
`NO_VERIFICADO` u `OWNER_REQUIRED`.

## Estado conocido (28-oct-2026)

- Local = GitHub = servidor = web root en `af6dee9`; HTTPS activo en `valkiriacloud.com`
  y `www`; `nginx -t` verde; Apps Script activo.
- Pendiente del propietario: aprobación visual y prueba funcional del formulario con
  cuenta QA (fila en la hoja, correo al equipo, confirmación al solicitante).
- Hallazgo menor abierto: `privacy-request.js` no envía `userAgent` y `Code.gs` lo lee
  de `e.parameter.ua`; la columna «User-Agent» de la hoja queda vacía.
