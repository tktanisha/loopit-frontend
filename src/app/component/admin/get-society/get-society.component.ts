import { Component,inject } from '@angular/core';
import { SocietyService } from '../../../service/society.service';
import { Subscription } from 'rxjs';
import { SocietyPayload } from '../../../models/society';
import { LoaderComponent } from '../../loader/loader';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-get-society',
  imports: [LoaderComponent,CommonModule],
  templateUrl: './get-society.component.html',
  styleUrl: './get-society.component.scss'
})
export class GetSocietyComponent {

  societyService:SocietyService=inject(SocietyService)
  societySubject!:Subscription
  isLoading:boolean=false
  GetAllSocieties :SocietyPayload[]=[];


  ngOnInit(): void {
   this.fetchAllSociety()
  }

  fetchAllSociety(){
    this.isLoading=true
     this.societySubject=this.societyService.fetchAllSociety()
    .subscribe({
      next:(res:any)=>{
        this.GetAllSocieties = res.societies
        this.isLoading=false;
        
      },
      error:(err)=>{
        console.log(err)
        this.isLoading=false;
      }
    })
  }

   ngOnDestroy(): void {
    if (this.societySubject) {
      this.societySubject.unsubscribe();
    }
  }
}


