//Responsabilidad: Manejar la lógica del formulario (abrir, cerrar, validar, guardar)

import { CATEGORIAS, UNIDADES } from "../utils/constantes.js";

const modal = document.getElementById("modal-agregar");
const form = {
    nombre: document.getElementById("input-nombre"),
    precio: document.getElementById("input-precio"),
    categoria: document.getElementById("input-categoria"),
    marca: document.getElementById("input-marca"),
    presentacion: document.getElementById("input-presentacion"), // Input de texto con datalist
    datalist: document.getElementById("lista-medidas") // El datalist del HTML
};
const btnGuardar = document.getElementById("btn-guardar");
const tituloModal = document.querySelector("#modal-agregar h3");

// Llenar los Selects/Datalist dinámicamente al cargar
function inicializarFormulario() {
    // 1. Llenar Categorías
    form.categoria.innerHTML = '<option value="">Selecciona...</option>';
    CATEGORIAS.forEach(cat => {
        form.categoria.innerHTML += `<option value="${cat}">${cat}</option>`;
    });

    // 2. Llenar Unidades (Datalist)
    form.datalist.innerHTML = "";
    UNIDADES.forEach(uni => {
        form.datalist.innerHTML += `<option value="${uni}">`;
    });
}

export function abrirModal(producto = null) {
    modal.classList.remove("oculto");

    if (producto) {
        // MODO EDICIÓN
        tituloModal.textContent = "✏️ Editar Producto";
        btnGuardar.textContent = "Actualizar";

        form.nombre.value = producto.nombre;
        form.precio.value = producto.precio;
        form.categoria.value = producto.categoria || "";
        form.marca.value = producto.marca || "";
        form.presentacion.value = producto.presentacion || "";
    } else {
        // MODO CREAR
        tituloModal.textContent = "✨ Nuevo Producto";
        btnGuardar.textContent = "Guardar";
        limpiarFormulario();
    }
}

export function cerrarModal() {
    modal.classList.add("oculto");
    limpiarFormulario();
}

function limpiarFormulario() {
    form.nombre.value = "";
    form.precio.value = "";
    form.categoria.value = "";
    form.marca.value = "";
    form.presentacion.value = "";
}

export function obtenerDatosFormulario() {
    return {
        nombre: form.nombre.value.trim(),
        precio: Number(form.precio.value),
        categoria: form.categoria.value,
        marca: form.marca.value.trim(),
        presentacion: form.presentacion.value.trim()
    };
}

// Inicializamos los selects apenas se importe el archivo
inicializarFormulario();

// Eventos de cierre
document.getElementById("btn-cerrar-modal")?.addEventListener("click", cerrarModal);