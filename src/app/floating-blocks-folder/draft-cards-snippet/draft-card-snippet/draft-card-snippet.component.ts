import {Component, Input} from '@angular/core';
import {TemplateCardDto} from "../../../shared/dtos/template-card-dto";

@Component({
  selector: 'app-draft-card-snippet',
  templateUrl: './draft-card-snippet.component.html',
  styleUrls: ['./draft-card-snippet.component.scss']
})
export class DraftCardSnippetComponent {
  @Input() public card?: TemplateCardDto;
}
