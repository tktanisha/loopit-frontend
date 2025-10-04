import { CommonModule } from "@angular/common";
import { Component,Input } from "@angular/core";

@Component({
    selector:'app-loader',
    standalone:true,
    imports:[CommonModule],
    templateUrl:'./loader.html',
    styleUrl:'./loader.scss'
})
export class LoaderComponent {

    @Input() isLoading:boolean=false

}