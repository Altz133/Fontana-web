import {Component} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  public isAdmin: boolean;
  public shouldDisplaySettings: boolean;

  constructor(private authService: AuthService, private route: ActivatedRoute) {
    this.isAdmin = authService.isAdmin();
    // @ts-ignore
    this.shouldDisplaySettings = this.route.snapshot.routeConfig.path !== 'adminPanel';
  };
}
