const pantalla = document.getElementById("pantalla");
const teclas = document.querySelector(".calculadora-teclas");

let valorActual = "0";
let valorGuardado = null;
let operadorPendiente = null;
let iniciarNuevoValor = false;
let hayError = false;

function actualizarPantalla() {
    pantalla.value = valorActual;
}

function escribirDigito(digito) {
    if (hayError || iniciarNuevoValor) {
        valorActual = digito;
        iniciarNuevoValor = false;
        hayError = false;
    } else if (valorActual === "0" || valorActual === "-0") {
        valorActual = valorActual.startsWith("-") ? `-${digito}` : digito;
    } else {
        valorActual += digito;
    }

    actualizarPantalla();
}

function escribirDecimal() {
    if (hayError || iniciarNuevoValor) {
        valorActual = "0.";
        iniciarNuevoValor = false;
        hayError = false;
    } else if (!valorActual.includes(".")) {
        valorActual += ".";
    }

    actualizarPantalla();
}

function cambiarSigno() {
    if (hayError) {
        return;
    }

    if (iniciarNuevoValor) {
        valorActual = operadorPendiente === null ? valorActual : "0";
        iniciarNuevoValor = false;
    }

    if (valorActual === "0") {
        valorActual = "-0";
    } else if (valorActual === "-0") {
        valorActual = "0";
    } else {
        valorActual = valorActual.startsWith("-") ? valorActual.slice(1) : `-${valorActual}`;
    }

    actualizarPantalla();
}

function borrarUltimoDigito() {
    if (hayError) {
        borrar();
        return;
    }

    if (iniciarNuevoValor && operadorPendiente !== null) {
        valorActual = "0";
        iniciarNuevoValor = false;
    } else if (iniciarNuevoValor) {
        iniciarNuevoValor = false;
        valorActual = valorActual.slice(0, -1) || "0";
    } else if (valorActual.length <= 1 || valorActual === "-0") {
        valorActual = "0";
    } else {
        valorActual = valorActual.slice(0, -1);
        if (valorActual === "-") {
            valorActual = "-0";
        }
    }

    actualizarPantalla();
}

function calcular(izquierda, operador, derecha) {
    switch (operador) {
        case "+":
            return izquierda + derecha;
        case "-":
            return izquierda - derecha;
        case "*":
            return izquierda * derecha;
        case "/":
            return derecha === 0 ? null : izquierda / derecha;
        default:
            return derecha;
    }
}

function mostrarResultado(resultado) {
    if (resultado === null || !Number.isFinite(resultado)) {
        valorActual = "Error";
        valorGuardado = null;
        operadorPendiente = null;
        hayError = true;
    } else {
        valorActual = String(Number(resultado.toPrecision(12)));
    }

    iniciarNuevoValor = true;
    actualizarPantalla();
}

function seleccionarOperador(operador) {
    if (hayError) {
        return;
    }

    const valor = Number(valorActual);
    if (operadorPendiente && !iniciarNuevoValor) {
        const resultado = calcular(valorGuardado, operadorPendiente, valor);
        if (resultado === null || !Number.isFinite(resultado)) {
            mostrarResultado(null);
            return;
        }
        valorActual = String(Number(resultado.toPrecision(12)));
        actualizarPantalla();
    }

    valorGuardado = Number(valorActual);
    operadorPendiente = operador;
    iniciarNuevoValor = true;
}

function resolverOperacion() {
    if (hayError || operadorPendiente === null || valorGuardado === null) {
        return;
    }

    mostrarResultado(calcular(valorGuardado, operadorPendiente, Number(valorActual)));
    valorGuardado = null;
    operadorPendiente = null;
}

function borrar() {
    valorActual = "0";
    valorGuardado = null;
    operadorPendiente = null;
    iniciarNuevoValor = false;
    hayError = false;
    actualizarPantalla();
}

teclas.addEventListener("click", (evento) => {
    const tecla = evento.target.closest("button");
    if (!tecla) {
        return;
    }

    if (tecla.dataset.digit !== undefined) {
        escribirDigito(tecla.dataset.digit);
    } else if (tecla.dataset.operator) {
        seleccionarOperador(tecla.dataset.operator);
    } else if (tecla.dataset.action === "decimal") {
        escribirDecimal();
    } else if (tecla.dataset.action === "equals") {
        resolverOperacion();
    } else if (tecla.dataset.action === "clear") {
        borrar();
    } else if (tecla.dataset.action === "backspace") {
        borrarUltimoDigito();
    } else if (tecla.dataset.action === "sign") {
        cambiarSigno();
    }
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" && evento.target instanceof HTMLElement && evento.target.closest("a, button")) {
        return;
    }

    if (/^\d$/.test(evento.key)) {
        escribirDigito(evento.key);
    } else if (evento.key === "." || evento.key === ",") {
        escribirDecimal();
    } else if (["+", "-", "*", "/"].includes(evento.key)) {
        seleccionarOperador(evento.key);
    } else if (evento.key === "Enter" || evento.key === "=") {
        evento.preventDefault();
        resolverOperacion();
    } else if (evento.key === "Backspace") {
        evento.preventDefault();
        borrarUltimoDigito();
    } else if (evento.key === "Escape" || evento.key === "Delete") {
        borrar();
    }
});
