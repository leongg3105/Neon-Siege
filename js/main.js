// ============================================================
// MAIN.JS - MULTIVERSE SURVIVAL
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
const ranking = document.getElementById("ranking");
const creditos = document.getElementById("creditos");

const btnRanking = document.getElementById("btnRanking");
const btnVolverRanking = document.getElementById("btnVolverRanking");
const rankingLista = document.getElementById("rankingLista");
const rankingEstado = document.getElementById("rankingEstado");

const btnCreditos = document.getElementById("btnCreditos");
const btnVolverCreditos = document.getElementById("btnVolverCreditos");

const pausaOverlay = document.getElementById("pausaOverlay");

const tiendaOverlay = document.getElementById("tiendaOverlay");
const tiendaOpciones = document.getElementById("tiendaOpciones");
const btnCerrarTienda = document.getElementById("btnCerrarTienda");
const tiendaHexa = document.getElementById("tiendaHexa");
const avisoTienda = document.getElementById("avisoTienda");

const btnComprarBolillo =
    document.getElementById("btnComprarBolillo");

const btnComprarBateria =
    document.getElementById("btnComprarBateria");

const btnComprarCatalizador =
    document.getElementById("btnComprarCatalizador");

// Contenedor donde se crean las mejoras de TODAS las armas.
// Ya no dependemos del arma equipada para decidir qué se puede comprar.
const contenedorMejorasArmas =
    document.getElementById("contenedorMejorasArmas");

const btnJugar = document.getElementById("btnJugar");
const btnReiniciar = document.getElementById("btnReiniciar");
const btnMenu = document.getElementById("btnMenu");
const btnContinuar = document.getElementById("btnContinuar");
const btnMenuPausa = document.getElementById("btnMenuPausa");

// Overlay que aparece cada vez que Ado sube de nivel por experiencia.
const nivelOverlay = document.getElementById("nivelOverlay");
const nivelNuevo = document.getElementById("nivelNuevo");
const nivelPendientes = document.getElementById("nivelPendientes");
const opcionesNivel = document.querySelectorAll(".opcionNivel");


const hudPersonaje = document.getElementById("hudPersonaje");
const hudVida = document.getElementById("hudVida");
const hudPuntos = document.getElementById("hudPuntos");
const hudCombo = document.getElementById("hudCombo");
const hudMultiplicador = document.getElementById("hudMultiplicador");

const hudHexa =
    document.getElementById("hudHexa");

const hudXP =
    document.getElementById("hudXP");

const hudNivel =
    document.getElementById("hudNivel");

const hudXPMax =
    document.getElementById("hudXPMax");

const hudOleada = document.getElementById("hudOleada");
const hudEnemigos = document.getElementById("hudEnemigos");

const puntosFinales = document.getElementById("puntosFinales");
const tiempoFinal = document.getElementById("tiempoFinal");
const bonusTiempoFinal = document.getElementById("bonusTiempoFinal");
const comboMaximoFinal = document.getElementById("comboMaximoFinal");
const nombreJugador = document.getElementById("nombreJugador");
const btnGuardarPuntaje = document.getElementById("btnGuardarPuntaje");
const estadoGuardarPuntaje = document.getElementById("estadoGuardarPuntaje");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Cuando se usa Live Server (puerto 5500), el backend sigue corriendo
// en el puerto 3000. Si abrimos el juego directamente desde Node,
// utilizamos la misma dirección del navegador.
const API_BASE =
    window.location.port === "3000"
        ? "/api"
        : "http://localhost:3000/api";

// ===========================================================
// SISTEMA DE EFECTOS DE SONIDO
// ===========================================================
// Todos los archivos viven en assets/audio/sfx/.
// Cada efecto usa varios canales para que disparos e impactos
// rápidos puedan superponerse sin cortar el sonido anterior.
// ===========================================================

const volumenGeneralSFX = 0.55;
const canalesPorSonido = 6;

const sonidos = {
    pistola: { ruta: "assets/audio/sfx/pistola.wav", volumen: 0.55 },
    escopeta: { ruta: "assets/audio/sfx/escopeta.wav", volumen: 0.58 },
    energia: { ruta: "assets/audio/sfx/energia.wav", volumen: 0.50 },
    explosionEnergia: { ruta: "assets/audio/sfx/explosion_energia.wav", volumen: 0.68 },
    impactoEnemigo: { ruta: "assets/audio/sfx/impacto_enemigo.wav", volumen: 0.22 },
    enemigoMuerte: { ruta: "assets/audio/sfx/enemigo_muerte.wav", volumen: 0.32 },
    adoHit: { ruta: "assets/audio/sfx/ado_hit.wav", volumen: 0.48 },
    adoMuerte: { ruta: "assets/audio/sfx/ado_muerte.wav", volumen: 0.62 },
    gameOver: { ruta: "assets/audio/sfx/game_over.wav", volumen: 0.68 },
    subidaNivel: { ruta: "assets/audio/sfx/subida_nivel.wav", volumen: 0.55 },
    compra: { ruta: "assets/audio/sfx/compra.wav", volumen: 0.50 },
    error: { ruta: "assets/audio/sfx/error.wav", volumen: 0.38 },
    rangerDisparo: { ruta: "assets/audio/sfx/ranger_disparo.wav", volumen: 0.32 }
};

Object.keys(sonidos).forEach(function (clave) {

    const sonido = sonidos[clave];

    sonido.canales = [];
    sonido.indiceCanal = 0;

    for (let i = 0; i < canalesPorSonido; i++) {

        const audio = new Audio(sonido.ruta);
        audio.preload = "auto";

        sonido.canales.push(audio);
    }

});


function reproducirSonido(clave) {

    const sonido = sonidos[clave];

    if (!sonido || sonido.canales.length === 0) {
        return;
    }

    const canal =
        sonido.canales[sonido.indiceCanal];

    sonido.indiceCanal =
        (sonido.indiceCanal + 1)
        % sonido.canales.length;

    canal.pause();
    canal.currentTime = 0;
    canal.volume =
        Math.min(
            1,
            volumenGeneralSFX * sonido.volumen
        );

    const reproduccion = canal.play();

    // Algunos navegadores pueden bloquear audio antes de la
    // primera interacción del usuario. Evitamos ensuciar consola.
    if (reproduccion !== undefined) {
        reproduccion.catch(function () {});
    }

}

// ===========================================================
// SISTEMA DE MÚSICA
// ===========================================================
// Hay una pista tranquila para el menú y otra más intensa para
// la partida. Ambas se reproducen en bucle.
//
// IMPORTANTE:
// los navegadores suelen bloquear audio hasta que el usuario
// hace su primera interacción. Por eso intentamos iniciar la
// música del menú en el primer pointerdown de la página.
// ===========================================================

const volumenGeneralMusica = 0.18;

const musicas = {

    menu: new Audio(
        "assets/audio/music/menu.wav"
    ),

    combate: new Audio(
        "assets/audio/music/combate.wav"
    ),

    hivelord: new Audio(
        "assets/audio/music/hivelord.mp3"
    )
};

Object.keys(musicas).forEach(function (clave) {

    const musica = musicas[clave];

    musica.loop = true;
    musica.preload = "auto";
    musica.volume = volumenGeneralMusica;

});

let musicaActual = null;

let tiempoMusicaCombateAntesJefe = 0;


function reproducirMusica(clave, reiniciar = false) {

    const nuevaMusica = musicas[clave];

    if (!nuevaMusica) {
        return;
    }

    // Si ya estamos usando esa pista, solo la reanudamos.
    if (musicaActual === nuevaMusica) {

        if (reiniciar) {
            musicaActual.currentTime = 0;
        }

        if (musicaActual.paused) {

            const reproduccion =
                musicaActual.play();

            if (reproduccion !== undefined) {
                reproduccion.catch(function () {});
            }
        }

        return;
    }

    // Detener la pista anterior antes de cambiar.
    if (musicaActual) {
        musicaActual.pause();
        musicaActual.currentTime = 0;
    }

    musicaActual = nuevaMusica;

    if (reiniciar) {
        musicaActual.currentTime = 0;
    }

    musicaActual.volume =
        volumenGeneralMusica;

    const reproduccion =
        musicaActual.play();

    if (reproduccion !== undefined) {
        reproduccion.catch(function () {});
    }

}


function pausarMusica() {

    if (musicaActual) {
        musicaActual.pause();
    }

}


function reanudarMusica() {

    if (!musicaActual) {
        return;
    }

    const reproduccion =
        musicaActual.play();

    if (reproduccion !== undefined) {
        reproduccion.catch(function () {});
    }

}


function detenerMusica() {

    if (!musicaActual) {
        return;
    }

    musicaActual.pause();
    musicaActual.currentTime = 0;
    musicaActual = null;

}


// ===========================================================
// PANTALLA DE INICIO + DESBLOQUEO DE AUDIO
// ===========================================================
// Los navegadores modernos bloquean el audio con sonido hasta que
// el usuario realiza una interacción. En lugar de mostrar el menú
// en silencio, usamos una pantalla inicial de MULTIVERSE SURVIVAL.
//
// Al hacer clic (o pulsar Enter/Espacio):
// 1. se habilita el audio;
// 2. comienza la música del menú;
// 3. desaparece esta pantalla;
// 4. queda visible el menú principal.
// ===========================================================

let pantallaInicioActiva = true;


// ===============================
// PANTALLA INICIAL EN SILENCIO
// ===============================

detenerMusica();


const pantallaInicio =
    document.createElement("div");
pantallaInicio.id =
    "pantallaInicioMultiverse";

pantallaInicio.innerHTML = `
    <div class="inicioMultiverseContenido">
        <div class="inicioMultiverseLinea"></div>

        <h1>MULTIVERSE SURVIVAL</h1>

        <p class="inicioMultiverseEstado">
            ⬡ SISTEMA LISTO ⬡
        </p>

        <button
            id="btnIniciarMultiverse"
            type="button"
        >
            HAZ CLIC PARA INICIAR
        </button>

        <p class="inicioMultiverseAyuda">
            También puedes presionar ENTER o ESPACIO
        </p>
    </div>
`;

document.body.appendChild(
    pantallaInicio
);


// Estilos de esta pantalla.
// Se crean desde JavaScript para no obligarnos a modificar styles.css.
const estilosPantallaInicio =
    document.createElement("style");

estilosPantallaInicio.textContent = `
    #pantallaInicioMultiverse {
        position: fixed;
        inset: 0;
        z-index: 99999;

        display: flex;
        align-items: center;
        justify-content: center;

        overflow: hidden;

        background: #05050c;

        color: white;
        font-family: Arial, sans-serif;
        text-align: center;
        cursor: pointer;
    }

    /* MISMO FONDO DEL MENÚ PRINCIPAL */
    #pantallaInicioMultiverse::before {
        content: "";

        position: absolute;

        top: -5%;
        left: -5%;

        width: 110%;
        height: 110%;

        background-image:
            url("assets/img/menu/FMenuApocalipsis.png");

        background-size: cover;
        background-position: center;

        animation:
            movimientoFondoInicioMultiverse
            14s ease-in-out infinite alternate;

        z-index: 0;
    }

    /* MISMA IDEA DE CAPA OSCURA DEL MENÚ */
    #pantallaInicioMultiverse::after {
        content: "";

        position: absolute;
        inset: 0;

        background:
            rgba(0, 0, 0, 0.48);

        z-index: 1;
    }

    .inicioMultiverseContenido {
        position: relative;
        z-index: 3;

        width: min(680px, 88vw);
        padding: 46px 30px;

        border:
            1px solid
            rgba(255, 160, 120, 0.28);

        border-radius: 14px;

        background:
            rgba(12, 6, 12, 0.34);

        backdrop-filter:
            blur(2px);

        box-shadow:
            0 0 36px
            rgba(120, 18, 18, 0.18);
    }

    .inicioMultiverseLinea {
        width: 130px;
        height: 3px;
        margin: 0 auto 22px;

        background:
            linear-gradient(
                90deg,
                #ff9c6a,
                #ff604f
            );

        box-shadow:
            0 0 10px
            rgba(255, 95, 70, 0.78);
    }

    #pantallaInicioMultiverse h1 {
        margin: 0;

        font-size:
            clamp(34px, 6vw, 66px);

        letter-spacing: 0.08em;

        color: #ffffff;

        text-shadow:
            0 2px 6px rgba(0, 0, 0, 0.75),
            0 0 18px rgba(180, 35, 35, 0.35);
    }

    .inicioMultiverseEstado {
        margin: 20px 0 32px;

        color: #ffd0bd;

        font-size: 14px;
        letter-spacing: 0.19em;

        text-shadow:
            0 2px 4px
            rgba(0, 0, 0, 0.8);
    }

    #btnIniciarMultiverse {
        min-width: 290px;
        padding: 16px 30px;

        border:
            1px solid
            rgba(255, 255, 255, 0.30);

        border-radius: 8px;

        background:
            rgba(10, 10, 20, 0.72);

        color: white;

        font-weight: bold;
        font-size: 17px;
        letter-spacing: 0.12em;

        cursor: pointer;

        transition:
            transform 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;

        animation:
            pulsoInicioMultiverse
            1.45s ease-in-out infinite;
    }

    #btnIniciarMultiverse:hover {
        transform:
            translateY(-2px)
            scale(1.025);

        background:
            rgba(255, 255, 255, 0.15);

        box-shadow:
            0 0 24px
            rgba(255, 95, 65, 0.24);
    }

    .inicioMultiverseAyuda {
        margin: 18px 0 0;

        color:
            rgba(255, 235, 225, 0.68);

        font-size: 12px;
        letter-spacing: 0.08em;

        text-shadow:
            0 2px 4px
            rgba(0, 0, 0, 0.85);
    }

    @keyframes movimientoFondoInicioMultiverse {

        0% {
            transform:
                scale(1.07)
                translate(0, 0);
        }

        50% {
            transform:
                scale(1.12)
                translate(-2%, -1%);
        }

        100% {
            transform:
                scale(1.17)
                translate(-4%, -2%);
        }

    }

    @keyframes pulsoInicioMultiverse {

        0%,
        100% {
            box-shadow:
                0 0 8px
                rgba(255, 95, 65, 0.12);
        }

        50% {
            box-shadow:
                0 0 24px
                rgba(255, 95, 65, 0.34);
        }

    }
`

