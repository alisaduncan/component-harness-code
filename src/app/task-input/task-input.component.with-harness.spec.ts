import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TaskInputComponent } from './task-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { SentimentRatingComponent } from '../shared/sentiment-rating/sentiment-rating.component';
import { SharedModule } from '../shared/shared.module';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { SentimentRatingHarness } from '../shared/sentiment-rating/testing/sentiment-rating-harness';

describe('TaskInputComponent', () => {
  let component: TaskInputComponent;
  let fixture: ComponentFixture<TaskInputComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskInputComponent, SentimentRatingComponent ],
      imports: [
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        SharedModule
      ]
    });

    fixture = TestBed.createComponent(TaskInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable add button until task text is added and task is rated', fakeAsync(async () => {
    const ratingChangedSpy = spyOn(component, 'onRatingChanged').and.callThrough();
    const descriptionChangedSpy = spyOn(component, 'onDescriptionChanged').and.callThrough();

    const btn = await loader.getHarness(MatButtonHarness.with({text: 'add_box'}));
    expect(await btn.isDisabled()).toBeTruthy();
    const input = await loader.getHarness(MatInputHarness);
    await input.setValue('Test task');

    const sentiment = await loader.getHarness(SentimentRatingHarness);
    await sentiment.setRate(5);

    expect(ratingChangedSpy).toHaveBeenCalledOnceWith(5);
    expect(descriptionChangedSpy).toHaveBeenCalledWith('Test task');
    tick(100);

    await expectAsync(loader.getHarness(MatButtonHarness.with({text: 'add_box'}))).toBeResolved();
  }));

  it('should emit a new task as an event when one is added', fakeAsync(async () => {
    const createdSpy = spyOn(component.created, 'emit').and.stub();

    const input = await loader.getHarness(MatInputHarness);
    await input.setValue('Test task');

    const sentiment = await loader.getHarness(SentimentRatingHarness);
    await sentiment.setRate(5);

    tick(100);

    const addBtn = await loader.getHarness(MatButtonHarness.with({text: 'add_box'}));
    await addBtn.click();

    expect(createdSpy).toHaveBeenCalledOnceWith({description: 'Test task', rating: 5, completed: false});
  }));
});
