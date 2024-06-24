document.addEventListener("DOMContentLoaded", () => {
    const carritoContainer = document.querySelector("#carrito-productos");
    const carritoVacio = document.querySelector("#carrito-vacio");
    const carritoAcciones = document.querySelector("#carrito-acciones");
    const mostrarTotal = document.querySelector("#total");
    const botonVaciar = document.querySelector(".carrito-acciones-vaciar");
    const botonComprar = document.querySelector(".carrito-acciones-comprar");
    let productosEnCarrito = JSON.parse(localStorage.getItem('productosEnCarrito')) || [];

    function actualizarCarrito() {
        carritoContainer.innerHTML = "";

        if (productosEnCarrito.length > 0) {
            carritoVacio.style.display = 'none';
            carritoAcciones.style.display = 'flex';

            productosEnCarrito.forEach(producto => {
                const productElement = document.createElement("div");
                productElement.classList.add("cart-item");

                productElement.innerHTML = `
                    <div class="carrito-img">
                        <img src="${producto.imagen}" alt="${producto.titulo}" style="width: 100px; height: 100px;">
                    </div>
                    <div class="carrito-descripcion">
                        <h4 class="cart-title">${producto.titulo}</h4>
                        <p>Precio: $${producto.precio}</p>
                        <p>Cantidad: ${producto.cantidad}</p>
                        <p>Total: $${producto.precio * producto.cantidad}</p>
                        <button class="producto-eliminar btn btn-danger" data-id="${producto.id}">Eliminar</button>
                    </div>
                `;

                carritoContainer.appendChild(productElement);
            });

            const total = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
            mostrarTotal.textContent = `$${total}`;
        } else {
            carritoVacio.style.display = 'block';
            carritoAcciones.style.display = 'none';
        }

        agregarEventoEliminar();
    }

    function agregarEventoEliminar() {
        const botonesEliminar = document.querySelectorAll(".producto-eliminar");
        botonesEliminar.forEach(boton => {
            boton.addEventListener("click", eliminarProducto);
        });
    }

    function eliminarProducto(e) {
        const idProducto = e.currentTarget.getAttribute("data-id");
        productosEnCarrito = productosEnCarrito.filter(producto => producto.id !== idProducto);
        localStorage.setItem('productosEnCarrito', JSON.stringify(productosEnCarrito));
        actualizarCarrito();
        actualizarNumerito();
    }

    function vaciarCarrito() {
        productosEnCarrito = [];
        localStorage.setItem('productosEnCarrito', JSON.stringify(productosEnCarrito));
        actualizarCarrito();
        actualizarNumerito();
    }

    function actualizarNumerito() {
        const numerito = document.querySelector("#numerito");
        numerito.textContent = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    }

    botonVaciar.addEventListener("click", vaciarCarrito);
    botonComprar.addEventListener("click", comprarCarrito);


    function comprarCarrito() {
        Swal.fire({
            title: "¿Desea realizar su compra?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "¡Si, quiero comprar!",
            customClass: {
                title: "custom-swal-title"
            }
            }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                title: "Realizaste tu compra con éxito",
                icon: "success",
                customClass: {
                    title: "custom-swal-title"
                }
                }).then(() => {
                productosEnCarrito = [];
                localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));
                actualizarCarrito();
                actualizarNumerito();
                });
            }
        });
    }
    actualizarCarrito();
});