document.head.appendChild(
    estilosPantallaInicio
);


function cerrarPantallaInicio() {

    if (!pantallaInicioActiva) {
        return;
    }

    pantallaInicioActiva = false;

    // Esta llamada ocurre dentro de una interacción real del usuario,
    // así que el navegador ya permite reproducir sonido.
    reproducirMusica(
        "menu",
        true
    );

    pantallaInicio.remove();

}


pantallaInicio.addEventListener(
    "click",
    cerrarPantallaInicio
);


document.addEventListener(
    "keydown",
    function (evento) {

        if (!pantallaInicioActiva) {
            return;
        }

        if (
            evento.key === "Enter"
            ||
            evento.code === "Space"
        ) {

            evento.preventDefault();

            cerrarPantallaInicio();

        }

    }
);


// ===========================================================
// PANTALLA DE INSTRUCCIONES
// ===========================================================
// Se crea desde JavaScript para no modificar index.html ni styles.css.
// El botón se inserta en el menú principal, entre JUGAR y RANKING.
// ===========================================================

const btnInstrucciones =
    document.createElement("button");

btnInstrucciones.id =
    "btnInstrucciones";

btnInstrucciones.textContent =
    "INSTRUCCIONES";


// La clase .menuBotones ya da el mismo estilo que los demás botones.
const menuBotones =
    menu.querySelector(".menuBotones");

if (menuBotones) {

    if (btnRanking) {

        menuBotones.insertBefore(
            btnInstrucciones,
            btnRanking
        );

    } else {

        menuBotones.appendChild(
            btnInstrucciones
        );

    }

}


// Creamos la pantalla completa de instrucciones.
const instrucciones =
    document.createElement("section");

instrucciones.id =
    "instrucciones";

instrucciones.classList.add(
    "oculto"
);

instrucciones.innerHTML = `
    <div class="instruccionesContenido">

        <div class="instruccionesEncabezado">
            <p class="instruccionesEtiqueta">
                MULTIVERSE SURVIVAL
            </p>

            <h2>INSTRUCCIONES</h2>

            <p class="instruccionesSubtitulo">
                Sobrevive a las oleadas, mejora a Ado
                y consigue la mayor puntuación posible.
            </p>
        </div>


        <div class="instruccionesGrid">

            <article class="instruccionesTarjeta">
                <h3>🎮 CONTROLES</h3>

                <div class="instruccionFila">
                    <span class="teclaInstruccion">W A S D</span>
                    <span>Movimiento</span>
                </div>

                <div class="instruccionFila">
                    <span class="teclaInstruccion">MOUSE</span>
                    <span>Apuntar</span>
                </div>

                <div class="instruccionFila">
                    <span class="teclaInstruccion">CLIC IZQ.</span>
                    <span>Disparar</span>
                </div>

                <div class="instruccionFila">
                    <span class="teclaInstruccion">CLIC DER.</span>
                    <span>Detonar energía especial Nv. 2</span>
                </div>

                <div class="instruccionFila">
                    <span class="teclaInstruccion">1 / 2 / 3</span>
                    <span>Cambiar de arma</span>
                </div>

                <div class="instruccionFila">
                    <span class="teclaInstruccion">P / ESC</span>
                    <span>Pausar / continuar</span>
                </div>

                <div class="instruccionFila">
                    <span class="teclaInstruccion">F2</span>
                    <span>Activar modo Debug</span>
                </div>
            </article>


            <article class="instruccionesTarjeta">
                <h3>🔫 ARMAS</h3>

                <div class="armaInstruccion">
                    <strong>1 · PISTOLA</strong>
                    <p>
                        Arma equilibrada y precisa.
                        Su especial añade proyectiles alineados.
                    </p>
                </div>

                <div class="armaInstruccion">
                    <strong>2 · ESCOPETA</strong>
                    <p>
                        Dispara varios perdigones con dispersión
                        y funciona mejor a corta distancia.
                    </p>
                </div>

                <div class="armaInstruccion">
                    <strong>3 · ENERGÍA</strong>
                    <p>
                        Consume energía y atraviesa enemigos.
                        Su mejora máxima permite detonación manual.
                    </p>
                </div>
            </article>


            <article class="instruccionesTarjeta">
                <h3>⬡ RECURSOS</h3>

                <div class="recursoInstruccion">
                    <strong>❤️ VIDA</strong>
                    <span>
                        Si llega a 0, termina la partida.
                    </span>
                </div>

                <div class="recursoInstruccion">
                    <strong>⚡ ENERGÍA</strong>
                    <span>
                        Se regenera y se utiliza con armas especiales.
                    </span>
                </div>

                <div class="recursoInstruccion">
                    <strong>XP</strong>
                    <span>
                        Derrota enemigos para subir de nivel.
                    </span>
                </div>

                <div class="recursoInstruccion">
                    <strong>⬡ HEXA CORES</strong>
                    <span>
                        Se utilizan para comprar mejoras en la tienda.
                    </span>
                </div>
            </article>


            <article class="instruccionesTarjeta">
                <h3>🔥 PUNTUACIÓN Y PROGRESIÓN</h3>

                <p>
                    Elimina enemigos consecutivamente sin recibir daño
                    para aumentar el combo y el multiplicador.
                </p>

                <p>
                    Al subir de nivel podrás elegir mejoras para Ado.
                    Entre oleadas también aparecerá la tienda cuando corresponda.
                </p>

                <p>
                    Tu puntuación final también recibe un bonus
                    por el tiempo que logres sobrevivir.
                </p>
            </article>

        </div>


        <button
            id="btnVolverInstrucciones"
            type="button"
        >
            VOLVER AL MENÚ
        </button>

    </div>
`;

const mainElemento =
    document.querySelector("main");

if (mainElemento) {

    mainElemento.appendChild(
        instrucciones
    );

} else {

    document.body.appendChild(
        instrucciones
    );

}


const estilosInstrucciones =
    document.createElement("style");

estilosInstrucciones.textContent = `

    /* ===================================================== */
    /* PANTALLA DE INSTRUCCIONES */
    /* ===================================================== */

    #instrucciones {
        position: fixed;
        inset: 0;
        z-index: 9000;

        display: flex;
        justify-content: center;
        align-items: center;

        padding: 34px 20px;

        overflow-y: auto;

        color: white;

        background:
            linear-gradient(
                rgba(15, 3, 8, 0.73),
                rgba(5, 2, 8, 0.94)
            ),
            url("assets/img/menu/FMenuApocalipsis.png");

        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }


    #instrucciones.oculto {
        display: none;
    }


    .instruccionesContenido {
        width: min(1050px, 96vw);

        padding: 30px;

        border:
            1px solid
            rgba(255, 255, 255, 0.18);

        border-radius: 16px;

        background:
            rgba(10, 7, 13, 0.78);

        box-shadow:
            0 0 45px
            rgba(110, 10, 20, 0.24);

        backdrop-filter:
            blur(4px);
    }


    .instruccionesEncabezado {
        margin-bottom: 25px;

        text-align: center;
    }


    .instruccionesEtiqueta {
        margin: 0 0 5px;

        color: #ff9b7a;

        font-size: 12px;
        font-weight: bold;

        letter-spacing: 0.28em;
    }


    .instruccionesEncabezado h2 {
        margin: 0;

        font-size:
            clamp(34px, 5vw, 58px);

        letter-spacing: 0.10em;

        text-shadow:
            0 3px 10px
            rgba(0, 0, 0, 0.75);
    }


    .instruccionesSubtitulo {
        margin:
            12px auto 0;

        max-width: 650px;

        color:
            rgba(255, 235, 225, 0.78);

        line-height: 1.5;
    }


    .instruccionesGrid {
        display: grid;

        grid-template-columns:
            repeat(2, minmax(0, 1fr));

        gap: 16px;

        text-align: left;
    }


    .instruccionesTarjeta {
        padding: 20px;

        border:
            1px solid
            rgba(255, 122, 88, 0.20);

        border-radius: 12px;

        background:
            rgba(8, 8, 16, 0.72);

        box-shadow:
            inset 0 0 24px
            rgba(255, 80, 50, 0.035);
    }


    .instruccionesTarjeta h3 {
        margin: 0 0 17px;

        color: #ffd4c3;

        font-size: 16px;

        letter-spacing: 0.12em;
    }


    .instruccionesTarjeta p {
        margin: 10px 0;

        color:
            rgba(255, 255, 255, 0.82);

        font-size: 14px;
        line-height: 1.55;
    }


    .instruccionFila {
        display: grid;

        grid-template-columns:
            120px 1fr;

        align-items: center;

        gap: 12px;

        margin: 9px 0;
    }


    .teclaInstruccion {
        padding: 6px 8px;

        border:
            1px solid
            rgba(255, 255, 255, 0.24);

        border-radius: 6px;

        background:
            rgba(255, 255, 255, 0.07);

        color: #ffffff;

        font-family: monospace;
        font-size: 12px;
        font-weight: bold;

        text-align: center;
    }


    .armaInstruccion {
        margin-bottom: 13px;

        padding-bottom: 12px;

        border-bottom:
            1px solid
            rgba(255, 255, 255, 0.08);
    }


    .armaInstruccion:last-child {
        margin-bottom: 0;
        padding-bottom: 0;

        border-bottom: none;
    }


    .armaInstruccion strong {
        color: #ffb798;

        letter-spacing: 0.08em;
    }


    .recursoInstruccion {
        display: flex;
        flex-direction: column;

        gap: 4px;

        margin: 13px 0;
    }


    .recursoInstruccion strong {
        color: #ffb798;
    }


    .recursoInstruccion span {
        color:
            rgba(255, 255, 255, 0.78);

        font-size: 14px;
        line-height: 1.4;
    }


    #btnVolverInstrucciones {
        margin-top: 25px;

        min-width: 280px;

        padding: 15px 28px;

        border:
            1px solid
            rgba(255, 255, 255, 0.30);

        border-radius: 8px;

        background:
            rgba(10, 10, 20, 0.78);

        color: white;

        font-size: 16px;
        font-weight: bold;

        letter-spacing: 0.12em;

        cursor: pointer;

        transition:
            transform 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
    }


    #btnVolverInstrucciones:hover {
        transform:
            translateY(-2px);

        background:
            rgba(255, 255, 255, 0.15);

        box-shadow:
            0 0 22px
            rgba(255, 95, 65, 0.20);
    }


    @media (max-width: 760px) {

        #instrucciones {
            align-items: flex-start;
        }


        .instruccionesContenido {
            padding: 22px 16px;
        }


        .instruccionesGrid {
            grid-template-columns: 1fr;
        }


        .instruccionFila {
            grid-template-columns:
                105px 1fr;
        }

    }

`;

document.head.appendChild(
    estilosInstrucciones
);


const btnVolverInstrucciones =
    document.getElementById(
        "btnVolverInstrucciones"
    );


btnInstrucciones.addEventListener(
    "click",
    function () {

        menu.classList.add(
            "oculto"
        );

        instrucciones.classList.remove(
            "oculto"
        );

        // La música del menú continúa sonando.
        reproducirMusica(
            "menu"
        );

    }
);


btnVolverInstrucciones.addEventListener(
    "click",
    function () {

        instrucciones.classList.add(
            "oculto"
        );

        menu.classList.remove(
            "oculto"
        );

        reproducirMusica(
            "menu"
        );

    }
);


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
// SPRITES ENEMIGO - BICHO TANK
// ===============================

const tankIdleRight = new Image();
tankIdleRight.src =
    "assets/sprites/enemies/bicho-tank/idle-right.png";

const tankAttackRight = new Image();
tankAttackRight.src =
    "assets/sprites/enemies/bicho-tank/attack-right.png";

const tankHitRight = new Image();
tankHitRight.src =
    "assets/sprites/enemies/bicho-tank/hit-right.png";

const tankDeathRight = new Image();
tankDeathRight.src =
    "assets/sprites/enemies/bicho-tank/death-right.png";

    // ===============================
// SPRITES JEFE - HIVELORD
// ===============================

// IDLE

const hiveLordIdleLeft = new Image();
hiveLordIdleLeft.src =
    "assets/sprites/enemies/hivelord-boss/idle-left.png";

const hiveLordIdleRight = new Image();
hiveLordIdleRight.src =
    "assets/sprites/enemies/hivelord-boss/idle-right.png";


// ENTERRARSE

const hiveLordBurrowLeft = new Image();
hiveLordBurrowLeft.src =
    "assets/sprites/enemies/hivelord-boss/burrow-left.png";

const hiveLordBurrowRight = new Image();
hiveLordBurrowRight.src =
    "assets/sprites/enemies/hivelord-boss/burrow-right.png";


// SALIR DE LA TIERRA

const hiveLordEmergeLeft = new Image();
hiveLordEmergeLeft.src =
    "assets/sprites/enemies/hivelord-boss/emerge-left.png";

const hiveLordEmergeRight = new Image();
hiveLordEmergeRight.src =
    "assets/sprites/enemies/hivelord-boss/emerge-right.png";


// ESCUPIR PROYECTIL

const hiveLordSpitLeft = new Image();
hiveLordSpitLeft.src =
    "assets/sprites/enemies/hivelord-boss/spit-left.png";

const hiveLordSpitRight = new Image();
hiveLordSpitRight.src =
    "assets/sprites/enemies/hivelord-boss/spit-right.png";


// GOLPE DE ÁREA

const hiveLordSlamLeft = new Image();
hiveLordSlamLeft.src =
    "assets/sprites/enemies/hivelord-boss/slam-left.png";

const hiveLordSlamRight = new Image();
hiveLordSlamRight.src =
    "assets/sprites/enemies/hivelord-boss/slam-right.png";


// RECIBIR DAÑO

const hiveLordHitLeft = new Image();
hiveLordHitLeft.src =
    "assets/sprites/enemies/hivelord-boss/hit-left.png";

const hiveLordHitRight = new Image();
hiveLordHitRight.src =
    "assets/sprites/enemies/hivelord-boss/hit-right.png";


// MUERTE

