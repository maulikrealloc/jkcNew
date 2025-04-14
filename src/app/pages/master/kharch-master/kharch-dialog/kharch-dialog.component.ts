import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-kharch-dialog',
  templateUrl: './kharch-dialog.component.html',
  styleUrls: ['./kharch-dialog.component.scss']
})
export class KharchDialogComponent implements OnInit {
  kharchForm: FormGroup;
  action: string;
  local_data: any;
  
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<KharchDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.kharchdata(this.action === 'Edit' ? this.local_data : undefined);
  }

  kharchdata(data: any) {
    this.kharchForm = this.fb.group({
      name: [data ? data?.name : '', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      unitKharch: [data ? data?.unitKharch : '', Validators.required]
    })
  }

  doAction() {
    const payload = this.kharchForm.value
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}

