import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChalaneditDialogComponent } from './chalanedit-dialog.component';

describe('ChalaneditDialogComponent', () => {
  let component: ChalaneditDialogComponent;
  let fixture: ComponentFixture<ChalaneditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChalaneditDialogComponent]
    });
    fixture = TestBed.createComponent(ChalaneditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
