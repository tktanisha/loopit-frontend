export interface User {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  created_at: string | null;
  password_hash: string | null;
  address: string;
  society_id: string | null;
  role: Role;
}

export enum Role {
  admin = 'admin',
  user = 'user',
  lender = 'lender',
}
