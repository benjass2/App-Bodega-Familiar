// ==========================================
// 1. IMPORTACIONES (MODULARIZACIÓN)
// ==========================================
// Traemos la lógica de DB desde la carpeta services
import { 
    escucharProductos, 
    guardarProducto, 
    eliminarProducto 
} from "./services/productos.js";

// Traemos el diseño HTML desde la carpeta ui
import { crearTarjetaHTML } from "./ui/tarjetas.js";

console.log("¡Sistema Modular Cargado Exitosamente!");

// ==========================================
// 2. ESTADO GLOBAL
// ==========================================
let productosGlobales = []; // Aquí guardaremos la copia de los datos
let modoBorrarActivo = false; // Interruptor del modo borrar

// ==========================================
// 3. REFERENCIAS DEL DOM (Elementos HTML)
// ==========================================
const listaDiv = document.getElementById("lista-productos");
const modal = document.getElementById("modal-agregar");
const btnGuardar = document.getElementById("btn-guardar");

// Referencias del Menú Flotante
const btnFabPrincipal = document.getElementById("btn-fab-principal");
const menuOpciones = document.getElementById("fab-menu");
const btnOpcionAgregar = document.getElementById("btn-opcion-agregar");
const btnOpcionBorrar = document.getElementById("btn-opcion-borrar");

// Referencias de Filtros
const inputBuscador = document.getElementById("buscador");
const selectOrden = document.getElementById("filtro-orden");


// ==========================================
// 4. LÓGICA PRINCIPAL (CONTROLADOR)
// ==========================================

// A. INICIAR LA ESCUCHA (Suscripción a Firebase)
// Esta función se ejecuta sola cada vez que hay cambios en la DB
escucharProductos((nuevosProductos) => {
    productosGlobales = nuevosProductos; // Actualizamos nuestro array
    renderizarLista(); // Repintamos la pantalla
});

// B. FUNCIÓN MAESTRA DE RENDERIZADO
function renderizarLista() {
    listaDiv.innerHTML = "";
    
    // 1. Procesar datos (Filtrar y Ordenar)
    // Usamos una función auxiliar para no ensuciar aquí
    const productosProcesados = procesarDatos(productosGlobales);

    // 2. Validar si hay resultados
    if (productosProcesados.length === 0) {
        listaDiv.innerHTML = "<p style='text-align:center; color:#777;'>No se encontraron productos.</p>";
        return;
    }

    // 3. Generar HTML (Usando la función importada de UI)
    // Creamos un solo string gigante con map y join
    const htmlFinal = productosProcesados
        .map(producto => crearTarjetaHTML(producto, modoBorrarActivo))
        .join("");

    // 4. Inyectar al DOM (Una sola vez para mejor rendimiento)
    listaDiv.innerHTML = htmlFinal;
}

// C. HELPER: FILTRAR Y ORDENAR
function procesarDatos(lista) {
    const texto = inputBuscador?.value.toLowerCase() || "";
    const orden = selectOrden?.value || "menor-precio";

    // Filtrar
    let resultado = lista.filter(p => (p.nombre || "").toLowerCase().includes(texto));

    // Ordenar
    resultado.sort((a, b) => {
        const precioA = Number(a.precio) || 0;
        const precioB = Number(b.precio) || 0;
        return orden === "mayor-precio" ? precioB - precioA : precioA - precioB;
    });

    return resultado;
}


// ==========================================
// 5. MANEJO DE EVENTOS (INTERACCIONES)
// ==========================================

// --- EVENTO: GUARDAR PRODUCTO ---
if (btnGuardar) {
    btnGuardar.addEventListener("click", async () => {
        const nombre = document.getElementById("input-nombre").value.trim();
        const precio = document.getElementById("input-precio").value;
        const categoria = document.getElementById("input-categoria").value.trim();

        if (!nombre || !precio) {
            alert("⚠️ Falta completar nombre o precio");
            return;
        }

        try {
            btnGuardar.disabled = true;
            btnGuardar.textContent = "Guardando...";

            // Llamamos al servicio (No sabemos nada de Firebase aquí)
            await guardarProducto({ nombre, precio, categoria });

            // Limpieza
            document.getElementById("input-nombre").value = "";
            document.getElementById("input-precio").value = "";
            document.getElementById("input-categoria").value = "";
            
            modal.classList.add("oculto");
            alert("✅ Producto guardado");

        } catch (error) {
            console.error(error);
            alert("❌ Error al guardar");
        } finally {
            btnGuardar.disabled = false;
            btnGuardar.textContent = "Guardar Producto";
        }
    });
}

// --- EVENTO: ELIMINAR (Delegación) ---
listaDiv.addEventListener("click", async (e) => {
    // Buscamos si el clic fue en un botón eliminar (o en su ícono)
    const btn = e.target.closest(".btn-eliminar-card");
    
    if (btn) {
        const { id, nombre } = btn.dataset; // Extraemos datos del botón
        
        if (confirm(`¿Estás seguro de eliminar: ${nombre}?`)) {
            try {
                await eliminarProducto(id); // Llamamos al servicio
                // No hace falta alert, se borra solo de la vista
            } catch (error) {
                console.error(error);
                alert("Error al intentar borrar.");
            }
        }
    }
});

// --- EVENTOS: FILTROS ---
inputBuscador?.addEventListener("keyup", renderizarLista);
selectOrden?.addEventListener("change", renderizarLista);

// --- EVENTOS: MENÚ FLOTANTE ---
btnFabPrincipal?.addEventListener("click", () => {
    menuOpciones.classList.toggle("mostrar");
    btnFabPrincipal.classList.toggle("abierto");
});

// Botón Agregar del menú
btnOpcionAgregar?.addEventListener("click", () => {
    modal.classList.remove("oculto");
    cerrarMenuFab();
});

// Botón Borrar (Toggle Modo)
btnOpcionBorrar?.addEventListener("click", () => {
    modoBorrarActivo = !modoBorrarActivo; // Cambiar true/false

    if (modoBorrarActivo) {
        document.body.classList.add("modo-borrar");
        alert("🔴 MODO BORRAR ACTIVADO");
    } else {
        document.body.classList.remove("modo-borrar");
        alert("⚪ Modo borrar desactivado");
    }

    renderizarLista(); // Repintar para mostrar/ocultar botones rojos
    cerrarMenuFab();
});

function cerrarMenuFab() {
    menuOpciones.classList.remove("mostrar");
    btnFabPrincipal.classList.remove("abierto");
}

// --- EVENTOS: MODAL ---
const btnCerrarModal = document.getElementById("btn-cerrar-modal");
btnCerrarModal?.addEventListener("click", () => modal.classList.add("oculto"));
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("oculto");
});