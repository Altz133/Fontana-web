import { Injectable } from '@angular/core';
import { PumpDTO } from '../live-controller/dtos/pump-dto';
import { LedDTO } from '../live-controller/dtos/led-dto';
import { FoamDTO } from '../live-controller/dtos/foam-dto';
import { LightDTO } from '../live-controller/dtos/light-dto';
import { JetDTO } from '../live-controller/dtos/jet-dto';
import { BackendRequestService } from './backend-request.service';
import { API_CONFIG } from '../api-config/api-config';
import { map, Observable } from 'rxjs';
import { DevicesDto } from '../live-controller/dtos/devices.dto';
import { DeviceNameEnum } from '../shared/enums/device-name.enum';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private jsonResponse: Observable<any> = this.backendService.requestGET(
    API_CONFIG.CURRENT_STATE
  );

  constructor(private backendService: BackendRequestService) {}

  public getCurrentState(): Observable<DevicesDto> {
    return this.jsonResponse.pipe(map((data) => this.decipher(data)));
  }

  private decipher(data: any[]): DevicesDto {
    let jets: JetDTO[] = [];
    let pumps: PumpDTO[] = [];
    let leds: LedDTO[] = [];
    let foams: FoamDTO[] = [];
    let lights: LightDTO[] = [];

    for (let item of data) {
      switch (item.name) {
        case DeviceNameEnum.angleJet4:
        case DeviceNameEnum.angleJet3:
        case DeviceNameEnum.angleJet2:
        case DeviceNameEnum.angleJet1:
        case DeviceNameEnum.verticalJet3:
        case DeviceNameEnum.verticalJet2:
        case DeviceNameEnum.verticalJet1:
          jets.push(item);
          break;
        case DeviceNameEnum.foam1:
        case DeviceNameEnum.foam2:
        case DeviceNameEnum.foam3:
          foams.push(item);
          break;
        case DeviceNameEnum.ledStrip:
          leds.push(item);
          break;
        case DeviceNameEnum.light1:
        case DeviceNameEnum.light2:
        case DeviceNameEnum.light3:
          lights.push(item);
          break;
        case DeviceNameEnum.pump1:
        case DeviceNameEnum.pump2:
          pumps.push(item);
          break;
        default:
      }
    }
    return {
      jets,
      pumps,
      leds,
      foams,
      lights,
    };
  }
}
