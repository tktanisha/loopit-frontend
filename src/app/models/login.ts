export interface LoginRequest  {
    email: string
    password:string
}

export interface LoginResponse {
    token:string;
    user:{
        id:string;
        Name:string;
        Role:string;
    }
}