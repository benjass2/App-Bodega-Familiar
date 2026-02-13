# 🛒 Mi Tiendita - App de Gestión de Bodega

Aplicación web profesional y modular para la gestión de productos y ventas en tiempo real, conectada a **Firebase Firestore**.

## 📁 Estructura del Proyecto

```text
app/
├── css/                    #  Estilos Organizados
│   ├── base.css            # Variables y reset global
│   ├── cards.css           # Diseño de tarjetas de productos
│   ├── forms.css           # Estilos de formularios e inputs
│   ├── buttons.css         # Comportamiento de botones (CRUD y cobrar)
│   ├── fab.css             # Botón flotante y sus opciones
│   ├── modal.css           # Capa visual de ventanas emergentes
│   └── carrito.css         # Panel lateral y contador de ventas
│
├── js/                     #  Lógica Modular
│   ├── app.js              # DIRECTOR: Único punto de entrada (Orquestador)
│   ├── estado.js           # Single Source of Truth: Maneja el estado global
│   ├── carrito.js          # Lógica completa de ventas y cálculo de totales
│   ├── firebase.js         # Configuración y conexión a la base de datos
│   ├── services/
│   │   └── productos.js    # Consultas a Firestore (CRUD)
│   ├── ui/
│   │   ├── tarjetas.js     # Generador de HTML dinámico
│   │   ├── modalProducto.js# Control del formulario de edición/creación
│   │   ├── menuAcciones.js # Manejador del menú flotante
│   │   └── filtros.js      # Lógica de búsqueda y ordenado
│   └── utils/
│       └── constantes.js   # Listas de categorías y unidades
│
└── index.html              #  Estructura Base (Sin JS intrusivo)
```

##  Documentación Técnica

### 1. Gestión del Estado (`estado.js`)
Hemos implementado un sistema de "Estado Central" que guarda la lista de productos y los modos activos (Edición/Borrado). Esto garantiza que todos los componentes vean la misma información al mismo tiempo.

### 2. Punto de Entrada Único (`app.js`)
Para evitar inestabilidad, **`app.js` es el único script cargado en el HTML**. Él se encarga de importar los demás módulos e inicializar los escuchadores de eventos.

### 3. Lógica del Carrito (`carrito.js`)
El carrito detecta automáticamente los clics en las tarjetas de productos.
- **`inicializarCarrito()`**: Configura los botones de abrir/cerrar y finalizar venta sin usar `onclick` en el HTML.
- **Cálculo Real**: Suma precios unitarios, calcula subtotales por cantidad y actualiza el total general al instante.

### 4. Interfaz Modular
Cada elemento de la interfaz (Modales, Filtros, Menú FAB) tiene su propio archivo CSS y JS. Esto significa que si necesitas cambiar el diseño del buscador, solo tienes que ir a `filtros.js` y `forms.css`, sin miedo a romper el carrito.

##  Características
- **CRUD en Tiempo Real**: Sincronización inmediata con la base de datos.
- **Zero Inline JS**: El HTML está limpio de atributos `onclick`, todo se maneja desde el DOM.
- **Diseño Premium**: Uso de variables CSS para consistencia visual y animaciones suaves.
- **Buscador Reactivo**: Filtra mientras escribes, optimizando la experiencia de usuario.

