import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TidyTaskComponent } from './tidy-task.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBadgeHarness } from '@angular/material/badge/testing';

describe('TidyTaskComponent - with testing harnesses', () => {
  let component: TidyTaskComponent;
  let fixture: ComponentFixture<TidyTaskComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatBadgeModule
      ],
      declarations: [ TidyTaskComponent ]
    });

    fixture = TestBed.createComponent(TidyTaskComponent);
    component = fixture.componentInstance;
    component.tidyTask = {id: 1, description: 'tidy task', completed: false, rating: 3}
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should display a checkbox, task description, a badge, and a delete button', async () => {
    component.tidyTask = {id: 1, description: 'tidy up!', completed: false, rating: 3};
    fixture.detectChanges();
    await expectAsync(loader.getHarness(MatCheckboxHarness.with({label: 'tidy up!'}))).toBeResolved();

    const badge = await loader.getHarness(MatBadgeHarness);
    expect(await badge.getText()).toBe('3');

    const button = await loader.getHarness(MatButtonHarness);
    const icon = await button.getHarness(MatIconHarness);
    expect(await icon.getName()).toBe('delete');
  });

  it('should be checked and has tidy-task-completed class when task is completed', async () => {
    const checkbox = await loader.getHarness(MatCheckboxHarness);
    expect(await checkbox.isChecked()).toBeFalse();

    const checkboxHost = await checkbox.host();
    expect(await checkboxHost.hasClass('tidy-task-completed')).not.toBeTrue();

    component.tidyTask = {id: 1, description: 'tidy up!', completed: true, rating: 3}
    fixture.detectChanges();

    expect(await checkbox.isChecked()).toBeTrue();
    expect(await checkboxHost.hasClass('tidy-task-completed')).toBeTrue();
  });

  it('should apply completed class to match task completion', async () => {
    const checkbox = await loader.getHarness(MatCheckboxHarness.with({label: 'tidy task'}));
    expect(await checkbox.isChecked()).toBeFalse();

    const checkboxHost = await checkbox.host();
    expect(await checkboxHost.hasClass('tidy-task-completed')).not.toBeTrue();

    await checkbox.toggle();

    expect(await checkbox.isChecked()).toBeTrue();
    expect(await checkboxHost.hasClass('tidy-task-completed')).toBeTrue();
  });

  it('should emit change event when a task is complete', async () => {
    const changedSpy = spyOn(component.changed, 'emit').and.stub();
    const expected = {...component.tidyTask, completed: true};

    const checkbox = await loader.getHarness(MatCheckboxHarness);
    await checkbox.check();

    expect(changedSpy).toHaveBeenCalledOnceWith(expected);
  });

  it('should emit delete event when a task is deleted', async () => {
    const deletedSpy = spyOn(component.deleted, 'emit').and.stub();
    const expected = component.tidyTask;

    const actionsLoader = await loader.getChildLoader('.actions');
    const button = await actionsLoader.getHarness(MatButtonHarness);
    await button.click();

    expect(deletedSpy).toHaveBeenCalledOnceWith(expected);
  });
});
