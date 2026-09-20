// ===============================
// ELEMENTOS DEL HTML
// ===============================

const menu = document.getElementById("menu");
const seleccion = document.getElementById("seleccion");
const juego = document.getElementById("juego");
const gameOver = document.getElementById("gameOver");

const pausaOverlay = document.getElementById("pausaOverlay");

const tiendaOverlay = document.getElementById("tiendaOverlay");
const tiendaOpciones = document.getElementById("tiendaOpciones");
const btnCerrarTienda = document.getElementById("btnCerrarTienda");

const btnJugar = document.getElementById("btnJugar");
const btnReiniciar = document.getElementById("btnReiniciar");
const btnMenu = document.getElementById("btnMenu");
const btnContinuar = document.getElementById("btnContinuar");
const btnMenuPausa = document.getElementById("btnMenuPausa");

const botonesPersonaje = document.querySelectorAll(".personaje");

const hudPersonaje = document.getElementById("hudPersonaje");
const hudVida = document.getElementById("hudVida");
const hudPuntos = document.getElementById("hudPuntos");
const hudOleada = document.getElementById("hudOleada");
const hudEnemigos = document.getElementById("hudEnemigos");

const puntosFinales = document.getElementById("puntosFinales");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// ===============================
// PERSONAJES
// ===============================

const personajes = {

    miku: {
        nombre: "Miku",
        vida: 100,
        velocidad: 4.5,
        daño: 12,
        cadencia: 250,
        color: "#39f5d2"
    },

    teto: {
        nombre: "Teto",
        vida: 120,
        velocidad: 4,
        daño: 15,
        cadencia: 320,
        color: "#ff4567"
    },

    ado: {
        nombre: "Ado",
        vida: 90,
        velocidad: 5,
        daño: 20,
        cadencia: 400,
        color: "#3366ff"
    }

};


// ===============================
// VARIABLES DEL JUEGO
// ===============================

let jugador;

let proyectiles = [];
let enemigos = [];
let personajeActual = null;

let teclas = {};

let mouse = {
    x: 0,
    y: 0
};

let puntos = 0;

let ultimoDisparo = 0;

let oleada = 1;

let enemigosGenerados = 0;
let enemigosPorOleada = 5;
let enemigosEliminadosOleada = 0;

let esperandoOleada = false;
let inicioEsperaOleada = 0;

let intervaloSpawn = 1300;
let finMensajeOleada = 0;

let tiendaActiva = false;

let mejoraTomadaEnTienda = false;

let mejorasActualesTienda = [];

let juegoActivo = false;

let juegoPausado = false;

let ultimoSpawn = 0;


// ===============================
// MENÚ
// ===============================

btnJugar.addEventListener("click", function () {

    menu.classList.add("oculto");
    seleccion.classList.remove("oculto");

});


// ===============================
// SELECCIONAR PERSONAJE
// ===============================

botonesPersonaje.forEach(function (boton) {

    boton.addEventListener("click", function () {

        const personajeElegido =
            boton.dataset.personaje;

        iniciarJuego(personajeElegido);

    });

});


// ===============================
// INICIAR JUEGO
// ===============================

function iniciarJuego(personajeElegido) {

    personajeActual = personajeElegido;

    seleccion.classList.add("oculto");
    juego.classList.remove("oculto");
    gameOver.classList.add("oculto");

    const datos = personajes[personajeElegido];

    jugador = {

        x: canvas.width / 2,
        y: canvas.height / 2,

        radio: 20,

        nombre: datos.nombre,

        vida: datos.vida,
        vidaMaxima: datos.vida,

        velocidad: datos.velocidad,

        daño: datos.daño,

        cadencia: datos.cadencia,

        color: datos.color

    };

    proyectiles = [];
    enemigos = [];

    puntos = 0;

    oleada = 1;
    enemigosGenerados = 0;
    enemigosPorOleada = 5;
    enemigosEliminadosOleada = 0;

    esperandoOleada = false;
    intervaloSpawn = 1300;

    ultimoSpawn = 0;

    hudPersonaje.textContent =
        jugador.nombre;

    hudVida.textContent =
        jugador.vida;

    hudOleada.textContent =
        oleada;

    hudEnemigos.textContent =
        enemigosPorOleada - enemigosEliminadosOleada;

    hudPuntos.textContent =
        puntos;

    juegoPausado = false;
    pausaOverlay.classList.add("oculto");

    tiendaActiva = false;
mejoraTomadaEnTienda = false;
mejorasActualesTienda = [];

tiendaOverlay.classList.add("oculto");

    juegoActivo = true;

    requestAnimationFrame(gameLoop);

}


