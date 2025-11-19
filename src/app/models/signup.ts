export interface SignUpRequest {
  fullname: string;
  email: string;
  password: string;
  phoneNumber: string;
  societyId: string | null;
  address: string;
}
