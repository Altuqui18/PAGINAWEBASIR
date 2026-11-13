const productos = [
    { id: "raton", nombre: "Ratón", precio: 15, stock: 10, icono: "🖱️" },
    { id: "teclado", nombre: "Teclado", precio: 25, stock: 8, icono: "⌨️" },
    { id: "monitor", nombre: "Monitor", precio: 149, stock: 5, icono: "🖥️" },
    { id: "auriculares", nombre: "Auriculares", precio: 39, stock: 12, icono: "🎧" },
    { id: "altavoces", nombre: "Altavoces", precio: 29, stock: 7, icono: "🔊" },
    { id: "webcam", nombre: "Webcam", precio: 49, stock: 6, icono: "📷" }
];

const carrito = new Map();
const listaProductos = document.getElementById("lista-productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const mensajeTienda = document.getElementById("mensaje-tienda");
const botonComprar = document.getElementById("boton-comprar");
const formatoEuro = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
});

function renderizarProductos() {
    listaProductos.replaceChildren();

    for (const producto of productos) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tienda-producto";

        const icono = document.createElement("span");
        icono.className = "tienda-icono";
        icono.setAttribute("aria-hidden", "true");
        icono.textContent = producto.icono;

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.className = "tienda-precio";
        precio.textContent = formatoEuro.format(producto.precio);

        const stock = document.createElement("p");
        stock.className = "tienda-stock";
        stock.textContent = `Disponibles: ${producto.stock}`;

        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "Añadir al carrito";
        boton.setAttribute("aria-label", `Añadir ${producto.nombre} al carrito`);
        boton.disabled = producto.stock === 0;
        boton.addEventListener("click", () => anadirAlCarrito(producto.id));

        tarjeta.append(icono, nombre, precio, stock, boton);
        listaProductos.append(tarjeta);
    }
}

function anadirAlCarrito(idProducto) {
    const producto = productos.find((elemento) => elemento.id === idProducto);
    const cantidadActual = carrito.get(idProducto) || 0;

    if (!producto || cantidadActual >= producto.stock) {
        mensajeTienda.textContent = "No quedan más unidades disponibles de este producto.";
        return;
    }

    carrito.set(idProducto, cantidadActual + 1);
    mensajeTienda.textContent = `${producto.nombre} añadido al carrito.`;
    renderizarCarrito();
}

function cambiarCantidad(idProducto, cambio) {
    const cantidadActual = carrito.get(idProducto) || 0;
    const nuevaCantidad = cantidadActual + cambio;

    if (nuevaCantidad <= 0) {
        carrito.delete(idProducto);
    } else {
        carrito.set(idProducto, nuevaCantidad);
    }

    renderizarCarrito();
}

function renderizarCarrito() {
    listaCarrito.replaceChildren();
    let total = 0;
    let unidades = 0;

    for (const [idProducto, cantidad] of carrito) {
        const producto = productos.find((elemento) => elemento.id === idProducto);
        if (!producto) {
            continue;
        }

        total += producto.precio * cantidad;
        unidades += cantidad;

        const fila = document.createElement("li");
        fila.className = "tienda-linea-carrito";

        const detalle = document.createElement("span");
        detalle.textContent = `${producto.nombre} · ${formatoEuro.format(producto.precio * cantidad)}`;

        const controles = document.createElement("div");
        controles.className = "tienda-controles-cantidad";

        const botonRestar = document.createElement("button");
        botonRestar.type = "button";
        botonRestar.textContent = "−";
        botonRestar.setAttribute("aria-label", `Quitar una unidad de ${producto.nombre}`);
        botonRestar.addEventListener("click", () => cambiarCantidad(idProducto, -1));

        const cantidadTexto = document.createElement("span");
        cantidadTexto.textContent = String(cantidad);
        cantidadTexto.setAttribute("aria-label", `Unidades: ${cantidad}`);

        const botonSumar = document.createElement("button");
        botonSumar.type = "button";
        botonSumar.textContent = "+";
        botonSumar.disabled = cantidad >= producto.stock;
        botonSumar.setAttribute("aria-label", `Añadir una unidad de ${producto.nombre}`);
        botonSumar.addEventListener("click", () => cambiarCantidad(idProducto, 1));

        controles.append(botonRestar, cantidadTexto, botonSumar);
        fila.append(detalle, controles);
        listaCarrito.append(fila);
    }

    if (unidades === 0) {
        const vacio = document.createElement("li");
        vacio.className = "tienda-carrito-vacio";
        vacio.textContent = "Todavía no has añadido productos.";
        listaCarrito.append(vacio);
    }

    totalCarrito.textContent = formatoEuro.format(total);
    contadorCarrito.textContent = String(unidades);
    botonComprar.disabled = unidades === 0;
}

botonComprar.addEventListener("click", () => {
    if (carrito.size === 0) {
        return;
    }

    for (const [idProducto, cantidad] of carrito) {
        const producto = productos.find((elemento) => elemento.id === idProducto);
        if (!producto || cantidad > producto.stock) {
            mensajeTienda.textContent = "No se puede completar la compra: revisa el stock disponible.";
            return;
        }
    }

    for (const [idProducto, cantidad] of carrito) {
        const producto = productos.find((elemento) => elemento.id === idProducto);
        producto.stock -= cantidad;
    }

    carrito.clear();
    mensajeTienda.textContent = "¡Compra realizada correctamente! Gracias por tu pedido.";
    renderizarProductos();
    renderizarCarrito();
});

renderizarProductos();
renderizarCarrito();