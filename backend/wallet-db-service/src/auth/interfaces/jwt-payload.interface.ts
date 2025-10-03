export interface JwtPayload {
  sub: number;
  document: string;
  phone: string;
  email?: string;
}
