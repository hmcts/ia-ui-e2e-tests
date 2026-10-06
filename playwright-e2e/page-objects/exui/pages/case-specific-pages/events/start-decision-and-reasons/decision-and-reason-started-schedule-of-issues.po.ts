import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class DecisionAndReasonsStartedScheduleOfIssuesPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    prviousButton: this.$commonElements.previousButton,
    continueButton: this.$commonElements.continueButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Start decision and reasons', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    doBothPartiesAgreeToScheduleOfIssuesText: this.page.getByText('Do both parties agree the schedule of issues?', { exact: true }),
    scheduleOfIssuesYesLabel: this.page.locator('label[for="scheduleOfIssuesAgreement_Yes"]'),
    scheduleOfIssuesNoLabel: this.page.locator('label[for="scheduleOfIssuesAgreement_No"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/decisionAndReasonsStarted/decisionAndReasonsStartedscheduleOfIssues',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.doBothPartiesAgreeToScheduleOfIssuesText).toBeVisible(),
      expect(this.$static.scheduleOfIssuesYesLabel).toBeVisible(),
      expect(this.$static.scheduleOfIssuesYesLabel).toHaveText('Yes'),
      expect(this.$static.scheduleOfIssuesNoLabel).toBeVisible(),
      expect(this.$static.scheduleOfIssuesNoLabel).toHaveText('No'),
    ]);
  }

  public async completePageAndContinue(options: { agreeToScheduleOfIssues: YesOrNoType }): Promise<void> {
    await this.page.getByRole('radio', { name: options.agreeToScheduleOfIssues, exact: true }).check();
    await expect(this.page.getByRole('radio', { name: options.agreeToScheduleOfIssues, exact: true })).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
