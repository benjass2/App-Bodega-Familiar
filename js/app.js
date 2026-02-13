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







const listaProductos = [
    { "nombre": "Arroz Costeño Extra (Azul)", "precio": 5.80, "categoria": "Abarrotes", "marca": "Costeño", "presentacion": "Bolsa 750g" },
    { "nombre": "Arroz Costeño Graneadito (Verde)", "precio": 5.50, "categoria": "Abarrotes", "marca": "Costeño", "presentacion": "Bolsa 750g" },
    { "nombre": "Arroz Paisana Superior", "precio": 5.20, "categoria": "Abarrotes", "marca": "Paisana", "presentacion": "Bolsa 1kg" },
    { "nombre": "Arroz Faraón Naranja", "precio": 5.40, "categoria": "Abarrotes", "marca": "Faraon", "presentacion": "Bolsa 1kg" },
    { "nombre": "Arroz Suelto (A Granel)", "precio": 4.50, "categoria": "Abarrotes", "marca": "Generico", "presentacion": "1kg" },

    // --- AZÚCAR Y EDULCORANTES ---
    { "nombre": "Azúcar Rubia Dulfina", "precio": 4.80, "categoria": "Abarrotes", "marca": "Dulfina", "presentacion": "Bolsa 1kg" },
    { "nombre": "Azúcar Rubia Cartavio", "precio": 5.00, "categoria": "Abarrotes", "marca": "Cartavio", "presentacion": "Bolsa 1kg" },
    { "nombre": "Azúcar Blanca Paramonga", "precio": 5.50, "categoria": "Abarrotes", "marca": "Paramonga", "presentacion": "Bolsa 1kg" },
    { "nombre": "Azúcar Rubia Suelta (Granel)", "precio": 4.20, "categoria": "Abarrotes", "marca": "Generico", "presentacion": "1kg" },

    // --- ACEITES (Básico para cocinar) ---
    { "nombre": "Aceite Primor Premium", "precio": 12.50, "categoria": "Abarrotes", "marca": "Primor", "presentacion": "Botella 1 Litro" },
    { "nombre": "Aceite Primor Clásico", "precio": 11.00, "categoria": "Abarrotes", "marca": "Primor", "presentacion": "Botella 1 Litro" },
    { "nombre": "Aceite Cil", "precio": 9.50, "categoria": "Abarrotes", "marca": "Cil", "presentacion": "Botella 1 Litro" },
    { "nombre": "Aceite Sao", "precio": 9.00, "categoria": "Abarrotes", "marca": "Sao", "presentacion": "Botella 1 Litro" },
    { "nombre": "Aceite Primor Pequeño", "precio": 3.50, "categoria": "Abarrotes", "marca": "Primor", "presentacion": "Botella 200ml" },

    // --- FIDEOS Y HARINAS ---
    { "nombre": "Fideo Don Vittorio Spaguetti", "precio": 3.80, "categoria": "Abarrotes", "marca": "Don Vittorio", "presentacion": "Paquete 500g" },
    { "nombre": "Fideo Don Vittorio Spaguetti", "precio": 7.50, "categoria": "Abarrotes", "marca": "Don Vittorio", "presentacion": "Paquete 1kg" },
    { "nombre": "Fideo Anita Spaguetti (Económico)", "precio": 2.20, "categoria": "Abarrotes", "marca": "Anita", "presentacion": "Paquete 450g" },
    { "nombre": "Fideo Corto Codo/Canuto", "precio": 2.00, "categoria": "Abarrotes", "marca": "Molitalia", "presentacion": "Paquete 250g" },
    { "nombre": "Fideo Sopa Cabello de Ángel", "precio": 2.00, "categoria": "Abarrotes", "marca": "Don Vittorio", "presentacion": "Paquete 250g" },
    { "nombre": "Harina Blanca Flor (Preparada)", "precio": 6.50, "categoria": "Abarrotes", "marca": "Blanca Flor", "presentacion": "Bolsa 1kg" },

    // --- CONSERVAS (Atún) ---
    { "nombre": "Atún Florida Filete (Aceite)", "precio": 6.50, "categoria": "Abarrotes", "marca": "Florida", "presentacion": "Lata 170g" },
    { "nombre": "Atún Real Trozos", "precio": 5.50, "categoria": "Abarrotes", "marca": "Real", "presentacion": "Lata 170g" },
    { "nombre": "Atún Fanny Trozos (Económico)", "precio": 4.50, "categoria": "Abarrotes", "marca": "Fanny", "presentacion": "Lata 170g" },
    { "nombre": "Grated de Sardina (Sopa)", "precio": 3.50, "categoria": "Abarrotes", "marca": "A-1", "presentacion": "Lata Ovalada" },

    // --- MENESTRAS (Bolsa) ---
    { "nombre": "Lentejas Costeño", "precio": 5.50, "categoria": "Abarrotes", "marca": "Costeño", "presentacion": "Bolsa 500g" },
    { "nombre": "Frejol Canario Costeño", "precio": 6.50, "categoria": "Abarrotes", "marca": "Costeño", "presentacion": "Bolsa 500g" },
    { "nombre": "Pop Corn (Maíz para canchita)", "precio": 4.00, "categoria": "Abarrotes", "marca": "Costeño", "presentacion": "Bolsa 500g" },

    // --- DESAYUNO ---
    { "nombre": "Avena Quaker Tradicional", "precio": 3.50, "categoria": "Abarrotes", "marca": "Quaker", "presentacion": "Bolsa 300g" },
    { "nombre": "Avena 3 Ositos", "precio": 2.50, "categoria": "Abarrotes", "marca": "3 Ositos", "presentacion": "Bolsa 140g" },
    { "nombre": "Café Altomayo Clásico", "precio": 14.00, "categoria": "Abarrotes", "marca": "Altomayo", "presentacion": "Frasco 180g" },
    { "nombre": "Café Kirma (Para pasar)", "precio": 1.50, "categoria": "Abarrotes", "marca": "Kirma", "presentacion": "Sobre Pequeño" },
    { "nombre": "Cocoa Winters", "precio": 1.50, "categoria": "Abarrotes", "marca": "Winters", "presentacion": "Sobre" },
    { "nombre": "Milo Activ-Go", "precio": 1.80, "categoria": "Abarrotes", "marca": "Milo", "presentacion": "Sobre" },
    { "nombre": "Té Filtrante Canela y Clavo", "precio": 3.50, "categoria": "Abarrotes", "marca": "McColin", "presentacion": "Caja 25u" },

    // --- CONDIMENTOS BÁSICOS ---
    { "nombre": "Sal Marina Emsal", "precio": 2.00, "categoria": "Abarrotes", "marca": "Emsal", "presentacion": "Bolsa 1kg" },
    { "nombre": "Ajinomoto", "precio": 0.50, "categoria": "Abarrotes", "marca": "Ajinomoto", "presentacion": "Sobre" },
    { "nombre": "Tuco Sibarita (Rojo)", "precio": 0.50, "categoria": "Abarrotes", "marca": "Sibarita", "presentacion": "Sobre" },
    { "nombre": "Palillo Sibarita (Amarillo)", "precio": 0.50, "categoria": "Abarrotes", "marca": "Sibarita", "presentacion": "Sobre" },
    { "nombre": "Mayonesa Alacena", "precio": 2.50, "categoria": "Abarrotes", "marca": "Alacena", "presentacion": "Doypack 100g" }
]


async function inyectarDatos() {

    const coleccionRef = collection(db, "productos");
    let contador = 0;

    for (const producto of listaProductos) {
        try {
            // Aseguramos que el precio sea número y no texto
            const datosLimpios = {
                ...producto,
                precio: Number(producto.precio), // Conversión de seguridad
                fechaCreacion: new Date() // Opcional: para saber cuándo lo subiste
            };

            await addDoc(coleccionRef, datosLimpios);
            contador++;
            console.log(`✅ (${contador}/${listaProductos.length}) Subido: ${producto.nombre}`);
        } catch (error) {
            console.error(`❌ Error con ${producto.nombre}:`, error);
        }
    }

    console.log("🏁 ¡CARGA TERMINADA! Ahora borra este archivo del HTML.");
    alert("Carga completa. Revisa la consola.");
}

inyectarDatos();
