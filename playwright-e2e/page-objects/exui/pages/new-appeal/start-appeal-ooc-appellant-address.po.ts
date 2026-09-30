import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { YesOrNoType } from '../../../../citizen-types';

type CompletePageAndContinueOptions =
  | {
      hasCorrespondenceAddressOutsideUk: 'Yes';
      outOfCountryAddress: string;
    }
  | {
      hasCorrespondenceAddressOutsideUk: 'No';
    };

export class StartAppealOocAppellantAddressPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    outOfCountryAddressTextArea: this.page.locator('textarea[id="appellantOutOfCountryAddress"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: "Appellant's address", exact: true }),
    hasCorrespondenceAddressOutsideUkLabel: this.page.locator('div[id="hasCorrespondenceAddress"] span.form-label'),
    hasCorrespondenceAddressOutsideUkYesLabel: this.page.locator('label[for="hasCorrespondenceAddress_Yes"]'),
    hasCorrespondenceAddressOutsideUkNoLabel: this.page.locator('label[for="hasCorrespondenceAddress_No"]'),
    outOfCountryAddressLabel: this.page.locator('label[for="appellantOutOfCountryAddress"] span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealoocAppellantAddress',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.hasCorrespondenceAddressOutsideUkLabel).toBeVisible(),
      expect(this.$static.hasCorrespondenceAddressOutsideUkLabel).toHaveText('Does your client have a correspondence address outside the UK?'),
      expect(this.$static.hasCorrespondenceAddressOutsideUkYesLabel).toBeVisible(),
      expect(this.$static.hasCorrespondenceAddressOutsideUkYesLabel).toHaveText('Yes'),
      expect(this.$static.hasCorrespondenceAddressOutsideUkNoLabel).toBeVisible(),
      expect(this.$static.hasCorrespondenceAddressOutsideUkNoLabel).toHaveText('No'),
    ]);
  }

  public async completePageAndContinue(options: CompletePageAndContinueOptions): Promise<void> {
    await this.page.getByRole('radio', { name: options.hasCorrespondenceAddressOutsideUk as YesOrNoType, exact: true }).check();
    await expect(this.page.getByRole('radio', { name: options.hasCorrespondenceAddressOutsideUk as YesOrNoType, exact: true })).toBeChecked();

    if (options.hasCorrespondenceAddressOutsideUk === 'Yes') {
      await expect(this.$static.outOfCountryAddressLabel).toBeVisible();
      await expect(this.$static.outOfCountryAddressLabel).toHaveText('Enter the address');
      await this.$inputs.outOfCountryAddressTextArea.fill(options.outOfCountryAddress);
      await expect(this.$inputs.outOfCountryAddressTextArea).toHaveValue(options.outOfCountryAddress);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
