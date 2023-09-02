import { Component } from '@angular/core';


import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {
  hasAuthority: boolean;

  constructor(private authService: AuthService) {
    this.hasAuthority = authService.isAdmin();
  }
}
