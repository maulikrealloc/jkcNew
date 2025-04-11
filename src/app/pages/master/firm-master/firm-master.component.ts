import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Validators_Pattern } from 'src/app/shared/constants/validators';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-firm-master',
  templateUrl: './firm-master.component.html',
  styleUrls: ['./firm-master.component.scss']
})
  
export class FirmMasterComponent implements OnInit {

  firmMasterColumns: string[] = ['#','header','subHeader','gstNo','gst','panNo','mobileNo','personalMobileNo','email','bankName','bankIFSC','bankAccountNo','address','action' ];
  firmList: any = [];
  firmMasterDataSource = new MatTableDataSource(this.firmList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.getFirmData();
  }

  ngAfterViewInit() {
    this.firmMasterDataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.firmMasterDataSource.filter = filterValue.trim().toLowerCase();
  }

  generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getFirmData() {
    this.commonService.fetchData('FirmList', this.firmList, this.firmMasterDataSource);
  }

  openFirmMaster(action: string, obj: any) {
    const dialogRef = this.dialog.open(firmMasterDialogComponent, {
      data: { ...obj, action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'FirmList').then(() => this.getFirmData()).catch(console.error);
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
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.formBuild(this.action === 'Edit' ? this.local_data : undefined);
  }

  formBuild(data:any) {
    this.firmForm = this.fb.group({
      header: [data ? data?.header : '', [Validators.required, Validators.pattern(Validators_Pattern.NAME)]],
      subHeader: [data ? data?.subHeader : '', Validators.required],
      address: [data ? data?.address : '', Validators.required],
      GSTNo: [data ? data?.GSTNo : '', [Validators.pattern(Validators_Pattern.GST_NUMBER)]],
      gstPercentage: [data ? data?.gstPercentage : '', [Validators.pattern(Validators_Pattern.POINT_NUMBER)]],
      panNo: [data ? data?.panNo : '', [Validators.pattern(Validators_Pattern.PAN_NUMBER)]],
      mobileNO: [data ? data?.mobileNO : '', [Validators.required, Validators.pattern(Validators_Pattern.MOBILE)]],
      personalMobileNo: [data ? data?.personalMobileNo : '', [Validators.required, Validators.pattern(Validators_Pattern.MOBILE)]],
      email: [data ? data?.email : '', [Validators.email]],
      bankName: [data ? data?.bankName : '', [Validators.pattern(Validators_Pattern.NAME)]],
      ifscCode: [data ? data?.ifscCode : '', [Validators.pattern(Validators_Pattern.NAME_NUMBER)]],
      bankAccountNo: [data ? data?.bankAccountNo : '', [Validators.pattern(Validators_Pattern.NUMBER)]],
    })
  }

  saveFirm(): void {
    const payload = this.firmForm.value;
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}