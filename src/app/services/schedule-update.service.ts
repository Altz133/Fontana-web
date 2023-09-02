import {Observable, Subject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ScheduleUpdateService {
  private triggerAction = new Subject<void>();

  public trigger() {
    this.triggerAction.next();
  }

  public triggered(): Observable<void> {
    return this.triggerAction.asObservable();
  }
}
