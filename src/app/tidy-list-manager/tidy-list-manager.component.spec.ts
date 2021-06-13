import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TidyListManagerComponent } from './tidy-list-manager.component';
import { TidyTaskStore } from './tidy-task.store';
import { of } from 'rxjs';
import { TidyTask } from '../models/tidy-task';

describe('TidyListManagerComponent', () => {
  let component: TidyListManagerComponent;
  let fixture: ComponentFixture<TidyListManagerComponent>;

  const TASKS: TidyTask[] = [
    {id: 100, description: 'Tidy up test!', completed: false, rating: 3},
    {id: 101, description: 'Tidy up test2', completed: true, rating: 5},
  ]
  const fakeStore = jasmine.createSpyObj([
    'addTidyTask', 'updateTidyTask', 'deleteTidyTask'
  ], ['selectTidyTasks$']);

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ TidyListManagerComponent, TidyTaskStubComponent, TaskInputStubComponent ],
      imports: [
        NoopAnimationsModule
      ]
    });
    TestBed.overrideProvider(TidyTaskStore, {useValue: fakeStore});
    fixture = TestBed.createComponent(TidyListManagerComponent);
    component = fixture.componentInstance;

    (Object.getOwnPropertyDescriptor(fakeStore, 'selectTidyTasks$')?.get as jasmine.Spy).and.returnValue(of(TASKS));
    fakeStore.addTidyTask.and.stub();
    fakeStore.updateTidyTask.and.stub();
    fakeStore.deleteTidyTask.and.stub();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all tidy task items', () => {
    const tidyTaskList = fixture.debugElement.queryAll(By.directive(TidyTaskStubComponent));
    expect(tidyTaskList.length).toBe(2);
  });

  it('should create a new task when one is added', () => {
    const addTidyTaskSpy = spyOn(component, 'addTidyListItem').and.callThrough();
    const task = {description: 'Let\'s tidy', rating: 2} as TidyTask;

    const taskInputComponent = fixture.debugElement.query(By.directive(TaskInputStubComponent));
    expect(taskInputComponent).toBeTruthy();
    taskInputComponent.componentInstance.triggerTaskCreated(task);

    const expected = {...task, completed: false};
    expect(addTidyTaskSpy).toHaveBeenCalledOnceWith(expected);
    expect(fakeStore.addTidyTask).toHaveBeenCalledOnceWith(expected);
  });

  it('should change task when change event is emitted', () => {
    const changeTidyTaskSpy = spyOn(component, 'onTidyListItemChanged').and.callThrough();

    const tidyTaskList = fixture.debugElement.queryAll(By.directive(TidyTaskStubComponent));
    const uncompletedTask = tidyTaskList.map(de => de.injector.get(TidyTaskStubComponent)).find(t => t.task?.completed === false);
    expect(uncompletedTask).toBeTruthy();
    uncompletedTask!.tidyTask.completed = true;
    uncompletedTask!.changeTaskEvent();

    expect(changeTidyTaskSpy).toHaveBeenCalled();
    expect(fakeStore.updateTidyTask).toHaveBeenCalledOnceWith(uncompletedTask!.tidyTask);
  });

  it('should delete task when change event is emitted', () => {
    const deleteTidyTaskSpy = spyOn(component, 'onTidyListItemDeleted').and.callThrough();

    const tidyTaskList =
      fixture.debugElement.queryAll(By.directive(TidyTaskStubComponent)).map(de => de.injector.get(TidyTaskStubComponent));
    expect(tidyTaskList.length).toBeGreaterThanOrEqual(1);
    tidyTaskList[0].deleteTaskEvent();

    expect(deleteTidyTaskSpy).toHaveBeenCalled();
    expect(fakeStore.deleteTidyTask).toHaveBeenCalledOnceWith(tidyTaskList[0].tidyTask);
  });
});

@Component({
  template: '',
  selector: 'app-tidy-task'
})
class TidyTaskStubComponent {
  @Input() public tidyTask!: TidyTask;
  public get task(): TidyTask {
    return this.tidyTask;
  }
  @Output() public changed = new EventEmitter<TidyTask>();
  @Output() public deleted = new EventEmitter<TidyTask>();

  public changeTaskEvent(): void {
    this.changed.emit(this.tidyTask);
  }
  public deleteTaskEvent(): void {
    this.deleted.emit(this.tidyTask);
  }
}

@Component({
  template: '',
  selector: 'app-task-input'
})
class TaskInputStubComponent {
  @Output() public created = new EventEmitter<TidyTask>();
  public triggerTaskCreated(tidyTask: TidyTask): void {
    this.created.emit({...tidyTask, completed: false});
  }
}
