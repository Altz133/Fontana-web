import {Injectable} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class OperatorGuard {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): boolean {
    if (!this.authService.isOperator() && !this.authService.isAdmin()) {
      this.router.navigate(['dashboard']).then((): boolean => false);
    }
    return true;
  }
}
