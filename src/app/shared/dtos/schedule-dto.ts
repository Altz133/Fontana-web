export class ScheduleDto {

  public id: number;
  public name: string;
  public username: string;
  public startTime: Date;
  public endTime: Date;
  public length: number;
  public repetitions: number;
  public cycleDays: string[];
  public enabled: boolean;
  public playing: boolean;
  public cycle: boolean;
  public templateIds: number[];
  public templateNames: string[];

  constructor(id: number, name: string, username: string, startTime: Date, endTime: Date, length: number, repetitions: number, cycleDays: string[], enabled: boolean, playing: boolean, cycle: boolean, templateIds: number[], templaneNames: string[]) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.startTime = startTime;
    this.endTime = endTime;
    this.length = length;
    this.repetitions = repetitions;
    this.cycleDays = cycleDays;
    this.enabled = enabled;
    this.playing = playing;
    this.cycle = cycle;
    this.templateIds = templateIds;
    this.templateNames = templaneNames;
  }

}
