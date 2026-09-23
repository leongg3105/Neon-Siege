// ============================================================
// MAIN.JS - NEON SIEGE
// Personaje jugable único: Ado
// IDLE: assets/sprites/players/ado/ado_idle_pistol.png
// HIT:  assets/sprites/players/ado/ado_hit_pistol.png
// DEATH: assets/sprites/players/ado/ado_death_pistol.png
// Filas: 0 abajo | 1 abajo-derecha | 2 derecha | 3 arriba-derecha
//        4 arriba | 5 arriba-izquierda | 6 izquierda | 7 abajo-izquierda
// ============================================================

// ===============================
// ELEMENTOS DEL HTML
// ===============================

const menu = document.getElementById("menu");
const juego = document.getElementById("juego");
const gameOver = document.getElementById("gameOver");
const codex = document.getElementById("codex");

const btnCodex = document.getElementById("btnCodex");
const btnVolverCodex = document.getElementById("btnVolverCodex");

const creditos = document.getElementById("creditos");

const btnCreditos = document.getElementById("btnCreditos");
const btnVolverCreditos = document.getElementById("btnVolverCreditos");

const pausaOverlay = document.getElementById("pausaOverlay");

const tiendaOverlay = document.getElementById("tiendaOverlay");
const tiendaOpciones = document.getElementById("tiendaOpciones");
const btnCerrarTienda = document.getElementById("btnCerrarTienda");

const btnJugar = document.getElementById("btnJugar");
const btnReiniciar = document.getElementById("btnReiniciar");
const btnMenu = document.getElementById("btnMenu");
const btnContinuar = document.getElementById("btnContinuar");
const btnMenuPausa = document.getElementById("btnMenuPausa");


const hudPersonaje = document.getElementById("hudPersonaje");
const hudVida = document.getElementById("hudVida");
const hudPuntos = document.getElementById("hudPuntos");
const hudOleada = document.getElementById("hudOleada");
const hudEnemigos = document.getElementById("hudEnemigos");

const puntosFinales = document.getElementById("puntosFinales");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ===============================
// SPRITES DEL JUGADOR
// ===============================

function cargarSpritesAdo() {

    const idle = new Image();
    idle.src =
        "assets/sprites/players/ado/ado_idle_pistol.png";

    // RUN todavía no se integra.
    // Mientras tanto, al moverse Ado seguirá usando el IDLE direccional.

    const hit = new Image();
    hit.src =
        "assets/sprites/players/ado/ado_hit_pistol.png";

    const death = new Image();
    death.src =
        "assets/sprites/players/ado/ado_death_pistol.png";

    const attack = new Image();
    attack.src =
        "assets/sprites/players/ado/ado_attack_pistol.png";

    return {
        idle: idle,
        hit: hit,
        death: death,
        attack: attack
    };
}

const spritesAdo = cargarSpritesAdo();

const tamañosSprites = {

    idle: 110,
    attack: 110,
    hit: 110,
    death: 125

};


// ===============================
// PERSONAJES
// ===============================

const datosAdo = {

    nombre: "Ado",
    vida: 90,
    velocidad: 5,
    daño: 20,
    cadencia: 400,
    color: "#3366ff"

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

    iniciarJuego();

});

btnCodex.addEventListener("click", function () {

    menu.classList.add("oculto");

    codex.classList.remove("oculto");

});


btnVolverCodex.addEventListener("click", function () {

    codex.classList.add("oculto");

    menu.classList.remove("oculto");

});

btnCreditos.addEventListener("click", function () {

    menu.classList.add("oculto");

    creditos.classList.remove("oculto");

});


btnVolverCreditos.addEventListener("click", function () {

    creditos.classList.add("oculto");

    menu.classList.remove("oculto");

});


// ===============================
// INICIAR JUEGO
// ===============================

