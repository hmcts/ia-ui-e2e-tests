import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { HomeOfficeAppealReviewOutcomeType } from '../../../../../../exui-event-types';

export class UploadHomeOfficeAppealResponseReviewOutcomePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Upload the appeal response', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    whatWasOutcomeOfReviewHeading: this.page.getByRole('heading', { level: 1, name: 'What was the outcome of the review?' }),
    outcomeLabel: this.page.locator('label[for="appealReviewOutcome"]'),
    decisionMaintainedLabel: this.page.locator('label[for="appealReviewOutcome-decisionMaintained"]'),
    decisionWithdrawnLabel: this.page.locator('label[for="appealReviewOutcome-decisionWithdrawn"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/uploadHomeOfficeAppealResponse/uploadHomeOfficeAppealResponsehomeOfficeAppealReviewOutcome',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.whatWasOutcomeOfReviewHeading).toBeVisible(),

      expect(this.$static.outcomeLabel).toHaveText('Outcome'),
      expect(this.$static.outcomeLabel).toBeVisible(),

      expect(this.$static.decisionMaintainedLabel).toHaveText('Decision maintained'),
      expect(this.$static.decisionMaintainedLabel).toBeVisible(),

      expect(this.$static.decisionWithdrawnLabel).toHaveText('Decision withdrawn'),
      expect(this.$static.decisionWithdrawnLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { appealReviewOutcome: HomeOfficeAppealReviewOutcomeType }): Promise<void> {
    const element = this.page.locator('div', { hasText: options.appealReviewOutcome }).last().locator('input[type="radio"]');
    await element.check();
    await expect(element).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