const hiveLordDeathLeft = new Image();
hiveLordDeathLeft.src =
    "assets/sprites/enemies/hivelord-boss/death-left.png";

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
        costoEnergia: 0,

        // Mejora especial: RÁFAGA GEMELA.
        // 0 = 1 bala, 1 = 2 balas, 2 = 3 balas.
        nivelEspecial: 0
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
        costoEnergia: 8,

        // Mejora especial: LLUVIA DE PLOMO.
        // 0 = 3 perdigones.
        // 1 = 5 perdigones.
        // 2 = 5 perdigones que pueden atravesar 1 enemigo.
        nivelEspecial: 0
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
        costoEnergia: 20,

        // Mejora especial: NÚCLEO SOBRECARGADO.
        // 0 = proyectil normal.
        // 1 = proyectil 35 % más grande.
        // 2 = clic derecho para detonar manualmente.
        nivelEspecial: 0
    }

};

// ===========================================================
// ESTADÍSTICAS BASE DE LAS ARMAS
// ===========================================================
// Guardamos una copia de los valores originales al cargar el juego.
// Así, las mejoras compradas duran durante la partida actual, pero
// al REINTENTAR se restauran automáticamente los valores iniciales.
// ===========================================================

const estadisticasBaseArmas = {};

Object.keys(armas).forEach(function (claveArma) {

    const arma = armas[claveArma];

    estadisticasBaseArmas[claveArma] = {
        daño: arma.daño,
        cadencia: arma.cadencia,
        velocidad: arma.velocidad,
        alcance: arma.alcance,
        costoEnergia: arma.costoEnergia,
        nivelEspecial: arma.nivelEspecial
    };

});


function reiniciarEstadisticasArmas() {

    Object.keys(armas).forEach(function (claveArma) {

        const arma = armas[claveArma];
        const base = estadisticasBaseArmas[claveArma];

        arma.daño = base.daño;
        arma.cadencia = base.cadencia;
        arma.velocidad = base.velocidad;
        arma.alcance = base.alcance;
        arma.costoEnergia = base.costoEnergia;
        arma.nivelEspecial = base.nivelEspecial;

    });

}

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

// Efectos visuales de las detonaciones del arma de energía.
let explosionesEnergia = [];

// Partículas de impactos, muertes, daño a Ado y subida de nivel.
let particulas = [];

let teclas = {};

let mouse = {
    x: 0,
    y: 0
};

let puntos = 0;
let hexaCores = 0;

// Combo de eliminaciones. Cada golpe recibido lo reinicia.
let comboActual = 0;
let comboMaximo = 0;
let multiplicadorPuntos = 1;

// Tiempo REAL de juego: no cuenta pausa, tienda ni selección de nivel.
let tiempoJugadoMs = 0;
let ultimoTiempoJuego = 0;
let bonusTiempo = 0;
let puntajeRegistrado = false;

// ===========================================================
// SISTEMA DE EXPERIENCIA Y NIVELES
// ===========================================================
// Cada bicho normal sigue entregando 10 XP.
// Nivel 1 -> 2 requiere 50 XP. Después el requisito aumenta
// 25 XP por nivel: 50, 75, 100, 125...
// ===========================================================
let experiencia = 0;
let nivelJugador = 1;
let experienciaNecesaria = 50;
let mejorasNivelPendientes = 0;
let nivelOverlayActivo = false;

// Decide qué debe pasar después de gastar todas las mejoras
// acumuladas al terminar una oleada: abrir tienda o avanzar.
let accionDespuesNivel = null;

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
// Valores base de una partida nueva.
// Las mejoras de la tienda modifican energiaMaxima y
// regeneracionEnergia solo durante la partida actual.
const energiaMaximaBase = 100;
const regeneracionEnergiaBase = 8;

let energiaMaxima = energiaMaximaBase;
let energiaActual = energiaMaxima;
let regeneracionEnergia = regeneracionEnergiaBase;
let ultimoTiempoEnergia = 0;

let oleada = 1;

let enemigosGenerados = 0;
let enemigosPorOleada = 5;
let enemigosEliminadosOleada = 0;

let hiveLordOleada5Generado = false;

let esperandoOleada = false;
let inicioEsperaOleada = 0;

let intervaloSpawn = 1300;
let finMensajeOleada = 0;

let tiendaActiva = false;
let timeoutAvisoTienda = null;

let mejoraTomadaEnTienda = false;

let mejorasActualesTienda = [];

let juegoActivo = false;

let juegoPausado = false;


// ===========================================================
// MODO DEBUG - F2
// ===========================================================
// F2 activa/desactiva:
// - panel técnico con FPS y estado del juego;
// - círculos de colisión de Ado;
// - círculos de colisión de enemigos;
// - círculos de colisión de proyectiles del jugador y enemigos.
// ===========================================================
let debugActivo = false;

let debugFPS = 0;
let debugFrames = 0;
let debugUltimaMedicion =
    performance.now();


let ultimoSpawn = 0;


// ===========================================================
// EXPERIENCIA / SUBIDA DE NIVEL
// ===========================================================

function calcularExperienciaNecesaria(nivel) {

    return 50 + (nivel - 1) * 25;

}


function actualizarHUDExperiencia() {

    hudNivel.textContent =
        nivelJugador;

    hudXP.textContent =
        experiencia;

    hudXPMax.textContent =
        experienciaNecesaria;

}


function agregarExperiencia(cantidad) {

    experiencia += cantidad;

    // El while permite que una explosión que mate muchos enemigos
    // pueda acumular más de una subida de nivel sin perder XP.
    while (
        experiencia >= experienciaNecesaria
    ) {

        experiencia -=
            experienciaNecesaria;

        nivelJugador++;
        mejorasNivelPendientes++;

        experienciaNecesaria =
            calcularExperienciaNecesaria(
                nivelJugador
            );

    }

    actualizarHUDExperiencia();

    // IMPORTANTE:
    // ya NO abrimos la selección aquí. Las mejoras se acumulan
    // y solo se muestran cuando termina la oleada.

}


function abrirMejoraNivel() {

    if (
        mejorasNivelPendientes <= 0
        ||
        nivelOverlayActivo
    ) {
        return;
    }

    nivelOverlayActivo = true;
    juegoPausado = true;
    teclas = {};

    // La pantalla aparece ENTRE OLEADAS. Si Ado subió varias veces,
    // todas esas elecciones se resuelven aquí antes de continuar.
    nivelNuevo.textContent =
        nivelJugador;

    nivelPendientes.textContent =
        mejorasNivelPendientes;

    nivelOverlay.classList.remove(
        "oculto"
    );

    reproducirSonido("subidaNivel");

}


function aplicarMejoraNivel(tipoMejora) {

    if (!nivelOverlayActivo) {
        return;
    }


    if (tipoMejora === "vida") {

        jugador.vidaMaxima += 20;

        jugador.vida =
            Math.min(
                jugador.vida + 20,
                jugador.vidaMaxima
            );

        hudVida.textContent =
            jugador.vida;

    } else if (tipoMejora === "velocidad") {

        jugador.velocidad =
            Math.round(
                jugador.velocidad * 1.10 * 100
            ) / 100;

    } else if (tipoMejora === "energia") {

        energiaMaxima += 15;

        energiaActual =
            Math.min(
                energiaActual + 15,
                energiaMaxima
            );

    }


    // Pequeño estallido visual para confirmar la mejora elegida.
    crearParticulas(
        jugador.x,
        jugador.y,
        "#ffe58a",
        24,
        5,
        5,
        0.035
    );


    mejorasNivelPendientes--;

    if (mejorasNivelPendientes > 0) {

        // La misma ventana permanece abierta y muestra cuántas
        // elecciones faltan, en vez de cerrarse y abrirse otra vez.
        nivelPendientes.textContent =
            mejorasNivelPendientes;

        return;

    }

    nivelOverlayActivo = false;

    nivelOverlay.classList.add(
        "oculto"
    );

    // Evita regeneraciones grandes por el tiempo pasado en el menú.
    ultimoTiempoEnergia =
        performance.now();

    if (accionDespuesNivel === "tienda") {

        accionDespuesNivel = null;
        abrirTienda();

    } else if (accionDespuesNivel === "avanzar") {

        accionDespuesNivel = null;
        juegoPausado = false;
        avanzarOleada(performance.now());

    } else {

        juegoPausado = false;

    }

}


// ===========================================================
// COMBO Y MULTIPLICADOR DE PUNTOS
// ===========================================================

function calcularMultiplicadorCombo(combo) {

    // Cada 5 eliminaciones consecutivas aumenta x0.5, con tope x3.
    // 1-5 = x1 | 6-10 = x1.5 | 11-15 = x2 | 16-20 = x2.5 | 21+ = x3
    return Math.min(
        3,
        1 + Math.floor(Math.max(0, combo - 1) / 5) * 0.5
    );

}

function actualizarHUDCombo() {

    hudCombo.textContent =
        comboActual;

    hudMultiplicador.textContent =
        "x" + multiplicadorPuntos.toFixed(1).replace(".0", "");

}

function registrarEliminacionParaPuntos() {

    comboActual++;
    comboMaximo =
        Math.max(comboMaximo, comboActual);

    multiplicadorPuntos =
        calcularMultiplicadorCombo(comboActual);

    const puntosGanados =
        Math.round(100 * multiplicadorPuntos);

    puntos += puntosGanados;

    hudPuntos.textContent =
        puntos;

    actualizarHUDCombo();

}

function reiniciarComboPorDaño() {

    comboActual = 0;
    multiplicadorPuntos = 1;
    actualizarHUDCombo();

}


// ===========================================================
// MENSAJES INTERNOS DE LA TIENDA
// ===========================================================

function actualizarSaldoTienda() {

    tiendaHexa.textContent =
        hexaCores;

}

function mostrarAvisoTienda(mensaje) {

    if (!mensaje.startsWith("Te quedaste sin Hexa Cores")) {
        reproducirSonido("error");
    }

    avisoTienda.textContent =
        mensaje;

    avisoTienda.classList.remove(
        "oculto"
    );

    if (timeoutAvisoTienda) {
        clearTimeout(timeoutAvisoTienda);
    }

    timeoutAvisoTienda =
        setTimeout(function () {
            avisoTienda.classList.add("oculto");
        }, 2300);

}


// ===========================================================
// RANKING - BACKEND NODE.JS
// ===========================================================

function formatearTiempo(segundos) {

    const minutos =
        Math.floor(segundos / 60);

    const resto =
        segundos % 60;

    return minutos > 0
        ? minutos + "m " + resto + "s"
        : resto + "s";

}

async function cargarRanking() {

    rankingEstado.textContent =
        "Cargando puntajes...";

    rankingLista.innerHTML = "";

    try {

        const respuesta =
            await fetch(API_BASE + "/scores");

        if (!respuesta.ok) {
            throw new Error("No se pudo consultar el ranking.");
        }

        const puntajes =
            await respuesta.json();

        if (!Array.isArray(puntajes) || puntajes.length === 0) {
            rankingEstado.textContent =
                "Todavía no hay puntajes registrados.";
            return;
        }

        rankingEstado.textContent = "";

        puntajes.slice(0, 10).forEach(function (registro, indice) {

            const fila =
                document.createElement("tr");

            const datos = [
                indice + 1,
                registro.nombre,
                registro.puntos,
                registro.oleada,
                registro.nivel,
                formatearTiempo(registro.tiempo || 0)
            ];

            datos.forEach(function (valor) {
                const celda = document.createElement("td");
                celda.textContent = valor;
                fila.appendChild(celda);
            });

            rankingLista.appendChild(fila);

        });

    } catch (error) {

        rankingEstado.textContent =
            "No se pudo conectar con el servidor de puntajes. Ejecuta Node.js en el puerto 3000.";

    }

}

async function guardarPuntajeServidor() {

    if (puntajeRegistrado) {
        estadoGuardarPuntaje.textContent =
            "Este puntaje ya fue registrado.";
        return;
    }

    const nombre =
        nombreJugador.value.trim();

    if (nombre.length === 0) {
        estadoGuardarPuntaje.textContent =
            "Escribe tu nombre antes de guardar.";
        return;
    }

    estadoGuardarPuntaje.textContent =
        "Guardando...";

    try {

        const respuesta =
            await fetch(API_BASE + "/scores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: nombre,
                    puntos: puntos,
                    oleada: oleada,
                    nivel: nivelJugador,
                    tiempo: Math.floor(tiempoJugadoMs / 1000),
                    comboMaximo: comboMaximo
                })
            });

        if (!respuesta.ok) {
            throw new Error("No se pudo guardar.");
        }

        const resultado =
            await respuesta.json();

        puntajeRegistrado = true;
        btnGuardarPuntaje.disabled = true;

        estadoGuardarPuntaje.textContent =
            resultado.guardadoEnTop10
                ? "Puntaje guardado en el Top 10."
                : "Puntaje enviado, pero no alcanzó el Top 10.";

    } catch (error) {

        estadoGuardarPuntaje.textContent =
            "No se pudo guardar. Revisa que el servidor Node.js esté ejecutándose.";

    }

}


// ===========================================================
// PARTÍCULAS DE COMBATE
// ===========================================================
// Son círculos pequeños dibujados directamente en el Canvas.
// No requieren imágenes nuevas y se congelan cuando el juego se pausa.
// ===========================================================

function crearParticulas(
    x,
    y,
    color,
    cantidad,
    fuerza,
    tamaño,
    desgaste
) {

    for (let i = 0; i < cantidad; i++) {

        const angulo =
            Math.random() * Math.PI * 2;

        const velocidad =
            fuerza * (0.45 + Math.random() * 0.75);

        particulas.push({
            x: x,
            y: y,
            velocidadX: Math.cos(angulo) * velocidad,
            velocidadY: Math.sin(angulo) * velocidad,
            tamaño: tamaño * (0.55 + Math.random() * 0.75),
            color: color,
            vida: 1,
            desgaste: desgaste * (0.75 + Math.random() * 0.50)
        });

    }

}


function crearParticulasImpacto(x, y, tipoProyectil) {

    let color = "#ffffff";

    if (tipoProyectil === "escopeta") {
        color = "#ffd36a";
    }

    if (tipoProyectil === "energia") {
        color = "#39d9ff";
    }

    crearParticulas(
        x,
        y,
        color,
        7,
        3.2,
        3,
        0.055
    );

}


