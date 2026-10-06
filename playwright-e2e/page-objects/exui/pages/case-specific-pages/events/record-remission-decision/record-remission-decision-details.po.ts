import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class RecordRemissionDecisionDetailsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    amountRemittedInput: this.page.locator('input[name="amountRemitted"]'),
    amountLeftToPayInput: this.page.locator('input[name="amountLeftToPay"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Record remission decision', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    feeParagraph: this.page
      .locator('p', {
        hasText: /^The full fee of £.* will be remitted\. Click Continue to confirm the amount remitted and the amount left to pay are correct\.$/,
      })
      .filter({ visible: true }),
    amountRemittedLabel: this.page.locator('label[for="amountRemitted"]'),
    amountRemittedCurrency: this.page.locator('label[for="amountRemitted"] + div span[class="form-currency"]'),
    amountLeftToPayLabel: this.page.locator('label[for="amountLeftToPay"]'),
    amountLeftToPayCurrency: this.page.locator('label[for="amountLeftToPay"] + div span[class="form-currency"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/recordRemissionDecision/recordRemissionDecisionremissionDecisionDetails',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.feeParagraph).toBeVisible(),

      expect(this.$static.amountRemittedLabel).toHaveText('Amount remitted'),
      expect(this.$static.amountRemittedLabel).toBeVisible(),

      expect(this.$static.amountRemittedCurrency).toHaveText('£'),
      expect(this.$static.amountRemittedCurrency).toBeVisible(),

      expect(this.$static.amountLeftToPayLabel).toHaveText('Amount left to pay'),
      expect(this.$static.amountLeftToPayLabel).toBeVisible(),

      expect(this.$static.amountLeftToPayCurrency).toHaveText('£'),
      expect(this.$static.amountLeftToPayCurrency).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { amountRemitted: number; amountLeftToPay: number }): Promise<void> {
    const amountRemitted = options.amountRemitted.toString();
    const amountLeftToPay = options.amountLeftToPay.toString();

    await this.$inputs.amountRemittedInput.fill(amountRemitted);
    await expect(this.$inputs.amountRemittedInput).toHaveValue(amountRemitted);

    await this.$inputs.amountLeftToPayInput.fill(amountLeftToPay);
    await expect(this.$inputs.amountLeftToPayInput).toHaveValue(amountLeftToPay);

    await this.navigationClick(this.$interactive.continueButton);
  }
}
