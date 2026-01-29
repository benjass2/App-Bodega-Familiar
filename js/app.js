// ==========================================
// 1. IMPORTACIONES (MODULARIZACIÓN)
// ==========================================
import { 
    escucharProductos, 
    guardarProducto, 
    eliminarProducto,
    actualizarProducto,
} from "./services/productos.js";

import { crearTarjetaHTML } from "./ui/tarjetas.js";

console.log("¡Sistema Modular Cargado Exitosamente!");

// ==========================================
// 2. ESTADO GLOBAL
// ==========================================
let productosGlobales = [];   // Copia local de los datos
let modoBorrarActivo = false; // Estado borrar
let modoEditarActivo = false; // Estado editar (NUEVO)
let idEditando = null;        // ID del producto que se está editando

// ==========================================
// 3. REFERENCIAS DEL DOM
// ==========================================
const listaDiv = document.getElementById("lista-productos");
const modal = document.getElementById("modal-agregar");
const btnGuardar = document.getElementById("btn-guardar");

// Menú Flotante
const btnFabPrincipal = document.getElementById("btn-fab-principal");
const menuOpciones = document.getElementById("fab-menu");
const btnOpcionAgregar = document.getElementById("btn-opcion-agregar");
const btnOpcionBorrar = document.getElementById("btn-opcion-borrar");
const btnOpcionEditar = document.getElementById("btn-opcion-editar"); // El botón azul

// Filtros
const inputBuscador = document.getElementById("buscador");
const selectOrden = document.getElementById("filtro-orden");


// ==========================================
// 4. LÓGICA PRINCIPAL (CONTROLADOR)
// ==========================================

// A. ESCUCHAR CAMBIOS (Firebase -> App)
escucharProductos((nuevosProductos) => {
    productosGlobales = nuevosProductos; 
    renderizarLista(); 
});

// B. RENDERIZAR LISTA
function renderizarLista() {
    listaDiv.innerHTML = "";
    
    // 1. Procesar
    const productosProcesados = procesarDatos(productosGlobales);

    // 2. Validar vacío
    if (productosProcesados.length === 0) {
        listaDiv.innerHTML = "<p style='text-align:center; color:#777; margin-top:20px;'>No se encontraron productos.</p>";
        return;
    }

    // 3. Generar HTML (Pasamos modoBorrar para que tarjetas.js sepa qué pintar)
    const htmlFinal = productosProcesados
        .map(producto => crearTarjetaHTML(producto, modoBorrarActivo))
        .join("");

    // 4. Inyectar
    listaDiv.innerHTML = htmlFinal;
}

// C. FILTROS Y ORDEN
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
// 5. MANEJO DE EVENTOS
// ==========================================

// --- A. GUARDAR / ACTUALIZAR ---
if (btnGuardar) {
    btnGuardar.addEventListener("click", async () => {
        // 1. Capturar datos
        const nombre = document.getElementById("input-nombre").value.trim();
        const precio = document.getElementById("input-precio").value;
        const categoria = document.getElementById("input-categoria").value.trim();
        const marca = document.getElementById("input-marca").value.trim();
        const presentacion = document.getElementById("input-presentacion").value.trim();
    

        // 2. Validar básicos
        if (!nombre || !precio) {
            alert("⚠️ Falta completar nombre o precio");
            return;
        }

        // 3. Crear objeto
        const datosProducto = {
            nombre, 
            precio: Number(precio), 
            categoria, 
            marca,         
            presentacion,
           
        };

        try {
            btnGuardar.disabled = true;

            if (idEditando) {
                // MODO EDICIÓN
                btnGuardar.textContent = "Actualizando...";
                await actualizarProducto(idEditando, datosProducto);
                alert("✨ Producto actualizado");
            } else {
                // MODO CREACIÓN
                btnGuardar.textContent = "Guardando...";
                await guardarProducto(datosProducto);
                alert("✅ Producto creado");
            }
            
            cerrarYLimpiarModal();

        } catch (error) {
            console.error(error);
            alert("❌ Error al guardar");
        } finally {
            btnGuardar.disabled = false;
        }
    });
}

