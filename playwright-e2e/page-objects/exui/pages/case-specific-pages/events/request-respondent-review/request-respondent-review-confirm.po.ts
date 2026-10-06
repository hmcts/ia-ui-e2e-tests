import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class RequestRespondentReviewConfirmPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    closeAndReturnToCaseDetailsButton: this.$commonElements.closeAndReturnToCaseDetailsButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Request respondent review', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    youHaveSentDrirectionHeading: this.page.getByRole('heading', { level: 1, name: 'You have sent a direction', exact: true }),
    whatHappensNextHeading: this.page.getByRole('heading', { level: 4, name: 'What happens next', exact: true }),
    whatHappensNextParagraph1: this.page.locator('markdown', { hasText: 'What happens next' }).locator('p').nth(0),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/requestRespondentReview/confirm',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.youHaveSentDrirectionHeading).toBeVisible(),
      expect(this.$static.whatHappensNextHeading).toBeVisible(),
      expect(this.$static.whatHappensNextParagraph1).toBeVisible(),
      expect(this.$static.whatHappensNextParagraph1).toHaveText(
        'Wait for the respondent to complete the direction. You must upload the response as soon as you receive it.',
      ),
    ]);
  }

  public async returnToCaseDetails(): Promise<void> {
    await this.navigationClick(this.$interactive.closeAndReturnToCaseDetailsButton);
  }
}
