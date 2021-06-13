import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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

  constructor(private readonly tidyTaskStore: TidyTaskStore ) { }

  public ngOnInit(): void {
    this.tidyList$ = this.tidyTaskStore.selectTidyTasks$;
  }

  public addTidyListItem(tidyTask: TidyTask): void {
    this.tidyTaskStore.addTidyTask(tidyTask);
  }

  public onTidyListItemChanged(item: TidyTask): void {
    this.tidyTaskStore.updateTidyTask(item);
  }

  public onTidyListItemDeleted(item: TidyTask): void {
    this.tidyTaskStore.deleteTidyTask(item);
  }

}
