// ==========================================
// 1. IMPORTACIONES (Firebase moderno)
// ==========================================
import {
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { productosRef, db } from "./firebase.js";

console.log("✅ app.js cargado correctamente");

// ==========================================
// 2. ESTADO GLOBAL
// ==========================================
let productosGlobales = [];
let modoBorrarActivo = false;

// ==========================================
// 3. REFERENCIAS DOM
// ==========================================
const btnFabPrincipal = document.getElementById("btn-fab-principal");
const menuOpciones = document.getElementById("fab-menu");
const btnOpcionAgregar = document.getElementById("btn-opcion-agregar");
const btnOpcionBorrar = document.getElementById("btn-opcion-borrar");
const modal = document.getElementById("modal-agregar");
const listaDiv = document.getElementById("lista-productos");

// ==========================================
// 4. MENÚ FLOTANTE
// ==========================================
btnFabPrincipal?.addEventListener("click", () => {
  menuOpciones.classList.toggle("mostrar");
  btnFabPrincipal.classList.toggle("abierto");
});

btnOpcionAgregar?.addEventListener("click", () => {
  modal.classList.remove("oculto");
  cerrarMenuFab();
});

btnOpcionBorrar?.addEventListener("click", () => {
  modoBorrarActivo = !modoBorrarActivo;

  if (modoBorrarActivo) {
    alert("🔴 MODO BORRAR ACTIVADO");
    document.body.classList.add("modo-borrar");
  } else {
    alert("⚪ Modo borrar desactivado");
    document.body.classList.remove("modo-borrar");
  }

  renderizarLista();
  cerrarMenuFab();
});

function cerrarMenuFab() {
  menuOpciones.classList.remove("mostrar");
  btnFabPrincipal.classList.remove("abierto");
}

// ==========================================
// 5. MODAL
// ==========================================
const btnCerrarModal = document.getElementById("btn-cerrar-modal");

btnCerrarModal?.addEventListener("click", () => modal.classList.add("oculto"));
window.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("oculto");
});

// ==========================================
// 6. LEER FIRESTORE (SNAPSHOT)
// ==========================================
const q = query(productosRef, orderBy("fecha", "desc"));

onSnapshot(q, snapshot => {
  productosGlobales = [];

  snapshot.forEach(documento => {
    productosGlobales.push({
      id: documento.id,
      ...documento.data()
    });
  });

  renderizarLista();
});

// ==========================================
// 7. RENDERIZAR LISTA
// ==========================================
function renderizarLista() {
  const filtroOrden = document.getElementById("filtro-orden")?.value || "menor-precio";
  const textoBusqueda = document.getElementById("buscador")?.value.toLowerCase() || "";

  listaDiv.innerHTML = "";

  let listaFiltrada = productosGlobales.filter(p =>
    (p.nombre || "").toLowerCase().includes(textoBusqueda)
  );

  listaFiltrada.sort((a, b) => {
    const pa = Number(a.precio) || 0;
    const pb = Number(b.precio) || 0;
    return filtroOrden === "mayor-precio" ? pb - pa : pa - pb;
  });

  if (listaFiltrada.length === 0) {
    listaDiv.innerHTML = "<p style='text-align:center'>No hay productos.</p>";
    return;
  }

  listaFiltrada.forEach(p => {
    const precioSeguro = Number(p.precio) || 0;

    const derecha = modoBorrarActivo
      ? `<button class="btn-eliminar-card" data-id="${p.id}" data-nombre="${p.nombre}">
           ELIMINAR
         </button>`
      : `<span class="precio">S/ ${precioSeguro.toFixed(2)}</span>`;

    listaDiv.innerHTML += `
      <div class="producto-card">
        <div class="info-prod">
          <span class="nombre">${p.nombre}</span>
          <span class="categoria">${p.categoria || "General"}</span>
        </div>
        ${derecha}
      </div>
    `;
  });
}

// ==========================================
// 8. BUSCADOR Y ORDEN
// ==========================================
document.getElementById("buscador")?.addEventListener("keyup", renderizarLista);
document.getElementById("filtro-orden")?.addEventListener("change", renderizarLista);

// ==========================================
// 9. GUARDAR PRODUCTO
// ==========================================
const btnGuardar = document.getElementById("btn-guardar");

btnGuardar?.addEventListener("click", async () => {
  const nombre = document.getElementById("input-nombre").value.trim();
  const precio = document.getElementById("input-precio").value;
  const categoria = document.getElementById("input-categoria").value.trim();

  if (!nombre || !precio) {
    alert("Falta nombre o precio");
    return;
  }

  try {
    btnGuardar.disabled = true;
    btnGuardar.textContent = "Guardando...";

    await addDoc(productosRef, {
      nombre,
      precio: Number(precio),
      categoria,
      fecha: new Date()
    });

    document.getElementById("input-nombre").value = "";
    document.getElementById("input-precio").value = "";
    document.getElementById("input-categoria").value = "";

    modal.classList.add("oculto");
    alert("✅ Producto guardado");

  } catch (err) {
    console.error(err);
    alert("❌ Error al guardar");
  } finally {
    btnGuardar.disabled = false;
    btnGuardar.textContent = "Guardar Producto";
  }
});

// ==========================================
// 10. ELIMINAR PRODUCTO (Delegación)
// ==========================================
listaDiv?.addEventListener("click", async e => {
  const btn = e.target.closest(".btn-eliminar-card");
  if (!btn) return;

  const id = btn.dataset.id;
  const nombre = btn.dataset.nombre;

  if (confirm(`¿Eliminar ${nombre}?`)) {
    try {
      await deleteDoc(doc(db, "productos", id));
      alert("🗑️ Producto eliminado");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  }
});
