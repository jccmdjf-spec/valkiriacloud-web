/**
 * ValkiriaCloud — Solicitudes de Privacidad
 * Recibe el formulario de https://valkiriacloud.com/eliminacion-datos/,
 * lo registra en Google Sheets y notifica por correo.
 *
 * Script Properties (Configuración del proyecto → Propiedades):
 *   SPREADSHEET_ID      obligatorio
 *   NOTIFICATION_EMAIL  opcional, por defecto info@valkiriacloud.com
 *   SEND_CONFIRMATION   opcional, "true" (por defecto) | "false"
 *
 * No escribir secretos aquí: el archivo se versiona en un repositorio público.
 */

var SHEET_NAME = 'Solicitudes';
var DEFAULT_NOTIFICATION_EMAIL = 'info@valkiriacloud.com';
var TIMEZONE_CO = 'America/Bogota';

/** Orden canónico. Solo se aplica al crear una hoja nueva: sobre una hoja que
 *  ya existe, cada columna se localiza por el nombre de su encabezado. */
var HEADERS = [
  'ID',
  'Fecha UTC',
  'Fecha Colombia',
  'Nombre',
  'Documento',
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
  documento: 50,
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

    if (trim_(params.website)) {
      return json_({ ok: true, id: 'VK-PRIV-IGNORED' });
    }
    if (!withinRateLimit_(params)) {
      return json_({ ok: false, error: 'Demasiadas solicitudes seguidas. Intenta de nuevo en unos minutos.' });
    }

    var data = normalize_(params, e);
    var invalid = validate_(data);
    if (invalid) return json_({ ok: false, error: invalid });

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

function doGet() {
  return json_({ ok: true, service: 'ValkiriaCloud privacy requests', status: 'activo' });
}

/* -------------------------------------------------------------------------
   Lectura de la petición
   ------------------------------------------------------------------------- */

/** El frontend envía text/plain con cuerpo urlencoded para evitar el preflight
 *  CORS que Apps Script no responde. Se admite además form POST y JSON. */
function parseRequest_(e) {
  if (e && e.parameter && Object.keys(e.parameter).length) return e.parameter;

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
    } catch (ignored) { /* par malformado */ }
  });
  return out;
}

function normalize_(p, e) {
  var ua = '';
  try { ua = (e && e.parameter && e.parameter.ua) || ''; } catch (ignored) { ua = ''; }
  return {
    nombre: cut_(cleanLine_(p.nombre), LIMITS.nombre),
    documento: cut_(cleanLine_(p.documento), LIMITS.documento),
    correo: cut_(cleanLine_(p.correo), LIMITS.correo),
    telefono: cut_(cleanLine_(p.telefono), LIMITS.telefono),
    empresa: cut_(cleanLine_(p.empresa), LIMITS.empresa),
    referencia: cut_(cleanLine_(p.referencia), LIMITS.referencia),
    tipo: cut_(cleanLine_(p.tipo), LIMITS.tipo),
    descripcion: cut_(cleanText_(p.descripcion), LIMITS.descripcion),
    confirmacion: trim_(p.confirmacion),
    origen: cut_(cleanLine_(p.origen), LIMITS.origen),
    userAgent: cut_(cleanLine_(p.userAgent || ua), LIMITS.userAgent)
  };
}

