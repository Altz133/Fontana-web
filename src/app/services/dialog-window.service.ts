import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogWindowComponent } from '../reusable-components/dialog-window/dialog-window.component';
import { BackendRequestService } from './backend-request.service';
import { Router } from '@angular/router';
import InfoMessages from 'src/app/shared/messages/info-messages.json';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class DialogWindowService {
  constructor(
    private dialog: MatDialog,
    private backendRequestService: BackendRequestService,
    private redirect: Router,
  private cookieService: CookieService
) {}

    public navigateToLiveControl(): void {
        this.backendRequestService.requestLiveControlConnection().subscribe(
            (response) => {
                const id = response.id;
                console.log("Real Session ID received from backend:", id);  // This will log the real session ID
                this.cookieService.set('sessionId', id.toString());
                this.redirect.navigate(['/liveControl']);
            },
      (error) => {
        if (error.status === 403 && error.error) {
          console.log()
          const errorMessage = `${error.error.message}
            <br> current user: ${error.error.activeUserName}
            <br> active from: ${error.error.activeSessionStartTime}`;

          this.openLiveControlDialog(errorMessage);
        } else {
          this.openLiveControlDialog(InfoMessages.errorMessage);
        }
      }
    );
  }

  public redirectToDashboardDueToSessionClose():void {
    this.redirect.navigate(['/dashboard']);
    this.openLiveControlDialog("Session closed.");
  }

  public noActivityMessage(): void {
    this.openLiveControlDialog(InfoMessages.noActivity);
  }

  private openLiveControlDialog(message: string): void {
    this.dialog.open(DialogWindowComponent, {
      data: { message: message },
    });
  }
}
