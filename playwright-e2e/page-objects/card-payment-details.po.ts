import { Page, Locator, expect } from '@playwright/test';
import { Base } from './base';
import { DataUtils } from '../utils';

export class CardPaymentDetailsPage extends Base {
  private dataUtils: DataUtils = new DataUtils();
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    cardNumber: this.page.locator('input[id="card-no"]'),
    expiryMonth: this.page.locator('input[id="expiry-month"]'),
    expiryYear: this.page.locator('input[id="expiry-year"]'),
    nameOnCard: this.page.locator('input[id="cardholder-name"]'),
    securityCode: this.page.locator('input[id="cvc"]'),
    addressLine1: this.page.locator('input[id="address-line-1"]'),
    addressLine2: this.page.locator('input[id="address-line-2"]'),
    townOrCity: this.page.locator('input[id="address-city"]'),
    country: this.page.locator('input[id="address-country"]'),
    postcode: this.page.locator('input[id="address-postcode"]'),
    email: this.page.locator('input[id="email"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.page.locator('button[type="submit"]', { hasText: 'Continue' }),
    cancelPayment: this.page.locator('button[type="submit"]', { hasText: 'Cancel payment' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', { hasText: 'Enter card details' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'card_details', pageHeading: this.$static.pageHeading });
  }

  public async autoPopulateAndSubmitPaymentDetailsForm(): Promise<void> {
    const paymentDetails = await this.dataUtils.generatePaymentDetails();

    await this.$inputs.cardNumber.fill(paymentDetails.cardNumber);
    await this.$inputs.expiryMonth.fill(paymentDetails.expiryMonth);
    await this.$inputs.expiryYear.fill(paymentDetails.expiryYear);
    await this.$inputs.nameOnCard.fill(paymentDetails.nameOnCard);
    await this.$inputs.securityCode.fill(paymentDetails.securityCode);
    await this.$inputs.addressLine1.fill(paymentDetails.addressLine1);
    await this.$inputs.townOrCity.fill(paymentDetails.townOrCity);
    await expect(this.$inputs.country).toHaveValue('United Kingdom');
    await this.$inputs.postcode.fill(paymentDetails.postcode);
    await this.$inputs.email.fill(paymentDetails.email);
    await this.navigationClick(this.$interactive.continueButton);
  }
}
