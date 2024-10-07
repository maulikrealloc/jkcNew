import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-kharch-master',
  templateUrl: './kharch-master.component.html',
  styleUrls: ['./kharch-master.component.scss']
})
export class KharchMasterComponent {
  kharchForm: FormGroup;
  isEditMode = false;
  currentEditIndex: number | null = null;
  currentListType: string = '';

  kharchMasterColumns: string[] = [
    'srNo',
    'name',
    'action',
  ];

  unitData: any = [];
  kharchData: any = [];


  unitDataSource = new MatTableDataSource(this.unitData);
  kharchDataSource = new MatTableDataSource(this.kharchData);

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
        this.unitData.push({
          id: this.unitData.length + 1,
          name: Value.name
        });
        this.unitDataSource.data = this.unitData;
      } else if (Value.unitKharch === 'kharch') {
        this.kharchData.push({
          id: this.kharchData.length + 1,
          name: Value.name
        });
        this.kharchDataSource.data = this.kharchData;
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
