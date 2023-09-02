export class RecentActivityDto {
  public activity: string;
  public date: string;
  public startTime: string;
  public endTime: string;
  public user: string;

  constructor(activity: string, date: string, startTime: string, endTime: string, user: string) {
    this.activity = activity;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.user = user;
  }
}
