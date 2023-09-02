import { Component, OnInit } from '@angular/core';
import { ScheduleDto } from "../../shared/dtos/schedule-dto";
import { BackendRequestService } from "../../services/backend-request.service";
import { CookieService } from "ngx-cookie-service";
import {API_CONFIG} from "../../api-config/api-config";

@Component({
  selector: 'app-schedule-cards-snippet',
  templateUrl: './schedule-cards-snippet.component.html',
  styleUrls: ['./schedule-cards-snippet.component.scss']
})
export class ScheduleCardsSnippetComponent implements OnInit {
  public schedules: ScheduleDto[] = [];


  constructor(private backendService: BackendRequestService, private cookieService: CookieService) {}

  ngOnInit(): void {

    this.backendService.requestGET(API_CONFIG.GET_SNIPPETS).subscribe(
        (response) => {

          this.schedules = response;
        },
        (error) => {

        }
    );
  }

}
