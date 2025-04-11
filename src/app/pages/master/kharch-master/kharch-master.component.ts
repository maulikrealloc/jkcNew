import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-kharch-master',
  templateUrl: './kharch-master.component.html',
  styleUrls: ['./kharch-master.component.scss']
})

export class KharchMasterComponent implements OnInit {

  kharchMasterDataColumns: string[] = ['srNo','name','action' ];
  kharchForm: FormGroup;
  isEditMode = false;
  currentListType: string = '';
  UnitDataList: any = [];
  KharchDataList: any = [];
  unitDataSource = new MatTableDataSource(this.UnitDataList);
  kharchDataSource = new MatTableDataSource(this.KharchDataList);

  constructor(private fb: FormBuilder, private commonService: CommonService, private firebaseCollectionService: FirebaseCollectionService,) { }

  ngOnInit(): void {
    this.buildForm();
    this.getunitList();
    this.getkharchList();
  }

  buildForm() {
    this.kharchForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      unitKharch: ['', Validators.required]
    });
  }

  submit() {
    if (this.kharchForm.valid) {
      const Value = this.kharchForm.value;

      if (Value.unitKharch === 'unit') {
        const unitpayload = this.kharchForm.value
        this.UnitDataList.push(unitpayload);
        this.unitDataSource.data = [...this.UnitDataList]; 
        this.firebaseCollectionService.addDocument('CompanyList', unitpayload, 'UnitDataList');
      }
      if (Value.unitKharch === 'kharch') {
        const kharchpayload = this.kharchForm.value
        this.KharchDataList.push(kharchpayload);
        this.kharchDataSource.data = [...this.KharchDataList];
        this.firebaseCollectionService.addDocument('CompanyList', kharchpayload, 'KharchDataList');
      }
      this.kharchForm.reset();
    }
  }


  editData(element: any, listType: string) {
    this.kharchForm.patchValue({
      name: element.name,
      unitKharch: listType
    });
    this.isEditMode = true;
    this.currentListType = listType;
  }

  deleteData(index: number, listType: string) {
    if (listType === 'unit') {
      this.UnitDataList.splice(index, 1);
      this.unitDataSource.data = [...this.UnitDataList];
    } else if (listType === 'kharch') {
      this.KharchDataList.splice(index, 1);
      this.kharchDataSource.data = [...this.KharchDataList];
    }
  }
  
 getunitList() {
   this.commonService.fetchData('UnitList', this.UnitDataList, this.unitDataSource);
  } 

  getkharchList() {
    this.commonService.fetchData('kharchList', this.KharchDataList, this.kharchDataSource);
  }

}