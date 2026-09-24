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

const btnComprarBolillo =
    document.getElementById("btnComprarBolillo");

const btnJugar = document.getElementById("btnJugar");
const btnReiniciar = document.getElementById("btnReiniciar");
const btnMenu = document.getElementById("btnMenu");
const btnContinuar = document.getElementById("btnContinuar");
const btnMenuPausa = document.getElementById("btnMenuPausa");


const hudPersonaje = document.getElementById("hudPersonaje");
const hudVida = document.getElementById("hudVida");
const hudPuntos = document.getElementById("hudPuntos");

const hudHexa =
    document.getElementById("hudHexa");

const hudXP =
    document.getElementById("hudXP");

const hudOleada = document.getElementById("hudOleada");
const hudEnemigos = document.getElementById("hudEnemigos");

const puntosFinales = document.getElementById("puntosFinales");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ===============================
// MAPA DEL JUEGO
// ===============================

const mapaJuego = new Image();

mapaJuego.src =
    "assets/img/maps/mapa_zocalo.png";


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
// SPRITES ENEMIGO - BICHO NORMAL
// ===============================

const bichoIdleLeft = new Image();
bichoIdleLeft.src =
    "assets/sprites/enemies/bicho-normal/idle-left.png";

const bichoIdleRight = new Image();
bichoIdleRight.src =
    "assets/sprites/enemies/bicho-normal/idle-right.png";

const bichoDeathLeft = new Image();
bichoDeathLeft.src =
    "assets/sprites/enemies/bicho-normal/death-left.png";

const bichoDeathRight = new Image();
bichoDeathRight.src =
    "assets/sprites/enemies/bicho-normal/death-right.png";

const bichoAttackLeft = new Image();
bichoAttackLeft.src =
    "assets/sprites/enemies/bicho-normal/attack-left.png";

const bichoAttackRight = new Image();
bichoAttackRight.src =
    "assets/sprites/enemies/bicho-normal/attack-right.png";

    // ===============================
    // SPRITES ENEMIGO - BICHO RANGER
    // ===============================

const rangerIdleLeft = new Image();
rangerIdleLeft.src =
    "assets/sprites/enemies/bicho-ranger/idle-right.png";

const rangerIdleRight = new Image();
rangerIdleRight.src =
    "assets/sprites/enemies/bicho-ranger/idle-left.png";


const rangerAttackLeft = new Image();
rangerAttackLeft.src =
    "assets/sprites/enemies/bicho-ranger/attack-right.png";

const rangerAttackRight = new Image();
rangerAttackRight.src =
    "assets/sprites/enemies/bicho-ranger/attack-left.png";


const rangerHitLeft = new Image();
rangerHitLeft.src =
    "assets/sprites/enemies/bicho-ranger/hit-right.png";

const rangerHitRight = new Image();
rangerHitRight.src =
    "assets/sprites/enemies/bicho-ranger/hit-left.png";


const rangerDeathLeft = new Image();
rangerDeathLeft.src =
    "assets/sprites/enemies/bicho-ranger/death-right.png";

const rangerDeathRight = new Image();
rangerDeathRight.src =
    "assets/sprites/enemies/bicho-ranger/death-left.png";

// ===============================
// SPRITES DE ARMAS - INDICADOR
// ===============================

const spritePistola = new Image();
spritePistola.src =
    "assets/sprites/weapons/ui/pistola.png";

const spriteEscopeta = new Image();
spriteEscopeta.src =
    "assets/sprites/weapons/ui/escopeta.png";

const spriteEnergia = new Image();
spriteEnergia.src =
    "assets/sprites/weapons/ui/energia.png";


const armas = {

    // ===========================================================
    // CONFIGURACIÓN DE ARMAS
    // ===========================================================
    // Aquí se balancean las armas del juego.
    //
    // daño:
    //   Daño que hace CADA proyectil al enemigo.
    //   En la escopeta es el daño de cada perdigón.
    //
    // cadencia:
    //   Tiempo mínimo entre disparos, en milisegundos.
    //   Un número menor = dispara más rápido.
    //
    // velocidad:
    //   Velocidad con la que avanza el proyectil.
    //
    // alcance:
    //   Distancia máxima que puede recorrer el proyectil
    //   antes de desaparecer.
    //
    // IMPORTANTE:
    // La función disparar() toma estos valores directamente.
    // Si después quieres balancear un arma, cambia los números
    // AQUÍ y no necesitas buscar valores dentro de disparar().
    // ===========================================================

    pistola: {
        nombre: "PISTOLA",
        tecla: "1",
        sprite: spritePistola,

        daño: 20,
        cadencia: 400,
        velocidad: 8,
        alcance: 900,

        // Energía que consume cada disparo.
        // La pistola no consume energía.
        costoEnergia: 0
    },

    escopeta: {
        nombre: "ESCOPETA",
        tecla: "2",
        sprite: spriteEscopeta,

        // Este daño se aplica a CADA perdigón.
        daño: 10,
        cadencia: 800,
        velocidad: 7,
        alcance: 230,

        // Consumo provisional por disparo de escopeta.
        costoEnergia: 8
    },

    energia: {
        nombre: "ENERGÍA",
        tecla: "3",
        sprite: spriteEnergia,

        // Este proyectil atraviesa enemigos.
        daño: 35,
        cadencia: 650,
        velocidad: 10,
        alcance: 1000,

        // El arma de energía es la que más recurso consume.
        costoEnergia: 20
    }

};

