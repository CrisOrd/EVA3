'use client'
import { useEffect, useState } from 'react';
import { Evento } from './Interfaces/IEvento';
import { MostrarEventos } from './mostrarEventos';

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
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null); 

// Tuve problemas en implementar el localStorage afuera del useEffect por eso fue que lo hice de esta manera
  useEffect(() => {
  let eventosGuardados = localStorage.getItem("eventos")
  if (eventosGuardados != null){
    let eventosCreados = JSON.parse(eventosGuardados) 
    setEventos(eventosCreados)
  }
}, [])

  const handleEvento = (name: string, value: string) => {
    setEvento({ ...evento, [name]: value })
  }
  
  const handleRegistro = () => {
    if (evento.nombre === "" || evento.nombre.length < 3) {
    alert("El nombre del evento debe tener al menos 3 caracteres y no debe estar vacío")
    return;
  }
  
  if (evento.costo === 0 || evento.costo < 0 || evento.costo > 100000000) {
    alert("El costo del evento debe estar entre 1 y 100000000 y no puede ser cero")
    return;
  }
  
  if (evento.tipo === "" || evento.tipo === "Seleccione el Tipo de Evento") {
    alert("Debe seleccionar un tipo de evento")
    return;
  }
  
  if (evento.descripcion === "") {
    alert("La descripción del evento no puede estar vacía")
    return;
  }
  
  if (evento.fecha === "") {
    alert("La fecha del evento no puede estar vacía")
    return;
  }

  let nuevosEventos;
    
  if (editandoIndex !== null) {
    nuevosEventos = [...eventos];
    nuevosEventos[editandoIndex] = evento;
    alert("Evento editado correctamente");
    setEditandoIndex(null);
  } else {
    nuevosEventos = [...eventos, evento];
    alert("Evento registrado correctamente");
  }
  
  localStorage.setItem("eventos", JSON.stringify(nuevosEventos));
  setEventos(nuevosEventos);
  setEvento(initialStateEvento);
  }

  const traerEvento = (eventoSeleccionado: Evento) => {
    setEvento(eventoSeleccionado);
  }

  const editarEvento = (index: number) => {
    setEvento(eventos[index]);
    setEditandoIndex(index);
  }

  const cancelarEdicion = () => {
    setEvento(initialStateEvento);
    setEditandoIndex(null);
  }

  return (
    <div>
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
        name ="costo"
        type="number" 
        min = "0"
        max = "100000000"
        placeholder="Costo $"
        value={evento.costo}
        onChange={(e) => handleEvento(e.currentTarget.name, e.currentTarget.value)}
        /><br />
      <span></span>

      <label>Tipo de Evento</label><br />
      <select name="tipo"
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
      <label>Descripcion del Evento</label>
      <br />
      <textarea name="descripcion"
      value={evento.descripcion}
      onChange={(e) => handleEvento(e.currentTarget.name, e.currentTarget.value)}
      ></textarea>
      <span></span>
      <br />
      <label>Fecha del Evento</label><br />
      <input
        name="fecha"
        type="date"
        min="2025-7-01"
        max="2030-12-31"
        placeholder="Fecha del Evento"
        value={evento.fecha}
        onChange={(e) => handleEvento(e.currentTarget.name, e.currentTarget.value)}
      /><br />
      <span></span>
      <button type="button" onClick={handleRegistro}>
        {editandoIndex !== null ? "Actualizar Evento" : "Registrar"}
      </button>
      
      {editandoIndex !== null && (
        <button type="button" onClick={cancelarEdicion}>
          Cancelar Edición
        </button>
      )}
      
      <MostrarEventos
        saludo="Lista de Eventos"
        traerEvento={traerEvento}
        eventos={eventos}
        setEventos={setEventos}
        editarEvento={editarEvento}
      />
      <br />    
    </div>
    
    )
  }