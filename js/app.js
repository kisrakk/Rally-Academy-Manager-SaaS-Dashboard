(function () {
'use strict';
/* =========================================================
   Rally: tennis academy manager (front-end demo)
   Data lives in the browser (localStorage). In a real product
   the same functions would call an API backed by a database.
   ========================================================= */

// ---------- small helpers ----------
var $ = function (s, el) { return (el || document).querySelector(s); };
var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
var eur = { format: function (v) { return new Intl.NumberFormat(typeof LANG !== 'undefined' && LANG === 'es' ? 'es-ES' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: true }).format(v); } };
function pad(n) { return (n < 10 ? '0' : '') + n; }
function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function ym(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1); }
function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
function mondayOf(d) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); var wd = (x.getDay() + 6) % 7; return addDays(x, -wd); }
function monthLabel(key, long) { var p = key.split('-'); var out = new Date(+p[0], +p[1] - 1, 1).toLocaleDateString(LOC(), { month: long ? 'long' : 'short', year: long ? 'numeric' : undefined }); return out.charAt(0).toUpperCase() + out.slice(1); }
function toMin(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
function fromMin(m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); }
function initials(s) { return (s.first[0] + s.last[0]).toUpperCase(); }
function fullName(s) { return s.first + ' ' + s.last; }
var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
var LEVELS = ['Mini tennis', 'Beginner', 'Intermediate', 'Advanced', 'Competition'];
var FEES = { 'Mini tennis': 55, 'Beginner': 70, 'Intermediate': 85, 'Advanced': 105, 'Competition': 140 };
var COURTS = ['Court 1 · clay', 'Court 2 · clay', 'Court 3 · clay', 'Court 4 · hard', 'Court 5 · hard'];
var TODAY = new Date();


