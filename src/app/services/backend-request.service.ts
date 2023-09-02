import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../api-config/api-config';
import { SchedulePostDto } from '../shared/dtos/schedule-post-dto';

@Injectable({
  providedIn: 'root',
})
export class BackendRequestService {
  //FIXME may be needed to change later
  private address: string = API_CONFIG.BASE_URL;

  constructor(private cookieService: CookieService, private http: HttpClient) {}

  public requestLiveControlPOST(path: string, body: object): Observable<any> {
    return this.http.post(path, body, {
      headers: this.getLiveControlHeaders(),
    });
  }

  public requestLiveControlConnection(): Observable<any> {
    return this.http.post(
      API_CONFIG.LIVE_CONTROL_SESSION,
      { openedTime: this.getLocaleDate() },
      {
        headers: this.getHeaders(),
      }
    );
  }

  public requestGetMyTemplates(page: number, size: number): Observable<any> {
    return this.http.get(API_CONFIG.GET_MY_TEMPLATES, {
      headers: this.getHeaders(),
      params: new HttpParams().set('page', page).set('size', size),
    });
  }

  public requestGetPublicTemplates(
    name: string,
    page: number,
    size: number
  ): Observable<any> {
    return this.http.get(API_CONFIG.GET_PUBLIC_TEMPLATES, {
      headers: this.getHeaders(),
      params: new HttpParams()
        .set('name', name)
        .set('page', page)
        .set('size', size),
    });
  }

  public getLocaleDate(): Date {
    const currentDate: Date = new Date();
    const timezoneOffset: number = currentDate.getTimezoneOffset() * 60 * 1000; // Convert to milliseconds
    return new Date(currentDate.getTime() - timezoneOffset);
  }

  public requestPOST(path: string, body: object): Observable<any> {
    return this.http.post(path, body, {
      headers: this.getHeaders(),
    });
  }

  public requestGET(path: string): Observable<any> {
    return this.http.get(path, {
      headers: this.getHeaders(),
    });
  }
  public requestGETWithResponseType<T = any>(
    path: string,
    responseType: 'arraybuffer' | 'blob' | 'text' | 'json' = 'json'
  ): Observable<T> {
    return this.http.get<T>(path, {
      headers: this.getHeaders(),
      responseType: responseType as any,
    });
  }

  public requestPUT(path: string, body: object): Observable<any> {
    return this.http.put(path, body, {
      headers: this.getHeaders(),
    });
  }

  public updateToken(): Promise<any> {
    const refreshToken: string = this.cookieService.get('refreshToken');

    if (!refreshToken) {
      return Promise.reject('No refreshToken available');
    }

    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-Token-Refresh': this.cookieService.get('refreshToken'),
    });

    return new Promise((resolve, reject): void => {
      this.http.get(API_CONFIG.REFRESH_TOKEN_AUTH, { headers }).subscribe({
        next: (response: Object): void => {
          resolve(response);
        },
        error: (err): void => {
          console.error('Token update error:', err);
          reject(err);
        },
      });
    });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + this.cookieService.get('authToken'),
    });
  }

  private getLiveControlHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + this.cookieService.get('authToken'),
      'X-Live-Control': 'active',
    });
  }

  public getSpecialDays(year: number, month: number): Observable<any> {
    return this.http.get(API_CONFIG.GET_SPECIAL_DAYS, {
      headers: this.getHeaders(),
      params: new HttpParams().set('year', year).set('month', month),
    });
  }

  public getSchedulesByDate(
    year: number,
    month: number,
    day: number
  ): Observable<any> {
    return this.http.get(API_CONFIG.GET_SCHEDULES_FOR_DATE, {
      headers: this.getHeaders(),
      params: new HttpParams()
        .set('year', year)
        .set('month', month)
        .set('day', day),
    });
  }

  public deleteSchedule(id: number): Observable<any> {
    return this.http.delete(API_CONFIG.DELETE_SCHEDULE + '/' + id, {
      headers: this.getHeaders(),
    });
  }

  public stopSchedule(): Observable<any> {
    return this.http.put(API_CONFIG.STOP_SCHEDULE, null, {
      headers: this.getHeaders(),
    });
  }

  public requestPutSchedule(body: SchedulePostDto): Observable<any> {
    return this.http.put(API_CONFIG.PUT_UPDATE_SCHEDULE, body, {
      headers: this.getHeaders(),
    });
  }

  public requestPostSchedule(body: SchedulePostDto): Observable<any> {
    return this.http.post(API_CONFIG.POST_ADD_SCHEDULE, body, {
      headers: this.getHeaders(),
    });
  }

  public requestGetMyTemplatesSnippets(): Observable<any> {
    return this.requestGET(API_CONFIG.GET_MY_TEMPLATES_SNIPPETS);
  }

  public requestGetDraftTemplatesSnippets(): Observable<any> {
    return this.requestGET(API_CONFIG.GET_DRAFT_TEMPLATES_SNIPPETS);
  }
}
