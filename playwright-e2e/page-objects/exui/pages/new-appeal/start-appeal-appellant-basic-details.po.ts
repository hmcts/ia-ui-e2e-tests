import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';

export class StartAppealAppellantBasicDetailsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    appellantTitleInput: this.page.locator('input[id="appellantTitle"]'),
    appellantGivenNamesInput: this.page.locator('input[id="appellantGivenNames"]'),
    appellantFamilyNameInput: this.page.locator('input[id="appellantFamilyName"]'),
    appellantDateOfBirthDayInput: this.page.locator('input[id="appellantDateOfBirth-day"]'),
    appellantDateOfBirthMonthInput: this.page.locator('input[id="appellantDateOfBirth-month"]'),
    appellantDateOfBirthYearInput: this.page.locator('input[id="appellantDateOfBirth-year"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Basic details', exact: true }),
    appellantBasicDetailsAdviceText: this.page.locator('[id="appellantBasicDetailsTitle"] p'),
    appellantTitleLabel: this.page.locator('label[for="appellantTitle"] span'),
    appellantGivenNamesLabel: this.page.locator('label[for="appellantGivenNames"] span'),
    appellantFamilyNameLabel: this.page.locator('label[for="appellantFamilyName"] span'),
    appellantDateOfBirthLabel: this.page.locator('[id="appellantDateOfBirth"] legend span'),
    appellantDateOfBirthHint: this.page.locator('[id="appellantDateOfBirth"] span[class="form-hint"]'),
    appellantDateOfBirthDayLabel: this.page.locator('[id="day-label-appellantDateOfBirth-day"]'),
    appellantDateOfBirthMonthLabel: this.page.locator('[id="month-label-appellantDateOfBirth-month"]'),
    appellantDateOfBirthYearLabel: this.page.locator('[id="year-label-appellantDateOfBirth-year"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealappellantBasicDetails',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.appellantBasicDetailsAdviceText).toBeVisible(),
      expect(this.$static.appellantBasicDetailsAdviceText).toHaveText(
        "You should enter the details exactly as they appear on the decision letter. This can often be found in the 'How to appeal' section.",
      ),
      expect(this.$static.appellantTitleLabel).toBeVisible(),
      expect(this.$static.appellantTitleLabel).toHaveText('Title'),
      expect(this.$static.appellantGivenNamesLabel).toBeVisible(),
      expect(this.$static.appellantGivenNamesLabel).toHaveText('Given names'),
      expect(this.$static.appellantFamilyNameLabel).toBeVisible(),
      expect(this.$static.appellantFamilyNameLabel).toHaveText('Family name'),
      expect(this.$static.appellantDateOfBirthLabel).toBeVisible(),
      expect(this.$static.appellantDateOfBirthLabel).toHaveText('Date of birth'),
      expect(this.$static.appellantDateOfBirthHint).toBeVisible(),
      expect(this.$static.appellantDateOfBirthHint).toHaveText('Format DD MM YYYY (for example, 01 12 2024 for 1st December 2024)'),
      expect(this.$static.appellantDateOfBirthDayLabel).toBeVisible(),
      expect(this.$static.appellantDateOfBirthDayLabel).toHaveText('Day'),
      expect(this.$static.appellantDateOfBirthMonthLabel).toBeVisible(),
      expect(this.$static.appellantDateOfBirthMonthLabel).toHaveText('Month'),
      expect(this.$static.appellantDateOfBirthYearLabel).toBeVisible(),
      expect(this.$static.appellantDateOfBirthYearLabel).toHaveText('Year'),
    ]);
  }

  public async completePageAndContinue(options: {
    appellantTitle: string;
    appellantGivenNames: string;
    appellantFamilyName: string;
    appellantDateOfBirth: { day: number; month: number; year: number };
  }): Promise<void> {
    const day = options.appellantDateOfBirth.day.toString();
    const month = options.appellantDateOfBirth.month.toString();
    const year = options.appellantDateOfBirth.year.toString();

    await this.$inputs.appellantTitleInput.fill(options.appellantTitle);
    await expect(this.$inputs.appellantTitleInput).toHaveValue(options.appellantTitle);

    await this.$inputs.appellantGivenNamesInput.fill(options.appellantGivenNames);
    await expect(this.$inputs.appellantGivenNamesInput).toHaveValue(options.appellantGivenNames);

    await this.$inputs.appellantFamilyNameInput.fill(options.appellantFamilyName);
    await expect(this.$inputs.appellantFamilyNameInput).toHaveValue(options.appellantFamilyName);

    await this.$inputs.appellantDateOfBirthDayInput.fill(day);
    await expect(this.$inputs.appellantDateOfBirthDayInput).toHaveValue(day);

    await this.$inputs.appellantDateOfBirthMonthInput.fill(month);
    await expect(this.$inputs.appellantDateOfBirthMonthInput).toHaveValue(month);

    await this.$inputs.appellantDateOfBirthYearInput.fill(year);
    await expect(this.$inputs.appellantDateOfBirthYearInput).toHaveValue(year);

    await this.navigationClick(this.$interactive.continueButton);
  }
}
