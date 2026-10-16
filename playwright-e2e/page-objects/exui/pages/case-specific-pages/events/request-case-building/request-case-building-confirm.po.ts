import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class RequestCaseBuildingConfirmPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    closeAndReturnToCaseDetailsButton: this.$commonElements.closeAndReturnToCaseDetailsButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Request case building', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    youHaveSentADirectionHeading: this.page.getByRole('heading', { level: 1, name: 'You have sent a direction', exact: true }),
    whatHappensNextHeading: this.page.getByRole('heading', { level: 4, name: 'What happens next', exact: true }),
    whatHappensNextParagraph: this.page.locator('#confirmation-body p'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/requestCaseBuilding/confirm',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.youHaveSentADirectionHeading).toBeVisible(),
      expect(this.$static.whatHappensNextHeading).toBeVisible(),
      expect(this.$static.whatHappensNextParagraph).toHaveText('Legal representative will be notified by email.'),
      expect(this.$static.whatHappensNextParagraph).toBeVisible(),
    ]);
  }

  public async returnToCaseDetails(): Promise<void> {
    await this.navigationClick(this.$interactive.closeAndReturnToCaseDetailsButton);
  }
}
