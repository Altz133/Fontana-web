import { Component } from '@angular/core';
import { PanicButtonService } from './panic-button.service';

@Component({
  selector: 'app-panic-button',
  templateUrl: './panic-button.component.html',
  styleUrls: ['./panic-button.component.scss']
})
export class PanicButtonComponent {
  isPressed = false;

  constructor(private PanicButtonService: PanicButtonService) {}

  onCloseConnectionButtonClicked() {
    this.PanicButtonService.closeConnection().subscribe(response => {
      console.log('Połączenie zamknięte', response);
    }, error => {
      console.error('Błąd podczas zamykania połączenia', error);
    });
  }

  onButtonPress() {
    this.isPressed = true;
  }

  onButtonRelease() {
    this.isPressed = false;
  }
}