// ===============================
// CONTROLES DEL TECLADO
// ===============================

document.addEventListener("keydown", function (evento) {

    const tecla = evento.key.toLowerCase();

    teclas[tecla] = true;

    if (
    (tecla === "p" || tecla === "escape")
    && juegoActivo
    && !tiendaActiva
    && !evento.repeat
) {

        juegoPausado = !juegoPausado;

        pausaOverlay.classList.toggle("oculto", !juegoPausado);

    }

});


document.addEventListener("keyup", function (evento) {

    teclas[evento.key.toLowerCase()] = false;

});


// ===============================
// MOUSE
// ===============================

canvas.addEventListener("mousemove", function (evento) {

    const rect =
        canvas.getBoundingClientRect();

    mouse.x =
        evento.clientX -
        rect.left;

    mouse.y =
        evento.clientY -
        rect.top;

});


// ===============================
// DISPARAR
// ===============================

canvas.addEventListener("click", function () {

    disparar();

});


function disparar() {

if (!juegoActivo || juegoPausado) {
    return;
}

    const ahora =
        Date.now();

    if (
        ahora - ultimoDisparo
        <
        jugador.cadencia
    ) {
        return;
    }

    ultimoDisparo = ahora;


    const angulo =
        Math.atan2(
            mouse.y - jugador.y,
            mouse.x - jugador.x
        );


    const velocidadBala = 8;


    proyectiles.push({

        x: jugador.x,

        y: jugador.y,

        radio: 6,

        velocidadX:
            Math.cos(angulo)
            * velocidadBala,

        velocidadY:
            Math.sin(angulo)
            * velocidadBala,

        daño:
            jugador.daño

    });

}


// ===============================
// MOVIMIENTO
// ===============================

function moverJugador() {

    let x = 0;
    let y = 0;


    if (
        teclas["w"]
        ||
        teclas["arrowup"]
    ) {

        y -= 1;

    }


    if (
        teclas["s"]
        ||
        teclas["arrowdown"]
    ) {

        y += 1;

    }


    if (
        teclas["a"]
        ||
        teclas["arrowleft"]
    ) {

        x -= 1;

    }


    if (
        teclas["d"]
        ||
        teclas["arrowright"]
    ) {

        x += 1;

    }


    // Evita que diagonal sea más rápida

    if (x !== 0 && y !== 0) {

        x *= 0.707;
        y *= 0.707;

    }


    jugador.x +=
        x * jugador.velocidad;

    jugador.y +=
        y * jugador.velocidad;


    // Evitar salir del Canvas

    jugador.x =
        Math.max(
            jugador.radio,
            Math.min(
                canvas.width - jugador.radio,
                jugador.x
            )
        );


    jugador.y =
        Math.max(
            jugador.radio,
            Math.min(
                canvas.height - jugador.radio,
                jugador.y
            )
        );

}


// ===============================
// GENERAR ENEMIGOS
// ===============================

function crearEnemigo() {

    let x;
    let y;


    const lado =
        Math.floor(
            Math.random() * 4
        );


    if (lado === 0) {

        x = Math.random()
            * canvas.width;

        y = -30;

    }


    if (lado === 1) {

        x = canvas.width + 30;

        y = Math.random()
            * canvas.height;

    }


    if (lado === 2) {

        x = Math.random()
            * canvas.width;

        y = canvas.height + 30;

    }


    if (lado === 3) {

        x = -30;

        y = Math.random()
            * canvas.height;

    }


    enemigos.push({

        x: x,

        y: y,

        radio: 18,

        velocidad: 1.5,

        vida: 30

    });

}


