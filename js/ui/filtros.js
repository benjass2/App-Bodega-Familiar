// Recibe la lista cruda y devolverla filtrada y ordenada
import { getProductos } from "../estado.js";

const inputBuscador = document.getElementById("buscador");
const selectOrden = document.getElementById("filtro-orden");

// Esta función es la que usará app.js para pedir la lista lista para pintar
export function obtenerProductosProcesados() {
    const productos = getProductos(); // Traemos del estado
    const texto = inputBuscador.value.toLowerCase();
    const orden = selectOrden.value;

    // 1. Filtrar por nombre
    let resultado = productos.filter(p =>
        (p.nombre || "").toLowerCase().includes(texto)
    );

    // 2. Ordenar por precio
    resultado.sort((a, b) => {
        const precioA = Number(a.precio) || 0;
        const precioB = Number(b.precio) || 0;
        return orden === "mayor-precio" ? precioB - precioA : precioA - precioB;
    });

    return resultado;
}

// Configurar los eventos (para que app.js solo llame a una función)
export function configurarFiltros(callbackRenderizar) {
    inputBuscador.addEventListener("keyup", callbackRenderizar);
    selectOrden.addEventListener("change", callbackRenderizar);
}