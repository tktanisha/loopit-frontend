import { CommonModule } from '@angular/common';
import { Component,inject } from '@angular/core';
import { FormsModule,NgForm } from '@angular/forms';
import { SocietyPayload } from '../../../models/society';
import { SocietyService } from '../../../service/society.service';
import { LoaderComponent } from '../../loader/loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-society',
  imports: [FormsModule,CommonModule,LoaderComponent],
  templateUrl: './create-society.component.html',
  styleUrl: './create-society.component.scss'
})
export class CreateSocietyComponent {


  societyService:SocietyService=inject(SocietyService)
  societySubject!:Subscription
  getSocieties:SocietyPayload[]=[];
  isLoading:boolean=false

  society:SocietyPayload={
    name:'',
    location:'',
    pincode:''

  }

    onSubmitSociety(form:NgForm){
      console.log(form)

      if(form.valid){
        console.log(form)
        this.createSociety(this.society)
      }

      form.reset()
    }

    createSociety(society:SocietyPayload){
      this.isLoading=true
      this.societyService.createSociety(society)
      .subscribe({
        next:(res)=>{
          console.log(res)
          this.isLoading=false
        },
        error:(err)=>{
          console.log(err)
          this.isLoading=false
        }
      })
    }

    
}
