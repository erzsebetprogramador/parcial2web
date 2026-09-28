// API de Tareas - servidor de referencia (sin dependencias)
// Uso: node server.js   (puerto por defecto 3000)
// Autenticación simulada: enviar header  Authorization: Bearer <cualquier-token>

const http = require("http");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const ESTADOS = ["pendiente", "completado"];

// Datos en memoria
const tareas = [
  { id: "t-1024", titulo: "Informe de laboratorio 3", curso: "Física II", fechaEntrega: "2026-10-05T23:59:00Z", estado: "pendiente" },
  { id: "t-1019", titulo: "Ensayo de historia", curso: "Historia Contemporánea", fechaEntrega: "2026-09-30T23:59:00Z", estado: "completado" },
  { id: "t-1030", titulo: "Ejercicios de cálculo integral", curso: "Cálculo II", fechaEntrega: "2026-10-08T23:59:00Z", estado: "pendiente" },
  { id: "t-1033", titulo: "Proyecto de base de datos", curso: "Bases de Datos", fechaEntrega: "2026-10-15T23:59:00Z", estado: "pendiente" },
];

function enviar(res, status, cuerpo) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(cuerpo));
}

function error(res, status, codigo, mensaje) {
  enviar(res, status, { codigo, mensaje });
}

function leerJSON(req) {
  return new Promise((resolve, reject) => {
    let datos = "";
    req.on("data", (c) => (datos += c));
    req.on("end", () => {
      try { resolve(datos ? JSON.parse(datos) : {}); } catch (e) { reject(e); }
    });
  });
}

const servidor = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const ruta = url.pathname.replace(/\/+$/, "");

    // 401
    const auth = req.headers["authorization"] || "";
    if (!/^Bearer\s+\S+/.test(auth)) {
      return error(res, 401, "NO_AUTENTICADO", "Falta token o es inválido");
    }

    // GET /api/v1/tareas  (+ ?estado=)
    if (req.method === "GET" && ruta === "/api/v1/tareas") {
      const estado = url.searchParams.get("estado");
      if (estado !== null && !ESTADOS.includes(estado)) {
        return error(res, 400, "ESTADO_INVALIDO", `El estado debe ser: ${ESTADOS.join(" | ")}`);
      }
      const data = estado ? tareas.filter((t) => t.estado === estado) : tareas;
      return enviar(res, 200, { total: data.length, data });
    }

    // /api/v1/tareas/{id}
    const m = ruta.match(/^\/api\/v1\/tareas\/([^/]+)$/);
    if (m) {
      const id = decodeURIComponent(m[1]);
      const tarea = tareas.find((t) => t.id === id);
      if (!tarea) return error(res, 404, "TAREA_NO_ENCONTRADA", `No existe una tarea con id ${id}`);

      if (req.method === "GET") return enviar(res, 200, tarea);

      if (req.method === "PATCH") {
        let body;
        try { body = await leerJSON(req); }
        catch { return error(res, 400, "JSON_INVALIDO", "El cuerpo no es un JSON válido"); }

        if (!ESTADOS.includes(body.estado)) {
          return error(res, 400, "ESTADO_INVALIDO", `El estado debe ser: ${ESTADOS.join(" | ")}`);
        }
        if (body.estado !== "completado") {
          return error(res, 422, "TRANSICION_NO_PERMITIDA", "Solo se permite marcar la tarea como completado");
        }
        tarea.estado = "completado"; // idempotente
        return enviar(res, 200, tarea);
      }
    }

    return error(res, 404, "RUTA_NO_ENCONTRADA", "Ruta o método no soportado");
  } catch (e) {
    console.error(e);
    return error(res, 500, "ERROR_INTERNO", "Error inesperado del servidor");
  }
});

servidor.listen(PORT, () => console.log(`API de tareas en http://localhost:${PORT}/api/v1`));