// ===============================
// MOVER ENEMIGOS
// ===============================

function moverEnemigos() {

    enemigos.forEach(function (enemigo) {

        const angulo =
            Math.atan2(
                jugador.y - enemigo.y,
                jugador.x - enemigo.x
            );


        enemigo.x +=
            Math.cos(angulo)
            * enemigo.velocidad;


        enemigo.y +=
            Math.sin(angulo)
            * enemigo.velocidad;

    });

}


// ===============================
// PROYECTILES
// ===============================

function moverProyectiles() {

    proyectiles.forEach(function (proyectil) {

        proyectil.x +=
            proyectil.velocidadX;

        proyectil.y +=
            proyectil.velocidadY;

    });


    proyectiles =
        proyectiles.filter(
            function (proyectil) {

                return (

                    proyectil.x > -20
                    &&
                    proyectil.x < canvas.width + 20
                    &&
                    proyectil.y > -20
                    &&
                    proyectil.y < canvas.height + 20

                );

            }
        );

}


// ===============================
// COLISIONES
// ===============================

function revisarColisiones() {

    // PROYECTILES VS ENEMIGOS

    for (
        let i = proyectiles.length - 1;
        i >= 0;
        i--
    ) {

        for (
            let j = enemigos.length - 1;
            j >= 0;
            j--
        ) {

            const proyectil =
                proyectiles[i];

            const enemigo =
                enemigos[j];


            const distancia =
                Math.hypot(
                    proyectil.x - enemigo.x,
                    proyectil.y - enemigo.y
                );


            if (
                distancia
                <
                proyectil.radio
                +
                enemigo.radio
            ) {

                enemigo.vida -=
                    proyectil.daño;


                proyectiles.splice(
                    i,
                    1
                );


                if (
    enemigo.vida <= 0
) {

    enemigos.splice(
        j,
        1
    );

    enemigosEliminadosOleada++;

    hudEnemigos.textContent =
        enemigosPorOleada - enemigosEliminadosOleada;

    puntos += 100;

    hudPuntos.textContent =
        puntos;

}


                break;

            }

        }

    }


    // JUGADOR VS ENEMIGOS

    enemigos.forEach(
        function (enemigo) {

            const distancia =
                Math.hypot(
                    jugador.x - enemigo.x,
                    jugador.y - enemigo.y
                );


            if (
                distancia
                <
                jugador.radio
                +
                enemigo.radio
            ) {

                jugador.vida -= 1;


                hudVida.textContent =
                    jugador.vida;


                // Empuja al enemigo

                const angulo =
                    Math.atan2(
                        enemigo.y - jugador.y,
                        enemigo.x - jugador.x
                    );


                enemigo.x +=
                    Math.cos(angulo)
                    * 25;


                enemigo.y +=
                    Math.sin(angulo)
                    * 25;


                if (
                    jugador.vida <= 0
                ) {

                    terminarJuego();

                }

            }

        }
    );

}


// ===============================
// DIBUJAR JUGADOR
// ===============================

function dibujarJugador() {

    ctx.beginPath();

    ctx.arc(
        jugador.x,
        jugador.y,
        jugador.radio,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        jugador.color;

    ctx.fill();


    ctx.fillStyle = "white";

    ctx.font = "bold 16px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(
        jugador.nombre[0],
        jugador.x,
        jugador.y
    );

}


// ===============================
// DIBUJAR PROYECTILES
// ===============================

