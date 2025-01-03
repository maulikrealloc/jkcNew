import { AfterViewInit, Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-party-master',
  templateUrl: './party-master.component.html',
  styleUrls: ['./party-master.component.scss']
})
  
export class PartyMasterComponent implements OnInit {

  partyDataColumns: string[] = [
    'srno',
    'PartyName',
    'PartyGSTIN',
    'ChalanNo',
    'Address',
    'PartyPan',
    'PartyMobile',
    'action',
  ];
  partyList: any = []
  partyMasterDataSource: any = new MatTableDataSource(this.partyList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog, private firebaseCollectionService: FirebaseCollectionService) { }

  ngOnInit(): void {
    this.partyMasterDataSource.paginator = this.paginator;
    this.getPartyData()
  }

  getPartyData() {
    this.firebaseCollectionService.getDocuments('CompanyList', 'PartyList').then((party) => {
      this.partyList = party
      if (party && party.length > 0) {
        this.partyMasterDataSource = new MatTableDataSource(this.partyList);
      } else {
        this.partyList = [];
        this.partyMasterDataSource = new MatTableDataSource(this.partyList);
      }
    }).catch((error) => {
      console.error('Error fetching party:', error);
    });
  }

  addParty(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(partyMasterDialogComponent, { data: obj });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('CompanyList', result.data, 'PartyList');
        this.getPartyData()
      }
      if (result?.event === 'Edit') {
        this.partyList.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('CompanyList', obj.id, result.data, 'PartyList');
            this.getPartyData()
          }
        });
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('CompanyList', obj.id, 'PartyList');
        this.getPartyData()
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
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.buildForm()
    if (this.action === 'Edit') {
      this.partyForm.controls['firstName'].setValue(this.local_data.firstName)
      this.partyForm.controls['lastName'].setValue(this.local_data.lastName)
      this.partyForm.controls['partyAddress'].setValue(this.local_data.partyAddress)
      this.partyForm.controls['partyGSTIN'].setValue(this.local_data.partyGSTIN)
      this.partyForm.controls['chalanNoSeries'].setValue(this.local_data.chalanNoSeries)
      this.partyForm.controls['partyPanNo'].setValue(this.local_data.partyPanNo)
      this.partyForm.controls['partyMobile'].setValue(this.local_data.partyMobile)
      this.partyForm.controls['partyColorCode'].setValue(this.local_data.partyColorCode)
    }
  }

  buildForm() {
    this.partyForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      lastName: [''],
      partyAddress: [''],
      partyGSTIN: [''],
      chalanNoSeries: [''],
      partyPanNo: [''],
      partyMobile: [''],
      partyColorCode: ['']
    })
  }

  doAction(): void {
    const payload = {
      firstName: this.partyForm.value.firstName,
      lastName: this.partyForm.value.lastName,
      partyAddress: this.partyForm.value.partyAddress,
      partyGSTIN: this.partyForm.value.partyGSTIN,
      chalanNoSeries: this.partyForm.value.chalanNoSeries,
      partyPanNo: this.partyForm.value.partyPanNo,
      partyMobile: this.partyForm.value.partyMobile,
      partyColorCode: this.partyForm.value.partyColorCode
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}