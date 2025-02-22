import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  getValidationMessage(control: AbstractControl | null): string {
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return ''; // Don't show error if untouched
    }

    const firstErrorKey = Object.keys(control.errors)[0];
    const errorValue = control.errors[firstErrorKey];

    const validationMessages: { [key: string]: string } = {
      required: 'This field is required',
      email: 'Invalid email format',
      pattern: 'Invalid format',
    };

    switch (firstErrorKey) {
      case 'minlength':
        return `Minimum length required is ${errorValue.requiredLength}`;
      case 'maxlength':
        return `Maximum length allowed is ${errorValue.requiredLength}`;
      case 'min':
        return `Minimum value should be ${errorValue.min}`;
      case 'max':
        return `Maximum value should be ${errorValue.max}`;
      default:
        return validationMessages[firstErrorKey] || 'Invalid input';
    }
  }
}
