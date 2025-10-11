import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterModule, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
