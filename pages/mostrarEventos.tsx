import React, { useEffect, useState } from 'react'
import { Evento } from './Interfaces/IEvento'

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
    let listadoStr = localStorage.getItem("eventos")
    if (listadoStr != null) {
      let listado = JSON.parse(listadoStr)
      setEventos(listado)
    }
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
            <th>Tipo</th>
            <th>Costo</th>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((e, index) => {
            return (
              <tr key={index}>
                <td>{e.nombre}</td>
                <td>{e.tipo}</td>
                <td>${e.costo}</td>
                <td>{e.fecha}</td>
                <td>{e.descripcion}</td>
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