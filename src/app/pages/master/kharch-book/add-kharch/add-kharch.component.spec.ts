import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKharchComponent } from './add-kharch.component';

describe('AddKharchComponent', () => {
  let component: AddKharchComponent;
  let fixture: ComponentFixture<AddKharchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddKharchComponent]
    });
    fixture = TestBed.createComponent(AddKharchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
