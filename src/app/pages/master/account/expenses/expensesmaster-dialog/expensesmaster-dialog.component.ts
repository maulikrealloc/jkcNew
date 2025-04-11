import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-expensesmaster-dialog',
  templateUrl: './expensesmaster-dialog.component.html',
  styleUrls: ['./expensesmaster-dialog.component.scss']
})

export class ExpensesmasterDialogComponent implements OnInit {

  expensesMasterForm: FormGroup
  local_data: any;
  action: string;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<ExpensesmasterDialogComponent>,
    private commonService: CommonService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
}

  ngOnInit(): void {
    this.expensesMasterData()
  }

  expensesMasterData() {
    this.expensesMasterForm = this.fb.group({
      type: ['', Validators.required]
    })
  }

  doAction(): void {
    const payload = this.expensesMasterForm.value
    this.dialogRef.close({ event: this.action, data: payload });
  }

}
