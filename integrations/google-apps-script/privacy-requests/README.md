# Solicitudes de Privacidad — Google Apps Script

Backend del formulario de [`/eliminacion-datos/`](../../../eliminacion-datos/index.html).
Recibe la solicitud, la registra en Google Sheets, notifica al equipo y devuelve
un identificador de seguimiento.

> **Estado:** el código está listo. El Web App **no está desplegado** todavía,
> porque desplegarlo requiere acceso a la cuenta de Google Workspace del
> propietario. Mientras tanto, la página muestra el correo
> `info@valkiriacloud.com` como canal alternativo, que es igualmente válido.

## Qué hace

1. Recibe un `POST` del formulario público.
2. Descarta en silencio los envíos que rellenan el campo trampa `website`.
3. Valida campos obligatorios, tipos permitidos y longitudes máximas.
4. Genera un ID con formato `VK-PRIV-AAAAMMDD-XXXXXX`.
5. Añade una fila a la hoja `Solicitudes` con estado `RECIBIDA`.
6. Envía el aviso a `info@valkiriacloud.com` con `replyTo` del solicitante.
7. Envía una confirmación al solicitante con su ID.
8. Devuelve `{"ok": true, "id": "VK-PRIV-..."}`.

## Instalación

### 1. Crear el proyecto

Entra en [script.google.com](https://script.google.com) con la cuenta de
Google Workspace de Valkiria y crea un proyecto nuevo llamado:

```
ValkiriaCloud - Solicitudes de Privacidad
```

### 2. Pegar el código

Sustituye el contenido de `Código.gs` por el de [`Code.gs`](Code.gs).

### 3. Crear la hoja de cálculo

Crea un Google Sheet llamado exactamente:

```
Solicitudes Privacidad ValkiriaCloud
```

No hace falta crear las columnas a mano: la primera solicitud crea la hoja
`Solicitudes`, escribe la cabecera en negrita y congela la primera fila.

### 4. Copiar el Spreadsheet ID

Es el tramo de la URL entre `/d/` y `/edit`:

```
https://docs.google.com/spreadsheets/d/AQUI_VA_EL_ID/edit
```

### 5. Configurar las propiedades del script

En el editor: **Configuración del proyecto → Propiedades del script →
Añadir propiedad**.

| Propiedad | Obligatoria | Valor |
| --- | --- | --- |
| `SPREADSHEET_ID` | Sí | El ID del paso 4 |
| `NOTIFICATION_EMAIL` | No | `info@valkiriacloud.com` (valor por defecto) |
| `SEND_CONFIRMATION` | No | `true` por defecto; `false` desactiva el acuse al solicitante |

Estas propiedades viven en el proyecto de Apps Script, **no en el repositorio**.

### 6. Desplegar como aplicación web

**Implementar → Nueva implementación → Aplicación web.**

| Campo | Valor |
| --- | --- |
| Descripción | `Solicitudes de privacidad v1` |
| Ejecutar como | **Yo** (la cuenta propietaria) |
| Quién tiene acceso | **Cualquier usuario** |

«Cualquier usuario» es el acceso mínimo que permite recibir solicitudes de
visitantes no autenticados, que es justo el caso de un formulario público de
derechos del titular. La primera vez Google pedirá autorizar los permisos de
Sheets y de envío de correo.

### 7. Copiar la URL

Copia la URL que termina en `/exec`:

```
https://script.google.com/macros/s/AKfycb.../exec
```

### 8. Conectar el frontend

En [`assets/js/privacy-request.js`](../../../assets/js/privacy-request.js),
sustituye:

```js
var APPS_SCRIPT_ENDPOINT = "PENDIENTE_CONFIGURACION";
```

por la URL del paso 7. Haz commit y despliega.

> La URL del Web App **no es un secreto**: queda visible en el JavaScript
> público. Por eso toda la validación se hace en el servidor. **No añadas
> tokens ni claves al frontend.**

### 9. Probar

1. Abre `https://valkiriacloud.com/eliminacion-datos/`.
2. Envía una solicitud con **datos ficticios**.
3. Verifica los cuatro resultados:
   - la fila nueva en la hoja `Solicitudes` con estado `RECIBIDA`;
   - el correo en `info@valkiriacloud.com` con el ID en el asunto;
   - el correo de confirmación en la dirección de prueba;
   - el ID mostrado en la página.
4. Borra la fila de prueba.

También puedes ejecutar `pruebaManual()` desde el editor sin pasar por la web.

## Esquema de la hoja `Solicitudes`

| # | Columna | Origen |
| --- | --- | --- |
| 1 | ID | Generado (`VK-PRIV-AAAAMMDD-XXXXXX`) |
| 2 | Fecha UTC | Generado (ISO 8601) |
| 3 | Fecha Colombia | Generado (`America/Bogota`) |
| 4 | Nombre | Formulario (obligatorio) |
| 5 | Correo | Formulario (obligatorio) |
| 6 | Teléfono | Formulario (opcional) |
| 7 | Empresa / ISP | Formulario (obligatorio) |
| 8 | Referencia servicio / contrato | Formulario (opcional) |
| 9 | Tipo de solicitud | Formulario (lista cerrada) |
| 10 | Descripción | Formulario (obligatorio) |
| 11 | Estado | `RECIBIDA` al crearse; se actualiza a mano |
| 12 | Fecha de respuesta | Se completa a mano |
| 13 | Observaciones | Se completa a mano |
| 14 | Origen | URL desde la que se envió |
| 15 | User-Agent | Navegador, si el cliente lo aporta |

Las columnas 11 a 13 son de gestión interna: el script no las sobrescribe.

## Seguridad implementada

| Control | Detalle |
| --- | --- |
| Campo trampa | `website`; si llega con contenido, se responde `ok` y no se registra nada |
| Longitudes | nombre 120 · correo 200 · empresa 200 · teléfono 40 · referencia 100 · descripción 3000 |
| Tipos permitidos | Lista cerrada; cualquier otro valor se rechaza |
| Correo | Validación de formato en cliente y en servidor |
| Escape | Los correos se envían en **texto plano**; el contenido del usuario nunca se interpreta como HTML |
| Límite de frecuencia | `CacheService`: 5 envíos por correo cada 10 minutos |

Estos controles son una defensa básica y proporcionada al riesgo del
formulario. **No sustituyen un WAF ni un sistema antiabuso completo.**

## Datos que no van en el repositorio

No se versionan `SPREADSHEET_ID`, direcciones internas, tokens, App Secret de
Meta, claves privadas ni exportaciones de la hoja.
