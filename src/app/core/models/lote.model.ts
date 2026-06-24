export interface Lote {
  id: number;
  referenciaCatastral: string;
  direccion: string;
  superficie: number;
  tipo: string;
  propietarioId: number;
  propietarioNombre: string;
  propietarioDocumento: string;
  geometria: GeoJSON.Geometry | null; 
  estado: string;
  createdAt: string;
  updatedAt: string;
}
