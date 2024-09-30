import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firmMasterDialogComponent } from '../../../firm-master/firm-master.component';

@Component({
  selector: 'app-add-kharch-dialog',
  templateUrl: './add-kharch-dialog.component.html',
  styleUrls: ['./add-kharch-dialog.component.scss']
})
export class AddKharchDialogComponent {

  kharchForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    public dialogRef: MatDialogRef<AddKharchDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }
  ngOnInit(): void {
    this.formBuild()
    if (this.action === 'Edit') {
      this.kharchForm.controls['unit'].setValue(this.local_data.unit)
      this.kharchForm.controls['kharch'].setValue(this.local_data.kharch)
      this.kharchForm.controls['date'].setValue(this.local_data.date)
      this.kharchForm.controls['dec'].setValue(this.local_data.dec)
      this.kharchForm.controls['chalanNo'].setValue(this.local_data.chalanNo)
      this.kharchForm.controls['amount'].setValue(this.local_data.amount)
    }
  }

  formBuild() {
    this.kharchForm = this.fb.group({
      unit: ['', Validators.required],
      kharch: ['', Validators.required],
      date: [new Date, Validators.required],
      dec: [''],
      chalanNo: [''],
      amount: ['', Validators.required]
    })
  }

  doAction(): void {
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      unit: this.kharchForm.value.unit,
      kharch: this.kharchForm.value.kharch,
      date: this.kharchForm.value.date,
      dec: this.kharchForm.value.dec,
      chalanNo: this.kharchForm.value.chalanNo,
      amount: this.kharchForm.value.amount,
    }
    console.log(payload,"payload==========>>>>>>>>>>>>>>");
    
    this.dialogRef.close({ event: this.action, data: payload });

  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
