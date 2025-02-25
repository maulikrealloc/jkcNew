import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { partyMasterDialogComponent } from '../../party-master/party-master.component';

@Component({
  selector: 'app-row-material-dialog',
  templateUrl: './row-material-dialog.component.html',
  styleUrls: ['./row-material-dialog.component.scss']
})
export class RowMaterialDialogComponent implements OnInit {

  rowMaterialForm: FormGroup;
  local_data: any;
  action: string;

  constructor(
    private fb: FormBuilder, public dialogRef: MatDialogRef<RowMaterialDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.rowMateriallist(this.action === 'Edit' ? this.local_data : undefined);
  }

  rowMateriallist(data:any) {
    this.rowMaterialForm = this.fb.group({
      name: [data ? data?.name :'', Validators.required],
      quantity: [data ? data?.quantity :'', Validators.required],
      price: [data ? data?.price :'', Validators.required]
    })
  }

  doAction(): void {
    const payload = this.rowMaterialForm.value
    this.dialogRef.close({ event: this.action, data: payload })
  }

}