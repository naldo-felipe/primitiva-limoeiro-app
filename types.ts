export interface Member {
  id: string;
  name: string;
  role: string;
  status: 'Ativo' | 'Inativo';
  phone: string;
  birthDate: string;
}

export interface Visitor {
  id: string;
  name: string;
  firstVisitDate: string;
  phone: string;
  notes: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  imageDataUrl?: string;
}

export interface PrayerRequest {
  id: string;
  name?: string; // Nome de quem fez o pedido (opcional)
  request: string;
  isAnonymous: boolean;
  date: string;
}

export type Role = 'public' | 'admin';