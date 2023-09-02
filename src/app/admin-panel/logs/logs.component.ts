import { Component, OnInit } from '@angular/core';
import { LogsService } from "../../services/logs.service";
import {Log} from "../../shared/models/log.type";

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  logs: Log[] = [];
  public currentPage: number = 0;
  public totalPages: number = 1;

  constructor(private logsService: LogsService) {
  }

  public ngOnInit(): void {
    this.fetchLogs();
  }

  public fetchLogs(): void {
    this.logsService.getLogs(this.currentPage).subscribe((response) => {
      this.logs = response.content;
      this.totalPages = response.totalPages;
    });
  }

  public prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchLogs();
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.fetchLogs();
    }
  }
  public downloadLogs(): void {
    this.logsService.downloadAllLogs().subscribe(
        data => {
          const blob = new Blob([data], { type: 'text/plain' });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = 'logs.txt';
          a.click();

          window.URL.revokeObjectURL(url);
        },
        error => {
          console.error('Error downloading the file:', error);
        }
    );
  }
}
