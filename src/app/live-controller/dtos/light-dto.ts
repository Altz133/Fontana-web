export class LightDTO {
  name: string;
  colorR: number;
  colorG: number;
  colorB: number;

  constructor(name: string, colorR: number, colorG: number, colorB: number) {
    this.name = name;
    this.colorR = colorR;
    this.colorG = colorG;
    this.colorB = colorB;
  }
}
