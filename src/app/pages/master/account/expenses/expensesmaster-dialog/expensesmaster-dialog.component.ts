import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-expensesmaster-dialog',
  templateUrl: './expensesmaster-dialog.component.html',
  styleUrls: ['./expensesmaster-dialog.component.scss']
})

export class ExpensesmasterDialogComponent implements OnInit {

  expensesMasterForm: FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.expensesMasterData()
  }

  expensesMasterData() {
    this.expensesMasterForm = this.fb.group({
      type: ['', Validators.required]
    })
  }

}
