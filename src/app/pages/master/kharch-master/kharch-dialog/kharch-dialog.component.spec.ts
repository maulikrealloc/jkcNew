import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KharchDialogComponent } from './kharch-dialog.component';

describe('KharchDialogComponent', () => {
  let component: KharchDialogComponent;
  let fixture: ComponentFixture<KharchDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KharchDialogComponent]
    });
    fixture = TestBed.createComponent(KharchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
