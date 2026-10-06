import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';

export class ManualAddressPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    addressLine1: this.page.locator('input[id="address-line-1"]'),
    addressLine2: this.page.locator('input[id="address-line-2"]'),
    townOrCity: this.page.locator('input[id="address-town"]'),
    county: this.page.locator('input[id="address-county"]'),
    postCode: this.page.locator('input[id="address-postcode"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'What is your address?',
    }),
    buildingAndStreetLabel: this.page.locator('label[for="address-line-1"]'),
    townOrCityLabel: this.page.locator('label[for="address-town"]'),
    countyLabel: this.page.locator('label[for="address-county"]'),
    postCodeLabel: this.page.locator('label[for="address-postcode"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'manual-address', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.buildingAndStreetLabel).toContainText('Building and street'),
      expect(this.$static.buildingAndStreetLabel).toBeVisible(),

      expect(this.$static.townOrCityLabel).toHaveText('Town or city'),
      expect(this.$static.townOrCityLabel).toBeVisible(),

      expect(this.$static.countyLabel).toHaveText('County (optional)'),
      expect(this.$static.countyLabel).toBeVisible(),

      expect(this.$static.postCodeLabel).toHaveText('Postcode'),
      expect(this.$static.postCodeLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: {
    preference: 'Address selected via postcode search' | 'Manually enter address details';
    addressLine1?: string;
    addressLine2?: string;
    townOrCity?: string;
    county?: string;
    postCode: string;
  }): Promise<void> {
    switch (options.preference) {
      case 'Address selected via postcode search':
        await expect(this.$inputs.postCode).toHaveValue(options.postCode);
        await this.navigationClick(this.$interactive.saveAndContinueButton);
        break;
      case 'Manually enter address details':
        if (!options.addressLine1 || !options.townOrCity) {
          throw new Error('addressLine1 and townOrCity are required when preference is set to Manually enter address details');
        }
        await this.$inputs.addressLine1.fill(options.addressLine1);
        await expect(this.$inputs.addressLine1).toHaveValue(options.addressLine1);

        if (options.addressLine2) {
          await this.$inputs.addressLine2.fill(options.addressLine2);
          await expect(this.$inputs.addressLine2).toHaveValue(options.addressLine2);
        }

        await this.$inputs.townOrCity.fill(options.townOrCity);
        await expect(this.$inputs.townOrCity).toHaveValue(options.townOrCity);

        if (options.county) {
          await this.$inputs.county.fill(options.county);
          await expect(this.$inputs.county).toHaveValue(options.county);
        }

        await this.$inputs.postCode.fill(options.postCode);
        await expect(this.$inputs.postCode).toHaveValue(options.postCode);

        await this.navigationClick(this.$interactive.saveAndContinueButton);
        break;
      default:
        throw new Error(`Unknown address preference: ${options.preference}`);
    }
  }
}
