import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-maintenance-master-dialog',
  templateUrl: './maintenance-master-dialog.component.html',
  styleUrls: ['./maintenance-master-dialog.component.scss']
})
  
export class MaintenanceMasterDialogComponent implements OnInit {

  maintenanceForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MaintenanceMasterDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.formBuild(this.action === 'Edit' ? this.local_data : undefined);
  }

  formBuild(data:any) {
    this.maintenanceForm = this.fb.group({
      name: [data ? data?.name : '', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      value: [data ? data?.value : '', Validators.required]
    })
  }

  doAction(): void {
    const payload = this.maintenanceForm.value
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}