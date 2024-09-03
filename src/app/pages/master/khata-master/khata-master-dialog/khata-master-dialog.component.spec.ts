import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhataMasterDialogComponent } from './khata-master-dialog.component';

describe('KhataMasterDialogComponent', () => {
  let component: KhataMasterDialogComponent;
  let fixture: ComponentFixture<KhataMasterDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KhataMasterDialogComponent]
    });
    fixture = TestBed.createComponent(KhataMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