// ===============================
// PERSONAJES
// ===============================

const datosAdo = {

    nombre: "Ado",
    vida: 100,
    velocidad: 5,

    // Estos valores se conservan como datos base del personaje,
    // pero el disparo de cada arma usa su propia configuración
    // dentro del objeto "armas" de arriba.
    daño: 20,
    cadencia: 400,

    color: "#3366ff"

};


// ===============================
// VARIABLES DEL JUEGO
// ===============================

let jugador;

let proyectiles = [];
let proyectilesEnemigos = [];
let enemigos = [];

let teclas = {};

let mouse = {
    x: 0,
    y: 0
};

let puntos = 0;
let hexaCores = 0;
let experiencia = 0;

let ultimoDisparo = 0;
let armaActual = "pistola";

// ===========================================================
// SISTEMA DE ENERGÍA DE LAS ARMAS
// ===========================================================
// energiaMaxima:
//   Cantidad total que puede almacenar Ado.
//
// energiaActual:
//   Recurso disponible en este momento.
//
// regeneracionEnergia:
//   Cuántos puntos se recuperan por SEGUNDO.
//   Si quieres que recargue más rápido, aumenta este número.
// ===========================================================
let energiaMaxima = 100;
let energiaActual = energiaMaxima;
let regeneracionEnergia = 8;
let ultimoTiempoEnergia = 0;

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
    proyectilesEnemigos = [];
    enemigos = [];

    puntos = 0;
    hexaCores = 0;
    experiencia = 0;

    // Cada partida comienza con la energía llena
    // y con la pistola seleccionada.
    energiaActual = energiaMaxima;
    ultimoTiempoEnergia = performance.now();
    armaActual = "pistola";
    ultimoDisparo = 0;

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

    hudHexa.textContent =
        hexaCores;

    hudXP.textContent =
        experiencia;

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

// ===============================
// CAMBIAR ARMA
// ===============================

