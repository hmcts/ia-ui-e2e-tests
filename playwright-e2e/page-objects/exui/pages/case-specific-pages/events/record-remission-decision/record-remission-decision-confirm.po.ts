import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { RemissionDecisionType } from '../../../../../../exui-event-types';

export class RecordRemissionDecisionConfirmPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    closeAndReturnToCaseDetailsButton: this.$commonElements.closeAndReturnToCaseDetailsButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Record remission decision', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    youHaveApprovedRemissionHeading: this.page.getByRole('heading', { level: 1, name: 'You have approved this remission application', exact: true }),
    whatHappensNextHeading: this.page.getByRole('heading', { level: 4, name: 'What happens next', exact: true }),
    whatHappensNextParagraph1: this.page.locator('markdown', { hasText: 'What happens next' }).locator('p').nth(0),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/recordRemissionDecision/confirm',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(options: { remissionDecision: RemissionDecisionType }): Promise<void> {
    const expectations = [
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.youHaveApprovedRemissionHeading).toBeVisible(),
      expect(this.$static.whatHappensNextHeading).toBeVisible(),
      expect(this.$static.whatHappensNextParagraph1).toBeVisible(),
    ];

    switch (options.remissionDecision) {
      case 'approved':
        // eslint-disable-next-line playwright/missing-playwright-await
        expectations.push(expect(this.$static.youHaveApprovedRemissionHeading).toBeVisible());
        expectations.push(
          // eslint-disable-next-line playwright/missing-playwright-await
          expect(this.$static.whatHappensNextParagraph1).toHaveText(
            'The appellant will be notified that you have approved this remission application. The appeal will progress as usual.',
          ),
        );
        break;
      case 'partiallyApproved':
        throw new Error('Partially approved remission decisions are not currently supported');
        // To be added
        break;
      case 'rejected':
        throw new Error('Rejected remission decisions are not currently supported');
        // To be added
        break;
    }

    await Promise.all(expectations);
  }

  public async returnToCaseDetails(): Promise<void> {
    await this.navigationClick(this.$interactive.closeAndReturnToCaseDetailsButton);
  }
}
