import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-kharch-dialog',
  templateUrl: './add-kharch-dialog.component.html',
  styleUrls: ['./add-kharch-dialog.component.scss']
})
  
export class AddKharchDialogComponent implements OnInit {

  kharchForm: FormGroup;
  action: string;
  local_data: any;
  UnitDataList: any = [];
  KharchDataList: any = [];

  constructor(
    public dialogRef: MatDialogRef<AddKharchDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private commonService:CommonService) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.formBuild(this.action === 'Edit' ? this.local_data : undefined)
    this.getunitList()
    this.getkharchList()
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

  getunitList() {
    this.commonService.fetchData('UnitList', this.UnitDataList);
    console.log('[{{this.UnitDataList}}]',this.UnitDataList);
  }

  getkharchList() {
    this.commonService.fetchData('kharchList', this.KharchDataList);
    console.log('[{{this.KharchDataList}}]', this.KharchDataList);
  }

}