export interface Evento {
  id?: string; // ID del documento de Firebase (opcional)
  nombre: string;
  costo: number;
  tipo: string;
  descripcion: string;
  fecha: string;
}