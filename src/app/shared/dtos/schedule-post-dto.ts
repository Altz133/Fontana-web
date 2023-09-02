export class SchedulePostDto{

  public id: number | null;
  public name: string;
  public username: string;
  public startTime: number;
  public endTime: number | null;
  public cycleDays: string[];
  public repeat: number;
  public templates: number[];
  public enabled: boolean;

  constructor(id: number | null, name: string, username: string, startTime: number, endTime: number | null, cycleDays: string[], repeats: number, templates: number[], enabled: boolean) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.startTime = startTime;
    this.endTime = endTime;
    this.cycleDays = cycleDays;
    this.repeat = repeats;
    this.templates = templates;
    this.enabled = enabled;
  }


}
