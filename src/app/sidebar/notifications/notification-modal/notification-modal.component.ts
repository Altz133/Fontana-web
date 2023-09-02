import {Component, OnInit} from '@angular/core';
import {BackendRequestService} from "../../../services/backend-request.service";
import {CookieService} from "ngx-cookie-service";
import {API_CONFIG} from "../../../api-config/api-config";
import {NotificationsUpdateService} from "../../../services/notifications/notifications-update.service";
import {NotificationsService} from "../../../services/notifications/notifications.service";

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss']
})
export class NotificationModalComponent implements OnInit {
  public sessions: any[] = [];

  constructor(
    private requestService: BackendRequestService,
    private cookieService: CookieService,
    private notificationsUpdateService: NotificationsUpdateService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.fetchNonDisplayedSessions();

    this.notificationsService.getSessionUpdateObservable().subscribe(updatedSessions => {
      this.sessions = updatedSessions;
    });
  }

  private fetchNonDisplayedSessions(): void {
    const username: string = this.cookieService.get("username");
    const sessionApiPath: string = API_CONFIG.SESSION_FIND_ALL_WITH_OPTIONAL_PARAM + `?watcher=${username}`;

    this.requestService.requestGET(sessionApiPath)
      .subscribe(response => {
        if (response.length === 0) {
          this.sessions.push(0)
          return;
        }
        this.sessions = response;
      });
  }

  public updateSingleSessionWatcher(id: number): void {
    this.requestService.requestPUT(`${API_CONFIG.SESSION_UPDATE_SINGLE_SESSION_WATCHER}/${id}/watcher`, {
      "username": this.cookieService.get("username")
    }).subscribe((): void => {
      this.sessions = this.sessions.filter(session => session.id != id)
      this.notificationsUpdateService.updateOccurred();
      this.notificationsService.updateSessionData(this.sessions);
    })
  }

  public updateAllSessionsWatcher(): void {
    this.requestService.requestPUT(API_CONFIG.SESSION_UPDATE_ALL_SESSIONS_WATCHER, {
      "username": this.cookieService.get("username")
    }).subscribe((): void => {
      this.sessions = [0];
      this.notificationsUpdateService.updateOccurred();
      this.notificationsService.updateSessionData(this.sessions);
    });
  }

  public formatDate(date: string): string {
    const formattedDate: string = date.split("T")[0];
    const formattedTime: string = date.split("T")[1].slice(0, 5);
    return `${formattedDate} at ${formattedTime}`;
  }
}
