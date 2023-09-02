import {Component, OnInit} from '@angular/core';
import {BackendRequestService} from "../../services/backend-request.service";
import {CookieService} from "ngx-cookie-service";
import {MatDialog} from "@angular/material/dialog";
import {NotificationModalComponent} from "./notification-modal/notification-modal.component";
import {NotificationsUpdateService} from "../../services/notifications/notifications-update.service";
import {ActivatedRoute} from "@angular/router";
import {NotificationsService} from "../../services/notifications/notifications.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss', '../sidebar.component.scss']
})
export class NotificationsComponent implements OnInit {
  data: any;
  hasNotifications: boolean;

  constructor(
    private requestService: BackendRequestService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private notificationsUpdateService: NotificationsUpdateService,
    private notificationsService: NotificationsService
  ) {
    this.hasNotifications = false;
  };

  ngOnInit(): void {
    this.notificationsService.getNotificationsData().subscribe(data => {
      this.data = data;
      this.hasNotifications = this.data.amount > 0;
    });
  }

  public openNotificationModal(): void {
    this.dialog.open(NotificationModalComponent, {
      width: '45rem', height: '35rem'
    })
  }
}
