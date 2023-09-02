import {Component, OnInit} from '@angular/core';
import {TemplateCardDto} from "../../shared/dtos/template-card-dto";
import {BackendRequestService} from "../../services/backend-request.service";

@Component({
  selector: 'app-template-cards-snippet',
  templateUrl: './template-cards-snippet.component.html',
  styleUrls: ['./template-cards-snippet.component.scss']
})
export class TemplateCardsSnippetComponent implements OnInit {
  public cards: TemplateCardDto[] = [];

  constructor(private backendService: BackendRequestService) {

  }

  public ngOnInit(): void {
    this.getTemplates();
  }

  public getTemplates(): void {
    this.backendService.requestGetMyTemplatesSnippets().subscribe(
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
