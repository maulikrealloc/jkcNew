import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-firm-master',
  templateUrl: './firm-master.component.html',
  styleUrls: ['./firm-master.component.scss']
})
export class FirmMasterComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  displayedColumns: string[] = [
    '#',
    'header',
    'Subheader',
    'GSTMo',
    'gst',
    'PanNo',
    'MobileNo',
    'PersonalMobileNo',
    'BankName',
    'BankIFSC',
    'BankAccountNo',
    'Address',
    'action',
  ];
  employees: any = [
    {
      id: 1,
      header: 'Johnathan Deo',
      subHeader: 'SeoExpert',
      GSTNo: '09876543',
      gstPercentage: '2.8%',
      panNo: 'gerwrer12000',
      mobileNO: '0987654321',
      personalMobileNo: '0987654321',
      bankName: 'SBI',
      ifscCode: 'vracha10e',
      bankAccountNo: 123332230,
      address: 'Silver Trade Mota Varacha Surat',
    }
  ];

  dataSource = new MatTableDataSource(this.employees);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog) { }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  addFirm(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(firmMasterDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.employees.push({
          id: result.data.length + 1,
          header: result.data.header,
          subHeader: result.data.subHeader,
          GSTNo: result.data.GSTNo,
          gstPercentage: result.data.gstPercentage,
          panNo: result.data.panNo,
          mobileNO: result.data.mobileNO,
          personalMobileNo: result.data.personalMobileNo,
          bankName: result.data.bankName,
          ifscCode: result.data.ifscCode,
          bankAccountNo: result.data.bankAccountNo,
          address: result.data.address
        })
        this.dataSource = new MatTableDataSource(this.employees);
      }
      if (result?.event === 'Edit') {
        this.employees.forEach((element: any) => {
          if (element.id === result.data.id) {
            element.id = result.data.id
            element.header = result.data.header
            element.subHeader = result.data.subHeader
            element.GSTNo = result.data.GSTNo
            element.gstPercentage = result.data.gstPercentage
            element.panNo = result.data.panNo
            element.mobileNO = result.data.mobileNO
            element.personalMobileNo = result.data.personalMobileNo
            element.bankName = result.data.bankName
            element.ifscCode = result.data.ifscCode
            element.bankAccountNo = result.data.bankAccountNo
            element.address = result.data.address
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
  templateUrl: 'firm-master-dialog.html',
  styleUrls: ['./firm-master.component.scss']
})


export class firmMasterDialogComponent implements OnInit {
  firmForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<firmMasterDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.local_data = { ...data };
    this.action = this.local_data.action;
  }
  ngOnInit(): void {
    this.formBuild()
    if (this.action === 'Edit') {
      this.firmForm.controls['header'].setValue(this.local_data.header)
      this.firmForm.controls['subHeader'].setValue(this.local_data.subHeader)
      this.firmForm.controls['address'].setValue(this.local_data.address)
      this.firmForm.controls['GSTNo'].setValue(this.local_data.GSTNo)
      this.firmForm.controls['gstPercentage'].setValue(this.local_data.gstPercentage)
      this.firmForm.controls['panNo'].setValue(this.local_data.panNo)
      this.firmForm.controls['mobileNO'].setValue(this.local_data.mobileNO)
      this.firmForm.controls['personalMobileNo'].setValue(this.local_data.personalMobileNo)
      this.firmForm.controls['bankName'].setValue(this.local_data.bankName)
      this.firmForm.controls['ifscCode'].setValue(this.local_data.ifscCode)
      this.firmForm.controls['bankAccountNo'].setValue(this.local_data.bankAccountNo)
    }
  }

  formBuild() {
    this.firmForm = this.fb.group({
      header: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]+$')]],
      subHeader: ['',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]],
      address: ['',Validators.required],
      GSTNo: [''],
      gstPercentage: [''],
      panNo: [''],
      mobileNO: ['',[Validators.required,Validators.pattern('^[0-9]{10}$')]],
      personalMobileNo: ['',[Validators.required,Validators.pattern('^[0-9]{10}$')]],
      bankName: [''],
      ifscCode: [''],
      bankAccountNo: [''],
    })
  }

  doAction(): void {
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      header: this.firmForm.value.header,
      subHeader: this.firmForm.value.subHeader,
      address: this.firmForm.value.address,
      GSTNo: this.firmForm.value.GSTNo,
      gstPercentage: this.firmForm.value.gstPercentage,
      panNo: this.firmForm.value.panNo,
      mobileNO: this.firmForm.value.mobileNO,
      personalMobileNo: this.firmForm.value.personalMobileNo,
      bankName: this.firmForm.value.bankName,
      ifscCode: this.firmForm.value.ifscCode,
      bankAccountNo: this.firmForm.value.bankAccountNo
    }
    this.dialogRef.close({ event: this.action, data: payload });

  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
