import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class RequestHomeOfficeDataConfirmPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    closeAndReturnToCaseDetailsButton: this.$commonElements.closeAndReturnToCaseDetailsButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Request Home Office data', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    youHaveMatchedAppellantDetailsHeading: this.page.getByRole('heading', { level: 1, name: 'You have matched the appellant details', exact: true }),
    doThisNextHeading: this.page.getByRole('heading', { level: 4, name: 'Do this next', exact: true }),
    doThisNextParagrapgh: this.page.locator('markdown', { hasText: 'Do this next' }).locator('p'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/requestHomeOfficeData/confirm',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.youHaveMatchedAppellantDetailsHeading).toBeVisible(),
      expect(this.$static.doThisNextHeading).toBeVisible(),
      expect(this.$static.doThisNextParagrapgh).toBeVisible(),
      expect(this.$static.doThisNextParagrapgh).toHaveText(
        'You must review the appeal data and cross reference it with Home Office data in the validation tab. If the appeal looks valid, you must tell the respondent to supply their evidence.',
      ),
    ]);
  }

  public async returnToCaseDetails(): Promise<void> {
    await this.navigationClick(this.$interactive.closeAndReturnToCaseDetailsButton);
  }
}
