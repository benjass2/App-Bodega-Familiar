import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const listaProductos = [


];

async function inyectarDatos() {
    console.log("🟡 Paso 1: Intentando conectar a Firebase...");

    try {
        const coleccionRef = collection(db, "productos");
        console.log("🟢 Paso 2: Conexión establecida. Iniciando bucle...");

        let contador = 0;
        for (const producto of listaProductos) {
            await addDoc(coleccionRef, {
                ...producto,
                precio: Number(producto.precio),
                fechaCreacion: new Date()
            });
            contador++;
            console.log(`✅ (${contador}/${listaProductos.length}) Subido: ${producto.nombre}`);
        }

        console.log("🏁 ¡CARGA COMPLETADA EXITOSAMENTE!");
        alert("¡Todo listo! Ya puedes borrar el cargador del HTML.");

    } catch (error) {
        console.error("🔴 ERROR CRÍTICO:");
        console.error(error.message);
        alert("Falló la carga. Revisa la consola para ver el error.");
    }
}

inyectarDatos();