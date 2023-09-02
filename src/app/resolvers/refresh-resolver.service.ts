import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {NotificationsService} from '../services/notifications/notifications.service';
import {AuthService} from '../services/auth.service';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RefreshResolverService implements Resolve<any> {
  constructor(
    private notificationsService: NotificationsService,
    private authService: AuthService,
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    if (this.authService.isAdmin()) {
      return this.notificationsService.fetchNotificationsData().pipe(
        tap(data => this.notificationsService.setNotificationsData(data))
      );
    } else {
      return of(null);
    }
  }
}
