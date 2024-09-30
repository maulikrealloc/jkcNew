import { Component } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
  imports: [NgIf]
})
export class SpinnerComponent {
  spinner :boolean = false
  constructor(private spinnerService : SpinnerService){
    this.spinnerService.getSpinnerValue().subscribe((value) => {
      this.spinner = value;
    });
  }

}
