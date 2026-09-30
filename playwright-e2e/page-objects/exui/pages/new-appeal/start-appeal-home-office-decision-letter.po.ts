import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';

export class StartAppealHomeOfficeDecisionLetterPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    homeOfficeDecisionDateDayInput: this.page.locator('input[id="homeOfficeDecisionDate-day"]'),
    homeOfficeDecisionDateMonthInput: this.page.locator('input[id="homeOfficeDecisionDate-month"]'),
    homeOfficeDecisionDateYearInput: this.page.locator('input[id="homeOfficeDecisionDate-year"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Home Office decision date', exact: true }),
    homeOfficeDecisionDateLabel: this.page.locator('[id="homeOfficeDecisionDate"] legend span'),
    homeOfficeDecisionDateHint: this.page.locator('[id="homeOfficeDecisionDate"] span[class="form-hint"]'),
    homeOfficeDecisionDateDayLabel: this.page.locator('[id="day-label-homeOfficeDecisionDate-day"]'),
    homeOfficeDecisionDateMonthLabel: this.page.locator('[id="month-label-homeOfficeDecisionDate-month"]'),
    homeOfficeDecisionDateYearLabel: this.page.locator('[id="year-label-homeOfficeDecisionDate-year"]'),
    decisionDateAdviceParagraph: this.page.locator('[id="homeOfficeDecisionDateTips"] p'),
    decisionDateAdviceBulletPoints: this.page.locator('[id="homeOfficeDecisionDateTips"] li'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealhomeOfficeDecisionLetter',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.homeOfficeDecisionDateLabel).toBeVisible(),
      expect(this.$static.homeOfficeDecisionDateLabel).toHaveText('Home Office decision date'),
      expect(this.$static.homeOfficeDecisionDateHint).toBeVisible(),
      expect(this.$static.homeOfficeDecisionDateHint).toHaveText('Format DD MM YYYY (for example, 01 12 2024 for 1st December 2024).'),
      expect(this.$static.homeOfficeDecisionDateDayLabel).toBeVisible(),
      expect(this.$static.homeOfficeDecisionDateDayLabel).toHaveText('Day'),
      expect(this.$static.homeOfficeDecisionDateMonthLabel).toBeVisible(),
      expect(this.$static.homeOfficeDecisionDateMonthLabel).toHaveText('Month'),
      expect(this.$static.homeOfficeDecisionDateYearLabel).toBeVisible(),
      expect(this.$static.homeOfficeDecisionDateYearLabel).toHaveText('Year'),
      expect(this.$static.decisionDateAdviceParagraph).toBeVisible(),
      expect(this.$static.decisionDateAdviceParagraph).toHaveText('Advice for entering the decision date:'),
      expect(this.$static.decisionDateAdviceBulletPoints.nth(0)).toBeVisible(),
      expect(this.$static.decisionDateAdviceBulletPoints.nth(0)).toHaveText(
        'You should enter the date the decision letter was sent, which you can usually find stamped on the envelope (see picture below).',
      ),
      expect(this.$static.decisionDateAdviceBulletPoints.nth(1)).toBeVisible(),
      expect(this.$static.decisionDateAdviceBulletPoints.nth(1)).toHaveText('Alternatively, enter the date given in the decision letter itself.'),
      expect(this.$static.decisionDateAdviceBulletPoints.nth(2)).toBeVisible(),
      expect(this.$static.decisionDateAdviceBulletPoints.nth(2)).toHaveText(
        'If there has been an administrative review, you should insert the date of the administrative review decision or the date you withdrew the administrative review proceedings, whichever is later.',
      ),
    ]);
  }

  public async completePageAndContinue(options: { homeOfficeDecisionDate: { day: number; month: number; year: number } }): Promise<void> {
    const day = options.homeOfficeDecisionDate.day.toString();
    const month = options.homeOfficeDecisionDate.month.toString();
    const year = options.homeOfficeDecisionDate.year.toString();

    await this.$inputs.homeOfficeDecisionDateDayInput.fill(day);
    await expect(this.$inputs.homeOfficeDecisionDateDayInput).toHaveValue(day);

    await this.$inputs.homeOfficeDecisionDateMonthInput.fill(month);
    await expect(this.$inputs.homeOfficeDecisionDateMonthInput).toHaveValue(month);

    await this.$inputs.homeOfficeDecisionDateYearInput.fill(year);
    await expect(this.$inputs.homeOfficeDecisionDateYearInput).toHaveValue(year);

    await this.navigationClick(this.$interactive.continueButton);
  }
}
