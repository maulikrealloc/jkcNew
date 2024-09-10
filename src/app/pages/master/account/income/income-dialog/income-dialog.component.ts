import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-income-dialog',
  templateUrl: './income-dialog.component.html',
  styleUrls: ['./income-dialog.component.scss']
})
export class IncomeDialogComponent implements OnInit {
  incomeForm:FormGroup

  constructor(private fb:FormBuilder){}

  ngOnInit(): void {
    this.incomegroup()
  }

  incomegroup(){
    this.incomeForm = this.fb.group({
      party:['',Validators.required],
      account:['',Validators.required],
      invoiceNo:['',Validators.required],
      invoicedate:new Date(),
      creditdate:new Date(),
      amount:['',Validators.required]
    })
  }


}
