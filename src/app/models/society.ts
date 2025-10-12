export interface SocietyPayload {
  name: string;
  location: string;
  pincode: string;
}

export interface GetSocietyResponse {
  id: number;
  name: string;
  price: number;
  security: number;
}
