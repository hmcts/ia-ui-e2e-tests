import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class CompleteDecisionAndReasonsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    prviousButton: this.$commonElements.previousButton,
    continueButton: this.$commonElements.continueButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Complete decision and reasons', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    whatIsYourDecisionHeading: this.page.getByRole('heading', { level: 2, name: 'What is your decision?', exact: true }),
    whatIsYourDecisionParagraph: this.page.locator('markdown', { hasText: 'What is your decision?' }).locator('p'),
    decisionLabel: this.page.locator('label[for="isDecisionAllowed"]'),
    decisionAllowedLabel: this.page.locator('label[for="isDecisionAllowed-allowed"]'),
    decisionDismissedLabel: this.page.locator('label[for="isDecisionAllowed-dismissed"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/sendDecisionAndReasons/sendDecisionAndReasonssendDecisionAndReasons',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.whatIsYourDecisionHeading).toBeVisible(),
      expect(this.$static.whatIsYourDecisionParagraph).toBeVisible(),
      expect(this.$static.whatIsYourDecisionParagraph).toHaveText(
        "If the appeal is dismissed on all grounds, select 'Dismissed on all grounds'. If the appeal is allowed on any grounds, you must select 'Allowed'.",
      ),
      expect(this.$static.decisionLabel).toBeVisible(),
      expect(this.$static.decisionAllowedLabel).toBeVisible(),
      expect(this.$static.decisionAllowedLabel).toHaveText('Allowed'),
      expect(this.$static.decisionDismissedLabel).toBeVisible(),
      expect(this.$static.decisionDismissedLabel).toHaveText('Dismissed on all grounds'),
    ]);
  }

  public async completePageAndContinue(options: { decision: 'Allowed' | 'Dismissed on all grounds' }): Promise<void> {
    await this.page.getByRole('radio', { name: options.decision, exact: true }).check();
    await expect(this.page.getByRole('radio', { name: options.decision, exact: true })).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
