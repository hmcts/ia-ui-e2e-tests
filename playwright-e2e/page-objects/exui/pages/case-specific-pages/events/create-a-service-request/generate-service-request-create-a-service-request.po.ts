import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class GenerateServiceRequestCreateAServiceRequestPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    previousButton: this.$commonElements.previousButton,
    submitButton: this.page.getByRole('button', { name: 'Submit', exact: true }),
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    createServiceRequestCaption: this.page.locator('span.govuk-caption-l', { hasText: 'Create a service request' }),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Pay for this appeal', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    nextStepPaymentHeadig: this.page.locator('[field_id="legalRepCreateServiceRequestHeader"] h3'),
    createServiceRequestDescription: this.page.locator('[field_id="legalRepCreateServiceRequestDescription"] p'),
    feeToPayHeading: this.page.locator('[field_id="legalRepCreateServiceRequestFeeHeader"] h3'),
    feeAmount: this.page.locator('[field_id="feeAmountGbp"] .case-field__value span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/generateServiceRequest/generateServiceRequestcreateAServiceRequest',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(options: { feeAmount: number }): Promise<void> {
    await Promise.all([
      expect(this.$static.createServiceRequestCaption).toBeVisible(),
      expect(this.$static.createServiceRequestCaption).toHaveText('Create a service request'),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.createServiceRequestDescription).toBeVisible(),
      expect(this.$static.createServiceRequestDescription).toHaveText("Select 'Submit' to create the service request"),
      expect(this.$static.feeToPayHeading).toBeVisible(),
      expect(this.$static.feeToPayHeading).toHaveText('Fee to pay'),
      expect(this.$static.feeAmount).toBeVisible(),
      expect(this.$static.feeAmount).toHaveText(`£${options.feeAmount.toFixed(2)}`),
    ]);
  }

  public async submitCreateServiceRequest(): Promise<void> {
    await this.navigationClick(this.$interactive.submitButton);
  }
}
