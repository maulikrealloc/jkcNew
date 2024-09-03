import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalListDialogComponent } from './withdrawal-list-dialog.component';

describe('WithdrawalListDialogComponent', () => {
  let component: WithdrawalListDialogComponent;
  let fixture: ComponentFixture<WithdrawalListDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WithdrawalListDialogComponent]
    });
    fixture = TestBed.createComponent(WithdrawalListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
