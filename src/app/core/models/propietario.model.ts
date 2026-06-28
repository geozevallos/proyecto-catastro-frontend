export interface Propietario {
  id?: number;
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  telefono: string;
  direccion: string;
  tipo: string;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
