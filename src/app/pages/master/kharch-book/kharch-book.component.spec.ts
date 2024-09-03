import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KharchBookComponent } from './kharch-book.component';

describe('KharchBookComponent', () => {
  let component: KharchBookComponent;
  let fixture: ComponentFixture<KharchBookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KharchBookComponent]
    });
    fixture = TestBed.createComponent(KharchBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
