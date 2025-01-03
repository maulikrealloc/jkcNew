import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-add-kharch-dialog',
  templateUrl: './add-kharch-dialog.component.html',
  styleUrls: ['./add-kharch-dialog.component.scss']
})
  
export class AddKharchDialogComponent implements OnInit {

  kharchForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    public dialogRef: MatDialogRef<AddKharchDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.formBuild()
    if (this.action === 'Edit') {
      this.kharchForm.controls['unit'].setValue(this.local_data.unit)
      this.kharchForm.controls['kharch'].setValue(this.local_data.kharch)
      this.kharchForm.controls['date'].setValue(this.convertTimestampToDate(this.local_data.date))
      this.kharchForm.controls['dec'].setValue(this.local_data.dec)
      this.kharchForm.controls['chalanNo'].setValue(this.local_data.chalanNo)
      this.kharchForm.controls['amount'].setValue(this.local_data.amount)
    }
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
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
      unit: this.kharchForm.value.unit,
      kharch: this.kharchForm.value.kharch,
      date: this.kharchForm.value.date,
      dec: this.kharchForm.value.dec,
      chalanNo: this.kharchForm.value.chalanNo,
      amount: this.kharchForm.value.amount,
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}