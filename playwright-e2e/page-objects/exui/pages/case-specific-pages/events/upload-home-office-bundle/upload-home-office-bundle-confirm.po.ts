import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class UploadHomeOfficeBundleConfirmPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    closeAndReturnToCaseDetailsButton: this.$commonElements.closeAndReturnToCaseDetailsButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Upload Home Office bundle', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    youHaveUploadedHomeOfficeBundleHeading: this.page.getByRole('heading', { level: 1, name: "You've uploaded the Home Office bundle", exact: true }),
    whatHappensNextHeading: this.page.getByRole('heading', { level: 4, name: 'What happens next', exact: true }),
    whatHappensNextParagraph1: this.page.locator('markdown', { hasText: 'What happens next' }).locator('p').nth(0),
    whatHappensNextBulletPoint1: this.page.locator('markdown', { hasText: 'What happens next' }).locator('li').nth(0),
    whatHappensNextBulletPoint2: this.page.locator('markdown', { hasText: 'What happens next' }).locator('li').nth(1),
    whatHappensNextParagraph2: this.page.locator('markdown', { hasText: 'What happens next' }).locator('p').nth(1),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/uploadHomeOfficeBundle/confirm',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.youHaveUploadedHomeOfficeBundleHeading).toBeVisible(),
      expect(this.$static.whatHappensNextHeading).toBeVisible(),

      expect(this.$static.whatHappensNextParagraph1).toHaveText('The Tribunal will:'),
      expect(this.$static.whatHappensNextParagraph1).toBeVisible(),

      expect(this.$static.whatHappensNextBulletPoint1).toHaveText('check that the bundle complies with the Procedure Rules and Practice Directions'),
      expect(this.$static.whatHappensNextBulletPoint1).toBeVisible(),

      expect(this.$static.whatHappensNextBulletPoint2).toHaveText('inform you of any issues'),
      expect(this.$static.whatHappensNextBulletPoint2).toBeVisible(),

      expect(this.$static.whatHappensNextParagraph2).toHaveText(
        'The Home Office will be notified when the Appeal Skeleton Argument is ready to review.',
      ),
      expect(this.$static.whatHappensNextParagraph2).toBeVisible(),
    ]);
  }

  public async returnToCaseDetails(): Promise<void> {
    await this.navigationClick(this.$interactive.closeAndReturnToCaseDetailsButton);
  }
}
