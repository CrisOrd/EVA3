import { addDoc, collection } from "firebase/firestore";
import { db } from "./Conexion";

export const registroPersona = async()=> {

    
// Add a new document with a generated id.
const docRef = await addDoc(collection(db, "cities"), {
  name: "Tokyo",
  country: "Japan"
});
console.log("Document written with ID: ", docRef.id);
}