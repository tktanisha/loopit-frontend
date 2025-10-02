import { Component,inject, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  user!: User | null 

private userService= inject(UserService)

ngOnInit(): void {
  this.user= this.userService.getUser()
}

}