if (
    juegoActivo &&
    !juegoPausado &&
    !tiendaActiva
) {

    if (tecla === "1") {
        armaActual = "pistola";
    }

    if (tecla === "2") {
        armaActual = "escopeta";
    }

    if (tecla === "3") {
        armaActual = "energia";
    }
}

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


    // ===========================================================
    // OBTENER LA CONFIGURACIÓN DEL ARMA SELECCIONADA
    // ===========================================================
    // armaActual contiene: "pistola", "escopeta" o "energia".
    // Con esa llave obtenemos automáticamente sus estadísticas
    // desde el objeto armas.
    //
    // Ejemplo:
    // armaActual = "escopeta"
    // arma = armas.escopeta
    // ===========================================================

    const arma =
        armas[armaActual];


    const ahora =
        Date.now();


    // ===========================================================
    // CADENCIA
    // ===========================================================
    // Cada arma usa directamente su propia cadencia.
    // Ya no necesitamos escribir 400, 800 o 650 aquí.
    // ===========================================================

    if (
        ahora - ultimoDisparo
        <
        arma.cadencia
    ) {
        return;
    }


    // ===========================================================
    // COMPROBAR Y GASTAR ENERGÍA
    // ===========================================================
    // Si no hay suficiente energía, el arma no dispara.
    // La pistola tiene costoEnergia: 0, así que siempre puede
    // disparar mientras respete su cadencia.
    // ===========================================================

    if (
        energiaActual
        <
        arma.costoEnergia
    ) {
        return;
    }


    energiaActual -=
        arma.costoEnergia;

    energiaActual =
        Math.max(
            0,
            energiaActual
        );


    ultimoDisparo =
        ahora;


    // ===============================
    // ANIMACIÓN DE ATAQUE DE ADO
    // ===============================
    // Ado usa la misma animación de ataque
    // sin importar el arma seleccionada.

    jugador.ataqueInicio =
        performance.now();

    jugador.ataqueHasta =
        jugador.ataqueInicio + 560;


    // ===============================
    // DIRECCIÓN HACIA EL MOUSE
    // ===============================

    const angulo =
        Math.atan2(
            mouse.y - jugador.y,
            mouse.x - jugador.x
        );


    // Dirección de la animación de Ado.
    // Orden de las filas del spritesheet:
    // 0 ↓, 1 ↘, 2 →, 3 ↗, 4 ↑, 5 ↖, 6 ←, 7 ↙

    let grados =
        angulo * 180 / Math.PI;

    if (grados < 0) {
        grados += 360;
    }


    const octante =
        Math.round(
            grados / 45
        ) % 8;


    const mapaDireccionAtaque =
        [2, 1, 0, 7, 6, 5, 4, 3];


    jugador.direccionAtaque =
        mapaDireccionAtaque[octante];


    // ===============================
    // PISTOLA
    // ===============================
    // Dispara una sola bala.
    // Daño, velocidad, cadencia y alcance salen
    // del objeto armas.pistola.

    if (armaActual === "pistola") {

        proyectiles.push({

            x: jugador.x,
            y: jugador.y,

            radio: 6,

            velocidadX:
                Math.cos(angulo)
                * arma.velocidad,

            velocidadY:
                Math.sin(angulo)
                * arma.velocidad,

            daño:
                arma.daño,

            distanciaRecorrida: 0,

            alcanceMaximo:
                arma.alcance,

            tipo: "pistola"

        });

    }


    // ===============================
    // ESCOPETA
    // ===============================
    // Dispara 3 perdigones en abanico.
    // Cada perdigón usa el daño, velocidad y alcance
    // configurados en armas.escopeta.

    else if (
        armaActual === "escopeta"
    ) {

        // Ángulo de cada perdigón respecto al centro.
        // Si luego quieres más dispersión, aumenta estos valores.
        const dispersiones = [
            -0.12,
            0,
            0.12
        ];


        dispersiones.forEach(
            function (dispersion) {

                const anguloPerdigon =
                    angulo + dispersion;


                proyectiles.push({

                    x: jugador.x,
                    y: jugador.y,

                    radio: 5,

                    velocidadX:
                        Math.cos(
                            anguloPerdigon
                        )
                        * arma.velocidad,

                    velocidadY:
                        Math.sin(
                            anguloPerdigon
                        )
                        * arma.velocidad,

                    // El daño configurado para la escopeta
                    // se aplica a CADA perdigón.
                    daño:
                        arma.daño,

                    distanciaRecorrida: 0,

                    alcanceMaximo:
                        arma.alcance,

                    tipo: "escopeta"

                });

            }
        );

    }


    // ===============================
    // ENERGÍA
    // ===============================
    // Disparo grande que atraviesa a todos los enemigos.
    // También toma sus estadísticas directamente
    // desde armas.energia.

    else if (
        armaActual === "energia"
    ) {

        proyectiles.push({

            x: jugador.x,
            y: jugador.y,

            radio: 10,

            velocidadX:
                Math.cos(angulo)
                * arma.velocidad,

            velocidadY:
                Math.sin(angulo)
                * arma.velocidad,

            daño:
                arma.daño,

            distanciaRecorrida: 0,

            alcanceMaximo:
                arma.alcance,

            tipo: "energia",

            // Guarda qué enemigos ya fueron golpeados
            // para que el mismo proyectil no haga daño
            // varias veces al mismo enemigo mientras lo atraviesa.
            enemigosGolpeados: []

        });

    }

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

        tipo: "normal",

        x: x,

        y: y,

        radio: 18,

        velocidad: 1.5,

        vida: 30

    });

}

// ===============================
// GENERAR BICHO RANGER
// ===============================

function crearEnemigoRanger() {

    let x;
    let y;

    const lado =
        Math.floor(Math.random() * 4);

    const margen = 100;

    if (lado === 0) {

        x =
            Math.random()
            * (canvas.width - margen * 2)
            + margen;

        y = margen;

    }

    if (lado === 1) {

        x =
            canvas.width - margen;

        y =
            Math.random()
            * (canvas.height - margen * 2)
            + margen;

    }

    if (lado === 2) {

        x =
            Math.random()
            * (canvas.width - margen * 2)
            + margen;

        y =
            canvas.height - margen;

    }

    if (lado === 3) {

        x = margen;

        y =
            Math.random()
            * (canvas.height - margen * 2)
            + margen;

    }

    enemigos.push({

        tipo: "ranger",

        x: x,
        y: y,

        radio: 22,

        velocidad: 0,

        vida: 45,

        proximoDisparo: 0,

        atacandoHasta: 0,

        hitHasta: 0,

        muriendo: false,

        direccion:
            jugador.x > x
                ? "right"
                : "left"

    });

}

// ===============================
// MOVER ENEMIGOS
// ===============================

