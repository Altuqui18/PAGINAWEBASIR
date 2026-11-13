function actualizarBotonModo(oscuro) {
    const boton = document.getElementById("boton-modo");
    if (!boton) {
        return;
    }

    const modoBoton = oscuro ? "Modo blanco" : "Modo oscuro";
    boton.textContent = modoBoton;
    boton.setAttribute("aria-pressed", String(oscuro));
    boton.setAttribute("aria-label", `Cambiar a ${oscuro ? "modo blanco" : "modo oscuro"}`);
}

function cambiarModo() {
    const boton = document.getElementById("boton-modo");
    if (!boton) {
        return;
    }

    const temaActual = window.getCurrentTheme ? window.getCurrentTheme() : (document.body.classList.contains("modo-oscuro") ? "dark" : "light");
    const nuevoTema = temaActual === "dark" ? "light" : "dark";

    if (window.applyTheme) {
        window.applyTheme(nuevoTema);
    } else {
        document.body.classList.toggle("modo-oscuro", nuevoTema === "dark");
    }

    actualizarBotonModo(nuevoTema === "dark");
}

document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("boton-modo");
    if (!boton) {
        return;
    }

    const temaActual = window.getCurrentTheme ? window.getCurrentTheme() : (document.body.classList.contains("modo-oscuro") ? "dark" : "light");
    actualizarBotonModo(temaActual === "dark");
    boton.addEventListener("click", cambiarModo);
});
