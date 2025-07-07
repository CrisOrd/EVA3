'use client'
export default function Home() {
 
  return (
    <form>
      <h1>Registro de Eventos</h1>
      <br />
      <label>Nombre del Evento </label><br />
      <input
        name="nombreEvento" 
        type="text" 
        placeholder="Nombre del Evento"
        /><br />
      <span></span>

      <label>Costo del Evento </label><br />
      <input 
        name ="costeEvento"
        type="number" 
        min = "0"
        max = "100000000"
        placeholder="Costo $"
        
        /><br />
      <span></span>

      <label>Tipo de Evento</label><br />
      <select name="tipoEvento">Tipo Del Evento
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
      <textarea name="descripcionEvento"></textarea>
      <span></span>
      <br />
      <label>Fecha del Evento</label><br />
      <input
        name="fechaEvento"
        type="date"
        min="2025-7-01"
        max="2030-12-31"
        placeholder="Fecha del Evento"
      /><br />
      <span></span>
      <button>Registrar</button>

    </form>
    );
}
