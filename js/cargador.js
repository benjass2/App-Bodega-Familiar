import { db } from "./firebase.js";
// 2. IMPORTAMOS LAS HERRAMIENTAS PARA AGREGAR
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const listaProductos = [
   
]



async function inyectarDatos() {
    console.log("🚀 Iniciando inyección de datos...");

    // Aquí es donde necesitábamos 'db', ahora ya la tenemos gracias al import de arriba
    const coleccionRef = collection(db, "productos");
    let contador = 0;

    for (const producto of listaProductos) {
        try {
            const datosLimpios = {
                ...producto,
                precio: Number(producto.precio),
                fechaCreacion: new Date()
            };

            await addDoc(coleccionRef, datosLimpios);
            contador++;
            console.log(`✅ (${contador}/${listaProductos.length}) Subido: ${producto.nombre}`);
        } catch (error) {
            console.error(`❌ Error con ${producto.nombre}:`, error);
        }
    }

    console.log("🏁 ¡CARGA TERMINADA!");
    alert("¡Productos cargados! Borra el cargador.js del HTML.");
}

//inyectarDatos();