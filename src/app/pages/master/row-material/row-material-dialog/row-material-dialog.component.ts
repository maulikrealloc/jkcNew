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
    public dialogRef: MatDialogRef<RowMaterialDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.rowMateriallist()
    if (this.action === 'Edit') {
      this.rowMaterialForm.controls['name'].setValue(this.local_data.name)
      this.rowMaterialForm.controls['quantity'].setValue(this.local_data.quantity)
      this.rowMaterialForm.controls['price'].setValue(this.local_data.price)
    }
  }

  rowMateriallist(){
  this.rowMaterialForm = this.fb.group({
    name: ['',Validators.required],
    quantity: ['',Validators.required],
    price: ['',Validators.required]
    })
  }

  doAction(): void {
    const payload = {
        name: this.rowMaterialForm.value.name,
        quantity: this.rowMaterialForm.value.quantity,
        price: this.rowMaterialForm.value.price,
    }
    this.dialogRef.close({event: this.action, data: payload})
  }

}