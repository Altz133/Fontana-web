import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleCardSnippetComponent } from './schedule-card-snippet.component';

describe('ScheduleCardSnippetComponent', () => {
  let component: ScheduleCardSnippetComponent;
  let fixture: ComponentFixture<ScheduleCardSnippetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleCardSnippetComponent]
    });
    fixture = TestBed.createComponent(ScheduleCardSnippetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
