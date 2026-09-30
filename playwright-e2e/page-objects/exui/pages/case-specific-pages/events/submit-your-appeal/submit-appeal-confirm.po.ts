import { Page, Locator } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class SubmitAppealConfirmPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    closeAndReturnToCaseDetailsButton: this.$commonElements.closeAndReturnToCaseDetailsButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Submit your appeal', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    yourAppealHasBeenSubmittedHeading: this.page.getByRole('heading', { level: 1, name: 'Your appeal has been submitted', exact: true }),
    outOfTimeConfirmation: this.page.getByRole('img', { name: 'Out of time confirmation', exact: true }),
    doThisNextHeading: this.page.getByRole('heading', { level: 4, name: 'Do this next', exact: true }),
    doThisNextParagraph: this.page.getByRole('heading', { level: 4, name: 'Do this next', exact: true }).locator('~ p'),
    whatHappensNextHeading: this.page.getByRole('heading', { level: 4, name: 'What happens next', exact: true }),
    whatHappensNextParagraph: this.page.getByRole('heading', { level: 4, name: 'What happens next', exact: true }).locator('~ p'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/submitAppeal/confirm',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async returnToCaseDetails(): Promise<void> {
    await this.navigationClick(this.$interactive.closeAndReturnToCaseDetailsButton);
  }
}
