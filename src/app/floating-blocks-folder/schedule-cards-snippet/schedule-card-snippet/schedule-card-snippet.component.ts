import { Component, Input } from '@angular/core';
import { ScheduleDto } from "../../../shared/dtos/schedule-dto";
import {ImagesPaths} from "../../../shared/config/images-paths";

@Component({
  selector: 'app-schedule-card-snippet',
  templateUrl: './schedule-card-snippet.component.html',
  styleUrls: ['./schedule-card-snippet.component.scss']
})
export class ScheduleCardSnippetComponent {

  @Input() public schedule?: ScheduleDto;
  public imagesPaths: ImagesPaths = new ImagesPaths();
  protected readonly Math = Math;

  public calculatedEndTime = '24:00:00';

  ngOnInit(): void {
    this.calculateEndTime();
  }

  public calculateEndTime(): void {
    if(this.schedule?.repetitions != 0 && this.schedule?.endTime != null){
      let endTime: Date  = new Date(this.schedule.startTime);

      let seconds: number = this.schedule?.length * this.schedule?.repetitions;

      endTime.setSeconds(seconds);

      this.calculatedEndTime = endTime.getHours().toString().padStart(2, '0') +
        ':' + endTime.getMinutes().toString().padStart(2, '0') +
        ':' + endTime.getSeconds().toString().padStart(2, '0');
    }

  }

  public midnightDuration():string {
    if(this.schedule){

      let startTime: Date  = new Date(this.schedule.startTime);
      let midnight: Date = new Date()
      midnight.setHours(24,0,0,0);

      let seconds: number = (midnight.getTime() - startTime.getTime()) / 1000;
      let hours: number = Math.floor(seconds / 3600);
      let minutes: number = Math.floor((seconds - (hours * 3600)) / 60);
      let secondsLeft: number = seconds - (hours * 3600) - (minutes * 60);

      return hours.toString() + ' Hrs ' + minutes.toString() + ' Min ' + secondsLeft.toString() + ' Sec';

    }
    return 'Untill the end of the day';
  }
}
