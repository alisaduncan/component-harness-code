import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { SentimentRatingComponent } from '../sentiment-rating.component';
import { MatButtonModule } from '@angular/material/button';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { SentimentRatingHarness } from './sentiment-rating-harness';
import { MatIconModule } from '@angular/material/icon';

describe('SentimentRating Harness', () => {
  let fixture: ComponentFixture<SentimentRatingHarnessTest>;
  let component: SentimentRatingHarnessTest;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SentimentRatingHarnessTest, SentimentRatingComponent],
      imports: [
        MatButtonModule,
        MatIconModule
      ]
    });

    fixture = TestBed.createComponent(SentimentRatingHarnessTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  })

  it('should load harness', async () => {
    const els = await loader.getAllHarnesses(SentimentRatingHarness);
    expect(els.length).toBe(1);
  });

  it('should filter by rate', async () => {
    const sentimentThreeRates = await loader.getAllHarnesses(SentimentRatingHarness.with({rate: 3}));
    expect(sentimentThreeRates.length).toBe(1);

    const sentimentOneRates = await loader.getAllHarnesses(SentimentRatingHarness.with({rate: 1}));
    expect(sentimentOneRates.length).toBe(0);
  });

  it('should throw when querying for a rate and one is not found', async () => {
    await expectAsync(loader.getHarness(SentimentRatingHarness.with({rate: 3}))).toBeResolved();
    expect(await loader.getHarness(SentimentRatingHarness.with({rate: 3}))).toBeTruthy();
    await expectAsync(loader.getHarness(SentimentRatingHarness.with({rate: 1}))).toBeRejected();
  });

  it('should set rate', async () => {
    const rateHarness = await loader.getHarness(SentimentRatingHarness);
    expect(await rateHarness.getRate()).toBe(3);

    await rateHarness.setRate(5);
    expect(component.rateChanged).toBe(5);
    expect(await rateHarness.getRate()).toBe(5);
  });

  it('should throw on invalid rates', async () => {
    const rateHarness = await loader.getHarness(SentimentRatingHarness);
    await expectAsync(rateHarness.setRate(-1)).toBeRejectedWith(Error('Rate is invalid'));
    await expectAsync(rateHarness.setRate(0)).toBeRejectedWith(Error('Rate is invalid'));
    await expectAsync(rateHarness.setRate(6)).toBeRejectedWith(Error('Rate exceeds supported rate options'));
  });
});

@Component({
  template: `
    <app-sentiment-rating [rate]="rate" (changed)="onRateChanged($event)"></app-sentiment-rating>
  `
})
class SentimentRatingHarnessTest {
  public rate = 3;
  public rateChanged: number | undefined = undefined;

  public onRateChanged(rate: number): void {
    this.rateChanged = rate;
  }
}
