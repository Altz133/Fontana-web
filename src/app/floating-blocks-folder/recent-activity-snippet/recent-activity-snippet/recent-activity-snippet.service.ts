import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {BackendRequestService} from "../../../services/backend-request.service";
import {API_CONFIG} from "../../../api-config/api-config";

@Injectable({
  providedIn: 'root',
})

export class RecentActivitySnippetService {
  private latestSessionsSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private readonly size: number;

  constructor(private requestService: BackendRequestService) {
    this.size = 3;
  }

  public fetchLatestSessions(): Observable<any> {
    const url: string = `${API_CONFIG.SESSION_FIND_ALL_WITH_OPTIONAL_PARAM}?size=${this.size}`;
    return this.requestService.requestGET(url);
  }

  public getLatestSessions(): Observable<any> {
    return this.latestSessionsSubject;
  }

  public setLatestSessions(data: any): void {
    this.latestSessionsSubject.next(data);
  }
}
