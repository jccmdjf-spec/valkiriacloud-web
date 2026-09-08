/* ValkiriaCloud — envío del formulario de solicitudes de privacidad.
   Sin dependencias. Mejora progresiva: si el endpoint no está configurado o
   falla, la página conserva la alternativa por correo, que es el canal oficial.

   IMPORTANTE: aquí no se guarda ningún secreto. La URL del Web App de Google
   Apps Script es pública por diseño; la validación real ocurre en el servidor. */
(function () {
  "use strict";

  /* Sustituir por la URL /exec del Web App cuando el propietario lo despliegue.
     Ver integrations/google-apps-script/privacy-requests/README.md */
  var APPS_SCRIPT_ENDPOINT = "PENDIENTE_CONFIGURACION";

  var CONTACT_EMAIL = "info@valkiriacloud.com";

  var LIMITS = {
    nombre: 120,
    correo: 200,
    telefono: 40,
    empresa: 200,
    referencia: 100,
    descripcion: 3000
  };

  var form = document.querySelector("[data-privacy-form]");
  if (!form) return;

  var status = form.querySelector("[data-form-status]");
  var submit = form.querySelector('button[type="submit"]');

  function setStatus(state, html) {
    if (!status) return;
    status.setAttribute("data-state", state);
    status.innerHTML = html;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function mailtoFallback() {
    return (
      ' Puedes escribirnos directamente a <a href="mailto:' +
      CONTACT_EMAIL +
      '">' +
      CONTACT_EMAIL +
      "</a> con los mismos datos y atenderemos tu solicitud por ese canal."
    );
  }

  /* Validación en cliente: complementa la del servidor, no la sustituye. */
  function validate(data) {
    var errors = [];
    if (!data.nombre) errors.push("el nombre completo");
    if (!data.correo) errors.push("el correo electrónico");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.correo)) errors.push("un correo electrónico válido");
    if (!data.empresa) errors.push("la empresa o ISP relacionada");
    if (!data.tipo) errors.push("el tipo de solicitud");
    if (!data.descripcion) errors.push("una descripción de tu solicitud");
    if (!data.confirmacion) errors.push("la confirmación del final del formulario");

    Object.keys(LIMITS).forEach(function (key) {
      if (data[key] && data[key].length > LIMITS[key]) {
        errors.push("un valor más corto en «" + key + "» (máximo " + LIMITS[key] + " caracteres)");
      }
    });
    return errors;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var fd = new FormData(form);
    var data = {
      nombre: (fd.get("nombre") || "").trim(),
      correo: (fd.get("correo") || "").trim(),
      telefono: (fd.get("telefono") || "").trim(),
      empresa: (fd.get("empresa") || "").trim(),
      referencia: (fd.get("referencia") || "").trim(),
      tipo: (fd.get("tipo") || "").trim(),
      descripcion: (fd.get("descripcion") || "").trim(),
      confirmacion: fd.get("confirmacion") ? "si" : "",
      website: (fd.get("website") || "").trim(),
      origen: window.location.href
    };

    /* Honeypot: un bot rellena el campo oculto. Se descarta en silencio,
       simulando éxito para no darle señal. */
    if (data.website) {
      setStatus("ok", "<strong>Solicitud recibida.</strong>");
      form.reset();
      return;
    }

    var errors = validate(data);
    if (errors.length) {
      setStatus(
        "error",
        "<strong>Faltan datos para enviar la solicitud.</strong> Indica " +
          escapeHtml(errors.join(", ")) +
          "."
      );
      var firstInvalid = form.querySelector("[required]:invalid, [aria-invalid='true']");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (APPS_SCRIPT_ENDPOINT === "PENDIENTE_CONFIGURACION") {
      setStatus(
        "error",
        "<strong>El envío automático todavía no está habilitado.</strong>" +
          mailtoFallback()
      );
      return;
    }

    submit.disabled = true;
    var originalLabel = submit.textContent;
    submit.textContent = "Enviando…";
    setStatus("sending", "Enviando tu solicitud…");

    var body = new URLSearchParams();
    Object.keys(data).forEach(function (key) {
      body.append(key, data[key]);
    });

    fetch(APPS_SCRIPT_ENDPOINT, {
      method: "POST",
      /* text/plain evita el preflight CORS que Apps Script no responde. */
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: body.toString()
    })
      .then(function (response) {
        return response.json().catch(function () {
          throw new Error("respuesta no válida");
        });
      })
      .then(function (result) {
        if (!result || result.ok !== true) {
          throw new Error((result && result.error) || "solicitud rechazada");
        }
        setStatus(
          "ok",
          "<strong>Recibimos tu solicitud.</strong> Te enviamos una confirmación a " +
            escapeHtml(data.correo) +
            ". Guarda este número de referencia para hacer seguimiento:" +
            '<span class="req-id">' +
            escapeHtml(result.id || "") +
            "</span>"
        );
        /* Solo se limpia el formulario tras un éxito confirmado. */
        form.reset();
      })
      .catch(function () {
        /* El contenido escrito se conserva a propósito. */
        setStatus(
          "error",
          "<strong>No pudimos enviar la solicitud.</strong> Tus datos siguen en el formulario, " +
            "puedes intentarlo de nuevo." +
            mailtoFallback()
        );
      })
      .then(function () {
        submit.disabled = false;
        submit.textContent = originalLabel;
      });
  });
})();
