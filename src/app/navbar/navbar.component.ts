import {Component, HostListener} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {TokenType} from "../shared/enums/token.enum";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  public isRedirecting: boolean = false;
  public menuOn: boolean = false;
  public hasAuthority: boolean;
  private windowSize: number = 950;

  constructor(
    private cookieService: CookieService,
    private authService: AuthService,
    private redirect: Router,
  ) {
    this.menuOn = window.innerWidth <= this.windowSize;
    this.hasAuthority = authService.isAdmin() || authService.isOperator();
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event): void {
    this.menuOn = (event.target as Window).innerWidth <= 950;
  }

  public handleDashboardRedirection():void {
    if (this.redirect.url !== '/dashboard') {
      this.redirect.navigate(['/dashboard']);
      this.isRedirecting = true;
    }
  }

  public logout(): void {
    const authToken: string = this.cookieService.get('authToken');
    const refreshToken: string = this.cookieService.get('refreshToken');

    if (authToken && refreshToken) {
      this.blacklistToken(authToken, TokenType.ACCESS);
      this.blacklistToken(refreshToken, TokenType.REFRESH);
    }

    this.cookieService.deleteAll();
    this.redirect.navigate(['/login']);
  }

  private blacklistToken(token: string, tokenType: TokenType): void {  // Dodaj drugi argument
    this.authService.blacklistToken(token, tokenType).subscribe({});  // Dodaj drugi argument
  }
}
