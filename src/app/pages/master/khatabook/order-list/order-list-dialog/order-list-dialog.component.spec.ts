import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListDialogComponent } from './order-list-dialog.component';

describe('OrderListDialogComponent', () => {
  let component: OrderListDialogComponent;
  let fixture: ComponentFixture<OrderListDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderListDialogComponent]
    });
    fixture = TestBed.createComponent(OrderListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
