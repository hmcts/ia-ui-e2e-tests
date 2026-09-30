import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';

export class StartAppealSponsorAddressPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    sponsorAddressPostcodeInput: this.page.locator('input[id="sponsorAddress_sponsorAddress_postcodeInput"]'),
    sponsorAddressDetailAddressLine1Input: this.page.locator('input[id="sponsorAddress__detailAddressLine1"]'),
    sponsorAddressDetailAddressLine2Input: this.page.locator('input[id="sponsorAddress__detailAddressLine2"]'),
    sponsorAddressDetailAddressLine3Input: this.page.locator('input[id="sponsorAddress__detailAddressLine3"]'),
    sponsorAddressDetailPostTownInput: this.page.locator('input[id="sponsorAddress__detailPostTown"]'),
    sponsorAddressDetailCountyInput: this.page.locator('input[id="sponsorAddress__detailCounty"]'),
    sponsorAddressDetailPostCodeInput: this.page.locator('input[id="sponsorAddress__detailPostCode"]'),
    sponsorAddressDetailCountryInput: this.page.locator('input[id="sponsorAddress__detailCountry"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    sponsorAddressFindAddressButton: this.page.getByRole('button', { name: 'Find address', exact: true }),
    sponsorAddressManualEntryLink: this.page.getByRole('link', { name: "I can't enter a UK postcode", exact: true }),
    sponsorAddressListSelect: this.page.locator('select[id="sponsorAddress_sponsorAddress_addressList"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: "What is the sponsor's address?", exact: true }),
    addressHeading: this.page.getByRole('heading', { level: 2, name: 'Address', exact: true }),
    sponsorAddressPostcodeLabel: this.page.locator('label[for="sponsorAddress_sponsorAddress_postcodeInput"] span'),
    sponsorAddressSelectAddressLabel: this.page.locator('label[for="sponsorAddress_sponsorAddress_addressList"] span'),
    sponsorAddressListOptions: this.page.locator('select[id="sponsorAddress_sponsorAddress_addressList"] option'),
    sponsorAddressDetailAddressLine1Label: this.page.locator('label[for="sponsorAddress__detailAddressLine1"] span'),
    sponsorAddressDetailAddressLine2Label: this.page.locator('label[for="sponsorAddress__detailAddressLine2"] span'),
    sponsorAddressDetailAddressLine3Label: this.page.locator('label[for="sponsorAddress__detailAddressLine3"] span'),
    sponsorAddressDetailPostTownLabel: this.page.locator('label[for="sponsorAddress__detailPostTown"] span'),
    sponsorAddressDetailCountyLabel: this.page.locator('label[for="sponsorAddress__detailCounty"] span'),
    sponsorAddressDetailPostCodeLabel: this.page.locator('label[for="sponsorAddress__detailPostCode"] span'),
    sponsorAddressDetailCountryLabel: this.page.locator('label[for="sponsorAddress__detailCountry"] span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealsponsorAddress',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.addressHeading).toBeVisible(),
      expect(this.$static.sponsorAddressPostcodeLabel).toBeVisible(),
      expect(this.$static.sponsorAddressPostcodeLabel).toHaveText('Enter a UK postcode'),
      expect(this.$interactive.sponsorAddressFindAddressButton).toBeVisible(),
      expect(this.$interactive.sponsorAddressManualEntryLink).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: {
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
  }): Promise<void> {
    switch (options.addressPreference) {
      case 'Post Code Search':
        await this.$inputs.sponsorAddressPostcodeInput.fill(options.postCode);
        await expect(this.$inputs.sponsorAddressPostcodeInput).toHaveValue(options.postCode);

        await this.$interactive.sponsorAddressFindAddressButton.click();
        await expect(this.$interactive.sponsorAddressListSelect).toBeVisible();
        await expect(this.$static.sponsorAddressSelectAddressLabel).toBeVisible();
        await expect(this.$static.sponsorAddressSelectAddressLabel).toHaveText('Select an address');
        await expect(this.$static.sponsorAddressListOptions.nth(0)).toContainText('addresses found');
        await this.$interactive.sponsorAddressListSelect.selectOption({ index: 1 });
        await expect(this.$inputs.sponsorAddressDetailPostCodeInput).toHaveValue(new RegExp(options.postCode, 'i'));
        break;

      case 'Enter Address Manually':
        if (!options.manualAddress) {
          throw new Error('manualAddress is required when addressPreference is "Enter Address Manually".');
        }

        await this.$interactive.sponsorAddressManualEntryLink.click();
        await Promise.all([
          expect(this.$static.sponsorAddressDetailAddressLine1Label).toBeVisible(),
          expect(this.$static.sponsorAddressDetailAddressLine1Label).toHaveText('Building and Street'),
          expect(this.$static.sponsorAddressDetailAddressLine2Label).toBeVisible(),
          expect(this.$static.sponsorAddressDetailAddressLine2Label).toHaveText('Address Line 2'),
          expect(this.$static.sponsorAddressDetailAddressLine3Label).toBeVisible(),
          expect(this.$static.sponsorAddressDetailAddressLine3Label).toHaveText('Address Line 3'),
          expect(this.$static.sponsorAddressDetailPostTownLabel).toBeVisible(),
          expect(this.$static.sponsorAddressDetailPostTownLabel).toHaveText('Town or City'),
          expect(this.$static.sponsorAddressDetailCountyLabel).toBeVisible(),
          expect(this.$static.sponsorAddressDetailCountyLabel).toHaveText('County'),
          expect(this.$static.sponsorAddressDetailPostCodeLabel).toBeVisible(),
          expect(this.$static.sponsorAddressDetailPostCodeLabel).toHaveText('Postcode/Zipcode'),
          expect(this.$static.sponsorAddressDetailCountryLabel).toBeVisible(),
          expect(this.$static.sponsorAddressDetailCountryLabel).toHaveText('Country'),
        ]);

        await this.$inputs.sponsorAddressDetailAddressLine1Input.fill(options.manualAddress.buildingAndStreet);
        await expect(this.$inputs.sponsorAddressDetailAddressLine1Input).toHaveValue(options.manualAddress.buildingAndStreet);

        if (options.manualAddress.addressLine2 !== undefined) {
          await this.$inputs.sponsorAddressDetailAddressLine2Input.fill(options.manualAddress.addressLine2);
          await expect(this.$inputs.sponsorAddressDetailAddressLine2Input).toHaveValue(options.manualAddress.addressLine2);
        }

        if (options.manualAddress.addressLine3 !== undefined) {
          await this.$inputs.sponsorAddressDetailAddressLine3Input.fill(options.manualAddress.addressLine3);
          await expect(this.$inputs.sponsorAddressDetailAddressLine3Input).toHaveValue(options.manualAddress.addressLine3);
        }

        await this.$inputs.sponsorAddressDetailPostTownInput.fill(options.manualAddress.townOrCity);
        await expect(this.$inputs.sponsorAddressDetailPostTownInput).toHaveValue(options.manualAddress.townOrCity);

        if (options.manualAddress.county !== undefined) {
          await this.$inputs.sponsorAddressDetailCountyInput.fill(options.manualAddress.county);
          await expect(this.$inputs.sponsorAddressDetailCountyInput).toHaveValue(options.manualAddress.county);
        }

        await this.$inputs.sponsorAddressDetailPostCodeInput.fill(options.postCode);
        await expect(this.$inputs.sponsorAddressDetailPostCodeInput).toHaveValue(options.postCode);

        await this.$inputs.sponsorAddressDetailCountryInput.fill(options.manualAddress.country);
        await expect(this.$inputs.sponsorAddressDetailCountryInput).toHaveValue(options.manualAddress.country);
        break;

      default:
        throw new Error(`Unsupported addressPreference value: ${options.addressPreference}`);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
