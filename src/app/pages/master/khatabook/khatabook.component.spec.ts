import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhatabookComponent } from './khatabook.component';

describe('KhatabookComponent', () => {
  let component: KhatabookComponent;
  let fixture: ComponentFixture<KhatabookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KhatabookComponent]
    });
    fixture = TestBed.createComponent(KhatabookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
