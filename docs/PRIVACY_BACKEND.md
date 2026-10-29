# Solicitudes de privacidad: recuperación y evolución

**TASK-20261029-001 · 29 de octubre de 2026**

## Incidente

Se eliminó la cuenta de Google Workspace `info@valkiriacloud.com`, que era la dueña del
proyecto de Apps Script y de la hoja de cálculo donde se registraban las solicitudes de
`/eliminacion-datos/`. Consecuencias:

- El formulario no puede registrar solicitudes (el `GET` del Web App sigue respondiendo
  «activo» porque `doGet` no usa la hoja ni el correo; **no es prueba de que funcione**).
- El buzón `info@valkiriacloud.com` ya no recibe correo, y es el contacto publicado en el
  sitio, en las páginas legales y en la configuración de Meta/WhatsApp.
- Las solicitudes recibidas hasta ahora viven en una hoja cuyo dueño ya no existe.

## Fase 0 — Recuperar (hacerlo primero, hay plazo)

Google Workspace permite **restaurar un usuario eliminado durante unos 20 días**, con su
buzón y su Drive. Lo hace un administrador del dominio:

1. `admin.google.com` → Directorio → Usuarios → **Usuarios eliminados recientemente**
   (o filtrar por «eliminados») → seleccionar `info@valkiriacloud.com` → **Restaurar**.
2. Confirmar que el buzón vuelve a recibir correo y que la hoja de solicitudes aparece en
   su Drive.
3. Si el Web App de Apps Script se despliega «como el propietario», puede reanudar el envío
   por sí solo al restaurar la cuenta. Probarlo con `pruebaManual()` desde el editor.
4. **Antes de cerrar el tema, evitar que se repita:** transferir la propiedad de la hoja y
   del proyecto de Apps Script a una cuenta que no se elimine (ver «Regla de propiedad»).
   Si se redespliega desde otra cuenta, la URL `/exec` cambia: actualizar
   `APPS_SCRIPT_ENDPOINT` en `assets/js/privacy-request.js` y publicar.

Si ya pasó el plazo, la información de esa hoja no es recuperable por esta vía: crear una
hoja nueva y seguir con la Fase 1.

## Fase 1 — Reactivar el formulario con Apps Script

Código versionado: `integrations/google-apps-script/privacy-requests/Code.gs` (sin
secretos). Con una cuenta **de la empresa**:

1. Crear la hoja de cálculo y copiar su ID.
2. Crear el proyecto de Apps Script, pegar `Code.gs` y definir las Script Properties
   `SPREADSHEET_ID` y, opcionalmente, `NOTIFICATION_EMAIL` y `SEND_CONFIRMATION`.
3. Ejecutar `pruebaManual()` y comprobar fila, correo al equipo y confirmación.
4. Implementar como aplicación web (ejecutar como el propietario; acceso: cualquiera).
5. Actualizar `APPS_SCRIPT_ENDPOINT` y publicar el sitio.

## Regla de propiedad (aplica a todo recurso de Google de la empresa)

- Ningún recurso productivo (hoja, script, formulario, carpeta) pertenece a un buzón
  personal ni a uno que pueda eliminarse. Debe tener un **propietario de empresa** y, como
  mínimo, un segundo editor.
- Antes de eliminar o reasignar una cuenta: transferir la propiedad de sus archivos y
  revisar sus scripts desplegados, correos de respaldo y reglas de reenvío.
- Tras cualquier cambio de propietario o de cuenta: probar el formulario de extremo a extremo.

## Fase 2 — Backend propio y lista de supresión (propuesta, sin implementar)

Idea del propietario: que los números y correos de quienes revocan o piden eliminación
**dejen de recibir mensajes** de las plataformas. Una hoja de Google no es la base adecuada
para eso; hace falta un registro propio que las plataformas puedan consultar.

**Componentes**

- Endpoint propio detrás de Nginx (p. ej. `POST /api/privacidad/solicitudes`) que sustituye
  al Web App de Apps Script. Misma validación, honeypot y límite de frecuencia que `Code.gs`.
- Tabla `solicitudes_privacidad`: id público `VK-PRIV-…`, fechas, datos del titular, tipo,
  descripción, estado (`RECIBIDA → VERIFICADA → ATENDIDA | RECHAZADA`) y observaciones.
- Tabla `supresiones`: `empresa`, `canal` (`whatsapp` | `email`), valor normalizado
  (teléfono en E.164, correo en minúsculas), `solicitud_id`, motivo y fecha.
- API de consulta para las plataformas (autenticada por nodo o token de servicio), por
  ejemplo «¿puedo enviar a este destinatario?», que el módulo de notificaciones debe llamar
  **antes** de cada envío por WhatsApp o correo.

**Decisiones de diseño que conviene fijar antes de construir**

1. **No bloquear automáticamente al enviar el formulario.** Cualquiera podría escribir el
   número de otra persona. La supresión se crea cuando la solicitud pasa a `VERIFICADA`.
2. **Solo ciertos tipos suprimen:** revocación de autorización y eliminación. Una consulta
   o una rectificación no bloquean envíos.
3. **Por empresa, no global.** Cada ISP es el responsable de sus datos; hoy «Empresa / ISP»
   es texto libre. Para suprimir por empresa hay que convertirlo en una lista cerrada que
   coincida con las empresas de la plataforma (más «Otra / no sé»).
4. **Mensajes de servicio vs. comerciales.** Avisos de facturación o corte pueden tener una
   base contractual distinta a la de los mensajes promocionales. Definir con asesoría legal
   qué canales se bloquean para cada tipo de mensaje.
5. **Responsabilidad:** Valkiria actúa en muchos casos como encargada del tratamiento; la
   decisión final sobre una supresión puede corresponder a la empresa ISP. El flujo debe
   permitirle a esta confirmar o rechazar.
6. **Retención:** la lista de supresión debe conservar el dato mínimo necesario para seguir
   bloqueando (idealmente un hash del destinatario), no el expediente completo.

**Dónde vive cada parte**

- Este repositorio (sitio estático): el formulario y su documentación.
- El consumo de la lista de supresión por el módulo de WhatsApp/correo es cambio de la
  plataforma ISP (`ultranet-isp-v3`, hoy solo lectura para este repo): tarea separada.
