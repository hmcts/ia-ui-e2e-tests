import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class DecisionAndReasonsStartedImmigrationHistoryPage extends ExuiBase {
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
    doBothPartiesAgreeToImmigrationHistoryText: this.page.getByText('Do both parties agree the immigration history?', { exact: true }),
    immigrationHistoryYesLabel: this.page.locator('label[for="immigrationHistoryAgreement_Yes"]'),
    immigrationHistoryNoLabel: this.page.locator('label[for="immigrationHistoryAgreement_No"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/decisionAndReasonsStarted/decisionAndReasonsStartedimmigrationHistory',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.doBothPartiesAgreeToImmigrationHistoryText).toBeVisible(),
      expect(this.$static.immigrationHistoryYesLabel).toBeVisible(),
      expect(this.$static.immigrationHistoryYesLabel).toHaveText('Yes'),
      expect(this.$static.immigrationHistoryNoLabel).toBeVisible(),
      expect(this.$static.immigrationHistoryNoLabel).toHaveText('No'),
    ]);
  }

  public async completePageAndContinue(options: { agreeToImmigrationHistory: YesOrNoType }): Promise<void> {
    await this.page.getByRole('radio', { name: options.agreeToImmigrationHistory, exact: true }).check();
    await expect(this.page.getByRole('radio', { name: options.agreeToImmigrationHistory, exact: true })).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
