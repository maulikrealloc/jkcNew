import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RowMaterialDialogComponent } from './row-material-dialog/row-material-dialog.component';

@Component({
  selector: 'app-row-material',
  templateUrl: './row-material.component.html',
  styleUrls: ['./row-material.component.scss']
})
export class RowMaterialComponent implements OnInit {

  materials: any = []
  constructor(private dialog: MatDialog) { }


  ngOnInit(): void {
    this.materials = [
      {
        materialName: 'demo',
        materialValue: 12
      },
      {
        materialName: 'demo',
        materialValue: 122
      },
      {
        materialName: 'demo',
        materialValue: 1222
      }
    ]

  }

  addRowMaterial() {

    const dialogRef = this.dialog.open(RowMaterialDialogComponent, {
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'add') {
        this.materials.push(
          {
            materialName: result.payload.mateName,
            materialValue: result.payload.mateAmount
          }
        )
      }
    });
  }

}