function iniciarJuego() {

    juego.classList.remove("oculto");
    gameOver.classList.add("oculto");

    const datos = datosAdo;

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

        color: datos.color,

        moviendo: false,

        // Dirección del spritesheet:
        // 0 abajo, 1 abajo-derecha, 2 derecha, 3 arriba-derecha,
        // 4 arriba, 5 arriba-izquierda, 6 izquierda, 7 abajo-izquierda
        direccion: 0,

        // Dirección usada al disparar. Se calcula con la posición del mouse
        // para que apuntar y moverse sean independientes.
        direccionAtaque: 0,

        ataqueInicio: 0,
        ataqueHasta: 0,

        hitInicio: 0,
        hitHasta: 0,

        muriendo: false,

        deathInicio: 0,
        deathHasta: 0

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

if (
    !juegoActivo ||
    juegoPausado ||
    jugador.muriendo
) {
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

jugador.ataqueInicio =
    performance.now();

jugador.ataqueHasta =
    jugador.ataqueInicio + 560;


    const angulo =
        Math.atan2(
            mouse.y - jugador.y,
            mouse.x - jugador.x
        );

    // Dirección del ataque según el mouse.
    // Orden de filas del spritesheet:
    // 0 ↓, 1 ↘, 2 →, 3 ↗, 4 ↑, 5 ↖, 6 ←, 7 ↙
    let grados =
        angulo * 180 / Math.PI;

    if (grados < 0) {
        grados += 360;
    }

    const octante =
        Math.round(grados / 45) % 8;

    const mapaDireccionAtaque =
        [2, 1, 0, 7, 6, 5, 4, 3];

    jugador.direccionAtaque =
        mapaDireccionAtaque[octante];


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

    jugador.moviendo = (x !== 0 || y !== 0);

    if (jugador.moviendo) {

        if (x === 0 && y > 0) {
            jugador.direccion = 0;
        } else if (x > 0 && y > 0) {
            jugador.direccion = 1;
        } else if (x > 0 && y === 0) {
            jugador.direccion = 2;
        } else if (x > 0 && y < 0) {
            jugador.direccion = 3;
        } else if (x === 0 && y < 0) {
            jugador.direccion = 4;
        } else if (x < 0 && y < 0) {
            jugador.direccion = 5;
        } else if (x < 0 && y === 0) {
            jugador.direccion = 6;
        } else if (x < 0 && y > 0) {
            jugador.direccion = 7;
        }
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

const ahora = performance.now();

if (ahora >= jugador.hitHasta) {

    jugador.hitInicio = ahora;
    jugador.hitHasta = ahora + 440;

}


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


                if (jugador.vida <= 0) {
                    iniciarMuerte();
                }

            }

        }
    );

}


// ===============================
// DIBUJAR JUGADOR
// ===============================

