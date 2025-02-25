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
    this.formBuild(this.action === 'Edit' ? this.local_data : undefined);
  }

  formBuild(data:any) {
    this.khataForm = this.fb.group({
      firstName: [data ? data?.firstName : '', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      lastName: [data ? data?.lastName : '', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      companyName: [data ? data?.companyName : '', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      ownerName: [data ? data?.ownerName : '', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      address: [data ? data?.address : '', Validators.required],
      mobileNo: [data ? data?.mobileNo : '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      pan: [data ? data?.pan : ''],
      gst: [data ? data?.gst : ''],
    })
  }

  doAction(): void {
    const payload = this.khataForm.value
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}