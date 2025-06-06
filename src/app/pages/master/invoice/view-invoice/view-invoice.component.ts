import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { CommonService } from 'src/app/services/common.service';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit {
  local_data: any;

  constructor(public dialogRef: MatDialogRef<ViewInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ){ 
    this.local_data = data;
  }
  
  ngOnInit(): void { 
  }

}
