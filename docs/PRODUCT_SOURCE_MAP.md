# PRODUCT_SOURCE_MAP — Auditoría de claims de la Home

**TASK:** TASK-20260823-001
**Fecha:** 23 de agosto de 2026
**Alcance:** claims publicados en `index.html` (landing anterior) frente al producto real.
**Fuente funcional (solo lectura):** `jccmdjf-spec/ultranet-isp-v3`.

## Método

Cada afirmación de la landing anterior se contrastó contra código vigente y
documentación vigente del repositorio de producto. El código activo tiene
prioridad sobre documentos históricos. Una mención documental no se convierte en
disponibilidad comercial.

Clasificación:

- `VERIFICADO` — existe evidencia directa en código o documentación vigente.
- `REQUIERE_VALIDACION` — hay evidencia parcial o el alcance comercial no está definido.
- `RETIRAR` — no se encontró evidencia, o la afirmación contradice la fuente.

## Fuentes consultadas

| Fuente | Uso |
| --- | --- |
| `README.md` | Plataforma, stack, capacidades e integraciones declaradas. |
| `PRODUCT.md` | Propósito, usuarios, posicionamiento, capacidades y principios. |
| `docs/ai/context/valkiriacloud-product-identity.md` | Identidad visible y contratos técnicos protegidos. |
| `docs/ai/context/project-master-context.md` | Arquitectura, multiempresa, integraciones, límites de evidencia. |
| `docs/ai/context/saas-module-summary.md` | Alcance SaaS y límites comerciales. |
| `docs/ai/context/priority-roadmap.md` | Estado de los frentes técnicos. |
| `docs/ai/context/valkiria-core-direct-integration.md` | Contrato de nodos Valkiria Core. |
| `.agents/skills/ultranet-ui-system/SKILL.md` | Lenguaje visual, antipatrones y piso tipográfico de 13 px. |
| `app/branding.py` | Marca visible, lema y dominio público. |
| `app/routes_*.py`, `app/mikrotik/`, `app/nuplin/`, `app/zte_*.py`, `app/security_catalog.py` | Módulos e integraciones reales. |
| `templates/` | Portales, logística, facturación y red. |

## Claims de la landing anterior

| # | Claim | Clasificación | Evidencia / decisión |
| --- | --- | --- | --- |
| 1 | «Valkiria Cloud» (dos palabras) | `RETIRAR` | La identidad canónica es `ValkiriaCloud`. Corregido en toda la Home. |
| 2 | «105+ clientes en producción» | `RETIRAR` | Sin fuente. Además sería el conteo de suscriptores de una empresa cliente, no de la plataforma. |
| 3 | «operando una red viva con cientos de clientes» | `RETIRAR` | Sin fuente verificable. |
| 4 | Badge `EN PRODUCCIÓN` en «Valkiria Core» y «Valkiria Cloud» | `REQUIERE_VALIDACION` | `README.md` declara la plataforma en producción y la integración Core «validada en producción». No existe una taxonomía de módulos comerciales con estados, así que se retiró el sistema de badges. |
| 5 | Badge `PRÓXIMAMENTE` en Valkiria Pay / Clientes / App / Field | `RETIRAR` | Cero coincidencias en el repositorio. Contradice la fuente: facturación, pagos, tickets, contratos digitales, instalaciones y portal técnico ya existen en código. El badge marcaba como futuro capacidades ya construidas. |
| 6 | Catálogo de submarcas «Valkiria Pay / Clientes / App / Field» | `RETIRAR` | No existen como productos. La marca visible es una sola: `ValkiriaCloud`. |
| 7 | «BGP y multihoming», «2 sesiones ESTABLECIDAS» | `RETIRAR` | Cero coincidencias de `bgp` en el repositorio de producto. |
| 8 | «Firewall nftables a nivel de kernel» | `RETIRAR` | Cero coincidencias de `nftables`. |
| 9 | «Motor de red a nivel de kernel — el panel no le pide cambios al router: los ejecuta en el sistema» | `RETIRAR` | Contradice el contrato vigente: Control conserva el estado declarativo y cada nodo lo aplica según su propio runtime. |
| 10 | «IPv6 nativo de fábrica», «nativo /32, bloque propio» | `RETIRAR` (reformulado) | Lo verificable es `Servicio.pppoe_ipv6_bloque`: bloque IPv6 por servicio PPPoE. Sin evidencia de bloque propio ni de /32. |
| 11 | «Gestión de VLANs» | `REQUIERE_VALIDACION` (reformulado) | `vlan` aparece en `app/mikrotik/` y `app/models.py`, asociado a la integración MikroTik. Se presenta dentro de esa integración, no como motor propio. |
| 12 | «Actualizaciones sin riesgo — el código viaja, tus datos nunca» | `RETIRAR` | Sin fuente para un mecanismo de actualización de nodos con esa garantía. |
| 13 | Terminal `valkiria>` con `NODO-CALI`, `Clientes en línea 105`, `VLANs 420, 400` | `RETIRAR` | Cifras y nombres de nodo inventados. Retirado por completo. |
| 14 | «24/7 red monitoreada» | `RETIRAR` | Sin evidencia de SLA, NOC ni monitoreo contratado. |
| 15 | «Hecho por un ISP, para ISPs» | `REQUIERE_VALIDACION` (reformulado) | `ULTRANET COLOMBIA SAS` consta como **empresa cliente**, no como fabricante. Reformulado a una intención de diseño verificable: la plataforma se diseña para operar (`PRODUCT.md`). |
| 16 | `https://app.valkiriacloud.com` | `RETIRAR` (reformulado) | Cero coincidencias. El dominio público oficial es `https://isp.valkiriacloud.com` (`app/branding.py`). Todos los accesos apuntan ahí. |
| 17 | `https://docs.valkiriacloud.com` | `RETIRAR` | Cero coincidencias y sin evidencia de que exista. Enlace eliminado del menú y del footer. |
| 18 | `info@ultranetcolombia.com` como contacto de marca | `REQUIERE_VALIDACION` | Es el dominio de una empresa cliente, no de la marca. Se conserva como único canal publicado hoy, sin atribuirlo a la marca. **Pendiente del propietario:** correo comercial propio. |
| 19 | «Del núcleo de la red al bolsillo del cliente» | `REQUIERE_VALIDACION` (reformulado) | Metáfora sin respaldo. Reformulada al alcance real: operación, red, finanzas y logística. |
| 20 | «Cortes automáticos por mora y reconexión inmediata al registrar el pago» | `VERIFICADO` (matizado) | `routes_cortes.py`, `PerfilCorte`, `corte_automatico.py`, `run_cortes.py`. Se retiró «inmediata» por no estar medida. |

