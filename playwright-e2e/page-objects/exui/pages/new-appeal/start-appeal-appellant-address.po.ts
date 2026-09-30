import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { YesOrNoType } from '../../../../citizen-types';

type CompletePageAndContinueOptions =
  | {
      doesAppellantHavePostalAddress: 'No';
    }
  | {
      doesAppellantHavePostalAddress: 'Yes';
      addressPreference: 'Post Code Search' | 'Enter Address Manually';
      postCode: string;
      manualAddress?: {
        buildingAndStreet: string;
        townOrCity: string;
        country: string;
        addressLine2?: string;
        addressLine3?: string;
        county?: string;
      };
    };

export class StartAppealAppellantAddressPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    appellantAddressPostcodeInput: this.page.locator('input[id="appellantAddress_appellantAddress_postcodeInput"]'),
    appellantAddressDetailAddressLine1Input: this.page.locator('input[id="appellantAddress__detailAddressLine1"]'),
    appellantAddressDetailAddressLine2Input: this.page.locator('input[id="appellantAddress__detailAddressLine2"]'),
    appellantAddressDetailAddressLine3Input: this.page.locator('input[id="appellantAddress__detailAddressLine3"]'),
    appellantAddressDetailPostTownInput: this.page.locator('input[id="appellantAddress__detailPostTown"]'),
    appellantAddressDetailCountyInput: this.page.locator('input[id="appellantAddress__detailCounty"]'),
    appellantAddressDetailPostCodeInput: this.page.locator('input[id="appellantAddress__detailPostCode"]'),
    appellantAddressDetailCountryInput: this.page.locator('input[id="appellantAddress__detailCountry"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    appellantAddressFindAddressButton: this.page.getByRole('button', { name: 'Find address', exact: true }),
    appellantAddressManualEntryLink: this.page.getByRole('link', { name: "I can't enter a UK postcode", exact: true }),
    appellantAddressListSelect: this.page.locator('select[id="appellantAddress_appellantAddress_addressList"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: "Appellant's address", exact: true }),
    appellantAddressUsageText: this.page.locator('[id="appellantAddressLabel"] p'),
    hasPostalAddressLabel: this.page.locator('div[id="appellantHasFixedAddress"] span.form-label'),
    hasPostalAddressYesLabel: this.page.locator('label[for="appellantHasFixedAddress_Yes"]'),
    hasPostalAddressNoLabel: this.page.locator('label[for="appellantHasFixedAddress_No"]'),
    noPostalAddressMessage: this.page.locator('[id="appellantHasFixedAddressLabel"] p'),
    addressHeading: this.page.getByRole('heading', { level: 2, name: 'Address', exact: true }),
    appellantAddressPostcodeLabel: this.page.locator('label[for="appellantAddress_appellantAddress_postcodeInput"] span'),
    appellantAddressSelectAddressLabel: this.page.locator('label[for="appellantAddress_appellantAddress_addressList"] span'),
    appellantAddressListOptions: this.page.locator('select[id="appellantAddress_appellantAddress_addressList"] option'),
    appellantAddressDetailAddressLine1Label: this.page.locator('label[for="appellantAddress__detailAddressLine1"] span'),
    appellantAddressDetailAddressLine2Label: this.page.locator('label[for="appellantAddress__detailAddressLine2"] span'),
    appellantAddressDetailAddressLine3Label: this.page.locator('label[for="appellantAddress__detailAddressLine3"] span'),
    appellantAddressDetailPostTownLabel: this.page.locator('label[for="appellantAddress__detailPostTown"] span'),
    appellantAddressDetailCountyLabel: this.page.locator('label[for="appellantAddress__detailCounty"] span'),
    appellantAddressDetailPostCodeLabel: this.page.locator('label[for="appellantAddress__detailPostCode"] span'),
    appellantAddressDetailCountryLabel: this.page.locator('label[for="appellantAddress__detailCountry"] span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealappellantAddress',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.appellantAddressUsageText).toBeVisible(),
      expect(this.$static.appellantAddressUsageText).toHaveText("We'll use this to work out which hearing centre is best for them."),
      expect(this.$static.hasPostalAddressLabel).toBeVisible(),
      expect(this.$static.hasPostalAddressLabel).toHaveText('Does the appellant have a postal address?'),
      expect(this.$static.hasPostalAddressYesLabel).toBeVisible(),
      expect(this.$static.hasPostalAddressYesLabel).toHaveText('Yes'),
      expect(this.$static.hasPostalAddressNoLabel).toBeVisible(),
      expect(this.$static.hasPostalAddressNoLabel).toHaveText('No'),
    ]);
  }

  public async completePageAndContinue(options: CompletePageAndContinueOptions): Promise<void> {
    await this.page.getByRole('radio', { name: options.doesAppellantHavePostalAddress as YesOrNoType, exact: true }).check();
    await expect(this.page.getByRole('radio', { name: options.doesAppellantHavePostalAddress as YesOrNoType, exact: true })).toBeChecked();

    if (options.doesAppellantHavePostalAddress === 'No') {
      await expect(this.$static.noPostalAddressMessage).toBeVisible();
      await expect(this.$static.noPostalAddressMessage).toHaveText('We will use the address of your legal practice.');
    } else {
      await Promise.all([
        expect(this.$static.addressHeading).toBeVisible(),
        expect(this.$static.appellantAddressPostcodeLabel).toBeVisible(),
        expect(this.$static.appellantAddressPostcodeLabel).toHaveText('Enter a UK postcode'),
        expect(this.$interactive.appellantAddressFindAddressButton).toBeVisible(),
        expect(this.$interactive.appellantAddressManualEntryLink).toBeVisible(),
      ]);

      switch (options.addressPreference) {
        case 'Post Code Search':
          await this.$inputs.appellantAddressPostcodeInput.fill(options.postCode);
          await expect(this.$inputs.appellantAddressPostcodeInput).toHaveValue(options.postCode);

          await this.$interactive.appellantAddressFindAddressButton.click();
          await expect(this.$interactive.appellantAddressListSelect).toBeVisible();
          await expect(this.$static.appellantAddressSelectAddressLabel).toBeVisible();
          await expect(this.$static.appellantAddressSelectAddressLabel).toHaveText('Select an address');
          await expect(this.$static.appellantAddressListOptions.nth(0)).toContainText(/addresses found|address found/i);
          await this.$interactive.appellantAddressListSelect.selectOption({ index: 1 });
          await expect(this.$inputs.appellantAddressDetailPostCodeInput).toHaveValue(new RegExp(options.postCode, 'i'));
          break;

        case 'Enter Address Manually':
          if (!options.manualAddress) {
            throw new Error('manualAddress is required when addressPreference is "Enter Address Manually".');
          }

          await this.$interactive.appellantAddressManualEntryLink.click();
          await Promise.all([
            expect(this.$static.addressHeading).toBeVisible(),
            expect(this.$static.appellantAddressDetailAddressLine1Label).toBeVisible(),
            expect(this.$static.appellantAddressDetailAddressLine1Label).toHaveText('Building and Street'),
            expect(this.$static.appellantAddressDetailAddressLine2Label).toBeVisible(),
            expect(this.$static.appellantAddressDetailAddressLine2Label).toHaveText('Address Line 2'),
            expect(this.$static.appellantAddressDetailAddressLine3Label).toBeVisible(),
            expect(this.$static.appellantAddressDetailAddressLine3Label).toHaveText('Address Line 3'),
            expect(this.$static.appellantAddressDetailPostTownLabel).toBeVisible(),
            expect(this.$static.appellantAddressDetailPostTownLabel).toHaveText('Town or City'),
            expect(this.$static.appellantAddressDetailCountyLabel).toBeVisible(),
            expect(this.$static.appellantAddressDetailCountyLabel).toHaveText('County'),
            expect(this.$static.appellantAddressDetailPostCodeLabel).toBeVisible(),
            expect(this.$static.appellantAddressDetailPostCodeLabel).toHaveText('Postcode/Zipcode'),
            expect(this.$static.appellantAddressDetailCountryLabel).toBeVisible(),
            expect(this.$static.appellantAddressDetailCountryLabel).toHaveText('Country'),
          ]);

          await this.$inputs.appellantAddressDetailAddressLine1Input.fill(options.manualAddress.buildingAndStreet);
          await expect(this.$inputs.appellantAddressDetailAddressLine1Input).toHaveValue(options.manualAddress.buildingAndStreet);

          if (options.manualAddress.addressLine2 !== undefined) {
            await this.$inputs.appellantAddressDetailAddressLine2Input.fill(options.manualAddress.addressLine2);
            await expect(this.$inputs.appellantAddressDetailAddressLine2Input).toHaveValue(options.manualAddress.addressLine2);
          }

          if (options.manualAddress.addressLine3 !== undefined) {
            await this.$inputs.appellantAddressDetailAddressLine3Input.fill(options.manualAddress.addressLine3);
            await expect(this.$inputs.appellantAddressDetailAddressLine3Input).toHaveValue(options.manualAddress.addressLine3);
          }

          await this.$inputs.appellantAddressDetailPostTownInput.fill(options.manualAddress.townOrCity);
          await expect(this.$inputs.appellantAddressDetailPostTownInput).toHaveValue(options.manualAddress.townOrCity);

          if (options.manualAddress.county !== undefined) {
            await this.$inputs.appellantAddressDetailCountyInput.fill(options.manualAddress.county);
            await expect(this.$inputs.appellantAddressDetailCountyInput).toHaveValue(options.manualAddress.county);
          }

          await this.$inputs.appellantAddressDetailPostCodeInput.fill(options.postCode);
          await expect(this.$inputs.appellantAddressDetailPostCodeInput).toHaveValue(options.postCode);

          await this.$inputs.appellantAddressDetailCountryInput.fill(options.manualAddress.country);
          await expect(this.$inputs.appellantAddressDetailCountryInput).toHaveValue(options.manualAddress.country);
          break;

        default:
          throw new Error(`Unsupported addressPreference value: ${options.addressPreference}`);
      }
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
