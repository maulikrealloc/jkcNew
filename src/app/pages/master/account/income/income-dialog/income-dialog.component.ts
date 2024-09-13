import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-income-dialog',
  templateUrl: './income-dialog.component.html',
  styleUrls: ['./income-dialog.component.scss']
})
export class IncomeDialogComponent implements OnInit {
  incomeForm:FormGroup
  action: string;
  local_data: any;

  constructor(
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<IncomeDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.incomegroup()
    if (this.action === 'Edit') {
      this.incomeForm.controls['partyName'].setValue(this.local_data.partyName)
      this.incomeForm.controls['account'].setValue(this.local_data.account)
      this.incomeForm.controls['invoiceNo'].setValue(this.local_data.invoiceNo)
      this.incomeForm.controls['invoiceDate'].setValue(this.local_data.invoiceDate)
      this.incomeForm.controls['creditDate'].setValue(this.local_data.creditDate)
      this.incomeForm.controls['amount'].setValue(this.local_data.amount)
    }
    console.log('data====>>>',this.data);
  }

  incomegroup(){
    this.incomeForm = this.fb.group({
      partyName:['',Validators.required],
      account:['',Validators.required],
      invoiceNo:['',Validators.required],
      invoiceDate:new Date(),
      creditDate:new Date(),
      amount:['',Validators.required]
    })
  }

  doAction(){
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      partyName:this.incomeForm.value.partyName,
      account:this.incomeForm.value.account,
      invoiceNo:this.incomeForm.value.invoiceNo,
      invoiceDate:this.incomeForm.value.invoiceDate,
      creditDate:this.incomeForm.value.creditDate,
      amount:this.incomeForm.value.amount
    }
    this.dialogRef.close({ event: this.action, data:payload })
  }

  closeDialog(){
    this.dialogRef.close({event:'cancel'})
  }

}
