import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class GenerateUpperTribunalBundleConfirmPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    closeAndReturnToCaseDetailsButton: this.$commonElements.closeAndReturnToCaseDetailsButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Generate Upper Tribunal bundle', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    bundleIsBeingGeneratedHeading: this.page.getByRole('heading', { level: 1, name: 'The Upper Tribunal bundle is being generated', exact: true }),
    whatHappensNextHeading: this.page.getByRole('heading', { level: 4, name: 'What happens next', exact: true }),
    whatHappensNextParagraph: this.page.locator('markdown', { hasText: 'What happens next' }).locator('p'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/generateUpperTribunalBundle/confirm',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.bundleIsBeingGeneratedHeading).toBeVisible(),
      expect(this.$static.whatHappensNextHeading).toBeVisible(),
      expect(this.$static.whatHappensNextParagraph.nth(0)).toBeVisible(),
      expect(this.$static.whatHappensNextParagraph.nth(0)).toHaveText(
        'You will soon be able to view and download the bundle under Upper Tribunal documents in the documents tab.',
      ),
      expect(this.$static.whatHappensNextParagraph.nth(1)).toBeVisible(),
      expect(this.$static.whatHappensNextParagraph.nth(1)).toHaveText(
        'If the bundle fails to generate, you will be notified and must follow the same steps to generate the bundle again.',
      ),
    ]);
  }

  public async returnToCaseDetails(): Promise<void> {
    await this.navigationClick(this.$interactive.closeAndReturnToCaseDetailsButton);
  }
}
