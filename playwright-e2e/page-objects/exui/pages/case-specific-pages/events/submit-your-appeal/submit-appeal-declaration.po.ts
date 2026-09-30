import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class SubmitAppealDeclarationPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    declarationCheckbox: this.page.locator('input[id="legalRepDeclaration-hasDeclared"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    submitButton: this.page.getByRole('button', { name: 'Submit', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Declaration', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    declarationCheckboxLabel: this.page.locator('label[for="legalRepDeclaration-hasDeclared"]'),
    paymentNextStepHeading: this.page.locator('[field_id="legalRepDirectionToPayHeader"] h3'),
    paymentDescription: this.page.locator('[field_id="legalRepDirectionToPayDescription"] p'),
    feeToPayHeading: this.page.locator('[field_id="legalRepDirectionToPayFeeHeader"] h3'),
    feeAmount: this.page.locator('[field_id="feeAmountGbp"] .case-field__value span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/submitAppeal/submitAppealdeclaration',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.declarationCheckboxLabel).toBeVisible(),
      expect(this.$static.declarationCheckboxLabel).toHaveText(
        'The appellant or legal representative has indicated that the facts entered on the appeal form and any continuation sheets are true and complete.',
      ),
    ]);
  }

  public async submitAppeal(options: { hasFeeToPay: boolean; feeToPay?: number }): Promise<void> {
    await this.$inputs.declarationCheckbox.check();
    await expect(this.$inputs.declarationCheckbox).toBeChecked();

    if (options.hasFeeToPay) {
      if (options.feeToPay === undefined) {
        throw new Error('feeToPay must be provided when hasFeeToPay is true');
      }

      await Promise.all([
        expect(this.$static.paymentNextStepHeading).toHaveText('Next step - payment'),
        expect(this.$static.paymentNextStepHeading).toBeVisible(),
        expect(this.$static.paymentDescription).toHaveText('You must pay for your appeal.'),
        expect(this.$static.paymentDescription).toBeVisible(),
        expect(this.$static.feeToPayHeading).toHaveText('Fee to pay'),
        expect(this.$static.feeToPayHeading).toBeVisible(),
        expect(this.$static.feeAmount).toHaveText(`£${options.feeToPay.toFixed(2)}`),
        expect(this.$static.feeAmount).toBeVisible(),
      ]);
    }

    await this.navigationClick(this.$interactive.submitButton);
  }
}
