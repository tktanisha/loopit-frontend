import {  Injectable,inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import {jwtDecode} from 'jwt-decode';
import { LoginRequest, LoginResponse } from "../models/login";
import { User } from "../models/user";
import { SignUpRequest } from "../models/signup";
import { BehaviorSubject, Subject, tap } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class UserService{


    private ApiUrl='http://localhost:8080'
    private jwtKey='auth_token'
    private userkey='auth_user'


    private http= inject(HttpClient)
    private router= inject(Router)

    //now i will emit the boolean value to the header component which will onLoggedin will emit the true and header accordingly will change
    // changeHeader: EventEmitter<boolean>=new EventEmitter<boolean>();

    //using behaviour subject i can pass the initial valaue and current value to all the subscriber
    isLoggedIn= new BehaviorSubject<boolean>(false)
    user =new Subject<User>();//if on this user json web token exp nhi hua h  toh we will that means user is loged in otherwose not

    error:string | null =null
    
     constructor() {
      const token = localStorage.getItem('authToken');
      if (token) {
      this.isLoggedIn.next(true);
    }
  }


    signup(data : SignUpRequest){
        return this.http.post<LoginResponse>(`${this.ApiUrl}/auth/register`,data)
        .pipe(tap((data)=>{
            const decodedToken= jwtDecode(data.token);
            const time=decodedToken.exp
            const expiryTimeInTempStamp= (time! * 1000);
            const expiresIn = new Date(expiryTimeInTempStamp)
            const user=new User(data.user.Name,data.user.ID,data.user.Role,expiresIn)
            console.log("loggedin user=",user)
            this.user.next(user)
        }))
    }

    
    login(data:LoginRequest){
        return this.http.post<LoginResponse>(`${this.ApiUrl}/auth/login`,data)
        .pipe(tap((data)=>{
            const decodedToken= jwtDecode(data.token);
            const time=decodedToken.exp
            const expiryTimeInTempStamp= (time! * 1000);
            const expiresIn = new Date(expiryTimeInTempStamp)
            const user=new User(data.user.Name,data.user.ID,data.user.Role,expiresIn)
            console.log("loggedin user=",user)
            this.user.next(user)
        }))
    }

    handleAuthSuccess(res: LoginResponse) {
        localStorage.setItem(this.jwtKey,res.token)
        const decodedJwt =jwtDecode(res.token);
        console.log(decodedJwt)


        const userInfo ={
            ID:res.user.ID,
            Name:res.user.Name,
            Role:res.user.Role
        }

        console.log(userInfo)
        const jsonUser=JSON.stringify(userInfo)
        console.log("json data",jsonUser)

        localStorage.setItem(this.userkey,JSON.stringify(userInfo))

        this.isLoggedIn.next(true)
        
    }


    logout() {
        localStorage.removeItem(this.jwtKey)
        localStorage.removeItem(this.userkey)

        this.isLoggedIn.next(false)
        this.router.navigate(['/'])
    }

    getToken():string | null {
        return localStorage.getItem(this.jwtKey)
    }

    getUser(): User |null {
        const jsonUser=localStorage.getItem(this.userkey);
        return jsonUser ? JSON.parse(jsonUser): null;
    }

    
}