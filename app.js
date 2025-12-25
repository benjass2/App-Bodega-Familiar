// ==========================================
// 1. IMPORTACIONES DE FIREBASE
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } 
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ==========================================
// 2. TU CONFIGURACIÓN (Tus credenciales reales)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyAZzUCyHF-P5T0fF5P2fbmWWfcTyWvpl-M",
  authDomain: "bodega-hogar.firebaseapp.com",
  projectId: "bodega-hogar",
  storageBucket: "bodega-hogar.firebasestorage.app",
  messagingSenderId: "916766238588",
  appId: "1:916766238588:web:82a46c12eb6b5c3d28e6f9",
  measurementId: "G-9Z04JEBWYW"
};

// ==========================================
// 3. INICIALIZAR LA APP
// ==========================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const productosRef = collection(db, "productos");

console.log("¡Sistema cargado correctamente!");

// ==========================================
// 4. LÓGICA DE LA VENTANA MODAL (Abrir/Cerrar)
// ==========================================
const modal = document.getElementById("modal-agregar");
const btnAbrirModal = document.getElementById("btn-abrir-modal");
const btnCerrarModal = document.getElementById("btn-cerrar-modal");

// Abrir la ventana al tocar el botón flotante (+)
if(btnAbrirModal) {
    btnAbrirModal.addEventListener("click", () => {
        modal.classList.remove("oculto");
    });
}

// Cerrar la ventana al tocar la "X"
if(btnCerrarModal) {
    btnCerrarModal.addEventListener("click", () => {
        modal.classList.add("oculto");
    });
}

// Cerrar si tocas el fondo oscuro (fuera de la cajita)
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("oculto");
    }
});

// ==========================================
// 5. LEER PRODUCTOS EN TIEMPO REAL
// ==========================================
const q = query(productosRef, orderBy("nombre"));

onSnapshot(q, (snapshot) => {
    const listaDiv = document.getElementById("lista-productos");
    listaDiv.innerHTML = ""; // Limpiamos la lista para no duplicar

    if (snapshot.empty) {
        listaDiv.innerHTML = "<p style='text-align:center'>No hay productos registrados.</p>";
        return;
    }

    snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Creamos el HTML de cada tarjeta
        const cardHTML = `
            <div class="producto-card" data-nombre="${data.nombre.toLowerCase()}">
                <div class="info-prod">
                    <span class="nombre">${data.nombre}</span>
                    <span class="categoria">${data.categoria || 'General'}</span>
                </div>
                <span class="precio">S/ ${parseFloat(data.precio).toFixed(2)}</span>
            </div>
        `;
        listaDiv.innerHTML += cardHTML;
    });
});

// ==========================================
// 6. GUARDAR NUEVO PRODUCTO
// ==========================================
const btnGuardar = document.getElementById("btn-guardar");

if(btnGuardar){
    btnGuardar.addEventListener("click", async () => {
        // Obtenemos los valores de los inputs
        const nombre = document.getElementById("input-nombre").value;
        const precio = document.getElementById("input-precio").value;
        const categoria = document.getElementById("input-categoria").value;

        // Validación simple
        if (nombre === "" || precio === "") {
            alert("⚠️ Por favor ingresa nombre y precio");
            return;
        }

        try {
            // Feedback visual (cambiar texto del botón)
            btnGuardar.textContent = "Guardando...";
            btnGuardar.disabled = true;

            // Guardar en Firebase
            await addDoc(productosRef, {
                nombre: nombre,
                precio: Number(precio),
                categoria: categoria,
                fecha: new Date()
            });
            
            // Limpiar los campos
            document.getElementById("input-nombre").value = "";
            document.getElementById("input-precio").value = "";
            document.getElementById("input-categoria").value = "";
            
            alert("✅ ¡Producto guardado con éxito!");

            // CERRAR EL MODAL AUTOMÁTICAMENTE
            modal.classList.add("oculto");

        } catch (e) {
            console.error("Error: ", e);
            alert("❌ Hubo un error al guardar: " + e.message);
        } finally {
            // Restaurar el botón a la normalidad
            btnGuardar.textContent = "Guardar Producto";
            btnGuardar.disabled = false;
        }
    });
}

// ==========================================
// 7. BUSCADOR (FILTRO LOCAL)
// ==========================================
const inputBuscador = document.getElementById("buscador");

if(inputBuscador){
    inputBuscador.addEventListener("keyup", (e) => {
        const texto = e.target.value.toLowerCase();
        const tarjetas = document.querySelectorAll(".producto-card");

        tarjetas.forEach(card => {
            const nombreProd = card.getAttribute("data-nombre");
            
            // Si el nombre incluye lo que escribiste, se muestra. Si no, se oculta.
            if (nombreProd.includes(texto)) {
                card.classList.remove("oculto");
            } else {
                card.classList.add("oculto");
            }
        });
    });
}

