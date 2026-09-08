/**
 * ValkiriaCloud — Solicitudes de Privacidad
 * Recibe el formulario de https://valkiriacloud.com/eliminacion-datos/,
 * lo registra en Google Sheets y notifica por correo.
 *
 * Configuración: Script Properties (Configuración del proyecto → Propiedades).
 *   SPREADSHEET_ID      obligatorio  ID del Google Sheet de destino
 *   NOTIFICATION_EMAIL  opcional     por defecto info@valkiriacloud.com
 *   SEND_CONFIRMATION   opcional     "true" (por defecto) | "false"
 *
 * No escribir secretos en este archivo: se versiona en un repositorio público.
 */

var SHEET_NAME = 'Solicitudes';
var DEFAULT_NOTIFICATION_EMAIL = 'info@valkiriacloud.com';
var TIMEZONE_CO = 'America/Bogota';

var HEADERS = [
  'ID',
  'Fecha UTC',
  'Fecha Colombia',
  'Nombre',
  'Correo',
  'Teléfono',
  'Empresa / ISP',
  'Referencia servicio / contrato',
  'Tipo de solicitud',
  'Descripción',
  'Estado',
  'Fecha de respuesta',
  'Observaciones',
  'Origen',
  'User-Agent'
];

var LIMITS = {
  nombre: 120,
  correo: 200,
  telefono: 40,
  empresa: 200,
  referencia: 100,
  descripcion: 3000,
  tipo: 80,
  origen: 500,
  userAgent: 500
};

var ALLOWED_TYPES = [
  'Eliminación / supresión de datos',
  'Consulta de datos',
  'Actualización o rectificación',
  'Revocación de autorización',
  'Información sobre el uso de mis datos',
  'Otra solicitud de privacidad'
];

/* -------------------------------------------------------------------------
   Entrada HTTP
   ------------------------------------------------------------------------- */

function doPost(e) {
  try {
    var params = parseRequest_(e);

    /* Honeypot: se acepta en silencio y no se registra nada. */
    if (trim_(params.website)) {
      return json_({ ok: true, id: 'VK-PRIV-IGNORED' });
    }

    if (!withinRateLimit_(params)) {
      return json_({ ok: false, error: 'Demasiadas solicitudes seguidas. Intenta de nuevo en unos minutos.' });
    }

    var data = normalize_(params, e);
    var invalid = validate_(data);
    if (invalid) {
      return json_({ ok: false, error: invalid });
    }

    data.id = buildId_();
    appendRow_(data);
    notifyTeam_(data);

    if (getProp_('SEND_CONFIRMATION', 'true') !== 'false') {
      sendConfirmation_(data);
    }

    return json_({ ok: true, id: data.id });
  } catch (err) {
    console.error('doPost falló: ' + (err && err.stack ? err.stack : err));
    return json_({ ok: false, error: 'No fue posible registrar la solicitud.' });
  }
}

/** Comprobación manual desde el navegador; no expone datos. */
function doGet() {
  return json_({ ok: true, service: 'ValkiriaCloud privacy requests', status: 'activo' });
}

/* -------------------------------------------------------------------------
   Lectura de la petición
   ------------------------------------------------------------------------- */

/**
 * El frontend envía text/plain con un cuerpo urlencoded para evitar el
 * preflight CORS, que Apps Script no responde. Se admite además el POST
 * de formulario clásico y JSON.
 */
function parseRequest_(e) {
  if (e && e.parameter && Object.keys(e.parameter).length) {
    return e.parameter;
  }
  var raw = e && e.postData ? e.postData.contents : '';
  if (!raw) return {};

  if (raw.charAt(0) === '{') {
    try { return JSON.parse(raw); } catch (ignored) { /* sigue como urlencoded */ }
  }

  var out = {};
  raw.split('&').forEach(function (pair) {
    if (!pair) return;
    var i = pair.indexOf('=');
    var key = i < 0 ? pair : pair.slice(0, i);
    var value = i < 0 ? '' : pair.slice(i + 1);
    try {
      out[decodeURIComponent(key.replace(/\+/g, ' '))] = decodeURIComponent(value.replace(/\+/g, ' '));
    } catch (ignored) { /* par malformado: se descarta */ }
  });
  return out;
}

