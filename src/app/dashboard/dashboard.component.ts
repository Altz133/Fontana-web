import { Component, HostListener, OnInit } from '@angular/core';
import { MOBILE_VIEW_WIDTH } from '../shared/models/constants/screen-size.const';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public mobileView = false;

  constructor() {}

  public ngOnInit(): void {
    this.onResize();
  }

  @HostListener('window:resize')
  public onResize(): void {
    this.mobileView = window.innerWidth < MOBILE_VIEW_WIDTH;
  }
}
