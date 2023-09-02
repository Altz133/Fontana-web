import {Injectable} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class AdminGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['dashboard'])
      return false;
    }
    return true;
  }
}

