import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sentiment-rating',
  template: `
    <button mat-icon-button
            *ngFor="let rating of sentimentRating; index as i"
            (click)="onRating(rating)"
            [color]="rate > i ? 'accent' : ''">

      <mat-icon *ngIf="i >= rate">favorite_border</mat-icon>
      <mat-icon *ngIf="rate > i">favorite</mat-icon>
    </button>
  `
})
export class SentimentRatingComponent{
  public sentimentRating = [1, 2, 3, 4, 5];
  @Input() public rate = 0;
  @Output() public changed = new EventEmitter<number>();
  constructor() { }

  public onRating(rating: number): void {
    this.rate = rating;
    this.changed.emit(rating);
  }
}
