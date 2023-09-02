import {Component, Injectable, Input, OnInit} from '@angular/core';
import {ImagesPaths} from "../../shared/config/images-paths";
import {ScheduleAddFormService} from "../../services/schedule-add-form.service";
import {BackendRequestService} from "../../services/backend-request.service";
import {map} from "rxjs";
import {ScheduleDto} from "../../shared/dtos/schedule-dto";
import {AuthService} from "../../services/auth.service";
import {CustomSnackbarService} from "../../services/custom-snackbar-service";
import {ScheduleUpdateService} from "../../services/schedule-update.service";

@Component({
  selector: 'app-scheduling-array',
  templateUrl: './scheduling-array.component.html',
  styleUrls: ['./scheduling-array.component.scss']
})
export class SchedulingArrayComponent implements OnInit{
  @Input() selectedDateArray: Date | undefined;

  public imagesPaths: ImagesPaths = new ImagesPaths();

  public cardArray: ScheduleDto[] = [];
  public displayedCards: ScheduleDto[] = [];
  public pageSize: number = 4;
  public pageIndex: number = 0;
  public disableLeftArrow: boolean = true;
  public disableRightArrow: boolean = true;

  private previousSelectedDate: Date | undefined;

  public hasAuthority: boolean

  private readonly scheduleDeletedMessage = "Schedule deleted";
  private readonly scheduleStoppedMessage = "Schedule stopped";
  private readonly somethingWentWrongMessage = "Something went wrong";

  protected readonly Math = Math;
  public nullDate: number = new Date(0).getFullYear();

  constructor(private dialogService: ScheduleAddFormService,
              private backendRequestService: BackendRequestService,
              private authService: AuthService,
              private snackbar: CustomSnackbarService,
              private updateSchedules: ScheduleUpdateService
  ) {

    this.selectedDateArray = undefined;

    this.hasAuthority = authService.isAdmin() || authService.isOperator();
  }

  public ngOnInit() :void{
    this.updateSchedules.triggered().subscribe(
      () => this.fillCardArray()
    )
  }

  public openAddForm(): void {
    if (this.selectedDateArray != undefined) {
      this.dialogService.openAddForm(this.selectedDateArray);
    }
  }

  public stop(): void {
    this.backendRequestService.stopSchedule().subscribe(
      response => {

        this.fillCardArray();
        this.snackbar.openSnackBar(this.scheduleStoppedMessage);

      },
      error => {
        this.snackbar.openSnackBar(this.somethingWentWrongMessage);
      }
    );
  }

  public openEditForm(scheduleDto: ScheduleDto): void {
    this.dialogService.openEditForm(scheduleDto);
  }

  public delete(id: number) {
    this.backendRequestService.deleteSchedule(id).subscribe(
      response => {
        this.fillCardArray();
        this.snackbar.openSnackBar(this.scheduleDeletedMessage);
      },
      error => {
        this.snackbar.openSnackBar(this.somethingWentWrongMessage);
      }
    )
  }

  public isDateSelected(): boolean {
    if (this.selectedDateArray !== this.previousSelectedDate) {
      this.fillCardArray();
      this.loadDisplayedCards(this.selectedDateArray);
      this.previousSelectedDate = this.selectedDateArray;
    }
    return !!this.selectedDateArray;
  }

  public isDateGreaterEqualThanToday(): boolean {

    if (this.selectedDateArray === undefined) {
      return false;
    }

    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate: Date = new Date(this.selectedDateArray);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate >= today;
  }


  public fillCardArray(): void {
    if (this.selectedDateArray === undefined) {
      return;
    }

    this.pageIndex = 0;
    this.cardArray = []

    this.backendRequestService.getSchedulesByDate(this.selectedDateArray.getFullYear(),
      this.selectedDateArray.getMonth() + 1,
      this.selectedDateArray.getDate())
      .pipe(map(response => this.mapResponseToScheduleDtos(response))
      ).subscribe(response => {
      this.cardArray = response;
      this.loadDisplayedCards(this.selectedDateArray);
      this.checkifRightArrowDisabled();
    });

    this.updatePaginationArrows();
  }

  private loadDisplayedCards(selected: any): void {
    if (selected === undefined) {
      return;
    }
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedCards = this.cardArray.slice(startIndex, endIndex);
  }

  private mapResponseToScheduleDtos(response: any[]): ScheduleDto[] {
    return response.map(item => {

      return new ScheduleDto(
        item.id,
        item.name,
        item.username,
        new Date(item.startTime),
        new Date(item.endTime),
        item.length,
        item.repetitions,
        item.cycleDays,
        item.enabled,
        item.playing,
        item.cycle,
        item.templateIds,
        item.templateNames
      );
    });
  }

  public onPageChange(index: number): void {
    const newPageIndex = this.pageIndex + index;

    if (newPageIndex < 0 || newPageIndex >= this.getTotalPages()) {
      return;
    }

    this.pageIndex = newPageIndex;
    this.updatePaginationArrows();
    this.loadDisplayedCards(this.selectedDateArray);
  }

  private getTotalPages(): number {
    return Math.ceil(this.cardArray.length / this.pageSize);
  }

  private updatePaginationArrows(): void {
    this.disableLeftArrow = this.pageIndex === 0;
    this.disableRightArrow = this.pageIndex === this.getTotalPages() - 1;
  }

  private checkifRightArrowDisabled() {
    if (this.cardArray.length <= this.pageSize) {
      this.disableRightArrow = true;
    } else {
      this.disableRightArrow = false;
    }
  }
}
