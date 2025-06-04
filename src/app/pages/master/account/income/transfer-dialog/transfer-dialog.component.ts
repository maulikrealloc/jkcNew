import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  styleUrls: ['./transfer-dialog.component.scss']
})

export class TransferDialogComponent implements OnInit {

  transferForm: FormGroup;
  action: string;
  local_data: any;
  companyAccountList: any = [];

  constructor(private fb: FormBuilder,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<TransferDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.transfergroup();
    this.getCompanyAccountData();
  }

  transfergroup() {
    this.transferForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      amount: ['', Validators.required]
    })
  }

  getCompanyAccountData() {
    this.commonService.fetchData('CompanyAccountList', this.companyAccountList);
  }

  submit() {
    const payload = this.transferForm.value;
    payload.date = new Date();
    this.dialogRef.close({ event: this.action, data: payload })
  }

}