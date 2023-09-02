import {Component, Input} from '@angular/core';
import {TemplateCardDto} from "../../../shared/dtos/template-card-dto";

@Component({
  selector: 'app-template-card-snippet',
  templateUrl: './template-card-snippet.component.html',
  styleUrls: ['./template-card-snippet.component.scss']
})
export class TemplateCardSnippetComponent {
  @Input() public card?: TemplateCardDto;
}
