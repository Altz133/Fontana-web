import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class CustomSnackbarService {

  constructor(private snackbard : MatSnackBar) { }

  public openSnackBar(message: string, action: string = "Ok"): void {
    this.snackbard.open(message, action, {
      duration: 3000,
    });
  }
}
