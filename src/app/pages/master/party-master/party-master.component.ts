import { AfterViewInit, Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-party-master',
  templateUrl: './party-master.component.html',
  styleUrls: ['./party-master.component.scss']
})
export class PartyMasterComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  displayedColumns: string[] = [
    'srno',
    'PartyName',
    'PartyGSTIN',
    'ChalanNo',
    'Address',
    'PartyPan',
    'PartyMobile',
    'action',
  ];

  employees: any = [
    {
      id: 1,
      partyName: 'Johnathan Deo',
      partyGSTIN: 'gstin343',
      chalanNoSeries: '22',
      FirmAddress: 'Royal plaza Simada Gam Surat',
      partyPanNo: 'ASDS2323',
      partyMobile: '0987654321'
    }
  ]

  dataSource: any = new MatTableDataSource(this.employees);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private dialog: MatDialog) { }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  addParty(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(partyMasterDialogComponent, { data: obj });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.employees.push({
          id: result.data.length + 1,
          partyName: result.data.partyName,
          partyGSTIN: result.data.partyGSTIN,
          chalanNoSeries: result.data.chalanNoSeries,
          FirmAddress: result.data.FirmAddress,
          partyPanNo: result.data.partyPanNo,
          partyMobile: result.data.partyMobile
        })
        this.dataSource = new MatTableDataSource(this.employees);
      }
      if (result?.event === 'Edit') {
        this.employees.forEach((element: any) => {
          if (element.id === result.data.id) {
            element.id = result.data.id
            element.partyName = result.data.partyName
            element.partyGSTIN = result.data.partyGSTIN
            element.chalanNoSeries = result.data.chalanNoSeries
            element.FirmAddress = result.data.FirmAddress
            element.partyPanNo = result.data.partyPanNo
            element.partyMobile = result.data.partyMobile
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
  selector: 'app-party-master-dialog',
  templateUrl: 'party-master-dialog.html',
  styleUrls: ['./party-master.component.scss']
})

export class partyMasterDialogComponent implements OnInit {
  partyForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<partyMasterDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.local_data = { ...data };
    this.action = this.local_data.action;
  }
  ngOnInit(): void {
    this.buildForm()
    if (this.action === 'Edit') {
      this.partyForm.controls['partyName'].setValue(this.local_data.partyName)
      this.partyForm.controls['FirmAddress'].setValue(this.local_data.FirmAddress)
      this.partyForm.controls['partyGSTIN'].setValue(this.local_data.partyGSTIN)
      this.partyForm.controls['chalanNoSeries'].setValue(this.local_data.chalanNoSeries)
      this.partyForm.controls['partyPanNo'].setValue(this.local_data.partyPanNo)
      this.partyForm.controls['partyMobile'].setValue(this.local_data.partyMobile)
    }
  }

  buildForm() {
    this.partyForm = this.fb.group({
      partyName: [''],
      FirmAddress: [''],
      partyGSTIN: [''],
      chalanNoSeries: [''],
      partyPanNo: [''],
      partyMobile: ['', Validators.pattern("[0-9]{0-10}")],
    })
  }

  doAction(): void {
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      partyName: this.partyForm.value.partyName,
      FirmAddress: this.partyForm.value.FirmAddress,
      partyGSTIN: this.partyForm.value.partyGSTIN,
      chalanNoSeries: this.partyForm.value.chalanNoSeries,
      partyPanNo: this.partyForm.value.partyPanNo,
      partyMobile: this.partyForm.value.partyMobile
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}