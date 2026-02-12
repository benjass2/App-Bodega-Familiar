// Logica del carrito de compras
import { getProductos } from "./estado.js";

let carrito = [];

// Abrir / Cerrar el panel lateral
export function toggleCarrito() {
    const panel = document.getElementById("panel-carrito");
    if (panel) {
        panel.classList.toggle("oculto");
    }
}

export function agregarAlCarrito(idProducto) {
    const productos = getProductos();
    const productoEncontrado = productos.find(p => p.id === idProducto);
    if (!productoEncontrado) {
        console.error("No se encontro el producto");
        return;
    }

    const itemEnCarrito = carrito.find(item => item.id === idProducto);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({
            ...productoEncontrado,
            cantidad: 1
        });
    }

    actualizarCarritoUI();

    if (navigator.vibrate) navigator.vibrate(50);

    // Opcional: abrir si es el primero
    if (carrito.length === 1) {
        const panel = document.getElementById("panel-carrito");
        if (panel.classList.contains("oculto")) toggleCarrito();
    }
}

export function restarCantidad(idProducto) {
    const item = carrito.find(p => p.id === idProducto);
    if (item) {
        item.cantidad--;

        if (item.cantidad <= 0) {
            carrito = carrito.filter(p => p.id !== idProducto);
        }
        actualizarCarritoUI();
    }
}

export function actualizarCarritoUI() {
    const contenedorItems = document.getElementById("lista-items-carrito");
    const contadorFlotante = document.getElementById("contador-carrito");
    const textoTotal = document.getElementById("total-precio");

    contenedorItems.innerHTML = "";

    let totalPrecio = 0;
    let totalArticulos = 0;

    if (carrito.length === 0) {
        contenedorItems.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #888;">
                <p style="font-size: 50px; margin: 0;">🛒</p>
                <p>Tu canasta está vacía</p>
            </div>`;
        contadorFlotante.innerText = "0";
        contadorFlotante.style.display = "none";
        textoTotal.innerText = "S/ 0.00";
        return;
    }

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalPrecio += subtotal;
        totalArticulos += item.cantidad;

        const itemHTML = document.createElement("div");
        itemHTML.className = "item-carrito";
        itemHTML.style.cssText = "display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding: 12px 0;";
        itemHTML.innerHTML = `
            <div style="flex-grow: 1;">
                <div style="font-weight: bold; font-size: 15px;">${item.nombre}</div>
                <div style="color: #666; font-size: 13px;">
                    S/ ${parseFloat(item.precio).toFixed(2)} x ${item.cantidad} un.
                </div>
            </div>
            <div style="font-weight: bold; color: #333; margin-right: 15px;">
                S/ ${subtotal.toFixed(2)}
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
                <button class="btn-restar" data-id="${item.id}"
                    style="background: #ffeded; color: #ff4444; border: 1px solid #ff4444; width: 28px; height: 28px; border-radius: 50%; font-weight: bold; cursor: pointer;">
                    -
                </button>
                <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.cantidad}</span>
                <button class="btn-sumar" data-id="${item.id}"
                    style="background: #e8f5e9; color: #25D366; border: 1px solid #25D366; width: 28px; height: 28px; border-radius: 50%; font-weight: bold; cursor: pointer;">
                    +
                </button>
            </div>
        `;

        // Agregar eventos localmente a los botones recién creados
        itemHTML.querySelector(".btn-restar").onclick = () => restarCantidad(item.id);
        itemHTML.querySelector(".btn-sumar").onclick = () => agregarAlCarrito(item.id);

        contenedorItems.appendChild(itemHTML);
    });

    textoTotal.innerText = `S/ ${totalPrecio.toFixed(2)}`;
    contadorFlotante.innerText = totalArticulos;
    contadorFlotante.style.display = "flex";
}

export function limpiarCarrito() {
    if (carrito.length === 0) return;

    const total = document.getElementById("total-precio").innerText;

    if (confirm(`¿Cobrar venta por ${total}?`)) {
        carrito = [];
        actualizarCarritoUI();
        toggleCarrito();
        alert("✅ ¡Venta registrada con éxito!");
    }
}

// NUEVO: Función para inicializar los eventos que antes estaban en el HTML
export function inicializarCarrito() {
    const btnBotonCarrito = document.getElementById("boton-carrito");
    const btnCerrarCarrito = document.querySelector(".carrito-header button");
    const btnFinalizarCobro = document.querySelector(".btn-cobrar");

    if (btnBotonCarrito) btnBotonCarrito.onclick = toggleCarrito;
    if (btnCerrarCarrito) btnCerrarCarrito.onclick = toggleCarrito;
    if (btnFinalizarCobro) btnFinalizarCobro.onclick = limpiarCarrito;
}

