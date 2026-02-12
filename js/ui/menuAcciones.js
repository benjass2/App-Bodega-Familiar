//Responsabilidad: Manejar la lógica del formulario (abrir, cerrar, validar, guardar)

import {
    setModoBorrar,
    setModoEditar,
    esModoBorrar,
    esModoEditar
} from "../estado.js";
import { abrirModal } from "./modalProducto.js";

const menu = document.getElementById("fab-menu");
const btnPrincipal = document.getElementById("btn-fab-principal");

export function configurarMenuAcciones(callbackRenderizar) {

    // Abrir/Cerrar menú
    btnPrincipal.addEventListener("click", () => {
        menu.classList.toggle("mostrar");
        btnPrincipal.classList.toggle("abierto");
    });

    // 1. Agregar (Abre Modal)
    document.getElementById("btn-opcion-agregar").addEventListener("click", () => {
        cerrarMenu();
        abrirModal(); // Abre vacío
    });

    // 2. Editar (Toggle Estado)
    document.getElementById("btn-opcion-editar").addEventListener("click", () => {
        const nuevoEstado = !esModoEditar();
        setModoEditar(nuevoEstado);

        if (nuevoEstado) alert("✏️ MODO EDICIÓN: Toca una tarjeta");

        cerrarMenu();
        callbackRenderizar(); // Repintar para mostrar/ocultar efectos visuales
    });

    // 3. Borrar (Toggle Estado)
    document.getElementById("btn-opcion-borrar").addEventListener("click", () => {
        const nuevoEstado = !esModoBorrar();
        setModoBorrar(nuevoEstado);

        if (nuevoEstado) document.body.classList.add("modo-borrar");
        else document.body.classList.remove("modo-borrar");

        cerrarMenu();
        callbackRenderizar(); // Repintar para mostrar botones rojos
    });
}

function cerrarMenu() {
    menu.classList.remove("mostrar");
    btnPrincipal.classList.remove("abierto");
}