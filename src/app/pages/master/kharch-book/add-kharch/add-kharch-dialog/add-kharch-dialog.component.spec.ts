import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKharchDialogComponent } from './add-kharch-dialog.component';

describe('AddKharchDialogComponent', () => {
  let component: AddKharchDialogComponent;
  let fixture: ComponentFixture<AddKharchDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddKharchDialogComponent]
    });
    fixture = TestBed.createComponent(AddKharchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