function normalize_(p, e) {
  var ua = '';
  try { ua = (e && e.parameter && e.parameter.ua) || ''; } catch (ignored) { ua = ''; }
  return {
    nombre: cut_(trim_(p.nombre), LIMITS.nombre),
    correo: cut_(trim_(p.correo), LIMITS.correo),
    telefono: cut_(trim_(p.telefono), LIMITS.telefono),
    empresa: cut_(trim_(p.empresa), LIMITS.empresa),
    referencia: cut_(trim_(p.referencia), LIMITS.referencia),
    tipo: cut_(trim_(p.tipo), LIMITS.tipo),
    descripcion: cut_(trim_(p.descripcion), LIMITS.descripcion),
    confirmacion: trim_(p.confirmacion),
    origen: cut_(trim_(p.origen), LIMITS.origen),
    userAgent: cut_(trim_(p.userAgent || ua), LIMITS.userAgent)
  };
}

function validate_(d) {
  if (!d.nombre) return 'Falta el nombre completo.';
  if (!d.correo) return 'Falta el correo electrónico.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo)) return 'El correo electrónico no es válido.';
  if (!d.empresa) return 'Falta la empresa o ISP relacionada.';
  if (!d.tipo) return 'Falta el tipo de solicitud.';
  if (ALLOWED_TYPES.indexOf(d.tipo) === -1) return 'El tipo de solicitud no es válido.';
  if (!d.descripcion) return 'Falta la descripción de la solicitud.';
  if (!d.confirmacion) return 'Falta la confirmación del formulario.';
  return null;
}

/* -------------------------------------------------------------------------
   Persistencia
   ------------------------------------------------------------------------- */

