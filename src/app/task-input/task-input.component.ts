import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { TidyTask } from '../models/tidy-task';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-task-input',
  template: `
    <div class="tidy-task-input">
      <mat-form-field>
        <mat-label>I need to...</mat-label>
        <input matInput type="text" [(ngModel)]="description" (ngModelChange)="onDescriptionChanged($event)">
      </mat-form-field>
      <app-sentiment-rating [rate]="rating" (changed)="onRatingChanged($event)"></app-sentiment-rating>
      <button mat-icon-button color="accent" *ngIf="valid$ | async" (click)="onTidyTaskCreated()">
        <mat-icon>add_box</mat-icon>
      </button>
    </div>
  `,
  styleUrls: ['./task-input.component.scss'],
})
export class TaskInputComponent implements OnInit {
  @Output() public created = new EventEmitter<TidyTask>();
  public description: string|undefined;
  public rating = 0;
  public valid$!: Observable<boolean>;

  private descriptionSub$ = new Subject<string>();
  private ratingSub$ = new Subject<number>();
  constructor() {
  }

  public ngOnInit(): void {
    this.valid$ = combineLatest([
      this.descriptionSub$.pipe(
        debounceTime(100),
        distinctUntilChanged()
        ),
      this.ratingSub$
    ]).pipe(
      map(([description, rating]: [string, number]) => !!description && !!rating)
    );
  }

  public onDescriptionChanged(description: string) {
    this.descriptionSub$.next(description.trim());
  }

  public onRatingChanged(rating: number) {
    this.rating = rating;
    this.ratingSub$.next(rating);
  }

  public onTidyTaskCreated(): void {
    this.created.emit({description: this.description, rating: this.rating, completed: false} as TidyTask);
    this.resetTask();
  }

  private resetTask(): void {
    this.description = undefined;
    this.rating = 0;
    this.onRatingChanged(0);
  }


}
