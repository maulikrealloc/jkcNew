import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

const employee = [
  {
    id: 1,
    name: 'Demo',
  }
];
@Component({
  selector: 'app-kharch-master',
  templateUrl: './kharch-master.component.html',
  styleUrls: ['./kharch-master.component.scss']
})
export class KharchMasterComponent {
  kharchForm: FormGroup;
  khataColumns: string[] = [
    '#',
    'name',
    'action',
  ];

  dataSource = new MatTableDataSource(employee);

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm() {
    this.kharchForm = this.fb.group({
      name: ['',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]],
      unitKharch: ['', Validators.required]
    })
  }

  submit() {

  }

}
