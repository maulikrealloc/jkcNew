import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMessageComponent } from './common-components/validation-message/validation-message.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [ValidationMessageComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [ValidationMessageComponent]
})
export class SharedModule { }
