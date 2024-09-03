import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowMaterialDialogComponent } from './row-material-dialog.component';

describe('RowMaterialDialogComponent', () => {
  let component: RowMaterialDialogComponent;
  let fixture: ComponentFixture<RowMaterialDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RowMaterialDialogComponent]
    });
    fixture = TestBed.createComponent(RowMaterialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
