
export class Log {
 public id: number | null;
 public username: string;
 public sessionId: number;
 public executedAt: Date;
 public deviceType: string | undefined;
 public deviceName: string | undefined;
 public deviceValue: string | undefined;

  constructor(id: number | null, userFullName: string, sessionId: number, executedAt: Date, deviceType?: string, deviceName?: string, deviceValue?: string) {
    this.id = id;
    this.username = userFullName;
    this.sessionId = sessionId;
    this.executedAt = executedAt;
    this.deviceType = deviceType;
    this.deviceName = deviceName;
    this.deviceValue = deviceValue;
  }

}

