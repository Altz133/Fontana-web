import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'card-bar',
  templateUrl: './card-bar.component.html',
  styleUrls: ['./card-bar.component.scss']
})
export class CardBarComponent {
  @Input() public icon: string = ""
  @Input() public name: string = ""
  @Input() public route: string = ""

  constructor(private redirect: Router) {
  }

  move(){
      this.redirect.navigate([this.route])
  }
}