function dibujarJugador(tiempo) {

    const sprites = spritesAdo;


    // ===============================
    // DEATH DE ADO - 8 DIRECCIONES x 8 FRAMES
    // ===============================

    if (jugador.muriendo) {

        if (
            sprites.death.complete &&
            sprites.death.naturalWidth > 0
        ) {

            const anchoFrame = 192;
            const altoFrame = 192;

            const tiempoDeath =
                tiempo - jugador.deathInicio;

            // 8 frames de muerte, 90 ms cada uno.
            const frameActual =
                Math.min(
                    Math.floor(tiempoDeath / 90),
                    7
                );

            // Usa la última dirección en la que estaba mirando Ado.
            const filaActual =
                jugador.direccion;

            const anchoSprite = 120;
            const altoSprite = 120;

            ctx.drawImage(
                sprites.death,

                // Recorte dentro del spritesheet
                frameActual * anchoFrame,
                filaActual * altoFrame,
                anchoFrame,
                altoFrame,

                // Posición y tamaño dentro del Canvas
                jugador.x - anchoSprite / 2,
                jugador.y - altoSprite / 2,
                anchoSprite,
                altoSprite
            );

            return;
        }
    }


    // ===============================
    // HIT DE ADO - 8 DIRECCIONES x 8 FRAMES
    // ===============================

    if (tiempo < jugador.hitHasta) {

        if (
            sprites.hit.complete &&
            sprites.hit.naturalWidth > 0
        ) {

            const anchoFrame = 192;
            const altoFrame = 192;

            const tiempoHit =
                tiempo - jugador.hitInicio;

            // 8 frames de daño.
            // 55 ms x 8 frames = 440 ms aprox.
            const frameActual =
                Math.min(
                    Math.floor(tiempoHit / 55),
                    7
                );

            // El HIT usa la dirección actual del personaje:
            // 0 abajo
            // 1 abajo-derecha
            // 2 derecha
            // 3 arriba-derecha
            // 4 arriba
            // 5 arriba-izquierda
            // 6 izquierda
            // 7 abajo-izquierda
            const filaActual =
                jugador.direccion;

            // Tamaño visual similar al IDLE.
            const anchoSprite = 120;
            const altoSprite = 120;

            ctx.drawImage(
                sprites.hit,

                // Recorte dentro del spritesheet
                frameActual * anchoFrame,
                filaActual * altoFrame,
                anchoFrame,
                altoFrame,

                // Posición y tamaño dentro del Canvas
                jugador.x - anchoSprite / 2,
                jugador.y - altoSprite / 2,
                anchoSprite,
                altoSprite
            );

            return;
        }
    }


    // ===============================
    // ATTACK DE ADO - 8 DIRECCIONES x 8 FRAMES
    // ===============================

    if (tiempo < jugador.ataqueHasta) {

        if (
            sprites.attack.complete &&
            sprites.attack.naturalWidth > 0
        ) {

            const anchoFrame = 192;
            const altoFrame = 192;

            const tiempoAtaque =
                tiempo - jugador.ataqueInicio;

            const frameActual =
                Math.min(
                    Math.floor(tiempoAtaque / 70),
                    7
                );

            const filaActual =
                jugador.direccionAtaque;

            const anchoSprite = 130;
            const altoSprite = 130;

            ctx.drawImage(
                sprites.attack,

                frameActual * anchoFrame,
                filaActual * altoFrame,
                anchoFrame,
                altoFrame,

                jugador.x - anchoSprite / 2,
                jugador.y - altoSprite / 2,

                anchoSprite,
                altoSprite
            );

            return;
        }
    }


    // ===============================
    // IDLE DIRECCIONAL DE ADO
    // ===============================

    // Por ahora este mismo spritesheet se usa estando quieta y moviéndose.
    // Cuando integremos el spritesheet RUN, aquí separaremos ambos estados.
    if (
        sprites.idle.complete &&
        sprites.idle.naturalWidth > 0
    ) {

        const anchoFrame = 192;
        const altoFrame = 192;

        const frameActual =
            Math.floor(tiempo / 160) % 8;

        const filaActual =
            jugador.direccion;

        const anchoSprite = 120;
        const altoSprite = 120;

        ctx.drawImage(
            sprites.idle,

            frameActual * anchoFrame,
            filaActual * altoFrame,
            anchoFrame,
            altoFrame,

            jugador.x - anchoSprite / 2,
            jugador.y - altoSprite / 2,

            anchoSprite,
            altoSprite
        );

        return;
    }

    dibujarJugadorTemporal();
}

function dibujarJugadorTemporal() {

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

    ctx.fillStyle =
        "white";

    ctx.font =
        "bold 16px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

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

    if (!juegoPausado && !jugador.muriendo) {

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

    // ===============================
    // TERMINAR ANIMACIÓN DE MUERTE
    // ===============================

    if (
        jugador.muriendo &&
        tiempo >= jugador.deathHasta
    ) {

        terminarJuego();

        return;
    }


    dibujarEnemigos();

    dibujarJugador(tiempo);

    dibujarProyectiles();

    dibujarMensajeOleada(tiempo);


    requestAnimationFrame(
        gameLoop
    );

}

function iniciarMuerte() {

    if (jugador.muriendo) {
        return;
    }

    jugador.vida = 0;

    hudVida.textContent = 0;

    jugador.muriendo = true;

    jugador.deathInicio =
        performance.now();

    jugador.deathHasta =
        jugador.deathInicio + 720;

    teclas = {};
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

    iniciarJuego();

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

    menu.classList.remove("oculto");

});
