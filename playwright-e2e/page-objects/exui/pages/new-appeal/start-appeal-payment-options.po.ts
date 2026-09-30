import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { StartAppealPaymentOptionType } from '../../../../exui-event-types';

export class StartAppealPaymentOptionsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'How to pay', exact: true }),
    paymentMethodQuestionLabel: this.page.locator('div[id="paAppealTypePaymentOption"] label[for="paAppealTypePaymentOption"] span'),
    payNowLabel: this.page.locator('label[for="paAppealTypePaymentOption-payNow"]'),
    payLaterLabel: this.page.locator('label[for="paAppealTypePaymentOption-payLater"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealpaymentOptions',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.paymentMethodQuestionLabel).toBeVisible(),
      expect(this.$static.paymentMethodQuestionLabel).toHaveText('Select a payment method'),
      expect(this.$static.payNowLabel).toBeVisible(),
      expect(this.$static.payNowLabel).toHaveText('Pay Now'),
      expect(this.$static.payLaterLabel).toBeVisible(),
      expect(this.$static.payLaterLabel).toHaveText('Pay Later'),
    ]);
  }

  public async completePageAndContinue(options: { paymentOption: StartAppealPaymentOptionType }): Promise<void> {
    const paymentOption = this.page.getByRole('radio', { name: options.paymentOption, exact: true });
    await paymentOption.check();
    await expect(paymentOption).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
