'use client'
import { useEffect, useState } from 'react';
import { Evento } from './Interfaces/IEvento';

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
  
// Tuve problemas en implementar el localStorage afuera del useEffect, por lo que lo hice de esta manera
  useEffect(() => {
    const miStorage = window.localStorage
    let eventosGuardados = miStorage.getItem("eventos")
    if (eventosGuardados != null){
      let eventosCreados = JSON.parse(eventosGuardados) 
      setEventos(eventosCreados)
    }
  },[])
  
  const handleEvento = (name: string, value: string) => {
    setEvento({ ...evento, [name]: value })
  }

  const handleRegistro = () => {
    const nuevosEventos = [...eventos, evento]
    localStorage.setItem("eventos", JSON.stringify([...eventos, evento]))
    setEventos(nuevosEventos)
    if (evento.nombre == ""){
      alert("El nombre del evento debe tener al menos 3 caracteres")
    }
    if (evento.costo == 0 ||evento.costo < 0 || evento.costo > 100000000) {
      alert("El costo del evento debe estar entre 1 y 100000000")
    }
    if (evento.tipo == "Seleccione el Tipo de Evento") {
      alert("Debe seleccionar un tipo de evento")
    }
    if (evento.descripcion == "") {
      alert("La descripción del evento no puede estar vacía")
    }
    if (evento.fecha == "") {
      alert("La fecha del evento no puede estar vacía")
    }
    else {
      alert("Evento registrado correctamente")
      setEvento(initialStateEvento)
    }
  }

  
  
  return (
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
      >Tipo Del Evento
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
      <button type="button" onClick={handleRegistro}>Registrar</button>

    </form>
    
    )
  }
