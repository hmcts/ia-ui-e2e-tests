import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';

export class StartAppealHelpWithFeesPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    helpWithFeesReferenceNumberInput: this.page.locator('input[id="helpWithFeesReferenceNumber"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Help with Fees', exact: true }),
    helpWithFeesReferenceNumberLabel: this.page.locator('label[for="helpWithFeesReferenceNumber"] span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealhelpWithFees',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.helpWithFeesReferenceNumberLabel).toBeVisible(),
      expect(this.$static.helpWithFeesReferenceNumberLabel).toHaveText('Help with Fees reference number'),
    ]);
  }

  public async completePageAndContinue(options: { helpWithFeesReferenceNumber: string }): Promise<void> {
    await this.$inputs.helpWithFeesReferenceNumberInput.fill(options.helpWithFeesReferenceNumber);
    await expect(this.$inputs.helpWithFeesReferenceNumberInput).toHaveValue(options.helpWithFeesReferenceNumber);

    await this.navigationClick(this.$interactive.continueButton);
  }
}
