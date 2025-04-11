import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditchalanComponent } from './editchalan.component';

describe('EditchalanComponent', () => {
  let component: EditchalanComponent;
  let fixture: ComponentFixture<EditchalanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditchalanComponent]
    });
    fixture = TestBed.createComponent(EditchalanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
