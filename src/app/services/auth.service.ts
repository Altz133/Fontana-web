import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_CONFIG} from '../api-config/api-config';
import {CookieService} from "ngx-cookie-service";
import {RoleType} from "../shared/enums/role-dto";
import { Observable, throwError } from 'rxjs'
import {TokenType} from "../shared/enums/token.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public constructor(private http: HttpClient, private cookieService: CookieService) {
  }

  public setUserRole(role: string): void {
    this.cookieService.set('role', role);
  }

  public getUserRole(): string {
    return this.cookieService.get('role');
  }

  public isAdmin(): boolean {
    return this.getUserRole() === RoleType.ADMIN;
  }

  public isOperator(): boolean {
    return this.getUserRole() === RoleType.OPERATOR;
  }

  public isViewer(): boolean {
    return this.getUserRole() === RoleType.VIEWER;
  }

  public blacklistToken(token: string, tokenType: TokenType): Observable<Object> {
    if (!token || !tokenType) {
      return throwError('Token or tokenType is empty');
    }
    return this.http.post(API_CONFIG.BLACKLIST_ENDPOINT, {token: token, tokenType: tokenType});
  }

  public updateCookieService(accessToken: string, refreshToken: string): void {
    this.cookieService.set('authToken', accessToken);
    this.cookieService.set('refreshToken', refreshToken);
  }

  public isLoggedIn(): boolean {
    const token: string = this.cookieService.get("authToken");
    if (!token) return false;
    return this.checkPayloadExp(token);
  }

  private checkPayloadExp(token: string): boolean {
    const payload: string = atob(token.split('.')[1]);
    const parsedPayload = JSON.parse(payload);

    return parsedPayload.exp > Date.now() / 1000;
  }
  public getTokenType(): TokenType {
    const tokenTypeString: string = this.cookieService.get('tokenType');
    if (tokenTypeString === "REFRESH") {
      return TokenType.REFRESH;
    }
    return TokenType.ACCESS;
  }

}
