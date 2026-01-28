export function crearTarjetaHTML(p, modoBorrar) {
    const precioSeguro = Number(p.precio) || 0;
    const stockSeguro = Number(p.stock) || 0;

    // Badges
    const textoMarca = p.marca ? `<span class="badge marca">🏭 ${p.marca}</span>` : "";
    const textoMedida = p.presentacion ? `<span class="badge medida">⚖️ ${p.presentacion}</span>` : "";
    
    let claseStock = "stock-bien";
    if (stockSeguro <= 5) claseStock = "stock-critico";
    else if (stockSeguro <= 10) claseStock = "stock-bajo";
    
    const textoStock = `<span class="badge ${claseStock}">📦 ${stockSeguro} un.</span>`;

    // Si es modo borrar, mostramos botón. Si no, NADA (espacio limpio)
    const contenidoDerecha = modoBorrar
      ? `<button class="btn-eliminar-card" data-id="${p.id}" data-nombre="${p.nombre}">ELIMINAR</button>`
      : `<span class="precio">S/ ${precioSeguro.toFixed(2)}</span>`;

    // AQUI ESTÁ EL TRUCO:
    // Guardamos TODOS los datos en el div principal "producto-card"
    return `
      <div class="producto-card" 
           data-id="${p.id}" 
           data-nombre="${p.nombre}" 
           data-precio="${p.precio}" 
           data-categoria="${p.categoria}"
           data-marca="${p.marca || ''}" 
           data-presentacion="${p.presentacion || ''}"
           data-stock="${stockSeguro}">
           
        <div class="info-prod">
          <span class="nombre">${p.nombre}</span>
          <div class="detalles-extra">
             ${textoMarca} ${textoMedida} ${textoStock}
          </div>
          <span class="categoria">${p.categoria || "General"}</span>
        </div>
        
        ${contenidoDerecha}
      </div>
    `;
}