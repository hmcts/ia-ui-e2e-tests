import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { FeeSupportType } from '../../../../../citizen-types';

export class FeeSupportPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Do you have to pay the fee?',
    }),
    feeForAppealText: this.page.locator('p', { hasText: 'The fee for this appeal' }),
    selectOneText: this.page.getByText('Select one', { exact: true }),
    iGetAsylumSupportLabel: this.page.locator('label[for="asylumSupportFromHo"]'),
    iGotAFeeWaiverLabel: this.page.locator('label[for="feeWaiverFromHo"]'),
    iAmUnder18Label: this.page.locator('label[for="under18GetSupportFromLocalAuthority"]'),
    iAmTheParentLabel: this.page.locator('label[for="parentGetSupportFromLocalAuthority"]'),
    orText: this.page.getByText('or', { exact: true }),
    statementDoNotApplyLabel: this.page.locator('label[for="noneOfTheseStatements"]'),
    statementsDoNotApplyHintText: this.page
      .locator('div[class="govuk-radios__item"]')
      .filter({ has: this.page.locator('label[for="noneOfTheseStatements"]') })
      .locator('div[class*="govuk-hint"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'fee-support', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.feeForAppealText).toHaveText(
        'The fee for this appeal is £144. You do not have to pay the fee if one of the following statements applies to you.',
      ),
      expect(this.$static.feeForAppealText).toBeVisible(),

      expect(this.$static.selectOneText).toBeVisible(),

      expect(this.$static.iGetAsylumSupportLabel).toHaveText('I get asylum support from the Home Office'),
      expect(this.$static.iGetAsylumSupportLabel).toBeVisible(),

      expect(this.$static.iGotAFeeWaiverLabel).toHaveText('I got a fee waiver from the Home Office for my application to stay in the UK'),
      expect(this.$static.iGotAFeeWaiverLabel).toBeVisible(),

      expect(this.$static.iAmUnder18Label).toHaveText('I am under 18 and get housing or other support from the local authority'),
      expect(this.$static.iAmUnder18Label).toBeVisible(),

      expect(this.$static.iAmTheParentLabel).toHaveText(
        'I am the parent, guardian or sponsor of someone under 18 who gets housing or other support from the local authority',
      ),
      expect(this.$static.iAmTheParentLabel).toBeVisible(),

      expect(this.$static.orText).toBeVisible(),

      expect(this.$static.statementDoNotApplyLabel).toHaveText('None of these statements apply to me'),
      expect(this.$static.statementDoNotApplyLabel).toBeVisible(),

      expect(this.$static.statementsDoNotApplyHintText).toHaveText('You may still be able to get help to pay the fee'),
      expect(this.$static.statementsDoNotApplyHintText).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(option: { whetherApplicantHasToPayAFee: FeeSupportType }): Promise<void> {
    const element = this.page.locator('div[class*="radios__item"]', { hasText: option.whetherApplicantHasToPayAFee }).locator('input[type="radio"]');

    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
