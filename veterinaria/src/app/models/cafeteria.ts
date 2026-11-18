export interface Cafeteria {
  id: number;
  nombre: string;
  slogan: string | null;
  descripcion: string | null;
  historia: string | null;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  horarios: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  video_url: string | null;
  video_poster: string | null;
  video_credit: string | null;
  video_credit_url: string | null;
}

export interface ServicioCafeteria {
  id: number;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  imagen: string | null;
  orden: number;
}

export interface ProductoCafeteria {
  id: number;
  titulo: string;
  descripcion: string | null;
  imagen: string | null;
  precio: number;
  categoria: string;
  destacada: boolean;
  orden: number;
}

export interface ImagenGaleria {
  id: number;
  imagen: string;
  texto_alternativo: string;
  descripcion: string | null;
  orden: number;
}

export interface ContenidoCafeteria {
  cafeteria: Cafeteria;
  servicios: ServicioCafeteria[];
  productos: ProductoCafeteria[];
  galeria: ImagenGaleria[];
}

export interface ResultadoActualizacion {
  data?: ContenidoCafeteria;
  error?: unknown;
}

export interface ContactoCafeteria {
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string;
}
