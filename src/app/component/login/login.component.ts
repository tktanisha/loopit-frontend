import { Component,inject, Output,EventEmitter,Input } from '@angular/core';
import { LoginRequest } from '../../models/login';
import { NgForm,FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { SignupComponent } from '../signup/signup.component';
import { LoaderComponent } from '../loader/loader';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [FormsModule ,CommonModule,LoaderComponent,DialogModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

   private router=inject(Router);
   @Output() closeEvent=new EventEmitter<void>();
   private AuthService = inject(AuthService)
   @Input() isLoggedIn!:boolean

  
   isLoading:boolean=false
  

  user: LoginRequest ={
    email:'',
    password:''
  }

 
showPassword: boolean = false;

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}


  onFormSubmitted(form:NgForm) {
    console.log(form)

    if(form.valid){
      this.callLoginService()
      this.closeEvent.emit()
    }
     form.reset();
  }

  onCloseAuthForm() {
    this.closeEvent.emit()
    this.router.navigate(['/'])//back to home
  }

  callLoginService() {
    this.isLoading=true
    this.AuthService.login(this.user)
    .subscribe(
            {         
            next:(data) =>{
            this.AuthService.handleAuthSuccess(data)
            this.isLoading=false
            this.router.navigate(['/dashboard'])
            
            
          },
            error:(err) =>{
            console.log(err)
            this.isLoading=false
            }
            
           
        })
  }

  



}
