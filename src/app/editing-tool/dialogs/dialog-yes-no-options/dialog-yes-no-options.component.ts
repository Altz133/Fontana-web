import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-yes-no-options',
  templateUrl: './dialog-yes-no-options.component.html',
  styleUrls: ['./dialog-yes-no-options.component.scss'],
})
export class DialogYesNoOptionsComponent {
  public saveAsDraft = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { message: string; option: 'close' | 'save' },
    private dialogRef: MatDialogRef<DialogYesNoOptionsComponent>
  ) {}

  public onNo(): void {
    this.dialogRef.close();
  }

  public onYes(): void {
    if (this.data.option === 'close') {
      this.dialogRef.close(this.saveAsDraft ? 'exitanddraft' : 'exit');
    } else if (this.data.option === 'save') {
      this.dialogRef.close('save');
    }
  }
}
