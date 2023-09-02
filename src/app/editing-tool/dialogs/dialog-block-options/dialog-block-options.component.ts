import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceNameEnumEditorInfo} from "../../../shared/enums/device-name-editor-info.enum";
import { LightDTO } from '../../../live-controller/dtos/light-dto';
import { LedDTO } from '../../../live-controller/dtos/led-dto';

@Component({
  selector: 'app-dialog-block-options',
  templateUrl: './dialog-block-options.component.html',
  styleUrls: ['./dialog-block-options.component.scss'],
})
export class DialogBlockOptionsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  sortedJets = this.data.block.devices.jets.sort((a: any, b: any) => a.name.localeCompare(b.name)).reverse();

  public getDeviceName(name: string): string {
    const index = Object.values(DeviceNameEnumEditorInfo).indexOf(
      name as unknown as DeviceNameEnumEditorInfo
    );
    return Object.keys(DeviceNameEnumEditorInfo)[index];
  }

  public onOff(value: boolean): string {
    return value ? 'On' : 'Off';
  }

  public getRgbColor(light: LightDTO): string {
    return `rgb(${light.colorR}, ${light.colorG}, ${light.colorB})`;
  }

  public getRgbColorLED(light: LedDTO[]): string {
    const firstLight = light[0];
    return `rgb(${firstLight.colorR}, ${firstLight.colorG}, ${firstLight.colorB})`;
  }
}
