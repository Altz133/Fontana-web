import {Component, OnInit} from '@angular/core';
import {RecentActivitySnippetService} from "./recent-activity-snippet.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-recent-activity-snippet',
  templateUrl: './recent-activity-snippet.component.html',
  styleUrls: ['./recent-activity-snippet.component.scss']
})
export class RecentActivitySnippetComponent implements OnInit {
  data: any;
  hasAuthority: boolean;

  constructor(
    private recentActivityService: RecentActivitySnippetService,
    private cookieService: CookieService,
    private redirect: Router,
    private authService: AuthService
  ) {
    this.hasAuthority = authService.isAdmin();
  }

  ngOnInit(): void {
    this.recentActivityService.fetchLatestSessions().subscribe(data => {
      this.data = data;
    })
  }

  public handleAdminPanelRedirect() :void {
    this.redirect.navigate(['/adminPanel']);
  }

  public extractDate(date: string): string {
    return date.split('T')[0];
  }

  public extractTime(date: string): string {
    const time: string = date.split('T')[1];
    return time.slice(0, 5);
  }

  public isOwner(username: string):boolean {
    return username === this.cookieService.get('username');
  }
}
