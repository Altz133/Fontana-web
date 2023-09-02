import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ConfigService} from "../../services/config-service.service";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent {

  public pumpMultiplier: FormControl = new FormControl(0, [Validators.min(0), Validators.max(1)]);
  public sensorsStatus: boolean = false;

  constructor(private httpService: ConfigService) {
  }

  ngOnInit(): void {

    this.httpService.getSensorsStatus().subscribe(response => {
      this.sensorsStatus = response;
    });

    this.httpService.getPumpMultiplier().subscribe(response => {
      this.pumpMultiplier.setValue(response);
    });

  }

  submit(): void {
    if (this.pumpMultiplier.valid && this.pumpMultiplier.value != null) {

      this.httpService.putPumpMultiplier(this.pumpMultiplier.value).subscribe(response => {
      });

      this.httpService.putSensorsStatus(this.sensorsStatus).subscribe(response => {
      });

    }
  }
}
