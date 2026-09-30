import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';

export class StartAppealHomeOfficeReferenceNumberPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    homeOfficeReferenceNumberInput: this.page.locator('input[id="homeOfficeReferenceNumber"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Home Office reference number', exact: true }),
    homeOfficeReferenceNumberLabel: this.page.locator('label[for="homeOfficeReferenceNumber"] span'),
    homeOfficeReferenceNumberHint: this.page.locator('label[for="homeOfficeReferenceNumber"] ~ span[class="form-hint"]'),
    adViceForEnteringCorrectNumberLabel: this.page.locator('[id="homeOfficeReferenceNumberTips"] p'),
    adviceForEnteringCorrectNumberBulletPoint: this.page.locator('[id="homeOfficeReferenceNumberTips"] ul li'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealhomeOfficeReferenceNumber',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.homeOfficeReferenceNumberLabel).toBeVisible(),
      expect(this.$static.homeOfficeReferenceNumberLabel).toHaveText('Home Office UAN or GWF reference'),
      expect(this.$static.homeOfficeReferenceNumberHint).toBeVisible(),
      expect(this.$static.homeOfficeReferenceNumberHint).toHaveText(
        "Enter the 16-digit UAN reference (four groups of four digits) or the 9-digit GWF reference (including the GWF prefix) exactly as it appears in the decision letter. This can often be found in the 'How to appeal' section.",
      ),
      expect(this.$static.adViceForEnteringCorrectNumberLabel).toBeVisible(),
      expect(this.$static.adViceForEnteringCorrectNumberLabel).toHaveText('Advice for entering the correct number:'),
      expect(this.$static.adviceForEnteringCorrectNumberBulletPoint.nth(0)).toBeVisible(),
      expect(this.$static.adviceForEnteringCorrectNumberBulletPoint.nth(0)).toHaveText(
        "You should enter the reference number exactly as it appears on the decision letter. This can often be found in the 'How to appeal' section.",
      ),
      expect(this.$static.adviceForEnteringCorrectNumberBulletPoint.nth(1)).toBeVisible(),
      expect(this.$static.adviceForEnteringCorrectNumberBulletPoint.nth(1)).toHaveText(
        'Your UAN reference will be a 16-digit number, for example 1234-1234-1234-1234; you should include all the numbers with the dashes as they appear',
      ),
      expect(this.$static.adviceForEnteringCorrectNumberBulletPoint.nth(2)).toBeVisible(),
      expect(this.$static.adviceForEnteringCorrectNumberBulletPoint.nth(2)).toHaveText(
        'Your GWF reference will be a 9-digit number starting with GWF, for example GWF123456789',
      ),
    ]);
  }

  public async completePageAndContinue(options: { homeOfficeReferenceNumber: string }): Promise<void> {
    await this.$inputs.homeOfficeReferenceNumberInput.fill(options.homeOfficeReferenceNumber);
    await expect(this.$inputs.homeOfficeReferenceNumberInput).toHaveValue(options.homeOfficeReferenceNumber);

    await this.navigationClick(this.$interactive.continueButton);
  }
}
