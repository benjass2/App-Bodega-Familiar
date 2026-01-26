export function crearTarjetaHTML(p,modoBorrar){
  const precioSeguro = Number(p.precio) || 0;

    // Decidimos qué botón mostrar
    const contenidoDerecha = modoBorrar
      ? `<button class="btn-eliminar-card" data-id="${p.id}" data-nombre="${p.nombre}">
           ELIMINAR
         </button>`
      : `<span class="precio">S/ ${precioSeguro.toFixed(2)}</span>`;

    return `
      <div class="producto-card">
        <div class="info-prod">
          <span class="nombre">${p.nombre}</span>
          <span class="categoria">${p.categoria || "General"}</span>
        </div>
        ${contenidoDerecha}
      </div>
    `;
}