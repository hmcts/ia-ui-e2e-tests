import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';

export class StartAppealEntryClearanceDecisionLetterPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    entryClearanceDecisionDateDayInput: this.page.locator('input[id="dateEntryClearanceDecision-day"]'),
    entryClearanceDecisionDateMonthInput: this.page.locator('input[id="dateEntryClearanceDecision-month"]'),
    entryClearanceDecisionDateYearInput: this.page.locator('input[id="dateEntryClearanceDecision-year"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Entry clearance decision date', exact: true }),
    entryClearanceDecisionDateLabel: this.page.locator('[id="dateEntryClearanceDecision"] legend span'),
    entryClearanceDecisionDateHint: this.page.locator('[id="dateEntryClearanceDecision"] span[class="form-hint"]'),
    entryClearanceDecisionDateDayLabel: this.page.locator('[id="day-label-dateEntryClearanceDecision-day"]'),
    entryClearanceDecisionDateMonthLabel: this.page.locator('[id="month-label-dateEntryClearanceDecision-month"]'),
    entryClearanceDecisionDateYearLabel: this.page.locator('[id="year-label-dateEntryClearanceDecision-year"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealentryClearanceDecisionLetter',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.entryClearanceDecisionDateLabel).toBeVisible(),
      expect(this.$static.entryClearanceDecisionDateLabel).toHaveText('Date of entry clearance decision'),
      expect(this.$static.entryClearanceDecisionDateHint).toBeVisible(),
      expect(this.$static.entryClearanceDecisionDateHint).toHaveText('Format DD MM YYYY (for example, 01 12 2024 for 1st December 2024).'),
      expect(this.$static.entryClearanceDecisionDateDayLabel).toBeVisible(),
      expect(this.$static.entryClearanceDecisionDateDayLabel).toHaveText('Day'),
      expect(this.$static.entryClearanceDecisionDateMonthLabel).toBeVisible(),
      expect(this.$static.entryClearanceDecisionDateMonthLabel).toHaveText('Month'),
      expect(this.$static.entryClearanceDecisionDateYearLabel).toBeVisible(),
      expect(this.$static.entryClearanceDecisionDateYearLabel).toHaveText('Year'),
    ]);
  }

  public async completePageAndContinue(options: { entryClearanceDecisionDate: { day: number; month: number; year: number } }): Promise<void> {
    const day = options.entryClearanceDecisionDate.day.toString();
    const month = options.entryClearanceDecisionDate.month.toString();
    const year = options.entryClearanceDecisionDate.year.toString();

    await this.$inputs.entryClearanceDecisionDateDayInput.fill(day);
    await expect(this.$inputs.entryClearanceDecisionDateDayInput).toHaveValue(day);

    await this.$inputs.entryClearanceDecisionDateMonthInput.fill(month);
    await expect(this.$inputs.entryClearanceDecisionDateMonthInput).toHaveValue(month);

    await this.$inputs.entryClearanceDecisionDateYearInput.fill(year);
    await expect(this.$inputs.entryClearanceDecisionDateYearInput).toHaveValue(year);

    await this.navigationClick(this.$interactive.continueButton);
  }
}
