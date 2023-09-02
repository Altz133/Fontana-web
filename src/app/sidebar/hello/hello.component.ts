import {Component, OnInit} from '@angular/core';
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss', '../sidebar.component.scss']
})
export class HelloComponent implements OnInit {
  // TODO get login information from backend and then add it here
  public user: string = "";
  public date: number = Date.now();

  constructor(private cookieService: CookieService) {

  }

  ngOnInit() {
    this.user = this.cookieService.get("username");
  }
}
