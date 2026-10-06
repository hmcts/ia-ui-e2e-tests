import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class ReviewHearingRequirementsConfirmPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    closeAndReturnToCaseDetailsButton: this.$commonElements.closeAndReturnToCaseDetailsButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Review hearing requirements', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    youHaveSentDrirectionHeading: this.page.getByRole('heading', { level: 1, name: "You've recorded the agreed hearing adjustments", exact: true }),
    whatHappensNextHeading: this.page.getByRole('heading', { level: 4, name: 'What happens next', exact: true }),
    whatHappensNextParagraph: this.page.locator('markdown', { hasText: 'What happens next' }).locator('p'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/reviewHearingRequirements/confirm',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.youHaveSentDrirectionHeading).toBeVisible(),
      expect(this.$static.whatHappensNextHeading).toBeVisible(),
      expect(this.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
      expect(this.$static.whatHappensNextParagraph.nth(0)).toHaveText(
        'You should ensure that the case flags reflect the hearing requests that have been approved. This may require adding new case flags or making active flags inactive.',
      ),
      expect(this.$static.whatHappensNextParagraph.nth(1)).toBeVisible(),
      expect(this.$static.whatHappensNextParagraph.nth(1)).toContainText('Add case flag'),
      expect(this.$static.whatHappensNextParagraph.nth(1)).toContainText('Manage case flags'),
      expect(this.$static.whatHappensNextParagraph.nth(1)).toContainText(
        'The listing team will now list the case. All parties will be notified when the Hearing Notice is available to view.',
      ),
    ]);
  }

  public async returnToCaseDetails(): Promise<void> {
    await this.navigationClick(this.$interactive.closeAndReturnToCaseDetailsButton);
  }
}
