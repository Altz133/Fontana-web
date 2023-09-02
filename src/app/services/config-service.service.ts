import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {API_CONFIG} from 'src/app/api-config/api-config';
import {BackendRequestService} from "./backend-request.service";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private putUrlSensors: string = API_CONFIG.POST_API_VALIDATION_STATUS;
  private putUrlPumpMultiplier: string = API_CONFIG.POST_PUMP_POWER_MULTIPLIER

  private getUrlSensors: string = API_CONFIG.GET_API_VALIDATION_STATUS;
  private getUrlPumpMultiplier: string = API_CONFIG.GET_PUMP_POWER_MULTIPLIER;

  constructor(private backendService: BackendRequestService) {
  }

  public getSensorsStatus(): Observable<boolean> {
    return this.backendService.requestGET(this.getUrlSensors)
      .pipe(
        catchError(error => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }

  public getPumpMultiplier(): Observable<Number> {
    return this.backendService.requestGET(this.getUrlPumpMultiplier)
      .pipe(
        catchError(error => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }

  public putSensorsStatus(sensorsStatus: boolean): Observable<any> {
    return this.backendService.requestPUT(this.putUrlSensors, {sensorsStatus: sensorsStatus})
      .pipe(
        catchError(error => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }

  public putPumpMultiplier(pumpMultiplier: Number): Observable<any> {
    return this.backendService.requestPUT(this.putUrlPumpMultiplier, {pumpMultiplier: pumpMultiplier})
      .pipe(
        catchError(error => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }


}
