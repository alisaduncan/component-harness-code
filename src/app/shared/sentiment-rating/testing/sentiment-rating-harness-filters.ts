import { BaseHarnessFilters } from '@angular/cdk/testing';

export interface SentimentRatingHarnessFilters extends BaseHarnessFilters {
  rate?: number;
}
