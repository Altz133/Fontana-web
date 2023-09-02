import {Component, OnInit} from '@angular/core';
import {TemplateCardDto} from "../../shared/dtos/template-card-dto";
import {BackendRequestService} from "../../services/backend-request.service";

@Component({
  selector: 'app-draft-cards-snippet',
  templateUrl: './draft-cards-snippet.component.html',
  styleUrls: ['./draft-cards-snippet.component.scss']
})
export class DraftCardsSnippetComponent implements OnInit {
  public cards: TemplateCardDto[] = [];

  constructor(private backendService: BackendRequestService) {

  }

  public ngOnInit(): void {
    this.getTemplates();
  }

  public getTemplates(): void {
    this.backendService.requestGetDraftTemplatesSnippets().subscribe(
      (response) => {
        if (response.length != 0) {
          this.cards = response
        }
      },
      (error) => {

      }
    );
  }
}
