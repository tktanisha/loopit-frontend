export interface SignUpRequest {
  fullname: string;
  email: string;
  password: string;
  phone_number: string;
  society_id: string | null;
  address: string;
}
