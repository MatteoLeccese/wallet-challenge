export interface User {
  id: number;
  document: string;
  names: string;
  email: string;
  phone: string;
}

export interface RegisterData {
  document: string;
  names: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  customer: User;
  message?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  customer: User;
}
