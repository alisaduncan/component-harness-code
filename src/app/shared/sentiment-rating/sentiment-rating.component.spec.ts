import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentRatingComponent } from './sentiment-rating.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('SentimentRatingComponent', () => {
  let component: SentimentRatingComponent;
  let fixture: ComponentFixture<SentimentRatingComponent>;
  let loader: HarnessLoader;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ SentimentRatingComponent ],
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatIconModule
      ]
    });

    fixture = TestBed.createComponent(SentimentRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an unfilled button for each rate option', async () => {
    const [allBtns, unfilledBtns] = await parallel(() => [
      loader.getAllHarnesses(MatButtonHarness),
      loader.getAllHarnesses(MatButtonHarness.with({text: 'favorite_border'}))
    ]);

    expect(allBtns.length).toBe(component.sentimentRating.length);
    expect(unfilledBtns.length).toBe(component.sentimentRating.length);
    expect(component.rate).toBe(0);
  });

  it('should show filled button icons that matches the rating', async () => {
    const expectedIcons = ['favorite', 'favorite', 'favorite', 'favorite_border', 'favorite_border'];
    const expectedClasses = [true, true, true, false, false];

    component.rate = 3;
    fixture.detectChanges();
    const btns = await loader.getAllHarnesses(MatButtonHarness);
    const btnText = await parallel(() => btns.map(btn => btn.getText()));
    expect(btnText).toEqual(expectedIcons);
    const accents = await parallel(() => btns.map(async btn => (await btn.host()).hasClass('mat-accent')));
    expect(accents).toEqual(expectedClasses);
  });

  it('selecting a rating should turn emit an event with rate', async() => {
    const changedSpy = spyOn(component.changed, 'emit').and.stub();
    const expectedRate = 3;
    const btn = (await loader.getAllHarnesses(MatButtonHarness))[2];
    await btn.click();
    expect(component.rate).toBe(expectedRate);
    expect(changedSpy).toHaveBeenCalledOnceWith(expectedRate)
  });
});
