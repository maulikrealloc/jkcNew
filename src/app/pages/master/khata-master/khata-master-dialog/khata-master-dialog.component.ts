import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-khata-master-dialog',
  templateUrl: './khata-master-dialog.component.html',
  styleUrls: ['./khata-master-dialog.component.scss']
})
export class KhataMasterDialogComponent {
  khatuForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<KhataMasterDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.local_data = { ...data };
    this.action = this.local_data.action;
  }
  ngOnInit(): void {
    this.formBuild();

    if (this.action === 'Edit') {
      this.khatuForm.controls['firstName'].setValue(this.local_data.firstName)
      this.khatuForm.controls['lastName'].setValue(this.local_data.lastName)
      this.khatuForm.controls['companyName'].setValue(this.local_data.companyName)
      this.khatuForm.controls['ownerName'].setValue(this.local_data.ownerName)
      this.khatuForm.controls['address'].setValue(this.local_data.address)
      this.khatuForm.controls['mobileNo'].setValue(this.local_data.mobileNo)
      this.khatuForm.controls['pan'].setValue(this.local_data.pan)
      this.khatuForm.controls['gst'].setValue(this.local_data.gst)
    }
  }

  formBuild() {
    this.khatuForm = this.fb.group({
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
      firstName: this.khatuForm.value.firstName,
      lastName: this.khatuForm.value.lastName,
      companyName: this.khatuForm.value.companyName,
      ownerName: this.khatuForm.value.ownerName,
      address: this.khatuForm.value.address,
      mobileNo: this.khatuForm.value.mobileNo,
      pan: this.khatuForm.value.pan,
      gst: this.khatuForm.value.gst,
    }
    this.dialogRef.close({ event: this.action, data: payload });

  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  
}
