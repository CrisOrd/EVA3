import React, { useEffect, useState } from 'react'
import { Evento } from './Interfaces/IEvento'
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "./Firebase/Conexion"

interface Props {
  saludo: string,
  traerEvento: (e: Evento) => void,
  eventos: Evento[],
  setEventos: (eventos: Evento[]) => void,
  editarEvento: (index: number) => void 
}
export const MostrarEventos = (props: Props) => {
  const [eventos, setEventos] = useState<Evento[]>([])

  useEffect(() => {
    const fetchEventos = async () => {
      const q = query(collection(db, "Eventos"), orderBy("timestamp"))
      const querySnapshot = await getDocs(q)
      const eventosFirebase: Evento[] = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          nombre: data.nombreEvento,
          costo: data.costoEvento,
          tipo: data.tipoEvento,
          descripcion: data.descripcionEvento,
          fecha: data.fechaEvento
        }
      })
      setEventos(eventosFirebase)
    }
    fetchEventos()
  }, [])
  const editarEvento = (index: number) => {
    props.editarEvento(index)
  }

  const eliminarEvento = (index: number) => {
    const eventoAEliminar = eventos[index];
    const confirmacion = confirm(`¿Estás seguro de que quieres eliminar el evento "${eventoAEliminar.nombre}"?`);
    
    if (confirmacion) {
      const nuevosEventos = eventos.filter((_, i) => i !== index)
      setEventos(nuevosEventos)
      props.setEventos(nuevosEventos)
      localStorage.setItem("eventos", JSON.stringify(nuevosEventos))
      alert("Evento eliminado correctamente");
    }
  }

  return (
    <>
      <h1>{props.saludo}</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Costo del Evento</th> 
            <th>Tipo de Evento</th>
            <th>Descripción del Evento</th>
            <th>Fecha de Evento</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((e, index) => {
            return (
              <tr key={index}>
                <td>{e.nombre}</td>
                <td>${e.costo}</td>
                <td>{e.tipo}</td>
                <td>{e.descripcion}</td>
                <td>{e.fecha}</td>
                
                <td>
                  <button onClick={() => editarEvento(index)}>Editar Evento</button>
                  <button onClick={() => eliminarEvento(index)}>Eliminar Evento</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default MostrarEventos