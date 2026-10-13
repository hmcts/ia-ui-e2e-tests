import { expect, Locator, Page } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class RemoveStatutoryTimeframePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    reasonForRemoval: this.page.locator('textarea[id="removalOf24wDecisionReason"]'),
    decisionMakerName: this.page.locator('input[id="removalOf24wDecisionDecisionMaker"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Remove Statutory Timeframe', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    reasonForRemovalLabel: this.page.locator('label[for="removalOf24wDecisionReason"] .form-label'),
    decisionMakerNameLabel: this.page.locator('label[for="removalOf24wDecisionDecisionMaker"] .form-label'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/removeStatutoryTimeframe24Weeks/removeStatutoryTimeframe24WeeksremoveStatutoryTimeframe24Weeks',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.reasonForRemovalLabel).toBeVisible(),
      expect(this.$static.reasonForRemovalLabel).toHaveText('Reason for removal of 24 week timeframe'),
      expect(this.$static.decisionMakerNameLabel).toBeVisible(),
      expect(this.$static.decisionMakerNameLabel).toHaveText('Name of decision maker'),
    ]);
  }

  public async completePageAndContinue(options: { reasonForRemoval: string; decisionMakerName: string }): Promise<void> {
    await this.$inputs.reasonForRemoval.fill(options.reasonForRemoval);
    await this.$inputs.decisionMakerName.fill(options.decisionMakerName);
    await this.navigationClick(this.$interactive.continueButton);
  }
}