function moverEnemigos() {

    enemigos.forEach(function (enemigo) {

        // Un enemigo que está muriendo ya no se mueve.
        if (enemigo.muriendo) {
            return;
        }

        // Actualizar hacia qué lado mira.
        if (jugador.x >= enemigo.x) {
            enemigo.direccion = "right";
        } else {
            enemigo.direccion = "left";
        }

        // ===============================
// COMPORTAMIENTO DEL RANGER
// ===============================

if (enemigo.tipo === "ranger") {

    const ahora =
        performance.now();

    // Esperar un poco antes del primer ataque
    if (enemigo.proximoDisparo === 0) {

        enemigo.proximoDisparo =
            ahora + 1200;

        return;
    }

    // Iniciar ataque
    if (
        ahora >= enemigo.proximoDisparo
        &&
        ahora >= (enemigo.atacandoHasta || 0)
    ) {

        enemigo.direccionAtaque =
            enemigo.direccion;

        enemigo.atacandoHasta =
            ahora + 500;

            dispararAcidoRanger(enemigo);

        // Aproximadamente 1.8 segundos
        // entre ataques.
        enemigo.proximoDisparo =
            ahora + 1800;
    }

    return;
}

        // Mientras reproduce su ataque se queda quieto.
        if (
            performance.now() <
            (enemigo.atacandoHasta || 0)
        ) {
            return;
        }

        const diferenciaX =
            jugador.x - enemigo.x;

        const diferenciaY =
            jugador.y - enemigo.y;

        const distancia =
            Math.hypot(
                diferenciaX,
                diferenciaY
            );

        // Se detiene justo antes de atravesar al jugador.
        const distanciaMinima =
            jugador.radio +
            enemigo.radio - 2;

        if (distancia > distanciaMinima) {

            const angulo =
                Math.atan2(
                    diferenciaY,
                    diferenciaX
                );

            const movimiento =
                Math.min(
                    enemigo.velocidad,
                    distancia - distanciaMinima
                );

            enemigo.x +=
                Math.cos(angulo)
                * movimiento;

            enemigo.y +=
                Math.sin(angulo)
                * movimiento;
        }

    });

}

// ===============================
// DISPARO DE ÁCIDO DEL RANGER
// ===============================

function dispararAcidoRanger(enemigo) {

    const diferenciaX =
        jugador.x - enemigo.x;

    const diferenciaY =
        jugador.y - enemigo.y;

    const angulo =
        Math.atan2(
            diferenciaY,
            diferenciaX
        );

    const velocidadAcido = 5;

    const separacion =
        enemigo.radio + 12;

    proyectilesEnemigos.push({

        x:
            enemigo.x +
            Math.cos(angulo) * separacion,

        y:
            enemigo.y +
            Math.sin(angulo) * separacion,

        velocidadX:
            Math.cos(angulo)
            * velocidadAcido,

        velocidadY:
            Math.sin(angulo)
            * velocidadAcido,

        radio: 8,

        daño: 10,

        tipo: "acido"
    });
}

// ===============================
// PROYECTILES
// ===============================

function moverProyectiles() {

    for (
        let i = proyectiles.length - 1;
        i >= 0;
        i--
    ) {

        const proyectil =
            proyectiles[i];

        proyectil.x +=
            proyectil.velocidadX;

        proyectil.y +=
            proyectil.velocidadY;


        // Sumar la distancia recorrida en este frame
        const distanciaPaso =
            Math.hypot(
                proyectil.velocidadX,
                proyectil.velocidadY
            );

        proyectil.distanciaRecorrida +=
            distanciaPaso;


        // Eliminar si sale del canvas
        const fueraDelCanvas =
            proyectil.x < 0 ||
            proyectil.x > canvas.width ||
            proyectil.y < 0 ||
            proyectil.y > canvas.height;


        // Eliminar si ya alcanzó su alcance máximo
        const sinAlcance =
            proyectil.distanciaRecorrida
            >=
            proyectil.alcanceMaximo;


        if (
            fueraDelCanvas ||
            sinAlcance
        ) {
            proyectiles.splice(i, 1);
        }
    }
}


// ===============================
// MOVER PROYECTILES DEL RANGER
// ===============================

function moverProyectilesEnemigos() {

    for (
        let i = proyectilesEnemigos.length - 1;
        i >= 0;
        i--
    ) {

        const proyectil =
            proyectilesEnemigos[i];

        proyectil.x +=
            proyectil.velocidadX;

        proyectil.y +=
            proyectil.velocidadY;

        const fueraDelCanvas =
            proyectil.x < -30 ||
            proyectil.x > canvas.width + 30 ||
            proyectil.y < -30 ||
            proyectil.y > canvas.height + 30;

        if (fueraDelCanvas) {

            proyectilesEnemigos.splice(
                i,
                1
            );
        }
    }
}


// ===============================
// DIBUJAR ÁCIDO DEL RANGER
// ===============================

