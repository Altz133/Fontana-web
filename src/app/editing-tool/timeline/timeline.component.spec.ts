import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline.component';
import { TimelineBlocksService } from '../../services/timeline-blocks.service';
import { HttpClientModule } from '@angular/common/http'; // import HttpClientModule
import { of } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BlockComponent } from '../block/block.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;
  let blockService: TimelineBlocksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineComponent, BlockComponent],
      providers: [TimelineBlocksService, MatDialog],
      imports: [HttpClientModule, MatSnackBarModule, MatDialogModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    blockService = TestBed.inject(TimelineBlocksService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', () => {
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(ngOnInitSpy).toHaveBeenCalled();
  });

  it('should add block correctly', () => {
    const blockAddedSubject = (blockService as any).blockAddedSubject;
    component.ngOnInit();
    blockAddedSubject.next({ rems: 10, isCopy: false, index: 0 });
    fixture.detectChanges();

    expect(component.blocks.length).toEqual(1);
    expect(component.blocks[0].width).toEqual('10');
    expect(component.blocks[0].isCopy).toEqual(false);
    expect(component.blocks[0].index).toEqual(0);
  });
});
