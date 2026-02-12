//Un solo lugar para guardar el estado global

// Estado interno (privado)
const estado = {
    productos: [],      // Lista de productos traída de Firebase
    modoBorrar: false,  // ¿Botón rojo activo?
    modoEditar: false,  // ¿Botón azul activo?
    idEditando: null    // ID del producto que se está editando
};

// --- GETTERS (Para que la UI lea los datos) ---
export const getProductos = () => estado.productos;
export const esModoBorrar = () => estado.modoBorrar;
export const esModoEditar = () => estado.modoEditar;
export const getIdEditando = () => estado.idEditando;

// --- SETTERS (Para modificar el estado) ---
export const setProductos = (nuevaLista) => {
    estado.productos = nuevaLista;
    // También actualizamos la variable global para el carrito (compatibilidad)
    window.productosGlobales = nuevaLista;
};

export const setModoBorrar = (activo) => {
    estado.modoBorrar = activo;
    if (activo) {
        estado.modoEditar = false; // No puedes editar y borrar a la vez
        estado.idEditando = null;
    }
};

export const setModoEditar = (activo) => {
    estado.modoEditar = activo;
    if (activo) {
        estado.modoBorrar = false; // No puedes borrar y editar a la vez
    } else {
        estado.idEditando = null;
    }
};

export const setIdEditando = (id) => {
    estado.idEditando = id;
};