import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-kharch-master',
  templateUrl: './kharch-master.component.html',
  styleUrls: ['./kharch-master.component.scss']
})

export class KharchMasterComponent implements OnInit {

  kharchMasterDataColumns: string[] = [
    'srNo',
    'name',
    'action',
  ];
  kharchForm: FormGroup;
  isEditMode = false;
  currentEditIndex: number | null = null;
  currentListType: string = '';
  unitDataList: any = [];
  kharchDataList: any = [];
  unitDataSource = new MatTableDataSource(this.unitDataList);
  kharchDataSource = new MatTableDataSource(this.kharchDataList);

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
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
        this.unitDataList.push({
          id: this.unitDataList.length + 1,
          name: Value.name
        });
        this.unitDataSource.data = this.unitDataList;
      } else if (Value.unitKharch === 'kharch') {
        this.kharchDataList.push({
          id: this.kharchDataList.length + 1,
          name: Value.name
        });
        this.kharchDataSource.data = this.kharchDataList;
      }
      this.kharchForm.reset();
    }
  }

  editData(element: any, index: number, listType: string) {
    this.kharchForm.patchValue({
      id: element.id,
      name: element.name,
      unitKharch: listType
    });
    this.isEditMode = true;
    this.currentEditIndex = index;
    this.currentListType = listType;
  }

  deleteData() {

  }

}