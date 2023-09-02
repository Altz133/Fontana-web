import {Component, Input} from '@angular/core';
import {TemplateCardDto} from "../../shared/dtos/template-card-dto";
import {ImagesPaths} from "../../shared/config/images-paths";
import {BackendRequestService} from "../../services/backend-request.service";
import {API_CONFIG} from "../../api-config/api-config";
import {TemplateUpdateCardService} from "../../services/template-update-card";

@Component({
  selector: 'app-template-card',
  templateUrl: './template-card.component.html',
  styleUrls: ['./template-card.component.scss']
})
export class TemplateCardComponent {
  @Input() public card?: TemplateCardDto;
  @Input() public delete: boolean = false;

  public imagesPaths: ImagesPaths = new ImagesPaths();

  constructor(private backendRequest:BackendRequestService,private templateUpdate:TemplateUpdateCardService) {
  }

  public deleteTemplate(id: number): void {
    this.backendRequest.requestPUT(API_CONFIG.HIDE_TEMPLATE + "/" + id,{}).subscribe(
      (response) => {
        this.templateUpdate.trigger()
      }
    );
  }
}
