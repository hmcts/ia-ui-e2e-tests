import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';

export class StartAppealConfirmPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    closeAndReturnToCaseDetailsButton: this.$commonElements.closeAndReturnToCaseDetailsButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Start the appeal', exact: true }),
    youHaveSavedYourAppealHeading: this.page.getByRole('heading', { level: 1, name: 'You have saved your appeal', exact: true }),
    youStillNeedToSubmitItHeading: this.page.getByRole('heading', { level: 1, name: 'You still need to submit it', exact: true }),
    doThisNextHeading: this.page.getByRole('heading', { level: 3, name: 'Do this next', exact: true }),
    doThisNextParagraph: this.page.getByRole('heading', { level: 3, name: 'Do this next', exact: true }).locator(':scope + p'),
    notReadyToSubmitHeading: this.page.getByRole('heading', { level: 4, name: 'Not ready to submit your appeal yet?', exact: true }),
    notReadyToSubmitParagraph: this.page
      .getByRole('heading', { level: 4, name: 'Not ready to submit your appeal yet?', exact: true })
      .locator(':scope + p'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/confirm',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.youHaveSavedYourAppealHeading).toBeVisible(),
      expect(this.$static.youStillNeedToSubmitItHeading).toBeVisible(),
      expect(this.$static.doThisNextHeading).toBeVisible(),
      expect(this.$static.doThisNextParagraph).toBeVisible(),
      expect(this.$static.doThisNextParagraph).toHaveText(
        "If you're ready to submit your appeal, select 'Submit your appeal' in the 'Next step' dropdown list from your case details page.",
      ),
      expect(this.$static.notReadyToSubmitHeading).toBeVisible(),
      expect(this.$static.notReadyToSubmitParagraph).toBeVisible(),
      expect(this.$static.notReadyToSubmitParagraph).toHaveText(
        'You can return to the case details page to make changes from the ‘Next step’ dropdown list.',
      ),
    ]);
  }

  public async returnToCaseDetails(): Promise<void> {
    await this.navigationClick(this.$interactive.closeAndReturnToCaseDetailsButton);
  }
}
