import { Injectable, OnInit } from '@angular/core';
import { ConfigurationVisualizationService } from './configuration-visualization.service';
import { PumpDTO } from '../dtos/pump-dto';
import { LiveControllerService } from './live-controller-service';
import { PUMP_TYPE } from '../../shared/models/constants/pump-type.const';
import { PumpType } from '../../shared/models/pump.type';
import { DeviceNameEnum } from '../../shared/enums/device-name.enum';
import { LiveControlDataTransferService } from './live-control-data-transfer.service';
import { TimelineBlocksService } from '../../services/timeline-blocks.service';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../services/config-service.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationValidationService {
  private verticalJets: boolean[] = [true, true, true];
  private angleJets: boolean[] = [true, true, true, true];
  private pump1Power: number = 0;
  private pump2Power: number = 0;
  private pumpMultiplier = 0.1;

  private isEditingToolon = false;

  private subsription!: Subscription;

  constructor(
    private visualizationService: ConfigurationVisualizationService,
    private liveControllerService: LiveControllerService,
    private dataTransferService: LiveControlDataTransferService,
    private blockService: TimelineBlocksService,
    private httpService: ConfigService
  ) {
    this.getEditingToolStatus();
    this.httpService.getPumpMultiplier().subscribe((response) => {
      this.pumpMultiplier = response.valueOf();
    });
  }

  public getVerticalJetsStatus(jets: boolean[]): void {
    for (let i = 0; i < this.verticalJets.length; i++) {
      this.verticalJets[i] = jets[i];
    }
    this.visualizationService.getNumberOfVerticalJetsOn(jets);
  }

  public getAngleJetsStatus(jets: boolean[]): void {
    for (let i = 0; i < this.angleJets.length; i++) {
      this.angleJets[i] = jets[i];
    }
  }

  public setPump1Power(power: number): number {
    this.pump1Power = power;
    power = this.calculateVerticalPumpPower(power, PUMP_TYPE.ANGLE);
    this.visualizationService.setPump1Power(power);
    return power;
  }

  public setPump2Power(power: number): number {
    this.pump2Power = power;
    power = this.calculateVerticalPumpPower(power, PUMP_TYPE.VERTICAL);
    this.visualizationService.setPump2Power(power);
    return power;
  }

  public jetChange(type: PumpType): void {
    if (type === PUMP_TYPE.VERTICAL) {
      const power = this.setPump2Power(this.pump2Power);
      this.updatePump(DeviceNameEnum.pump2, power, PUMP_TYPE.VERTICAL);
      this.visualizationService.verticalJetChange();
    } else {
      const power = this.setPump1Power(this.pump1Power);
      this.updatePump(DeviceNameEnum.pump1, power, PUMP_TYPE.ANGLE);
    }
  }

  public updatePump(name: string, value: number, type: PumpType): void {
    if (type === PUMP_TYPE.VERTICAL) {
      value = this.calculateVerticalPumpPower(value, PUMP_TYPE.VERTICAL);
    } else {
      value = this.calculateVerticalPumpPower(value, PUMP_TYPE.ANGLE);
    }
    const pumpDTO: PumpDTO = { name, value };

    if (this.isEditingToolon) {
      this.blockService.setPumps(pumpDTO);
    } else {
      this.liveControllerService.updatePump(pumpDTO);
    }
  }

  private calculateVerticalPumpPower(power: number, type: PumpType): number {
    let jetsOff = 0;
    let allJetsOff = false;

    if (type === PUMP_TYPE.VERTICAL) {
      jetsOff = this.verticalJets.filter((jet) => !jet).length;
      allJetsOff = jetsOff == this.verticalJets.length;
    } else {
      jetsOff = this.angleJets.filter((jet) => !jet).length;
      allJetsOff = jetsOff == this.angleJets.length;
    }

    if (power > 0 && !allJetsOff) {
      power -= power * (this.pumpMultiplier * jetsOff);
    } else {
      power = 0;
    }
    return power;
  }

  private getEditingToolStatus(): void {
    this.subsription = this.dataTransferService.editingTool$.subscribe(
      (tool) => {
        this.isEditingToolon = tool;
      }
    );
  }
}
