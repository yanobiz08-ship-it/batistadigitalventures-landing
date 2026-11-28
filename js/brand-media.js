/* Batista Digital Ventures - core helpers shared by every script (window.BDV_CORE), the legal
 * modals (Terms, Privacy, Accessibility) opened from any [data-legal] button, and the request
 * confirmation modal.
 * Page texts live in js/bdv-i18n.js; the long legal texts live here.
 */
(function () {
  const BDV_ADMIN_API_URL = "https://bdv-backend-api.yanobiz08.workers.dev";

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .split("&").join("&amp;")
      .split("<").join("&lt;")
      .split(">").join("&gt;")
      .split('"').join("&quot;")
      .split("'").join("&#039;");
  }

  function getLang() {
    const lang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    return lang.startsWith("en") ? "en" : "es";
  }

  // The 6 project stages shown by the client progress viewer (bdv-ops-panel.js).
  const workflowStages = [
    { stage: 1, percentage: 10, name_es: "Recepción y Filtro de Alcance", name_en: "Intake & Scope Fit Assessment" },
    { stage: 2, percentage: 25, name_es: "Firma de SOW, Depósito y Activación de Código Secreto", name_en: "SOW Execution, Deposit & Secret Code Issuance" },
    { stage: 3, percentage: 45, name_es: "Arquitectura y Entorno Base", name_en: "System Architecture & Base Setup" },
    { stage: 4, percentage: 75, name_es: "Construcción y Auditoría Técnica Interna", name_en: "Core Engineering & Internal QA" },
    { stage: 5, percentage: 90, name_es: "Inspección de Entrega y Ventana de Revisión", name_en: "Client Inspection & Review Window" },
    { stage: 6, percentage: 100, name_es: "Liquidación Final, Traspaso y Expiración de Acceso", name_en: "Final Settlement, Handoff & Portal Disablement" }
  ];

  window.BDV_CORE = {
    apiUrl: BDV_ADMIN_API_URL,
    escapeHtml: escapeHtml,
    getLang: getLang,
    workflowStages: workflowStages,
    getProjectDisplayName: function (p, lang) {
      if (!p) return "";
      if (lang === "es") {
        return p.name_es || p.name || p.name_en || "";
      }
      return p.name_en || p.name || p.name_es || "";
    },
    showConfirmation: function (clientName, reqId, kind) {
      openConfirmationModal(clientName, reqId, kind || "quote");
    }
  };

  // Long legal texts (Terms of Service, Privacy Policy, Accessibility Statement), opened from any
  // [data-legal="terms|privacy|accessibility"] button. Each doc is a list of [heading, html] sections.
  const MAIL = '<a href="mailto:contact@batistadigitalventures.com">contact@batistadigitalventures.com</a>';
  function legalDoc(intro, sections) {
    return "<p>" + intro + "</p>" + sections.map(function (s) { return "<h4>" + s[0] + "</h4>" + s[1]; }).join("");
  }
  const copy = {
    es: {
      terms: {
        title: "Términos de Servicio — Batista Digital Ventures LLC",
        body: legalDoc(
          "<strong>Vigentes desde:</strong> noviembre de 2026. Estos Términos de Servicio («Términos») regulan el uso de batistadigitalventures.com y los servicios de Batista Digital Ventures LLC («BDV»), una sociedad de responsabilidad limitada de California con domicilio en Lompoc, California, EE.UU. Al usar el sitio, enviar una solicitud o firmar un Alcance de Trabajo (SOW), aceptas estos Términos.",
          [
            ["1. Información del sitio y precios", "<p>El contenido del sitio es informativo y no es una oferta vinculante. Los precios «desde» y los rangos típicos son referencias en dólares estadounidenses (USD); el precio, el alcance, las etapas y los plazos finales se acuerdan solo por escrito en tu SOW. Los plazos son estimados. Las capturas de MERQOX pueden mostrar datos y negocios ficticios de demostración; TRIVLO y MERQOX son productos propios en desarrollo y sus funciones pueden cambiar.</p>"],
            ["2. SOW y cambios de alcance", "<p>Cada proyecto se rige por un SOW firmado. Si el SOW y estos Términos se contradicen, prevalece el SOW en lo que regule expresamente. Los trabajos fuera del alcance requieren una orden de cambio por escrito, con su precio, antes de hacerse.</p>"],
            ["3. Pagos", "<p>Los proyectos requieren un depósito inicial (normalmente entre 25% y 50%) antes de empezar. Los pagos por etapa cubren trabajo ya realizado y no son reembolsables. El saldo final se paga antes de publicar en producción o en tiendas de apps y antes de traspasar el código y los accesos. Los pagos con tarjeta se procesan con Stripe; BDV no recibe ni guarda el número completo de tu tarjeta. Si un pago se retrasa, podemos pausar el trabajo hasta ponerlo al día, y los plazos se ajustan en consecuencia.</p>"],
            ["4. Cancelación y reembolsos", "<ul><li>Si cancelas por escrito antes de que empecemos el trabajo de la Etapa 3 (arquitectura), te devolvemos el depósito, menos las comisiones de procesamiento de pago que no podamos recuperar.</li><li>Una vez iniciada la Etapa 3, el depósito y los pagos por etapa no son reembolsables, y pagas el trabajo realizado hasta la fecha de cancelación según tu SOW.</li><li>Si BDV cancela el proyecto sin que hayas incumplido, te devolvemos lo pagado por trabajo aún no realizado.</li><li>Nada de lo anterior limita derechos que la ley te otorgue y que no puedan renunciarse.</li></ul>"],
            ["5. Ofertas y promociones", "<p><strong>Oferta de Black Friday y fiestas:</strong> válida para SOW firmados y con depósito pagado entre el 25 de noviembre de 2026 y el 6 de enero de 2027 a las 11:59 p. m., hora del Pacífico. El precio de oferta sustituye al precio «desde» del servicio; el precio final depende del alcance de tu SOW. Los precios tachados que mostramos durante la oferta son nuestras tarifas estándar, que aplican a partir del 7 de enero de 2027.</p><p><strong>Precio de mantenimiento de oferta por 12 meses:</strong> si cumples la condición anterior, mantienes la tarifa mensual de oferta del plan que contrates durante 12 meses consecutivos desde la fecha de inicio del plan, siempre que el plan empiece dentro de los 30 días posteriores a la entrega del proyecto, se mantenga activo y al día en los pagos, y no aumente su alcance (un plan de mayor alcance se cotiza aparte). Después de los 12 meses aplica la tarifa estándar vigente, con aviso previo por correo.</p><p>Las ofertas no son acumulables con otras, no se canjean por dinero, no son transferibles y no aplican a SOW firmados antes de su inicio.</p>"],
            ["6. Auditoría web + plan de acción", "<p>La Auditoría web + plan de acción es un servicio de pago único, con un precio desde $99 hasta $150 según el tamaño de su sitio, que se acuerda por escrito antes de empezar. Revisamos su sitio web actual y le entregamos un informe escrito con un plan de acción priorizado: lo que encontramos y qué recomendamos corregir, y en qué orden. Las reparaciones, los cambios y los trabajos nuevos no forman parte de la auditoría; se cotizan por separado y solo empiezan con un SOW firmado. La auditoría refleja el sitio tal como lo revisamos en esa fecha; no garantizamos que encuentre todos los errores, vulnerabilidades o incumplimientos, y no es una opinión legal, una certificación de seguridad ni una evaluación de cumplimiento de accesibilidad. La consulta gratuita es distinta: es una revisión sin costo de su solicitud y no incluye la auditoría. Si no podemos entregar el informe, le devolvemos el importe de la auditoría.</p>"],
            ["7. Planes de mantenimiento (renovación automática)", "<p>Los planes de mantenimiento son mensuales y se renuevan automáticamente cada mes al precio acordado hasta que los canceles. Antes del primer cobro te pediremos tu consentimiento expreso a estas condiciones. Puedes cancelar en cualquier momento, sin penalización, escribiendo a " + MAIL + " o por el mismo medio en que contrataste; la cancelación aplica al final del período ya pagado. Te avisaremos por correo con al menos 30 días de anticipación de cualquier cambio de precio.</p>"],
            ["8. Tus responsabilidades", "<p>Nos entregas a tiempo la información, contenidos, accesos y aprobaciones necesarios, y garantizas que tienes los derechos sobre los textos, imágenes, logotipos y datos que nos das. Eres responsable del contenido de tu sitio o app, de las cuentas a tu nombre (dominio, hosting, tiendas de apps, pasarelas de pago) y de cumplir las leyes aplicables a tu negocio, incluidas las de privacidad de tus propios usuarios.</p>"],
            ["9. Servicios y plataformas de terceros", "<p>Muchos proyectos dependen de terceros (por ejemplo Apple App Store, Google Play, Cloudflare, GitHub, Stripe, proveedores de hosting, correo o APIs). No controlamos sus decisiones, precios, disponibilidad ni políticas; en particular, la aprobación y permanencia de una app en las tiendas depende solo de Apple y Google. Sus tarifas corren por tu cuenta, salvo que el SOW diga otra cosa.</p>"],
            ["10. Propiedad intelectual y portafolio", "<p>Al liquidar el 100%, te transferimos la titularidad de los entregables hechos a la medida para tu proyecto. BDV conserva sus librerías base, plantillas y herramientas preexistentes o de uso general, y te otorga una licencia no exclusiva, perpetua y sin costo adicional para usarlas como parte de tus entregables. Los componentes de terceros y de código abierto siguen bajo sus propias licencias. Salvo que el SOW diga otra cosa o nos lo pidas por escrito, podemos mencionar el proyecto terminado y mostrar capturas en nuestro portafolio, sin revelar información confidencial.</p>"],
            ["11. Confidencialidad", "<p>Mantenemos confidencial la información no pública que nos compartas y la usamos solo para tu proyecto. Solo la compartimos con subcontratistas que la necesiten para el proyecto y que estén obligados a la misma confidencialidad.</p>"],
            ["12. Subcontratistas y red de partners", "<p>Podemos apoyarnos en contratistas independientes, como los partners de nuestra red. BDV sigue siendo la parte responsable frente a ti según tu SOW. Los partners no son empleados, agentes ni representantes de BDV y no pueden obligar a BDV fuera de lo que BDV acuerde por escrito. Postularse a la red no garantiza proyectos ni ingresos.</p>"],
            ["13. Garantía limitada", "<p>Prestamos los servicios con cuidado profesional y corregimos sin costo los defectos que incumplan el SOW y que nos reportes por escrito durante la ventana de revisión de 5 días hábiles. Si esa ventana vence sin observaciones por escrito, la entrega se considera aceptada; después, los arreglos se cotizan como reparación o mantenimiento.</p><p><strong>SALVO LO ANTERIOR Y EN LA MEDIDA PERMITIDA POR LA LEY, LOS SERVICIOS, LOS ENTREGABLES Y EL SITIO SE OFRECEN «TAL CUAL», SIN GARANTÍAS IMPLÍCITAS DE COMERCIABILIDAD, IDONEIDAD PARA UN FIN PARTICULAR O NO INFRACCIÓN.</strong> No garantizamos resultados comerciales (ventas, posicionamiento en buscadores o tráfico), disponibilidad ininterrumpida, ni que un sistema esté libre de todo error o vulnerabilidad.</p>"],
            ["14. Limitación de responsabilidad", "<p><strong>EN LA MEDIDA PERMITIDA POR LA LEY, LA RESPONSABILIDAD TOTAL DE BDV POR CUALQUIER RECLAMACIÓN RELACIONADA CON UN PROYECTO SE LIMITA AL MONTO QUE NOS PAGASTE POR ESE PROYECTO (O A 100 USD SI LA RECLAMACIÓN SOLO SE RELACIONA CON EL USO DEL SITIO), Y BDV NO RESPONDE POR DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES O CONSECUENTES, NI POR LUCRO CESANTE O PÉRDIDA DE DATOS.</strong> Estos límites no aplican a la responsabilidad que la ley no permite limitar, como la derivada de fraude, dolo o negligencia grave.</p>"],
            ["15. Indemnización", "<p>Nos defenderás e indemnizarás frente a reclamaciones de terceros derivadas de los contenidos o materiales que nos entregues, del uso de los entregables en violación de la ley o de estos Términos, o de tus propios productos y servicios.</p>"],
            ["16. Uso del sitio", "<p>No uses el sitio con fines ilícitos, para enviar información falsa o de terceros sin su permiso, para intentar acceder a áreas privadas (como el panel de operaciones o el proyecto de otro cliente) ni para interferir con su funcionamiento. Los sitios de terceros enlazados (como merqox.com, trivlopro.com, gyroadsidesolutions.com o LinkedIn) se rigen por sus propias condiciones.</p>"],
            ["17. Marcas", "<p>Batista Digital Ventures, BDV, TRIVLO y MERQOX son nombres comerciales de BDV. App Store es una marca de servicio de Apple Inc.; Google Play es una marca de Google LLC; D-U-N-S® es una marca registrada de Dun & Bradstreet. Otras marcas (como Cloudflare, GitHub, Stripe o React Native) pertenecen a sus dueños y se mencionan solo para describir las tecnologías que usamos, sin implicar patrocinio ni respaldo.</p>"],
            ["18. Firma y comunicaciones electrónicas", "<p>Aceptas firmar el SOW y recibir contratos, facturas, recibos y avisos por medios electrónicos, conforme a la ley federal E-SIGN y a la Ley Uniforme de Transacciones Electrónicas de California (UETA). Necesitas un navegador actualizado y un correo electrónico para recibir y guardar los documentos. Puedes pedir una copia en papel sin costo o retirar este consentimiento para documentos futuros escribiendo a " + MAIL + "; retirarlo no afecta lo ya firmado.</p>"],
            ["19. Clientes internacionales y sanciones", "<p>Trabajamos en remoto con clientes de otros países y cobramos en USD. Eres responsable de los impuestos, permisos y requisitos legales de tu país. No prestamos servicios ni aceptamos pagos cuando lo prohíban las leyes de sanciones o de control de exportaciones de EE.UU., incluidas las que administra la OFAC.</p>"],
            ["20. Ley aplicable y disputas", "<p>Estos Términos y cada SOW se rigen por las leyes del Estado de California, sin aplicar sus normas de conflicto de leyes; no aplica la Convención de las Naciones Unidas sobre los Contratos de Compraventa Internacional de Mercaderías. Antes de iniciar una acción legal, las partes intentarán resolver de buena fe cualquier disputa durante 30 días desde un aviso por escrito. Si no se resuelve, se someterá a los tribunales estatales o federales competentes del condado de Santa Bárbara, California, salvo que pueda tramitarse ante un tribunal de reclamos menores.</p>"],
            ["21. Disposiciones generales", "<p>Si una cláusula resulta inválida, las demás siguen vigentes. No respondemos por retrasos causados por hechos fuera de nuestro control razonable. Podemos actualizar estos Términos publicando una nueva versión con su fecha; los cambios no afectan a los SOW ya firmados, salvo acuerdo de ambas partes. Estos Términos se publican en español e inglés con igual valor; si hubiera diferencias, prevalece la versión del idioma en que se negoció tu SOW. Contacto: " + MAIL + ".</p>"]
          ]
        )
      },
      privacy: {
        title: "Política de Privacidad — Batista Digital Ventures LLC",
        body: legalDoc(
          "<strong>Vigente desde:</strong> noviembre de 2026. Esta política explica cómo Batista Digital Ventures LLC («BDV»), con domicilio en Lompoc, California, EE.UU., recopila, usa, comparte y protege la información personal en batistadigitalventures.com y al prestar sus servicios. Contacto: " + MAIL + ".",
          [
            ["1. Información que recopilamos", "<ul><li><strong>Formulario de cotización:</strong> nombre, correo, empresa o proyecto (opcional), tipo de servicio, presupuesto, plazo y la descripción que escribas.</li><li><strong>Postulación de partners:</strong> nombre, correo, URL de GitHub o portafolio, especialidad, zona horaria y notas.</li><li><strong>Clientes:</strong> datos del SOW (nombre, empresa, correo, alcance y montos); el nombre y cargo con que firmas, y la fecha, hora y dirección IP registradas al firmar, como constancia de la firma electrónica; el estado de los pagos; y el correo y código con que consultas el avance de tu proyecto.</li><li><strong>Pagos:</strong> los procesa Stripe. Recibimos la confirmación del pago (monto, fecha e identificador), no el número completo de tu tarjeta.</li><li><strong>Correspondencia:</strong> los mensajes que nos envíes.</li><li><strong>Datos técnicos:</strong> nuestros proveedores de hosting y red pueden registrar tu dirección IP, tu navegador y las páginas solicitadas para entregar y proteger el sitio. Usamos tu IP de forma temporal para limitar intentos repetidos, por ejemplo en el visor de clientes.</li></ul><p>No pedimos información sensible (como números de seguro social, datos de salud o datos bancarios); por favor no la incluyas en los formularios.</p>"],
            ["2. Cookies, estadísticas de visitas y rastreo", "<p>Este sitio no usa cookies, píxeles de rastreo ni publicidad, y no guarda datos en tu navegador. Usamos Cloudflare Web Analytics, una herramienta sin cookies que nos muestra estadísticas agregadas de visitas (por ejemplo, páginas vistas, país, tipo de dispositivo, navegador y velocidad de carga) sin identificarte ni seguirte entre sitios; no vendemos ni compartimos esos datos. Las páginas de pago de Stripe pueden usar sus propias cookies para procesar el pago y prevenir fraude. Como no te rastreamos entre sitios, no respondemos de forma distinta a la señal «Do Not Track»; aun así, tratamos la señal Global Privacy Control como una solicitud de exclusión.</p>"],
            ["3. Cómo usamos la información", "<p>Para responder solicitudes, preparar cotizaciones y SOW, prestar y cobrar los servicios, escribirte sobre tu solicitud o proyecto, evaluar postulaciones, guardar constancia de firmas y pagos, proteger el sitio contra abusos y cumplir obligaciones legales. No te enviamos correos promocionales sin tu permiso.</p>"],
            ["4. Con quién la compartimos", "<p>Solo con proveedores que nos prestan servicios y tratan los datos en nuestro nombre: Cloudflare (red, seguridad, estadísticas de visitas, procesamiento de formularios y almacenamiento), GitHub (alojamiento del sitio), Resend (envío de correos), nuestro proveedor de correo electrónico y Stripe (pagos); con subcontratistas que trabajen en tu proyecto bajo confidencialidad; y cuando lo exija la ley o sea necesario para proteger nuestros derechos. <strong>No vendemos tu información personal ni la compartimos para publicidad conductual entre contextos</strong>, y no la divulgamos a terceros para sus fines de marketing directo (Código Civil de California, sección 1798.83).</p>"],
            ["5. Conservación", "<p>Solicitudes que no se convierten en proyecto y postulaciones de partners: hasta 24 meses. Datos de clientes, SOW firmados y constancias de pago: durante la relación y hasta 7 años después, por obligaciones fiscales y legales. Contadores de seguridad por IP: unos minutos. Puedes pedirnos que los borremos antes (ver la sección 7).</p>"],
            ["6. Seguridad", "<p>Aplicamos medidas razonables, como conexión cifrada (HTTPS), acceso restringido con claves y límite de intentos. Ningún sistema es 100% seguro, por lo que no podemos garantizar una seguridad absoluta. Si ocurre una brecha que afecte tus datos, te avisaremos como exige la ley.</p>"],
            ["7. Tus derechos", "<p>Cualquier persona, y en particular los residentes de California, puede pedirnos: saber qué información personal tenemos sobre ella y acceder a ella; corregirla; borrarla (salvo lo que debamos conservar por ley o contrato); y excluirse de su venta o uso compartido (no hacemos ninguna de las dos cosas). No te discriminaremos por ejercer estos derechos. Escríbenos a " + MAIL + " desde el correo que nos diste; podemos pedirte datos para verificar tu identidad, y puedes actuar mediante un agente autorizado. Respondemos en un plazo máximo de 45 días.</p>"],
            ["8. Menores de edad", "<p>El sitio y nuestros servicios están dirigidos a negocios y a personas adultas. No recopilamos a sabiendas información de menores de 16 años; si crees que un menor nos envió datos, escríbenos y los borraremos.</p>"],
            ["9. Visitantes fuera de EE.UU.", "<p>Tratamos y guardamos la información en Estados Unidos. Si nos contactas desde otro país, tus datos se tratarán allí conforme a esta política.</p>"],
            ["10. Otros sitios", "<p>Los sitios y apps enlazados (TRIVLO, MERQOX, GY Roadside Solutions y LinkedIn) tienen sus propias políticas de privacidad.</p>"],
            ["11. Cambios a esta política", "<p>Publicaremos cualquier cambio aquí con su nueva fecha. Si el cambio es importante, también avisaremos por correo a los clientes con un proyecto activo.</p>"]
          ]
        )
      },
      accessibility: {
        title: "Declaración de Accesibilidad — Batista Digital Ventures LLC",
        body: legalDoc(
          "<strong>Actualizada:</strong> noviembre de 2026. En Batista Digital Ventures LLC queremos que todas las personas, incluidas las personas con discapacidad, puedan usar este sitio sin barreras.",
          [
            ["Nuestro objetivo", "<p>Seguir las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1, nivel AA, y revisar el sitio cada vez que lo cambiamos.</p>"],
            ["Lo que ya hacemos", "<ul><li>Estructura con encabezados y regiones, y un enlace para saltar al contenido.</li><li>Navegación completa con teclado y foco visible.</li><li>Textos alternativos en las imágenes y etiquetas en todos los campos de formulario.</li><li>Ventanas que mantienen el foco y se cierran con la tecla Escape.</li><li>Contraste de color suficiente y el idioma de la página (español o inglés) declarado correctamente.</li><li>Revisiones con herramientas automáticas y pruebas manuales en computadora y móvil.</li></ul>"],
            ["Limitaciones conocidas", "<p>Las capturas de las apps son imágenes con texto; las describimos en su pie de foto. Las páginas de pago de Stripe y los sitios enlazados son de terceros y no los controlamos.</p>"],
            ["¿Encontraste una barrera?", "<p>Escríbenos a " + MAIL + " e indícanos la página y el problema. Buscamos responder en un máximo de 5 días hábiles y, mientras lo resolvemos, te damos la información o el servicio por otro medio, por ejemplo por correo o en un documento accesible.</p>"]
          ]
        )
      }
    },
    en: {
      terms: {
        title: "Terms of Service — Batista Digital Ventures LLC",
        body: legalDoc(
          "<strong>Effective:</strong> November 2026. These Terms of Service (“Terms”) govern your use of batistadigitalventures.com and the services of Batista Digital Ventures LLC (“BDV”), a California limited liability company based in Lompoc, California, USA. By using the site, sending a request, or signing a Statement of Work (SOW), you agree to these Terms.",
          [
            ["1. Site information and prices", "<p>Site content is for information only and is not a binding offer. “From” prices and typical ranges are references in U.S. dollars (USD); the final price, scope, stages, and timeline are agreed only in writing in your SOW. Timelines are estimates. MERQOX screenshots may show fictitious demo data and businesses; TRIVLO and MERQOX are our own products in development and their features may change.</p>"],
            ["2. SOW and scope changes", "<p>Each project is governed by a signed SOW. If the SOW and these Terms conflict, the SOW controls on the points it expressly covers. Out-of-scope work requires a written change order, with its price, before it is done.</p>"],
            ["3. Payments", "<p>Projects require an initial deposit (usually 25% to 50%) before work starts. Milestone payments cover work already performed and are non-refundable. The final balance is due before production or app-store release and before code and access are handed over. Card payments are processed by Stripe; BDV never receives or stores your full card number. If a payment is late, we may pause work until it is brought current, and timelines adjust accordingly.</p>"],
            ["4. Cancellation and refunds", "<ul><li>If you cancel in writing before we start Stage 3 (architecture) work, we refund your deposit, minus any payment processing fees we can't recover.</li><li>Once Stage 3 has started, the deposit and milestone payments are non-refundable, and you pay for work performed up to the cancellation date under your SOW.</li><li>If BDV cancels the project without any breach on your part, we refund what you paid for work not yet performed.</li><li>Nothing here limits rights you have under law that cannot be waived.</li></ul>"],
            ["5. Offers and promotions", "<p><strong>Black Friday & holiday offer:</strong> valid for SOWs signed, with the deposit paid, between November 25, 2026 and January 6, 2027 at 11:59 p.m. Pacific Time. The offer price replaces the service's “from” price; your final price depends on your SOW's scope. The struck-through prices shown during the offer are our standard rates, which apply from January 7, 2027.</p><p><strong>Offer maintenance rate for 12 months:</strong> if you meet the condition above, you keep the offer monthly rate for the plan you choose for 12 consecutive months from the plan's start date, as long as the plan starts within 30 days after project delivery, stays active and paid on time, and its scope doesn't increase (a larger plan is quoted separately). After 12 months the then-current standard rate applies, with prior notice by email.</p><p>Offers can't be combined with other offers, have no cash value, are non-transferable, and don't apply to SOWs signed before the offer started.</p>"],
            ["6. Website Audit + Action Plan", "<p>The Website Audit + Action Plan is a paid, one-time service, priced from $99 up to $150 depending on the size of your site and agreed in writing before we start. We review your existing website and deliver a written report with a prioritized action plan: what we found and what we recommend fixing, and in what order. Repairs, changes, and new work are not part of the audit; they are quoted separately and start only under a signed SOW. The audit reflects the site as we reviewed it on that date; we don't guarantee that it finds every error, vulnerability, or compliance issue, and it is not a legal opinion, a security certification, or an accessibility-compliance assessment. The free consultation is different: it is a no-cost review of your request and does not include the audit. If we are unable to deliver the report, we refund the audit fee.</p>"],
            ["7. Maintenance plans (automatic renewal)", "<p>Maintenance plans are monthly and renew automatically each month at the agreed price until you cancel. Before the first charge we will ask for your express consent to these terms. You can cancel anytime, with no penalty, by emailing " + MAIL + " or through the same channel you used to sign up; cancellation takes effect at the end of the period already paid. We will email you at least 30 days before any price change.</p>"],
            ["8. Your responsibilities", "<p>You provide the information, content, access, and approvals we need on time, and you confirm you hold the rights to the text, images, logos, and data you give us. You are responsible for your site's or app's content, for accounts in your name (domain, hosting, app stores, payment gateways), and for complying with the laws that apply to your business, including privacy laws for your own users.</p>"],
            ["9. Third-party services and platforms", "<p>Many projects depend on third parties (for example Apple App Store, Google Play, Cloudflare, GitHub, Stripe, and hosting, email, or API providers). We don't control their decisions, prices, availability, or policies; in particular, whether an app is approved and stays in the stores is up to Apple and Google alone. Their fees are your responsibility unless your SOW says otherwise.</p>"],
            ["10. Intellectual property and portfolio", "<p>Once you pay 100%, we transfer to you ownership of the deliverables custom-built for your project. BDV keeps its pre-existing or general-purpose base libraries, templates, and tools, and grants you a non-exclusive, perpetual license, at no extra cost, to use them as part of your deliverables. Third-party and open-source components stay under their own licenses. Unless your SOW says otherwise or you ask us in writing, we may mention the finished project and show screenshots in our portfolio, without revealing confidential information.</p>"],
            ["11. Confidentiality", "<p>We keep non-public information you share with us confidential and use it only for your project. We share it only with subcontractors who need it for the project and are bound by the same confidentiality.</p>"],
            ["12. Subcontractors and partner network", "<p>We may work with independent contractors, such as partners in our network. BDV remains the party responsible to you under your SOW. Partners are not BDV employees, agents, or representatives and can't bind BDV beyond what BDV agrees in writing. Applying to the network doesn't guarantee projects or income.</p>"],
            ["13. Limited warranty", "<p>We perform our services with professional care and fix at no cost any defects that don't meet the SOW and that you report in writing during the 5-business-day review window. If that window ends without written feedback, the delivery is deemed accepted; after that, fixes are quoted as repair or maintenance work.</p><p><strong>EXCEPT AS STATED ABOVE AND TO THE EXTENT PERMITTED BY LAW, THE SERVICES, DELIVERABLES, AND SITE ARE PROVIDED “AS IS,” WITHOUT IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</strong> We don't guarantee business results (sales, search rankings, or traffic), uninterrupted availability, or that any system is free of every error or vulnerability.</p>"],
            ["14. Limitation of liability", "<p><strong>TO THE EXTENT PERMITTED BY LAW, BDV'S TOTAL LIABILITY FOR ANY CLAIM RELATED TO A PROJECT IS LIMITED TO THE AMOUNT YOU PAID US FOR THAT PROJECT (OR USD 100 IF THE CLAIM RELATES ONLY TO USE OF THE SITE), AND BDV IS NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, LOST PROFITS, OR LOST DATA.</strong> These limits don't apply to liability that cannot be limited by law, such as liability for fraud, willful misconduct, or gross negligence.</p>"],
            ["15. Indemnification", "<p>You will defend and indemnify us against third-party claims arising from content or materials you provide, from use of the deliverables in violation of the law or these Terms, or from your own products and services.</p>"],
            ["16. Use of the site", "<p>Don't use the site for unlawful purposes, to submit false information or someone else's information without permission, to try to access private areas (such as the operations panel or another client's project), or to interfere with how it works. Linked third-party sites (such as merqox.com, trivlopro.com, gyroadsidesolutions.com, or LinkedIn) have their own terms.</p>"],
            ["17. Trademarks", "<p>Batista Digital Ventures, BDV, TRIVLO, and MERQOX are trade names of BDV. App Store is a service mark of Apple Inc.; Google Play is a trademark of Google LLC; D-U-N-S® is a registered trademark of Dun & Bradstreet. Other marks (such as Cloudflare, GitHub, Stripe, or React Native) belong to their owners and are named only to describe the technologies we use, without implying sponsorship or endorsement.</p>"],
            ["18. Electronic signatures and communications", "<p>You agree to sign the SOW and to receive contracts, invoices, receipts, and notices electronically, under the federal E-SIGN Act and the California Uniform Electronic Transactions Act (UETA). You need an up-to-date browser and an email address to receive and keep the documents. You can request a free paper copy or withdraw this consent for future documents by emailing " + MAIL + "; withdrawing doesn't affect anything already signed.</p>"],
            ["19. International clients and sanctions", "<p>We work remotely with clients in other countries and bill in USD. You are responsible for taxes, permits, and legal requirements in your country. We don't provide services or accept payments where U.S. sanctions or export-control laws prohibit it, including those administered by OFAC.</p>"],
            ["20. Governing law and disputes", "<p>These Terms and each SOW are governed by the laws of the State of California, without regard to its conflict-of-laws rules; the United Nations Convention on Contracts for the International Sale of Goods does not apply. Before starting legal action, the parties will try in good faith to resolve any dispute for 30 days after written notice. If it isn't resolved, it will be brought in the competent state or federal courts of Santa Barbara County, California, unless it qualifies for small claims court.</p>"],
            ["21. General", "<p>If any clause is found invalid, the rest stays in effect. We're not responsible for delays caused by events beyond our reasonable control. We may update these Terms by posting a new dated version; changes don't affect SOWs already signed unless both parties agree. These Terms are published in English and Spanish with equal effect; if they differ, the version in the language your SOW was negotiated in controls. Contact: " + MAIL + ".</p>"]
          ]
        )
      },
      privacy: {
        title: "Privacy Policy — Batista Digital Ventures LLC",
        body: legalDoc(
          "<strong>Effective:</strong> November 2026. This policy explains how Batista Digital Ventures LLC (“BDV”), based in Lompoc, California, USA, collects, uses, shares, and protects personal information on batistadigitalventures.com and when providing its services. Contact: " + MAIL + ".",
          [
            ["1. Information we collect", "<ul><li><strong>Quote form:</strong> name, email, company or project (optional), service type, budget, timeline, and the description you write.</li><li><strong>Partner application:</strong> name, email, GitHub or portfolio URL, specialty, time zone, and notes.</li><li><strong>Clients:</strong> SOW details (name, company, email, scope, and amounts); the name and title you sign with, and the date, time, and IP address recorded at signing as evidence of the electronic signature; payment status; and the email and code you use to check your project's progress.</li><li><strong>Payments:</strong> processed by Stripe. We receive the payment confirmation (amount, date, and ID), not your full card number.</li><li><strong>Correspondence:</strong> messages you send us.</li><li><strong>Technical data:</strong> our hosting and network providers may log your IP address, browser, and requested pages to deliver and protect the site. We use your IP temporarily to limit repeated attempts, for example in the client viewer.</li></ul><p>We don't ask for sensitive information (such as Social Security numbers, health data, or bank details); please don't include it in the forms.</p>"],
            ["2. Cookies, visit statistics, and tracking", "<p>This site uses no cookies, tracking pixels, or advertising, and stores no data in your browser. We use Cloudflare Web Analytics, a cookieless tool that shows us aggregate visit statistics (for example, page views, country, device type, browser, and load speed) without identifying you or following you across sites; we don't sell or share that data. Stripe's payment pages may use their own cookies to process payments and prevent fraud. Because we don't track you across sites, we don't respond differently to “Do Not Track” signals; we still treat the Global Privacy Control signal as an opt-out request.</p>"],
            ["3. How we use information", "<p>To answer requests, prepare quotes and SOWs, provide and bill for services, email you about your request or project, review applications, keep records of signatures and payments, protect the site from abuse, and meet legal obligations. We don't send you promotional emails without your permission.</p>"],
            ["4. Who we share it with", "<p>Only with providers that serve us and process data on our behalf: Cloudflare (network, security, visit statistics, form processing, and storage), GitHub (site hosting), Resend (email delivery), our email provider, and Stripe (payments); with subcontractors working on your project under confidentiality; and when required by law or needed to protect our rights. <strong>We don't sell your personal information or share it for cross-context behavioral advertising</strong>, and we don't disclose it to third parties for their direct marketing purposes (California Civil Code section 1798.83).</p>"],
            ["5. Retention", "<p>Requests that don't become projects, and partner applications: up to 24 months. Client data, signed SOWs, and payment records: for the relationship and up to 7 years after, for tax and legal obligations. IP-based security counters: a few minutes. You can ask us to delete data sooner (see section 7).</p>"],
            ["6. Security", "<p>We use reasonable safeguards, such as encrypted connections (HTTPS), key-restricted access, and attempt limits. No system is 100% secure, so we can't guarantee absolute security. If a breach affects your data, we will notify you as the law requires.</p>"],
            ["7. Your rights", "<p>Anyone, and California residents in particular, may ask us to: tell them what personal information we hold about them and give access to it; correct it; delete it (except what we must keep by law or contract); and opt out of its sale or sharing (we do neither). We won't discriminate against you for using these rights. Email " + MAIL + " from the address you gave us; we may ask for details to verify your identity, and you may act through an authorized agent. We respond within 45 days at most.</p>"],
            ["8. Children", "<p>The site and our services are meant for businesses and adults. We don't knowingly collect information from children under 16; if you believe a minor sent us data, email us and we will delete it.</p>"],
            ["9. Visitors outside the U.S.", "<p>We process and store information in the United States. If you contact us from another country, your data will be processed there under this policy.</p>"],
            ["10. Other sites", "<p>Linked sites and apps (TRIVLO, MERQOX, GY Roadside Solutions, and LinkedIn) have their own privacy policies.</p>"],
            ["11. Changes to this policy", "<p>We will post any change here with its new date. If a change is significant, we will also email clients with an active project.</p>"]
          ]
        )
      },
      accessibility: {
        title: "Accessibility Statement — Batista Digital Ventures LLC",
        body: legalDoc(
          "<strong>Updated:</strong> November 2026. At Batista Digital Ventures LLC we want everyone, including people with disabilities, to be able to use this site without barriers.",
          [
            ["Our goal", "<p>To follow the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, and to review the site every time we change it.</p>"],
            ["What we already do", "<ul><li>Structure with headings and landmarks, plus a skip-to-content link.</li><li>Full keyboard navigation with a visible focus indicator.</li><li>Alternative text on images and labels on every form field.</li><li>Dialogs that keep focus and close with the Escape key.</li><li>Sufficient color contrast and the page language (English or Spanish) declared correctly.</li><li>Reviews with automated tools and manual testing on desktop and mobile.</li></ul>"],
            ["Known limitations", "<p>App screenshots are images that contain text; we describe them in their captions. Stripe's payment pages and linked sites belong to third parties and are outside our control.</p>"],
            ["Found a barrier?", "<p>Email " + MAIL + " and tell us the page and the problem. We aim to reply within 5 business days and, while we fix it, we'll provide the information or service another way, for example by email or in an accessible document.</p>"]
          ]
        )
      }
    }
  };

  function openLegal(kind) {
    const doc = copy[getLang()][kind];
    document.getElementById("bdv-modal-title").textContent = doc.title;
    const body = document.getElementById("bdv-modal-body");
    body.innerHTML = doc.body;
    body.scrollTop = 0;
    document.getElementById("bdv-legal-modal-root").style.display = "flex";
  }

  function applyLegalModals() {

    const modalRoot = document.createElement("div");
    modalRoot.id = "bdv-legal-modal-root";
    modalRoot.className = "bdv-modal-overlay";
    modalRoot.style.display = "none";
    // Above the SOW viewer, which links to the Terms from its consent box.
    modalRoot.style.zIndex = "100001";
    modalRoot.innerHTML = `
      <div class="bdv-modal-window">
        <div class="bdv-modal-top">
          <h3 id="bdv-modal-title">Legal</h3>
          <button type="button" id="bdv-modal-close-btn" class="bdv-modal-close" aria-label="Cerrar">✕</button>
        </div>
        <div id="bdv-modal-body" class="bdv-modal-content"></div>
      </div>
    `;
    document.body.appendChild(modalRoot);

    document.getElementById("bdv-modal-close-btn").addEventListener("click", () => {
      modalRoot.style.display = "none";
    });
    modalRoot.addEventListener("click", (e) => {
      if (e.target === modalRoot) modalRoot.style.display = "none";
    });
  }

  // Delegated, so [data-legal] buttons added later (e.g. in the SOW viewer) work too.
  function bindLegalButtons() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest && e.target.closest("[data-legal]");
      if (btn && copy.es[btn.getAttribute("data-legal")]) openLegal(btn.getAttribute("data-legal"));
    });
  }

  function openConfirmationModal(clientName, reqId, kind) {
    let confirmRoot = document.getElementById("bdv-exec-confirm-root");
    if (!confirmRoot) {
      confirmRoot = document.createElement("div");
      confirmRoot.id = "bdv-exec-confirm-root";
      confirmRoot.className = "bdv-modal-overlay";
      confirmRoot.style.zIndex = "100000";
      confirmRoot.style.overflowY = "auto";
      confirmRoot.style.padding = "16px";
      document.body.appendChild(confirmRoot);
    }

    const isPartner = kind === "partner";
    const fill = (key) =>
      escapeHtml(window.BDV_t(key)).split("{name}").join(escapeHtml(clientName)).split("{ref}").join(escapeHtml(reqId || "BDV"));
    const title = fill(isPartner ? "cfTitlePartner" : "cfTitleQuote");
    const badge = "BATISTA DIGITAL VENTURES LLC";
    const greeting = fill(isPartner ? "cfGreetPartner" : "cfGreetQuote");
    const detail = fill(isPartner ? "cfDetailPartner" : "cfDetailQuote");
    const btnText = fill("cfOk");

    confirmRoot.innerHTML = `
      <div class="bdv-tracker-card" style="max-width: 480px; width: 100%; margin: 20px auto; border: 1px solid rgba(212, 175, 55, 0.55); background: #0b0f17; padding: 22px; border-radius: 14px;">
        <div style="font-size: 0.7rem; letter-spacing: 0.08em; color: #e8c861; font-weight: 700; margin-bottom: 6px;">${badge}</div>
        <h3 style="margin: 0 0 10px 0; font-size: 1.15rem; color: #f8fafc;">${title}</h3>
        <p style="font-size: 0.9rem; color: #e2e8f0; line-height: 1.5; margin: 0 0 10px 0;">${greeting}</p>
        <p style="font-size: 0.82rem; color: #94a3b8; line-height: 1.5; margin: 0 0 18px 0;">${detail}</p>
        <button type="button" id="bdv-exec-confirm-close" class="bdv-tracker-btn" style="width: 100%; background: #e8c861 !important; color: #070a10 !important; font-weight: 700;">${btnText}</button>
      </div>
    `;
    confirmRoot.style.setProperty("display", "block", "important");
    document.getElementById("bdv-exec-confirm-close").onclick = () => {
      confirmRoot.style.setProperty("display", "none", "important");
    };
    confirmRoot.onclick = (e) => {
      if (e.target === confirmRoot) confirmRoot.style.setProperty("display", "none", "important");
    };
  }

  function init() {
    applyLegalModals();
    bindLegalButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