function crearParticulasMuerteEnemigo(x, y) {

    crearParticulas(
        x,
        y,
        "#ff5d68",
        18,
        4.5,
        4,
        0.035
    );

}


function crearParticulasDañoJugador() {

    crearParticulas(
        jugador.x,
        jugador.y,
        "#ff4d88",
        12,
        3.8,
        3.5,
        0.045
    );

}


function moverParticulas() {

    for (
        let i = particulas.length - 1;
        i >= 0;
        i--
    ) {

        const particula =
            particulas[i];

        particula.x +=
            particula.velocidadX;

        particula.y +=
            particula.velocidadY;

        particula.velocidadX *= 0.95;
        particula.velocidadY *= 0.95;

        particula.vida -=
            particula.desgaste;

        if (particula.vida <= 0) {
            particulas.splice(i, 1);
        }

    }

}


function dibujarParticulas() {

    ctx.save();

    particulas.forEach(function (particula) {

        ctx.globalAlpha =
            Math.max(0, particula.vida);

        ctx.beginPath();

        ctx.arc(
            particula.x,
            particula.y,
            particula.tamaño,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            particula.color;

        ctx.fill();

    });

    ctx.restore();

}


// ===============================
// MENÚ
// ===============================

btnJugar.addEventListener("click", function () {

    menu.classList.add("oculto");

    iniciarJuego();

});

btnRanking.addEventListener("click", function () {

    menu.classList.add("oculto");
    ranking.classList.remove("oculto");

    cargarRanking();

});

btnVolverRanking.addEventListener("click", function () {

    ranking.classList.add("oculto");
    menu.classList.remove("oculto");

    reproducirMusica("menu");

});

btnCreditos.addEventListener("click", function () {

    menu.classList.add("oculto");

    creditos.classList.remove("oculto");

});


btnVolverCreditos.addEventListener("click", function () {

    creditos.classList.add("oculto");

    menu.classList.remove("oculto");

    reproducirMusica("menu");

});


// ===============================
// INICIAR JUEGO
// ===============================

function iniciarJuego() {

    juego.classList.remove("oculto");
    gameOver.classList.add("oculto");

    // Cada partida comienza con la pista de combate desde el inicio.
    reproducirMusica("combate", true);

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
    explosionesEnergia = [];
    particulas = [];

    puntos = 0;
    hexaCores = 0;

    comboActual = 0;
    comboMaximo = 0;
    multiplicadorPuntos = 1;

    tiempoJugadoMs = 0;
    ultimoTiempoJuego = performance.now();
    bonusTiempo = 0;
    puntajeRegistrado = false;

    nivelJugador = 1;
    experiencia = 0;
    experienciaNecesaria =
        calcularExperienciaNecesaria(
            nivelJugador
        );
    mejorasNivelPendientes = 0;
    nivelOverlayActivo = false;
    accionDespuesNivel = null;
    nivelOverlay.classList.add("oculto");

    // Cada partida nueva vuelve a las estadísticas base.
    // Las mejoras compradas en la tienda duran durante la
    // partida actual, pero se reinician al reintentar.
    reiniciarEstadisticasArmas();

    energiaMaxima = energiaMaximaBase;
    regeneracionEnergia = regeneracionEnergiaBase;
    energiaActual = energiaMaxima;

    ultimoTiempoEnergia = performance.now();
    armaActual = "pistola";
    ultimoDisparo = 0;

    oleada = 1;
    enemigosGenerados = 0;
    enemigosPorOleada = 5;
    enemigosEliminadosOleada = 0;

    hiveLordOleada5Generado = false;

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

    actualizarHUDCombo();

    hudHexa.textContent =
        hexaCores;

    actualizarHUDExperiencia();

    juegoPausado = false;
    pausaOverlay.classList.add("oculto");

    tiendaActiva = false;
mejoraTomadaEnTienda = false;
mejorasActualesTienda = [];

tiendaOverlay.classList.add("oculto");
avisoTienda.classList.add("oculto");

    nombreJugador.value = "";
    estadoGuardarPuntaje.textContent = "";
    btnGuardarPuntaje.disabled = false;

    juegoActivo = true;
requestAnimationFrame(gameLoop);
    }

// ===============================
// CONTROLES DEL TECLADO
// ===============================

document.addEventListener("keydown", function (evento) {

    const tecla = evento.key.toLowerCase();


    // ===============================
    // ACTIVAR / DESACTIVAR DEBUG
    // ===============================
    // Funciona incluso si el juego está pausado.
    if (
        evento.code === "F2"
        &&
        juegoActivo
        &&
        !evento.repeat
    ) {

        evento.preventDefault();

        debugActivo =
            !debugActivo;

        return;
    }


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
    && !nivelOverlayActivo
    && !evento.repeat
) {

        juegoPausado = !juegoPausado;

        pausaOverlay.classList.toggle("oculto", !juegoPausado);

        // La pausa manual también pausa la música.
        if (juegoPausado) {
            pausarMusica();
        } else {
            reanudarMusica();
        }

    }

});


document.addEventListener("keyup", function (evento) {

    teclas[evento.key.toLowerCase()] = false;

});


// ===============================
// MOUSE
// ===============================
// El canvas tiene una resolución interna de 1280 x 720, pero CSS
// puede mostrarlo con otro tamaño dependiendo de la ventana.
//
// Por eso NO podemos usar directamente los píxeles de la pantalla.
// Convertimos la posición real del mouse a las coordenadas internas
// del canvas para que Ado dispare exactamente hacia donde apuntas.

function actualizarPosicionMouse(evento) {

    const rect =
        canvas.getBoundingClientRect();

    const escalaX =
        canvas.width / rect.width;

    const escalaY =
        canvas.height / rect.height;

    mouse.x =
        (evento.clientX - rect.left)
        * escalaX;

    mouse.y =
        (evento.clientY - rect.top)
        * escalaY;
}


canvas.addEventListener("mousemove", function (evento) {

    actualizarPosicionMouse(evento);

});


// ===============================
// DISPARAR
// ===============================

canvas.addEventListener("click", function (evento) {

    // Actualizamos también aquí por si el tamaño del canvas cambió
    // o el usuario hace clic sin haber movido el mouse antes.
    actualizarPosicionMouse(evento);

    disparar();

});


// ===========================================================
// CLIC DERECHO - DETONACIÓN MANUAL DEL ARMA DE ENERGÍA
// ===========================================================
// El navegador normalmente abre su menú contextual con clic derecho.
// Lo bloqueamos dentro del canvas para usar ese botón como habilidad.
// Solo funciona cuando NÚCLEO SOBRECARGADO llegó al nivel 2.
// ===========================================================
canvas.addEventListener("contextmenu", function (evento) {

    evento.preventDefault();

    actualizarPosicionMouse(evento);

    detonarUltimoProyectilEnergia();

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

    if (armaActual === "pistola") {
        reproducirSonido("pistola");
    } else if (armaActual === "escopeta") {
        reproducirSonido("escopeta");
    } else if (armaActual === "energia") {
        reproducirSonido("energia");
    }


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
    // La mejora especial conserva TODAS las balas en la misma dirección.
    // En lugar de abrirse como la escopeta, aparecen una detrás de otra
    // formando una fila recta hacia el punto donde está apuntando Ado.
    // El costo y la cadencia siguen siendo los de UN disparo.

    if (armaActual === "pistola") {

        // Distancia inicial entre una bala y la siguiente.
        // Si quieres juntarlas o separarlas más, cambia este valor.
        const separacionBalasPistola = 22;

        let cantidadBalasPistola = 1;

        if (arma.nivelEspecial === 1) {
            cantidadBalasPistola = 2;
        } else if (arma.nivelEspecial >= 2) {
            cantidadBalasPistola = 3;
        }


        for (let i = 0; i < cantidadBalasPistola; i++) {

            // Todas usan exactamente el mismo ángulo.
            // Solo cambia su posición inicial sobre la línea de disparo.
            const separacion =
                i * separacionBalasPistola;

            proyectiles.push({

                x:
                    jugador.x
                    + Math.cos(angulo) * separacion,

                y:
                    jugador.y
                    + Math.sin(angulo) * separacion,

                radio: 6,

                velocidadX:
                    Math.cos(angulo)
                    * arma.velocidad,

                velocidadY:
                    Math.sin(angulo)
                    * arma.velocidad,

                daño:
                    arma.daño,

                // Cuenta la separación inicial para que todas mantengan
                // el mismo alcance máximo real desde Ado.
                distanciaRecorrida: separacion,

                alcanceMaximo:
                    arma.alcance,

                tipo: "pistola"

            });

        }

    }


    // ===============================
    // ESCOPETA
    // ===============================
    // Nivel 0: 3 perdigones.
    // Nivel 1: 5 perdigones.
    // Nivel 2: mantiene 5, pero cada perdigón puede golpear
    // hasta 2 enemigos diferentes antes de desaparecer.

    else if (
        armaActual === "escopeta"
    ) {

        let dispersiones = [
            -0.12,
            0,
            0.12
        ];

        if (arma.nivelEspecial >= 1) {

            dispersiones = [
                -0.24,
                -0.12,
                0,
                0.12,
                0.24
            ];

        }


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

                    daño:
                        arma.daño,

                    distanciaRecorrida: 0,

                    alcanceMaximo:
                        arma.alcance,

                    tipo: "escopeta",

                    // Evita que un perdigón perforante golpee varias
                    // veces al MISMO enemigo mientras lo atraviesa.
                    enemigosGolpeados: [],

                    // Nivel 2 = puede dañar a dos enemigos distintos.
                    impactosMaximos:
                        arma.nivelEspecial >= 2
                            ? 2
                            : 1

                });

            }
        );

    }


    // ===============================
    // ENERGÍA
    // ===============================
    // Siempre atraviesa enemigos.
    // Nivel 1: el radio pasa de 10 a 13.5 (+35 %).
    // Nivel 2: conserva ese tamaño y permite detonarlo manualmente
    // con clic derecho. La detonación NO ocurre automáticamente.

    else if (
        armaActual === "energia"
    ) {

        const radioEnergia =
            arma.nivelEspecial >= 1
                ? 13.5
                : 10;


        proyectiles.push({

            x: jugador.x,
            y: jugador.y,

            radio:
                radioEnergia,

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

            enemigosGolpeados: []

        });

    }

}


// ===========================================================
// NÚCLEO SOBRECARGADO NIVEL 2 - DETONACIÓN MANUAL
// ===========================================================
// Solo se detona el proyectil de energía ACTIVO más reciente.
// El proyectil desaparece al detonar y crea una explosión de área.
// No consume energía adicional porque esa energía ya se gastó al
// realizar el disparo con clic izquierdo.
// ===========================================================

function detonarUltimoProyectilEnergia() {

    if (
        !juegoActivo ||
        juegoPausado ||
        jugador.muriendo ||
        armaActual !== "energia" ||
        armas.energia.nivelEspecial < 2
    ) {
        return;
    }


    for (
        let i = proyectiles.length - 1;
        i >= 0;
        i--
    ) {

        const proyectil =
            proyectiles[i];

        if (
            proyectil.tipo === "energia"
        ) {

            crearExplosionEnergia(
                proyectil.x,
                proyectil.y
            );

            proyectiles.splice(
                i,
                1
            );

            return;
        }

    }

}