function dibujarProyectilesEnemigos() {

    proyectilesEnemigos.forEach(
        function (proyectil) {

            ctx.save();

            ctx.beginPath();

            ctx.arc(
                proyectil.x,
                proyectil.y,
                proyectil.radio,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "#7CFF00";

            ctx.shadowColor = "#7CFF00";
            ctx.shadowBlur = 14;

            ctx.fill();

            ctx.restore();
        }
    );
}


// ===============================
// COLISIONES
// ===============================

function revisarColisiones() {

// ===============================
// PROYECTILES VS ENEMIGOS
// ===============================

for (
    let i = proyectiles.length - 1;
    i >= 0;
    i--
) {

    const proyectil =
        proyectiles[i];

    let proyectilEliminado =
        false;


    for (
        let j = enemigos.length - 1;
        j >= 0;
        j--
    ) {

        const enemigo =
            enemigos[j];


        // Un enemigo que ya está muriendo
        // no puede recibir más daño.
        if (enemigo.muriendo) {
            continue;
        }
    


        // ===============================
        // ENERGÍA: EVITAR GOLPEAR DOS
        // VECES AL MISMO ENEMIGO
        // ===============================

        if (
            proyectil.tipo === "energia"
        ) {

            if (
                proyectil.enemigosGolpeados
                    .includes(enemigo)
            ) {
                continue;
            }

        }


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

            // ===============================
            // HACER DAÑO
            // ===============================

            enemigo.vida -=
                proyectil.daño;


            // ===============================
            // PROYECTIL DE ENERGÍA
            // ===============================

            if (
                proyectil.tipo === "energia"
            ) {

                // Recordar que este enemigo
                // ya recibió el impacto.
                proyectil.enemigosGolpeados
                    .push(enemigo);

                // NO eliminamos el proyectil.
                // Continúa atravesando enemigos.

            }

            // ===============================
            // PISTOLA / ESCOPETA
            // ===============================

            else {

                proyectiles.splice(
                    i,
                    1
                );

                proyectilEliminado =
                    true;

            }


            // ===============================
            // MUERTE DEL ENEMIGO
            // ===============================

            if (
                enemigo.vida <= 0
                &&
                !enemigo.muriendo
            ) {

                enemigo.muriendo =
                    true;

                enemigo.muerteInicio =
                    performance.now();

                enemigo.muerteHasta =
                    enemigo.muerteInicio + 700;

                enemigo.direccionMuerte =
                    jugador.x > enemigo.x
                        ? "right"
                        : "left";


                enemigosEliminadosOleada++;


                hudEnemigos.textContent =
                    enemigosPorOleada
                    -
                    enemigosEliminadosOleada;


                puntos += 100;

                hudPuntos.textContent =
                    puntos;


                // Recompensas
                hexaCores += 1;

                experiencia += 10;


                hudHexa.textContent =
                    hexaCores;

                hudXP.textContent =
                    experiencia;

            }


            // Pistola y escopeta desaparecen
            // al primer impacto.
            if (
                proyectilEliminado
            ) {
                break;
            }

            // Energía NO hace break.
            // Sigue buscando enemigos.
        }

    }

}

// ===============================
// PROYECTILES ENEMIGOS VS JUGADOR
// ===============================

for (
    let i = proyectilesEnemigos.length - 1;
    i >= 0;
    i--
) {

    const proyectil =
        proyectilesEnemigos[i];

    const distancia =
        Math.hypot(
            proyectil.x - jugador.x,
            proyectil.y - jugador.y
        );

    if (
        distancia <
        proyectil.radio + jugador.radio
    ) {

        // Quitar vida
        jugador.vida -=
            proyectil.daño;

        if (jugador.vida < 0) {
            jugador.vida = 0;
        }

        hudVida.textContent =
            jugador.vida;


        // Animación de daño de Ado
        const ahora =
            performance.now();

        if (
            ahora >= jugador.hitHasta
        ) {

            jugador.hitInicio =
                ahora;

            jugador.hitHasta =
                ahora + 440;
        }


        // El proyectil desaparece al impactar
        proyectilesEnemigos.splice(
            i,
            1
        );


        // Si Ado se queda sin vida
        if (jugador.vida <= 0) {

            iniciarMuerte();
        }
    }
}

    // ===============================
    // JUGADOR VS ENEMIGOS
    // ===============================

    enemigos.forEach(function (enemigo) {

            // SOLO el bicho normal hace daño cuerpo a cuerpo
    if (enemigo.tipo !== "normal") {
        return;
    }

        // Un enemigo muerto ya no puede atacar.
        if (enemigo.muriendo) {
            return;
        }

        const distancia =
            Math.hypot(
                jugador.x - enemigo.x,
                jugador.y - enemigo.y
            );

        if (
            distancia
            <
            jugador.radio + enemigo.radio
        ) {

            const ahora =
                performance.now();

            // Cada bicho tiene su propio cooldown de ataque.
            if (
                ahora >=
                (enemigo.proximoAtaque || 0)
            ) {

                enemigo.proximoAtaque =
                    ahora + 700;

                jugador.vida -= 1;

                if (jugador.vida < 0) {
                    jugador.vida = 0;
                }

                hudVida.textContent =
                    jugador.vida;

                // IMPORTANTE:
                // conserva la corrección que hicimos al HIT de Ado.
                // Aunque varios bichos golpeen, la animación actual
                // no vuelve a comenzar hasta que termine.
                if (ahora >= jugador.hitHasta) {

                    jugador.hitInicio =
                        ahora;

                    jugador.hitHasta =
                        ahora + 440;
                }

                // Animación de ataque del bicho.
                enemigo.atacandoHasta =
                    ahora + 400;

                enemigo.direccionAtaque =
                    jugador.x > enemigo.x
                        ? "right"
                        : "left";

                // Empuje pequeño para separar las hitboxes.
                const angulo =
                    Math.atan2(
                        enemigo.y - jugador.y,
                        enemigo.x - jugador.x
                    );

                enemigo.x +=
                    Math.cos(angulo) * 10;

                enemigo.y +=
                    Math.sin(angulo) * 10;

                if (jugador.vida <= 0) {
                    iniciarMuerte();
                }
            }
        }
    });

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


            // ===============================
            // COLOR SEGÚN EL ARMA
            // ===============================

            if (
                proyectil.tipo === "energia"
            ) {

                ctx.fillStyle =
                    "#39d9ff";

            } else if (
                proyectil.tipo === "escopeta"
            ) {

                ctx.fillStyle =
                    "#ffd36a";

            } else {

                ctx.fillStyle =
                    "#ffffff";

            }


            ctx.fill();

        }
    );
}

