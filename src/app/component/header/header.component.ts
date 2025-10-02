import { Component,OnInit,inject } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [LoginComponent,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

isLoggedIn:boolean=false//this is for login component display
isUserLoggedIn:boolean=false
userService:UserService=inject(UserService);
private userSubject!:Subscription;

//whenever this component will be loaded it will check if user is already logged in than show diff header else home header 
ngOnInit(): void {
 this.userSubject= this.userService.user.subscribe((user:User)=>{
    this.isUserLoggedIn= user ? true :false;

  })
}

onClickedSignIn() {
  console.log("clicked")
  this.isLoggedIn=true
}

handleLoginClose() {
  this.isLoggedIn=false
}

ngOnDestroy(){
  this.userSubject.unsubscribe()
}

}
