import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';

export class StartAppealLegalRepresentativeDetailsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    legalRepCompanyInput: this.page.locator('input[id="legalRepCompany"]'),
    legalRepGivenNamesInput: this.page.locator('input[id="legalRepName"]'),
    legalRepFamilyNameInput: this.page.locator('input[id="legalRepFamilyName"]'),
    legalRepMobilePhoneNumberInput: this.page.locator('input[id="legalRepMobilePhoneNumber"]'),
    legalRepReferenceNumberInput: this.page.locator('input[id="legalRepReferenceNumber"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Legal representative details', exact: true }),
    legalRepDetailsHint: this.page.locator('dl[id="legalRepDetailsHintAndTitle"] p'),
    legalRepCompanyLabel: this.page.locator('label[for="legalRepCompany"] span'),
    legalRepGivenNamesLabel: this.page.locator('label[for="legalRepName"] span'),
    legalRepFamilyNameLabel: this.page.locator('label[for="legalRepFamilyName"] span'),
    legalRepMobilePhoneNumberLabel: this.page.locator('label[for="legalRepMobilePhoneNumber"] span'),
    legalRepReferenceNumberLabel: this.page.locator('label[for="legalRepReferenceNumber"] span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppeallegalRepresentativeDetails',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.legalRepDetailsHint).toBeVisible(),
      expect(this.$static.legalRepDetailsHint).toHaveText('Enter your details.'),
      expect(this.$static.legalRepCompanyLabel).toBeVisible(),
      expect(this.$static.legalRepCompanyLabel).toHaveText('Company'),
      expect(this.$static.legalRepGivenNamesLabel).toBeVisible(),
      expect(this.$static.legalRepGivenNamesLabel).toHaveText('Given names'),
      expect(this.$static.legalRepFamilyNameLabel).toBeVisible(),
      expect(this.$static.legalRepFamilyNameLabel).toHaveText('Family name'),
      expect(this.$static.legalRepMobilePhoneNumberLabel).toBeVisible(),
      expect(this.$static.legalRepMobilePhoneNumberLabel).toHaveText('Contact number'),
      expect(this.$static.legalRepReferenceNumberLabel).toBeVisible(),
      expect(this.$static.legalRepReferenceNumberLabel).toHaveText('Own reference'),
    ]);
  }

  public async completePageAndContinue(options: {
    legalRepCompany: string;
    legalRepGivenNames: string;
    legalRepFamilyName: string;
    legalRepMobilePhoneNumber: string;
    legalRepReferenceNumber: string;
  }): Promise<void> {
    await this.$inputs.legalRepCompanyInput.fill(options.legalRepCompany);
    await expect(this.$inputs.legalRepCompanyInput).toHaveValue(options.legalRepCompany);

    await this.$inputs.legalRepGivenNamesInput.fill(options.legalRepGivenNames);
    await expect(this.$inputs.legalRepGivenNamesInput).toHaveValue(options.legalRepGivenNames);

    await this.$inputs.legalRepFamilyNameInput.fill(options.legalRepFamilyName);
    await expect(this.$inputs.legalRepFamilyNameInput).toHaveValue(options.legalRepFamilyName);

    await this.$inputs.legalRepMobilePhoneNumberInput.fill(options.legalRepMobilePhoneNumber);
    await expect(this.$inputs.legalRepMobilePhoneNumberInput).toHaveValue(options.legalRepMobilePhoneNumber);

    await this.$inputs.legalRepReferenceNumberInput.fill(options.legalRepReferenceNumber);
    await expect(this.$inputs.legalRepReferenceNumberInput).toHaveValue(options.legalRepReferenceNumber);

    await this.navigationClick(this.$interactive.continueButton);
  }
}
