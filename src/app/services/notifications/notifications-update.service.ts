import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsUpdateService {
  private updateSubject: Subject<void> = new Subject<void>();

  updateOccurred(): void {
    this.updateSubject.next();
  }

  getUpdateObservable(): Observable<void> {
    return this.updateSubject.asObservable();
  }
}
