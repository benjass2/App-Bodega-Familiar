//Logica del carrito de compras
let carrito = 0;

//Abrir / Cerrar el panel lateral
function toggleCarrito(){
    const panel = document.getElementById("panel-carrito");
    if(panel){
        panel.classList.toggle("oculto");
    }
}

function agregarAlCarrito(idProducto){
    const productoEncontrado = productosGlobales.find(p=>p.id ===idProducto);
    if(!productoEncontrado){
        console.error("No se encontro el producto");
        return;
    }

    const itemEnCarrito = carrito.find(item.id ===idProducto);

    if(itemEnCarrito){
        itemEnCarrito.cantidad++;
    } else{
        carrito.push({
        ...productoEncontrado,
        cantidad:1
        });
    }

    //Actualizamos la vista
    actualizarCarritoUI();

    if (navigator.vibrate) navigator.vibrate(50);
    
    //Opcional
    if (carrito.length === 1) {
        const panel = document.getElementById("panel-carrito");
        if (panel.classList.contains("oculto")) toggleCarrito();
    }
}


function restarCantidad(idProducto){
    const item = carrito.find(p => p.id === idProducto);
    if(item){
        item.cantidad--;

        if (item.cantidad <= 0) {
            carrito = carrito.filter(p => p.id !== idProducto);
        }
        actualizarCarritoUI();
    }
}


function actualizarCarritoUI() {
    const contenedorItems = document.getElementById("lista-items-carrito");
    const contadorFlotante = document.getElementById("contador-carrito");
    const textoTotal = document.getElementById("total-precio");

    // Limpiar lo anterior
    contenedorItems.innerHTML = "";

    let totalPrecio = 0;
    let totalArticulos = 0;

    // Caso: Carrito Vacío
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

    // Caso: Carrito con productos
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalPrecio += subtotal;
        totalArticulos += item.cantidad;

        // HTML de cada item en la lista
        const itemHTML = `
            <div class="item-carrito" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding: 12px 0;">
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
                    <button onclick="restarCantidad('${item.id}')" 
                        style="background: #ffeded; color: #ff4444; border: 1px solid #ff4444; width: 28px; height: 28px; border-radius: 50%; font-weight: bold; cursor: pointer;">
                        -
                    </button>
                    <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.cantidad}</span>
                    <button onclick="agregarAlCarrito('${item.id}')" 
                        style="background: #e8f5e9; color: #25D366; border: 1px solid #25D366; width: 28px; height: 28px; border-radius: 50%; font-weight: bold; cursor: pointer;">
                        +
                    </button>
                </div>
            </div>
        `;
        contenedorItems.innerHTML += itemHTML;
    });

    // Actualizar Totales Finales
    textoTotal.innerText = `S/ ${totalPrecio.toFixed(2)}`;
    contadorFlotante.innerText = totalArticulos;
    contadorFlotante.style.display = "flex"; // Mostrar bolita roja
}

// Función para Finalizar Venta (Limpia todo)
function limpiarCarrito() {
    if (carrito.length === 0) return;

    const total = document.getElementById("total-precio").innerText;
    
    // Confirmación simple
    if(confirm(`¿Cobrar venta por ${total}?`)) {
        carrito = []; // Vaciar memoria
        actualizarCarritoUI(); // Limpiar pantalla
        toggleCarrito(); // Cerrar panel
        // Aquí podrías guardar la venta en Firebase en el futuro
        alert("✅ ¡Venta registrada con éxito!");
    }
}



window.toggleCarrito = toggleCarrito;
window.limpiarCarrito = limpiarCarrito;
window.agregarAlCarrito = agregarAlCarrito;
window.restarCantidad = restarCantidad;

