import {Component, OnInit} from '@angular/core';
import {WeatherService} from "./weather-service.service";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss', "../sidebar.component.scss"]
})
export class WeatherComponent implements OnInit {
  constructor(public weatherService: WeatherService) {
  }

  ngOnInit() {
    this.weatherService.updateWeather()
  }
}
