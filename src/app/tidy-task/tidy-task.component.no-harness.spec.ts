import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TidyTaskComponent } from './tidy-task.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatBadgeModule } from '@angular/material/badge';

describe('TidyTaskComponent - no testing harnesses', () => {
  let component: TidyTaskComponent;
  let fixture: ComponentFixture<TidyTaskComponent>;

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a checkbox, task description, a badge, and a delete button', () => {
    component.tidyTask = {id: 1, description: 'tidy up!', completed: false, rating: 3};
    fixture.detectChanges();

    const matCheckbox = fixture.debugElement.query(By.css('mat-checkbox'));
    expect(matCheckbox).toBeTruthy();
    const checkBoxEl = matCheckbox.query(By.css('input'));
    expect(checkBoxEl).toBeTruthy();
    expect(checkBoxEl.nativeElement.type).toBe('checkbox');

    const checkBoxTextEl = matCheckbox.query(By.css('.mat-checkbox-label'));
    expect(checkBoxTextEl).toBeTruthy();
    expect(checkBoxTextEl.nativeElement.innerText).toBe('tidy up!');

    const badgeEl = fixture.debugElement.query(By.css('.mat-badge'));
    expect(badgeEl).toBeTruthy();
    const badgeCountEl = fixture.debugElement.query(By.css('span.mat-badge-content'));
    expect(badgeCountEl.nativeElement.innerText).toBe('3')

    const deleteBtn = fixture.debugElement.query(By.css('button'));
    expect(deleteBtn).toBeTruthy();
    const icon = deleteBtn.query(By.css('mat-icon'));
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.innerText).toBe('delete');
  });

  it('should be checked and have tidy-task-completed class when task is completed', () => {
    const matCheckbox = fixture.debugElement.query(By.css('mat-checkbox'));
    expect(matCheckbox).toBeTruthy();
    const checkBoxEl = matCheckbox.query(By.css('input'));
    expect(checkBoxEl).toBeTruthy();
    expect(checkBoxEl.nativeElement.checked).toBe(false, 'checkbox should not be checked');
    expect(matCheckbox.nativeElement.classList).not.toContain('tidy-task-completed');

    component.tidyTask = {id: 1, description: 'tidy up!', completed: true, rating: 3}
    fixture.detectChanges();

    expect(checkBoxEl.nativeElement.checked).toBe(true, 'checkbox should be checked');
    expect(matCheckbox.nativeElement.classList).toContain('tidy-task-completed');
  });

  it('should apply completed class to match task completion', () => {
    const matCheckbox = fixture.debugElement.query(By.css('mat-checkbox'));
    expect(matCheckbox).toBeTruthy();
    const checkBoxEl = matCheckbox.query(By.css('input'));
    expect(checkBoxEl).toBeTruthy();
    expect(checkBoxEl.nativeElement.checked).toBe(false, 'checkbox should not be checked');
    expect(matCheckbox.nativeElement.classList).not.toContain('tidy-task-completed');

    const checkBoxClickHandlerElement = fixture.debugElement.query(By.css('.mat-checkbox-inner-container'));
    checkBoxClickHandlerElement.nativeElement.click();
    fixture.detectChanges();

    expect(checkBoxEl.nativeElement.checked).toBe(true, 'checkbox should be checked');
    expect(matCheckbox.nativeElement.classList).toContain('tidy-task-completed');
    expect(component.tidyTask.completed).toBeTrue();
  });

  it('should emit change event when a task is complete', () => {
    const changedSpy = spyOn(component.changed, 'emit').and.stub();
    const expected = {...component.tidyTask, completed: true};

    const checkBoxEl = fixture.debugElement.query(By.css('.mat-checkbox-inner-container'));
    expect(checkBoxEl).toBeTruthy();
    checkBoxEl.nativeElement.click();

    expect(changedSpy).toHaveBeenCalledOnceWith(expected);
  });

  it('should emit delete event when a task is deleted', () => {
    const deletedSpy = spyOn(component.deleted, 'emit').and.stub();
    const expected = component.tidyTask;

    const deleteBtn = fixture.debugElement.query(By.css('button'));
    expect(deleteBtn).toBeTruthy();
    deleteBtn.triggerEventHandler('click', null);

    expect(deletedSpy).toHaveBeenCalledOnceWith(expected);
  });
});
