import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LiveControlDataTransferService {
  private tabNameSubject = new BehaviorSubject<string>('Angle Jets');
  public tabName$ = this.tabNameSubject.asObservable();

  private mobileViewSubject = new BehaviorSubject<boolean>(false);
  public mobileView$ = this.mobileViewSubject.asObservable();

  private isEditingToolOnSubject = new BehaviorSubject<boolean>(false);
  public editingTool$ = this.isEditingToolOnSubject.asObservable();

  public getTabName(name: string): void {
    this.tabNameSubject.next(name);
  }

  public getMobileView(mobileView: boolean): void {
    this.mobileViewSubject.next(mobileView);
  }

  public getEditingToolStatus(editingTool: boolean): void {
    this.isEditingToolOnSubject.next(editingTool);
  }
}
