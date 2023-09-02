import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {BackendRequestService} from "../services/backend-request.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    private backendRequestService: BackendRequestService) {
  }

  /**
   * Guards route activation based on user authentication status and token validity.
   * If the user is not authenticated, attempts to update authentication tokens and revalidate.
   *
   * @param next The ActivatedRouteSnapshot containing information about the route to be activated.
   * @param state The RouterStateSnapshot containing the router's state information.
   * @returns A Promise resolving to `true` if authentication is successful and route activation is allowed,
   *          or `false` if the user remains unauthenticated or an error occurs during token update.
   */
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {

    const isLoggedIn: boolean = this.authService.isLoggedIn();
    const nextRoute = next.routeConfig ? next.routeConfig.path : null;

    if (nextRoute == 'login' && isLoggedIn) {
      await this.router.navigate(['dashboard']);
      return false;
    } else if (nextRoute == 'login' && !isLoggedIn) {
      return true;
    }

    if (!isLoggedIn) {
      return this.backendRequestService.updateToken()
        .then((response): boolean => {
          this.authService.updateCookieService(response['accessToken'], response['refreshToken']);

          const isLoggedInAfterTokenUpdate: boolean = this.authService.isLoggedIn();

          if (!isLoggedInAfterTokenUpdate) {
            this.router.navigate(['login']);
            return false;
          }

          return true;
        })
        .catch(error => {
          console.error("Error updating token:", error);
          this.router.navigate(['login']);
          return false;
        });
    }

    return true;
  }
}

