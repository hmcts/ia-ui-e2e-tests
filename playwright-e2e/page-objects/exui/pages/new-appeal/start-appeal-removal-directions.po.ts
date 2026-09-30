import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { YesOrNoType } from '../../../../citizen-types';

export class StartAppealRemovalDirectionsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    removalOrderDateDayInput: this.page.locator('input[id="removalOrderDate-day"]'),
    removalOrderDateMonthInput: this.page.locator('input[id="removalOrderDate-month"]'),
    removalOrderDateYearInput: this.page.locator('input[id="removalOrderDate-year"]'),
    removalOrderDateHourInput: this.page.locator('input[id="removalOrderDate-hour"]'),
    removalOrderDateMinuteInput: this.page.locator('input[id="removalOrderDate-minute"]'),
    removalOrderDateSecondInput: this.page.locator('input[id="removalOrderDate-second"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Removal directions', exact: true }),
    removalDirectionsQuestionLabel: this.page.locator('div[id="removalOrderOptions"] legend span'),
    removalDirectionsYesLabel: this.page.locator('label[for="removalOrderOptions_Yes"]'),
    removalDirectionsNoLabel: this.page.locator('label[for="removalOrderOptions_No"]'),
    removalDateTimeLabel: this.page.locator('div[id="removalOrderDate"] legend span'),
    removalDateTimeHint: this.page.locator('div[id="removalOrderDate"] span[class="form-hint"]'),
    removalDateTimeDayLabel: this.page.locator('span[id="day-label-removalOrderDate-day"]'),
    removalDateTimeMonthLabel: this.page.locator('span[id="month-label-removalOrderDate-month"]'),
    removalDateTimeYearLabel: this.page.locator('span[id="year-label-removalOrderDate-year"]'),
    removalDateTimeHourLabel: this.page.locator('span[id="hour-label-removalOrderDate-hour"]'),
    removalDateTimeMinuteLabel: this.page.locator('span[id="minute-label-removalOrderDate-minute"]'),
    removalDateTimeSecondLabel: this.page.locator('span[id="second-label-removalOrderDate-second"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealremovalDirectionsPage',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.removalDirectionsQuestionLabel).toBeVisible(),
      expect(this.$static.removalDirectionsQuestionLabel).toHaveText('Are removal directions currently set for the appellant?'),
      expect(this.$static.removalDirectionsYesLabel).toBeVisible(),
      expect(this.$static.removalDirectionsYesLabel).toHaveText('Yes'),
      expect(this.$static.removalDirectionsNoLabel).toBeVisible(),
      expect(this.$static.removalDirectionsNoLabel).toHaveText('No'),
    ]);
  }

  public async completePageAndContinue(options: {
    removalDirections: YesOrNoType;
    removalDirectionsDateTime?: {
      day: number;
      month: number;
      year: number;
      hour: number;
      minute: number;
      second: number;
    };
  }): Promise<void> {
    const removalDirectionsOption = this.page.getByRole('radio', { name: options.removalDirections, exact: true });
    await removalDirectionsOption.check();
    await expect(removalDirectionsOption).toBeChecked();

    if (options.removalDirections === 'Yes') {
      await expect(this.$static.removalDateTimeLabel).toBeVisible();
      await expect(this.$static.removalDateTimeLabel).toHaveText('What date and time is set for the removal? (Optional)');
      await expect(this.$static.removalDateTimeHint).toBeVisible();
      await expect(this.$static.removalDateTimeHint).toHaveText('For example 16 4 2021, 14 30 00');
      await expect(this.$static.removalDateTimeDayLabel).toBeVisible();
      await expect(this.$static.removalDateTimeDayLabel).toHaveText('Day');
      await expect(this.$static.removalDateTimeMonthLabel).toBeVisible();
      await expect(this.$static.removalDateTimeMonthLabel).toHaveText('Month');
      await expect(this.$static.removalDateTimeYearLabel).toBeVisible();
      await expect(this.$static.removalDateTimeYearLabel).toHaveText('Year');
      await expect(this.$static.removalDateTimeHourLabel).toBeVisible();
      await expect(this.$static.removalDateTimeHourLabel).toHaveText('Hour');
      await expect(this.$static.removalDateTimeMinuteLabel).toBeVisible();
      await expect(this.$static.removalDateTimeMinuteLabel).toHaveText('Minute');
      await expect(this.$static.removalDateTimeSecondLabel).toBeVisible();
      await expect(this.$static.removalDateTimeSecondLabel).toHaveText('Second');

      if (options.removalDirectionsDateTime) {
        const day = options.removalDirectionsDateTime.day.toString();
        const month = options.removalDirectionsDateTime.month.toString();
        const year = options.removalDirectionsDateTime.year.toString();
        const hour = options.removalDirectionsDateTime.hour.toString();
        const minute = options.removalDirectionsDateTime.minute.toString();
        const second = options.removalDirectionsDateTime.second.toString();

        await this.$inputs.removalOrderDateDayInput.fill(day);
        await expect(this.$inputs.removalOrderDateDayInput).toHaveValue(day);

        await this.$inputs.removalOrderDateMonthInput.fill(month);
        await expect(this.$inputs.removalOrderDateMonthInput).toHaveValue(month);

        await this.$inputs.removalOrderDateYearInput.fill(year);
        await expect(this.$inputs.removalOrderDateYearInput).toHaveValue(year);

        await this.$inputs.removalOrderDateHourInput.fill(hour);
        await expect(this.$inputs.removalOrderDateHourInput).toHaveValue(hour);

        await this.$inputs.removalOrderDateMinuteInput.fill(minute);
        await expect(this.$inputs.removalOrderDateMinuteInput).toHaveValue(minute);

        await this.$inputs.removalOrderDateSecondInput.fill(second);
        await expect(this.$inputs.removalOrderDateSecondInput).toHaveValue(second);
      }
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
