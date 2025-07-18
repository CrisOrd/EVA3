import { db } from "./Firebase/Conexion"
import React, { useEffect, useState } from 'react'
import { Evento } from './Interfaces/IEvento'
import { collection, getDocs, query, orderBy } from "firebase/firestore"

interface Props {
  saludo: string,
  traerEvento: (e: Evento) => void,
  eventos: Evento[],
  setEventos: (eventos: Evento[]) => void,
  editarEvento: (index: number) => void 
}

export const MostrarEventos = (props: Props) => {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEventos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let q;
      try {
        q = query(collection(db, "Eventos"), orderBy("timestamp", "desc"))
      } catch (orderError) {
        console.log("No se pudo ordenar por timestamp, usando consulta simple.")
        q = query(collection(db, "Eventos"))
      }
      
      const querySnapshot = await getDocs(q)
      const eventosFirebase: Evento[] = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          nombre: data.nombreEvento || '',
          costo: Number(data.costoEvento) || 0,
          tipo: data.tipoEvento || '',
          descripcion: data.descripcionEvento || '',
          fecha: data.fechaEvento || ''
        }
      })
      
      setEventos(eventosFirebase)
      props.setEventos(eventosFirebase)
    } catch (error) {
      console.error("Error al cargar eventos:", error)
      setError("Error al cargar los eventos desde Firebase.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventos()
  }, [])

  const handleEditar = (evento: Evento, index: number) => {
    props.traerEvento(evento)
    props.editarEvento(index)
  }

  if (loading) {
    return (
      <div>
        <h1>{props.saludo}</h1>
        <p>Cargando eventos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>{props.saludo}</h1>
        <p style={{color: 'red'}}>{error}</p>
        <button onClick={fetchEventos}>Reintentar</button>
      </div>
    )
  }

  return (
    <div>
      <h1>{props.saludo}</h1>
      
      {eventos.length === 0 ? (
        <p>No hay eventos registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Costo del Evento</th> 
              <th>Tipo de Evento</th>
              <th>Descripción del Evento</th>
              <th>Fecha de Evento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((e, index) => {
              return (
                <tr key={e.id || index}>
                  <td>{e.nombre}</td>
                  <td>${e.costo}</td>
                  <td>{e.tipo}</td>
                  <td>{e.descripcion}</td>
                  <td>{e.fecha}</td>
                  <td>
                    <button onClick={() => handleEditar(e, index)}>
                      Editar Evento
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      
      <button onClick={fetchEventos} disabled={loading}>
        {loading ? 'Cargando...' : 'Recargar Eventos'}
      </button>
    </div>
  )
}

export default MostrarEventos