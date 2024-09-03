import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsentDialogComponent } from './absent-dialog.component';

describe('AbsentDialogComponent', () => {
  let component: AbsentDialogComponent;
  let fixture: ComponentFixture<AbsentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbsentDialogComponent]
    });
    fixture = TestBed.createComponent(AbsentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
