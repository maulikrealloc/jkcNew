import { Component, Input } from '@angular/core';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss'],
})
  
export class ValidationMessageComponent {

  @Input() control: any;

  constructor(private validationService: ValidationService) { }

  get errorMessage(): string | null {
    if (this.control && this.control.errors && (this.control.touched || this.control.dirty)) {
      return this.validationService.getValidationMessage(this.control);
    }
    return null;
  }

}
