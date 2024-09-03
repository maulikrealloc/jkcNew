import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KharchMasterComponent } from './kharch-master.component';

describe('KharchMasterComponent', () => {
  let component: KharchMasterComponent;
  let fixture: ComponentFixture<KharchMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KharchMasterComponent]
    });
    fixture = TestBed.createComponent(KharchMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
