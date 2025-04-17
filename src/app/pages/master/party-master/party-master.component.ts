import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Validators_Pattern } from 'src/app/shared/constants/validators';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-party-master',
  templateUrl: './party-master.component.html',
  styleUrls: ['./party-master.component.scss']
})

export class PartyMasterComponent implements OnInit {

  partyDataColumns: string[] = ['srNo', 'partyName', 'partyGstIn', 'chalanNo', 'address', 'partyPan', 'partyMobile', 'action',];
  partyList: any = []
  partyMasterDataSource: any = new MatTableDataSource(this.partyList);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  constructor(private dialog: MatDialog,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.getPartyData()
  }

  ngAfterViewInit() {
    this.partyMasterDataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.partyMasterDataSource.filter = filterValue.trim().toLowerCase();
  }

  getPartyData() {
    this.commonService.fetchData('PartyList', this.partyList, this.partyMasterDataSource);
  }

  addParty(action: string, obj: any) {
    const dialogRef = this.dialog.open(partyMasterDialogComponent, {
      data: { ...obj, action,existingSeries: this.partyList.map((p :any)=> p.chalanNoSeries) },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event) {
        this.commonService.commonApiCalled(result, obj, 'PartyList').then(() => this.getPartyData()).catch(console.error);
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
  existingSeries: string[] = [];
  colorCode: any = [
    {bgColor: '#9370DB',fontColor: '#ffffff'},
    {bgColor: '#00008B',fontColor: '#ffffff'},
    {bgColor: '#008B8B',fontColor: '#ffffff'},
    {bgColor: '#8B008B',fontColor: '#ffffff'},
    {bgColor: '#483D8B',fontColor: '#ffffff'},
    {bgColor: '#20B2AA',fontColor: '#ffffff'},
    {bgColor: '#DDA0DD',fontColor: '#020202'},
    {bgColor: '#87CEEB',fontColor: '#020202'},
    {bgColor: '#40E0D0',fontColor: '#020202'},
    {bgColor: '#9ACD32',fontColor: '#020202'}
  ]

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<partyMasterDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.existingSeries = this.local_data.existingSeries || [];
  }

  ngOnInit(): void {
    this.buildForm(this.action === 'Edit' ? this.local_data : undefined)
  }

  buildForm(data:any) {
    this.partyForm = this.fb.group({
      firstName: [data ? data?.firstName : '', [Validators.required, Validators.pattern(Validators_Pattern.NAME)]],
      lastName: [data ? data?.lastName : '', [Validators.pattern(Validators_Pattern.NAME)]],
      partyAddress: [data ? data?.partyAddress : ''],
      partyGSTIN: [data ? data?.partyGSTIN : '', [Validators.pattern(Validators_Pattern.GST_NUMBER)]],
      chalanNoSeries: [data ? data?.chalanNoSeries : '', [Validators.pattern(Validators_Pattern.NUMBER), this.validateSeriesUnique.bind(this)]],
      partyPanNo: [data ? data?.partyPanNo : '', [Validators.pattern(Validators_Pattern.PAN_NUMBER)]],
      partyMobile: [data ? data?.partyMobile : '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      partyColorCode: ['']
    });
  }
  
  validateSeriesUnique(control: AbstractControl): ValidationErrors | null {
    if (this.action === 'Edit' && control.value === this.local_data.chalanNoSeries) {
      return null; 
    }

    if (this.existingSeries.includes(control.value)) {
      return { seriesExists: true };
    }
    return null;
  }
  
  doAction(): void {
    const payload = this.partyForm.value
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}