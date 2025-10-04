import { Component, EventEmitter, Output,inject } from '@angular/core';
import { FormsModule,NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/auth.service';
import { SignUpRequest } from '../../models/signup';
import { LoaderComponent } from '../loader/loader';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-signup',
  imports: [FormsModule,LoaderComponent,CommonModule,LoginComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {


  private router= inject(Router)

  @Output() clickEvent =new EventEmitter<void>()
   userService= inject(UserService)

   isLoading:boolean=false;
   isLoggedIn:boolean=false;

   errorMessage!:string| null

  handleOnClose(){
    this.clickEvent.emit()
  }

  user: SignUpRequest = {
    fullname: '',
    email: '',
    password: '',
    phone_number:'',
    address: ''
  };

    onFormSubmitted(form: NgForm) {
    console.log(form)

    if(form.valid){
      this.sumbitSignUpForm();
    }
    form.reset();
   
  }

  sumbitSignUpForm(){
    this.isLoading=true;
    this.userService.signup(this.user)
    .subscribe(
      {
        next:(data) =>{
          this.userService.handleAuthSuccess(data)
          this.isLoading=false;
          this.router.navigate(['/dashboard']) 
        },
        error:(err) =>{
          console.log(err.error.details)
          this.errorMessage=err.error.details

          //bcoz after three second i will hide the taost
          setTimeout(()=>{
            this.errorMessage=null
          },3000);
          this.isLoading=false;
      
        }
      }
    )
  }

  onClickSignIn(){
    this.isLoggedIn=true
  }

  
}