function validate_(d) {
  if (!d.nombre) return 'Falta el nombre completo.';
  if (!d.documento) return 'Falta el documento de identidad.';
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

/**
 * Escribe la fila localizando cada columna por su encabezado, no por posición.
 * Así la hoja existente puede tener las columnas en cualquier orden sin que se
 * desalineen los valores ni se dupliquen encabezados.
 * El bloqueo evita que dos envíos simultáneos compitan por la misma fila.
 */
function appendRow_(d) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sheet = getSheet_();
    var headers = readHeaders_(sheet);
    var now = new Date();

    var values = {
      'ID': d.id,
      'Fecha UTC': Utilities.formatDate(now, 'UTC', "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'Fecha Colombia': Utilities.formatDate(now, TIMEZONE_CO, 'yyyy-MM-dd HH:mm:ss'),
      'Nombre': d.nombre,
      'Documento': d.documento,
      'Correo': d.correo,
      'Teléfono': d.telefono,
      'Empresa / ISP': d.empresa,
      'Referencia servicio / contrato': d.referencia,
      'Tipo de solicitud': d.tipo,
      'Descripción': d.descripcion,
      'Estado': 'RECIBIDA',
      'Fecha de respuesta': '',
      'Observaciones': '',
      'Origen': d.origen,
      'User-Agent': d.userAgent
    };

    var row = [];
    for (var i = 0; i < headers.length; i++) {
      var key = headers[i];
      row.push(Object.prototype.hasOwnProperty.call(values, key) ? safeCell_(values[key]) : '');
    }
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  var id = getProp_('SPREADSHEET_ID', '');
  if (!id) throw new Error('Falta la Script Property SPREADSHEET_ID.');

  var book = SpreadsheetApp.openById(id);
  var sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Devuelve los encabezados actuales. Si falta alguna columna canónica, la añade
 * al final en lugar de reordenar: ninguna columna existente se mueve ni se
 * duplica.
 */
function readHeaders_(sheet) {
  var width = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0].map(function (h) {
    return String(h).trim();
  });

  var missing = HEADERS.filter(function (h) { return headers.indexOf(h) === -1; });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length)
      .setValues([missing])
      .setFontWeight('bold');
    headers = headers.concat(missing);
  }
  return headers;
}

/* -------------------------------------------------------------------------
   Correo
   ------------------------------------------------------------------------- */

function notifyTeam_(d) {
  var to = getProp_('NOTIFICATION_EMAIL', DEFAULT_NOTIFICATION_EMAIL);
  var subject = '[ValkiriaCloud][Privacidad][' + d.id + '] ' + d.tipo + ' — ' + d.empresa;

  /* Texto plano: el contenido lo escribe el solicitante y no debe
     interpretarse como marcado. */
  var body = [
    'Nueva solicitud de privacidad recibida desde valkiriacloud.com',
    '',
    'ID de solicitud : ' + d.id,
    'Fecha (Colombia): ' + Utilities.formatDate(new Date(), TIMEZONE_CO, 'yyyy-MM-dd HH:mm:ss'),
    'Nombre          : ' + d.nombre,
    'Documento       : ' + d.documento,
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
  var contact = getProp_('NOTIFICATION_EMAIL', DEFAULT_NOTIFICATION_EMAIL);
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
    contact + ' citando el número de referencia.',
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
    /* Un fallo aquí no debe perder la solicitud ya registrada. */
    console.warn('No se pudo enviar la confirmación: ' + err);
  }
}

/* -------------------------------------------------------------------------
   Utilidades
   ------------------------------------------------------------------------- */

/** Defensa básica contra envíos repetidos. No sustituye un WAF. */
function withinRateLimit_(params) {
  try {
    var key = 'rl_' + Utilities.base64EncodeWebSafe(trim_(params.correo).toLowerCase()).slice(0, 40);
    var cache = CacheService.getScriptCache();
    var count = Number(cache.get(key) || 0);
    if (count >= 5) return false;
    cache.put(key, String(count + 1), 600);
    return true;
  } catch (ignored) {
    return true;
  }
}

function buildId_() {
  var stamp = Utilities.formatDate(new Date(), TIMEZONE_CO, 'yyyyMMdd');
  var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
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

/** Campo de una línea: quita controles y colapsa espacios. */
function cleanLine_(value) {
  return trim_(value)
    .replace(/[\x00-\x1F\x7F]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Campo multilínea: conserva los saltos y quita el resto de controles. */
function cleanText_(value) {
  return trim_(value)
    .replace(/\r\n?/g, '\n')
    .replace(/[\x00-\x09\x0B-\x1F\x7F]+/g, ' ');
}

function cut_(value, max) {
  return value.length > max ? value.slice(0, max) : value;
}

/**
 * Evita que Sheets interprete un valor del usuario como fórmula.
 * Un texto que empiece por = + - @ se antepone con apóstrofo.
 */
function safeCell_(value) {
  var s = value === undefined || value === null ? '' : String(value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/* -------------------------------------------------------------------------
   Prueba manual desde el editor, tras configurar las propiedades.
   ------------------------------------------------------------------------- */
function pruebaManual() {
  var res = doPost({
    parameter: {
      nombre: 'Prueba Ficticia',
      documento: 'TEST-0000000',
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
