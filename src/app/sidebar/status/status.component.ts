import {Component} from '@angular/core';
import {WeatherService} from "../weather/weather-service.service";

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss', "../sidebar.component.scss"]
})
export class StatusComponent {
  canSchedule: boolean = (this.weatherService.rainHeight < 2 && this.weatherService.windSpeed < 40 && this.weatherService.temperature >= 1/* water may freeze */)

  constructor(public weatherService: WeatherService) {
  }
}
