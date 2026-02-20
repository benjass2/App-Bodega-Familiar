import { db } from "./js/firebase.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

async function eliminarDuplicados() {
    console.log("🧹 Iniciando el escaneo de productos repetidos...");

    const productosRef = collection(db, "productos");
    const snapshot = await getDocs(productosRef);

    // Aquí guardaremos los nombres que ya hemos revisado
    const nombresVistos = new Set();
    let contadorBorrados = 0;

    for (const documento of snapshot.docs) {
        const id = documento.id;
        const producto = documento.data();

        // Convertimos a minúsculas y quitamos espacios para evitar errores (ej: "Arroz" y "arroz ")
        const nombreNormalizado = producto.nombre.toLowerCase().trim();

        if (nombresVistos.has(nombreNormalizado)) {
            // 🚨 YA LO VIMOS ANTES -> ¡ES UN DUPLICADO! Lo borramos de Firebase
            await deleteDoc(doc(db, "productos", id));
            console.log(`🗑️ Eliminado duplicado: ${producto.nombre}`);
            contadorBorrados++;
        } else {
            // ✅ ES NUEVO -> Lo registramos en nuestra memoria y lo dejamos vivir
            nombresVistos.add(nombreNormalizado);
        }
    }

    console.log(`✨ ¡Limpieza terminada! Se eliminaron ${contadorBorrados} productos repetidos.`);
    alert(`Limpieza completa. Se borraron ${contadorBorrados} repetidos. Revisa la consola.`);
}

// Ejecutar la función
//eliminarDuplicados();