import {Component, ElementRef, ViewChild} from '@angular/core';
import {TemplateCardDto} from "../../shared/dtos/template-card-dto";
import {BackendRequestService} from "../../services/backend-request.service";
import {TemplateUpdateCardService} from "../../services/template-update-card";

@Component({
  selector: 'app-templates-list',
  templateUrl: './templates-list.component.html',
  styleUrls: ['./templates-list.component.scss']
})
export class TemplatesListComponent {
  public cards: TemplateCardDto[] = [];
  public page: number = 0;
  public pageSize: number = 4;
  public last: boolean = true;
  public first: boolean = true;
  public totalPages: number = 1;
  @ViewChild('searchName') private searchName ?: ElementRef;

  constructor(private backendService: BackendRequestService,private templateUpdate:TemplateUpdateCardService) {

  }

  public ngOnInit(): void {
    this.getTemplates(this.page, this.pageSize);

    this.templateUpdate.triggered().subscribe(
      () => this.getTemplates(0,this.pageSize)
    )
  }

  public search(): void {
    this.getTemplates(0, this.pageSize);
  }


  public getTemplates(page: number, pageSize: number) :void {
    this.backendService.requestGetPublicTemplates(this.searchName?.nativeElement.value ?? "", page, pageSize).subscribe(
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
