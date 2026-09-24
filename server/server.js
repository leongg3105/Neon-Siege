const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(__dirname, "data");
const SCORES_FILE = path.join(DATA_DIR, "scores.json");

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(SCORES_FILE)) {
    fs.writeFileSync(SCORES_FILE, "[]", "utf8");
}

function leerPuntajes() {
    try {
        const texto = fs.readFileSync(SCORES_FILE, "utf8");
        const datos = JSON.parse(texto);
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}

function guardarPuntajes(puntajes) {
    fs.writeFileSync(
        SCORES_FILE,
        JSON.stringify(puntajes, null, 2),
        "utf8"
    );
}

function enviarJSON(res, status, data) {
    res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    });

    res.end(JSON.stringify(data));
}

function ordenarTop10(puntajes) {
    return puntajes
        .sort(function (a, b) {
            if (b.puntos !== a.puntos) {
                return b.puntos - a.puntos;
            }

            // Si hay empate, gana quien alcanzó el puntaje en menos tiempo.
            return (a.tiempo || 0) - (b.tiempo || 0);
        })
        .slice(0, 10);
}

function recibirJSON(req) {
    return new Promise(function (resolve, reject) {
        let cuerpo = "";

        req.on("data", function (chunk) {
            cuerpo += chunk;

            if (cuerpo.length > 1_000_000) {
                reject(new Error("Cuerpo demasiado grande"));
                req.destroy();
            }
        });

        req.on("end", function () {
            try {
                resolve(cuerpo ? JSON.parse(cuerpo) : {});
            } catch (error) {
                reject(error);
            }
        });

        req.on("error", reject);
    });
}

function limpiarNombre(valor) {
    return String(valor || "")
        .trim()
        .replace(/[<>]/g, "")
        .slice(0, 20);
}

function enteroNoNegativo(valor, defecto = 0) {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return defecto;
    }

    return Math.max(0, Math.floor(numero));
}

function tipoContenido(archivo) {
    const extension = path.extname(archivo).toLowerCase();

    const tipos = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".wav": "audio/wav",
        ".mp3": "audio/mpeg"
    };

    return tipos[extension] || "application/octet-stream";
}

function servirArchivo(req, res, pathname) {
    let rutaRelativa = pathname === "/"
        ? "index.html"
        : decodeURIComponent(pathname).replace(/^\/+/, "");

    // No exponemos los datos del servidor ni la carpeta .git.
    if (
        rutaRelativa.startsWith("server/") ||
        rutaRelativa.startsWith(".git/")
    ) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Acceso denegado");
        return;
    }

    const archivo = path.resolve(ROOT, rutaRelativa);

    if (!archivo.startsWith(ROOT + path.sep)) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Acceso denegado");
        return;
    }

    fs.stat(archivo, function (error, stats) {
        if (error || !stats.isFile()) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Archivo no encontrado");
            return;
        }

        res.writeHead(200, {
            "Content-Type": tipoContenido(archivo)
        });

        fs.createReadStream(archivo).pipe(res);
    });
}

const servidor = http.createServer(async function (req, res) {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = url.pathname;

    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        res.end();
        return;
    }

    if (pathname === "/api/scores" && req.method === "GET") {
        const puntajes = ordenarTop10(leerPuntajes());
        enviarJSON(res, 200, puntajes);
        return;
    }

    if (pathname === "/api/scores" && req.method === "POST") {
        try {
            const cuerpo = await recibirJSON(req);

            const nombre = limpiarNombre(cuerpo.nombre);

            if (nombre.length === 0) {
                enviarJSON(res, 400, {
                    error: "El nombre del jugador es obligatorio."
                });
                return;
            }

            const id =
                Date.now().toString(36) +
                "-" +
                Math.random().toString(36).slice(2, 8);

            const registro = {
                id: id,
                nombre: nombre,
                puntos: enteroNoNegativo(cuerpo.puntos),
                oleada: Math.max(1, enteroNoNegativo(cuerpo.oleada, 1)),
                nivel: Math.max(1, enteroNoNegativo(cuerpo.nivel, 1)),
                tiempo: enteroNoNegativo(cuerpo.tiempo),
                comboMaximo: enteroNoNegativo(cuerpo.comboMaximo),
                fecha: new Date().toISOString()
            };

            const puntajes = leerPuntajes();
            puntajes.push(registro);

            const top10 = ordenarTop10(puntajes);
            const guardadoEnTop10 =
                top10.some(function (item) {
                    return item.id === id;
                });

            // Solo persistimos los diez mejores para evitar que el archivo crezca.
            guardarPuntajes(top10);

            enviarJSON(res, 201, {
                ok: true,
                guardadoEnTop10: guardadoEnTop10,
                ranking: top10
            });

        } catch (error) {
            enviarJSON(res, 400, {
                error: "Datos de puntuación inválidos."
            });
        }

        return;
    }

    if (pathname === "/api/stats" && req.method === "GET") {
        const puntajes = ordenarTop10(leerPuntajes());

        const total = puntajes.reduce(function (acumulado, item) {
            return acumulado + item.puntos;
        }, 0);

        enviarJSON(res, 200, {
            registrosTop10: puntajes.length,
            mejorPuntaje: puntajes.length > 0 ? puntajes[0].puntos : 0,
            promedioTop10:
                puntajes.length > 0
                    ? Math.round(total / puntajes.length)
                    : 0
        });

        return;
    }

    if (req.method === "GET") {
        servirArchivo(req, res, pathname);
        return;
    }

    enviarJSON(res, 404, {
        error: "Ruta no encontrada."
    });
});

servidor.listen(PORT, function () {
    console.log(`Neon Siege servidor activo en http://localhost:${PORT}`);
    console.log(`Ranking: http://localhost:${PORT}/api/scores`);
});
