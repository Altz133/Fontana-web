import { Injectable } from '@angular/core';
import { Subject, timer, Subscription } from 'rxjs';
import { tap, throttleTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DialogWindowService } from './dialog-window.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';
import { TokenType } from '../shared/enums/token.enum';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private userActivity: Subject<any> = new Subject<any>();
  private timeoutSubscription: Subscription | null = null;
  private readonly TIMEOUT: number = 5 * 60 * 100000;

  constructor(
    private redirect: Router,
    private dialogService: DialogWindowService,
    private cookieService: CookieService,
    private authService: AuthService
  ) {}

  public activityDetected(): void {
    this.userActivity.next(true);
  }

  public setup(): void {
    this.timeoutSubscription = this.resetTimeout();

    this.userActivity
      .pipe(
        throttleTime(1000),
        tap(() => this.refreshTimeout())
      )
      .subscribe();
  }

  private refreshTimeout(): void {
    this.stopTimeout();
    this.timeoutSubscription = this.resetTimeout();
  }

  public stopTimeout(): void {
    if (this.timeoutSubscription) {
      this.timeoutSubscription.unsubscribe();
      this.timeoutSubscription = null;
    }
  }

  private resetTimeout(): any {
    return timer(this.TIMEOUT).subscribe(() => {
      const authToken: string = this.cookieService.get('authToken');
      const refreshToken: string = this.cookieService.get('refreshToken');

      this.blacklistToken(authToken, TokenType.ACCESS);
      this.blacklistToken(refreshToken, TokenType.REFRESH);

      this.cookieService.deleteAll();
      this.dialogService.noActivityMessage();
      this.redirect.navigate(['/login']);
    });
  }

  private blacklistToken(token: string, tokenType: TokenType): void {
    this.authService.blacklistToken(token, tokenType).subscribe({});
  }
}
