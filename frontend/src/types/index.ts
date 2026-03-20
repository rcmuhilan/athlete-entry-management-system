export interface Athlete {
  id: number;
  name: string;
  college: string;
  phone: string;
  email: string;
  user_id?: string;
}

export interface Event {
  id: number;
  name: string;
  category: string;
  date: string;
  maxParticipants: number;
  time?: string;
  location?: string;
  rules?: string;
  judges?: string;
}

export interface Registration {
  id: number;
  athlete_id: number;
  event_id: number;
  registration_date: string;
  status: string;
  athlete?: Athlete;
  event?: Event;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  fullName?: string;
  role: "admin" | "teacher" | "student" | "viewer";
}

export interface House {
  id: string;
  name: string;
  points: number;
  color?: string;
}

export interface Student {
  id: string;
  name: string;
  registerNumber: string;
  phone?: string;
  rollNumber?: string;
  className?: string;
  degree?: string;
  department?: string;
  year?: string;
  address?: string;
  houseId?: string;
  house?: House;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

