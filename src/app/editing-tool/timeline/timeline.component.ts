import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimelineBlocksService } from '../../services/timeline-blocks.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, OnDestroy {
  public totalDuration = 480;

  public ticks: any[] = [];
  public blocks: any = [];
  private blocksPosition = 0;

  private subsription!: Subscription;

  constructor(private blockService: TimelineBlocksService) {}

  public ngOnInit(): void {
    this.createTimeLine();

    this.addBlock();

    this.updateBlocks();
  }

  public ngOnDestroy(): void {
    this.subsription.unsubscribe();
  }

  public drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.blocks, event.previousIndex, event.currentIndex);

    this.blockService.moveBlock(event.previousIndex, event.currentIndex);

    const start = Math.min(event.previousIndex, event.currentIndex);
    const end = Math.max(event.previousIndex, event.currentIndex);

    for (let i = start; i <= end; i++) {
      this.blocks[i].index = i;
    }
  }

  public addBlock(): void {
    this.subsription = this.blockService.blockAdded$.subscribe((info) => {
      let rems = info.rems;
      this.totalDuration += info.rems;
      this.blocks.push({
        width: `${rems}`,
        isCopy: info.isCopy,
        index: info.index,
      });
      this.blocksPosition += rems;
      this.updateTicks();
    });
  }

  public updateBlocks(): void {
    this.subsription = this.blockService.blockRemoved$.subscribe((index) => {
      if (index === -1) {
        return;
      }

      const removedBlockDuration = parseInt(this.blocks[index].width, 10);

      this.blocks.splice(index, 1);
      for (let i = index; i < this.blocks.length; i++) {
        this.blocks[i].index = i;
      }
      this.blocksPosition -= removedBlockDuration;
    });
  }

  public onMouseDown(): void {
    document.body.style.cursor = 'grabbing';
  }

  private createTimeLine(): void {
    for (let i = 0; i < this.totalDuration; i++) {
      if ((i + 1) % 4 === 0) {
        this.ticks.push({ class: 'tick second', second: i / 4 });
      } else {
        this.ticks.push({ class: 'tick half-second', second: null });
      }
    }
  }

  private updateTicks(): void {
    const max = this.totalDuration;
    for (let i = this.ticks.length; i < max; i++) {
      if ((i + 1) % 4 === 0) {
        this.ticks.push({ class: 'tick second', second: i / 4 });
      } else {
        this.ticks.push({ class: 'tick half-second', second: null });
      }
    }
  }
}
