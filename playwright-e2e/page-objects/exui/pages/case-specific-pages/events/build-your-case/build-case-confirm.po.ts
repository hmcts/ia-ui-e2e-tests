import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class BuildCaseConfirmPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    closeAndReturnToCaseDetailsButton: this.$commonElements.closeAndReturnToCaseDetailsButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Build your case', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    submittedCaseHeading: this.page.getByRole('heading', { level: 1, name: 'You have submitted your case', exact: true }),
    confirmationEmailParagraph: this.page.locator('#confirmation-body p').nth(0),
    whatHappensNextHeading: this.page.getByRole('heading', { level: 4, name: 'What happens next', exact: true }),
    whatHappensNextParagraph: this.page.locator('#confirmation-body p').nth(1),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/buildCase/confirm',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.submittedCaseHeading).toBeVisible(),
      expect(this.$static.confirmationEmailParagraph).toHaveText('We have sent you a confirmation email'),
      expect(this.$static.confirmationEmailParagraph).toBeVisible(),
      expect(this.$static.whatHappensNextHeading).toBeVisible(),
      expect(this.$static.whatHappensNextParagraph).toHaveText(
        'The case officer will now review your appeal. If it complies with the procedure rules and practice directions, they will send it to the respondent for them to review.',
      ),
      expect(this.$static.whatHappensNextParagraph).toBeVisible(),
    ]);
  }

  public async returnToCaseDetails(): Promise<void> {
    await this.navigationClick(this.$interactive.closeAndReturnToCaseDetailsButton);
  }
}
