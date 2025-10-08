import { Component,inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupComponent } from '../signup/signup.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../service/auth.service';
import { Subscription } from 'rxjs';
import { LoggedInUser } from '../../models/logged-in-user';
import { LoaderComponent } from '../loader/loader';


@Component({
  selector: 'app-home',
  imports: [SignupComponent,CommonModule,HeaderComponent,LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

    private router=inject(Router)
    AuthService=inject(AuthService)
    userSubject!:Subscription
    isLoading:boolean=false
    isSignedUp!:boolean

    isUserLoggedIn:boolean=false

  ngOnInit(): void {
    this.isLoading=true
    this.userSubject= this.AuthService.user.subscribe((user:LoggedInUser | null)=>{
      this.isUserLoggedIn=user ? true : false;
    })
    this.isLoading=false
  }  

  handleOnClose() {
    this.isSignedUp=false
    this.router.navigate(['/'])
  }  

  onClickChangeToSignupModal(){
    console.log("clciked on get started")
    this.isSignedUp=true
    ;

  }

  ngOnDestroy(){
    this.userSubject.unsubscribe()
  }
}
