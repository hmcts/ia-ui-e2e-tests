import { Page, Locator } from '@playwright/test';
import { Base } from './base';

export class CardPaymentConfirmDetailsPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    confirmPaymentButton: this.page.locator('button[type="submit"]', { hasText: 'Confirm payment' }),
    cancelPaymentButton: this.page.locator('button[type="submit"]', { hasText: 'Cancel payment' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', { hasText: 'Confirm your payment' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'confirm', pageHeading: this.$static.pageHeading });
  }

  public async confirmPayment(): Promise<void> {
    await this.navigationClick(this.$interactive.confirmPaymentButton);
  }
}
