export interface LoginRequest  {
    email: string
    password:string
}

export interface LoginResponse {
    token:string;
    user:{
        ID:string;
        Name:string;
        Role:string;
    }
}