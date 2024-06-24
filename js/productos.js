document.addEventListener("DOMContentLoaded", () => {
    fetch("../js/listaProductos.json")
        .then(response => response.json())
        .then(productos => {
            window.productos = productos;
            cargarProductos(productos);
        });
});

function cargarProductos(productos) {
    const categorias = {
        Fideos: document.querySelector("#fideos .food-menu-container"),
        Ravioles: document.querySelector("#ravioles .food-menu-container"),
        Salsa: document.querySelector("#salsas .food-menu-container"),
        Especiales: document.querySelector("#especiales .food-menu-container")
    };
    productos.forEach(producto => {
        const productElement = document.createElement("div");
        productElement.classList.add("food-menu-item");

        productElement.innerHTML = `
            <div class="food-img">
                <img src="${producto.imagen}" alt="${producto.titulo}">
            </div>
            <div class="food-description">
                <h3 class="food-title">${producto.titulo}</h3>
                <p>Precio: $${producto.precio}</p>
                <button class="btn btn-success producto-agregar" id="${producto.id}">Agregar al Carrito</button>
            </div>
        `;

        if (categorias[producto.categoria]) {
            categorias[producto.categoria].appendChild(productElement);
        } else {
            console.error(`Categoría no encontrada para el producto: ${producto.titulo}`);
        }
    });

    actualizarBotonesAgregar();
}

function actualizarBotonesAgregar() {
    let botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

const productosEnCarrito = JSON.parse(localStorage.getItem('productosEnCarrito')) || [];

function agregarAlCarrito(e) {
    Toastify({
        text: "Producto agregado al carrito",
        position: "left",
        style: {
            background: "linear-gradient(to right, #f1dc1cf5, #96c93d)",
        },
        duration: 2500
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = window.productos.find(producto => producto.id === idBoton);
    const productoEnCarrito = productosEnCarrito.find(producto => producto.id === idBoton);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }
    localStorage.setItem('productosEnCarrito', JSON.stringify(productosEnCarrito));
    actualizarNumerito();
}

function actualizarNumerito() {
    const numerito = document.querySelector("#numerito");
    numerito.textContent = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
}

actualizarNumerito();