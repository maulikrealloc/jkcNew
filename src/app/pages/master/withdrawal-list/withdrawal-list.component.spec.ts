import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalListComponent } from './withdrawal-list.component';

describe('WithdrawalListComponent', () => {
  let component: WithdrawalListComponent;
  let fixture: ComponentFixture<WithdrawalListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WithdrawalListComponent]
    });
    fixture = TestBed.createComponent(WithdrawalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
