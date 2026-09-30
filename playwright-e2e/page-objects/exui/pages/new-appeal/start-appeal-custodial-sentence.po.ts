import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { YesOrNoType } from '../../../../citizen-types';

export class StartAppealCustodialSentencePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    releaseDateDayInput: this.page.locator('input[id="releaseDate-day"]'),
    releaseDateMonthInput: this.page.locator('input[id="releaseDate-month"]'),
    releaseDateYearInput: this.page.locator('input[id="releaseDate-year"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Custodial Sentence', exact: true }),
    releaseDateProvidedLabel: this.page.locator('div[id="releaseDateProvided"] span'),
    releaseDateProvidedYesLabel: this.page.locator('label[for="releaseDateProvided_Yes"]'),
    releaseDateProvidedNoLabel: this.page.locator('label[for="releaseDateProvided_No"]'),
    releaseDateLabel: this.page.locator('[id="releaseDate"] legend span'),
    releaseDateDayLabel: this.page.locator('[id="day-label-releaseDate-day"]'),
    releaseDateMonthLabel: this.page.locator('[id="month-label-releaseDate-month"]'),
    releaseDateYearLabel: this.page.locator('[id="year-label-releaseDate-year"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealcustodialSentence',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.releaseDateProvidedLabel).toBeVisible(),
      expect(this.$static.releaseDateProvidedLabel).toHaveText('Is the appellant still serving their custodial sentence?'),
      expect(this.$static.releaseDateProvidedYesLabel).toBeVisible(),
      expect(this.$static.releaseDateProvidedYesLabel).toHaveText('Yes'),
      expect(this.$static.releaseDateProvidedNoLabel).toBeVisible(),
      expect(this.$static.releaseDateProvidedNoLabel).toHaveText('No'),
    ]);
  }

  public async completePageAndContinue(options: {
    isAppellantStillServingCustodialSentence: YesOrNoType;
    releaseDate?: { day: number; month: number; year: number };
  }): Promise<void> {
    await this.page.getByRole('radio', { name: options.isAppellantStillServingCustodialSentence, exact: true }).check();
    await expect(this.page.getByRole('radio', { name: options.isAppellantStillServingCustodialSentence, exact: true })).toBeChecked();

    if (options.isAppellantStillServingCustodialSentence === 'Yes') {
      await Promise.all([
        expect(this.$static.releaseDateLabel).toBeVisible(),
        expect(this.$static.releaseDateLabel).toHaveText("What is the appellant's release date? (Optional)"),
        expect(this.$static.releaseDateDayLabel).toBeVisible(),
        expect(this.$static.releaseDateDayLabel).toHaveText('Day'),
        expect(this.$static.releaseDateMonthLabel).toBeVisible(),
        expect(this.$static.releaseDateMonthLabel).toHaveText('Month'),
        expect(this.$static.releaseDateYearLabel).toBeVisible(),
        expect(this.$static.releaseDateYearLabel).toHaveText('Year'),
      ]);

      if (options.releaseDate) {
        const day = options.releaseDate.day.toString();
        const month = options.releaseDate.month.toString();
        const year = options.releaseDate.year.toString();

        await this.$inputs.releaseDateDayInput.fill(day);
        await expect(this.$inputs.releaseDateDayInput).toHaveValue(day);

        await this.$inputs.releaseDateMonthInput.fill(month);
        await expect(this.$inputs.releaseDateMonthInput).toHaveValue(month);

        await this.$inputs.releaseDateYearInput.fill(year);
        await expect(this.$inputs.releaseDateYearInput).toHaveValue(year);
      }
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
