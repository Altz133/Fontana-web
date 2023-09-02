import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ConfigurationVisualizationService } from '../service/configuration-visualization.service';
import { Subscription } from 'rxjs';
import { JetDTO } from '../dtos/jet-dto';
import { LiveControllerService } from '../service/live-controller-service';
import { FoamDTO } from '../dtos/foam-dto';
import { DeviceNameEnum } from '../../shared/enums/device-name.enum';
import { ImagesPaths } from '../../shared/config/images-paths';
import { ConfigurationValidationService } from '../service/configuration-validation.service';
import { PUMP_TYPE } from '../../shared/models/constants/pump-type.const';
import { PumpType } from '../../shared/models/pump.type';
import { DeviceService } from '../../services/device.service';
import { LiveControlDataTransferService } from '../service/live-control-data-transfer.service';
import { TimelineBlocksService } from '../../services/timeline-blocks.service';

@Component({
  selector: 'app-fountain',
  templateUrl: './fountain.component.html',
  styleUrls: ['./fountain.component.scss'],
})
export class FountainComponent implements OnInit, OnDestroy {
  public mobileView: boolean = true;
  public activeMobileTab = 'Angle Jets';

  public verticalJet1on = true;
  public verticalJet2on = true;
  public verticalJet3on = true;

  public angleJet1on = true;
  public angleJet2on = true;
  public angleJet3on = true;
  public angleJet4on = true;

  public angleJet1Direction = 'left';
  public angleJet2Direction = 'left';
  public angleJet3Direction = 'left';
  public angleJet4Direction = 'left';

  public foam1Enabled = false;
  public foam2Enabled = false;
  public foam3Enabled = false;

  public beamLevel = 0;

  public imagePaths = new ImagesPaths();

  private isEditingToolon = false;

  private subscription!: Subscription;
  private stroboscopeSubscription!: Subscription;
  private intervalId!: number;

  constructor(
    private liveControllerService: LiveControllerService,
    private visualizationService: ConfigurationVisualizationService,
    private validationService: ConfigurationValidationService,
    private deviceService: DeviceService,
    private dataTransferService: LiveControlDataTransferService,
    private el: ElementRef,
    private renderer: Renderer2,
    private blocksService: TimelineBlocksService
  ) {}

  public ngOnInit(): void {
    this.updateBeamLevel();

    this.getMobileTabName();

    this.getMobileView();

    this.getEditingToolStatus();

    this.subscription = this.visualizationService.color$.subscribe((color) => {
      let ledBorderRight =
        this.el.nativeElement.querySelector('.led-border-right');
      let ledBorderLeft =
        this.el.nativeElement.querySelector('.led-border-left');
      if (ledBorderRight && ledBorderLeft) {
        this.renderer.setStyle(ledBorderRight, 'borderColor', color);
        this.renderer.setStyle(
          ledBorderRight,
          'boxShadow',
          `0 0 1em ${color},inset 0 0 5em ${color}`
        );
        this.renderer.setStyle(ledBorderLeft, 'borderColor', color);
        this.renderer.setStyle(
          ledBorderLeft,
          'boxShadow',
          `0 0 1em ${color},inset 0 0 5em ${color}`
        );
      }
    });
    this.subscription = this.visualizationService.opacity$.subscribe(
      (opacity) => {
        let ledBorderRight =
          this.el.nativeElement.querySelector('.led-border-right');
        let ledBorderLeft =
          this.el.nativeElement.querySelector('.led-border-left');
        if (ledBorderRight && ledBorderLeft) {
          this.renderer.setStyle(ledBorderRight, 'opacity', opacity);
          this.renderer.setStyle(ledBorderLeft, 'opacity', opacity);
        }
      }
    );
    this.subscription = this.visualizationService.whiteBrightness$.subscribe(
      (opacity) => {
        let whiteBrightnessRight =
          this.el.nativeElement.querySelector('.led-white-right');
        let whiteBrightnessLeft =
          this.el.nativeElement.querySelector('.led-white-left');
        if (whiteBrightnessLeft && whiteBrightnessRight) {
          this.renderer.setStyle(whiteBrightnessRight, 'opacity', opacity);
          this.renderer.setStyle(whiteBrightnessLeft, 'opacity', opacity);
        }
      }
    );

    this.stroboscopeSubscription =
      this.visualizationService.stroboscope$.subscribe(
        ({ enabled, frequency }) => {
          if (this.intervalId) {
            clearInterval(this.intervalId);
          }

          if (enabled) {
            let isVisible = true;
            const delay = 2000 - frequency * 7.5;

            // @ts-ignore
            this.intervalId = setInterval(() => {
              const squareElement =
                this.el.nativeElement.querySelector('.led-border');
              if (squareElement) {
                this.renderer.setStyle(
                  squareElement,
                  'display',
                  isVisible ? 'block' : 'none'
                );
                isVisible = !isVisible;
              }
            }, delay);
          } else {
            const squareElement =
              this.el.nativeElement.querySelector('.led-border');
            if (squareElement) {
              this.renderer.setStyle(squareElement, 'display', 'block');
            }
          }
        }
      );
    this.getCurrentState();
  }

  public ngOnDestroy(): void {
    this.stroboscopeSubscription.unsubscribe();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.subscription.unsubscribe();
  }

