import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { partyMasterDialogComponent } from '../../party-master/party-master.component';

@Component({
  selector: 'app-row-material-dialog',
  templateUrl: './row-material-dialog.component.html',
  styleUrls: ['./row-material-dialog.component.scss']
})
export class RowMaterialDialogComponent {

  rowMaterialForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<RowMaterialDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.rowMaterialForm = this.fb.group({
      mateName: [''],
      mateAmount: ['']
    })


  }

  doAction(): void {
    const payload = {
      action: 'add',
      payload: {
        mateName: this.rowMaterialForm.value.mateName,
        mateAmount: this.rowMaterialForm.value.mateAmount
      }
    }
    this.dialogRef.close(payload)
  }
}
