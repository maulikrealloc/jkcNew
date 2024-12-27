import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChalanViewDialogComponent } from './chalan-view-dialog.component';

describe('ChalanViewDialogComponent', () => {
  let component: ChalanViewDialogComponent;
  let fixture: ComponentFixture<ChalanViewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChalanViewDialogComponent]
    });
    fixture = TestBed.createComponent(ChalanViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});