  public getJetBackground(JetOn: boolean, type: PumpType): string {
    if (type === PUMP_TYPE.ANGLE) {
      return `url('${
        JetOn ? this.imagePaths.ANGLE_JET_ON : this.imagePaths.ANGLE_JET_OFF
      }')`;
    } else {
      return `url('${
        JetOn
          ? this.imagePaths.VERTICAL_JET_ON
          : this.imagePaths.VERTICAL_JET_OFF
      }')`;
    }
  }

  public updateFoam(name: string, enabled: boolean): void {
    const enumKey = name as keyof typeof DeviceNameEnum;
    const dbName = DeviceNameEnum[enumKey];
    const foamDTO: FoamDTO = { name: dbName, value: enabled };
    if (this.isEditingToolon) {
      this.blocksService.setFoams(foamDTO);
    } else {
      this.liveControllerService.updateFoam(foamDTO);
    }
  }

  public toggleJet(jetType: PumpType, jetNumber: number): void {
    //TODO: nikodem; zlikwidować ts ignore
    const jetOn = `${jetType}Jet${jetNumber}on`;
    //@ts-ignore: Ignore next line for TypeScript check, since we're sure about the dynamic property existence
    this[jetOn] = !this[jetOn];

    const enumKey = `${jetType}Jet${jetNumber}` as keyof typeof DeviceNameEnum;
    const dbName = DeviceNameEnum[enumKey];
    const jetDTO: JetDTO = {
      name: dbName,
      value:
        // @ts-ignore: Ignore next line for TypeScript check, since we're sure about the dynamic property existence
        this[jetOn],
    };
    if (this.isEditingToolon) {
      this.blocksService.setJets(jetDTO);
    } else {
      this.liveControllerService.updateJet(jetDTO);
    }
    if (jetType === PUMP_TYPE.ANGLE) {
      this.updateBeamLevel();
      this.validationService.getAngleJetsStatus([
        this.angleJet1on,
        this.angleJet2on,
        this.angleJet3on,
        this.angleJet4on,
      ]);
      this.validationService.jetChange(PUMP_TYPE.ANGLE);
    } else if (jetType === PUMP_TYPE.VERTICAL) {
      this.validationService.getVerticalJetsStatus([
        this.verticalJet1on,
        this.verticalJet2on,
        this.verticalJet3on,
      ]);
      this.validationService.jetChange(PUMP_TYPE.VERTICAL);
    }
  }

  public displayLedBorder(): boolean {
    return (
      (this.activeMobileTab === 'LEDs strip' && this.mobileView) ||
      !this.mobileView
    );
  }

  public displayFoamJetContainer(): boolean {
    return (
      (this.activeMobileTab === 'Foams' && this.mobileView) || !this.mobileView
    );
  }

  public displayAngleJetButtonContainer(): boolean {
    return (
      (this.activeMobileTab === 'Angle Jets' && this.mobileView) ||
      !this.mobileView
    );
  }

  private updateBeamLevel(): void {
    this.visualizationService.pump1Power$.subscribe((level) => {
      const jetsOn = [
        this.angleJet1on,
        this.angleJet2on,
        this.angleJet3on,
        this.angleJet4on,
      ];
      let count = jetsOn.filter((jet) => !jet).length;
      this.beamLevel = level * (6.5 * (count + 1));
    });
  }

  private getCurrentState() {
    this.subscription = this.deviceService
      .getCurrentState()
      .subscribe((devices) => {
        const angleJetMappings = {
          angleJet1on: DeviceNameEnum.angleJet1,
          angleJet2on: DeviceNameEnum.angleJet2,
          angleJet3on: DeviceNameEnum.angleJet3,
          angleJet4on: DeviceNameEnum.angleJet4,
        };

        for (const [key, value] of Object.entries(angleJetMappings)) {
          const jet = devices.jets.find((j) => j.name === value);
          if (jet) {
            (this as any)[key] = jet.value;
            this.getJetBackground(this as any, 'angle');
          }
        }

        const verticalJetMappings = {
          verticalJet1on: DeviceNameEnum.verticalJet1,
          verticalJet2on: DeviceNameEnum.verticalJet2,
          verticalJet3on: DeviceNameEnum.verticalJet3,
        };

        for (const [key, value] of Object.entries(verticalJetMappings)) {
          const jet = devices.jets.find((j) => j.name === value);
          if (jet) {
            (this as any)[key] = jet.value;
            this.getJetBackground(this as any, 'vertical');
          }
        }

        const foamMappings = {
          foam1Enabled: DeviceNameEnum.foam1,
          foam2Enabled: DeviceNameEnum.foam2,
          foam3Enabled: DeviceNameEnum.foam3,
        };

        for (const [key, value] of Object.entries(foamMappings)) {
          const foam = devices.foams.find((j) => j.name === value);
          if (foam) {
            (this as any)[key] = foam.value;
          }
        }
      });
  }

  private getMobileTabName(): void {
    this.subscription = this.dataTransferService.tabName$.subscribe((name) => {
      this.activeMobileTab = name;
    });
  }

  private getMobileView(): void {
    this.subscription = this.dataTransferService.mobileView$.subscribe(
      (mobileView) => {
        this.mobileView = mobileView;
      }
    );
  }

  private getEditingToolStatus() {
    this.subscription = this.dataTransferService.editingTool$.subscribe(
      (tool) => {
        this.isEditingToolon = tool;
      }
    );
  }
}
