import { PumpDTO } from './pump-dto';
import { LedDTO } from './led-dto';
import { FoamDTO } from './foam-dto';
import { LightDTO } from './light-dto';
import { JetDTO } from './jet-dto';

export class DevicesDto {
  jets: JetDTO[];
  pumps: PumpDTO[];
  leds: LedDTO[];
  foams: FoamDTO[];
  lights: LightDTO[];

  constructor(
    jets: JetDTO[],
    pumps: PumpDTO[],
    leds: LedDTO[],
    foams: FoamDTO[],
    lights: LightDTO[]
  ) {
    this.jets = jets;
    this.pumps = pumps;
    this.leds = leds;
    this.foams = foams;
    this.lights = lights;
  }
}
