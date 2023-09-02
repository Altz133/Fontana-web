import { Component, HostListener, OnInit } from '@angular/core';
import { DialogWindowService } from '../../services/dialog-window.service';
import { AuthService } from '../../services/auth.service';
import { MOBILE_VIEW_WIDTH } from '../../shared/models/constants/screen-size.const';

@Component({
  selector: 'app-floating-blocks',
  templateUrl: './floating-blocks.component.html',
  styleUrls: ['./floating-blocks.component.scss'],
})
export class FloatingBlocksComponent implements OnInit {
  public hasAuthority: boolean;
  public mobileView = false;

  constructor(
    private dialogService: DialogWindowService,
    private authService: AuthService
  ) {
    this.hasAuthority = authService.isOperator() || authService.isAdmin();
  }

  public ngOnInit(): void {
    this.onResize();
  }

  public move(): void {
    this.dialogService.navigateToLiveControl();
  }
  @HostListener('window:resize')
  public onResize(): void {
    this.mobileView = window.innerWidth < MOBILE_VIEW_WIDTH;
  }
}
