import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  styleUrls: ['./transfer-dialog.component.scss']
})

export class TransferDialogComponent implements OnInit {

  transferForm: FormGroup;
  companyAccountList: any = [];

  constructor(private fb: FormBuilder, private firebaseCollectionService: FirebaseCollectionService) { }

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
    this.firebaseCollectionService.getDocuments('CompanyList', 'CompanyAccountList').then((company) => {
      if (company && company.length > 0) {
        this.companyAccountList = company
      }
    }).catch((error) => {
      console.error('Error fetching company:', error);
    });
  }

}