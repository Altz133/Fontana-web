import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogBlockOptionsComponent } from '../dialogs/dialog-block-options/dialog-block-options.component';
import { BlockType } from '../../shared/models/block.type';
import { TimelineBlocksService } from '../../services/timeline-blocks.service';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
})
export class BlockComponent implements OnInit, OnDestroy {
  @Input() public width!: number;
  @Input() public isCopy!: boolean;
  @Input() public index!: number;

  public block!: BlockType;
  public backgroundColor!: string;

  private readonly MAX_COLOR = 256;
  private readonly DialogWidth = '30rem';

  constructor(
    public dialog: MatDialog,
    private blockService: TimelineBlocksService
  ) {
    if (this.isCopy) {
      this.block = this.blockService.getCopyBlock();
    } else {
      this.block = this.blockService.getBlock();
    }
  }

  public ngOnInit(): void {
    if (this.isCopy) {
      this.backgroundColor = this.blockService.getColor();
    } else {
      this.backgroundColor = this.getRandomColor();
    }
  }

  public ngOnDestroy(): void {}

  public getRandomColor(): string {
    let color;
    do {
      color = `rgba(${Math.floor(Math.random() * this.MAX_COLOR)}, ${Math.floor(
        Math.random() * this.MAX_COLOR
      )}, ${Math.floor(Math.random() * this.MAX_COLOR)},0.8)`;
    } while (this.isGrayScale(color));
    return color;
  }

  public openDialog(): void {
    this.dialog.open(DialogBlockOptionsComponent, {
      width: this.DialogWidth,
      data: { block: this.block, index: this.index },
    });
  }

  public copyBlock(): void {
    this.blockService.copyBlock(
      this.block,
      this.block.duration,
      this.backgroundColor
    );
  }

  public deleteBlock(): void {
    this.blockService.deleteBlock(this.index);
  }

  public onMouseDown(): void {
    document.body.style.cursor = 'grabbing';
  }

  private isGrayScale(color: string): boolean {
    const rgbValues = color
      .slice(4, -1)
      .split(',')
      .map((num) => +num);
    return (
      rgbValues[0] === rgbValues[1] &&
      rgbValues[1] === rgbValues[2] &&
      (rgbValues[0] > 200 || rgbValues[0] < 50)
    );
  }
}
