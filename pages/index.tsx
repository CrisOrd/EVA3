'use client'
import { useEffect, useState } from 'react';
import { Evento } from './Interfaces/IEvento';
import { registroEvento, actualizarEvento, eliminarEvento } from './Firebase/Promesa';
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
  const [editando, setEditando] = useState(false);
  const [eventoEditandoId, setEventoEditandoId] = useState<string | null>(null);
  const [errores, setErrores] = useState<{[key: string]: string}>({});
  
  const fetchEventos = async () => {
    try {
      setLoading(true);
      setError(null);
      let q;
      try {
        q = query(collection(db, "Eventos"), orderBy("timestamp", "desc"));
      } catch (orderError) {
        console.log("No se pudo ordenar por timestamp, usando consulta simple.");
        q = query(collection(db, "Eventos"));
      }

      const querySnapshot = await getDocs(q);
      console.log("Documentos encontrados:", querySnapshot.docs.length);

      const eventosFirebase = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log("Datos del documento:", data);

        return {
          id: doc.id,
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
      setError("Error al cargar los eventos desde Firebase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleEvento = (name: string, value: string) => {
    setEvento({ ...evento, [name]: value });
    
    let nuevoError = "";
    
    if (name === "nombre" && value.length < 3) {
      nuevoError = "El nombre debe tener al menos 3 caracteres";

    } else if (name == "costo" && (Number(value) <= 0 || Number(value) > 100000000)) {
      nuevoError = "El costo debe estar entre 1 y 100000000";

    } else if (name == "tipo" && (value == "" || value == "Seleccione el Tipo de Evento")) {
      nuevoError = "Debe seleccionar un tipo de evento";

    } else if (name == "descripcion" && value == "") {
      nuevoError = "La descripción no puede estar vacía";

    } else if (name == "fecha" && value == "") {
      nuevoError = "La fecha no puede estar vacía";
    }
    setErrores({ ...errores, [name]: nuevoError });
  }

  const handleRegistro = async () => {
    const todosLosErrores = {
      nombre: evento.nombre.length < 3 ? "El nombre debe tener al menos 3 caracteres" : "",
      costo: (evento.costo <= 0 || evento.costo > 100000000) ? "El costo debe estar entre 1 y 100000000" : "",
      tipo: (evento.tipo === "" || evento.tipo === "Seleccione el Tipo de Evento") ? "Debe seleccionar un tipo de evento" : "",
      descripcion: evento.descripcion === "" ? "La descripción no puede estar vacía" : "",
      fecha: evento.fecha === "" ? "La fecha no puede estar vacía" : ""
    };
    setErrores(todosLosErrores);
    
    const hayErrores = Object.values(todosLosErrores).some(error => error !== "");
    if (hayErrores) {
      alert("Por favor corrija los errores antes de continuar");
      return;
    }

    try {
      if (editando && eventoEditandoId) {
        await actualizarEvento(eventoEditandoId, evento);
        alert("Evento actualizado correctamente");
        setEditando(false);
        setEventoEditandoId(null);
      } else {
        await registroEvento(evento);
        alert("Evento registrado en Firebase");
      }
      
      setEvento(initialStateEvento);
      setErrores({});
      await fetchEventos();
    } catch (error) {
      alert(editando ? "Error al actualizar el evento" : "Error al registrar el evento en Firebase");
      console.error(error);
    }
  }

  const handleEditar = (eventoAEditar: Evento) => {
    setEvento({
      nombre: eventoAEditar.nombre,
      costo: eventoAEditar.costo,
      tipo: eventoAEditar.tipo,
      descripcion: eventoAEditar.descripcion,
      fecha: eventoAEditar.fecha
    });
    setEditando(true);
    setEventoEditandoId(eventoAEditar.id || null);
    setErrores({});
  }

  const handleCancelarEdicion = () => {
    setEvento(initialStateEvento);
    setEditando(false);
    setEventoEditandoId(null);
    setErrores({});
  }

  const handleEliminar = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm("¿Estás seguro de que quieres eliminar este evento?")) return;
    try {
      await eliminarEvento(id);
      alert("Evento eliminado correctamente");
      await fetchEventos();
    } catch (error) {
      alert("Error al eliminar el evento");
      console.error(error);
    }
  }

  return (
    <div>
      <form>
        <h1>{editando ? 'Editar Evento' : 'Registro de Eventos'}</h1>
        <br />
        <label>Nombre del Evento </label><br />
        <input
          name="nombre" 
          type="text" 
          placeholder="Nombre del Evento"
          value={evento.nombre}
          onChange={(e) => handleEvento(e.currentTarget.name, e.currentTarget.value)}
        /><br />
        <span style={{color: 'red'}}>{errores.nombre}</span>
        <br />

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
        <span style={{color: 'red'}}>{errores.costo}</span>
        <br />

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
        <span style={{color: 'red'}}>{errores.tipo}</span>
        <br />

        <label>Descripcion del Evento</label><br />
        <textarea 
          name="descripcion"
          value={evento.descripcion}
          onChange={(e) => handleEvento(e.currentTarget.name, e.currentTarget.value)}
        ></textarea>
        <br />
        <span style={{color: 'red'}}>{errores.descripcion}</span>
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
        <span style={{color: 'red'}}>{errores.fecha}</span>
        <br />
        <button type="button" onClick={handleRegistro}>
          {editando ? 'Actualizar Evento' : 'Registrar Evento'}
        </button>
        
        {editando && (
          <button type="button" onClick={handleCancelarEdicion}>
            Cancelar
          </button>
        )}
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((e, index) => (
              <tr key={e.id || index}>
                <td>{e.nombre}</td>
                <td>${e.costo}</td>
                <td>{e.tipo}</td> 
                <td>{e.descripcion}</td>
                <td>{e.fecha}</td>
                <td>
                  <button onClick={() => handleEditar(e)}>Editar</button>
                  <button onClick={() => handleEliminar(e.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}