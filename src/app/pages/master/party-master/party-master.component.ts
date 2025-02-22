import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Validators_Pattern } from 'src/app/shared/constants/validators';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-party-master',
  templateUrl: './party-master.component.html',
  styleUrls: ['./party-master.component.scss']
})
  
export class PartyMasterComponent implements OnInit {

  partyDataColumns: string[] = ['srNo','partyName','partyGstIn','chalanNo','address','partyPan','partyMobile','action',];
  partyList: any = []
  partyMasterDataSource: any = new MatTableDataSource(this.partyList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.getPartyData()
  }

  applyFilter(filterValue: string): void {
    this.partyMasterDataSource.filter = filterValue.trim().toLowerCase();
  }

  getPartyData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'PartyList').then((party) => {
      this.partyList = party || [];
      this.partyMasterDataSource = new MatTableDataSource(this.partyList);
      this.partyMasterDataSource.paginator = this.paginator;
    }).catch((error) => {
      console.error('Error fetching party:', error);
    });
  }

  addParty(action: string, obj: any) {
    const dialogRef = this.dialog.open(partyMasterDialogComponent, {
      data: { ...obj, action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        const { event, data } = result;
        const { id } = obj;
        const collection = 'PartyList';

        event === 'Add' && this.firebaseCollectionService.addDocument('CompanyList', data, collection);
        event === 'Edit' && this.firebaseCollectionService.updateDocument('CompanyList', id, data, collection);
        event === 'Delete' && this.firebaseCollectionService.deleteDocument('CompanyList', id, collection);

        this.getPartyData();
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
  colorCode: any = [
    {
      bgColor: '#9370DB',
      fontColor: '#ffffff',
    },
    {
      bgColor: '#00008B',
      fontColor: '#ffffff',
    },
    {
      bgColor: '#008B8B',
      fontColor: '#ffffff',
    },
    {
      bgColor: '#8B008B',
      fontColor: '#ffffff',
    },
    {
      bgColor: '#483D8B',
      fontColor: '#ffffff',
    },
    {
      bgColor: '#20B2AA',
      fontColor: '#ffffff',
    },
    {
      bgColor: '#DDA0DD',
      fontColor: '#020202',
    },
    {
      bgColor: '#87CEEB',
      fontColor: '#020202',
    },
    {
      bgColor: '#40E0D0',
      fontColor: '#020202',
    },
    {
      bgColor: '#9ACD32',
      fontColor: '#020202',
    },
  ]

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<partyMasterDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
  }

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm() {
    this.partyForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(Validators_Pattern.NAME)]],
      lastName: ['', [Validators.pattern(Validators_Pattern.NAME)]],
      partyAddress: [''],
      partyGSTIN: ['', [Validators.pattern(Validators_Pattern.GST_NUMBER)]],
      chalanNoSeries: ['', [Validators.pattern(Validators_Pattern.NUMBER)]],
      partyPanNo: ['', [Validators.pattern(Validators_Pattern.PAN_NUMBER)]],
      partyMobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      partyColorCode: ['']
    });

    if (this.local_data?.action === 'Edit') {
      this.partyForm.patchValue(this.local_data)
    }
  }

  doAction(): void {
    const payload = this.partyForm.value
    this.dialogRef.close({ event: this.local_data?.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}