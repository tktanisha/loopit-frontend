export interface LoginRequest  {
    email: string
    password:string
}

export interface LoginResponse {
    token:string;
    user:{
        ID:number;
        Name:string;
        Role:string;
    }
}