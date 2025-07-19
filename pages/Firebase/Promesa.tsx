import { addDoc, collection, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./Conexion";

export const registroEvento = async (evento: {
  nombre: string;
  costo: number;
  tipo: string;
  descripcion: string;
  fecha: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, "Eventos"), {
      nombreEvento: evento.nombre,
      costoEvento: evento.costo,
      tipoEvento: evento.tipo,
      descripcionEvento: evento.descripcion,
      fechaEvento: evento.fecha,
      timestamp: serverTimestamp() 
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const actualizarEvento = async (id: string, evento: {
  nombre: string;
  costo: number;
  tipo: string;
  descripcion: string;
  fecha: string;
}) => {
  try {
    const docRef = doc(db, "Eventos", id);
    await updateDoc(docRef, {
      nombreEvento: evento.nombre,
      costoEvento: evento.costo,
      tipoEvento: evento.tipo,
      descripcionEvento: evento.descripcion,
      fechaEvento: evento.fecha,
      timestamp: serverTimestamp() 
    });
    console.log("Document updated with ID: ", id);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

export const eliminarEvento = async (id: string) => {
  try {
    await deleteDoc(doc(db, "Eventos", id));
    console.log("Document deleted with ID: ", id);
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};