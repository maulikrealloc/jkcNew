import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusListDialogComponent } from './bonus-list-dialog.component';

describe('BonusListDialogComponent', () => {
  let component: BonusListDialogComponent;
  let fixture: ComponentFixture<BonusListDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BonusListDialogComponent]
    });
    fixture = TestBed.createComponent(BonusListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
