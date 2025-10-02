import { Component,inject } from '@angular/core';
import { Router } from '@angular/router';
import { SignupComponent } from '../signup/signup.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  imports: [SignupComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

    private router=inject(Router)

    isSignedUp!:boolean

  handleOnClose() {
    this.isSignedUp=false
    this.router.navigate(['/'])
  }  

  onClickChangeToSignupModal(){
    console.log("clciked on get started")
    this.isSignedUp=true
    ;

  }
}
