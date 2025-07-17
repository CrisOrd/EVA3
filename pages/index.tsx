'use client'
import { useEffect, useState } from 'react';
import { Evento } from './Interfaces/IEvento';
import { registroEvento } from './Firebase/Promesa';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./Firebase/Conexion";

const initialStateEvento: Evento = {
  nombre: '',
  costo: 0,
  tipo: '',
  descripcion: '',
  fecha: ''
};

export default function Home() {
  const [evento, setEvento] = useState<Evento>(initialStateEvento);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchEventos = async () => {
    try {
      setLoading(true);
      setError(null);
      let q;
      try {
        q = query(collection(db, "Eventos"), orderBy("timestamp", "desc"));
      } catch (orderError) {
        console.log("No se puede ordenar por timestamp, usando consulta simple");
        q = query(collection(db, "Eventos"));
      }
      
      const querySnapshot = await getDocs(q);
      console.log("Documentos encontrados:", querySnapshot.docs.length);
      
      const eventosFirebase: Evento[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log("Datos del documento:", data); // Para debug
        return {
          nombre: data.nombreEvento || '',
          costo: Number(data.costoEvento) || 0,
          tipo: data.tipoEvento || '',
          descripcion: data.descripcionEvento || '',
          fecha: data.fechaEvento || ''
        };
      });
      
      setEventos(eventosFirebase);
      console.log("Eventos procesados:", eventosFirebase);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      setError("Error al cargar los eventos desde Firebase");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleEvento = (name: string, value: string) => {
    setEvento({ ...evento, [name]: value });
  }

  const handleRegistro = async () => {
    // Validaciones
    if (evento.nombre.length < 3) {
      alert("El nombre del evento debe tener al menos 3 caracteres");
      return;
    }
    if (evento.costo <= 0 || evento.costo > 100000000) {
      alert("El costo del evento debe estar entre 1 y 100000000");
      return;
    }
    if (evento.tipo === "" || evento.tipo === "Seleccione el Tipo de Evento") {
      alert("Debe seleccionar un tipo de evento");
      return;
    }
    if (evento.descripcion === "") {
      alert("La descripción del evento no puede estar vacía");
      return;
    }
    if (evento.fecha === "") {
      alert("La fecha del evento no puede estar vacía");
      return;
    }

    try {
      await registroEvento(evento);
      alert("Evento registrado en Firebase");
      setEvento(initialStateEvento);
      await fetchEventos(); 
    } catch (error) {
      alert("Error al registrar el evento en Firebase");
      console.error(error);
    }
  }

  return (
    <div>
      <form>
        <h1>Registro de Eventos</h1>
        <br />
        <label>Nombre del Evento </label><br />
        <input
          name="nombre" 
          type="text" 
          placeholder="Nombre del Evento"
          value={evento.nombre}
          onChange={(e) => handleEvento(e.currentTarget.name, e.currentTarget.value)}
        /><br />
        <span></span>

        <label>Costo del Evento </label><br />
        <input 
          name="costo"
          type="number" 
          min="0"
          max="100000000"
          placeholder="Costo $"
          value={evento.costo}
          onChange={(e) => handleEvento(e.currentTarget.name, e.currentTarget.value)}
        /><br />
        <span></span>

        <label>Tipo de Evento</label><br />
        <select 
          name="tipo"
          value={evento.tipo}
          onChange={(e) => handleEvento(e.currentTarget.name, e.currentTarget.value)}
        >
          <option value="">Seleccione el Tipo de Evento</option>
          <option value="Conferencia">Conferencia</option>
          <option value="Taller">Taller</option>
          <option value="Seminario">Seminario</option>
          <option value="Matrimonio">Matrimonio</option>
          <option value="Cumpleaños">Cumpleaños</option>
          <option value="Baby Shower">Baby Shower</option>
        </select><br />
        <span></span>

        <label>Descripcion del Evento</label><br />
        <textarea 
          name="descripcion"
          value={evento.descripcion}
          onChange={(e) => handleEvento(e.currentTarget.name, e.currentTarget.value)}
        ></textarea>
        <span></span>
        <br />

        <label>Fecha del Evento</label><br />
        <input
          name="fecha"
          type="date"
          min="2025-07-01"
          max="2030-12-31"
          placeholder="Fecha del Evento"
          value={evento.fecha}
          onChange={(e) => handleEvento(e.currentTarget.name, e.currentTarget.value)}
        /><br />
        <span></span>

        <button type="button" onClick={handleRegistro}>Registrar Evento</button>
      </form>
      <h2>Eventos Registrados</h2>
      
      {loading && <p>Cargando eventos...</p>}
      
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      {!loading && !error && eventos.length === 0 && (
        <p>No hay eventos registrados.</p>
      )}
      
      {!loading && !error && eventos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Nombre del Evento</th>
              <th>Costo del Evento</th> 
              <th>Tipo de Evento</th>
              <th>Descripción del Evento</th>
              <th>Fecha del Evento</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((e, index) => (
              <tr key={index}>
                <td>{e.nombre}</td>
                <td>${e.costo}</td>
                <td>{e.tipo}</td> 
                <td>{e.descripcion}</td>
                <td>{e.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <button onClick={fetchEventos} disabled={loading}>
        {loading ? 'Cargando...' : 'Recargar'}
      </button>
    </div>
  );
}