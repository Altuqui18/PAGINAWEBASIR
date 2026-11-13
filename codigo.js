document.addEventListener("DOMContentLoaded", () => {
    const ejemplo = document.querySelector(".demo-js");

    if (!ejemplo) {
        return;
    }

    const numero1 = 5;
    const numero2 = 3;
    const suma = numero1 + numero2;

    ejemplo.textContent = `Ejemplo ejecutado: ${numero1} + ${numero2} = ${suma}`;
});


