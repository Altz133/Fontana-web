import { Component, OnInit, ViewChild } from '@angular/core';
import { TimelineComponent } from './timeline/timeline.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddBlockComponent } from './dialogs/dialog-add-block/dialog-add-block.component';
import { LiveControlDataTransferService } from '../live-controller/service/live-control-data-transfer.service';
import { TimelineBlocksService } from '../services/timeline-blocks.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { DialogYesNoOptionsComponent } from './dialogs/dialog-yes-no-options/dialog-yes-no-options.component';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-editing-tool',
  templateUrl: './editing-tool.component.html',
  styleUrls: ['./editing-tool.component.scss'],
})
export class EditingToolComponent implements OnInit {
  public templateName = new FormControl('', Validators.required);
  public isVisible = true;
  public visibilityIcon = 'visibility';
  public visibilityText = 'PUBLIC';
  public isRedirecting = false;
  @ViewChild(TimelineComponent, { static: false })
  private timelineComponent!: TimelineComponent;
  private readonly DIALOG_WIDTH = '30rem';
  public isLoading = false;

  constructor(
    private dialog: MatDialog,
    private dataTransferService: LiveControlDataTransferService,
    private blockService: TimelineBlocksService,
    private redirect: Router
  ) {}

  public ngOnInit(): void {
    this.dataTransferService.getMobileView(true);
    this.dataTransferService.getEditingToolStatus(true);
  }

  public ngOnDestroy(): void {
    this.dataTransferService.getEditingToolStatus(false);
  }

  public openAddBlockDialog(): void {
    const addBlockDialogRef = this.dialog.open(DialogAddBlockComponent, {
      width: this.DIALOG_WIDTH,
    });

    addBlockDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.blockService.addBlock(result, false);
        this.blockService.setDuration(result);
        this.blockService.saveBlock();
      }
    });
  }

  public saveTemplate(): void {
    if (this.templateName.invalid) {
      this.templateName.markAsTouched();
    } else {
      const dialogRef = this.dialog.open(DialogYesNoOptionsComponent, {
        width: this.DIALOG_WIDTH,
        data: { option: 'save' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'save') {
          if (
            this.templateName.value != null &&
            typeof this.templateName.value === 'string'
          ) {
            this.blockService.getName(this.templateName.value);
          }
          this.blockService.getStatus(this.visibilityText);
          this.save();
        }
      });
    }
  }

  public back(): void {
    const dialogRef = this.dialog.open(DialogYesNoOptionsComponent, {
      width: this.DIALOG_WIDTH,
      data: { option: 'close' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'exit') {
        this.close();
      } else if (result === 'exitanddraft') {
        if (
          this.templateName.value != null &&
          typeof this.templateName.value === 'string'
        ) {
          this.blockService.getName(this.templateName.value);
        }
        this.blockService.getStatus('DRAFT');
        this.save();
      }
    });
  }

  public play(): void {}

  public toggleVisibility(): void {
    this.isVisible = !this.isVisible;
    this.visibilityIcon = this.isVisible ? 'visibility' : 'visibility_off';
    this.visibilityText = this.isVisible ? 'PUBLIC' : 'PRIVATE';
  }

  private close(): void {
    this.redirect.navigate(['/dashboard']);
    this.isRedirecting = true;
  }

  private save(): void {
    const saveTemplate$ = this.blockService.saveTemplate();
    this.isLoading = true;
    if (saveTemplate$ !== EMPTY) {
      saveTemplate$.subscribe(
        (response) => {
          this.isLoading = false;
          this.close();
        },
        (error) => {
          this.isLoading = false;
        }
      );
    }
    this.isLoading = false;
  }

  public onMouseUp(): void {
    document.body.style.cursor = 'default';
  }
}
