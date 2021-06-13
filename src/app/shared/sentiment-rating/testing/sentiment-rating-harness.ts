import { AsyncFactoryFn, ComponentHarness, HarnessPredicate, parallel, TestElement } from '@angular/cdk/testing';
import { SentimentRatingHarnessFilters } from './sentiment-rating-harness-filters';

export class SentimentRatingHarness extends ComponentHarness {
  static hostSelector = 'app-sentiment-rating';

  static with(options: SentimentRatingHarnessFilters): HarnessPredicate<SentimentRatingHarness> {
    return new HarnessPredicate(SentimentRatingHarness, options)
      .addOption('rate', options.rate,
        async (harness, rate) => await harness.getRate() === rate
      );
  }

  private _rateButtons: AsyncFactoryFn<TestElement[]> = this.locatorForAll('button');

  public async getRate(): Promise<number> {
    const btns = await this._rateButtons();
    return (await parallel(() => btns.map(b => b.text()))).reduce((acc, curr) => curr === 'favorite' ? ++acc: acc, 0);
  }

  public async setRate(rate: number): Promise<void> {
    if (rate <= 0) throw Error('Rate is invalid');

    const btns = await this._rateButtons();
    if (btns.length < rate) throw Error('Rate exceeds supported rate options');
    return (await btns[rate - 1]).click();
  }
}
