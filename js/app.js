import { escucharProductos, guardarProducto, eliminarProducto, actualizarProducto } from "./services/productos.js";
import { crearTarjetaHTML } from "./ui/tarjetas.js";
import { setProductos, getProductos, esModoBorrar, esModoEditar, getIdEditando } from "./estado.js";
import { configurarFiltros, obtenerProductosProcesados } from "./ui/filtros.js";
import { configurarMenuAcciones } from "./ui/menuAcciones.js";
import { abrirModal, cerrarModal, obtenerDatosFormulario } from "./ui/modalProducto.js";
import { inicializarCarrito, agregarAlCarrito } from "./carrito.js";

// Referencias DOM principales
const listaDiv = document.getElementById("lista-productos");
const btnGuardar = document.getElementById("btn-guardar");

// 1. INICIALIZACIÓN

document.addEventListener("DOMContentLoaded", () => {
    // Configuramos los módulos
    configurarFiltros(renderizarApp);
    configurarMenuAcciones(renderizarApp);
    inicializarCarrito(); //Iniciamos el carrito
});

// 2. CONEXIÓN CON FIREBASE
escucharProductos((nuevosProductos) => {
    setProductos(nuevosProductos);
    renderizarApp();
});

// 3. MOTOR DE RENDERIZADO (PINTAR PANTALLA)
function renderizarApp() {
    listaDiv.innerHTML = "";

    const productos = obtenerProductosProcesados();

    if (productos.length === 0) {
        listaDiv.innerHTML = `
            <div style="text-align:center; padding: 2rem; color: #666;">
                <p>No se encontraron productos 🔍</p>
            </div>`;
        return;
    }

    const modoBorrar = esModoBorrar();
    const htmlFinal = productos
        .map(p => crearTarjetaHTML(p, modoBorrar))
        .join("");

    listaDiv.innerHTML = htmlFinal;
}

// 4. MANEJO DE CLICS EN LA LISTA (DELEGACIÓN)
listaDiv.addEventListener("click", async (e) => {
    const tarjeta = e.target.closest(".producto-card");
    const btnEliminar = e.target.closest(".btn-eliminar-card");

    if (btnEliminar) {
        const { id, nombre } = btnEliminar.dataset;
        if (confirm(`¿Eliminar ${nombre}?`)) {
            await eliminarProducto(id);
        }
        return;
    }

    if (!tarjeta) return;

    if (esModoEditar()) {
        const id = tarjeta.dataset.id;
        const producto = getProductos().find(p => p.id === id);
        if (producto) abrirModal(producto);
        return;
    }

    if (!esModoBorrar()) {
        const id = tarjeta.dataset.id;
        // Llamamos directamente a la función importada
        agregarAlCarrito(id);

        // Efecto visual
        tarjeta.style.transition = "background-color 0.2s";
        tarjeta.style.backgroundColor = "#dcfce7";
        setTimeout(() => tarjeta.style.backgroundColor = "", 200);
    }
});

// 5. GUARDAR / ACTUALIZAR PRODUCTO
btnGuardar.addEventListener("click", async () => {
    const datos = obtenerDatosFormulario();

    if (!datos.nombre || !datos.precio) {
        alert(" Completa nombre y precio");
        return;
    }

    try {
        btnGuardar.disabled = true;
        btnGuardar.textContent = "Procesando...";

        const idEditando = getIdEditando();

        if (idEditando) {
            await actualizarProducto(idEditando, datos);
            alert(" Producto actualizado");
        } else {
            await guardarProducto(datos);
            alert("✅ Producto guardado");
        }

        cerrarModal();

    } catch (error) {
        console.error(error);
        alert(" Error al guardar");
    } finally {
        btnGuardar.disabled = false;
    }
});



