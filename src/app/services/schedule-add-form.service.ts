import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ScheduleAddFormComponent} from "src/app/schedule/schedule-add-form/schedule-add-form.component";
import {ScheduleDto} from "../shared/dtos/schedule-dto";
@Injectable({
  providedIn: 'root'
})
export class ScheduleAddFormService {


  constructor(private dialog:MatDialog) { }

  openAddForm(selected: Date):MatDialogRef<ScheduleAddFormComponent>{
    return this.dialog.open(ScheduleAddFormComponent, {
      height: '39rem',
      width: '52rem',
      autoFocus: true, // Set this to true if you want the first form field to be focused
      data: {selectedDate: selected }
    });
  }

  openEditForm(scheduleDTO : ScheduleDto):MatDialogRef<ScheduleAddFormComponent>{
    return this.dialog.open(ScheduleAddFormComponent, {
      height: '39rem',
      width: '52rem',
      autoFocus: false, // Set this to true if you want the first form field to be focused
      data: {scheduleDTO: scheduleDTO}
    });
  }
}
