import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class UploadHomeOfficeAppealResponseConfirmPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    closeAndReturnToCaseDetailsButton: this.$commonElements.closeAndReturnToCaseDetailsButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Upload the appeal response', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    YouHaveUploadedAppealResponseHeading: this.page.getByRole('heading', { level: 1, name: "You've uploaded the appeal response", exact: true }),
    whatHappensNextHeading: this.page.getByRole('heading', { level: 4, name: 'What happens next', exact: true }),
    whatHappensNextParagraph1: this.page.locator('markdown', { hasText: 'What happens next' }).locator('p').nth(0),
    whatHappensNextBulletPoint1: this.page.locator('markdown', { hasText: 'What happens next' }).locator('li').nth(0),
    whatHappensNextBulletPoint2: this.page.locator('markdown', { hasText: 'What happens next' }).locator('li').nth(1),
    whatHappensNextParagraph2: this.page.locator('markdown', { hasText: 'What happens next' }).locator('p').nth(1),
    whatHappensNextParagraph3: this.page.locator('markdown', { hasText: 'What happens next' }).locator('p').nth(2),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/uploadHomeOfficeAppealResponse/confirm',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.YouHaveUploadedAppealResponseHeading).toBeVisible(),
      expect(this.$static.whatHappensNextHeading).toBeVisible(),

      expect(this.$static.whatHappensNextParagraph1).toHaveText('The Tribunal will:'),
      expect(this.$static.whatHappensNextParagraph1).toBeVisible(),

      expect(this.$static.whatHappensNextBulletPoint1).toHaveText(
        'check that the Home Office response complies with the Procedure Rules and Practice Directions',
      ),
      expect(this.$static.whatHappensNextBulletPoint1).toBeVisible(),

      expect(this.$static.whatHappensNextBulletPoint2).toHaveText('inform you of any issues'),
      expect(this.$static.whatHappensNextBulletPoint2).toBeVisible(),

      expect(this.$static.whatHappensNextParagraph2).toHaveText('Providing there are no issues, the response will be shared with the appellant.'),
      expect(this.$static.whatHappensNextParagraph2).toBeVisible(),

      expect(this.$static.whatHappensNextParagraph3).toHaveText('All parties will be notified when the Hearing Notice is ready.'),
      expect(this.$static.whatHappensNextParagraph3).toBeVisible(),
    ]);
  }

  public async returnToCaseDetails(): Promise<void> {
    await this.navigationClick(this.$interactive.closeAndReturnToCaseDetailsButton);
  }
}
