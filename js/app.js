
// Traemos la lógica de DB desde la carpeta services
import { 
    escucharProductos, 
    guardarProducto, 
    eliminarProducto,
    actualizarProducto,
} from "./services/productos.js";

// Traemos el diseño HTML desde la carpeta ui
import { crearTarjetaHTML } from "./ui/tarjetas.js";

console.log("¡Sistema Modular Cargado Exitosamente!");

//Variables globales
let productosGlobales = []; // Aquí guardaremos la copia de los datos
let modoBorrarActivo = false; // Interruptor del modo borrar
let idEditando = null; // Para saber si estamos editando o creando


//Referencia del DOM
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


//Logica principal de la app

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

    // 3. Generar HTML 
    // Creamos un solo string gigante con map y join
    const htmlFinal = productosProcesados
        .map(producto => crearTarjetaHTML(producto, modoBorrarActivo))
        .join("");

    // 4. Inyectar al DOM 
    listaDiv.innerHTML = htmlFinal;
}

//Filtrar y ordenar
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


//Manejo de eventos

// --- EVENTO: GUARDAR PRODUCTO ---
if (btnGuardar) {
    btnGuardar.addEventListener("click", async () => {
        const nombre = document.getElementById("input-nombre").value.trim();
        const precio = document.getElementById("input-precio").value;
        const categoria = document.getElementById("input-categoria").value.trim();
        const marca = document.getElementById("input-marca").value.trim();
        const presentacion =document.getElementById("input-presentacion").value.trim();

        if (!nombre || !precio) {
            alert("⚠️ Falta completar nombre o precio");
            return;
        }

        const datosProducto={
            nombre, 
            precio: Number(precio), 
            categoria, 
            marca,         
            presentacion   
        }

        try{
            btnGuardar.disabled = true;

            if(idEditando){
                //Modo edicion
                btnGuardar.textContent = "Actualizando...";
                await actualizarProducto(idEditando, datosProducto);
                alert("✨ Producto actualizado");
            }
            else{
                //Modo creacion
                btnGuardar.textContent = "Guardando...";
                await guardarProducto(datosProducto);
                alert("✅ Producto creado");
            }
            //Cerrar modal y resetear formulario
            cerrarYLimpiarModal();
        }
        catch(error){
            console.error(error);
            alert(" Error al guardar el producto");
        }
        finally{
            btnGuardar.disabled = false;
        }
     
   
    });
}

// --- EVENTO: ELIMINAR  ---
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
      
    } else {
        document.body.classList.remove("modo-borrar");
     
    }

    renderizarLista(); // Repintar para mostrar/ocultar botones rojos
    cerrarMenuFab();
});

//Evento: Detectar clic en el lapiz
listaDiv.addEventListener("click", (e) => {
    const btnEditar = e.target.closest(".btn-editar-card");
    
    if (btnEditar) {
        // 1. Recuperamos los datos que escondimos en el botón HTML
        const { id, nombre, precio, categoria,marca,presentacion } = btnEditar.dataset;

        // 2. Llenamos el formulario con esos datos
        document.getElementById("input-nombre").value = nombre;
        document.getElementById("input-precio").value = precio;
        document.getElementById("input-categoria").value = categoria || "";
        document.getElementById("input-marca").value = marca || "";
        document.getElementById("input-presentacion").value = presentacion || "";

        // 3. Cambiamos el estado a "Modo Edición"
        idEditando = id;
        document.querySelector("#modal-agregar h3").textContent = "✏️ Editar Producto"; // Cambiar título
        btnGuardar.textContent = "Actualizar";
        
        // 4. Abrimos el modal
        modal.classList.remove("oculto");
    }
});

// --- EVENTOS: MODAL ---
const btnCerrarModal = document.getElementById("btn-cerrar-modal");
btnCerrarModal?.addEventListener("click", () => modal.classList.add("oculto"));
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("oculto");
});

function cerrarMenuFab() {
    menuOpciones.classList.remove("mostrar");
    btnFabPrincipal.classList.remove("abierto");
}


function cerrarYLimpiarModal() {
    document.getElementById("input-nombre").value = "";
    document.getElementById("input-precio").value = "";
    document.getElementById("input-categoria").value = "";
    document.getElementById("input-marca").value = "";
    document.getElementById("input-presentacion").value = "";
    
    // Resetear estado
    idEditando = null; 
    btnGuardar.textContent = "Guardar Producto";
    document.querySelector("#modal-agregar h3").textContent = "✨ Nuevo Producto"; // Volver título original
    
    modal.classList.add("oculto");
}

// Actualiza tu botón de cerrar modal para usar esta función
document.getElementById("btn-cerrar-modal")?.addEventListener("click", cerrarYLimpiarModal);




