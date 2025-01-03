import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-khata-master-dialog',
  templateUrl: './khata-master-dialog.component.html',
  styleUrls: ['./khata-master-dialog.component.scss']
})

export class KhataMasterDialogComponent implements OnInit {

  khataForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<KhataMasterDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.formBuild();
    if (this.action === 'Edit') {
      this.khataForm.controls['firstName'].setValue(this.local_data.firstName)
      this.khataForm.controls['lastName'].setValue(this.local_data.lastName)
      this.khataForm.controls['companyName'].setValue(this.local_data.companyName)
      this.khataForm.controls['ownerName'].setValue(this.local_data.ownerName)
      this.khataForm.controls['address'].setValue(this.local_data.address)
      this.khataForm.controls['mobileNo'].setValue(this.local_data.mobileNo)
      this.khataForm.controls['pan'].setValue(this.local_data.pan)
      this.khataForm.controls['gst'].setValue(this.local_data.gst)
    }
  }

  formBuild() {
    this.khataForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      companyName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      ownerName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      address: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      pan: [''],
      gst: [''],
    })
  }

  doAction(): void {
    const payload = {
      firstName: this.khataForm.value.firstName,
      lastName: this.khataForm.value.lastName,
      companyName: this.khataForm.value.companyName,
      ownerName: this.khataForm.value.ownerName,
      address: this.khataForm.value.address,
      mobileNo: this.khataForm.value.mobileNo,
      pan: this.khataForm.value.pan,
      gst: this.khataForm.value.gst,
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}