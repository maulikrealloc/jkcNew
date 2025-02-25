import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-design-master',
  templateUrl: './design-master.component.html',
  styleUrls: ['./design-master.component.scss']
})
export class DesignMasterComponent implements OnInit {

  designMasterColumns: string[] = [
    '#',
    'designNumber',
    'designPrice',
    'noStiching',
    'action',
  ];
  designMaster: any = [];
  designMasterListDataSource = new MatTableDataSource(this.designMaster);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog, private commonService: CommonService, private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.getDesignMasterData();
    this.designMasterListDataSource.paginator = this.paginator;
  }

  getDesignMasterData() {
    this.commonService.fetchData('DesignMasterList', this.designMaster, this.designMasterListDataSource);
  }

  openDesignMaster(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(designMasterDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'DesignMasterList').then(() => this.getDesignMasterData()).catch(console.error);
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
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    if (this.local_data.imagePath === undefined) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }
  }

  ngOnInit(): void {
    this.formBuild(this.action === 'Edit' ? this.local_data : undefined);
  }

  formBuild(data:any) {
    this.designForm = this.fb.group({
      designNo: [data ? data?.designNo : '', Validators.required],
      designPrice: [data ? data?.designPrice :'', Validators.required],
      noStiching: [data ? data?.noStiching : '', Validators.required],
    })
  }

  doAction(): void {
    const payload = this.designForm.value
    payload.imagePath = this.local_data.imagePath
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.local_data.imagePath = reader.result;
    };
  }

}