// --- B. CLICKS EN LA LISTA (Borrar o Editar) ---
listaDiv.addEventListener("click", async (e) => {
    
    // CASO 1: MODO BORRAR (Click en botón rojo 'ELIMINAR')
    const btnEliminar = e.target.closest(".btn-eliminar-card");
    
    if (btnEliminar) {
        const { id, nombre } = btnEliminar.dataset;
        if (confirm(`¿Estás seguro de eliminar: ${nombre}?`)) {
            try {
                await eliminarProducto(id);
            } catch (error) {
                console.error(error);
                alert("Error al intentar borrar.");
            }
        }
        return; // Terminamos aquí si borró
    }

    // CASO 2: MODO EDICIÓN (Click en la tarjeta entera)
    // Solo funciona si el modo editar está activo
    if (modoEditarActivo) {
        const tarjeta = e.target.closest(".producto-card");
        
        if (tarjeta) {
            // Recuperamos datos DIRECTAMENTE de la tarjeta
            const { id, nombre, precio, categoria, marca, presentacion, stock } = tarjeta.dataset;

            // Llenamos el formulario
            document.getElementById("input-nombre").value = nombre;
            document.getElementById("input-precio").value = precio;
            document.getElementById("input-categoria").value = categoria || "";
            document.getElementById("input-marca").value = marca || "";
            document.getElementById("input-presentacion").value = presentacion || "";

            // Preparamos el modal
            idEditando = id;
            document.querySelector("#modal-agregar h3").textContent = "✏️ Editar Producto";
            btnGuardar.textContent = "Actualizar";
            
            // Abrimos
            modal.classList.remove("oculto");
            
            // (Opcional) Desactivar modo edición al abrir
            // desactivarModoEdicion(); 
        }
    }
});

// --- C. FILTROS ---
inputBuscador?.addEventListener("keyup", renderizarLista);
selectOrden?.addEventListener("change", renderizarLista);

// --- D. MENÚ FLOTANTE ---
btnFabPrincipal?.addEventListener("click", () => {
    menuOpciones.classList.toggle("mostrar");
    btnFabPrincipal.classList.toggle("abierto");
});

// 1. Botón + (Agregar)
btnOpcionAgregar?.addEventListener("click", () => {
    modal.classList.remove("oculto");
    cerrarMenuFab();
    // Aseguramos que no estamos editando nada viejo
    if (idEditando) cerrarYLimpiarModal();
});

// 2. Botón ✏️ (Modo Editar)
btnOpcionEditar?.addEventListener("click", () => {
    // Si estaba borrando, apagarlo
    if (modoBorrarActivo) desactivarModoBorrar();

    modoEditarActivo = !modoEditarActivo;

    if (modoEditarActivo) {
        document.body.classList.add("modo-editar");
        alert("MODO EDICIÓN ACTIVADO: Toca una tarjeta para editarla");
    } else {
        desactivarModoEdicion();
        alert("Modo edición desactivado");
    }
    cerrarMenuFab();
});

// 3. Botón 🗑️ (Modo Borrar)
btnOpcionBorrar?.addEventListener("click", () => {
    // Si estaba editando, apagarlo
    if (modoEditarActivo) desactivarModoEdicion();

    modoBorrarActivo = !modoBorrarActivo;

    if (modoBorrarActivo) {
        document.body.classList.add("modo-borrar");
    } else {
        desactivarModoBorrar();
    }

    renderizarLista();
    cerrarMenuFab();
});


// ==========================================
// 6. FUNCIONES AUXILIARES
// ==========================================

function cerrarMenuFab() {
    menuOpciones.classList.remove("mostrar");
    btnFabPrincipal.classList.remove("abierto");
}

function desactivarModoEdicion() {
    modoEditarActivo = false;
    document.body.classList.remove("modo-editar");
}

function desactivarModoBorrar() {
    modoBorrarActivo = false;
    document.body.classList.remove("modo-borrar");
    // Es necesario renderizar porque los botones rojos desaparecen
    renderizarLista();
}

function cerrarYLimpiarModal() {
    // Limpiar inputs
    document.getElementById("input-nombre").value = "";
    document.getElementById("input-precio").value = "";
    document.getElementById("input-categoria").value = "";
    document.getElementById("input-marca").value = "";
    document.getElementById("input-presentacion").value = "";
    
    // Resetear variables de estado
    idEditando = null; 
    btnGuardar.textContent = "Guardar Producto";
    document.querySelector("#modal-agregar h3").textContent = "✨ Nuevo Producto";
    
    // Cerrar
    modal.classList.add("oculto");
}

// Eventos de cierre del modal
document.getElementById("btn-cerrar-modal")?.addEventListener("click", cerrarYLimpiarModal);
window.addEventListener("click", (e) => {
    if (e.target === modal) cerrarYLimpiarModal();
});

