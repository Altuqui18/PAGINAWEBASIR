const opcionesJuego = ["piedra", "papel", "tijera"];
const resultadoJuego = document.getElementById("resultado-juego");
const puntosJugador = document.getElementById("puntos-jugador");
const puntosOrdenador = document.getElementById("puntos-ordenador");
const botonesJuego = document.querySelector(".juego-opciones");
const botonReiniciar = document.getElementById("reiniciar-juego");

let puntuacionJugador = 0;
let puntuacionOrdenador = 0;

function jugar(eleccionJugador) {
    const eleccionOrdenador = opcionesJuego[Math.floor(Math.random() * opcionesJuego.length)];
    let resultado;

    if (eleccionJugador === eleccionOrdenador) {
        resultado = "¡Empate!";
    } else if (
        (eleccionJugador === "piedra" && eleccionOrdenador === "tijera") ||
        (eleccionJugador === "papel" && eleccionOrdenador === "piedra") ||
        (eleccionJugador === "tijera" && eleccionOrdenador === "papel")
    ) {
        puntuacionJugador += 1;
        resultado = "¡Has ganado!";
    } else {
        puntuacionOrdenador += 1;
        resultado = "Ha ganado el ordenador.";
    }

    resultadoJuego.textContent = `Tú elegiste ${eleccionJugador}; el ordenador eligió ${eleccionOrdenador}. ${resultado}`;
    puntosJugador.textContent = puntuacionJugador;
    puntosOrdenador.textContent = puntuacionOrdenador;
}

botonesJuego.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-eleccion]");
    if (boton) {
        jugar(boton.dataset.eleccion);
    }
});

botonReiniciar.addEventListener("click", () => {
    puntuacionJugador = 0;
    puntuacionOrdenador = 0;
    puntosJugador.textContent = "0";
    puntosOrdenador.textContent = "0";
    resultadoJuego.textContent = "Puntuación reiniciada. ¡Haz tu jugada!";
});
