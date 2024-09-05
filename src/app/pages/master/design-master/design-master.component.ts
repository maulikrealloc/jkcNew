import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-design-master',
  templateUrl: './design-master.component.html',
  styleUrls: ['./design-master.component.scss']
})
export class DesignMasterComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  displayedColumns: string[] = [
    '#',
    'designNumber',
    'designPrice',
    'partyName',
    'action',
  ];
  employees: any = [
    {
      id: 1,
      designNo: 56,
      designPrice: '120/-',
      partyName: 'Party Name',
      imagePath: 'assets/images/profile/user-5.jpg',
    }
  ];
  dataSource = new MatTableDataSource(this.employees);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog) { }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(designMasterDialogComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.employees.push({
          id: result.data.length + 1,
          designNo: result.data.designNo,
          designPrice: result.data.designPrice,
          partyName: result.data.partyName,
          imagePath: result.data.imagePath,
        })
        this.dataSource = new MatTableDataSource(this.employees);
      }
      if (result?.event === 'Edit') {
        this.employees.forEach((element: any) => {
          if (element.id === result.data.id) {
            element.id = result.data.id
            element.designNo = result.data.designNo
            element.designPrice = result.data.designPrice
            element.partyName = result.data.partyName
            element.imagePath = result.data.imagePath
          }
        });
        this.dataSource = new MatTableDataSource(this.employees);
      }
      if (result?.event === 'Delete') {
        const allEmployeesData = this.employees
        this.employees = allEmployeesData.filter((id: any) => id.id !== result.data.id)
        this.dataSource = new MatTableDataSource(this.employees);
      }
    });
  }

}

@Component({
  selector: 'app-firm-master-dialog',
  templateUrl: 'design-master-dialog.html',
})

export class designMasterDialogComponent implements OnInit {

  designForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<designMasterDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.local_data = { ...data };
    this.action = this.local_data.action;

    if (this.local_data.imagePath === undefined) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }
  }
  ngOnInit(): void {
    this.formBuild()
    if (this.action === 'Edit') {
      this.designForm.controls['partyName'].setValue(this.local_data.partyName)
      this.designForm.controls['designNo'].setValue(this.local_data.designNo)
      this.designForm.controls['designPrice'].setValue(this.local_data.designPrice)
    }
  }

  formBuild() {
    this.designForm = this.fb.group({
      partyName: ['',Validators.required],
      designNo: ['',Validators.required],
      designPrice: ['',Validators.required]
    })
  }

  doAction(): void {
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      partyName: this.designForm.value.partyName,
      designNo: this.designForm.value.designNo,
      designPrice: this.designForm.value.designPrice,
    }
    this.dialogRef.close({ event: this.action, data: payload });
    console.log("designForm==============>>>>>>>>>>>>>>>>", payload);

  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      // this.msg = 'You must select an image';
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.msg = "Only images are supported";
      return;
    }
    // tslint:disable-next-line - Disables all
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // tslint:disable-next-line - Disables all
    reader.onload = (_event) => {
      // tslint:disable-next-line - Disables all
      this.local_data.imagePath = reader.result;
    };
  }
}