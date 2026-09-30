import { Locator, Page } from '@playwright/test';
import { ExuiBase } from '../../exui-base';

export class CardPaymentConfirmationPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    returnToServiceRequestLink: this.page.getByRole('link', { name: 'Return to service request', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Payment successful', exact: true }),
    paymentReferenceLabel: this.page.locator('.govuk-panel__body').getByText('Your payment reference is', { exact: false }),
    paymentReferenceValue: this.page.locator('.govuk-panel__body strong'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: '/confirmation/',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async returnToServiceRequest(): Promise<void> {
    await this.navigationClick(this.$interactive.returnToServiceRequestLink);
  }
}
