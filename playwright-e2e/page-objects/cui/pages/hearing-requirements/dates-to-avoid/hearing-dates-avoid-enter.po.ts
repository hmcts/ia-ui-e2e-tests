import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { DataUtils } from '../../../../../utils/data.utils';

export class HearingDatesAvoidEnterPage extends CuiBase {
  private dataUtils: DataUtils = new DataUtils();
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    day: this.page.locator('input[name="day"]'),
    month: this.page.locator('input[name="month"]'),
    year: this.page.locator('input[name="year"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', {
      name: 'Enter the date you or any witnesses cannot go to the hearing',
      level: 1,
      exact: true,
    }),
    onlyIncludeDatesWithinRangeText: this.page.getByText('Only include dates from'),
    exampleDateHintText: this.page.locator('div[id="date-hint"]'),
    dayLabel: this.page.locator('label[for="day"]'),
    monthLabel: this.page.locator('label[for="month"]'),
    yearLabel: this.page.locator('label[for="year"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-dates-avoid-enter', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    const startOfDateRange = (
      await this.dataUtils.getDateFromToday({ dayOffset: 5, formattingOptions: { day: '2-digit', month: 'long', year: 'numeric' } })
    ).formattedDate;

    const endOfDateRange = (
      await this.dataUtils.getDateFromToday({ dayOffset: 47, formattingOptions: { day: '2-digit', month: 'long', year: 'numeric' } })
    ).formattedDate;

    await Promise.all([
      expect(this.$static.onlyIncludeDatesWithinRangeText).toHaveText(`Only include dates from ${startOfDateRange} to ${endOfDateRange}.`),
      expect(this.$static.onlyIncludeDatesWithinRangeText).toBeVisible(),

      expect(this.$static.exampleDateHintText).toHaveText('For example, 12 11 2020'),
      expect(this.$static.exampleDateHintText).toBeVisible(),

      expect(this.$static.dayLabel).toHaveText('Day'),
      expect(this.$static.dayLabel).toBeVisible(),

      expect(this.$static.monthLabel).toHaveText('Month'),
      expect(this.$static.monthLabel).toBeVisible(),

      expect(this.$static.yearLabel).toHaveText('Year'),
      expect(this.$static.yearLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(dateToAvoid: { day: number; month: number; year: number }): Promise<void> {
    const day = dateToAvoid.day.toString();
    const month = dateToAvoid.month.toString();
    const year = dateToAvoid.year.toString();

    await this.$inputs.day.fill(day);
    await expect(this.$inputs.day).toHaveValue(day);

    await this.$inputs.month.fill(month);
    await expect(this.$inputs.month).toHaveValue(month);

    await this.$inputs.year.fill(year);
    await expect(this.$inputs.year).toHaveValue(year);
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
