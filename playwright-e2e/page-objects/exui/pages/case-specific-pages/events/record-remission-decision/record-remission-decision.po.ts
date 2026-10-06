import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { RemissionDecisionType } from '../../../../../../exui-event-types';

export class RecordRemissionDecisionPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Record remission decision', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    decisionLabel: this.page.locator('label[for="remissionDecision"]'),
    approvedLabel: this.page.locator('label[for*="approved"]'),
    partiallyApprovedLabel: this.page.locator('label[for*="partiallyApproved"]'),
    rejectedLabel: this.page.locator('label[for*="rejected"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/recordRemissionDecision/recordRemissionDecisionremissionDecision',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),

      expect(this.$static.decisionLabel).toHaveText('Decision'),
      expect(this.$static.decisionLabel).toBeVisible(),

      expect(this.$static.approvedLabel).toHaveText('Approved'),
      expect(this.$static.approvedLabel).toBeVisible(),

      expect(this.$static.partiallyApprovedLabel).toHaveText('Partially approved'),
      expect(this.$static.partiallyApprovedLabel).toBeVisible(),

      expect(this.$static.rejectedLabel).toHaveText('Rejected'),
      expect(this.$static.rejectedLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { remissionDecision: RemissionDecisionType }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][id*="${options.remissionDecision}"]`);
    await element.check();
    await expect(element).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
