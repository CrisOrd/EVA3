import { addDoc, collection } from "firebase/firestore";
import { db } from "./Conexion";

export const registroEvento = async (evento: {
  nombre: string;
  costo: number;
  tipo: string;
  descripcion: string;
  fecha: string;
}) => {
  const docRef = await addDoc(collection(db, "Eventos"), {
    nombreEvento: evento.nombre,
    costoEvento: evento.costo,
    tipoEvento: evento.tipo,
    descripcionEvento: evento.descripcion,
    fechaEvento: evento.fecha
  });
  console.log("Document written with ID: ", docRef.id);
};