// ---------- English / Spanish ----------
// The interface is written in English. When Spanish is chosen, every piece of text on screen is
// looked up in these tables and swapped; the English original is kept so we can switch back.
var LANG = 'en';
try { if (localStorage.getItem('rally-lang') === 'es') LANG = 'es'; } catch (e) {}
function LOC() { return LANG === 'es' ? 'es-ES' : 'en-GB'; }
var ES_EXACT = {"Dashboard": "Panel", "Students": "Alumnos", "Schedule": "Horario", "Attendance": "Asistencia", "Payments": "Pagos", "Staff": "Equipo", "Academy manager": "Directora de la academia", "Reset demo data": "Restaurar datos de prueba", "Sign out": "Cerrar sesión", "Concept project by Kisrak Kulacoglu": "Proyecto conceptual de Kisrak Kulacoglu", "Add student": "Añadir alumno", "Take attendance": "Pasar lista", "Open schedule": "Ver horario", "Active students": "Alumnos activos", "joined this month": "nuevos este mes", "No new students this month": "Sin altas este mes", "Lessons per week": "Clases por semana", "Attendance · last 30 days": "Asistencia · últimos 30 días", "of booked places were used": "de las plazas reservadas se usaron", "Monthly revenue": "Ingresos mensuales", "Fees collected per month, last 6 months": "Cuotas cobradas por mes, últimos 6 meses", "The pale top on the last bar shows invoices for this month that are still to be paid.": "La parte clara de la última barra muestra las facturas de este mes que faltan por cobrar.", "Today’s lessons": "Clases de hoy", "Overdue payments": "Pagos vencidos", "Invoices from previous months still unpaid": "Facturas de meses anteriores sin pagar", "Overdue": "Vencido", "Mark paid": "Marcar pagado", "Students by level": "Alumnos por nivel", "Active students only": "Solo alumnos activos", "Mini tennis": "Minitenis", "Beginner": "Iniciación", "Intermediate": "Intermedio", "Advanced": "Avanzado", "Competition": "Competición", "Every lesson,": "Cada clase,", "every player,": "cada jugador,", "one court.": "una pista.", "Staff sign in": "Acceso del equipo", "Work email": "Email de trabajo", "Password": "Contraseña", "Sign in": "Entrar", "Demo: the details are filled in for you. Rally is a concept project by Kisrak Kulacoglu; there is no real account or server.": "Demo: los datos ya están rellenados. Rally es un proyecto conceptual de Kisrak Kulacoglu; no hay cuentas ni servidor reales.", "All levels": "Todos los niveles", "Any status": "Cualquier estado", "Active": "Activo", "Paused": "En pausa", "Age": "Edad", "Level": "Nivel", "Lessons": "Clases", "Monthly fee": "Cuota mensual", "Status": "Estado", "Paid": "Pagado", "Pending": "Pendiente", "This week": "Esta semana", "Add lesson": "Añadir clase", "Lesson": "Clase", "Session": "Sesión", "Present": "Presente", "Absent": "Ausente", "Mark all present": "Todos presentes", "Save attendance": "Guardar asistencia", "Still to collect": "Pendiente de cobro", "Overdue · all months": "Vencido · todos los meses", "Collection rate": "Tasa de cobro", "for the selected month": "en el mes seleccionado", "All statuses": "Todos los estados", "Student": "Alumno", "Month": "Mes", "Amount": "Importe", "Paid on": "Pagado el", "Method": "Método", "Bank transfer": "Transferencia", "Card": "Tarjeta", "Cash": "Efectivo", "lessons / week": "clases / semana", "on court": "en pista", "students": "alumnos", "Next lesson": "Próxima clase", "Phone": "Teléfono", "First name": "Nombre", "Last name": "Apellidos", "Enter a first name.": "Escribe un nombre.", "Enter a last name.": "Escribe los apellidos.", "Enter an age between 4 and 90.": "Escribe una edad entre 4 y 90.", "Enter a valid email, like name@example.com.": "Escribe un email válido, como nombre@ejemplo.com.", "Enter a phone number with at least 9 digits.": "Escribe un teléfono de al menos 9 dígitos.", "Students under 18 need a parent or guardian.": "Los menores de 18 años necesitan un padre, madre o tutor.", "Parent or guardian (under 18s)": "Padre, madre o tutor (menores de 18)", "Weekly lessons": "Clases semanales", "Choose at least one weekly lesson.": "Elige al menos una clase semanal.", "Monthly fee for this level:": "Cuota mensual de este nivel:", "Cancel": "Cancelar", "Save changes": "Guardar cambios", "Edit student": "Editar alumno", "Details": "Datos", "Joined": "Alta", "Payment history": "Historial de pagos", "Edit": "Editar", "Pause membership": "Pausar inscripción", "Reactivate": "Reactivar", "Delete": "Eliminar", "Keep student": "Conservar alumno", "Yes, delete": "Sí, eliminar", "When": "Cuándo", "Court": "Pista", "Coach": "Entrenador/a", "Keep lesson": "Conservar clase", "Lesson name": "Nombre de la clase", "Give the lesson a name.": "Ponle un nombre a la clase.", "Day": "Día", "Start time": "Hora de inicio", "Length": "Duración", "Record payment": "Registrar pago", "Date received": "Fecha de cobro", "In a live product, card payments would be taken through a payment provider such as Stripe and marked as paid automatically.": "En un producto real, los pagos con tarjeta se cobrarían con un proveedor como Stripe y se marcarían como pagados automáticamente.", "Mark as paid": "Marcar como pagado", "Not enrolled in any lesson.": "No está inscrito en ninguna clase.", "No invoices yet.": "Aún no hay facturas.", "Nobody enrolled yet.": "Aún no hay nadie inscrito.", "No students match these filters.": "Ningún alumno coincide con estos filtros.", "No invoices match these filters.": "Ninguna factura coincide con estos filtros.", "Everyone is up to date.": "Todo el mundo está al día.", "No lessons today. Enjoy the quiet courts.": "Hoy no hay clases. Disfruta de las pistas tranquilas.", "No active students in this lesson.": "No hay alumnos activos en esta clase.", "Guardian": "Tutor", "No sessions yet": "Aún sin sesiones", "Good morning,": "Buenos días,", "Good afternoon,": "Buenas tardes,", "Good evening,": "Buenas noches,", "Monthly fee:": "Cuota mensual:", "Weekly lessons ": "Clases semanales", "Changes saved.": "Cambios guardados.", "Lesson added to the schedule.": "Clase añadida al horario.", "Lesson updated.": "Clase actualizada.", "Attendance saved.": "Asistencia guardada.", "Lesson deleted.": "Clase eliminada.", "Demo data restored.": "Datos de prueba restaurados.", "Enter your work email.": "Escribe tu email de trabajo.", "Forgot your password?": "¿Has olvidado tu contraseña?", "Enter your work email and we’ll send you a link to choose a new password.": "Escribe tu email de trabajo y te enviaremos un enlace para elegir una contraseña nueva.", "Send reset link": "Enviar enlace", "← Back to sign in": "← Volver a entrar", "Your password has at least 6 characters.": "La contraseña tiene al menos 6 caracteres.", "no attendance yet": "sin asistencia aún", "Main navigation": "Navegación principal", "Open navigation": "Abrir navegación", "Switch light or dark theme": "Cambiar tema claro u oscuro", "Welcome": "Bienvenida", "Key figures": "Cifras clave", "Search by name, email or phone": "Buscar por nombre, email o teléfono", "Search students": "Buscar alumnos", "Filter by level": "Filtrar por nivel", "Filter by status": "Filtrar por estado", "Previous week": "Semana anterior", "Next week": "Semana siguiente", "Last sessions": "Últimas sesiones", "Payment summary": "Resumen de pagos", "Search student": "Buscar alumno", "Search payments by student": "Buscar pagos por alumno", "Payment status": "Estado del pago", "Close": "Cerrar", "Language": "Idioma", "Rally, dashboard": "Rally, panel", "Sign in to Rally": "Entrar en Rally", "e.g. Intermediate · adults": "p. ej. Intermedio · adultos", "Academy figures": "Cifras de la academia"};
var ES_PHRASES = [["Mini tennis · group", "Minitenis · grupo"], ["Beginners · adults", "Iniciación · adultos"], ["Competition squad", "Equipo de competición"], ["Intermediate · juniors", "Intermedio · juniors"], ["Intermediate · adults", "Intermedio · adultos"], ["Advanced · adults", "Avanzado · adultos"], ["Footwork lab", "Taller de juego de pies"], ["Saturday juniors", "Juniors del sábado"], ["Match play", "Partidos"], ["Conditioning circuit", "Circuito físico"], ["Head coach", "Entrenador principal"], ["Fitness coach", "Preparadora física"], ["Coach · ", "Entrenador/a · "], ["Competition & tactics", "Competición y táctica"], ["Juniors & mini tennis", "Juniors y minitenis"], ["Adult beginners", "Adultos principiantes"], ["Footwork & conditioning", "Juego de pies y preparación física"], [" · clay", " · tierra batida"], [" · hard", " · rápida"], [" · paid ", " · pagado el "], [" by bank transfer", " por transferencia"], [" by card", " con tarjeta"], [" by cash", " en efectivo"], [" by bizum", " por Bizum"], [" / week", " / semana"], [" · saved", " · guardada"], [" · not taken yet", " · sin pasar lista"], ["(today)", "(hoy)"], [" collected", " cobrado"], [" still due", " pendiente"], ["Mini tennis", "Minitenis"], ["Beginner", "Iniciación"], ["Intermediate", "Intermedio"], ["Advanced", "Avanzado"], ["Competition", "Competición"]];
var ES_REGEX = [["^If (.+) has a Rally account, a reset link is on its way\\. \\(Demo: no email is sent\\. Use the password already filled in\\.\\)$", "Si $1 tiene una cuenta en Rally, te llegará un enlace para restablecerla. (Demo: no se envía ningún email. Usa la contraseña que ya está rellenada.)"], ["^Student ([↑↓])$", "Alumno $1"], ["^Age ([↑↓])$", "Edad $1"], ["^Level ([↑↓])$", "Nivel $1"], ["^Monthly fee ([↑↓])$", "Cuota mensual $1"], ["^Attendance ([↑↓])$", "Asistencia $1"], ["^Collected in (.+)$", "Cobrado en $1"], ["^(\\d+) overdue$", "$1 vencidos"], ["^1 lesson today$", "1 clase hoy"], ["^(\\d+) lessons today$", "$1 clases hoy"], ["^1 overdue payment$", "1 pago vencido"], ["^(\\d+) overdue payments$", "$1 pagos vencidos"], ["^(\\d+)% attendance$", "$1% de asistencia"], ["^across (\\d+) courts and (\\d+) coaches$", "en $1 pistas y $2 entrenadores"], ["^Collected in (.+)$", "Cobrado en $1"], ["^of (.+) invoiced$", "de $1 facturado"], ["^(.+) · 1 scheduled$", "$1 · 1 programada"], ["^(.+) · (\\d+) scheduled$", "$1 · $2 programadas"], ["\\bCourt (\\d)\\b", "Pista $1"], ["\\b(\\d+) students\\b", "$1 alumnos"], ["^(\\d+) of (\\d+) present$", "$1 de $2 presentes"], ["^Collected · (.+)$", "Cobrado · $1"], ["^1 invoices? paid$", "1 factura pagada"], ["^(\\d+) invoices paid$", "$1 facturas pagadas"], ["^1 invoices? open$", "1 factura abierta"], ["^(\\d+) invoices open$", "$1 facturas abiertas"], ["^(.+) in total$", "$1 en total"], ["^Create (\\d+) invoices? for (.+)$", "Crear $1 factura(s) de $2"], ["^(\\d+)% in their lessons$", "$1% en sus clases"], ["^(\\d+)% in the last 30 days$", "$1% en los últimos 30 días"], ["^(\\d+) years$", "$1 años"], ["^Every (\\S+), (.+)$", "Cada $1, $2"], ["\\b(\\d+) minutes\\b", "$1 minutos"], ["^Delete (.+) and their payment history\\? This can’t be undone\\.$", "¿Eliminar a $1 y su historial de pagos? No se puede deshacer."], ["^Delete “(.+)” from the weekly schedule\\? Students stay enrolled in their other lessons\\.$", "¿Eliminar “$1” del horario semanal? Los alumnos siguen inscritos en sus otras clases."], ["^This overlaps with “(.+)” \\((.+)\\)\\. Pick another time, court or coach\\.$", "Se solapa con “$1” ($2). Elige otra hora, pista o entrenador/a."], ["^The club closes at (\\d+):00\\. Choose an earlier start or a shorter lesson\\.$", "El club cierra a las $1:00. Elige una hora anterior o una clase más corta."], ["^(.+) added\\. First invoice created\\.$", "$1 añadido. Primera factura creada."], ["^(\\d+) invoices? created\\.$", "$1 factura(s) creada(s)."], ["^Payment recorded for (.+)\\.$", "Pago registrado para $1."], ["^(.+) is active again\\.$", "$1 vuelve a estar activo."], ["^(.+) is paused\\.$", "$1 está en pausa."], ["^(.+) deleted\\.$", "$1 eliminado."], ["^Attendance for (.+)$", "Asistencia de $1"], ["^Revenue per month: (.+)$", "Ingresos por mes: $1"], ["^(\\d{4}-\\d\\d-\\d\\d) present$", "$1 presente"], ["^(\\d{4}-\\d\\d-\\d\\d) absent$", "$1 ausente"], ["^(\\d{4}-\\d\\d-\\d\\d) no record$", "$1 sin registro"], ["\\bMon\\b", "Lun"], ["\\bTue\\b", "Mar"], ["\\bWed\\b", "Mié"], ["\\bThu\\b", "Jue"], ["\\bFri\\b", "Vie"], ["\\bSat\\b", "Sáb"], ["\\bSun\\b", "Dom"]].map(function (r) { return [new RegExp(r[0]), r[1]]; });
function toEs(str) {
  var lead = str.match(/^\s*/)[0], trail = str.match(/\s*$/)[0], t = str.trim();
  if (!t) return str;
  if (ES_EXACT[t]) return lead + ES_EXACT[t] + trail;
  ES_REGEX.forEach(function (r) { t = t.replace(r[0], r[1]); });
  ES_PHRASES.forEach(function (p) { t = t.split(p[0]).join(p[1]); });
  return lead + t + trail;
}
var ATTRS = ['placeholder', 'aria-label', 'title'];
function translate(root) {
  if (!root) return;
  if (LANG === 'en') {
    // switching back: restore every English original we kept
    var w0 = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n0;
    while ((n0 = w0.nextNode())) if (n0.__en != null) { n0.nodeValue = n0.__en; n0.__en = null; }
    if (root.querySelectorAll) Array.prototype.forEach.call(root.querySelectorAll('[data-en-attrs]'), function (el) { var o = JSON.parse(el.getAttribute('data-en-attrs')); Object.keys(o).forEach(function (a) { el.setAttribute(a, o[a]); }); el.removeAttribute('data-en-attrs'); });
    return;
  }
  var w = document.createTreeWalker(root.nodeType === 3 ? root.parentNode : root, NodeFilter.SHOW_TEXT), n;
  while ((n = w.nextNode())) {
    if (n.parentNode && /^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)) continue;
    if (n.__en != null && n.__es === n.nodeValue) continue;
    var en = n.nodeValue, es = toEs(en);
    if (es !== en) { n.__en = en; n.nodeValue = es; n.__es = es; }
  }
  var els = root.querySelectorAll ? [root].concat(Array.prototype.slice.call(root.querySelectorAll('*'))) : [];
  els.forEach(function (el) {
    if (!el.getAttribute) return;
    var kept = el.getAttribute('data-en-attrs') ? JSON.parse(el.getAttribute('data-en-attrs')) : {};
    var changed = false;
    ATTRS.forEach(function (a) { var v = el.getAttribute(a); if (!v || kept[a]) return; var es = toEs(v); if (es !== v) { kept[a] = v; el.setAttribute(a, es); changed = true; } });
    if (changed) el.setAttribute('data-en-attrs', JSON.stringify(kept));
  });
}
// translate anything the app draws later (tables, dialogs, toasts, tooltips)
var mo = new MutationObserver(function (records) {
  if (LANG === 'en') return;
  mo.disconnect();
  records.forEach(function (r) { if (r.type === 'childList') Array.prototype.forEach.call(r.addedNodes, function (x) { translate(x.nodeType === 1 ? x : x.parentNode); }); else if (r.type === 'characterData') translate(r.target.parentNode); });
  watch();
});
function watch() { mo.observe(document.body, { childList: true, subtree: true, characterData: true }); }
function setLang(l) {
  LANG = l; try { localStorage.setItem('rally-lang', l); } catch (e) {}
  document.documentElement.lang = l;
  $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === l); });
  $('#today').textContent = TODAY.toLocaleDateString(LOC(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  mo.disconnect(); translate(document.body); render(); translate(document.body); if (LANG === 'es') watch();
}

// ---------- seeded demo data ----------
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function seed() {
  var r = rng(2026);
  var coaches = [
    { id: 'c1', name: 'Javier Soler', role: 'Head coach', specialty: 'Competition & tactics', email: 'javier@albuferatennis.es', phone: '+34 600 111 201', color: 'var(--c1)' },
    { id: 'c2', name: 'Lucía Ferrer', role: 'Coach', specialty: 'Juniors & mini tennis', email: 'lucia@albuferatennis.es', phone: '+34 600 111 202', color: 'var(--c2)' },
    { id: 'c3', name: 'Tom Hughes', role: 'Coach', specialty: 'Adult beginners', email: 'tom@albuferatennis.es', phone: '+34 600 111 203', color: 'var(--c3)' },
    { id: 'c4', name: 'Aylin Demir', role: 'Fitness coach', specialty: 'Footwork & conditioning', email: 'aylin@albuferatennis.es', phone: '+34 600 111 204', color: 'var(--c4)' }
  ];
  var lessons = [
    { id: 'l1', title: 'Mini tennis · group A', level: 'Mini tennis', coach: 'c2', court: 0, day: 0, start: '17:00', dur: 60 },
    { id: 'l2', title: 'Beginners · adults', level: 'Beginner', coach: 'c3', court: 3, day: 0, start: '19:00', dur: 90 },
    { id: 'l3', title: 'Competition squad', level: 'Competition', coach: 'c1', court: 1, day: 0, start: '18:00', dur: 120 },
    { id: 'l4', title: 'Intermediate · juniors', level: 'Intermediate', coach: 'c2', court: 2, day: 1, start: '17:30', dur: 90 },
    { id: 'l5', title: 'Footwork lab', level: 'Advanced', coach: 'c4', court: 4, day: 1, start: '19:00', dur: 60 },
    { id: 'l6', title: 'Advanced · adults', level: 'Advanced', coach: 'c1', court: 0, day: 2, start: '19:30', dur: 90 },
    { id: 'l7', title: 'Mini tennis · group B', level: 'Mini tennis', coach: 'c2', court: 3, day: 2, start: '17:00', dur: 60 },
    { id: 'l8', title: 'Beginners · adults', level: 'Beginner', coach: 'c3', court: 3, day: 3, start: '19:00', dur: 90 },
    { id: 'l9', title: 'Competition squad', level: 'Competition', coach: 'c1', court: 1, day: 3, start: '18:00', dur: 120 },
    { id: 'l10', title: 'Intermediate · adults', level: 'Intermediate', coach: 'c3', court: 2, day: 4, start: '18:30', dur: 90 },
    { id: 'l11', title: 'Match play', level: 'Advanced', coach: 'c1', court: 0, day: 5, start: '10:00', dur: 120 },
    { id: 'l12', title: 'Saturday juniors', level: 'Beginner', coach: 'c2', court: 2, day: 5, start: '09:30', dur: 90 },
    { id: 'l13', title: 'Conditioning circuit', level: 'Competition', coach: 'c4', court: 4, day: 5, start: '12:00', dur: 60 }
  ];
  var firsts = ['Lucas', 'Martina', 'Hugo', 'Sofía', 'Mateo', 'Valeria', 'Leo', 'Paula', 'Daniel', 'Carla', 'Álvaro', 'Noa', 'Emma', 'Pablo', 'Irene', 'Marco', 'Julia', 'Nora', 'Adrián', 'Elif', 'Oliver', 'Chloé', 'Iker', 'Lara', 'Samuel', 'Inés', 'Mia', 'David'];
  var lasts = ['García', 'Martínez', 'López', 'Navarro', 'Romero', 'Torres', 'Vidal', 'Moreno', 'Ortega', 'Serrano', 'Peris', 'Bennett', 'Yılmaz', 'Dubois', 'Castillo', 'Ramos'];
  var ages = { 'Mini tennis': [6, 9], 'Beginner': [10, 52], 'Intermediate': [12, 48], 'Advanced': [15, 44], 'Competition': [13, 19] };
  var students = [];
  for (var i = 0; i < 28; i++) {
    var level = LEVELS[i < 5 ? 0 : i < 12 ? 1 : i < 19 ? 2 : i < 24 ? 3 : 4];
    var a = ages[level], age = a[0] + Math.floor(r() * (a[1] - a[0] + 1));
    var first = firsts[i], last = lasts[Math.floor(r() * lasts.length)];
    var joinedMonthsAgo = i < 3 ? 0 : 1 + Math.floor(r() * 16);
    var joined = new Date(TODAY.getFullYear(), TODAY.getMonth() - joinedMonthsAgo, 1 + Math.floor(r() * 26));
    if (joined > TODAY) joined = addDays(TODAY, -2);
    var slug = (first + '.' + last).toLowerCase().normalize('NFD').replace(/[^a-z.]/g, '');
    var st = { id: 's' + (i + 1), first: first, last: last, age: age, level: level, status: (i === 9 || i === 17) ? 'paused' : 'active',
      email: slug + '@mail.com', phone: '+34 6' + Math.floor(10000000 + r() * 89999999), guardian: age < 18 ? 'Parent of ' + first : '',
      joined: iso(joined), fee: FEES[level], lessons: [] };
    var options = lessons.filter(function (l) { return l.level === level; });
    st.lessons.push(options[Math.floor(r() * options.length)].id);
    if (options.length > 1 && r() > 0.45) { var o2 = options[Math.floor(r() * options.length)].id; if (st.lessons.indexOf(o2) < 0) st.lessons.push(o2); }
    students.push(st);
  }
  // payments: one invoice per active student per month, last 6 months
  var payments = [], pid = 1, methods = ['Card', 'Bank transfer', 'Cash', 'Card'];
  for (var m = 5; m >= 0; m--) {
    var month = ym(new Date(TODAY.getFullYear(), TODAY.getMonth() - m, 1));
    students.forEach(function (s) {
      if (s.joined.slice(0, 7) > month) return;
      if (s.status === 'paused' && m < 2) return;
      var status = 'paid';
      if (m === 0 && r() < 0.42) status = 'pending';
      if (m === 1 && r() < 0.12) status = 'pending';
      var pd = new Date(+month.slice(0, 4), +month.slice(5) - 1, 1 + Math.floor(r() * 9));
      if (pd > TODAY) pd = TODAY;
      payments.push({ id: 'p' + pid++, student: s.id, month: month, amount: s.fee, status: status, paidOn: status === 'paid' ? iso(pd) : '', method: status === 'paid' ? methods[Math.floor(r() * methods.length)] : '' });
    });
  }
  // attendance: past four weeks of sessions
  var attendance = {};
  var mon = mondayOf(TODAY);
  for (var w = -4; w <= 0; w++) {
    lessons.forEach(function (l) {
      var d = addDays(mon, w * 7 + l.day);
      if (iso(d) >= iso(TODAY)) return;
      var rec = {};
      students.forEach(function (s) { if (s.status === 'active' && s.lessons.indexOf(l.id) >= 0 && s.joined <= iso(d)) rec[s.id] = r() < 0.87; });
      if (Object.keys(rec).length) attendance[l.id + '|' + iso(d)] = rec;
    });
  }
  return { v: 1, coaches: coaches, lessons: lessons, students: students, payments: payments, attendance: attendance, seq: 100 };
}

// ---------- state & storage ----------
var KEY = 'rally-academy-v1', S;
function load() { try { var raw = localStorage.getItem(KEY); if (raw) { S = JSON.parse(raw); if (S && S.v === 1) return; } } catch (e) {} S = seed(); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function nid(p) { S.seq += 1; return p + S.seq; }
load();

// ---------- derived data ----------
function student(id) { return S.students.filter(function (s) { return s.id === id; })[0]; }
function coach(id) { return S.coaches.filter(function (c) { return c.id === id; })[0]; }
function lesson(id) { return S.lessons.filter(function (l) { return l.id === id; })[0]; }
function active() { return S.students.filter(function (s) { return s.status === 'active'; }); }
function enrolled(lessonId) { return S.students.filter(function (s) { return s.lessons.indexOf(lessonId) >= 0 && s.status === 'active'; }); }
function payState(p) { if (p.status === 'paid') return 'paid'; return p.month < ym(TODAY) ? 'overdue' : 'pending'; }
function attRate(studentId, days) {
  var since = iso(addDays(TODAY, -(days || 30))), yes = 0, all = 0;
  Object.keys(S.attendance).forEach(function (k) {
    var d = k.split('|')[1]; if (d < since) return;
    var rec = S.attendance[k];
    Object.keys(rec).forEach(function (sid) { if (studentId && sid !== studentId) return; all++; if (rec[sid]) yes++; });
  });
  return all ? Math.round(yes / all * 100) : null;
}
function studentPayStatus(s) {
  var ps = S.payments.filter(function (p) { return p.student === s.id; });
  if (ps.some(function (p) { return payState(p) === 'overdue'; })) return 'overdue';
  if (ps.some(function (p) { return payState(p) === 'pending'; })) return 'pending';
  return 'paid';
}
var PAY_PILL = {
  paid: '<span class="pill st-good"><svg><use href="#i-ok"/></svg>Paid</span>',
  pending: '<span class="pill st-warn"><svg><use href="#i-clock"/></svg>Pending</span>',
  overdue: '<span class="pill st-crit"><svg><use href="#i-alert"/></svg>Overdue</span>'
};
function levelPill(l) { return '<span class="pill">' + esc(l) + '</span>'; }
function statusPill(s) { return s === 'active' ? '<span class="pill st-good"><svg><use href="#i-ok"/></svg>Active</span>' : '<span class="pill st-mute">Paused</span>'; }

// ---------- UI: toast, modal, drawer ----------
var layer = $('#layer'), lastFocus = null;
function toast(msg) { var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2600); }
function openLayer(html, cls) {
  lastFocus = document.activeElement;
  layer.innerHTML = '<div class="scrim ' + (cls || '') + '" data-close>' + html + '</div>';
  var first = layer.querySelector('input,select,textarea,button:not([data-x])') || layer.querySelector('button');
  if (first) setTimeout(function () { first.focus(); }, 30);
}
function closeLayer() { layer.innerHTML = ''; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
layer.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close') || e.target.closest('[data-x]')) closeLayer(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && layer.innerHTML) closeLayer(); });
function modal(title, body, foot) {
  return '<div class="modal" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><div class="modal-h"><h3>' + esc(title) + '</h3><button class="icon-btn" data-x aria-label="Close"><svg><use href="#i-x"/></svg></button></div>' + body + (foot ? '<div class="modal-f">' + foot + '</div>' : '') + '</div>';
}
function setErr(form, name, msg) { var f = form.querySelector('[data-f="' + name + '"]'); if (!f) return; f.classList.toggle('invalid', !!msg); f.querySelector('.err').textContent = msg || ''; }

// ---------- router ----------
var VIEWS = { dashboard: 'Dashboard', students: 'Students', schedule: 'Schedule', attendance: 'Attendance', payments: 'Payments', staff: 'Staff' };
var ui = { q: '', level: 'all', status: 'all', sort: 'name', dir: 1, week: 0, payMonth: ym(TODAY), payStatus: 'all', payQ: '', attLesson: null, attDate: null };
function current() { var h = location.hash.replace('#', ''); return VIEWS[h] ? h : 'dashboard'; }
function render() {
  var v = current();
  $('#title').textContent = VIEWS[v];
  $$('#nav a').forEach(function (a) { if (a.dataset.view === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  $('#nav-students').textContent = active().length;
  var od = S.payments.filter(function (p) { return payState(p) === 'overdue'; }).length;
  $('#nav-overdue').textContent = od ? od + ' overdue' : '';
  $('#view').innerHTML = R[v]();
  if (R[v + 'After']) R[v + 'After']();
}
window.addEventListener('hashchange', function () { closeSide(); render(); $('#view').focus({ preventScroll: true }); window.scrollTo(0, 0); });
$('#today').textContent = TODAY.toLocaleDateString(LOC(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

var R = {};

// ================= DASHBOARD =================
R.dashboard = function () {
  var act = active(), thisMonth = ym(TODAY);
  var newThisMonth = act.filter(function (s) { return s.joined.slice(0, 7) === thisMonth; }).length;
  var weekCount = S.lessons.length;
  var rate = attRate(null, 30);
  var mp = S.payments.filter(function (p) { return p.month === thisMonth; });
  var collected = mp.filter(function (p) { return p.status === 'paid'; }).reduce(function (a, p) { return a + p.amount; }, 0);
  var expected = mp.reduce(function (a, p) { return a + p.amount; }, 0);
  var todayIdx = (TODAY.getDay() + 6) % 7;
  var todays = S.lessons.filter(function (l) { return l.day === todayIdx; }).sort(function (a, b) { return toMin(a.start) - toMin(b.start); });
  var overdue = S.payments.filter(function (p) { return payState(p) === 'overdue'; });
  var byLevel = LEVELS.map(function (l) { return [l, act.filter(function (s) { return s.level === l; }).length]; });
  var maxL = Math.max.apply(null, byLevel.map(function (x) { return x[1]; })) || 1;
  var hr = TODAY.getHours(), greet = hr < 12 ? 'Good morning' : hr < 20 ? 'Good afternoon' : 'Good evening';
  return '' +
  '<section class="hero" aria-label="Welcome"><img src="img/aerial-shadow.jpg" alt="Aerial view of a tennis player and her long shadow on a green court"><div class="hero-in"><span class="eyebrow">' + TODAY.toLocaleDateString(LOC(), { weekday: 'long', day: 'numeric', month: 'long' }) + '</span><h2>' + greet + ', <span class="script">Marta</span></h2><p>' + todays.length + ' lesson' + (todays.length === 1 ? '' : 's') + ' today<span class="ball-dot"></span>' + overdue.length + ' overdue payment' + (overdue.length === 1 ? '' : 's') + '<span class="ball-dot"></span>' + (rate == null ? 'no attendance yet' : rate + '% attendance') + '</p><div class="toolbar">' + (todays.length ? '<button class="btn btn-lime" data-take="' + todays[0].id + '">Take attendance</button>' : '') + '<a class="btn" href="#schedule">Open schedule</a></div></div></section>' +
  '<section class="kpis" aria-label="Key figures">' +
    '<div class="card kpi"><span class="lbl">Active students</span><span class="val num">' + act.length + '</span><span class="sub">' + (newThisMonth ? '<span class="delta-up">+' + newThisMonth + '</span> joined this month' : 'No new students this month') + '</span></div>' +
    '<div class="card kpi"><span class="lbl">Lessons per week</span><span class="val num">' + weekCount + '</span><span class="sub">across ' + COURTS.length + ' courts and ' + S.coaches.length + ' coaches</span></div>' +
    '<div class="card kpi"><span class="lbl">Attendance · last 30 days</span><span class="val num">' + (rate == null ? '—' : rate + '%') + '</span><span class="sub">of booked places were used</span></div>' +
    '<div class="card kpi"><span class="lbl">Collected in ' + monthLabel(thisMonth, true).split(' ')[0] + '</span><span class="val num">' + eur.format(collected) + '</span><span class="sub">of ' + eur.format(expected) + ' invoiced</span></div>' +
  '</section>' +
  '<div class="grid-2">' +
    '<section class="card" aria-labelledby="rev-h"><div class="card-h"><div><h2 id="rev-h">Monthly revenue</h2><p>Fees collected per month, last 6 months</p></div><a class="btn btn-sm" href="#payments">Payments</a></div><div class="card-b"><div class="chart" id="rev-chart"></div></div></section>' +
    '<section class="card" aria-labelledby="today-h"><div class="card-h"><div><h2 id="today-h">Today’s lessons</h2><p>' + DAYS[todayIdx] + ' · ' + todays.length + ' scheduled</p></div><a class="btn btn-sm" href="#schedule">Schedule</a></div><div class="card-b">' +
      (todays.length ? '<ul class="list">' + todays.map(function (l) { var c = coach(l.coach); return '<li><span class="time">' + l.start + '</span><span class="dot" style="background:' + c.color + '"></span><div class="t"><b>' + esc(l.title) + '</b><span>' + esc(COURTS[l.court]) + ' · ' + esc(c.name) + ' · ' + enrolled(l.id).length + ' students</span></div><button class="btn btn-sm" data-take="' + l.id + '">Attendance</button></li>'; }).join('') + '</ul>' : '<p class="empty">No lessons today. Enjoy the quiet courts.</p>') +
    '</div></section>' +
  '</div>' +
  '<div class="grid-2">' +
    '<section class="card" aria-labelledby="od-h"><div class="card-h"><div><h2 id="od-h">Overdue payments</h2><p>Invoices from previous months still unpaid</p></div></div><div class="card-b">' +
      (overdue.length ? '<ul class="list">' + overdue.map(function (p) { var s = student(p.student); return '<li><span class="avatar">' + initials(s) + '</span><div class="t"><b>' + esc(fullName(s)) + '</b><span>' + monthLabel(p.month, true) + ' · ' + eur.format(p.amount) + '</span></div>' + PAY_PILL.overdue + '<button class="btn btn-sm" data-pay="' + p.id + '">Mark paid</button></li>'; }).join('') + '</ul>' : '<p class="empty">Everyone is up to date.</p>') +
    '</div></section>' +
    '<section class="card" aria-labelledby="lv-h"><div class="card-h"><div><h2 id="lv-h">Students by level</h2><p>Active students only</p></div></div><div class="card-b"><div class="hbars">' +
      byLevel.map(function (x) { return '<div class="hbar"><span>' + esc(x[0]) + '</span><span class="track"><span class="fill" style="width:' + (x[1] / maxL * 100) + '%"></span></span><b class="num r">' + x[1] + '</b></div>'; }).join('') +
    '</div></div></section>' +
  '</div>';
};
R.dashboardAfter = function () { revenueChart($('#rev-chart')); };

function revenueChart(el) {
  var months = [];
  for (var i = 5; i >= 0; i--) months.push(ym(new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1)));
  var data = months.map(function (m) {
    var ps = S.payments.filter(function (p) { return p.month === m; });
    return { m: m, paid: ps.filter(function (p) { return p.status === 'paid'; }).reduce(function (a, p) { return a + p.amount; }, 0), all: ps.reduce(function (a, p) { return a + p.amount; }, 0) };
  });
  var W = 640, H = 240, L = 48, B = 28, T = 10, max = Math.max.apply(null, data.map(function (d) { return d.all; }));
  var step = max > 2000 ? 500 : 250, top = Math.ceil(max / step) * step || step;
  var y = function (v) { return T + (H - T - B) * (1 - v / top); };
  var bw = (W - L) / data.length, barW = Math.min(44, bw * 0.5);
  var g = '';
  for (var v = 0; v <= top; v += step) g += '<line class="gl" x1="' + L + '" x2="' + W + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text class="axis" x="' + (L - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end">€' + (v >= 1000 ? (v / 1000) + 'k' : v) + '</text>';
  var bars = data.map(function (d, i) {
    var cx = L + bw * i + bw / 2, x = cx - barW / 2, h = (H - T - B) - (y(d.paid) - T), last = i === data.length - 1;
    var ghost = last && d.all > d.paid ? '<path class="bar ghost" d="' + rbar(x, y(d.all), barW, y(d.paid) - y(d.all), 0) + '"/>' : '';
    return ghost + '<path class="bar" data-i="' + i + '" d="' + rbar(x, y(d.paid), barW, h, 4) + '"/>' +
      '<text class="axis" x="' + cx + '" y="' + (H - 8) + '" text-anchor="middle">' + monthLabel(d.m).split(' ')[0] + '</text>' +
      '<rect class="hit" data-i="' + i + '" x="' + (L + bw * i) + '" y="' + T + '" width="' + bw + '" height="' + (H - T - B) + '"/>';
  }).join('');
  el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Revenue per month: ' + data.map(function (d) { return monthLabel(d.m, true) + ' ' + eur.format(d.paid); }).join(', ') + '">' + g + bars + '</svg><div class="tip" hidden></div>' +
    '<p class="muted" style="margin:8px 0 0;font-size:12px">The pale top on the last bar shows invoices for this month that are still to be paid.</p>';
  var tip = el.querySelector('.tip'), svg = el.querySelector('svg');
  function show(i) {
    var d = data[i];
    $$('.bar', el).forEach(function (b) { b.classList.toggle('on', b.dataset.i == i); });
    tip.innerHTML = '<b>' + monthLabel(d.m, true) + '</b>' + eur.format(d.paid) + ' collected' + (d.all > d.paid ? '<br>' + eur.format(d.all - d.paid) + ' still due' : '');
    var box = svg.getBoundingClientRect(), sx = box.width / W;
    tip.style.left = ((L + bw * i + bw / 2) * sx) + 'px'; tip.style.top = (y(d.all) * sx) + 'px'; tip.hidden = false;
  }
  $$('.hit', el).forEach(function (h) { h.addEventListener('mouseenter', function () { show(+h.dataset.i); }); h.addEventListener('click', function () { show(+h.dataset.i); }); });
  svg.addEventListener('mouseleave', function () { tip.hidden = true; $$('.bar', el).forEach(function (b) { b.classList.remove('on'); }); });
}
function rbar(x, y, w, h, r) { if (h <= 0) return ''; r = Math.min(r, h, w / 2); return 'M' + x + ',' + (y + h) + 'V' + (y + r) + 'Q' + x + ',' + y + ' ' + (x + r) + ',' + y + 'H' + (x + w - r) + 'Q' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + r) + 'V' + (y + h) + 'Z'; }

// ================= STUDENTS =================
R.students = function () {
  return '<div class="toolbar">' +
    '<label class="search grow"><svg><use href="#i-search"/></svg><input class="input" id="q" type="search" placeholder="Search by name, email or phone" aria-label="Search students" value="' + esc(ui.q) + '"></label>' +
    '<select class="select" id="f-level" aria-label="Filter by level" style="width:auto"><option value="all">All levels</option>' + LEVELS.map(function (l) { return '<option' + (ui.level === l ? ' selected' : '') + '>' + l + '</option>'; }).join('') + '</select>' +
    '<select class="select" id="f-status" aria-label="Filter by status" style="width:auto"><option value="all">Any status</option><option value="active"' + (ui.status === 'active' ? ' selected' : '') + '>Active</option><option value="paused"' + (ui.status === 'paused' ? ' selected' : '') + '>Paused</option></select>' +
    '<button class="btn btn-primary" data-add-student><svg><use href="#i-plus"/></svg>Add student</button>' +
  '</div>' +
  '<section class="card"><div class="table-wrap" id="st-table"></div></section>';
};
R.studentsAfter = function () {
  var draw = function () {
    var q = ui.q.trim().toLowerCase();
    var rows = S.students.filter(function (s) {
      if (ui.level !== 'all' && s.level !== ui.level) return false;
      if (ui.status !== 'all' && s.status !== ui.status) return false;
      if (q && (fullName(s) + ' ' + s.email + ' ' + s.phone).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var key = { name: function (s) { return (s.last + s.first).toLowerCase(); }, age: function (s) { return s.age; }, level: function (s) { return LEVELS.indexOf(s.level); }, fee: function (s) { return s.fee; }, att: function (s) { var a = attRate(s.id, 30); return a == null ? -1 : a; } }[ui.sort];
    rows.sort(function (a, b) { var x = key(a), y = key(b); return (x > y ? 1 : x < y ? -1 : 0) * ui.dir; });
    var th = function (k, label, cls) { var arrow = ui.sort === k ? (ui.dir > 0 ? ' ↑' : ' ↓') : ''; return '<th class="' + (cls || '') + '" aria-sort="' + (ui.sort === k ? (ui.dir > 0 ? 'ascending' : 'descending') : 'none') + '"><button data-sort="' + k + '">' + label + arrow + '</button></th>'; };
    $('#st-table').innerHTML = rows.length ? '<table><thead><tr>' + th('name', 'Student') + th('age', 'Age', 'num') + th('level', 'Level') + '<th>Lessons</th>' + th('fee', 'Monthly fee', 'r') + th('att', 'Attendance', 'r') + '<th>Payments</th><th>Status</th></tr></thead><tbody>' +
      rows.map(function (s) {
        var a = attRate(s.id, 30);
        return '<tr class="click" data-open="' + s.id + '" tabindex="0"><td><div class="who"><span class="avatar">' + initials(s) + '</span><div><b>' + esc(fullName(s)) + '</b><span>' + esc(s.email) + '</span></div></div></td><td class="num">' + s.age + '</td><td>' + levelPill(s.level) + '</td><td>' + s.lessons.length + ' / week</td><td class="r num">' + eur.format(s.fee) + '</td><td class="r num">' + (a == null ? '—' : a + '%') + '</td><td>' + PAY_PILL[studentPayStatus(s)] + '</td><td>' + statusPill(s.status) + '</td></tr>';
      }).join('') + '</tbody></table>' : '<p class="empty">No students match these filters.</p>';
  };
  draw();
  $('#q').addEventListener('input', function (e) { ui.q = e.target.value; draw(); });
  $('#f-level').addEventListener('change', function (e) { ui.level = e.target.value; draw(); });
  $('#f-status').addEventListener('change', function (e) { ui.status = e.target.value; draw(); });
  $('#st-table').addEventListener('click', function (e) {
    var s = e.target.closest('[data-sort]'); if (s) { var k = s.dataset.sort; if (ui.sort === k) ui.dir *= -1; else { ui.sort = k; ui.dir = 1; } draw(); return; }
    var r = e.target.closest('[data-open]'); if (r) studentDrawer(r.dataset.open);
  });
  $('#st-table').addEventListener('keydown', function (e) { var r = e.target.closest('[data-open]'); if (r && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); studentDrawer(r.dataset.open); } });
};

function studentDrawer(id) {
  var s = student(id); if (!s) return;
  var a = attRate(s.id, 30);
  var pays = S.payments.filter(function (p) { return p.student === s.id; }).sort(function (x, y) { return x.month < y.month ? 1 : -1; });
  var ls = s.lessons.map(lesson).filter(Boolean);
  openLayer('<aside class="drawer" role="dialog" aria-modal="true" aria-label="' + esc(fullName(s)) + '">' +
    '<div class="drawer-sec" style="flex-direction:row;align-items:center"><span class="avatar lg">' + initials(s) + '</span><div style="flex:1;min-width:0"><b style="font:600 20px var(--display)">' + esc(fullName(s)) + '</b><div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">' + levelPill(s.level) + statusPill(s.status) + '</div></div><button class="icon-btn" data-x aria-label="Close"><svg><use href="#i-x"/></svg></button></div>' +
    '<div class="drawer-sec"><h4>Details</h4><dl class="kv"><dt>Age</dt><dd>' + s.age + '</dd><dt>Email</dt><dd>' + esc(s.email) + '</dd><dt>Phone</dt><dd>' + esc(s.phone) + '</dd>' + (s.guardian ? '<dt>Guardian</dt><dd>' + esc(s.guardian) + '</dd>' : '') + '<dt>Joined</dt><dd>' + new Date(s.joined).toLocaleDateString(LOC(), { day: 'numeric', month: 'long', year: 'numeric' }) + '</dd><dt>Monthly fee</dt><dd class="num">' + eur.format(s.fee) + '</dd><dt>Attendance</dt><dd class="num">' + (a == null ? 'No sessions yet' : a + '% in the last 30 days') + '</dd></dl></div>' +
    '<div class="drawer-sec"><h4>Weekly lessons</h4>' + (ls.length ? '<ul class="list">' + ls.map(function (l) { var c = coach(l.coach); return '<li><span class="dot" style="background:' + c.color + '"></span><div class="t"><b>' + esc(l.title) + '</b><span>' + DAYS[l.day] + ' ' + l.start + ' · ' + esc(COURTS[l.court]) + ' · ' + esc(c.name) + '</span></div></li>'; }).join('') + '</ul>' : '<p class="muted" style="margin:0">Not enrolled in any lesson.</p>') + '</div>' +
    '<div class="drawer-sec"><h4>Payment history</h4>' + (pays.length ? '<ul class="list">' + pays.map(function (p) { var st = payState(p); return '<li><div class="t"><b>' + monthLabel(p.month, true) + '</b><span class="num">' + eur.format(p.amount) + (p.paidOn ? ' · paid ' + p.paidOn + ' by ' + esc(p.method.toLowerCase()) : '') + '</span></div>' + PAY_PILL[st] + (st !== 'paid' ? '<button class="btn btn-sm" data-pay="' + p.id + '">Mark paid</button>' : '') + '</li>'; }).join('') + '</ul>' : '<p class="muted" style="margin:0">No invoices yet.</p>') + '</div>' +
    '<div class="drawer-sec" id="d-actions"><div class="toolbar"><button class="btn" data-edit="' + s.id + '">Edit</button><button class="btn" data-toggle="' + s.id + '">' + (s.status === 'active' ? 'Pause membership' : 'Reactivate') + '</button><button class="btn btn-danger" data-ask-del="' + s.id + '">Delete</button></div></div>' +
  '</aside>', 'drawer-scrim');
}

function studentForm(s) {
  var isNew = !s; s = s || { first: '', last: '', age: '', level: 'Beginner', email: '', phone: '', guardian: '', lessons: [], status: 'active' };
  var f = function (name, label, input, full) { return '<label class="field' + (full ? ' full' : '') + '" data-f="' + name + '"><span>' + label + '</span>' + input + '<span class="err"></span></label>'; };
  var lessonChecks = function (level) { var ls = S.lessons.filter(function (l) { return l.level === level; }); return ls.length ? ls.map(function (l) { return '<label><input type="checkbox" name="lessons" value="' + l.id + '"' + (s.lessons.indexOf(l.id) >= 0 ? ' checked' : '') + '>' + esc(l.title) + ' · ' + DAYS[l.day] + ' ' + l.start + '</label>'; }).join('') : '<span class="muted">No lessons at this level yet.</span>'; };
  openLayer(modal(isNew ? 'Add student' : 'Edit student',
    '<form id="sform" novalidate><div class="modal-b">' +
      f('first', 'First name', '<input class="input" name="first" autocomplete="off" value="' + esc(s.first) + '">') +
      f('last', 'Last name', '<input class="input" name="last" autocomplete="off" value="' + esc(s.last) + '">') +
      f('age', 'Age', '<input class="input" name="age" type="number" min="4" max="90" inputmode="numeric" value="' + esc(s.age) + '">') +
      f('level', 'Level', '<select class="select" name="level">' + LEVELS.map(function (l) { return '<option' + (l === s.level ? ' selected' : '') + '>' + l + '</option>'; }).join('') + '</select>') +
      f('email', 'Email', '<input class="input" name="email" type="email" value="' + esc(s.email) + '">') +
      f('phone', 'Phone', '<input class="input" name="phone" type="tel" value="' + esc(s.phone) + '">') +
      f('guardian', 'Parent or guardian (under 18s)', '<input class="input" name="guardian" value="' + esc(s.guardian) + '">', true) +
      '<div class="field full" data-f="lessons"><span>Weekly lessons</span><div class="checks" id="lchecks">' + lessonChecks(s.level) + '</div><span class="err"></span></div>' +
      '<p class="full muted" style="margin:0;font-size:13px" id="fee-note">Monthly fee for this level: <b class="num">' + eur.format(FEES[s.level]) + '</b></p>' +
    '</div></form>',
    '<button class="btn" data-x>Cancel</button><button class="btn btn-primary" form="sform" type="submit">' + (isNew ? 'Add student' : 'Save changes') + '</button>'));
  var form = $('#sform');
  form.level.addEventListener('change', function () { s.lessons = []; $('#lchecks').innerHTML = lessonChecks(form.level.value); $('#fee-note b').textContent = eur.format(FEES[form.level.value]); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = { first: form.first.value.trim(), last: form.last.value.trim(), age: parseInt(form.age.value, 10), level: form.level.value, email: form.email.value.trim(), phone: form.phone.value.trim(), guardian: form.guardian.value.trim(), lessons: $$('input[name="lessons"]:checked', form).map(function (c) { return c.value; }) };
    var ok = true;
    function check(name, bad, msg) { setErr(form, name, bad ? msg : ''); if (bad) ok = false; }
    check('first', !v.first, 'Enter a first name.');
    check('last', !v.last, 'Enter a last name.');
    check('age', !(v.age >= 4 && v.age <= 90), 'Enter an age between 4 and 90.');
    check('email', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email), 'Enter a valid email, like name@example.com.');
    check('phone', v.phone.replace(/\D/g, '').length < 9, 'Enter a phone number with at least 9 digits.');
    check('guardian', v.age < 18 && !v.guardian, 'Students under 18 need a parent or guardian.');
    check('lessons', !v.lessons.length, 'Choose at least one weekly lesson.');
    if (!ok) { var bad = form.querySelector('.invalid input,.invalid select'); if (bad) bad.focus(); return; }
    if (isNew) {
      var ns = Object.assign({ id: nid('s'), status: 'active', joined: iso(TODAY), fee: FEES[v.level] }, v);
      S.students.push(ns);
      S.payments.push({ id: nid('p'), student: ns.id, month: ym(TODAY), amount: ns.fee, status: 'pending', paidOn: '', method: '' });
      toast(fullName(ns) + ' added. First invoice created.');
    } else { Object.assign(s, v, { fee: FEES[v.level] }); toast('Changes saved.'); }
    save(); closeLayer(); render();
  });
}

// ================= SCHEDULE =================
var HOUR0 = 8, HOUR1 = 22, HH = 52;
R.schedule = function () {
  var mon = addDays(mondayOf(TODAY), ui.week * 7), sun = addDays(mon, 6);
  var range = mon.toLocaleDateString(LOC(), { day: 'numeric', month: 'short' }) + ' – ' + sun.toLocaleDateString(LOC(), { day: 'numeric', month: 'short', year: 'numeric' });
  var times = '', cols = '', heads = '<div class="cal-h"></div>';
  for (var h = HOUR0; h < HOUR1; h++) times += '<span style="top:' + ((h - HOUR0) * HH) + 'px">' + pad(h) + ':00</span>';
  for (var d = 0; d < 7; d++) {
    var date = addDays(mon, d), isToday = iso(date) === iso(TODAY);
    heads += '<div class="cal-h' + (isToday ? ' today' : '') + '">' + DAYS[d] + '<b class="num">' + date.getDate() + '</b></div>';
    // lay overlapping lessons side by side: give each a lane, then share the width within its cluster
    var dayLs = S.lessons.filter(function (l) { return l.day === d; }).sort(function (a, b) { return toMin(a.start) - toMin(b.start); });
    var lanes = [], cluster = [], clusterEnd = -1, pos = {};
    var flush = function () { var n = Math.max.apply(null, cluster.map(function (id) { return pos[id].lane; })) + 1; cluster.forEach(function (id) { pos[id].n = n; }); cluster = []; lanes = []; };
    dayLs.forEach(function (l) {
      var s0 = toMin(l.start), e0 = s0 + l.dur;
      if (s0 >= clusterEnd && cluster.length) flush();
      var lane = 0; while (lanes[lane] > s0) lane++;
      lanes[lane] = e0; pos[l.id] = { lane: lane }; cluster.push(l.id); clusterEnd = Math.max(clusterEnd, e0);
    });
    if (cluster.length) flush();
    var evs = dayLs.map(function (l) {
      var c = coach(l.coach), top = (toMin(l.start) - HOUR0 * 60) / 60 * HH, hgt = l.dur / 60 * HH - 4, p = pos[l.id], w = 100 / p.n;
      return '<button class="ev" style="--c:' + c.color + ';top:' + (top + 2) + 'px;height:' + hgt + 'px;left:calc(' + (p.lane * w) + '% + 3px);width:calc(' + w + '% - 6px)" data-lesson="' + l.id + '"><b>' + esc(l.title) + '</b><span>' + l.start + '–' + fromMin(toMin(l.start) + l.dur) + ' · ' + esc(COURTS[l.court].split(' · ')[0]) + '</span></button>';
    }).join('');
    var now = '';
    if (isToday) { var nm = TODAY.getHours() * 60 + TODAY.getMinutes(); if (nm > HOUR0 * 60 && nm < HOUR1 * 60) now = '<div class="now-line" style="top:' + ((nm - HOUR0 * 60) / 60 * HH) + 'px"></div>'; }
    cols += '<div class="cal-day' + (isToday ? ' today' : '') + '" style="height:' + ((HOUR1 - HOUR0) * HH) + 'px">' + evs + now + '</div>';
  }
  return '<div class="week-head"><h2>' + range + '</h2><button class="icon-btn" data-week="-1" aria-label="Previous week"><svg><use href="#i-left"/></svg></button><button class="btn btn-sm" data-week="0">This week</button><button class="icon-btn" data-week="1" aria-label="Next week"><svg><use href="#i-right"/></svg></button><span style="flex:1"></span><button class="btn btn-primary" data-add-lesson><svg><use href="#i-plus"/></svg>Add lesson</button></div>' +
    '<div class="legend">' + S.coaches.map(function (c) { return '<span><i class="dot" style="background:' + c.color + '"></i>' + esc(c.name) + '</span>'; }).join('') + '</div>' +
    '<section class="card cal-wrap" style="--hh:' + HH + 'px"><div class="cal">' + heads + '<div class="cal-times" style="height:' + ((HOUR1 - HOUR0) * HH) + 'px">' + times + '</div>' + cols + '</div></section>';
};
R.scheduleAfter = function () {
  var nowLine = $('.now-line'); if (nowLine) { var wrap = $('.cal-wrap'); }
};
function lessonDetail(id) {
  var l = lesson(id); if (!l) return; var c = coach(l.coach), st = enrolled(l.id);
  openLayer(modal(l.title,
    '<div class="modal-b"><dl class="kv full"><dt>When</dt><dd>Every ' + DAYS[l.day] + ', ' + l.start + '–' + fromMin(toMin(l.start) + l.dur) + '</dd><dt>Court</dt><dd>' + esc(COURTS[l.court]) + '</dd><dt>Coach</dt><dd><span class="dot" style="background:' + c.color + '"></span> ' + esc(c.name) + '</dd><dt>Level</dt><dd>' + esc(l.level) + '</dd><dt>Students</dt><dd>' + st.length + '</dd></dl>' +
    '<div class="full">' + (st.length ? '<ul class="list">' + st.map(function (s) { return '<li><span class="avatar">' + initials(s) + '</span><div class="t"><b>' + esc(fullName(s)) + '</b><span>' + s.age + ' years</span></div></li>'; }).join('') + '</ul>' : '<p class="muted">Nobody enrolled yet.</p>') + '</div><div class="full" id="l-confirm"></div></div>',
    '<button class="btn btn-danger" data-ask-del-lesson="' + l.id + '">Delete</button><span style="flex:1"></span><button class="btn" data-edit-lesson="' + l.id + '">Edit</button><button class="btn btn-primary" data-take="' + l.id + '">Take attendance</button>'));
}
function lessonForm(l) {
  var isNew = !l; l = l || { title: '', level: 'Beginner', coach: 'c3', court: 0, day: 0, start: '18:00', dur: 60 };
  var f = function (name, label, input, full) { return '<label class="field' + (full ? ' full' : '') + '" data-f="' + name + '"><span>' + label + '</span>' + input + '<span class="err"></span></label>'; };
  var opts = function (arr, sel, valFn, labFn) { return arr.map(function (x, i) { var v = valFn ? valFn(x, i) : x; return '<option value="' + esc(v) + '"' + (String(v) === String(sel) ? ' selected' : '') + '>' + esc(labFn ? labFn(x, i) : x) + '</option>'; }).join(''); };
  var starts = []; for (var m = HOUR0 * 60; m <= (HOUR1 - 1) * 60; m += 30) starts.push(fromMin(m));
  openLayer(modal(isNew ? 'Add lesson' : 'Edit lesson',
    '<form id="lform" novalidate><div class="modal-b">' +
      f('title', 'Lesson name', '<input class="input" name="title" value="' + esc(l.title) + '" placeholder="e.g. Intermediate · adults">', true) +
      f('level', 'Level', '<select class="select" name="level">' + opts(LEVELS, l.level) + '</select>') +
      f('coach', 'Coach', '<select class="select" name="coach">' + opts(S.coaches, l.coach, function (c) { return c.id; }, function (c) { return c.name; }) + '</select>') +
      f('day', 'Day', '<select class="select" name="day">' + opts(DAYS, l.day, function (d, i) { return i; }) + '</select>') +
      f('court', 'Court', '<select class="select" name="court">' + opts(COURTS, l.court, function (c, i) { return i; }) + '</select>') +
      f('start', 'Start time', '<select class="select" name="start">' + opts(starts, l.start) + '</select>') +
      f('dur', 'Length', '<select class="select" name="dur">' + opts([60, 90, 120], l.dur, null, function (d) { return d + ' minutes'; }) + '</select>') +
      '<p class="err full" id="clash" role="alert"></p>' +
    '</div></form>',
    '<button class="btn" data-x>Cancel</button><button class="btn btn-primary" form="lform" type="submit">' + (isNew ? 'Add lesson' : 'Save changes') + '</button>'));
  var form = $('#lform');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = { title: form.title.value.trim(), level: form.level.value, coach: form.coach.value, day: +form.day.value, court: +form.court.value, start: form.start.value, dur: +form.dur.value };
    setErr(form, 'title', v.title ? '' : 'Give the lesson a name.');
    if (!v.title) return;
    var s0 = toMin(v.start), e0 = s0 + v.dur;
    if (e0 > HOUR1 * 60) { $('#clash').textContent = 'The club closes at ' + HOUR1 + ':00. Choose an earlier start or a shorter lesson.'; return; }
    // clash detection: same court or same coach at an overlapping time on the same day
    var clash = S.lessons.filter(function (o) { if (!isNew && o.id === l.id) return false; if (o.day !== v.day) return false; var s1 = toMin(o.start), e1 = s1 + o.dur; return s0 < e1 && s1 < e0 && (o.court === v.court || o.coach === v.coach); })[0];
    if (clash) { $('#clash').textContent = 'This overlaps with “' + clash.title + '” (' + clash.start + ', ' + (clash.court === v.court ? COURTS[clash.court] : coach(clash.coach).name) + '). Pick another time, court or coach.'; return; }
    if (isNew) { S.lessons.push(Object.assign({ id: nid('l') }, v)); toast('Lesson added to the schedule.'); } else { Object.assign(l, v); toast('Lesson updated.'); }
    save(); closeLayer(); render();
  });
}

// ================= ATTENDANCE =================
R.attendance = function () {
  var todayIdx = (TODAY.getDay() + 6) % 7;
  if (!ui.attLesson || !lesson(ui.attLesson)) { var t = S.lessons.filter(function (l) { return l.day === todayIdx; })[0] || S.lessons[0]; ui.attLesson = t.id; }
  var l = lesson(ui.attLesson);
  // the dates this lesson happens: recent past and today
  var dates = []; var mon = mondayOf(TODAY);
  for (var w = 0; w >= -4; w--) { var d = addDays(mon, w * 7 + l.day); if (iso(d) <= iso(TODAY)) dates.push(iso(d)); }
  if (!ui.attDate || dates.indexOf(ui.attDate) < 0) ui.attDate = dates[0];
  var rec = S.attendance[l.id + '|' + ui.attDate] || {};
  var st = enrolled(l.id);
  var saved = !!S.attendance[l.id + '|' + ui.attDate];
  var present = st.filter(function (s) { return rec[s.id] !== false; }).length;
  return '<div class="toolbar"><label class="field grow"><span>Lesson</span><select class="select" id="att-l">' + S.lessons.slice().sort(function (a, b) { return a.day - b.day || toMin(a.start) - toMin(b.start); }).map(function (x) { return '<option value="' + x.id + '"' + (x.id === l.id ? ' selected' : '') + '>' + DAYS[x.day] + ' ' + x.start + ' · ' + esc(x.title) + '</option>'; }).join('') + '</select></label>' +
    '<label class="field"><span>Session</span><select class="select" id="att-d">' + dates.map(function (d) { return '<option value="' + d + '"' + (d === ui.attDate ? ' selected' : '') + '>' + new Date(d).toLocaleDateString(LOC(), { weekday: 'short', day: 'numeric', month: 'short' }) + (d === iso(TODAY) ? ' (today)' : '') + '</option>'; }).join('') + '</select></label></div>' +
    '<section class="card"><div class="card-h"><div><h2>' + esc(l.title) + '</h2><p>' + esc(COURTS[l.court]) + ' · ' + esc(coach(l.coach).name) + ' · ' + (saved ? 'saved' : 'not taken yet') + '</p></div><span class="pill num" id="att-count">' + present + ' of ' + st.length + ' present</span></div><div class="card-b">' +
    (st.length ? '<ul class="att-list" id="att-list">' + st.map(function (s) {
      var here = rec[s.id] !== false;
      var hist = dates.slice(1, 5).reverse().map(function (d) { var r = S.attendance[l.id + '|' + d]; return r && s.id in r ? '<i class="' + (r[s.id] ? 'p' : 'a') + '" title="' + d + (r[s.id] ? ' present' : ' absent') + '"></i>' : '<i title="' + d + ' no record"></i>'; }).join('');
      return '<li data-sid="' + s.id + '"><span class="avatar">' + initials(s) + '</span><div class="t" style="flex:1;min-width:0"><b>' + esc(fullName(s)) + '</b><span class="hist" aria-label="Last sessions">' + hist + '</span></div><span class="seg" role="group" aria-label="Attendance for ' + esc(fullName(s)) + '"><button class="p" aria-pressed="' + here + '">Present</button><button class="a" aria-pressed="' + !here + '">Absent</button></span></li>';
    }).join('') + '</ul>' : '<p class="empty">No active students in this lesson.</p>') +
    '</div>' + (st.length ? '<div class="modal-f"><button class="btn" id="att-all">Mark all present</button><button class="btn btn-primary" id="att-save">Save attendance</button></div>' : '') + '</section>';
};
R.attendanceAfter = function () {
  $('#att-l').addEventListener('change', function (e) { ui.attLesson = e.target.value; ui.attDate = null; render(); });
  $('#att-d').addEventListener('change', function (e) { ui.attDate = e.target.value; render(); });
  var list = $('#att-list'); if (!list) return;
  var count = function () { var p = $$('.seg .p[aria-pressed="true"]', list).length; $('#att-count').textContent = p + ' of ' + $$('li', list).length + ' present'; };
  list.addEventListener('click', function (e) { var b = e.target.closest('.seg button'); if (!b) return; var seg = b.parentNode; $$('button', seg).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); count(); });
  $('#att-all').addEventListener('click', function () { $$('.seg', list).forEach(function (seg) { seg.children[0].setAttribute('aria-pressed', 'true'); seg.children[1].setAttribute('aria-pressed', 'false'); }); count(); });
  $('#att-save').addEventListener('click', function () {
    var rec = {}; $$('li', list).forEach(function (li) { rec[li.dataset.sid] = li.querySelector('.p').getAttribute('aria-pressed') === 'true'; });
    S.attendance[ui.attLesson + '|' + ui.attDate] = rec; save(); toast('Attendance saved.'); render();
  });
};

// ================= PAYMENTS =================
R.payments = function () {
  var months = Array.from(new Set(S.payments.map(function (p) { return p.month; }))).sort().reverse();
  var mp = S.payments.filter(function (p) { return p.month === ui.payMonth; });
  var sum = function (arr) { return arr.reduce(function (a, p) { return a + p.amount; }, 0); };
  var paid = mp.filter(function (p) { return p.status === 'paid'; }), open = mp.filter(function (p) { return p.status !== 'paid'; });
  var overdueAll = S.payments.filter(function (p) { return payState(p) === 'overdue'; });
  var missing = active().filter(function (s) { return !S.payments.some(function (p) { return p.student === s.id && p.month === ym(TODAY); }); }).length;
  return '<section class="kpis" aria-label="Payment summary">' +
    '<div class="card kpi"><span class="lbl">Collected · ' + monthLabel(ui.payMonth, true) + '</span><span class="val num">' + eur.format(sum(paid)) + '</span><span class="sub">' + paid.length + ' invoices paid</span></div>' +
    '<div class="card kpi"><span class="lbl">Still to collect</span><span class="val num">' + eur.format(sum(open)) + '</span><span class="sub">' + open.length + ' invoices open</span></div>' +
    '<div class="card kpi"><span class="lbl">Overdue · all months</span><span class="val num">' + overdueAll.length + '</span><span class="sub">' + eur.format(sum(overdueAll)) + ' in total</span></div>' +
    '<div class="card kpi"><span class="lbl">Collection rate</span><span class="val num">' + (mp.length ? Math.round(paid.length / mp.length * 100) + '%' : '—') + '</span><span class="sub">for the selected month</span></div>' +
  '</section>' +
  '<div class="toolbar"><label class="search grow"><svg><use href="#i-search"/></svg><input class="input" id="pq" type="search" placeholder="Search student" aria-label="Search payments by student" value="' + esc(ui.payQ) + '"></label>' +
    '<select class="select" id="pm" aria-label="Month" style="width:auto">' + months.map(function (m) { return '<option value="' + m + '"' + (m === ui.payMonth ? ' selected' : '') + '>' + monthLabel(m, true) + '</option>'; }).join('') + '</select>' +
    '<select class="select" id="ps" aria-label="Payment status" style="width:auto"><option value="all">All statuses</option><option value="paid"' + (ui.payStatus === 'paid' ? ' selected' : '') + '>Paid</option><option value="pending"' + (ui.payStatus === 'pending' ? ' selected' : '') + '>Pending</option><option value="overdue"' + (ui.payStatus === 'overdue' ? ' selected' : '') + '>Overdue</option></select>' +
    (missing ? '<button class="btn" id="gen">Create ' + missing + ' invoice' + (missing > 1 ? 's' : '') + ' for ' + monthLabel(ym(TODAY), true).split(' ')[0] + '</button>' : '') +
  '</div><section class="card"><div class="table-wrap" id="pay-table"></div></section>';
};
R.paymentsAfter = function () {
  var draw = function () {
    var q = ui.payQ.trim().toLowerCase();
    var rows = S.payments.filter(function (p) { var s = student(p.student); if (!s) return false; if (p.month !== ui.payMonth) return false; if (ui.payStatus !== 'all' && payState(p) !== ui.payStatus) return false; if (q && fullName(s).toLowerCase().indexOf(q) < 0) return false; return true; })
      .sort(function (a, b) { var o = { overdue: 0, pending: 1, paid: 2 }; return o[payState(a)] - o[payState(b)] || (student(a.student).last > student(b.student).last ? 1 : -1); });
    $('#pay-table').innerHTML = rows.length ? '<table><thead><tr><th>Student</th><th>Level</th><th>Month</th><th class="r">Amount</th><th>Status</th><th>Paid on</th><th>Method</th><th></th></tr></thead><tbody>' + rows.map(function (p) {
      var s = student(p.student), st = payState(p);
      return '<tr><td><div class="who"><span class="avatar">' + initials(s) + '</span><div><b>' + esc(fullName(s)) + '</b></div></div></td><td>' + levelPill(s.level) + '</td><td>' + monthLabel(p.month, true) + '</td><td class="r num">' + eur.format(p.amount) + '</td><td>' + PAY_PILL[st] + '</td><td class="num">' + (p.paidOn || '—') + '</td><td>' + (esc(p.method) || '—') + '</td><td class="r">' + (st !== 'paid' ? '<button class="btn btn-sm" data-pay="' + p.id + '">Mark paid</button>' : '') + '</td></tr>';
    }).join('') + '</tbody></table>' : '<p class="empty">No invoices match these filters.</p>';
  };
  draw();
  $('#pq').addEventListener('input', function (e) { ui.payQ = e.target.value; draw(); });
  $('#pm').addEventListener('change', function (e) { ui.payMonth = e.target.value; render(); });
  $('#ps').addEventListener('change', function (e) { ui.payStatus = e.target.value; draw(); });
  var gen = $('#gen'); if (gen) gen.addEventListener('click', function () {
    var n = 0; active().forEach(function (s) { if (!S.payments.some(function (p) { return p.student === s.id && p.month === ym(TODAY); })) { S.payments.push({ id: nid('p'), student: s.id, month: ym(TODAY), amount: s.fee, status: 'pending', paidOn: '', method: '' }); n++; } });
    save(); toast(n + ' invoice' + (n > 1 ? 's' : '') + ' created.'); render();
  });
};
function payForm(id) {
  var p = S.payments.filter(function (x) { return x.id === id; })[0]; if (!p) return; var s = student(p.student);
  openLayer(modal('Record payment',
    '<form id="pform"><div class="modal-b"><p class="full" style="margin:0">' + esc(fullName(s)) + ' · ' + monthLabel(p.month, true) + ' · <b class="num">' + eur.format(p.amount) + '</b></p>' +
    '<label class="field"><span>Method</span><select class="select" name="method"><option>Card</option><option>Bank transfer</option><option>Cash</option><option>Bizum</option></select></label>' +
    '<label class="field"><span>Date received</span><input class="input" type="date" name="date" value="' + iso(TODAY) + '" max="' + iso(TODAY) + '"></label>' +
    '<p class="full muted" style="margin:0;font-size:12px">In a live product, card payments would be taken through a payment provider such as Stripe and marked as paid automatically.</p></div></form>',
    '<button class="btn" data-x>Cancel</button><button class="btn btn-primary" form="pform" type="submit">Mark as paid</button>'));
  $('#pform').addEventListener('submit', function (e) { e.preventDefault(); p.status = 'paid'; p.method = this.method.value; p.paidOn = this.date.value || iso(TODAY); save(); closeLayer(); toast('Payment recorded for ' + fullName(s) + '.'); render(); });
}

// ================= STAFF =================
R.staff = function () {
  var todayIdx = (TODAY.getDay() + 6) % 7, nowMin = TODAY.getHours() * 60 + TODAY.getMinutes();
  return '<div class="staff-grid">' + S.coaches.map(function (c) {
    var ls = S.lessons.filter(function (l) { return l.coach === c.id; });
    var hours = ls.reduce(function (a, l) { return a + l.dur; }, 0) / 60;
    var studs = new Set(); ls.forEach(function (l) { enrolled(l.id).forEach(function (s) { studs.add(s.id); }); });
    var next = ls.slice().sort(function (a, b) { var da = (a.day - todayIdx + 7) % 7, db = (b.day - todayIdx + 7) % 7; if (da === 0 && toMin(a.start) < nowMin) da = 7; if (db === 0 && toMin(b.start) < nowMin) db = 7; return da - db || toMin(a.start) - toMin(b.start); })[0];
    var att = (function () { var y = 0, n = 0; Object.keys(S.attendance).forEach(function (k) { var lid = k.split('|')[0]; var l = lesson(lid); if (!l || l.coach !== c.id) return; var r = S.attendance[k]; Object.keys(r).forEach(function (sid) { n++; if (r[sid]) y++; }); }); return n ? Math.round(y / n * 100) : null; })();
    var img = { c1: 'racket-clay', c2: 'legs-blur', c3: 'ball-racket', c4: 'clay-ribbon' }[c.id] || 'racket-clay';
    return '<article class="card coach"><div class="coach-img"><img src="img/' + img + '.jpg" alt=""></div><div class="coach-body"><div class="coach-top"><span class="avatar lg" style="background:color-mix(in srgb,' + c.color + ' 18%,var(--surface));color:var(--ink)">' + c.name.split(' ').map(function (x) { return x[0]; }).join('') + '</span><div><b>' + esc(c.name) + '</b><span>' + esc(c.role) + ' · ' + esc(c.specialty) + '</span></div></div>' +
      '<div class="stats"><div><b class="num">' + ls.length + '</b><span>lessons / week</span></div><div><b class="num">' + hours + 'h</b><span>on court</span></div><div><b class="num">' + studs.size + '</b><span>students</span></div></div>' +
      '<dl class="kv"><dt>Next lesson</dt><dd>' + (next ? DAYS[next.day] + ' ' + next.start + ' · ' + esc(next.title) : '—') + '</dd><dt>Attendance</dt><dd class="num">' + (att == null ? '—' : att + '% in their lessons') + '</dd><dt>Email</dt><dd>' + esc(c.email) + '</dd><dt>Phone</dt><dd>' + esc(c.phone) + '</dd></dl></div></article>';
  }).join('') + '</div>';
};

// ---------- global clicks (delegated) ----------
document.addEventListener('click', function (e) {
  var t;
  if ((t = e.target.closest('[data-add-student]')) || e.target.closest('#quick-add')) { studentForm(); return; }
  if ((t = e.target.closest('[data-edit]'))) { studentForm(student(t.dataset.edit)); return; }
  if ((t = e.target.closest('[data-toggle]'))) { var s = student(t.dataset.toggle); s.status = s.status === 'active' ? 'paused' : 'active'; save(); toast(fullName(s) + (s.status === 'active' ? ' is active again.' : ' is paused.')); closeLayer(); render(); return; }
  if ((t = e.target.closest('[data-ask-del]'))) { var sd = student(t.dataset.askDel); $('#d-actions').innerHTML = '<div class="confirm" role="alert"><span>Delete ' + esc(fullName(sd)) + ' and their payment history? This can’t be undone.</span><div class="toolbar"><button class="btn" data-x>Keep student</button><button class="btn btn-danger" data-del="' + sd.id + '">Yes, delete</button></div></div>'; return; }
  if ((t = e.target.closest('[data-del]'))) { var id = t.dataset.del, name = fullName(student(id)); S.students = S.students.filter(function (x) { return x.id !== id; }); S.payments = S.payments.filter(function (p) { return p.student !== id; }); save(); closeLayer(); toast(name + ' deleted.'); render(); return; }
  if ((t = e.target.closest('[data-pay]'))) { payForm(t.dataset.pay); return; }
  if ((t = e.target.closest('[data-take]'))) { ui.attLesson = t.dataset.take; ui.attDate = null; closeLayer(); if (location.hash === '#attendance') render(); else location.hash = 'attendance'; return; }
  if ((t = e.target.closest('[data-lesson]'))) { lessonDetail(t.dataset.lesson); return; }
  if ((t = e.target.closest('[data-add-lesson]'))) { lessonForm(); return; }
  if ((t = e.target.closest('[data-edit-lesson]'))) { lessonForm(lesson(t.dataset.editLesson)); return; }
  if ((t = e.target.closest('[data-ask-del-lesson]'))) { var ld = lesson(t.dataset.askDelLesson); $('#l-confirm').innerHTML = '<div class="confirm" role="alert"><span>Delete “' + esc(ld.title) + '” from the weekly schedule? Students stay enrolled in their other lessons.</span><div class="toolbar"><button class="btn" data-x>Keep lesson</button><button class="btn btn-danger" data-del-lesson="' + ld.id + '">Yes, delete</button></div></div>'; return; }
  if ((t = e.target.closest('[data-del-lesson]'))) { var lid = t.dataset.delLesson; S.lessons = S.lessons.filter(function (l) { return l.id !== lid; }); S.students.forEach(function (s) { s.lessons = s.lessons.filter(function (x) { return x !== lid; }); }); save(); closeLayer(); toast('Lesson deleted.'); render(); return; }
  if ((t = e.target.closest('[data-week]'))) { var w = +t.dataset.week; ui.week = w === 0 ? 0 : ui.week + w; render(); return; }
});

// ---------- shell controls ----------
function closeSide() { $('#side').classList.remove('open'); $('#menu').setAttribute('aria-expanded', 'false'); }
$('#menu').addEventListener('click', function () { var o = $('#side').classList.toggle('open'); this.setAttribute('aria-expanded', o); });
document.addEventListener('click', function (e) { if ($('#side').classList.contains('open') && !e.target.closest('#side') && !e.target.closest('#menu')) closeSide(); });
$('#theme').addEventListener('click', function () {
  var root = document.documentElement, dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark'; try { localStorage.setItem('rally-theme', root.dataset.theme); } catch (e) {}
});
try { var th = localStorage.getItem('rally-theme'); if (th) document.documentElement.dataset.theme = th; } catch (e) {}
$('#reset').addEventListener('click', function () { S = seed(); save(); ui.attLesson = null; toast('Demo data restored.'); render(); });

// ---------- demo sign in ----------
var gate = $('#gate');
function signedIn() { try { return sessionStorage.getItem('rally-in') === '1'; } catch (e) { return true; } }
function showGate() { gate.hidden = false; setTimeout(function () { $('#si-pass').focus(); }, 30); }
$('#signin').addEventListener('submit', function (e) {
  e.preventDefault();
  var f = e.target, ok = true;
  var bad = function (n, cond, msg) { setErr(f, n, cond ? msg : ''); if (cond) ok = false; };
  bad('email', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim()), 'Enter your work email.');
  bad('pass', f.pass.value.length < 6, 'Your password has at least 6 characters.');
  if (!ok) return;
  try { sessionStorage.setItem('rally-in', '1'); } catch (x) {}
  gate.hidden = true; $('#view').focus({ preventScroll: true });
});
var signinF = $('#signin'), resetF = $('#reset-form');
$('#forgot').addEventListener('click', function () { signinF.hidden = true; resetF.hidden = false; $('#reset-done').hidden = true; $('#re-email').value = $('#si-email').value; $('#re-email').focus(); });
$('#back-signin').addEventListener('click', function () { resetF.hidden = true; signinF.hidden = false; $('#si-pass').focus(); });
resetF.addEventListener('submit', function (e) {
  e.preventDefault();
  var v = $('#re-email').value.trim(), bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  setErr(resetF, 'remail', bad ? 'Enter your work email.' : '');
  if (bad) return;
  var done = $('#reset-done'); done.textContent = 'If ' + v + ' has a Rally account, a reset link is on its way. (Demo: no email is sent. Use the password already filled in.)'; done.hidden = false;
});
$('#signout').addEventListener('click', function () { try { sessionStorage.removeItem('rally-in'); } catch (e) {} closeSide(); showGate(); });
if (!signedIn()) showGate();

$$('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.lang); }); });
render();
if (LANG === 'es') setLang('es');
})();
