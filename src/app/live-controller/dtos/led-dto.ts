export class LedDTO {
  name: string;
  colorR: number;
  colorG: number;
  colorB: number;
  colorW: number;
  power: number;
  stroboscopeFrequency: number;

  constructor(
    name: string,
    colorR: number,
    colorG: number,
    colorB: number,
    colorW: number,
    power: number,
    stroboscopeFrequency: number
  ) {
    this.name = name;
    this.colorR = colorR;
    this.colorG = colorG;
    this.colorB = colorB;
    this.colorW = colorW;
    this.power = power;
    this.stroboscopeFrequency = stroboscopeFrequency;
  }
}
