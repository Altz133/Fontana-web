import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { API_CONFIG } from '../api-config/api-config';

import { BackendRequestService } from './backend-request.service';
import { Log } from '../shared/models/log.type';
import { FoamDTO } from '../live-controller/dtos/foam-dto';
import { LedDTO } from '../live-controller/dtos/led-dto';
import { LightDTO } from '../live-controller/dtos/light-dto';
import { PumpDTO } from '../live-controller/dtos/pump-dto';
import { JetDTO } from '../live-controller/dtos/jet-dto';
import { CookieService } from 'ngx-cookie-service';
import { DeviceType } from '../shared/enums/device-type.enum';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  private readonly BASE_URL = API_CONFIG.LOGS;
  private logsDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private backendService: BackendRequestService,
    private cookieService: CookieService,
    private userService: UserService
  ) {}

    public sendLogs(
        device: FoamDTO | LedDTO | LightDTO | PumpDTO | JetDTO,
        deviceType: DeviceType
    ): Observable<any> {
        const url: string = `${API_CONFIG.LOGS}`;
        const username = this.cookieService.get('username');
        const sessionIdString = this.cookieService.get('sessionId');
        const sessionId = Number(sessionIdString);
        return new Observable((observer) => {
            this.userService.getUserByLogged().subscribe(
                (user) => {
                    const log: Log = new Log(null, username, sessionId, new Date());

                    switch (deviceType) {
                        case DeviceType.PUMP:
                            log.deviceName = (device as PumpDTO).name;
                            log.deviceType = DeviceType.PUMP.toString()
                            log.deviceValue = (device as PumpDTO).value.toString();
                            break;
                        case DeviceType.FOAM:
                            log.deviceName = (device as FoamDTO).name;
                            log.deviceType = DeviceType.FOAM.toString()
                            log.deviceValue = (device as FoamDTO).value ? 'open' : 'closed';
                            break;
                        case DeviceType.LIGHT:
                            log.deviceName = (device as LightDTO).name;
                            log.deviceType = DeviceType.LIGHT.toString()
                            log.deviceValue = 'Value changed';
                            break;
                        case DeviceType.LED:
                            log.deviceName = (device as LedDTO).name;
                            log.deviceType = DeviceType.LED.toString()
                            log.deviceValue = 'Value changed';
                            break;
                        case DeviceType.JET:
                            log.deviceName = (device as JetDTO).name;
                            log.deviceType = DeviceType.JET.toString()
                            log.deviceValue = (device as JetDTO).value ? 'open' : 'closed';
                            break;
                    }

                    this.backendService.requestPOST(url, log).subscribe(
                        () => observer.next(),
                        (error) => observer.error(error)
                    );
                },
                (error) => {
                    console.error('Error fetching user:', error);
                    observer.error(error);
                }
            );
        });

    }

  getLogs(page: number = 0): Observable<any> {
    const url: string = `${this.BASE_URL}?page=${page}`;
    return this.backendService.requestGET(url).pipe(
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(error);
      })
    );
  }

  setLogs(data: any): void {
    this.logsDataSubject.next(data);
  }

  downloadAllLogs(): Observable<Blob> {
    return this.backendService
      .requestGETWithResponseType<Blob>(`${this.BASE_URL}/download/all`, 'blob')
      .pipe(
        catchError((error) => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }
}
