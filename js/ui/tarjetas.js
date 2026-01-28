export function crearTarjetaHTML(p, modoBorrar) {
    const precioSeguro = Number(p.precio) || 0;

    // Badges (Etiquetas)
    const textoMarca = p.marca ? `<span class="badge marca">🏭 ${p.marca}</span>` : "";
    const textoMedida = p.presentacion ? `<span class="badge medida">⚖️ ${p.presentacion}</span>` : "";

    // Lógica derecha: O precio O botón eliminar
    const contenidoDerecha = modoBorrar
      ? `<button class="btn-eliminar-card" data-id="${p.id}" data-nombre="${p.nombre}">🗑️</button>`
      : `<span class="precio">S/ ${precioSeguro.toFixed(2)}</span>`;

    // Retornamos la tarjeta clásica
    // Guardamos los datos en el div principal para el "Modo Edición"
    return `
      <div class="producto-card" 
           data-id="${p.id}" 
           data-nombre="${p.nombre}" 
           data-precio="${p.precio}" 
           data-categoria="${p.categoria}"
           data-marca="${p.marca || ''}" 
           data-presentacion="${p.presentacion || ''}">
           
        <div class="info-prod">
          <span class="nombre">${p.nombre}</span>
          
          <div class="detalles-extra">
             ${textoMarca} ${textoMedida} 
          </div>

          <span class="categoria">${p.categoria || "General"}</span>
        </div>
        
        ${contenidoDerecha}
      </div>
    `;
}