import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ConfigurationVisualizationService } from '../service/configuration-visualization.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fountain-sideview',
  templateUrl: './fountain-sideview.component.html',
  styleUrls: ['./fountain-sideview.component.scss'],
})
export class FountainSideviewComponent implements OnInit {
  public jet1On = true;
  public jet2On = true;
  public jet3On = true;
  public beamLevel = 0;
  private readonly LIGHT_BASIC_COLOR = 'blue';
  public color1 = this.LIGHT_BASIC_COLOR;
  public color2 = this.LIGHT_BASIC_COLOR;
  public color3 = this.LIGHT_BASIC_COLOR;
  private subscription!: Subscription;

  constructor(
    private visualizationService: ConfigurationVisualizationService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  public ngOnInit(): void {
    this.getStateOfJets();
    this.updateBeamLevel();
    this.updateBeamColor();

    this.subscription = this.visualizationService.verticalJetToggled$.subscribe(
      () => {
        this.getStateOfJets();
        this.updateBeamLevel();
      }
    );
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public updateBeamColor(): void {
    this.subscription = this.visualizationService.lightColor$.subscribe(
      (lightMap) => {
        let number = lightMap.number;
        let color = lightMap.color;

        let light = this.el.nativeElement.querySelector(`#beam${number}`);
        if (color === '#000000') {
          this.renderer.setStyle(
            light,
            'background-color',
            this.LIGHT_BASIC_COLOR
          );
        } else {
          switch (number) {
            case 1:
              this.color1 = color;
              break;
            case 2:
              this.color2 = color;
              break;
            case 3:
              this.color3 = color;
              break;
            default:
              break;
          }
          this.renderer.setStyle(light, 'background-color', color);
        }
      }
    );
  }

  public updateBeamLevel(): void {
    this.subscription = this.visualizationService.pump2Power$.subscribe(
      (level) => {
        let jetsOn = [this.jet1On, this.jet2On, this.jet3On];
        let count = jetsOn.filter((jet) => !jet).length;
        this.beamLevel = level * (33 * (count + 1));
      }
    );
  }

  private getStateOfJets(): void {
    this.subscription = this.visualizationService.jetsCount$.subscribe(
      (jets: boolean[]) => {
        this.jet1On = jets[0];
        this.changeBeamVisibility(1);
        this.jet2On = jets[1];
        this.changeBeamVisibility(2);
        this.jet3On = jets[2];
        this.changeBeamVisibility(3);
      }
    );
  }

  private changeBeamVisibility(number: number) {
    const beam = this.el.nativeElement.querySelector(`#beam${number}`);
    let jetOn = true;
    switch (number) {
      case 1:
        jetOn = this.jet1On;
        break;
      case 2:
        jetOn = this.jet2On;
        break;
      case 3:
        jetOn = this.jet3On;
        break;
      default:
        break;
    }
    if (jetOn) {
      this.renderer.setStyle(beam, 'display', 'block');
    } else {
      this.renderer.setStyle(beam, 'display', 'none');
    }
  }
}
