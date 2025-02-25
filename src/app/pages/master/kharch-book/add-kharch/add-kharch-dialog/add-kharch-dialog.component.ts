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
    this.formBuild(this.action === 'Edit' ? this.local_data : undefined)
  }

  convertTimestampToDate(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  formBuild(data:any) {
    this.kharchForm = this.fb.group({
      unit: [data ? data?.unit : '', Validators.required],
      kharch: [data ? data?.kharch : '', Validators.required],
      date: [data ? this.convertTimestampToDate(this.local_data.date) : new Date, Validators.required],
      dec: [data ? data?.dec : ''],
      chalanNo: [data ? data?.chalanNo : ''],
      amount: [data ? data?.amount : '', Validators.required]
    })
  }

  doAction(): void {
    const payload = this.kharchForm.value
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}