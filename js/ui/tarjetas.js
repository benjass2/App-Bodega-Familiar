export function crearTarjetaHTML(p, modoBorrar) {
    const precioSeguro = Number(p.precio) || 0;
    
    // Preparamos los textos (si no existen, no mostramos nada)
    const textoMarca = p.marca ? `<span class="badge marca">🏭 ${p.marca}</span>` : "";
    const textoMedida = p.presentacion ? `<span class="badge medida">⚖️ ${p.presentacion}</span>` : "";

    let contenidoDerecha;

    if (modoBorrar) {
        contenidoDerecha = `
            <button class="btn-eliminar-card" data-id="${p.id}" data-nombre="${p.nombre}">
                ELIMINAR
            </button>`;
    } else {
        // NOTA: Aquí guardamos los datos nuevos en el dataset para poder editarlos luego
        contenidoDerecha = `
            <div class="acciones-card">
                <span class="precio">S/ ${precioSeguro.toFixed(2)}</span>
                <button class="btn-editar-card" 
                        data-id="${p.id}" 
                        data-nombre="${p.nombre}" 
                        data-precio="${p.precio}" 
                        data-categoria="${p.categoria}"
                        data-marca="${p.marca || ''}" 
                        data-presentacion="${p.presentacion || ''}">
                    ✏️
                </button>
            </div>`;
    }
  
    return `
      <div class="producto-card">
        <div class="info-prod">
          <span class="nombre">${p.nombre}</span>
          
          <div class="detalles-extra">
             ${textoMarca}
             ${textoMedida}
          </div>

          <span class="categoria">${p.categoria || "General"}</span>
        </div>
        ${contenidoDerecha}
      </div>
    `;
}