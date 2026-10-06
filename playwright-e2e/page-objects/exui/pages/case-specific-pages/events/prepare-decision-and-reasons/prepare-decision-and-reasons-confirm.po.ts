import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class PrepareDecisionAndReasonsConfirmPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    closeAndReturnToCaseDetailsButton: this.$commonElements.closeAndReturnToCaseDetailsButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Prepare Decision and Reasons', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    decisionAndReasonsDocumentReadyHeading: this.page.getByRole('heading', {
      level: 1,
      name: 'The Decision and Reasons document is ready to download',
      exact: true,
    }),
    whatHappensNextHeading: this.page.getByRole('heading', { level: 4, name: 'What happens next', exact: true }),
    whatHappensNextParagraph: this.page.locator('markdown', { hasText: 'What happens next' }).locator('p'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/generateDecisionAndReasons/confirm',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.decisionAndReasonsDocumentReadyHeading).toBeVisible(),
      expect(this.$static.whatHappensNextHeading).toBeVisible(),
      expect(this.$static.whatHappensNextParagraph).toBeVisible(),
      expect(this.$static.whatHappensNextParagraph).toHaveText('Go to the documents tab to download the Decision and Reasons document.'),
    ]);
  }

  public async returnToCaseDetails(): Promise<void> {
    await this.navigationClick(this.$interactive.closeAndReturnToCaseDetailsButton);
  }
}
