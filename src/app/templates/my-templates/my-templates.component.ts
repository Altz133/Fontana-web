import {Component} from '@angular/core';
import {TemplateCardDto} from "../../shared/dtos/template-card-dto";
import {BackendRequestService} from "../../services/backend-request.service";
import {TemplateUpdateCardService} from "../../services/template-update-card";

@Component({
  selector: 'app-my-templates',
  templateUrl: './my-templates.component.html',
  styleUrls: ['./my-templates.component.scss']
})
export class MyTemplatesComponent {
  public cards: TemplateCardDto[] = [];
  public page: number = 0;
  public pageSize: number = 4;
  public last: boolean = true;
  public first: boolean = true
  public totalPages: number = 1;

  constructor(private backendService: BackendRequestService,private templateUpdate:TemplateUpdateCardService) {

  }

  public ngOnInit(): void {
    this.getTemplates(this.page, this.pageSize);

    this.templateUpdate.triggered().subscribe(
      () => this.getTemplates(0,this.pageSize)
    )
  }

  public getTemplates(page: number, pageSize: number): void {
    this.backendService.requestGetMyTemplates(page, pageSize).subscribe(
      (response) => {
        if (response.length != 0) {
          this.cards = response.content
          this.first = response.first;
          this.last = response.last;
          this.totalPages = response.totalPages;

          this.page = page;
        }
      },
      (error) => {

      }
    );
  }
}