// ===============================
// DIBUJAR ENEMIGOS
// ===============================

// ===============================
// DIBUJAR BICHO RANGER
// ===============================

function dibujarRanger(enemigo, tiempo, indice) {

    let sprite;
    let cantidadFrames = 5;
    let frameActual = 0;

    // ===============================
    // MUERTE
    // ===============================

    if (enemigo.muriendo) {

        if (enemigo.direccionMuerte === "right") {
            sprite = rangerDeathRight;
        } else {
            sprite = rangerDeathLeft;
        }

        if (tiempo >= enemigo.muerteHasta) {

            enemigos.splice(
                indice,
                1
            );

            return;
        }

        const tiempoMuerte =
            tiempo - enemigo.muerteInicio;

        frameActual =
            Math.min(
                Math.floor(tiempoMuerte / 140),
                cantidadFrames - 1
            );
    }

    // ===============================
    // RECIBIENDO DAÑO
    // ===============================

    else if (
        tiempo <
        (enemigo.hitHasta || 0)
    ) {

        if (jugador.x > enemigo.x) {
            sprite = rangerHitRight;
        } else {
            sprite = rangerHitLeft;
        }

        const tiempoHit =
            300 -
            (
                enemigo.hitHasta -
                tiempo
            );

        frameActual =
            Math.min(
                Math.floor(tiempoHit / 60),
                cantidadFrames - 1
            );
    }

    // ===============================
    // ATAQUE
    // ===============================

    else if (
        tiempo <
        (enemigo.atacandoHasta || 0)
    ) {

        if (enemigo.direccionAtaque === "right") {
            sprite = rangerAttackRight;
        } else {
            sprite = rangerAttackLeft;
        }

        const tiempoAtaque =
            500 -
            (
                enemigo.atacandoHasta -
                tiempo
            );

        frameActual =
            Math.min(
                Math.floor(tiempoAtaque / 100),
                cantidadFrames - 1
            );
    }

    // ===============================
    // IDLE
    // ===============================

    else {

        if (jugador.x > enemigo.x) {

            sprite = rangerIdleRight;

            enemigo.direccion =
                "right";

        } else {

            sprite = rangerIdleLeft;

            enemigo.direccion =
                "left";
        }

        frameActual =
            Math.floor(
                tiempo / 180
            )
            %
            cantidadFrames;
    }


    // Si todavía no cargó el sprite
    if (
        !sprite.complete ||
        sprite.naturalWidth === 0
    ) {

        ctx.beginPath();

        ctx.arc(
            enemigo.x,
            enemigo.y,
            enemigo.radio,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#65ff38";

        ctx.fill();

        return;
    }


    const anchoFrame =
        sprite.naturalWidth /
        cantidadFrames;

    const altoFrame =
        sprite.naturalHeight;


    const altoSprite = 110;

    const anchoSprite =
        altoSprite *
        (
            anchoFrame /
            altoFrame
        );


    ctx.drawImage(
        sprite,

        frameActual * anchoFrame,
        0,

        anchoFrame,
        altoFrame,

        enemigo.x - anchoSprite / 2,
        enemigo.y - altoSprite / 2,

        anchoSprite,
        altoSprite
    );
}

function dibujarEnemigos() {

    const tiempo =
        performance.now();

    for (
        let i = enemigos.length - 1;
        i >= 0;
        i--
    ) {

        const enemigo =
            enemigos[i];

            if (enemigo.tipo === "ranger") {

    dibujarRanger(
        enemigo,
        tiempo,
        i
    );

    continue;
}

        let sprite;
        let cantidadFrames;
        let frameActual = 0;


        // ===============================
        // MUERTE DEL BICHO
        // ===============================

        if (enemigo.muriendo) {

            sprite =
                bichoDeathLeft;

            cantidadFrames = 5;

            // Al terminar la animación
            // ahora sí se elimina del arreglo.
            if (tiempo >= enemigo.muerteHasta) {

                enemigos.splice(
                    i,
                    1
                );

                continue;
            }
        }

        // ===============================
        // ATAQUE DEL BICHO
        // ===============================

        else if (
            tiempo <
            (enemigo.atacandoHasta || 0)
        ) {

            // Se conserva la orientación
            // de los sprites que ya probó tu amigo.
            if (
                enemigo.direccionAtaque
                === "right"
            ) {
                sprite =
                    bichoAttackLeft;
            } else {
                sprite =
                    bichoAttackRight;
            }

            cantidadFrames = 4;
        }

        // ===============================
        // IDLE / PERSECUCIÓN
        // ===============================

        else {

            if (jugador.x > enemigo.x) {

                sprite =
                    bichoIdleRight;

            } else {

                sprite =
                    bichoIdleLeft;
            }

            cantidadFrames = 4;
        }


        // Si el sprite aún no terminó de cargar,
        // dibuja el círculo rojo temporal.
        if (
            !sprite.complete
            ||
            sprite.naturalWidth === 0
        ) {

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

            continue;
        }


        const anchoFrame =
            sprite.naturalWidth
            / cantidadFrames;

        const altoFrame =
            sprite.naturalHeight;


        if (enemigo.muriendo) {

            const tiempoMuerte =
                tiempo
                - enemigo.muerteInicio;

            frameActual =
                Math.min(
                    Math.floor(
                        tiempoMuerte / 140
                    ),
                    cantidadFrames - 1
                );

        } else if (
            tiempo <
            (enemigo.atacandoHasta || 0)
        ) {

            const tiempoAtaque =
                400
                - (
                    enemigo.atacandoHasta
                    - tiempo
                );

            frameActual =
                Math.min(
                    Math.floor(
                        tiempoAtaque / 100
                    ),
                    cantidadFrames - 1
                );

        } else {

            frameActual =
                Math.floor(
                    tiempo / 160
                )
                % cantidadFrames;
        }


        const altoSprite = 95;

        const anchoSprite =
            altoSprite
            * (
                anchoFrame
                / altoFrame
            );


        // La muerte usa un volteo horizontal
        // cuando corresponde.
        if (
            enemigo.muriendo
            &&
            enemigo.direccionMuerte === "right"
        ) {

            ctx.save();

            ctx.translate(
                enemigo.x,
                enemigo.y
            );

            ctx.scale(
                -1,
                1
            );

            ctx.drawImage(
                sprite,

                frameActual * anchoFrame,
                0,

                anchoFrame,
                altoFrame,

                -anchoSprite / 2,
                -altoSprite / 2,

                anchoSprite,
                altoSprite
            );

            ctx.restore();

        } else {

            ctx.drawImage(
                sprite,

                frameActual * anchoFrame,
                0,

                anchoFrame,
                altoFrame,

                enemigo.x - anchoSprite / 2,
                enemigo.y - altoSprite / 2,

                anchoSprite,
                altoSprite
            );
        }
    }

}

// ===========================================================
// REGENERAR ENERGÍA
// ===========================================================
// Esta función usa el tiempo real entre frames para recuperar
// energía de forma suave, sin depender de los FPS del juego.
//
// Mientras el juego está pausado o Ado está muriendo, no se
// regenera energía. El reloj sí se actualiza para evitar que
// al volver de una pausa se recupere toda de golpe.
// ===========================================================

function regenerarEnergia(tiempo) {

    if (ultimoTiempoEnergia === 0) {
        ultimoTiempoEnergia = tiempo;
        return;
    }


    const deltaSegundos =
        (tiempo - ultimoTiempoEnergia) / 1000;

    ultimoTiempoEnergia =
        tiempo;


    if (
        juegoPausado ||
        jugador.muriendo
    ) {
        return;
    }


    energiaActual +=
        regeneracionEnergia
        * deltaSegundos;


    energiaActual =
        Math.min(
            energiaMaxima,
            energiaActual
        );
}


function dibujarArmaActual(tiempo) {

    const arma =
        armas[armaActual];

    const sprite =
        arma.sprite;


    // ===============================
    // POSICIÓN DEL PANEL
    // ===============================

    const x = 20;

    const y =
        canvas.height - 145;

    const anchoPanel = 180;

    // Un poco más alto para incluir la barra de energía.
    const altoPanel = 125;


    // ===============================
    // FONDO DEL PANEL
    // ===============================

    ctx.fillStyle =
        "rgba(5, 5, 20, 0.80)";

    ctx.fillRect(
        x,
        y,
        anchoPanel,
        altoPanel
    );


    // ===============================
    // BORDE DEL PANEL
    // ===============================

    ctx.strokeStyle =
        "rgba(80, 120, 255, 0.9)";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        x,
        y,
        anchoPanel,
        altoPanel
    );


    // ===============================
    // SPRITE ANIMADO DEL ARMA
    // ===============================

    if (
        sprite.complete &&
        sprite.naturalWidth > 0
    ) {

        const cantidadFrames = 4;

        const anchoFrame =
            sprite.naturalWidth /
            cantidadFrames;

        const altoFrame =
            sprite.naturalHeight;

        const frameActual =
            Math.floor(
                tiempo / 150
            ) % cantidadFrames;


        const anchoSprite = 80;

        const altoSprite = 50;


        // Centrar el sprite horizontalmente
        const spriteX =
            x
            +
            (
                anchoPanel -
                anchoSprite
            ) / 2;

        const spriteY =
            y + 6;


        ctx.drawImage(
            sprite,

            frameActual * anchoFrame,
            0,

            anchoFrame,
            altoFrame,

            spriteX,
            spriteY,

            anchoSprite,
            altoSprite
        );
    }


    // ===============================
    // NOMBRE DEL ARMA
    // ===============================

    ctx.fillStyle =
        "white";

    ctx.font =
        "bold 16px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    ctx.fillText(
        arma.nombre,

        x + anchoPanel / 2,

        y + 72
    );


    // ===============================
    // TEXTO DE ENERGÍA
    // ===============================

    ctx.fillStyle =
        "#9eeaff";

    ctx.font =
        "bold 11px Arial";

    ctx.fillText(
        "ENERGÍA "
        + Math.floor(energiaActual)
        + " / "
        + energiaMaxima,

        x + anchoPanel / 2,
        y + 92
    );


    // ===============================
    // BARRA DE ENERGÍA
    // ===============================

    const barraX =
        x + 15;

    const barraY =
        y + 103;

    const anchoBarra =
        anchoPanel - 30;

    const altoBarra = 10;


    // Fondo de la barra.
    ctx.fillStyle =
        "rgba(255, 255, 255, 0.15)";

    ctx.fillRect(
        barraX,
        barraY,
        anchoBarra,
        altoBarra
    );


    // Porcentaje entre 0 y 1.
    const porcentajeEnergia =
        energiaActual
        /
        energiaMaxima;


    // Parte llena de la barra.
    ctx.fillStyle =
        "#39d9ff";

    ctx.fillRect(
        barraX,
        barraY,
        anchoBarra * porcentajeEnergia,
        altoBarra
    );


    // Borde de la barra.
    ctx.strokeStyle =
        "rgba(120, 220, 255, 0.9)";

    ctx.lineWidth = 1;

    ctx.strokeRect(
        barraX,
        barraY,
        anchoBarra,
        altoBarra
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
// DIBUJAR MAPA
// ===============================

function dibujarMapa() {

    if (
        !mapaJuego.complete ||
        mapaJuego.naturalWidth === 0
    ) {
        ctx.fillStyle = "#16131d";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
    }

    const escala = Math.max(
        canvas.width / mapaJuego.naturalWidth,
        canvas.height / mapaJuego.naturalHeight
    );

    const anchoDibujado = mapaJuego.naturalWidth * escala;
    const altoDibujado = mapaJuego.naturalHeight * escala;

    const x = (canvas.width - anchoDibujado) / 2;
    const y = (canvas.height - altoDibujado) / 2;

    ctx.drawImage(
        mapaJuego,
        x,
        y,
        anchoDibujado,
        altoDibujado
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
dibujarMapa();

    // Recuperar energía poco a poco durante la partida.
    regenerarEnergia(tiempo);


    if (!juegoPausado && !jugador.muriendo) {

        // GENERAR ENEMIGOS

if (
    !esperandoOleada
    &&
    enemigosGenerados < enemigosPorOleada
    &&
    tiempo - ultimoSpawn > intervaloSpawn
) {

    const cantidadRangers =
        Math.min(
            4,
            Math.max(
                0,
                oleada - 1
            )
        );

    if (
        enemigosGenerados <
        cantidadRangers
    ) {

        crearEnemigoRanger();

    } else {

        crearEnemigo();
    }

    enemigosGenerados++;

    ultimoSpawn = tiempo;
}


        moverJugador();

        moverProyectiles();

        moverProyectilesEnemigos();

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

    dibujarProyectilesEnemigos();

    dibujarMensajeOleada(tiempo);

    dibujarArmaActual(tiempo);

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

btnComprarBolillo.addEventListener("click", function () {

    const precioBolillo = 3;
    const curacionBolillo = 25;

    if (jugador.vida >= jugador.vidaMaxima) {
        alert("Tu personaje ya tiene la vida completa.");
        return;
    }

    if (hexaCores < precioBolillo) {
        alert("No tienes suficientes Hexa Cores.");
        return;
    }

    hexaCores -= precioBolillo;

    jugador.vida = Math.min(
        jugador.vida + curacionBolillo,
        jugador.vidaMaxima
    );

    hudVida.textContent = jugador.vida;
    hudHexa.textContent = hexaCores;

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
