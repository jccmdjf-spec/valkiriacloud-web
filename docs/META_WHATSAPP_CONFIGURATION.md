# Configuración de Meta — WhatsApp Business Platform

**TASK:** TASK-20260908-001
**Fecha:** 8 de septiembre de 2026
**Propósito:** reunir los valores públicos que Meta solicita al configurar la
aplicación de WhatsApp Business Platform, para no improvisarlos ni inventarlos
en el formulario de Meta.

> **Este archivo no contiene secretos.** No se versionan aquí el App Secret, los
> access tokens de WhatsApp, el verify token del webhook, claves privadas ni
> identificadores de cuenta. Esos valores viven únicamente en el panel de Meta y
> en la configuración del servidor.

## Valores para el panel de Meta

```
Correo de contacto:
info@valkiriacloud.com

Política de privacidad:
https://valkiriacloud.com/privacidad/

Condiciones del servicio:
https://valkiriacloud.com/terminos/

Eliminación de datos:
https://valkiriacloud.com/eliminacion-datos/

Dominio:
valkiriacloud.com
```

## Datos corporativos públicos

| Campo | Valor |
| --- | --- |
| Razón social | VALKIRIA TECHNOLOGY S.A.S. |
| Marca | VALKIRIA TECHNOLOGY |
| Producto | ValkiriaCloud — Plataforma ISP SaaS |
| Ciudad | Cali, Valle del Cauca, Colombia |
| Correo | `info@valkiriacloud.com` |
| Teléfono / WhatsApp | `+57 333 4012896` |
| Sitio web | `https://valkiriacloud.com` |

### Datos que **no** deben publicarse

- **NIT.** La fuente corporativa vigente indica que debe tramitarse ante la
  DIAN. No usar un valor temporal ni inventado. Cuando exista, se añade aquí y
  se revisa si procede publicarlo.
- **Dirección física exacta** de representantes o del domicilio. Para páginas
  públicas y para Meta basta con «Cali, Valle del Cauca, Colombia».

## Alcance real de la integración

La compañía usa Meta **únicamente** para:

- **WhatsApp Business Platform / WhatsApp API** — canal de atención, soporte,
  operación y notificaciones.

**No** se utiliza, y por tanto no debe declararse ni solicitarse en la
configuración de la app:

- Facebook Login o cualquier inicio de sesión social;
- Instagram Graph API;
- Facebook Graph API para perfiles;
- lectura de datos de perfiles de Facebook o Instagram.

La [Política de Privacidad](../privacidad/index.html) declara exactamente este
alcance. Si en el futuro se habilita otro producto de Meta, hay que actualizar
**primero** la política y luego la configuración.

## Perfiles públicos oficiales

| Red | Usuario | URL |
| --- | --- | --- |
| WhatsApp | `+57 333 4012896` | `https://wa.me/573334012896` |
| Instagram | `@valkiriacloud` | `https://www.instagram.com/valkiriacloud/` |
| Facebook | `valkiriacloud` | `https://www.facebook.com/valkiriacloud` |

Estos enlaces aparecen en el pie de todas las páginas y en el bloque de cierre
de la Home, como enlaces externos con `rel="noopener noreferrer"`. No se
incrustan píxeles ni widgets de terceros en el sitio.

## Requisitos que ya cumplen las URLs

Meta exige que las URLs de privacidad, condiciones y eliminación de datos sean
públicas, accesibles sin autenticación y servidas por HTTPS. Las tres cumplen:

- están en el dominio declarado;
- responden `200` sin sesión;
- se sirven por HTTPS con el certificado del dominio;
- llevan `robots: index, follow` y `canonical` propio.

## Verificación

```bash
curl -sS -o /dev/null -w 'PRIVACIDAD=%{http_code}\n' https://valkiriacloud.com/privacidad/
curl -sS -o /dev/null -w 'TERMINOS=%{http_code}\n'   https://valkiriacloud.com/terminos/
curl -sS -o /dev/null -w 'ELIMINACION=%{http_code}\n' https://valkiriacloud.com/eliminacion-datos/
```

Las tres deben responder `200`.

## Flujo de solicitudes de eliminación

Meta pide una URL donde el usuario pueda pedir la eliminación de sus datos. En
ValkiriaCloud esa URL es `/eliminacion-datos/`, que ofrece dos vías:

1. un **formulario** que registra la solicitud en Google Sheets, notifica a
   `info@valkiriacloud.com` y devuelve un número de referencia
   `VK-PRIV-AAAAMMDD-XXXXXX`;
2. el **correo** `info@valkiriacloud.com`, con la misma validez.

El backend del formulario está documentado en
[`integrations/google-apps-script/privacy-requests/README.md`](../integrations/google-apps-script/privacy-requests/README.md).

> **Estado:** el código del Web App está listo pero **no desplegado**; requiere
> la cuenta de Google Workspace del propietario. Mientras tanto la página
> muestra el canal de correo, que es suficiente para cumplir el requisito de
> Meta.

## Pendientes del propietario

1. Desplegar el Web App de Apps Script y pegar la URL `/exec` en
   `assets/js/privacy-request.js`.
2. Tramitar el NIT ante la DIAN y decidir si se publica.
3. Confirmar la ortografía de la marca: el logo dice «TECNOLOGY» y el texto del
   sitio dice «Technology».
