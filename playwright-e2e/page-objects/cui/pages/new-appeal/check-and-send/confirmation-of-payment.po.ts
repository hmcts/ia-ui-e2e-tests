import { Page } from '@playwright/test';
import { AppealDetailsSentPage } from './appeal-details-sent.po';
import { CuiBase } from '../../../cui-base';

export class ConfirmationOfPaymentPage extends CuiBase {
  private appealDetailsSent: AppealDetailsSentPage;
  public readonly $interactive: typeof this.appealDetailsSent.$interactive;
  public readonly $static: typeof this.appealDetailsSent.$static;

  constructor(page: Page) {
    super(page);
    this.appealDetailsSent = new AppealDetailsSentPage(page);
    this.$interactive = this.appealDetailsSent.$interactive;
    this.$static = this.appealDetailsSent.$static;
  }

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'confirmation-payment', pageHeading: this.$static.pageHeading });
  }
}
