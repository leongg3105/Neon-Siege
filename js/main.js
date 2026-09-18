// ===============================
// ELEMENTOS DEL HTML
// ===============================

const menu = document.getElementById("menu");
const seleccion = document.getElementById("seleccion");
const juego = document.getElementById("juego");
const gameOver = document.getElementById("gameOver");
const pausaOverlay = document.getElementById("pausaOverlay");

const btnJugar = document.getElementById("btnJugar");
const btnReiniciar = document.getElementById("btnReiniciar");

const botonesPersonaje = document.querySelectorAll(".personaje");

const hudPersonaje = document.getElementById("hudPersonaje");
const hudVida = document.getElementById("hudVida");
const hudPuntos = document.getElementById("hudPuntos");

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

let teclas = {};

let mouse = {
    x: 0,
    y: 0
};

let puntos = 0;

let ultimoDisparo = 0;

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

    ultimoSpawn = 0;

    hudPersonaje.textContent =
        jugador.nombre;

    hudVida.textContent =
        jugador.vida;

    hudPuntos.textContent =
        puntos;

        juegoPausado = false;
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
        &&
        juegoActivo
        &&
        !evento.repeat
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

        if (
            tiempo - ultimoSpawn
            >
            1300
        ) {

            crearEnemigo();

            ultimoSpawn =
                tiempo;

        }

        moverJugador();

        moverProyectiles();

        moverEnemigos();

        revisarColisiones();

    }

    dibujarJugador();

    dibujarProyectiles();

    dibujarEnemigos();

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

btnReiniciar.addEventListener(
    "click",
    function () {

        gameOver.classList.add(
            "oculto"
        );

        menu.classList.remove(
            "oculto"
        );

    }
);