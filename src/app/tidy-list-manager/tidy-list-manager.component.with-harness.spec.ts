import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TidyListManagerComponent } from './tidy-list-manager.component';
import { TidyTaskStore } from './tidy-task.store';
import { of } from 'rxjs';
import { TidyTask } from '../models/tidy-task';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

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
describe('TidyListManagerComponent - with testing harnesses', () => {
  let component: TidyListManagerComponent;
  let fixture: ComponentFixture<TidyListManagerComponent>;
  let loader: HarnessLoader;

  const TASKS: TidyTask[] = [
    {id: 100, description: 'Tidy up test!', completed: false},
    {id: 101, description: 'Tidy up test2', completed: true},
  ]
  const fakeStore = jasmine.createSpyObj([
    'addTidyTask', 'updateTidyTask', 'deleteTidyTask'
  ], ['selectTidyTasks$']);

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ TidyListManagerComponent, TidyTaskStubComponent ],
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        FormsModule
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
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create and load harnesses', async () => {
    expect(component).toBeTruthy();
    const inputs = await loader.getAllHarnesses(MatInputHarness);
    expect(inputs.length).toBe(1);
    const formField = await loader.getHarness(MatFormFieldHarness.with({floatingLabelText: 'I need to...'}));
    expect(formField).toBeTruthy();
  });

  it('should display all tidy task items', () => {
    const tidyTaskList = fixture.debugElement.queryAll(By.directive(TidyTaskStubComponent));
    expect(tidyTaskList.length).toBe(2);
  });

  it('should not show add button until task text is added', async () => {
    expect((await loader.getAllHarnesses(MatButtonHarness)).length).toBeFalsy();
    const input = await loader.getHarness(MatInputHarness);
    expect(input).toBeTruthy();
    await input.setValue('Test task');
    expect(async () => await loader.getHarness(MatButtonHarness.with({text: 'add'}))).not.toThrow();
  });

  it('should create a new task when one is added', async () => {
    const addTidyTaskSpy = spyOn(component, 'addTidyListItem').and.callThrough();

    const input = await loader.getHarness(MatInputHarness);
    expect(input).toBeTruthy();
    await input.setValue('Test task');

    const saveBtn = await loader.getHarness(MatButtonHarness);
    await saveBtn.click();
    expect(addTidyTaskSpy).toHaveBeenCalledOnceWith('Test task');
    expect(fakeStore.addTidyTask).toHaveBeenCalledOnceWith({description: 'Test task', completed: false});
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