function dibujarProyectiles() {

    proyectiles.forEach(
        function (proyectil) {

            ctx.beginPath();

            ctx.arc(
                proyectil.x,
                proyectil.y,
                proyectil.radio,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "#ffffff";

            ctx.fill();

        }
    );

}


// ===============================
// DIBUJAR ENEMIGOS
// ===============================

function dibujarEnemigos() {

    enemigos.forEach(
        function (enemigo) {

            ctx.beginPath();

            ctx.arc(
                enemigo.x,
                enemigo.y,
                enemigo.radio,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "#ff3030";

            ctx.fill();

        }
    );

}

// ===============================
// MENSAJE DE OLEADA
// ===============================

function dibujarMensajeOleada(tiempo) {

    let texto = "";

    if (esperandoOleada) {

        texto = "OLEADA COMPLETADA";

    } else if (tiempo < finMensajeOleada) {

        texto = "OLEADA " + oleada;

    }

    if (texto === "") {
        return;
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";

    ctx.fillRect(
        canvas.width / 2 - 230,
        canvas.height / 2 - 60,
        460,
        120
    );

    ctx.fillStyle = "white";

    ctx.font = "bold 38px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        texto,
        canvas.width / 2,
        canvas.height / 2
    );

}

function abrirTienda() {

    tiendaActiva = true;
    juegoPausado = true;

    teclas = {};

    tiendaOverlay.classList.remove("oculto");

}


function cerrarTienda() {

    tiendaActiva = false;
    juegoPausado = false;

    tiendaOverlay.classList.add("oculto");

    avanzarOleada(performance.now());

}

function avanzarOleada(tiempoActual) {

    oleada++;

    enemigosGenerados = 0;
    enemigosEliminadosOleada = 0;

    enemigosPorOleada += 2;

    intervaloSpawn =
        Math.max(
            700,
            intervaloSpawn - 75
        );

    hudOleada.textContent =
        oleada;

    hudEnemigos.textContent =
        enemigosPorOleada;

    esperandoOleada = false;

    ultimoSpawn =
        tiempoActual;

    finMensajeOleada =
        tiempoActual + 1500;

}

// ===============================
// GAME LOOP
// ===============================

function gameLoop(tiempo) {

    if (!juegoActivo) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (!juegoPausado) {

        // GENERAR ENEMIGOS

        if (
            !esperandoOleada
            &&
            enemigosGenerados < enemigosPorOleada
            &&
            tiempo - ultimoSpawn > intervaloSpawn
        ) {

            crearEnemigo();

            enemigosGenerados++;

            ultimoSpawn = tiempo;

        }


        moverJugador();

        moverProyectiles();

        moverEnemigos();

        revisarColisiones();


        // COMPROBAR SI TERMINÓ LA OLEADA

        if (
            enemigosGenerados >= enemigosPorOleada
            &&
            enemigos.length === 0
            &&
            !esperandoOleada
        ) {

            esperandoOleada = true;

            inicioEsperaOleada = tiempo;

        }


        // COMENZAR SIGUIENTE OLEADA

        if (
    esperandoOleada
    &&
    tiempo - inicioEsperaOleada >= 2000
) {

    if (oleada % 2 === 0) {

        esperandoOleada = false;

        abrirTienda();

    } else {

        avanzarOleada(tiempo);

    }
}

    }


    dibujarJugador();

    dibujarProyectiles();

    dibujarEnemigos();

    dibujarMensajeOleada(tiempo);


    requestAnimationFrame(
        gameLoop
    );

}


// ===============================
// GAME OVER
// ===============================

function terminarJuego() {

    juegoActivo = false;

    juego.classList.add(
        "oculto"
    );

    gameOver.classList.remove(
        "oculto"
    );


    puntosFinales.textContent =
        puntos;

}


// ===============================
// REGRESAR AL MENÚ
// ===============================

btnReiniciar.addEventListener("click", function () {

    if (personajeActual) {
        iniciarJuego(personajeActual);
    }

});


btnMenu.addEventListener("click", function () {

    juegoActivo = false;
    juegoPausado = false;

    teclas = {};

    pausaOverlay.classList.add("oculto");
    gameOver.classList.add("oculto");
    juego.classList.add("oculto");

    menu.classList.remove("oculto");

});
btnContinuar.addEventListener("click", function () {

    juegoPausado = false;

    pausaOverlay.classList.add("oculto");

});

btnCerrarTienda.addEventListener("click", function () {

    cerrarTienda();

});

btnMenuPausa.addEventListener("click", function () {

    juegoActivo = false;
    juegoPausado = false;

    teclas = {};

    pausaOverlay.classList.add("oculto");
    juego.classList.add("oculto");
    gameOver.classList.add("oculto");
    seleccion.classList.add("oculto");

    menu.classList.remove("oculto");

});