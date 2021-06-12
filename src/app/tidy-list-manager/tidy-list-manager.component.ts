import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TidyTask } from '../models/tidy-task';
import { TidyTaskStore } from './tidy-task.store';

@Component({
  selector: 'app-tidy-list-manager',
  templateUrl: './tidy-list-manager.component.html',
  styleUrls: ['./tidy-list-manager.component.scss'],
  providers: [TidyTaskStore]
})
export class TidyListManagerComponent implements OnInit {
  public tidyList$! : Observable<TidyTask[]>;
  public newTidyListItem: string|undefined;

  constructor(private readonly tidyTaskStore: TidyTaskStore ) { }

  public ngOnInit(): void {
    this.tidyList$ = this.tidyTaskStore.selectTidyTasks$;
  }

  public addTidyListItem(description: string): void {
    this.tidyTaskStore.addTidyTask({description, completed: false} as TidyTask);
  }

  public onTidyListItemChanged(item: TidyTask): void {
    this.tidyTaskStore.updateTidyTask(item);
  }

  public onTidyListItemDeleted(item: TidyTask): void {
    this.tidyTaskStore.deleteTidyTask(item);
  }

}
