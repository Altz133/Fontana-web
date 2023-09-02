import { Injectable } from '@angular/core';
import { BlockType } from '../shared/models/block.type';
import { JetDTO } from '../live-controller/dtos/jet-dto';
import { PumpDTO } from '../live-controller/dtos/pump-dto';
import { LedDTO } from '../live-controller/dtos/led-dto';
import { LightDTO } from '../live-controller/dtos/light-dto';
import { FoamDTO } from '../live-controller/dtos/foam-dto';
import { BehaviorSubject, EMPTY, Observable, Subscription } from 'rxjs';
import { DeviceService } from './device.service';
import { API_CONFIG } from '../api-config/api-config';
import { BackendRequestService } from './backend-request.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class TimelineBlocksService {
  private block: BlockType;
  private blocks: BlockType[] = [];
  private lastCopiedBlock!: BlockType;
  private copiedColor!: string;
  private name!: string;
  private status!: string;
  private subsription!: Subscription;

  private blockAddedSubject = new BehaviorSubject<{
    rems: number;
    isCopy: boolean;
    index: number;
  }>({ rems: 0, isCopy: false, index: 0 });
  public blockAdded$ = this.blockAddedSubject.asObservable();

  private blockRemovedSubject = new BehaviorSubject<number>(0);
  public blockRemoved$ = this.blockRemovedSubject.asObservable();

  constructor(
    private deviceService: DeviceService,
    private backendRequestService: BackendRequestService,
    private snackBar: MatSnackBar
  ) {
    this.blocks.splice(0);
    this.block = {
      duration: 0,
      devices: {
        jets: [],
        pumps: [],
        leds: [],
        foams: [],
        lights: [],
      },
    };
    this.getCurrentState();
  }

  public setJets(jet: JetDTO): void {
    const existingJetIndex = this.block.devices.jets.findIndex(
      (j) => j.name === jet.name
    );

    if (existingJetIndex !== -1) {
      this.block.devices.jets[existingJetIndex] = jet;
    } else {
      this.block.devices.jets.push(jet);
    }
  }

  public setPumps(pump: PumpDTO): void {
    const existingPumpIndex = this.block.devices.pumps.findIndex(
      (p) => p.name === pump.name
    );

    if (existingPumpIndex !== -1) {
      this.block.devices.pumps[existingPumpIndex] = pump;
    } else {
      this.block.devices.pumps.push(pump);
    }
  }

  public setLeds(led: LedDTO): void {
    const existingLedIndex = this.block.devices.leds.findIndex(
      (l) => l.name === led.name
    );

    if (existingLedIndex !== -1) {
      this.block.devices.leds[existingLedIndex] = led;
    } else {
      this.block.devices.leds.push(led);
    }
  }

  public setFoams(foam: FoamDTO): void {
    const existingFoamIndex = this.block.devices.foams.findIndex(
      (f) => f.name === foam.name
    );

    if (existingFoamIndex !== -1) {
      this.block.devices.foams[existingFoamIndex] = foam;
    } else {
      this.block.devices.foams.push(foam);
    }
  }

  public setLights(light: LightDTO): void {
    const existingLightIndex = this.block.devices.lights.findIndex(
      (l) => l.name === light.name
    );

    if (existingLightIndex !== -1) {
      this.block.devices.lights[existingLightIndex] = light;
    } else {
      this.block.devices.lights.push(light);
    }
  }

  public setDuration(duraiton: number): void {
    this.block.duration = duraiton;
  }

  public saveBlock(): void {
    const newBlock = JSON.parse(JSON.stringify(this.block));
    console.log(newBlock);
    this.blocks.push(newBlock);
  }

  public copyBlock(block: BlockType, rems: number, color: string): void {
    const newBlock = JSON.parse(JSON.stringify(block));
    this.blocks.push(newBlock);
    this.lastCopiedBlock = block;
    this.addBlock(rems, true);
    this.copiedColor = color;
  }

  public addBlock(rems: number, isCopy: boolean): void {
    let index = 0;
    if (isCopy) {
      index = this.blocks.length - 1;
    } else {
      index = this.blocks.length;
    }
    this.blockAddedSubject.next({ rems, isCopy, index });
  }

  public moveBlock(prevIndex: number, currIndex: number): void {
    if (prevIndex === currIndex) {
      return;
    }

    const movedBlock = this.blocks.splice(prevIndex, 1)[0];
    this.blocks.splice(currIndex, 0, movedBlock);
  }

  public getBlock(): BlockType {
    return JSON.parse(JSON.stringify(this.block));
  }

  public getCopyBlock(): BlockType {
    return JSON.parse(JSON.stringify(this.lastCopiedBlock));
  }

  public getColor(): string {
    return this.copiedColor;
  }

  public getIndex(): number {
    return this.blocks.length - 1;
  }

  public saveTemplate(): Observable<any> {
    if (this.blocks.length === 0) {
      this.emptyTemplateAlert();
      return EMPTY;
    }
    return this.backendRequestService.requestPOST(
      `${API_CONFIG.POST_TEMPLATE}`,
      { name: this.name, status: this.status, snapshots: this.blocks }
    );
  }

  public deleteBlock(index: number) {
    this.blockRemovedSubject.next(index);
    this.blocks.splice(index, 1);
  }

  public getName(name: string): void {
    this.name = name;
  }

  public getStatus(status: string): void {
    this.status = status;
  }

  private getCurrentState(): void {
    this.subsription = this.deviceService
      .getCurrentState()
      .subscribe((device) => {
        this.block.devices = device;
      });
  }

  private emptyTemplateAlert() {
    this.snackBar.open("Can't save empty template", 'Close', {
      duration: 2000,
    });
  }
}
