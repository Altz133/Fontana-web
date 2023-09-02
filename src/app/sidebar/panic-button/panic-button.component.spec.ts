import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanicButtonComponent } from './panic-button.component';

describe('PanicButtonComponent', () => {
  let component: PanicButtonComponent;
  let fixture: ComponentFixture<PanicButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanicButtonComponent]
    });
    fixture = TestBed.createComponent(PanicButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
