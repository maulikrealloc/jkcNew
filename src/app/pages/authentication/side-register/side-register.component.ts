import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { NgIf } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService, private router: Router , private authServie : AuthService) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    companyName: new FormControl('', [Validators.required]),
    mobileNo: new FormControl('', [Validators.required]),

  });

  get f() {
    return this.form.controls;
  }

  submit() {
    const payload = {
      email : this.form.value.email,
      password : this.form.value.password,
      firstName : this.form.value.firstName,
      lastName : this.form.value.lastName,
      companyName : this.form.value.companyName,
      mobileNo : this.form.value.mobileNo,
    }
    const registerSuccess:any = this.authServie.signUp(payload)
    if (registerSuccess) {
      this.form.reset()
    }
  }

}
