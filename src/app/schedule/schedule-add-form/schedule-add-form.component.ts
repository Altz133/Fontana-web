import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BackendRequestService} from "../../services/backend-request.service";
import {TemplateCardDto} from "../../shared/dtos/template-card-dto";
import {ScheduleDto} from "../../shared/dtos/schedule-dto";
import {CookieService} from "ngx-cookie-service";
import {SchedulePostDto} from "../../shared/dtos/schedule-post-dto";
import {CustomSnackbarService} from "../../services/custom-snackbar-service";
import {DateAdapter, MAT_DATE_LOCALE} from "@angular/material/core";
import {CustomDateAdapter} from "../CustomDateAdapter";
import {ScheduleUpdateService} from "../../services/schedule-update.service";

@Component({
  selector: 'app-schedule-add-form',
  templateUrl: './schedule-add-form.component.html',
  styleUrls: ['./schedule-add-form.component.scss'],
  providers: [{provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ]
})
export class ScheduleAddFormComponent {
  public name: string;
  public startDate: Date;
  public endDate: Date;
  public startTime: string;
  public isRecurring: boolean;
  public isRecurringForever: boolean;
  public loopsThroughTheDay: boolean;
  public selectedDays: string[];
  public isEnabled: boolean;
  public repetitions: number;
  public calculatedEndTime: String;

  public templateIds: number[];
  public templateNames: string[];
  public calculatedEndTimeSingularRepetition: number;

  @ViewChild('searchName') private searchName ?: ElementRef;

  private isEdit: boolean = false;

  public cards: TemplateCardDto[] = [];
  public page: number = 0;
  public pageSize: number = 4;
  public last: boolean = true;
  public first: boolean = true;
  public totalPages: number = 1;

  private updatedSuccessfullyMessage: string = "Schedule updated successfully";
  private addedSuccessfullyMessage: string = "Schedule added successfully";
  private somethingWentWrongMessage: string = "Something went wrong";
  private updateExceptionMessage: string = "Couldn't update schedule: ";
  private addingExceptionMessage: string = "Couldn't add schedule: "

  public minDate: Date = new Date();

  constructor(@Inject(MAT_DIALOG_DATA) public data: { selectedDate?: Date, scheduleDTO?: ScheduleDto },
              private backendService: BackendRequestService, private dialogRef: MatDialogRef<ScheduleAddFormComponent>,
              private cookieService: CookieService, private snackbar: CustomSnackbarService,
              private updateSchedules: ScheduleUpdateService
  ) {

    this.name = '';
    this.startDate = new Date();
    this.isRecurring = false;
    this.isRecurringForever = false;
    this.endDate = new Date();
    this.templateNames = [];
    this.startTime = '';
    this.calculatedEndTime = '00:00:00';
    this.repetitions = 1;
    this.loopsThroughTheDay = false;
    this.isEnabled = true;
    this.selectedDays = [];
    this.templateIds = [];
    this.calculatedEndTimeSingularRepetition = 0;

    if (data.scheduleDTO) {
      this.isEdit = true;

      this.name = data.scheduleDTO.name;
      this.startDate = data.scheduleDTO.startTime;
      this.endDate = new Date(this.startDate.getTime());
      this.isRecurringForever = data.scheduleDTO.endTime.getTime() == new Date(0).getTime();
      this.repetitions = data.scheduleDTO.repetitions;
      this.isRecurring = data.scheduleDTO.cycle;
      this.loopsThroughTheDay = data.scheduleDTO.repetitions == 0;
      this.isEnabled = data.scheduleDTO.enabled;
      this.selectedDays = data.scheduleDTO.cycleDays;

      this.startTime = String(data.scheduleDTO.startTime.getHours()).padStart(2, '0') + ':' + String(data.scheduleDTO.startTime.getMinutes()).padStart(2, '0') + ':' + String(data.scheduleDTO.startTime.getSeconds()).padStart(2, '0');

      this.templateIds = data.scheduleDTO.templateIds;
      this.templateNames = data.scheduleDTO.templateNames;
      this.calculateEndTime(data.scheduleDTO.length);

    } else if (data.selectedDate != null) {
      this.startDate = data.selectedDate;
      this.endDate = data.selectedDate;
    }
  }

  public ngOnInit(): void {
    this.search();
  }

  public submitForm(): void {

    let schedulePostDto;

    this.startDate.setHours(parseInt(this.startTime.split(":")[0]));
    this.startDate.setMinutes(parseInt(this.startTime.split(":")[1]));

    if (!this.isRecurring) {
      this.selectedDays = [];
    }

    if (this.loopsThroughTheDay) {
      this.repetitions = 0;
    }

    if (this.isEdit && this.data.scheduleDTO) {

      if (this.isRecurringForever) {
        SchedulePostDto
        schedulePostDto = new SchedulePostDto(
          this.data.scheduleDTO.id,
          this.name,
          this.cookieService.get("username"),
          this.startDate.getTime(),
          null,
          this.selectedDays,
          this.repetitions,
          this.templateIds,
          this.isEnabled
        );
      } else {
        SchedulePostDto
        schedulePostDto = new SchedulePostDto(
          this.data.scheduleDTO.id,
          this.name,
          this.cookieService.get("username"),
          this.startDate.getTime(),
          this.endDate.getTime(),
          this.selectedDays,
          this.repetitions,
          this.templateIds,
          this.isEnabled
        );
      }

    } else {

      if (this.isRecurringForever) {

        SchedulePostDto
        schedulePostDto = new SchedulePostDto(
          null,
          this.name,
          this.cookieService.get("username"),
          this.startDate.getTime(),
          null,
          this.selectedDays,
          this.repetitions,
          this.templateIds,
          this.isEnabled
        );
      } else {

        SchedulePostDto
        schedulePostDto = new SchedulePostDto(
          null,
          this.name,
          this.cookieService.get("username"),
          this.startDate.getTime(),
          this.endDate.getTime(),
          this.selectedDays,
          this.repetitions,
          this.templateIds,
          this.isEnabled
        );
      }
    }

    this.backendService.requestPostSchedule(schedulePostDto).subscribe(
      (response): void => {
        if (this.isEdit) {
          this.snackbar.openSnackBar(this.updatedSuccessfullyMessage)
        } else {
          this.snackbar.openSnackBar(this.addedSuccessfullyMessage)
        }

        this.updateSchedules.trigger()

        this.dialogRef.close();
      },
      (error): void => {
        if (error.hasOwnProperty("message")){
          if (this.isEdit) {
            this.snackbar.openSnackBar(this.updateExceptionMessage + error.error.message)
          } else {
            this.snackbar.openSnackBar(this.addingExceptionMessage + error.error.message)
          }
        }
        else{
        this.snackbar.openSnackBar(this.somethingWentWrongMessage)
        }
      }
    );

  }

  public calculateEndTime(length: number): void {

    this.calculatedEndTimeSingularRepetition += length;
    const calculatedTotalEndTimeInSeconds: number = this.calculatedEndTimeSingularRepetition * this.repetitions;
    let calculatedTotalEndTimeInSecondsTotal: number = calculatedTotalEndTimeInSeconds;

    if (this.startTime != '') {


      const startTimeInMinutes: number = parseInt(this.startTime.split(":")[0]) * 60 + parseInt(this.startTime.split(":")[1]);
      const startTimeInSeconds: number = startTimeInMinutes * 60 + parseInt(this.startTime.split(":")[2]);

      calculatedTotalEndTimeInSecondsTotal = startTimeInSeconds + calculatedTotalEndTimeInSeconds;

    }

    const calculatedTotalEndTimeInMinutes: number = Math.floor(calculatedTotalEndTimeInSecondsTotal / 60 % 60);
    const calculatedTotalEndTimeInRemainingSeconds: number = Math.floor(calculatedTotalEndTimeInSecondsTotal % 60);
    const calculatedTotalEndTimeInHours: number = Math.floor(calculatedTotalEndTimeInSecondsTotal / 3600);

    this.formatEndTime(calculatedTotalEndTimeInMinutes, calculatedTotalEndTimeInRemainingSeconds, calculatedTotalEndTimeInHours);

  }

  public formatEndTime(calculatedTotalEndTimeInMinutes: number, calculatedTotalEndTimeInRemainingSeconds: number, calculatedTotalEndTimeInHours: number): void {

    const formattedMinutes = String(calculatedTotalEndTimeInMinutes).padStart(2, '0');
    const formattedSeconds = String(calculatedTotalEndTimeInRemainingSeconds).padStart(2, '0');
    const formattedHours = String(calculatedTotalEndTimeInHours).padStart(2, '0');
    this.calculatedEndTime = this.loopsThroughTheDay ? 'No end time' : formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;

  }

  public search(): void {
    this.getTemplates(0, this.pageSize);
  }

  public getTemplates(page: number, pageSize: number): void {
    this.backendService.requestGetPublicTemplates(this.searchName?.nativeElement.value ?? "", page, pageSize).subscribe(
      (response) => {
        if (response.length != 0) {
          this.cards = response.content
          this.first = response.first;
          this.last = response.last;
          this.totalPages = response.totalPages;

          this.page = page;
        }
      },
      (error) => {

      }
    );
  }


  public choseCard(name: string, id: number, length: number): void {

    if (!this.templateIds.includes(id) || this.templateIds[this.templateIds.length - 1] !== id) {

      this.templateNames.push(name);
      this.templateIds.push(id);

      this.calculateEndTime(length);

    } else if (this.templateIds[this.templateIds.length - 1] == id) {
      this.templateIds.pop();
      this.templateNames.pop();

      this.calculateEndTime(-length);
    }

  }

  public isSelectedCard(id: number): boolean {
    return this.templateIds.includes(id);

  }

  public isSelectedDay(day: string): boolean {
    return this.selectedDays.includes(day);
  }

  public clearTemplates() {
    this.templateNames = [];
    this.templateIds = [];
    this.calculatedEndTimeSingularRepetition = 0;
    this.calculateEndTime(0);
  }

  public addDay(day: string) {
    if (!this.selectedDays.includes(day)) {
      this.selectedDays.push(day);
    } else {
      this.selectedDays.splice(this.selectedDays.indexOf(day), 1);
    }
  }

  public updateDefaultEndTime():void {
    this.endDate = new Date(this.startDate.getTime());
  }
}