function crearExplosionEnergia(x, y) {

    reproducirSonido("explosionEnergia");

    const radioExplosion = 150;
    const dañoExplosion = 35;


    // Guardamos un efecto temporal para dibujarlo durante unos frames.
    explosionesEnergia.push({
        x: x,
        y: y,
        inicio: performance.now(),
        duracion: 320,
        radioMaximo: radioExplosion
    });

    // Partículas extra para que la detonación se sienta más fuerte.
    crearParticulas(
        x,
        y,
        "#39d9ff",
        34,
        7,
        5,
        0.03
    );


    enemigos.forEach(function (enemigo) {

    if (
        enemigo.muriendo
        ||
        enemigo.invulnerable
    ) {
        return;
    }

    const distancia =
        Math.hypot(
                x - enemigo.x,
                y - enemigo.y
            );

        if (
            distancia
            <=
            radioExplosion + enemigo.radio
        ) {

            enemigo.vida -=
                dañoExplosion;


            // La explosión utiliza exactamente las mismas recompensas
            // que una muerte causada por un proyectil normal.
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


                registrarEliminacionParaPuntos();


                hexaCores += 1;

                hudHexa.textContent =
                    hexaCores;

                agregarExperiencia(10);

                crearParticulasMuerteEnemigo(
                    enemigo.x,
                    enemigo.y
                );

                reproducirSonido("enemigoMuerte");

            }

        }

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
// GENERAR BICHO TANK
// ===============================

function crearEnemigoTank() {

    let x;
    let y;

    const lado =
        Math.floor(
            Math.random() * 4
        );

    // Aparece fuera del mapa y entra caminando lentamente.
    if (lado === 0) {

        x =
            Math.random()
            * canvas.width;

        y = -45;
    }

    if (lado === 1) {

        x =
            canvas.width + 45;

        y =
            Math.random()
            * canvas.height;
    }

    if (lado === 2) {

        x =
            Math.random()
            * canvas.width;

        y =
            canvas.height + 45;
    }

    if (lado === 3) {

        x = -45;

        y =
            Math.random()
            * canvas.height;
    }


    enemigos.push({

        tipo: "tank",

        x: x,
        y: y,

        // Hitbox un poco mayor que la del bicho normal.
        radio: 28,

        // Muy lento porque es el Tank.
        velocidad: 0.65,

        // Bastante más resistente.
        vida: 120,
        vidaMaxima: 120,

        // Daño cuerpo a cuerpo.
        daño: 12,

        // Ataques más lentos pero fuertes.
        proximoAtaque: 0,

        atacandoHasta: 0,

        hitInicio: 0,
        hitHasta: 0,

        muriendo: false,

        muerteInicio: 0,
        muerteHasta: 0,

        direccion:
            jugador.x > x
                ? "right"
                : "left",

        direccionAtaque:
            "right",

        direccionMuerte:
            "right"
    });
}

// ===============================
// GENERAR JEFE - HIVELORD
// ===============================

function crearHiveLord() {

    // ===============================
    // MÚSICA DEL HIVELORD
    // ===============================

    if (
        musicaActual === musicas.combate
    ) {

        tiempoMusicaCombateAntesJefe =
            musicas.combate.currentTime;
    }

    reproducirMusica(
        "hivelord",
        true
    );


    const x =
        canvas.width * 0.72;

    const y =
        canvas.height * 0.55;

    const ahora =
        performance.now();

    enemigos.push({

        tipo: "hivelord",
        esJefe: true,

        x: x,
        y: y,

        radio: 55,

        velocidad: 0,

        vida: 7000,
        vidaMaxima: 7000,

        fase: 1,

        estado: "emerge",
        estadoInicio: ahora,

        invulnerable: true,

        direccion:
            jugador.x >= x
                ? "right"
                : "left",

        proximoAtaque:
            ahora + 1800,

        disparoRealizado: false,

        proximoSlam:
            ahora + 5000,

        proximaInvocacion:
            ahora + 7000,

        proximoBurrow:
            ahora + 6000,

        hitInicio: 0,
        hitHasta: 0,

        muriendo: false,
        muerteInicio: 0,
        muerteHasta: 0
    });
}

function moverEnemigos() {

    enemigos.forEach(function (enemigo) {

        // Un enemigo que está muriendo ya no se mueve.
        if (enemigo.muriendo) {
            return;
        }


        // ===============================
        // ACTUALIZAR DIRECCIÓN
        // ===============================

        if (jugador.x >= enemigo.x) {

            enemigo.direccion =
                "right";

        } else {

            enemigo.direccion =
                "left";
        }


        // ===============================
        // COMPORTAMIENTO DEL RANGER
        // ===============================

        if (enemigo.tipo === "ranger") {

            const ahora =
                performance.now();


            // Esperar antes del primer ataque.
            if (
                enemigo.proximoDisparo === 0
            ) {

                enemigo.proximoDisparo =
                    ahora + 1200;

                return;
            }


            // Iniciar ataque.
            if (
                ahora >= enemigo.proximoDisparo
                &&
                ahora >=
                    (enemigo.atacandoHasta || 0)
            ) {

                enemigo.direccionAtaque =
                    enemigo.direccion;

                enemigo.atacandoHasta =
                    ahora + 500;

                dispararAcidoRanger(
                    enemigo
                );

                enemigo.proximoDisparo =
                    ahora + 1800;
            }

            return;
        }


// ===============================
// COMPORTAMIENTO DEL HIVELORD
// ===============================

if (enemigo.tipo === "hivelord") {

    const ahora =
        performance.now();

        // ===============================
// FASES DEL HIVELORD
// ===============================

const porcentajeVida =
    enemigo.vida / enemigo.vidaMaxima;


// FASE 3
// 30% de vida o menos
if (porcentajeVida <= 0.30) {

    enemigo.fase = 3;
}


// FASE 2
// 60% de vida o menos
else if (porcentajeVida <= 0.60) {

    enemigo.fase = 2;
}


// FASE 1
// Más del 60% de vida
else {

    enemigo.fase = 1;
}


    // ===============================
    // EMERGE
    // ===============================

    // Mientras sale de la tierra
    // todavía no puede atacar.
    if (
        enemigo.estado === "emerge"
    ) {
        return;
    }


    // ===============================
    // INICIAR ENTERRAMIENTO
    // ===============================

    if (
        enemigo.estado === "idle"
        &&
        ahora >= enemigo.proximoBurrow
    ) {

        enemigo.estado =
            "burrow";

        enemigo.estadoInicio =
            ahora;

        enemigo.invulnerable =
            true;

        return;
    }


    // ===============================
    // ENTERRARSE
    // ===============================

    if (
        enemigo.estado === "burrow"
    ) {

        const tiempoBurrow =
            ahora - enemigo.estadoInicio;

        // 4 frames × 400 ms = 1.6 segundos
        if (
            tiempoBurrow >= 1600
        ) {

            enemigo.estado =
                "hidden";

            enemigo.estadoInicio =
                ahora;
        }

        return;
    }


    // ===============================
    // OCULTO BAJO TIERRA
    // ===============================

    if (
        enemigo.estado === "hidden"
    ) {

        const tiempoOculto =
            ahora - enemigo.estadoInicio;

        // Permanece bajo tierra 4.8 segundos.
        if (
            tiempoOculto >= 4800
        ) {

            const margen = 180;

            enemigo.x =
                margen
                +
                Math.random()
                *
                (
                    canvas.width
                    -
                    margen * 2
                );

            enemigo.y =
                margen
                +
                Math.random()
                *
                (
                    canvas.height
                    -
                    margen * 2
                );


            enemigo.estado =
                "emerge";

            enemigo.estadoInicio =
                ahora;
        }

        return;
    }

// ===============================
// INVOCACIÓN DE BICHOS
// FASE 3
// ===============================

if (
    enemigo.estado === "idle"
    &&
    enemigo.fase >= 3
    &&
    ahora >= enemigo.proximaInvocacion
) {

    invocarBichosHiveLord(
        enemigo
    );

    enemigo.proximaInvocacion =
        ahora + 7000;

    enemigo.proximoAtaque =
        ahora + 1200;

    enemigo.proximoSlam =
        ahora + 1800;

    return;
}

// ===============================
// INICIAR SLAM
// ===============================

if (
    enemigo.estado === "idle"
    &&
    enemigo.fase >= 2
    &&
    ahora >= enemigo.proximoSlam
) {

    enemigo.estado =
    "slam";

enemigo.estadoInicio =
    ahora;

// Evita que el mismo slam
// golpee varias veces.
enemigo.slamGolpeRealizado =
    false;

return;
}


// ===============================
// ANIMACIÓN DEL SLAM
// ===============================

if (
    enemigo.estado === "slam"
) {

    const tiempoSlam =
        ahora - enemigo.estadoInicio;


    // ===============================
    // IMPACTO DEL SLAM
    // ===============================

    if (
        tiempoSlam >= 650
        &&
        !enemigo.slamGolpeRealizado
    ) {

        aplicarSlamHiveLord(
            enemigo
        );

        enemigo.slamGolpeRealizado =
            true;
    }


    // ===============================
    // TERMINAR SLAM
    // ===============================

    if (
        tiempoSlam >= 1000
    ) {

        enemigo.estado =
            "idle";

        enemigo.estadoInicio =
            ahora;

        enemigo.proximoSlam =
            ahora + 6000;

        enemigo.proximoAtaque =
            ahora + 1000;
    }

    return;
}

    // ===============================
    // INICIAR ESCUPITAJO
    // ===============================

    if (
        enemigo.estado === "idle"
        &&
        ahora >= enemigo.proximoAtaque
    ) {

        enemigo.estado =
            "spit";

        enemigo.estadoInicio =
            ahora;

        enemigo.disparoRealizado =
            false;

        return;
    }


    // ===============================
    // ESCUPIR PROYECTIL
    // ===============================

    if (
        enemigo.estado === "spit"
    ) {

        const tiempoAtaque =
            ahora - enemigo.estadoInicio;


        if (
            tiempoAtaque >= 360
            &&
            !enemigo.disparoRealizado
        ) {

            dispararProyectilHiveLord(
                enemigo
            );

            enemigo.disparoRealizado =
                true;
        }


        if (
            tiempoAtaque >= 720
        ) {

            enemigo.estado =
                "idle";

            enemigo.estadoInicio =
                ahora;

            enemigo.proximoAtaque =
                ahora + 1800;
        }

        return;
    }


    // HiveLord nunca utiliza
    // el movimiento normal.
    return;
}


        // ===============================
        // ATAQUE CUERPO A CUERPO
        // ===============================

        // Mientras reproduce su ataque,
        // el enemigo se queda quieto.
        if (
            performance.now()
            <
            (enemigo.atacandoHasta || 0)
        ) {
            return;
        }


        // ===============================
        // MOVIMIENTO HACIA ADO
        // ===============================

        const diferenciaX =
            jugador.x - enemigo.x;

        const diferenciaY =
            jugador.y - enemigo.y;

        const distancia =
            Math.hypot(
                diferenciaX,
                diferenciaY
            );


        // Se detiene justo antes
        // de atravesar al jugador.
        const distanciaMinima =
            jugador.radio
            +
            enemigo.radio
            -
            2;


        if (
            distancia > distanciaMinima
        ) {

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
                *
                movimiento;

            enemigo.y +=
                Math.sin(angulo)
                *
                movimiento;
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

    reproducirSonido("rangerDisparo");
}

// ===============================
// PROYECTIL DEL HIVELORD
// ===============================

function dispararProyectilHiveLord(enemigo) {

    const diferenciaX =
        jugador.x - enemigo.x;

    const diferenciaY =
        jugador.y - enemigo.y;

    const angulo =
        Math.atan2(
            diferenciaY,
            diferenciaX
        );

    const velocidad =
        4.2;

    const separacion =
        enemigo.radio + 35;


    proyectilesEnemigos.push({

        tipo: "hivelord",

        x:
            enemigo.x
            +
            Math.cos(angulo)
            * separacion,

        y:
            enemigo.y
            +
            Math.sin(angulo)
            * separacion,

        velocidadX:
            Math.cos(angulo)
            * velocidad,

        velocidadY:
            Math.sin(angulo)
            * velocidad,

        // Mucho más grande que
        // el ácido del Ranger.
        radio: 20,

        daño: 18,

        // Después lo utilizaremos
        // para la explosión.
        radioExplosion: 90
    });
}

// ===============================
// EXPLOSIÓN DEL PROYECTIL HIVELORD
// ===============================

function crearExplosionHiveLord(x, y) {

    const radioExplosion = 95;
    const dañoExplosion = 22;


    // ===============================
    // EFECTO VISUAL
    // ===============================

    explosionesEnergia.push({

        tipo: "hivelord",

        x: x,
        y: y,

        inicio:
            performance.now(),

        duracion: 350,

        radioMaximo:
            radioExplosion
    });


    // Partículas verdes/amarillas.
    crearParticulas(
        x,
        y,
        "#baff36",
        30,
        6,
        5,
        0.035
    );


    // ===============================
    // DISTANCIA ENTRE EXPLOSIÓN Y ADO
    // ===============================

    const distancia =
        Math.hypot(
            jugador.x - x,
            jugador.y - y
        );


    // ===============================
    // DAÑO DE ÁREA A ADO
    // ===============================

    if (
        distancia <=
        radioExplosion + jugador.radio
    ) {

        jugador.vida -=
            dañoExplosion;


        if (
            jugador.vida < 0
        ) {

            jugador.vida = 0;
        }


        hudVida.textContent =
            jugador.vida;


        reiniciarComboPorDaño();

        crearParticulasDañoJugador();

        reproducirSonido(
            "adoHit"
        );


        const ahora =
            performance.now();


        jugador.hitInicio =
            ahora;

        jugador.hitHasta =
            ahora + 440;


        if (
            jugador.vida <= 0
        ) {

            iniciarMuerte();
        }
    }
}


// ===============================
// DAÑO DE ÁREA DEL SLAM
// ===============================

function aplicarSlamHiveLord(enemigo) {

    const radioSlam = 650;
    const dañoSlam = 25;

    explosionesEnergia.push({
    tipo: "slam",
    x: enemigo.x,
    y: enemigo.y,
    inicio: performance.now(),
    duracion: 450,
    radioMaximo: radioSlam
});


    // ===============================
    // DISTANCIA ENTRE HIVELORD Y ADO
    // ===============================

    const distancia =
        Math.hypot(
            jugador.x - enemigo.x,
            jugador.y - enemigo.y
        );


    // ===============================
    // EFECTO VISUAL DEL IMPACTO
    // ===============================

    crearParticulas(
        enemigo.x,
        enemigo.y,
        "#baff36",
        35,
        8,
        6,
        0.04
    );


    // ===============================
    // DAÑO A ADO
    // ===============================

    if (
        distancia <=
        radioSlam + jugador.radio
    ) {

        jugador.vida -=
            dañoSlam;


        if (
            jugador.vida < 0
        ) {

            jugador.vida = 0;
        }


        hudVida.textContent =
            jugador.vida;


        reiniciarComboPorDaño();

        crearParticulasDañoJugador();

        reproducirSonido(
            "adoHit"
        );


        const ahora =
            performance.now();


        jugador.hitInicio =
            ahora;

        jugador.hitHasta =
            ahora + 440;


        if (
            jugador.vida <= 0
        ) {

            iniciarMuerte();
        }
    }
}

// ===============================
// INVOCAR BICHOS - HIVELORD
// ===============================

function invocarBichosHiveLord(enemigo) {

    // Contar solamente bichos
    // invocados por el jefe.
    const bichosInvocados =
        enemigos.filter(
            e => e.invocadoPorHiveLord
        ).length;


    // Máximo 6 invocados al mismo tiempo.
    if (bichosInvocados >= 10) {
        return;
    }


    // Efecto visual de invocación.
    crearParticulas(
        enemigo.x,
        enemigo.y,
        "#baff36",
        45,
        7,
        6,
        0.035
    );


    // Invocar 3 bichos.
    for (
        let i = 0;
        i < 5;
        i++
    ) {

        // Usamos el enemigo normal
        // que ya existe en el juego.
        crearEnemigo();


        // El enemigo recién creado
        // es el último del arreglo.
        const nuevoBicho =
            enemigos[
                enemigos.length - 1
            ];


        nuevoBicho.invocadoPorHiveLord =
            true;


        // Colocarlo alrededor del jefe.
        const angulo =
            Math.random()
            *
            Math.PI * 2;

        const distancia =
            130
            +
            Math.random() * 100;


        nuevoBicho.x =
            enemigo.x
            +
            Math.cos(angulo)
            *
            distancia;

        nuevoBicho.y =
            enemigo.y
            +
            Math.sin(angulo)
            *
            distancia;


        // Evitar que aparezca fuera
        // de la pantalla.
        nuevoBicho.x =
            Math.max(
                40,
                Math.min(
                    canvas.width - 40,
                    nuevoBicho.x
                )
            );

        nuevoBicho.y =
            Math.max(
                40,
                Math.min(
                    canvas.height - 40,
                    nuevoBicho.y
                )
            );
    }
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


// HiveLord no puede recibir daño
// mientras está bajo tierra o emergiendo.
if (enemigo.invulnerable) {
    continue;
}
    


        // ===============================
        // PROYECTILES QUE PUEDEN ATRAVESAR
        // ===============================
        // Energía siempre atraviesa. En la escopeta esta lista
        // también se usa en el nivel especial 2 para que un mismo
        // perdigón no golpee dos veces al mismo enemigo.

        if (
            (
                proyectil.tipo === "energia"
                ||
                proyectil.tipo === "escopeta"
            )
            &&
            proyectil.enemigosGolpeados
            &&
            proyectil.enemigosGolpeados
                .includes(enemigo)
        ) {
            continue;
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
                // HIT DEL TANK
                // ===============================

if (
    enemigo.tipo === "tank"
    &&
    enemigo.vida > 0
) {

    const ahora =
        performance.now();

    enemigo.hitInicio =
        ahora;

    enemigo.hitHasta =
        ahora + 440;
}

            crearParticulasImpacto(
                proyectil.x,
                proyectil.y,
                proyectil.tipo
            );

            reproducirSonido("impactoEnemigo");


            // ===============================
            // PROYECTIL DE ENERGÍA
            // ===============================

            if (
                proyectil.tipo === "energia"
            ) {

                proyectil.enemigosGolpeados
                    .push(enemigo);

                // Energía nunca desaparece por impacto normal.

            }

            // ===============================
            // ESCOPETA
            // ===============================
            // Normalmente desaparece al primer enemigo.
            // Con LLUVIA DE PLOMO nivel 2 puede golpear a dos
            // enemigos diferentes antes de desaparecer.

            else if (
                proyectil.tipo === "escopeta"
            ) {

                proyectil.enemigosGolpeados
                    .push(enemigo);

                if (
                    proyectil.enemigosGolpeados.length
                    >=
                    proyectil.impactosMaximos
                ) {

                    proyectiles.splice(
                        i,
                        1
                    );

                    proyectilEliminado =
                        true;

                }

            }

            // ===============================
            // PISTOLA
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


                registrarEliminacionParaPuntos();


                // Recompensas
                hexaCores += 1;

                hudHexa.textContent =
                    hexaCores;

                agregarExperiencia(10);

                crearParticulasMuerteEnemigo(
                    enemigo.x,
                    enemigo.y
                );

                reproducirSonido("enemigoMuerte");

            }


            // Si el proyectil alcanzó su máximo de impactos,
            // dejamos de buscar más enemigos en este frame.
            if (
                proyectilEliminado
            ) {
                break;
            }

            // Energía y la escopeta perforante pueden seguir
            // buscando otros enemigos mientras sigan activos.
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

// ===============================
// PROYECTIL EXPLOSIVO DEL HIVELORD
// ===============================

if (
    proyectil.tipo === "hivelord"
) {

    crearExplosionHiveLord(
        proyectil.x,
        proyectil.y
    );

    proyectilesEnemigos.splice(
        i,
        1
    );

    continue;
}

        // Quitar vida
        jugador.vida -=
            proyectil.daño;

        if (jugador.vida < 0) {
            jugador.vida = 0;
        }

        hudVida.textContent =
            jugador.vida;

        reiniciarComboPorDaño();
        crearParticulasDañoJugador();
        reproducirSonido("adoHit");


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

// Solo el bicho normal y el Tank
// pueden hacer daño cuerpo a cuerpo.
if (
    enemigo.tipo !== "normal"
    &&
    enemigo.tipo !== "tank"
) {
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

               // El Tank ataca más lento,
            // pero causa mucho más daño.
if (enemigo.tipo === "tank") {

    enemigo.proximoAtaque =
        ahora + 1400;

    jugador.vida -=
        enemigo.daño;

} else {

    enemigo.proximoAtaque =
        ahora + 700;

    jugador.vida -= 1;
}

                if (jugador.vida < 0) {
                    jugador.vida = 0;
                }

                hudVida.textContent =
                    jugador.vida;

                reiniciarComboPorDaño();
                crearParticulasDañoJugador();
                reproducirSonido("adoHit");

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
                if (enemigo.tipo === "tank") {

    enemigo.atacandoHasta =
        ahora + 600;

} else {

    enemigo.atacandoHasta =
        ahora + 400;
}

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


// ===========================================================
// DIBUJAR EXPLOSIONES DE ENERGÍA
// ===========================================================
// Es un efecto visual corto. El daño ya se aplica en el momento
// exacto del clic derecho dentro de crearExplosionEnergia().
// ===========================================================

function dibujarExplosionesEnergia(tiempo) {

    for (
        let i = explosionesEnergia.length - 1;
        i >= 0;
        i--
    ) {

        const explosion =
            explosionesEnergia[i];


// ===============================
// ONDA EXPANSIVA DEL SLAM
// ===============================

if (
    explosion.tipo === "slam"
) {

    const progreso =
        Math.max(
            0,
            (tiempo - explosion.inicio)
            /
            explosion.duracion
        );


    // Cuando termina,
    // eliminamos la onda.
    if (
        progreso >= 1
    ) {

        explosionesEnergia.splice(
            i,
            1
        );

        continue;
    }

            // La onda comienza pequeña
            // y crece hasta radioMaximo.
            const radioActual =
                explosion.radioMaximo
                *
                progreso;


            ctx.save();


            // ===============================
            // RELLENO DE LA ONDA
            // ===============================

            ctx.beginPath();

            ctx.arc(
                explosion.x,
                explosion.y,
                radioActual,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(
                    186,
                    255,
                    54,
                    ${0.10 * (1 - progreso)}
                )`;

            ctx.fill();


            // ===============================
            // ANILLO PRINCIPAL
            // ===============================

            ctx.beginPath();

            ctx.arc(
                explosion.x,
                explosion.y,
                radioActual,
                0,
                Math.PI * 2
            );

            ctx.strokeStyle =
                `rgba(
                    220,
                    255,
                    120,
                    ${1 - progreso}
                )`;

            ctx.lineWidth =
                Math.max(
                    4,
                    18 * (1 - progreso)
                );

            ctx.stroke();


            // ===============================
            // SEGUNDO ANILLO
            // ===============================

            ctx.beginPath();

            ctx.arc(
                explosion.x,
                explosion.y,
                radioActual * 0.82,
                0,
                Math.PI * 2
            );

            ctx.strokeStyle =
                `rgba(
                    255,
                    255,
                    255,
                    ${0.55 * (1 - progreso)}
                )`;

            ctx.lineWidth =
                Math.max(
                    2,
                    8 * (1 - progreso)
                );

            ctx.stroke();


            ctx.restore();


            // Muy importante:
            // evita que esta onda también
            // use el dibujo azul normal.
            continue;
        }


        // ===============================
        // EXPLOSIONES NORMALES
        // ===============================

        const progreso =
            (tiempo - explosion.inicio)
            /
            explosion.duracion;


        if (
            progreso >= 1
        ) {

            explosionesEnergia.splice(
                i,
                1
            );

            continue;
        }


        const radioActual =
            explosion.radioMaximo
            *
            (
                0.25
                +
                0.75 * progreso
            );


        ctx.save();

        ctx.globalAlpha =
            1 - progreso;

        ctx.beginPath();

        ctx.arc(
            explosion.x,
            explosion.y,
            radioActual,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(57, 217, 255, 0.22)";

        ctx.fill();


        ctx.lineWidth =
            5 - 3 * progreso;

        ctx.strokeStyle =
            "#9eeaff";

        ctx.stroke();


        // Destello central.
        ctx.beginPath();

        ctx.arc(
            explosion.x,
            explosion.y,
            Math.max(
                4,
                18 * (1 - progreso)
            ),
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "white";

        ctx.fill();


        ctx.restore();
    }
}

// ===============================
// DIBUJAR ENEMIGOS
// ===============================

// ===============================
// DIBUJAR BICHO TANK
// ===============================

function dibujarTank(enemigo, tiempo, indice) {

    let sprite = tankIdleRight;
    let frame = 0;

    const cantidadFrames = 4;
    let tamaño = 190;


    // ===============================
    // MUERTE
    // ===============================

    if (enemigo.muriendo) {

        sprite = tankDeathRight;
        tamaño = 200;

        const tiempoMuerte =
            tiempo - enemigo.muerteInicio;

        frame =
            Math.floor(
                tiempoMuerte / 175
            );

        if (frame >= cantidadFrames) {

            enemigos.splice(
                indice,
                1
            );

            return;
        }
    }


    // ===============================
    // RECIBIR DAÑO
    // ===============================

    else if (
        tiempo <
        (enemigo.hitHasta || 0)
    ) {

        sprite = tankHitRight;

        frame =
            Math.floor(
                tiempo / 110
            )
            %
            cantidadFrames;
    }


    // ===============================
    // ATAQUE
    // ===============================

    else if (
        tiempo <
        (enemigo.atacandoHasta || 0)
    ) {

        sprite = tankAttackRight;

        tamaño = 195;

        frame =
            Math.floor(
                tiempo / 120
            )
            %
            cantidadFrames;
    }


    // ===============================
    // CAMINAR
    // ===============================

    else {

        sprite = tankIdleRight;

        frame =
            Math.floor(
                tiempo / 180
            )
            %
            cantidadFrames;
    }


    if (
        !sprite.complete ||
        sprite.width === 0
    ) {
        return;
    }


    const anchoFrame =
        sprite.width /
        cantidadFrames;

    const altoFrame =
        sprite.height;


    ctx.save();

    ctx.translate(
        enemigo.x,
        enemigo.y
    );


    // ===============================
    // MIRAR HACIA LA IZQUIERDA
    // ===============================

    if (
        enemigo.direccion === "left"
    ) {

        ctx.scale(
            -1,
            1
        );
    }


    ctx.drawImage(

        sprite,

        frame * anchoFrame,
        0,

        anchoFrame,
        altoFrame,

        -tamaño / 2,
        -tamaño / 2,

        tamaño,
        tamaño
    );


    ctx.restore();
}

// ===============================
// DIBUJAR JEFE - HIVELORD
// ===============================

function dibujarHiveLord(enemigo, tiempo, indice) {

    const cantidadFrames = 4;

    let sprite;
    let frameActual = 0;

    // Más grande que el Tank.
    let tamaño = 340;


// ===============================
// DIRECCIÓN
// ===============================

const mirandoDerecha =
    enemigo.direccion === "right";

// ===============================
// MUERTE DEL HIVELORD
// ===============================

if (
    enemigo.muriendo
) {

    sprite =
        hiveLordDeathLeft;

    tamaño = 360;


    const tiempoMuerte =
        tiempo - enemigo.muerteInicio;


    frameActual =
        Math.floor(
            tiempoMuerte / 220
        );


    // Cuando terminan los 4 frames
    // eliminamos al jefe.
    if (
    frameActual >= cantidadFrames
) {

    enemigos.splice(
        indice,
        1
    );


    // ===============================
    // REGRESAR A MÚSICA DE COMBATE
    // ===============================

    musicas.combate.currentTime =
        tiempoMusicaCombateAntesJefe;

    reproducirMusica(
        "combate"
    );


    return;
}


    // Esperar a que cargue el sprite.
    if (
        !sprite.complete
        ||
        sprite.naturalWidth === 0
    ) {
        return;
    }


    const anchoFrameMuerte =
        sprite.width /
        cantidadFrames;

    const altoFrameMuerte =
        sprite.height;


    ctx.save();


    // Movemos el origen al centro
    // del HiveLord.
    ctx.translate(
        enemigo.x,
        enemigo.y
    );


    // death-left ya mira hacia una dirección.
    // Para el lado contrario lo volteamos.
    if (
        !mirandoDerecha
    ) {

        ctx.scale(
            -1,
            1
        );
    }


    ctx.drawImage(

        sprite,

        frameActual *
        anchoFrameMuerte,

        0,

        anchoFrameMuerte,
        altoFrameMuerte,

        -tamaño / 2,
        -tamaño / 2,

        tamaño,
        tamaño
    );


    ctx.restore();


    // Muy importante:
    // ya dibujamos la muerte aquí,
    // así que no debe llegar al drawImage
    // normal de abajo.
    return;
}


// ===============================
// SALIR DE LA TIERRA
// ===============================

else if (
    enemigo.estado === "emerge"
) {

    sprite =
        mirandoDerecha
            ? hiveLordEmergeLeft
            : hiveLordEmergeRight;

    const tiempoAnimacion =
        tiempo - enemigo.estadoInicio;


    const frameEmerge =
        Math.floor(
            tiempoAnimacion / 400
        );


    // 4 frames × 400 ms = 1.6 segundos
    if (
        frameEmerge >= cantidadFrames
    ) {

        enemigo.estado =
            "idle";

        enemigo.estadoInicio =
            tiempo;

        enemigo.invulnerable =
            false;


        // Esperar 8 segundos antes
        // de volver a enterrarse.
        enemigo.proximoBurrow =
            tiempo + 8000;


        // Pequeño descanso antes
        // del siguiente disparo.
        enemigo.proximoAtaque =
            tiempo + 1200;


        frameActual = 0;

        sprite =
            mirandoDerecha
                ? hiveLordIdleLeft
                : hiveLordIdleRight;

    } else {

        // Reproducir el spritesheet al revés:
        // 3 → 2 → 1 → 0
        frameActual =
            cantidadFrames - 1 - frameEmerge;
    }
}


// ===============================
// ENTERRARSE
// ===============================

else if (
    enemigo.estado === "burrow"
) {

    sprite =
        mirandoDerecha
            ? hiveLordBurrowLeft
            : hiveLordBurrowRight;

    const tiempoBurrow =
        tiempo - enemigo.estadoInicio;


    const frameBurrow =
        Math.min(
            Math.floor(
                tiempoBurrow / 400
            ),
            cantidadFrames - 1
        );


    frameActual =
        cantidadFrames - 1 - frameBurrow;
}


// ===============================
// OCULTO BAJO TIERRA
// ===============================

else if (
    enemigo.estado === "hidden"
) {

    // Mientras está completamente
    // enterrado no dibujamos nada.
    return;
}

// ===============================
// SLAM
// ===============================

else if (
    enemigo.estado === "slam"
) {

    sprite =
        mirandoDerecha
            ? hiveLordSlamLeft
            : hiveLordSlamRight;

    const tiempoSlam =
        tiempo - enemigo.estadoInicio;


    frameActual =
        Math.floor(
            tiempoSlam / 250
        );


    frameActual =
        Math.min(
            frameActual,
            cantidadFrames - 1
        );
}

// ===============================
// ESCUPIR
// ===============================

else if (
    enemigo.estado === "spit"
) {

    sprite =
        mirandoDerecha
            ? hiveLordSpitLeft
            : hiveLordSpitRight;

    const tiempoAtaque =
        tiempo - enemigo.estadoInicio;


    frameActual =
        Math.floor(
            tiempoAtaque / 180
        );


    frameActual =
        Math.min(
            frameActual,
            cantidadFrames - 1
        );
}


// ===============================
// IDLE ANIMADO
// ===============================

else {

    sprite =
        mirandoDerecha
            ? hiveLordIdleLeft
            : hiveLordIdleRight;


    frameActual =
        Math.floor(
            tiempo / 180
        )
        %
        cantidadFrames;
}

    // ===============================
    // COMPROBAR SPRITE
    // ===============================

    if (
        !sprite.complete
        ||
        sprite.naturalWidth === 0
    ) {
        return;
    }


    const anchoFrame =
        sprite.width /
        cantidadFrames;

    const altoFrame =
        sprite.height;


    // ===============================
    // DIBUJAR
    // ===============================

    ctx.drawImage(

        sprite,

        frameActual * anchoFrame,
        0,

        anchoFrame,
        altoFrame,

        enemigo.x - tamaño / 2,
        enemigo.y - tamaño / 2,

        tamaño,
        tamaño
    );
}

// ===============================
// BARRA DE VIDA DEL HIVELORD
// ===============================

function dibujarBarraHiveLord() {

    const jefe =
        enemigos.find(
            enemigo =>
                enemigo.tipo === "hivelord"
                &&
                !enemigo.muriendo
        );


    // Si no está el jefe,
    // no dibujamos nada.
    if (!jefe) {
        return;
    }


    const anchoBarra =
        Math.min(
            650,
            canvas.width * 0.55
        );

    const altoBarra = 24;

    const x =
        canvas.width / 2
        -
        anchoBarra / 2;

    const y = 55;


    const porcentajeVida =
        Math.max(
            0,
            jefe.vida / jefe.vidaMaxima
        );


    ctx.save();


    // ===============================
    // NOMBRE DEL JEFE
    // ===============================

    ctx.font =
        "bold 20px Arial";

    ctx.textAlign =
        "center";

    ctx.fillStyle =
        "white";

    ctx.fillText(
        "HIVELORD",
        canvas.width / 2,
        y - 12
    );


    // ===============================
    // FONDO DE LA BARRA
    // ===============================

    ctx.fillStyle =
        "rgba(0, 0, 0, 0.75)";

    ctx.fillRect(
        x - 4,
        y - 4,
        anchoBarra + 8,
        altoBarra + 8
    );


    // ===============================
    // VIDA RESTANTE
    // ===============================

    ctx.fillStyle =
        "#8cff32";

    ctx.fillRect(
        x,
        y,
        anchoBarra * porcentajeVida,
        altoBarra
    );


    // ===============================
    // BORDE
    // ===============================

    ctx.strokeStyle =
        "white";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        x,
        y,
        anchoBarra,
        altoBarra
    );


    // ===============================
    // TEXTO DE VIDA
    // ===============================

    ctx.font =
        "bold 14px Arial";

    ctx.fillStyle =
        "white";

    ctx.fillText(
        `${Math.max(0, Math.ceil(jefe.vida))} / ${jefe.vidaMaxima}`,
        canvas.width / 2,
        y + 17
    );


    ctx.restore();
}

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

if (enemigo.tipo === "tank") {

    dibujarTank(
        enemigo,
        tiempo,
        i
    );

    continue;
}

if (enemigo.tipo === "hivelord") {

    dibujarHiveLord(
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

// ===========================================================
// TARJETAS DE MEJORA DE TODAS LAS ARMAS
// ===========================================================
// La tienda muestra PISTOLA, ESCOPETA y ENERGÍA al mismo tiempo.
// Cada botón guarda en data-arma qué arma debe mejorar, así que
// el jugador puede invertir en cualquiera sin tenerla equipada.
// ===========================================================

function calcularCadenciaMejorada(cadenciaActual) {

    // Reducir 10 % la cadencia hace que el arma dispare más rápido.
    // El límite evita llegar a valores exageradamente pequeños.
    return Math.max(
        120,
        Math.round(cadenciaActual * 0.90)
    );

}


function calcularAlcanceMejorado(alcanceActual) {

    return Math.round(
        alcanceActual * 1.15
    );

}


function obtenerInfoMejoraEspecial(claveArma) {

    const arma =
        armas[claveArma];

    const nivel =
        arma.nivelEspecial;


    if (claveArma === "pistola") {

        if (nivel === 0) {
            return {
                titulo: "RÁFAGA GEMELA",
                descripcion: "Nivel 1: cada clic dispara dos balas alineadas, una detrás de la otra.",
                actual: "1 bala",
                siguiente: "2 balas"
            };
        }

        if (nivel === 1) {
            return {
                titulo: "RÁFAGA GEMELA",
                descripcion: "Nivel 2: añade una tercera bala a la misma fila de disparo.",
                actual: "2 balas",
                siguiente: "3 balas"
            };
        }

        return {
            titulo: "RÁFAGA GEMELA",
            descripcion: "La pistola dispara tres balas alineadas en una sola fila por cada clic.",
            actual: "3 balas",
            siguiente: "MÁXIMO"
        };

    }


    if (claveArma === "escopeta") {

        if (nivel === 0) {
            return {
                titulo: "LLUVIA DE PLOMO",
                descripcion: "Nivel 1: aumenta la descarga de tres a cinco perdigones.",
                actual: "3 perdigones",
                siguiente: "5 perdigones"
            };
        }

        if (nivel === 1) {
            return {
                titulo: "LLUVIA DE PLOMO",
                descripcion: "Nivel 2: cada perdigón puede atravesar un enemigo y golpear a un segundo.",
                actual: "5 perdigones",
                siguiente: "5 + perforación"
            };
        }

        return {
            titulo: "LLUVIA DE PLOMO",
            descripcion: "Cinco perdigones; cada uno puede dañar hasta dos enemigos diferentes.",
            actual: "5 + perforación",
            siguiente: "MÁXIMO"
        };

    }


    // ENERGÍA
    if (nivel === 0) {
        return {
            titulo: "NÚCLEO SOBRECARGADO",
            descripcion: "Nivel 1: aumenta un 35 % el tamaño del proyectil de energía.",
            actual: "Tamaño normal",
            siguiente: "+35 % tamaño"
        };
    }

    if (nivel === 1) {
        return {
            titulo: "NÚCLEO SOBRECARGADO",
            descripcion: "Nivel 2: desbloquea la detonación manual del proyectil con clic derecho.",
            actual: "+35 % tamaño",
            siguiente: "Detonación manual"
        };
    }

    return {
        titulo: "NÚCLEO SOBRECARGADO",
        descripcion: "Clic izquierdo dispara y clic derecho detona el proyectil activo más reciente.",
        actual: "+35 % + detonación",
        siguiente: "MÁXIMO"
    };

}


function crearTarjetaMejoraEspecial(claveArma) {

    const arma =
        armas[claveArma];

    const nivel =
        arma.nivelEspecial;

    const maximo =
        nivel >= 2;

    const precio =
        nivel === 0
            ? 8
            : 12;

    const info =
        obtenerInfoMejoraEspecial(
            claveArma
        );


    return `
        <div class="itemTienda tarjetaMejoraArma tarjetaMejoraEspecial ${maximo ? "especialMaxima" : ""}">

            <div class="infoItemTienda">

                <h4>${info.titulo}</h4>

                <p class="nivelEspecialTienda">
                    NIVEL ${nivel} / 2
                </p>

                <p class="descripcionItem">
                    ${info.descripcion}
                </p>

                <p class="cambioEstadisticaTienda cambioEspecialTienda">
                    <strong>${info.actual}</strong>
                    ${maximo ? "" : "→"}
                    <strong>${maximo ? "" : info.siguiente}</strong>
                </p>

                <p class="precioItem">
                    ${maximo ? "MEJORA MÁXIMA" : `◇ ${precio} Hexa Cores`}
                </p>

                <button
                    class="btnComprarMejoraArma"
                    data-arma="${claveArma}"
                    data-mejora="especial"
                    ${maximo ? "disabled" : ""}
                >
                    ${maximo ? "MÁXIMO" : "MEJORAR"}
                </button>

            </div>

        </div>
    `;

}


function crearTarjetaMejoraArma(
    claveArma,
    tipoMejora,
    titulo,
    descripcion,
    etiquetaValor,
    valorActual,
    valorNuevo,
    precio
) {

    return `
        <div class="itemTienda tarjetaMejoraArma">

            <div class="infoItemTienda">

                <h4>${titulo}</h4>

                <p class="descripcionItem">
                    ${descripcion}
                </p>

                <p class="cambioEstadisticaTienda">
                    ${etiquetaValor}:
                    <strong>${valorActual}</strong>
                    →
                    <strong>${valorNuevo}</strong>
                </p>

                <p class="precioItem">
                    ◇ ${precio} Hexa Cores
                </p>

                <button
                    class="btnComprarMejoraArma"
                    data-arma="${claveArma}"
                    data-mejora="${tipoMejora}"
                >
                    COMPRAR
                </button>

            </div>

        </div>
    `;

}


function actualizarTarjetasMejorasArmas() {

    if (!contenedorMejorasArmas) {
        return;
    }

    contenedorMejorasArmas.innerHTML = "";


    Object.keys(armas).forEach(function (claveArma) {

        const arma = armas[claveArma];
        const precioMejora = 5;

        const bloqueArma =
            document.createElement("section");

        bloqueArma.className =
            "bloqueArmaTienda";


        // Solo sirve como referencia visual. NO limita las compras.
        const textoEquipada =
            claveArma === armaActual
                ? '<span class="etiquetaEquipada">EQUIPADA</span>'
                : "";


        const nuevaCadencia =
            calcularCadenciaMejorada(
                arma.cadencia
            );

        const nuevoAlcance =
            calcularAlcanceMejorado(
                arma.alcance
            );


        bloqueArma.innerHTML = `

            <div class="encabezadoArmaTienda">

                <div
                    class="spriteArmaTienda"
                    style="background-image: url('${arma.sprite.src}')"
                    aria-label="Sprite de ${arma.nombre}"
                ></div>

                <div>
                    <h3>${arma.nombre}</h3>
                    ${textoEquipada}
                </div>

            </div>

            <div class="gridMejorasArma">

                ${crearTarjetaMejoraArma(
                    claveArma,
                    "daño",
                    "MUNICIÓN REFORZADA",
                    "Aumenta en 5 puntos el daño de cada proyectil.",
                    "Daño",
                    arma.daño,
                    arma.daño + 5,
                    precioMejora
                )}

                ${crearTarjetaMejoraArma(
                    claveArma,
                    "cadencia",
                    "MECANISMO ACELERADO",
                    "Reduce un 10 % el tiempo entre disparos.",
                    "Cadencia",
                    arma.cadencia + " ms",
                    nuevaCadencia + " ms",
                    precioMejora
                )}

                ${crearTarjetaMejoraArma(
                    claveArma,
                    "alcance",
                    "CAÑÓN MEJORADO",
                    "Aumenta un 15 % la distancia máxima del proyectil.",
                    "Alcance",
                    arma.alcance,
                    nuevoAlcance,
                    precioMejora
                )}

                ${crearTarjetaMejoraEspecial(
                    claveArma
                )}

            </div>
        `;

        contenedorMejorasArmas.appendChild(
            bloqueArma
        );

    });

}


function comprarMejoraArma(
    claveArma,
    tipoMejora
) {

    const arma =
        armas[claveArma];

    if (!arma) {
        return;
    }


    let precioMejora = 5;


    // =======================================================
    // MEJORA ESPECIAL: SOLO DOS NIVELES
    // =======================================================
    if (tipoMejora === "especial") {

        if (arma.nivelEspecial >= 2) {
            mostrarAvisoTienda("Esta mejora especial ya está al máximo.");
            return;
        }

        precioMejora =
            arma.nivelEspecial === 0
                ? 8
                : 12;

    }


    // Antes de cobrar revisamos si la cadencia llegó a su límite.
    if (tipoMejora === "cadencia") {

        const nuevaCadencia =
            calcularCadenciaMejorada(
                arma.cadencia
            );

        if (nuevaCadencia === arma.cadencia) {
            mostrarAvisoTienda("Esta arma ya alcanzó el límite de cadencia.");
            return;
        }

    }


    if (hexaCores < precioMejora) {
        mostrarAvisoTienda("No tienes suficientes Hexa Cores.");
        return;
    }


    hexaCores -=
        precioMejora;

    reproducirSonido("compra");


    if (tipoMejora === "daño") {

        arma.daño += 5;

    } else if (tipoMejora === "cadencia") {

        arma.cadencia =
            calcularCadenciaMejorada(
                arma.cadencia
            );

    } else if (tipoMejora === "alcance") {

        arma.alcance =
            calcularAlcanceMejorado(
                arma.alcance
            );

    } else if (tipoMejora === "especial") {

        arma.nivelEspecial++;

    }


    hudHexa.textContent =
        hexaCores;

    actualizarSaldoTienda();

    if (hexaCores === 0) {
        mostrarAvisoTienda("Te quedaste sin Hexa Cores.");
    }

    // Volvemos a dibujar las tarjetas para enseñar al instante
    // el valor actualizado y el siguiente nivel disponible.
    actualizarTarjetasMejorasArmas();

}


function procesarFinOleada() {

    // Prioridad pedida:
    // 1) mejoras de nivel acumuladas
    // 2) tienda (en las oleadas donde corresponde)
    // 3) siguiente oleada
    if (mejorasNivelPendientes > 0) {

        accionDespuesNivel =
            oleada % 2 === 0
                ? "tienda"
                : "avanzar";

        abrirMejoraNivel();
        return;

    }

    if (oleada % 2 === 0) {

        abrirTienda();

    } else {

        avanzarOleada(performance.now());

    }

}


function abrirTienda() {

    tiendaActiva = true;
    juegoPausado = true;

    teclas = {};

    // Mostrar saldo y mejoras antes de abrir la tienda.
    actualizarSaldoTienda();
    actualizarTarjetasMejorasArmas();

    avisoTienda.classList.add("oculto");
    tiendaOverlay.classList.remove("oculto");

    if (hexaCores === 0) {
        mostrarAvisoTienda(
            "No tienes Hexa Cores disponibles. Derrota enemigos para conseguir más."
        );
    }

}


function cerrarTienda() {

    tiendaActiva = false;
    juegoPausado = false;

    tiendaOverlay.classList.add("oculto");
    avisoTienda.classList.add("oculto");

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

// ===========================================================
// MODO DEBUG
// ===========================================================

function actualizarDebugFPS(tiempo) {

    debugFrames++;

    const transcurrido =
        tiempo - debugUltimaMedicion;

    // Actualizamos la lectura varias veces por segundo para que
    // sea estable y fácil de leer.
    if (transcurrido >= 500) {

        debugFPS =
            Math.round(
                debugFrames * 1000
                /
                transcurrido
            );

        debugFrames = 0;
        debugUltimaMedicion = tiempo;
    }

}


function obtenerEstadoDebug() {

    if (jugador && jugador.muriendo) {
        return "DYING";
    }

    if (nivelOverlayActivo) {
        return "LEVEL UP";
    }

    if (tiendaActiva) {
        return "TIENDA";
    }

    if (juegoPausado) {
        return "PAUSA";
    }

    if (esperandoOleada) {
        return "ENTRE OLEADAS";
    }

    return "PLAYING";

}


function dibujarCirculoDebug(
    x,
    y,
    radio,
    color
) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radio,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    ctx.stroke();

}


function dibujarHitboxesDebug() {

    if (!debugActivo) {
        return;
    }

    ctx.save();


    // ADO
    if (jugador) {

        dibujarCirculoDebug(
            jugador.x,
            jugador.y,
            jugador.radio,
            "#39d9ff"
        );

    }


    // ENEMIGOS
    enemigos.forEach(
        function (enemigo) {

            dibujarCirculoDebug(
                enemigo.x,
                enemigo.y,
                enemigo.radio,
                "#ff4d4d"
            );

        }
    );


    // PROYECTILES DE ADO
    proyectiles.forEach(
        function (proyectil) {

            dibujarCirculoDebug(
                proyectil.x,
                proyectil.y,
                proyectil.radio,
                "#ffe66d"
            );

        }
    );


    // PROYECTILES ENEMIGOS
    proyectilesEnemigos.forEach(
        function (proyectil) {

            dibujarCirculoDebug(
                proyectil.x,
                proyectil.y,
                proyectil.radio,
                "#7cff00"
            );

        }
    );


    ctx.restore();

}


function dibujarPanelDebug() {

    if (
        !debugActivo
        ||
        !jugador
    ) {
        return;
    }


    const totalEntidades =
        1
        + enemigos.length
        + proyectiles.length
        + proyectilesEnemigos.length
        + particulas.length
        + explosionesEnergia.length;


    const lineas = [

        "DEBUG [F2]",

        "FPS: "
        + debugFPS,

        "ESTADO: "
        + obtenerEstadoDebug(),

        "OLEADA: "
        + oleada,

        "ENTIDADES: "
        + totalEntidades,

        "ENEMIGOS: "
        + enemigos.length,

        "PROYECTILES ADO: "
        + proyectiles.length,

        "PROYECTILES ENEMIGOS: "
        + proyectilesEnemigos.length,

        "PARTICULAS: "
        + particulas.length,

        "ADO X: "
        + Math.round(jugador.x),

        "ADO Y: "
        + Math.round(jugador.y),

        "VIDA: "
        + Math.round(jugador.vida)
        + " / "
        + Math.round(jugador.vidaMaxima),

        "ENERGIA: "
        + Math.round(energiaActual)
        + " / "
        + Math.round(energiaMaxima),

        "ARMA: "
        + armaActual.toUpperCase(),

        "COMBO: "
        + comboActual
        + "  x"
        + multiplicadorPuntos

    ];


    const x = 14;
    const y = 14;
    const ancho = 270;

    const altoLinea = 18;
    const padding = 12;

    const alto =
        padding * 2
        + lineas.length * altoLinea;


    ctx.save();


    // Fondo semitransparente.
    ctx.fillStyle =
        "rgba(0, 0, 0, 0.78)";

    ctx.fillRect(
        x,
        y,
        ancho,
        alto
    );


    // Borde de depuración.
    ctx.strokeStyle =
        "rgba(57, 217, 255, 0.90)";

    ctx.lineWidth = 1;

    ctx.strokeRect(
        x,
        y,
        ancho,
        alto
    );


    ctx.font =
        "13px monospace";

    ctx.textAlign =
        "left";

    ctx.textBaseline =
        "top";


    lineas.forEach(
        function (linea, indice) {

            if (indice === 0) {

                ctx.fillStyle =
                    "#39d9ff";

                ctx.font =
                    "bold 14px monospace";

            } else {

                ctx.fillStyle =
                    "#ffffff";

                ctx.font =
                    "13px monospace";

            }

            ctx.fillText(
                linea,
                x + padding,
                y + padding
                + indice * altoLinea
            );

        }
    );


    ctx.restore();

}


// ===============================
// GAME LOOP
// ===============================

function gameLoop(tiempo) {

    if (!juegoActivo) {
        return;
    }

    actualizarDebugFPS(tiempo);

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
dibujarMapa();

    // Recuperar energía poco a poco durante la partida.
    regenerarEnergia(tiempo);

    // El tiempo de puntuación solo avanza cuando realmente se está jugando.
    if (!juegoPausado && !jugador.muriendo) {
        tiempoJugadoMs +=
            Math.max(0, tiempo - ultimoTiempoJuego);
    }

    // Se actualiza siempre para que pausa/tienda no generen saltos al volver.
    ultimoTiempoJuego = tiempo;


    if (!juegoPausado && !jugador.muriendo) {

        // GENERAR ENEMIGOS

// ===============================
// HIVELORD - OLEADA 5
// ===============================

if (
    oleada === 5
    &&
    !hiveLordOleada5Generado
) {

    crearHiveLord();

    hiveLordOleada5Generado = true;
}

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

        const cantidadTanks =
    Math.min(
        4,
        Math.max(
            0,
            oleada - 2
        )
    );

    if (
    enemigosGenerados <
    cantidadRangers
) {

    crearEnemigoRanger();

} else if (
    enemigosGenerados <
    cantidadRangers
    +
    cantidadTanks
) {

    crearEnemigoTank();

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

        moverParticulas();


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

            // Evita que este bloque se dispare varias veces mientras
            // abrimos la selección de nivel o la tienda.
            esperandoOleada = false;

            procesarFinOleada();

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

    dibujarExplosionesEnergia(tiempo);

    dibujarParticulas();

    dibujarMensajeOleada(tiempo);

    dibujarArmaActual(tiempo);

    dibujarBarraHiveLord();

    // DEBUG siempre se dibuja al final para quedar por encima
    // de sprites, partículas y proyectiles.
    dibujarHitboxesDebug();

    dibujarPanelDebug();


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

    // Sonido propio de muerte: empieza junto con el sprite de DEATH.
    reproducirSonido("adoMuerte");

    teclas = {};
}

// ===============================
// GAME OVER
// ===============================

function terminarJuego() {

    juegoActivo = false;
    nivelOverlayActivo = false;
    accionDespuesNivel = null;
    nivelOverlay.classList.add("oculto");

    const segundosSobrevividos =
        Math.floor(tiempoJugadoMs / 1000);

    bonusTiempo =
        segundosSobrevividos * 5;

    puntos += bonusTiempo;

    juego.classList.add(
        "oculto"
    );

    gameOver.classList.remove(
        "oculto"
    );

    // El combate terminó: dejamos espacio al efecto triste de Game Over.
    detenerMusica();

    // Entra después de terminar la animación de muerte de Ado.
    // Funciona como pequeño sting triste para la pantalla de Game Over.
    reproducirSonido("gameOver");


    puntosFinales.textContent =
        puntos;

    tiempoFinal.textContent =
        formatearTiempo(segundosSobrevividos);

    bonusTiempoFinal.textContent =
        "+" + bonusTiempo;

    comboMaximoFinal.textContent =
        comboMaximo;

    estadoGuardarPuntaje.textContent =
        "Escribe tu nombre para intentar entrar al Top 10.";

}


// ===============================
// REGRESAR AL MENÚ
// ===============================

btnGuardarPuntaje.addEventListener("click", function () {

    guardarPuntajeServidor();

});

nombreJugador.addEventListener("keydown", function (evento) {

    if (evento.key === "Enter") {
        guardarPuntajeServidor();
    }

});

btnReiniciar.addEventListener("click", function () {

    iniciarJuego();

});


btnMenu.addEventListener("click", function () {

    juegoActivo = false;
    juegoPausado = false;

    teclas = {};

    pausaOverlay.classList.add("oculto");
    nivelOverlay.classList.add("oculto");
    nivelOverlayActivo = false;
    gameOver.classList.add("oculto");
    juego.classList.add("oculto");

    menu.classList.remove("oculto");

    reproducirMusica("menu", true);

});
btnContinuar.addEventListener("click", function () {

    juegoPausado = false;

    pausaOverlay.classList.add("oculto");

    reanudarMusica();

});

btnCerrarTienda.addEventListener("click", function () {

    cerrarTienda();

});

btnComprarBolillo.addEventListener("click", function () {

    const precioBolillo = 3;
    const curacionBolillo = 25;

    if (jugador.vida >= jugador.vidaMaxima) {
        mostrarAvisoTienda("Ado ya tiene la vida completa.");
        return;
    }

    if (hexaCores < precioBolillo) {
        mostrarAvisoTienda("No tienes suficientes Hexa Cores.");
        return;
    }

    hexaCores -= precioBolillo;

    reproducirSonido("compra");

    jugador.vida = Math.min(
        jugador.vida + curacionBolillo,
        jugador.vidaMaxima
    );

    hudVida.textContent = jugador.vida;
    hudHexa.textContent = hexaCores;
    actualizarSaldoTienda();

    if (hexaCores === 0) {
        mostrarAvisoTienda("Te quedaste sin Hexa Cores.");
    }

});


// ===========================================================
// TIENDA - BATERÍA HEXA
// ===========================================================
// Cuesta 4 Hexa Cores.
// Aumenta la energía máxima en 20 puntos.
//
// También entrega esos 20 puntos en el momento de la compra,
// para que el aumento de capacidad se note inmediatamente.
// ===========================================================

btnComprarBateria.addEventListener("click", function () {

    const precioBateria = 4;
    const aumentoEnergia = 20;

    if (hexaCores < precioBateria) {
        mostrarAvisoTienda("No tienes suficientes Hexa Cores.");
        return;
    }

    hexaCores -= precioBateria;

    reproducirSonido("compra");

    energiaMaxima +=
        aumentoEnergia;

    energiaActual =
        Math.min(
            energiaActual + aumentoEnergia,
            energiaMaxima
        );

    hudHexa.textContent =
        hexaCores;

    actualizarSaldoTienda();

    if (hexaCores === 0) {
        mostrarAvisoTienda("Te quedaste sin Hexa Cores.");
    }

});


// ===========================================================
// TIENDA - CATALIZADOR
// ===========================================================
// Cuesta 5 Hexa Cores.
// Aumenta permanentemente durante ESTA partida la velocidad
// de regeneración de energía en 2 puntos por segundo.
//
// Ejemplo:
// 8/s -> 10/s -> 12/s -> 14/s ...
// ===========================================================

btnComprarCatalizador.addEventListener("click", function () {

    const precioCatalizador = 5;
    const aumentoRegeneracion = 2;

    if (hexaCores < precioCatalizador) {
        mostrarAvisoTienda("No tienes suficientes Hexa Cores.");
        return;
    }

    hexaCores -= precioCatalizador;

    reproducirSonido("compra");

    regeneracionEnergia +=
        aumentoRegeneracion;

    hudHexa.textContent =
        hexaCores;

    actualizarSaldoTienda();

    if (hexaCores === 0) {
        mostrarAvisoTienda("Te quedaste sin Hexa Cores.");
    }

});

// ===========================================================
// TIENDA - MEJORAS DE CUALQUIER ARMA
// ===========================================================
// Usamos un solo listener para todos los botones generados.
// data-arma indica PISTOLA / ESCOPETA / ENERGÍA y data-mejora
// indica qué estadística se debe modificar.
// ===========================================================

contenedorMejorasArmas.addEventListener("click", function (evento) {

    const boton =
        evento.target.closest(
            ".btnComprarMejoraArma"
        );

    if (!boton) {
        return;
    }

    const claveArma =
        boton.dataset.arma;

    const tipoMejora =
        boton.dataset.mejora;

    comprarMejoraArma(
        claveArma,
        tipoMejora
    );

});


// ===========================================================
// ELEGIR PREMIO DE SUBIDA DE NIVEL
// ===========================================================

opcionesNivel.forEach(function (boton) {

    boton.addEventListener("click", function () {

        aplicarMejoraNivel(
            boton.dataset.mejoraNivel
        );

    });

});


btnMenuPausa.addEventListener("click", function () {

    juegoActivo = false;
    juegoPausado = false;

    teclas = {};

    pausaOverlay.classList.add("oculto");
    nivelOverlay.classList.add("oculto");
    nivelOverlayActivo = false;
    accionDespuesNivel = null;
    juego.classList.add("oculto");
    gameOver.classList.add("oculto");

    menu.classList.remove("oculto");

    reproducirMusica("menu", true);

});
