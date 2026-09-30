import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';

export class StartAppealLegalAidPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    legalAidAccountNumberInput: this.page.locator('input[id="legalAidAccountNumber"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Legal Aid', exact: true }),
    legalAidAdviceParagraph: this.page.locator('[id="legalAidAdvice"] p'),
    legalAidAccountNumberLabel: this.page.locator('label[for="legalAidAccountNumber"] span.form-label'),
    legalAidAccountNumberHint: this.page.locator('label[for="legalAidAccountNumber"] ~ span.form-hint'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppeallegalAid',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.legalAidAdviceParagraph).toBeVisible(),
      expect(this.$static.legalAidAdviceParagraph).toHaveText("You need to provide your firm's Legal Aid account number"),
      expect(this.$static.legalAidAccountNumberLabel).toBeVisible(),
      expect(this.$static.legalAidAccountNumberLabel).toHaveText('Legal Aid account number'),
      expect(this.$static.legalAidAccountNumberHint).toBeVisible(),
      expect(this.$static.legalAidAccountNumberHint).toHaveText('For example, 6-20 characters without spaces'),
    ]);
  }

  public async completePageAndContinue(options: { legalAidAccountNumber: string }): Promise<void> {
    await this.$inputs.legalAidAccountNumberInput.fill(options.legalAidAccountNumber);
    await expect(this.$inputs.legalAidAccountNumberInput).toHaveValue(options.legalAidAccountNumber);

    await this.navigationClick(this.$interactive.continueButton);
  }
}
