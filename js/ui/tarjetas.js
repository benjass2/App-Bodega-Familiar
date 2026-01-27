export function crearTarjetaHTML(p,modoBorrar){
  const precioSeguro = Number(p.precio) || 0;

  let contenidoDerecha;
  if(modoBorrar){
    //Si estamos borrando , mostramos el boton eliminar en las tarjetas 
    contenidoDerecha = `
            <button class="btn-eliminar-card" data-id="${p.id}" data-nombre="${p.nombre}">
                ELIMINAR
            </button>`;
  }
  else{
    //Si no , mostramos el precio y boton editar 
    contenidoDerecha = `
            <div class="acciones-card">
                <span class="precio">S/ ${precioSeguro.toFixed(2)}</span>
                <button class="btn-editar-card" 
                        data-id="${p.id}" 
                        data-nombre="${p.nombre}" 
                        data-precio="${p.precio}" 
                        data-categoria="${p.categoria}">
                    ✏️
                </button>
            </div>`;

  }
  
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
