import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {LogsService} from "../services/logs.service";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class AdminPanelResolverService implements Resolve<any> {

  constructor(private logsService: LogsService) {};

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.logsService.getLogs().pipe(
      tap(data => this.logsService.setLogs(data))
    )
  }
}
