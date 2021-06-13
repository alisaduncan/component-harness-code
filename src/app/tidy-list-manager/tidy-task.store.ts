import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { TidyTask } from '../models/tidy-task';
import { Observable } from 'rxjs';

interface TidyTasksState {
  tasks: TidyTask[]
}

const defaultTasks: TidyTask[] = [
  { id: 1, description: 'Gather all books', completed: true, rating: 1},
  { id: 2, description: 'Sort by category', completed: false, rating: 2},
  { id: 3, description: 'Donate books that available online', completed: false, rating: 5}
];

@Injectable()
export class TidyTaskStore extends ComponentStore<TidyTasksState> {
  constructor() {
    super({tasks: defaultTasks})
  }

  // selectors
  public readonly selectTidyTasks$: Observable<TidyTask[]> = this.select(state => state.tasks);

  // updaters
  public readonly addTidyTask = this.updater((state, tidyTask: TidyTask) => ({
    tasks: [...state.tasks, {...tidyTask, id: state.tasks.length + 1}]
  }));

  public readonly updateTidyTask = this.updater((state, tidyTask: TidyTask) => ({
    tasks: [...state.tasks.map(t => t.id === tidyTask.id ? tidyTask : t)]
  }));

  public readonly deleteTidyTask = this.updater((state, tidyTask: TidyTask) => ({
    tasks: [...state.tasks.filter(t => t.id !== tidyTask.id)]
  }));

}
