import { JetDTO } from '../dtos/jet-dto';
import { PumpDTO } from '../dtos/pump-dto';
import { LightDTO } from '../dtos/light-dto';
import { LedDTO } from '../dtos/led-dto';
import { FoamDTO } from '../dtos/foam-dto';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackendRequestService } from '../../services/backend-request.service';
import { ActivityService } from '../../services/activity.service';
import { DialogWindowService } from '../../services/dialog-window.service';
import {API_CONFIG} from "../../api-config/api-config";
import {LogsService} from "../../services/logs.service";
import {DeviceType} from "../../shared/enums/device-type.enum";


@Injectable({
  providedIn: 'root',
})
export class LiveControllerService {
  constructor(
    private snackBar: MatSnackBar,
    private backendService: BackendRequestService,
    private activityService: ActivityService,
    private dialogWindowService: DialogWindowService,
    private logsService: LogsService
  ) {}

  public updateJet(jetDTO: JetDTO): void {
    this.updateDevice(
        API_CONFIG.UPDATE_JET,
      jetDTO,
      'Jet updated successfully!',
      'Error occurred while updating the jet.'
    );

    this.logsService.sendLogs(jetDTO, DeviceType.JET).subscribe();
  }

  public updatePump(pumpDTO: PumpDTO): void {
    this.updateDevice(
      API_CONFIG.UPDATE_PUMP,
      pumpDTO,
      'Pump updated successfully!',
      'Error occurred while updating the pump.'
    );

    this.logsService.sendLogs(pumpDTO, DeviceType.PUMP).subscribe();
  }


  public updateLight(lightDTO: LightDTO): void {
    this.updateDevice(
        API_CONFIG.UPDATE_LIGHT,
      lightDTO,
      'Light updated successfully!',
      'Error occurred while updating the light.'
    );

    this.logsService.sendLogs(lightDTO, DeviceType.LIGHT).subscribe();
  }

  public updateLed(ledDTO: LedDTO): void {
    this.updateDevice(
        API_CONFIG.UPDATE_LED,
      ledDTO,
      'LED updated successfully!',
      'Error occurred while updating the LED.'
    );

    this.logsService.sendLogs(ledDTO, DeviceType.LED).subscribe(
    );
  }

  public updateFoam(foamDTO: FoamDTO): void {
    this.updateDevice(
        API_CONFIG.UPDATE_JET,
      foamDTO,
      'Foam updated successfully!',
      'Error occurred while updating the foam.'
    );

    this.logsService.sendLogs(foamDTO, DeviceType.FOAM).subscribe();
  }

  private updateDevice(
    endpoint: string,
    dto: any,
    successMessage: string,
    errorMessage: string
  ) {
    this.activityService.activityDetected();
    this.backendService.requestLiveControlPOST(endpoint, dto).subscribe(
      (response): void => {
        this.snackBar.open(successMessage, 'Close', { duration: 3000 });
      },
      (error): void => {
        if (error.status === 403) {
          // this.dialogWindowService.redirectToDashboardDueToSessionClose();
        } else {
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      }
    );
  }
}
