import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleCardsSnippetComponent } from './schedule-cards-snippet.component';

describe('ScheduleCardsSnippetComponent', () => {
  let component: ScheduleCardsSnippetComponent;
  let fixture: ComponentFixture<ScheduleCardsSnippetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleCardsSnippetComponent]
    });
    fixture = TestBed.createComponent(ScheduleCardsSnippetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
