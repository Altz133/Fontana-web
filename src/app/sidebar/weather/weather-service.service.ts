import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  public humidity: number = 0;
  public temperature: number = 0;
  public windSpeed: number = 0;
  public isRaining: boolean = false;
  public rainHeight: number = 0;

  constructor(private httpClient: HttpClient) {
  }

  public updateWeather() {
    const url: string = "https://api.open-meteo.com/v1/forecast?latitude=53.4289&longitude=14.553&hourly=temperature_2m,relativehumidity_2m,rain,windspeed_10m&timeformat=unixtime&timezone=Europe%2FBerlin&forecast_days=1";

    this.httpClient.get(url).subscribe(response => {
      if (response.hasOwnProperty("hourly")) {
        let date = new Date();
        let data: any = response;
        let index: number = date.getHours();

        this.temperature = data["hourly"]["temperature_2m"][index]
        this.humidity = data["hourly"]["relativehumidity_2m"][index]
        this.rainHeight = data["hourly"]["rain"][index]
        this.windSpeed = data["hourly"]["windspeed_10m"][index]
        this.isRaining = this.rainHeight > 0;
      }
    });
  }
}
