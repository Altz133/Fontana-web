import {BackendRequestService} from "../backend-request.service";
import {CookieService} from "ngx-cookie-service";
import {BehaviorSubject, Observable} from "rxjs";
import {API_CONFIG} from "../../api-config/api-config";
import {Injectable} from "@angular/core";
import {NotificationsUpdateService} from "./notifications-update.service";

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private notificationsDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private sessionUpdateSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(
    private requestService: BackendRequestService,
    private cookieService: CookieService,
    private notificationsUpdateService: NotificationsUpdateService
  ) {
    this.setupUpdateSubscription();
  }

  private setupUpdateSubscription(): void {
    this.notificationsUpdateService.getUpdateObservable().subscribe(() => {
      this.fetchNotificationsData().subscribe(data => {
        this.setNotificationsData(data);
      });
    });
  }

  fetchNotificationsData(): Observable<any> {
    const username: string = this.cookieService.get("username");
    return this.requestService.requestGET(API_CONFIG.SESSION_NOTIFICATION_AMOUNT + username);
  }

  getNotificationsData(): Observable<any> {
    return this.notificationsDataSubject.asObservable();
  }

  setNotificationsData(data: any): void {
    this.notificationsDataSubject.next(data);
  }

  getSessionUpdateObservable(): Observable<any[]> {
    return this.sessionUpdateSubject.asObservable();
  }

  updateSessionData(sessions: any[]): void {
    this.sessionUpdateSubject.next(sessions);
  }
}
