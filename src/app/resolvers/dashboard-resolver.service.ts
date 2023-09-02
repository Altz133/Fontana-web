import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {NotificationsService} from "../services/notifications/notifications.service";
import {Injectable} from "@angular/core";
import {Observable, of, switchMap} from "rxjs";
import {tap} from "rxjs/operators";
import {AuthService} from "../services/auth.service";
import {
  RecentActivitySnippetService
} from "../floating-blocks-folder/recent-activity-snippet/recent-activity-snippet/recent-activity-snippet.service";

@Injectable({
  providedIn: 'root',
})
export class DashboardResolverService implements Resolve<any> {
  constructor(
    private notificationsService: NotificationsService,
    private authService: AuthService,
    private recentActivityService: RecentActivitySnippetService
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    if (this.authService.isAdmin()) {
      return this.notificationsService.fetchNotificationsData().pipe(
        tap(data => this.notificationsService.setNotificationsData(data)),
        switchMap(() => this.recentActivityService.fetchLatestSessions())
      );
    } else {
      return of(null);
    }
  }
}
