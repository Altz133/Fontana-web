import {Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss', "../sidebar.component.scss"]
})
export class SettingsComponent {
  public isRedirecting: boolean;
  constructor(private router: Router) {
    this.isRedirecting = false;
  } // Add Router service in the constructor

  navigateToAdminPanel() { // Create a method to navigate to the admin panel
    this.router.navigate(['/adminPanel']);
    this.isRedirecting = true;
  }
}

