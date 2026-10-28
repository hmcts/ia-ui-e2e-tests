import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class DraftHearingRequirementsdraftHearingRequirementsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    eventCaption: this.page.locator('.govuk-caption-l'),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Requirements', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    paragraph: this.page.locator('[id="hearingRequirementsTitle"] p'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsdraftHearingRequirements',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.eventCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.eventCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.paragraph.nth(0)).toHaveText(
        'If the appellant needs interpreter services, step-free access or a hearing loop, these will be provided.',
      ),
      expect(this.$static.paragraph.nth(0)).toBeVisible(),
      expect(this.$static.paragraph.nth(1)).toHaveText(
        "You'll also be able to request additional adjustments based on the appellant's personal circumstances. The tribunal will review these and decide whether a request can be granted.",
      ),
      expect(this.$static.paragraph.nth(1)).toBeVisible(),
    ]);
  }

  public async continueOntoNextPage(): Promise<void> {
    await this.navigationClick(this.$interactive.continueButton);
  }
}
