import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Validators_Pattern } from 'src/app/shared/constants/validators';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-firm-master',
  templateUrl: './firm-master.component.html',
  styleUrls: ['./firm-master.component.scss']
})
  
export class FirmMasterComponent implements OnInit {

  firmMasterColumns: string[] = [
    '#','header','subHeader','gstNo','gst','panNo','mobileNo','personalMobileNo','email','bankName','bankIFSC','bankAccountNo','address','action'
  ];
  firmList: any = [];
  firmMasterDataSource = new MatTableDataSource(this.firmList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.getFirmData();
  }

  applyFilter(filterValue: string): void {
    this.firmMasterDataSource.filter = filterValue.trim().toLowerCase();
  }

  generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getFirmData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'FirmList').then((firms) => {
      this.firmList = firms || [];
      this.firmMasterDataSource = new MatTableDataSource(this.firmList);
      this.firmMasterDataSource.paginator = this.paginator;
    }).catch((error) => {
      console.error('Error fetching firms:', error);
    });
  }

  openFirmMaster(action: string, obj: any) {
    const dialogRef = this.dialog.open(firmMasterDialogComponent, {
      data: { ...obj, action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        const { event, data } = result;
        const { id } = obj;
        const collection = 'FirmList';

        event === 'Add' && this.firebaseCollectionService.addDocument('CompanyList', data, collection);
        event === 'Edit' && this.firebaseCollectionService.updateDocument('CompanyList', id, data, collection);
        event === 'Delete' && this.firebaseCollectionService.deleteDocument('CompanyList', id, collection);

        this.getFirmData();
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
  }

  ngOnInit(): void {
    this.formBuild();
  }

  formBuild() {
    this.firmForm = this.fb.group({
      header: ['', [Validators.required, Validators.pattern(Validators_Pattern.NAME)]],
      subHeader: ['', Validators.required],
      address: ['', Validators.required],
      GSTNo: ['', [Validators.pattern(Validators_Pattern.GST_NUMBER)]],
      gstPercentage: ['', [Validators.pattern(Validators_Pattern.POINT_NUMBER)]],
      panNo: ['', [Validators.pattern(Validators_Pattern.PAN_NUMBER)]],
      mobileNO: ['', [Validators.required, Validators.pattern(Validators_Pattern.MOBILE)]],
      personalMobileNo: ['', [Validators.required, Validators.pattern(Validators_Pattern.MOBILE)]],
      email: ['', [Validators.email]],
      bankName: ['', [Validators.pattern(Validators_Pattern.NAME)]],
      ifscCode: ['', [Validators.pattern(Validators_Pattern.NAME_NUMBER)]],
      bankAccountNo: ['', [Validators.pattern(Validators_Pattern.NUMBER)]],
    })

    if (this.local_data?.action === 'Edit') {
      this.firmForm.patchValue(this.local_data)
    }
  }

  saveFirm(): void {
    const payload = this.firmForm.value;
    this.dialogRef.close({ event: this.local_data?.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}