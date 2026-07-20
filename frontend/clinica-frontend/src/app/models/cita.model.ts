export interface Cita {
  id?: number;
  paciente: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: number;
  created_at?: string;
}

export interface LoginResponse {
  token: string;
  usuario: string;
  nombre: string;
}
