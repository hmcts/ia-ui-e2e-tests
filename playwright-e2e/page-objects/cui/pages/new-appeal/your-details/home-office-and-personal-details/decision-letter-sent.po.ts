import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';

export class DecisionLetterSentPage extends CuiBase {
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
    pageHeading: this.page.locator('h1', {
      hasText: 'What date was your decision letter sent?',
    }),
    decisionByEmailHeading: this.page.locator('p', { hasText: 'decision by email' }),
    decisionByEmailText: this.page.locator('p', { hasText: 'email was sent' }),
    decisionByPostHeading: this.page.locator('p', { hasText: 'decision by post' }),
    decisionByPostText: this.page.locator('p', { hasText: 'Enter the date stamped on the front' }),
    enterDateText: this.page.getByText('letter was sent'),
    dateHintText: this.page.locator('div[id="date-hint"]'),
    dayLabel: this.page.locator('label[for="day"]'),
    monthLabel: this.page.locator('label[for="month"]'),
    yearLabel: this.page.locator('label[for="year"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'date-letter-sent', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.decisionByEmailHeading).toHaveText('If you got your decision by email'),
      expect(this.$static.decisionByEmailHeading).toBeVisible(),

      expect(this.$static.decisionByEmailText).toHaveText('Enter the date the email was sent by the Home Office.'),
      expect(this.$static.decisionByEmailText).toBeVisible(),

      expect(this.$static.decisionByPostHeading).toHaveText('If you got your decision by post'),
      expect(this.$static.decisionByPostHeading).toBeVisible(),

      expect(this.$static.decisionByPostText).toHaveText(
        "Enter the date stamped on the front of the envelope. If you don't have the envelope, enter the date on the first page of the decision letter.",
      ),
      expect(this.$static.decisionByPostText).toBeVisible(),

      expect(this.$static.enterDateText).toHaveText('Enter the date the letter was sent'),
      expect(this.$static.enterDateText).toBeVisible(),

      expect(this.$static.dateHintText).toHaveText('For example, 31 3 2019'),
      expect(this.$static.dateHintText).toBeVisible(),

      expect(this.$static.dayLabel).toHaveText('Day'),
      expect(this.$static.dayLabel).toBeVisible(),

      expect(this.$static.monthLabel).toHaveText('Month'),
      expect(this.$static.monthLabel).toBeVisible(),

      expect(this.$static.yearLabel).toHaveText('Year'),
      expect(this.$static.yearLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(dateDecisionLetterSent: { day: number; month: number; year: number }): Promise<void> {
    const day = dateDecisionLetterSent.day.toString();
    const month = dateDecisionLetterSent.month.toString();
    const year = dateDecisionLetterSent.year.toString();

    await this.$inputs.day.fill(day);
    await expect(this.$inputs.day).toHaveValue(day);

    await this.$inputs.month.fill(month);
    await expect(this.$inputs.month).toHaveValue(month);

    await this.$inputs.year.fill(year);
    await expect(this.$inputs.year).toHaveValue(year);
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
