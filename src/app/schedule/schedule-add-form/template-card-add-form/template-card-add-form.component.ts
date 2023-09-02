import {Component, Input} from '@angular/core';
import {TemplateCardDto} from "../../../shared/dtos/template-card-dto";

@Component({
  selector: 'app-template-card-add-form',
  templateUrl: './template-card-add-form.component.html',
  styleUrls: ['./template-card-add-form.component.scss']
})
export class TemplateCardAddFormComponent {
  @Input() public card?: TemplateCardDto;

}
