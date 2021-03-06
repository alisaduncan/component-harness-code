import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TidyTask } from '../models/tidy-task';

@Component({
  selector: 'app-tidy-task',
  templateUrl: './tidy-task.component.html',
  styleUrls: ['./tidy-task.component.scss']
})
export class TidyTaskComponent {
  @Input() public tidyTask!: TidyTask;
  @Output() public changed = new EventEmitter<TidyTask>();
  @Output() public deleted = new EventEmitter<TidyTask>();

  constructor() { }

  public onChecked(): void {
    this.tidyTask.completed = !this.tidyTask.completed;
    this.changed.emit(this.tidyTask);
  }

  public onDeleted(): void {
    this.deleted.emit(this.tidyTask);
  }
}
