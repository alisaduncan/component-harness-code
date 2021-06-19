import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TaskInputComponent } from './task-input.component';
import { By } from '@angular/platform-browser';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';

describe('TaskInputComponent - no harness', () => {
  let component: TaskInputComponent;
  let fixture: ComponentFixture<TaskInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskInputComponent, SentimentRatingStubComponent ],
      imports: [
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        FormsModule
      ]
    });

    fixture = TestBed.createComponent(TaskInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not enable add button until task text is added and task is rated',fakeAsync(() => {
    const ratingChangedSpy = spyOn(component, 'onRatingChanged').and.callThrough();
    const descriptionChangedSpy = spyOn(component, 'onDescriptionChanged').and.callThrough();
    expect(fixture.debugElement.query(By.css('button')).nativeElement.disabled).toBeTruthy();
    const inputEl = fixture.debugElement.query(By.css('input'));
    expect(inputEl).toBeTruthy();

    inputEl.nativeElement.value = 'Test task';
    inputEl.nativeElement.dispatchEvent(new Event('input'));

    const sentimentRating = fixture.debugElement.query(By.directive(SentimentRatingStubComponent));
    expect(sentimentRating).toBeTruthy();
    sentimentRating.injector.get(SentimentRatingStubComponent).triggerChange(5);
    fixture.detectChanges();

    expect(ratingChangedSpy).toHaveBeenCalledOnceWith(5);
    expect(descriptionChangedSpy).toHaveBeenCalledOnceWith('Test task');
    tick(100);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('button'))).toBeTruthy();
  }));

  it('should emit a new task as an event when one is added', fakeAsync(() => {
    const createdSpy = spyOn(component.created, 'emit').and.stub();

    const inputEl = fixture.debugElement.query(By.css('input'));
    expect(inputEl).toBeTruthy();

    inputEl.nativeElement.value = 'Test task';
    inputEl.nativeElement.dispatchEvent(new Event('input'));

    const sentimentRating = fixture.debugElement.query(By.directive(SentimentRatingStubComponent));
    expect(sentimentRating).toBeTruthy();
    sentimentRating.injector.get(SentimentRatingStubComponent).triggerChange(5);
    fixture.detectChanges();

    tick(100);
    fixture.detectChanges();

    const saveBtn = fixture.debugElement.query(By.css('button'));
    saveBtn.nativeElement.click();
    expect(createdSpy).toHaveBeenCalledOnceWith({description: 'Test task', rating: 5, completed: false});
  }));
});

@Component({
  template: '',
  selector: 'app-sentiment-rating'
})
class SentimentRatingStubComponent {
  @Input() public rate!: number;
  public get rating(): number {
    return this.rate;
  }
  public set rating(rate) {
    this.rate = rate;
  }

  @Output() public changed = new EventEmitter<number>();
  public triggerChange(rate: number): void {
    this.changed.emit(rate);
  }
}
