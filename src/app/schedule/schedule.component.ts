import {Component, ViewChild} from '@angular/core';
import {MatCalendar, MatCalendarCellCssClasses, MatCalendarHeader} from "@angular/material/datepicker";
import {BackendRequestService} from "../services/backend-request.service";
import {DateAdapter, MAT_DATE_LOCALE} from "@angular/material/core";
import {CustomDateAdapter} from "./CustomDateAdapter";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [{provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class ScheduleComponent {

  public selectedDate: any;
  constructor() {}
}
