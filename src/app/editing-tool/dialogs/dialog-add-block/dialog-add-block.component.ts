import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-block',
  templateUrl: './dialog-add-block.component.html',
  styleUrls: ['./dialog-add-block.component.scss'],
})
export class DialogAddBlockComponent {
  public seconds: number = 0;

  private readonly SECONDS_MULTIPLIER = 4;

  constructor(public dialogRef: MatDialogRef<DialogAddBlockComponent>) {}

  public onAdd(): void {
    const totalRems = this.seconds * this.SECONDS_MULTIPLIER;
    this.dialogRef.close(totalRems);
  }
}
