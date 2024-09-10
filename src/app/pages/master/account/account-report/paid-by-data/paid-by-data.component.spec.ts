import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidByDataComponent } from './paid-by-data.component';

describe('PaidByDataComponent', () => {
  let component: PaidByDataComponent;
  let fixture: ComponentFixture<PaidByDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaidByDataComponent]
    });
    fixture = TestBed.createComponent(PaidByDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
