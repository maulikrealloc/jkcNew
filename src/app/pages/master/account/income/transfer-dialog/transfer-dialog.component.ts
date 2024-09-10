import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  styleUrls: ['./transfer-dialog.component.scss']
})
export class TransferDialogComponent implements OnInit {
  transferForm:FormGroup

  constructor(private fb:FormBuilder){}

  ngOnInit(): void {
    this.transfergroup ()
  }

transfergroup(){
  this.transferForm = this.fb.group({
    from:['',Validators.required],
    to:['',Validators.required],
    amount:['',Validators.required]
  })
}
}
