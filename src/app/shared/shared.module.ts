import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentimentRatingComponent } from './sentiment-rating/sentiment-rating.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [SentimentRatingComponent],
  exports: [SentimentRatingComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class SharedModule { }
