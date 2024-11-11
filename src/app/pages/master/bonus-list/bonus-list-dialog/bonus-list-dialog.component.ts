import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { designMasterDialogComponent } from '../../design-master/design-master.component';

@Component({
  selector: 'app-bonus-list-dialog',
  templateUrl: './bonus-list-dialog.component.html',
  styleUrls: ['./bonus-list-dialog.component.scss']
})
export class BonusListDialogComponent {

  bonusForm: FormGroup;
  local_data: any;
  action: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BonusListDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.buildForm()
    if (this.action === 'Edit') {
      this.bonusForm.controls['employeeList'].setValue(this.local_data.employeeList)
      this.bonusForm.controls['amount'].setValue(this.local_data.amount)
      this.bonusForm.controls['date'].setValue(this.local_data.date)
    }
  }
  buildForm() {
    this.bonusForm = this.fb.group({
      employeeList: ['',Validators.required],
      amount: ['',Validators.required],
      date: new Date(),
    })
  }

  doAction() {
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      employeeList: this.bonusForm.value.employeeList,
      amount: this.bonusForm.value.amount,
      date: this.bonusForm.value.date
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
