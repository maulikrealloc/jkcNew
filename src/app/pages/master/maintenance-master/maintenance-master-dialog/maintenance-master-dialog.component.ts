import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { designMasterDialogComponent } from '../../design-master/design-master.component';
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
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    console.log('localData===>>', this.local_data);

  }
  ngOnInit(): void {
    this.formBuild()

    if (this.action === 'Edit') {
      this.maintenanceForm.controls['name'].setValue(this.local_data.name)
      this.maintenanceForm.controls['value'].setValue(this.local_data.value)
    }

  }

  formBuild() {
    this.maintenanceForm = this.fb.group({
      name: ['',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]],
      value: ['', Validators.required]
    })
  }

  doAction(): void {

    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      name: this.maintenanceForm.value.name,
      value: this.maintenanceForm.value.value
    }
    this.dialogRef.close({ event: this.action, data: payload });

  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
