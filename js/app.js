// 1. Importamos funciones de lógica
import { addDoc, onSnapshot, query, orderBy } 
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// 2. IMPORTAMOS la conexión (Asegúrate que el archivo se llame firebase-config.js o firebase.js según lo tengas)
import { productosRef } from "./firebase.js"; 

console.log("¡Lógica cargada!");

// 3. ESTADO GLOBAL (Memoria del navegador)
let productosGlobales = []; // Aquí se guarda la copia de los datos

// ==========================================
// A. LEER DATOS Y GUARDAR EN MEMORIA
// ==========================================
// Traemos los datos "crudos" de la base de datos
const q = query(productosRef); 

onSnapshot(q, (snapshot) => {
    productosGlobales = []; // Limpiamos la lista anterior para no duplicar

    snapshot.forEach((doc) => {
        // Guardamos cada producto en nuestro array global
        productosGlobales.push({
            id: doc.id,
            ...doc.data() // Copia nombre, precio, categoria
        });
    });

    // Una vez que tenemos los datos, llamamos a la función que los ordena y pinta
    renderizarLista();
});

// ==========================================
// B. FUNCIÓN MAESTRA: ORDENAR Y PINTAR
// ==========================================
function renderizarLista() {
    const listaDiv = document.getElementById("lista-productos");
    // Obtenemos el valor del select de orden (si no existe, asumimos menor-precio)
    const filtroOrden = document.getElementById("filtro-orden") ? document.getElementById("filtro-orden").value : "menor-precio";
    const textoBusqueda = document.getElementById("buscador").value.toLowerCase();

    listaDiv.innerHTML = ""; // Limpiar pantalla antes de pintar

    // 1. FILTRAR (Buscador)
    let listaFiltrada = productosGlobales.filter(producto => {
        return producto.nombre.toLowerCase().includes(textoBusqueda);
    });

    // 2. ORDENAR (Lógica nueva)
    listaFiltrada.sort((a, b) => {
        if (filtroOrden === "mayor-precio") {
            return b.precio - a.precio; // De Mayor a Menor
        } else {
            return a.precio - b.precio; // De Menor a Mayor (Default)
        }
    });

    // 3. PINTAR EN HTML
    if (listaFiltrada.length === 0) {
        listaDiv.innerHTML = "<p style='text-align:center'>No se encontraron productos.</p>";
        return;
    }

    listaFiltrada.forEach(data => {
        const cardHTML = `
            <div class="producto-card">
                <div class="info-prod">
                    <span class="nombre">${data.nombre}</span>
                    <span class="categoria">${data.categoria || 'General'}</span>
                </div>
                <span class="precio">S/ ${parseFloat(data.precio).toFixed(2)}</span>
            </div>
        `;
        listaDiv.innerHTML += cardHTML;
    });
}

// ==========================================
// C. EVENTOS (Escuchar cambios)
// ==========================================

// Cuando escriben en el buscador -> Repintar
const inputBuscador = document.getElementById("buscador");
if(inputBuscador){
    inputBuscador.addEventListener("keyup", () => {
        renderizarLista();
    });
}

// Cuando cambian el orden (Select) -> Repintar
const selectOrden = document.getElementById("filtro-orden");
if(selectOrden){
    selectOrden.addEventListener("change", () => {
        renderizarLista();
    });
}

// ==========================================
// D. LÓGICA DE LA VENTANA MODAL
// ==========================================
const modal = document.getElementById("modal-agregar");
const btnAbrirModal = document.getElementById("btn-abrir-modal");
const btnCerrarModal = document.getElementById("btn-cerrar-modal");

if(btnAbrirModal) btnAbrirModal.addEventListener("click", () => modal.classList.remove("oculto"));
if(btnCerrarModal) btnCerrarModal.addEventListener("click", () => modal.classList.add("oculto"));
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("oculto");
});

// ==========================================
// E. GUARDAR NUEVO PRODUCTO
// ==========================================
const btnGuardar = document.getElementById("btn-guardar");

if(btnGuardar){
    btnGuardar.addEventListener("click", async () => {
        const nombre = document.getElementById("input-nombre").value;
        const precio = document.getElementById("input-precio").value;
        const categoria = document.getElementById("input-categoria").value;

        if (nombre === "" || precio === "") {
            alert("Falta nombre o precio");
            return;
        }

        try {
            btnGuardar.textContent = "Guardando...";
            btnGuardar.disabled = true;

            await addDoc(productosRef, {
                nombre: nombre,
                precio: Number(precio),
                categoria: categoria,
                fecha: new Date()
            });
            
            document.getElementById("input-nombre").value = "";
            document.getElementById("input-precio").value = "";
            document.getElementById("input-categoria").value = "";
            
            alert("Guardado");
            modal.classList.add("oculto"); 

        } catch (e) {
            console.error(e);
            alert("Error al guardar");
        } finally {
            btnGuardar.textContent = "Guardar Producto";
            btnGuardar.disabled = false;
        }
    });
}