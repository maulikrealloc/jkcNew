import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-design-master',
  templateUrl: './design-master.component.html',
  styleUrls: ['./design-master.component.scss']
})
export class DesignMasterComponent implements OnInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  
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

  constructor(private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.getDesignMasterData();
  }

  ngAfterViewInit(): void {
    this.designMasterListDataSource.paginator = this.paginator;
  }

  getDesignMasterData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'DesignMasterList').then((designMasters) => {
      this.designMaster = designMasters
      if (designMasters && designMasters.length > 0) {
        this.designMasterListDataSource = new MatTableDataSource(this.designMaster);
      } else {
        this.designMaster = [];
        this.designMasterListDataSource = new MatTableDataSource(this.designMaster);
      }
    }).catch((error) => {
      console.error('Error fetching designMasters:', error);
    });
  }

  addDesign(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(designMasterDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('CompanyList', result.data, 'DesignMasterList');
        this.getDesignMasterData();
      }
      if (result?.event === 'Edit') {
        this.firebaseCollectionService.updateDocument('CompanyList', obj.id, result.data, 'DesignMasterList');
        this.getDesignMasterData();
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'DesignMasterList');
        this.getDesignMasterData();
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
      this.designForm.controls['designNo'].setValue(this.local_data.designNo)
      this.designForm.controls['designPrice'].setValue(this.local_data.designPrice)
      this.designForm.controls['noStiching'].setValue(this.local_data.noStiching)
    }
  }

  formBuild() {
    this.designForm = this.fb.group({
      designNo: ['',Validators.required],
      designPrice: ['',Validators.required],
      noStiching: ['',Validators.required]
    })
  }

  doAction(): void {
    const payload = {
      designNo: this.designForm.value.designNo,
      designPrice: this.designForm.value.designPrice,
      noStiching: this.designForm.value.noStiching,
      imagePath: this.local_data.imagePath
    }
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