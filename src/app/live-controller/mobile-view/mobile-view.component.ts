import { Component, OnInit } from '@angular/core';
import { ImagesPaths } from '../../shared/config/images-paths';
import { Subscription } from 'rxjs';
import { LiveControllerService } from '../service/live-controller-service';
import { ConfigurationVisualizationService } from '../service/configuration-visualization.service';
import { ConfigurationValidationService } from '../service/configuration-validation.service';
import { DeviceService } from '../../services/device.service';
import { DeviceNameEnum } from '../../shared/enums/device-name.enum';
import { PumpType } from '../../shared/models/pump.type';
import { PUMP_TYPE } from '../../shared/models/constants/pump-type.const';
import { LedDTO } from '../dtos/led-dto';
import { LightDTO } from '../dtos/light-dto';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LiveControlDataTransferService } from '../service/live-control-data-transfer.service';
import { JetDTO } from '../dtos/jet-dto';
import { TimelineBlocksService } from '../../services/timeline-blocks.service';

@Component({
  selector: 'app-mobile-view',
  templateUrl: './mobile-view.component.html',
  styleUrls: ['./mobile-view.component.scss'],
})
export class MobileViewComponent implements OnInit {
  [key: string]: any;

  public imagePaths = new ImagesPaths();

  public activeTab!: string;

  public ledStripColor = '#ffffff';
  public ledPower = 0;
  public whiteBrightness = 0;
  public stroboscopeEnabled = false;
  public stroboscopeFrequency = 0;

  public pump1Power = 0;
  public pump2Power = 0;

  public lightValue1 = false;
  public lightValue2 = false;
  public lightValue3 = false;

  public verticalJet1on = true;
  public verticalJet2on = true;
  public verticalJet3on = true;

  private readonly LIGHT_BASIC_COLOR = '#000000';

  public lightColor1 = this.LIGHT_BASIC_COLOR;
  public lightColor2 = this.LIGHT_BASIC_COLOR;
  public lightColor3 = this.LIGHT_BASIC_COLOR;

  public isEditingToolOn = false;

  private readonly MAX_POWER = 255;

  private subscription!: Subscription;

  constructor(
    private liveControllerService: LiveControllerService,
    private visService: ConfigurationVisualizationService,
    private validationService: ConfigurationValidationService,
    private deviceService: DeviceService,
    private dataTransferService: LiveControlDataTransferService,
    private blockService: TimelineBlocksService
  ) {}

  public ngOnInit(): void {
    this.getCurrentState();
    this.subscription = this.dataTransferService.editingTool$.subscribe(
      (editing) => {
        this.isEditingToolOn = editing;
      }
    );
  }

  public updateBorderColor(): void {
    this.visService.setColor(this.ledStripColor);
  }

  public updateSquareOpacity(): void {
    this.visService.setOpacity(this.ledPower / this.MAX_POWER);
  }

  public updateStroboscope(): void {
    this.visService.setStroboscope({
      enabled: this.stroboscopeEnabled,
      frequency: this.stroboscopeFrequency,
    });
  }

  public onPump1Change(): void {
    this.validationService.setPump1Power(this.pump1Power);
  }

  public onPump2Change(): void {
    this.validationService.setPump2Power(this.pump2Power);
  }

  public updateWhiteBrightness(): void {
    this.visService.setWhiteBrightness(this.whiteBrightness);
  }

  public pumpUp(number: number): void {
    const enumKey = `pump${number}` as keyof typeof DeviceNameEnum;
    const dbName = DeviceNameEnum[enumKey];
    let type: PumpType = PUMP_TYPE.VERTICAL;
    if (number == 1) {
      type = 'angle';
    }
    this.updatePump(dbName, this[`pump${number}Power`], type);
  }

  public lightColorUp(number: number): void {
    const enumKey = `light${number}` as keyof typeof DeviceNameEnum;
    const dbName = DeviceNameEnum[enumKey];
    this.updateLightBasedOnColor(dbName, this[`lightColor${number}`]);
  }

  public lightColorChange(number: number): void {
    let color = this.LIGHT_BASIC_COLOR;
    if (this.lightValue1 && number == 1) {
      color = this.lightColor1;
    } else if (this.lightValue2 && number == 2) {
      color = this.lightColor2;
    } else if (this.lightValue3 && number == 3) {
      color = this.lightColor3;
    }
    this.visService.getLightColor(number, color);
  }

