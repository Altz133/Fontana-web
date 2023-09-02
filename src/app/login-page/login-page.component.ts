import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormErrors } from './login-error';
import { ImagesPaths } from '../shared/config/images-paths';
import { API_CONFIG } from '../api-config/api-config';
import {AuthService} from "../services/auth.service";

const imageUrls = [
  'assets/login/budynek1.png',
  'assets/login/budynekciemny1.jpg',
  'assets/login/budynekjasny1.jpg',
  'assets/login/budynekciemny2.png',
  'assets/login/budynekjasny3.png',
  'assets/login/budynekjasny4.png',
  'assets/login/budynekjasny5.png',
];

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  public isLoading: boolean = false;
  public isRedirecting: boolean = false;
  public imagePaths = new ImagesPaths();
  public errorMessage: string = '';
  public formError: FormErrors = FormErrors.NONE;
  public registerForm: FormGroup;
  public imageSource: string = imageUrls[0];
  protected readonly FormErrors = FormErrors;
  private intervalId: any;
  private apiURL: string = API_CONFIG.BASE_URL;

  constructor(
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private http: HttpClient,
    private redirect: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.startImageChange();
  }

  get f() {
    return this.registerForm.controls;
  }

  public onSubmit(): void {
    if (this.registerForm.valid) {
      this.formError = FormErrors.NONE;
      this.errorMessage = FormErrors.NONE;
      //ts-ignore, because of above if condition
      let data = {
        // @ts-ignore
        username: this.registerForm.get('login').value,
        // @ts-ignore
        password: this.registerForm.get('password').value,
      };

      //FIXME may be needed to change later
      const url = API_CONFIG.AUTH_AUTHENTICATE;

      const headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }),
      };

      let _this = this;
      _this.isLoading = true;

      // @ts-ignore
      this.http.post(url, data, headers).subscribe({
        next(response: Object) {
          _this.isRedirecting = true;
          _this.formError = FormErrors.NONE;

          //@ts-ignore
          _this.cookieService.set('username', _this.registerForm.get('login').value);
          //@ts-ignore
          _this.authService.setUserRole(response['role']);
          // ignoring type and expiration time
          //@ts-ignore
          _this.cookieService.set('authToken', response['accessToken']);
          //@ts-ignore
          _this.cookieService.set('refreshToken', response['refreshToken']);

          _this.redirect.navigate(['/dashboard']);
        },
        error(err) {
          _this.isLoading = false;
          if (err.status == 401) {
            _this.formError = FormErrors.UNAUTHORIZED;
            _this.errorMessage = _this.formError;
          } else {
            _this.formError = FormErrors.UNKNOWN;
            _this.errorMessage = _this.formError;
          }
        },
      });
    } else {
      this.formError = FormErrors.NONE;
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  /* Image change */
  private startImageChange(): void {
    let index = 0;
    this.intervalId = setInterval(() => {
      index = (index + 1) % imageUrls.length;
      this.updateDynamicStyle(index);
    }, 6000);
  }

  // @ts-ignore
  private updateDynamicStyle(index) {
    const rightTitle = document.querySelector('.rightTitle') as HTMLElement;
    const backgroundImage = document.querySelector(
      '.imageContainer'
    ) as HTMLElement;
    const minOpacity = 0.1; // 0-1
    const timeInterval = 260; //ms

    /* Fade out */
    for (let opacity = 1; opacity >= minOpacity; opacity -= 0.02) {
      setTimeout(() => {
        rightTitle.style.opacity = `${opacity}`;
        backgroundImage.style.opacity = `${opacity}`;
      }, timeInterval / 100);
    }

    /* Fade in */
    setTimeout(() => {
      this.imageSource = imageUrls[index];
      rightTitle.style.backgroundImage = `url("${this.imageSource}")`;

      for (let opacity = minOpacity; opacity <= 1; opacity += 0.03) {
        setTimeout(() => {
          rightTitle.style.opacity = `${opacity}`;
          backgroundImage.style.opacity = `${opacity}`;
        }, timeInterval / 100);
      }
    }, timeInterval);
  }
}
