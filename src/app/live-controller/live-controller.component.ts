import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendRequestService } from '../services/backend-request.service';
import { API_CONFIG } from '../api-config/api-config';
import { LiveControlDataTransferService } from './service/live-control-data-transfer.service';
import { ActivityService } from '../services/activity.service';
import { Subscription } from 'rxjs';
import { MOBILE_VIEW_WIDTH } from '../shared/models/constants/screen-size.const';

@Component({
  selector: 'app-live-controller',
  templateUrl: './live-controller.component.html',
  styleUrls: ['./live-controller.component.scss'],
})
export class LiveControllerComponent implements OnInit {
  public isMobileView = false;
  private isEditingToolOn = false;
  public isRedirecting: boolean = false;

  private subscription!: Subscription;

  constructor(
    private redirect: Router,
    private backendService: BackendRequestService,
    private dataTransferService: LiveControlDataTransferService,
    private activityService: ActivityService
  ) {}

  public ngOnInit(): void {
    this.checkScreenSize();
    this.subscription = this.dataTransferService.mobileView$.subscribe((et) => {
      this.isEditingToolOn = et;
    });
    this.setupActivityCheck();
  }

  public exit(): void {
    this.closeSession();
    this.redirect.navigate(['/dashboard']);
    this.isRedirecting = true;
  }

  @HostListener('window:beforeunload', ['$event'])
  public unloadHandler(event: Event): void {
    this.closeSession();
  }

  @HostListener('window:popstate', ['$event'])
  public onPopState(event: Event): void {
    this.closeSession();
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobileView = window.innerWidth < MOBILE_VIEW_WIDTH;
    this.dataTransferService.getMobileView(this.isMobileView);
  }

  private closeSession(): void {
    this.backendService
      .requestPUT(API_CONFIG.CLOSE_SESSION, {
        closedTime: this.backendService.getLocaleDate(),
      })
      .subscribe(
        (response) => {
          this.activityService.stopTimeout();
          console.log('Close session successful', response);
        },
        (error) => {
          console.error('Error while closing session', error);
        }
      );
  }

  private setupActivityCheck(): void {
    if (!this.isEditingToolOn) {
      this.activityService.setup();
    }
  }
}
