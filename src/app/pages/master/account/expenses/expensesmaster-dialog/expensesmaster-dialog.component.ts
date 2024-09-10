import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-expensesmaster-dialog',
  templateUrl: './expensesmaster-dialog.component.html',
  styleUrls: ['./expensesmaster-dialog.component.scss']
})
export class ExpensesmasterDialogComponent implements OnInit {

  expensesmasterForm:FormGroup

  constructor(private fb:FormBuilder){}

  ngOnInit(): void {
    this.expensesmasterdata()
  }

expensesmasterdata(){
  this.expensesmasterForm = this.fb.group({
    type:['',Validators.required]
  })
}

}