function appendRow_(d) {
  var sheet = getSheet_();
  var now = new Date();
  sheet.appendRow([
    d.id,
    Utilities.formatDate(now, 'UTC', "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    Utilities.formatDate(now, TIMEZONE_CO, 'yyyy-MM-dd HH:mm:ss'),
    d.nombre,
    d.correo,
    d.telefono,
    d.empresa,
    d.referencia,
    d.tipo,
    d.descripcion,
    'RECIBIDA',
    '',
    '',
    d.origen,
    d.userAgent
  ]);
}

function getSheet_() {
  var id = getProp_('SPREADSHEET_ID', '');
  if (!id) {
    throw new Error('Falta la Script Property SPREADSHEET_ID.');
  }
  var book = SpreadsheetApp.openById(id);
  var sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/* -------------------------------------------------------------------------
   Correo
   ------------------------------------------------------------------------- */

function notifyTeam_(d) {
  var to = getProp_('NOTIFICATION_EMAIL', DEFAULT_NOTIFICATION_EMAIL);
  var subject = '[ValkiriaCloud][Privacidad][' + d.id + '] ' + d.tipo + ' — ' + d.empresa;

  /* Cuerpo en texto plano: el contenido lo escribe el solicitante y no debe
     interpretarse como marcado. */
  var body = [
    'Nueva solicitud de privacidad recibida desde valkiriacloud.com',
    '',
    'ID de solicitud : ' + d.id,
    'Fecha (Colombia): ' + Utilities.formatDate(new Date(), TIMEZONE_CO, 'yyyy-MM-dd HH:mm:ss'),
    'Nombre          : ' + d.nombre,
    'Correo          : ' + d.correo,
    'Teléfono        : ' + (d.telefono || '(no indicado)'),
    'Empresa / ISP   : ' + d.empresa,
    'Referencia      : ' + (d.referencia || '(no indicada)'),
    'Tipo            : ' + d.tipo,
    'Origen          : ' + (d.origen || '(no indicado)'),
    '',
    'Descripción:',
    d.descripcion,
    '',
    '---',
    'Estado inicial: RECIBIDA',
    'Registrada en la hoja «' + SHEET_NAME + '».'
  ].join('\n');

  MailApp.sendEmail({
    to: to,
    subject: subject,
    body: body,
    replyTo: d.correo,
    name: 'ValkiriaCloud'
  });
}

function sendConfirmation_(d) {
  var body = [
    'Hola ' + d.nombre + ',',
    '',
    'Recibimos tu solicitud de privacidad relacionada con ' + d.empresa + '.',
    '',
    'Número de referencia: ' + d.id,
    'Tipo de solicitud   : ' + d.tipo,
    '',
    'Tu solicitud será revisada y atendida dentro de los plazos previstos por la',
    'normativa colombiana de protección de datos personales que resulte aplicable.',
    'Si necesitamos verificar tu identidad o localizar la información, te',
    'contactaremos por este mismo correo.',
    '',
    'Para hacer seguimiento, responde a este mensaje o escríbenos a',
    DEFAULT_NOTIFICATION_EMAIL + ' citando el número de referencia.',
    '',
    'VALKIRIA TECHNOLOGY S.A.S.',
    'Cali, Valle del Cauca, Colombia',
    'https://valkiriacloud.com/privacidad/'
  ].join('\n');

  try {
    MailApp.sendEmail({
      to: d.correo,
      subject: 'Recibimos tu solicitud de privacidad — ' + d.id,
      body: body,
      name: 'ValkiriaCloud'
    });
  } catch (err) {
    /* Un fallo en la confirmación no debe perder la solicitud ya registrada. */
    console.warn('No se pudo enviar la confirmación: ' + err);
  }
}

/* -------------------------------------------------------------------------
   Utilidades
   ------------------------------------------------------------------------- */

/**
 * Defensa básica contra envíos repetidos desde el mismo correo.
 * No sustituye un WAF ni un control antiabuso completo.
 */
function withinRateLimit_(params) {
  try {
    var key = 'rl_' + Utilities.base64EncodeWebSafe(trim_(params.correo).toLowerCase()).slice(0, 40);
    var cache = CacheService.getScriptCache();
    var count = Number(cache.get(key) || 0);
    if (count >= 5) return false;
    cache.put(key, String(count + 1), 600); /* ventana de 10 minutos */
    return true;
  } catch (ignored) {
    return true;
  }
}

function buildId_() {
  var stamp = Utilities.formatDate(new Date(), TIMEZONE_CO, 'yyyyMMdd');
  var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; /* sin I, O, 0, 1 */
  var suffix = '';
  for (var i = 0; i < 6; i++) {
    suffix += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return 'VK-PRIV-' + stamp + '-' + suffix;
}

function getProp_(name, fallback) {
  var value = PropertiesService.getScriptProperties().getProperty(name);
  return value === null || value === '' ? fallback : value;
}

function trim_(value) {
  return value === undefined || value === null ? '' : String(value).trim();
}

function cut_(value, max) {
  return value.length > max ? value.slice(0, max) : value;
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/* -------------------------------------------------------------------------
   Prueba manual: ejecutar desde el editor tras configurar las propiedades.
   ------------------------------------------------------------------------- */
function pruebaManual() {
  var res = doPost({
    parameter: {
      nombre: 'Prueba Ficticia',
      correo: 'prueba@example.com',
      telefono: '+57 300 0000000',
      empresa: 'ISP de prueba',
      referencia: 'CT-0000',
      tipo: 'Eliminación / supresión de datos',
      descripcion: 'Solicitud de prueba generada desde el editor de Apps Script.',
      confirmacion: 'si',
      origen: 'prueba-manual'
    }
  });
  console.log(res.getContent());
}
