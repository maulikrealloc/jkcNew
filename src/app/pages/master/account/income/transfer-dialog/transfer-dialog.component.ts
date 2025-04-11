import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  styleUrls: ['./transfer-dialog.component.scss']
})

export class TransferDialogComponent implements OnInit {

  transferForm: FormGroup;
  companyAccountList: any = [];

  constructor(private fb: FormBuilder, private commonService: CommonService) { }

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

}