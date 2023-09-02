import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogYesNoOptionsComponent } from './dialog-yes-no-options.component';

describe('DialogYesNoOptionsComponent', () => {
  let component: DialogYesNoOptionsComponent;
  let fixture: ComponentFixture<DialogYesNoOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogYesNoOptionsComponent]
    });
    fixture = TestBed.createComponent(DialogYesNoOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