  public sendLedUpdate(): void {
    const { r, g, b } = this.hexToRgb(this.ledStripColor);
    const ledDto: LedDTO = {
      name: DeviceNameEnum.ledStrip,
      colorR: r,
      colorG: g,
      colorB: b,
      colorW: this.whiteBrightness,
      power: this.ledPower,
      stroboscopeFrequency: this.stroboscopeFrequency,
    };
    if (this.isEditingToolOn) {
      this.blockService.setLeds(ledDto);
    } else {
      this.liveControllerService.updateLed(ledDto);
    }
  }

  public onTabChange(event: MatTabChangeEvent): void {
    this.activeTab = event.tab.textLabel;
    this.dataTransferService.getTabName(this.activeTab);
  }

  public updateVerticalJets(jetNumber: number): void {
    this.validationService.getVerticalJetsStatus([
      this.verticalJet1on,
      this.verticalJet2on,
      this.verticalJet3on,
    ]);
    this.validationService.jetChange(PUMP_TYPE.VERTICAL);
    const enumKey = `verticalJet${jetNumber}` as keyof typeof DeviceNameEnum;
    const dbName = DeviceNameEnum[enumKey];
    const jetDTO: JetDTO = {
      name: dbName,
      value: this[`verticalJet${jetNumber}on`],
    };
    if (this.isEditingToolOn) {
      this.blockService.setJets(jetDTO);
    } else {
      this.liveControllerService.updateJet(jetDTO);
    }
  }

  private rgbToHex(r: number, g: number, b: number): string {
    function componentToHex(c: number): string {
      let hex = c.toString(16);
      return hex.length == 1 ? '0' + hex : hex;
    }

    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  private updatePump(name: string, value: number, type: PumpType): void {
    this.validationService.updatePump(name, value, type);
  }

  private updateLightBasedOnColor(name: string, color: string): void {
    const { r, g, b } = this.hexToRgb(color);
    this.updateLight(name, r, g, b);
  }

  private updateLight(name: string, r: number, g: number, b: number): void {
    const lightDTO: LightDTO = {
      name,
      colorR: r,
      colorG: g,
      colorB: b,
    };
    if (this.isEditingToolOn) {
      this.blockService.setLights(lightDTO);
    } else {
      this.liveControllerService.updateLight(lightDTO);
    }
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  private getCurrentState(): void {
    this.subscription = this.deviceService
      .getCurrentState()
      .subscribe((devices) => {
        const verticalJetMappings = {
          verticalJet1on: DeviceNameEnum.verticalJet1,
          verticalJet2on: DeviceNameEnum.verticalJet2,
          verticalJet3on: DeviceNameEnum.verticalJet3,
        };

        for (const [key, value] of Object.entries(verticalJetMappings)) {
          const jet = devices.jets.find((j) => j.name === value);
          if (jet) {
            (this as any)[key] = jet.value;
          }
        }

        const ledMappings = {
          lightColor1: DeviceNameEnum.light3,
          lightColor2: DeviceNameEnum.light2,
          lightColor3: DeviceNameEnum.light1,
        };

        const pumpMappings = {
          pump1Power: DeviceNameEnum.pump1,
          pump2Power: DeviceNameEnum.pump2,
        };

        for (const [key, value] of Object.entries(pumpMappings)) {
          const pump = devices.pumps.find((p) => p.name === value);
          if (pump) {
            (this as any)[key] = pump.value;
          }
        }

        for (const [key, value] of Object.entries(ledMappings)) {
          const led = devices.lights.find((l) => l.name === value);
          if (led) {
            (this as any)[key] = this.rgbToHex(
              led.colorR,
              led.colorG,
              led.colorB
            );
          }
        }

        const led = devices.leds.find(
          (l) => l.name === DeviceNameEnum.ledStrip
        );

        if (led) {
          this.ledStripColor = this.rgbToHex(
            led.colorR,
            led.colorG,
            led.colorB
          );
          if (led.stroboscopeFrequency > 0) {
            this.stroboscopeEnabled = true;
            this.stroboscopeFrequency = led.stroboscopeFrequency;
          }
          this.whiteBrightness = led.colorW;
          this.ledPower = led.power;
        }

        this.updateVisualization();
      });
  }

  private updateVisualization(): void {
    this.updateBorderColor();
    this.updateSquareOpacity();
    this.updateStroboscope();
    this.onPump1Change();
    this.onPump2Change();
    this.updateWhiteBrightness();
    for (let i = 1; i < 4; i++) {
      this.lightColorChange(i);
    }
    if (this.lightColor1 !== this.LIGHT_BASIC_COLOR) {
      this.lightValue1 = true;
    }
    if (this.lightColor2 !== this.LIGHT_BASIC_COLOR) {
      this.lightValue2 = true;
    }
    if (this.lightColor3 !== this.LIGHT_BASIC_COLOR) {
      this.lightValue3 = true;
    }
  }
}
