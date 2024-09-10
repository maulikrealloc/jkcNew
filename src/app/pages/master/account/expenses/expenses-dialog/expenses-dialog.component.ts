import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-expenses-dialog',
  templateUrl: './expenses-dialog.component.html',
  styleUrls: ['./expenses-dialog.component.scss']
})
export class ExpensesDialogComponent implements OnInit {
  expensesForm:FormGroup

  constructor(private fb:FormBuilder){}

  ngOnInit(): void {
    this.expensesdata()
  }
  
  expensesdata(){
    this.expensesForm = this.fb.group({
      expensesType:['',Validators.required],
      paidBy:['',Validators.required],
      date:new Date(),
      description:['',Validators.required],
      chalanNo:['',Validators.required],
      amount:['',Validators.required],
      status:['',Validators.required]
    })
  }


}
