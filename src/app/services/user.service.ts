import { RoleType } from '../shared/enums/role-dto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { User } from '../shared/models/user.type';
import { BackendRequestService } from './backend-request.service';
import { API_CONFIG } from '../api-config/api-config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private BASE_URL = API_CONFIG.USER_ENDPOINT;

  constructor(
    private http: HttpClient,
    private backendService: BackendRequestService
  ) {}

  public getUsers(): Observable<User[]> {
    return this.backendService.requestGET(this.BASE_URL).pipe(
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(error);
      })
    );
  }
  public getUserByUsername(username: string): Observable<User> {
    const url = `${this.BASE_URL}/${username}`;
    return this.backendService.requestGET(url);
  }

  public getUserByLogged(): Observable<User> {
    const url = `${this.BASE_URL}/logged`;
    return this.backendService.requestGET(url);
  }

  public updateUserRole(username: string, roleType: RoleType): Observable<any> {
    const url = `${this.BASE_URL}/${username}`;
    return this.backendService.requestPUT(url, { roleType: roleType }).pipe(
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(error);
      })
    );
  }
}
