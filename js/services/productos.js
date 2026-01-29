import {
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";


import { productosRef, db } from "../firebase.js";

//1.Guardar
export async function guardarProducto(datos){

    if(!datos.nombre || !datos.categoria || !datos.precio){
        alert("Faltan datos obligatorios");
        return;
    }
    return await addDoc(productosRef, {
        ...datos,
        fecha: new Date()
    });
}

//2.Eliminar
export async function eliminarProducto(id){
    return await deleteDoc(doc(db,"productos",id));
}


//3.Cambios
export function escucharProductos(callback) {
    const q = query(productosRef, orderBy("fecha", "desc"));

    return onSnapshot(q, (snapshot) => {
        const productos = [];
        snapshot.forEach((doc) => {
            productos.push({
                id: doc.id,
                ...doc.data()
            });
        });

        callback(productos);
    });
}

//4.Actualizar
export async function actualizarProducto(id, datosActualizados){
     const referencia = doc(db,"productos",id);
    return await updateDoc(referencia, datosActualizados);
}


