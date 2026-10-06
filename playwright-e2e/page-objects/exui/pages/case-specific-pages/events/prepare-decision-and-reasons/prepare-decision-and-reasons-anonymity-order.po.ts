import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class PrepareDecisionAndReasonsAnonymityOrderPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    prviousButton: this.$commonElements.previousButton,
    continueButton: this.$commonElements.continueButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Prepare Decision and Reasons', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    givingAnonymityOrderHeading: this.page.getByRole('heading', { level: 3, name: 'Are you giving an anonymity direction?', exact: true }),
    anonymityOrderText: this.page.getByText('Anonymity direction', { exact: true }),
    anonymityOrderYesLabel: this.page.locator('label[for="anonymityOrder_Yes"]'),
    anonymityOrderNoLabel: this.page.locator('label[for="anonymityOrder_No"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/generateDecisionAndReasons/generateDecisionAndReasonsanonymityOrder',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.givingAnonymityOrderHeading).toBeVisible(),
      expect(this.$static.anonymityOrderText).toBeVisible(),
      expect(this.$static.anonymityOrderYesLabel).toBeVisible(),
      expect(this.$static.anonymityOrderYesLabel).toHaveText('Yes'),
      expect(this.$static.anonymityOrderNoLabel).toBeVisible(),
      expect(this.$static.anonymityOrderNoLabel).toHaveText('No'),
    ]);
  }

  public async completePageAndContinue(options: { anonymityOrderDirection: YesOrNoType }): Promise<void> {
    await this.page.getByRole('radio', { name: options.anonymityOrderDirection, exact: true }).check();
    await expect(this.page.getByRole('radio', { name: options.anonymityOrderDirection, exact: true })).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