## Capacidades verificadas usadas en la Home V1

| Capacidad | Evidencia |
| --- | --- |
| Clientes, servicios, planes y contratos | `routes_clientes.py`, `routes_servicios.py`, `routes_planes.py`, `routes_contratos.py` |
| Contratos digitales con firma en línea | `routes_contratos.py` (`/contratos/firma/{token}`, estado `firmado`, PDF) |
| Facturación, pagos, acuerdos de pago y comprobantes | `routes_facturacion.py`, `routes_facturas.py`, `payments.py`, `routes_acuerdos.py`, `routes_comprobantes.py` |
| Cortes por mora y perfiles de corte | `routes_cortes.py`, `PerfilCorte`, `run_cortes.py` |
| Cierres mensuales, gastos, finanzas y reportes | `routes_cierres_mensuales.py`, `routes_gastos.py`, `routes_finanzas.py`, `routes_reportes.py` |
| Pasarelas de pago configurables | `routes_pasarelas.py`: ComboPay, OnePay, MercadoPago, PayU |
| Recaudo Wispro (importación y conciliación) | `routes_recaudo_wispro.py`, `recaudo_wispro_importer.py` |
| MikroTik RouterOS | `app/mikrotik/` (acciones, snapshots, políticas, automatización), `routes_mikrotik.py` |
| OLT ZTE | `zte_connector.py`, `zte_telnet.py` |
| RADIUS | `routes_radius.py` |
| Nodos Valkiria Core (registro por token + heartbeat declarativo) | `routes_core_directo.py`, `docs/ai/context/valkiria-core-direct-integration.md` |
| Direccionamiento IP y zonas de red | `routes_ips.py`, `routes_red_zonas.py` |
| Instalaciones y mantenimientos | `routes_instalaciones.py`, `routes_mantenimientos.py`, calendario e importaciones |
| Logística e inventario | `routes_logistica.py`, `templates/logistica/` (bodegas, inventario, movimientos, lotes, seriales, custodias, proveedores, auditoría) |
| Tickets de soporte | `routes_tickets.py` |
| Portal de clientes multiempresa por slug | `routes_portal.py` |
| Portal del técnico (web responsive móvil) | `routes_tecnico.py` |
| Notificaciones por WhatsApp y correo | `whatsapp.py` (UltraMsg), `email_sender.py` (SMTP), `notification_templates.py` |
| Nuplin (TV) | `app/nuplin/`, `routes_nuplin.py`, `routes_nuplin_admin.py` |
| Multiempresa: aislamiento por `empresa_id` y zonas | `middleware_tenant.py`, `multi_tenant.py`, `README.md` |
| Roles, permisos y alcance por empresa/zona | `security_catalog.py` (`superadmin`, `admin_empresa`, `admin_zonas`), `security.py` |
| Auditoría y trazabilidad | `audit.py`, `export_audit.py`, `routes_auditoria_operativa.py` |
| Documentos PDF | ReportLab (`README.md`) |

## Claims retirados y no reemplazados

Estos puntos quedan fuera de la Home hasta que exista evidencia:

- BGP, multihoming y control de borde.
- Firewall a nivel de kernel / `nftables`.
- IPv6 nativo con bloque propio.
- Monitoreo 24/7, SLA o disponibilidad garantizada.
- Cifras de clientes, nodos, empresas o ahorros.
- Estados comerciales por módulo (`EN PRODUCCIÓN` / `PRÓXIMAMENTE`).
- Submarcas de producto (Pay, Clientes, App, Field).
- Testimonios, logos de clientes y certificaciones.
- Portal de documentación público.

## Nota sobre las composiciones de interfaz

La Home usa composiciones de interfaz construidas en HTML y CSS, sin datos
personales, sin cifras y sin nombres de clientes o nodos reales. Cada bloque
declara de forma visible que es una representación ilustrativa. No sustituyen
screenshots del producto.

## Pendientes del propietario

1. Correo comercial propio de la marca (hoy se publica el de una empresa cliente).
2. Definir si existe un portal de documentación público y su URL.
3. Screenshots reales autorizados del producto, sin datos personales, para
   reemplazar las composiciones ilustrativas de interfaz.
4. Imagen Open Graph real (no se declara `og:image` porque no existe el asset).
5. Confirmar qué integraciones pueden anunciarse como disponibles comercialmente
   y bajo qué condiciones por empresa.
