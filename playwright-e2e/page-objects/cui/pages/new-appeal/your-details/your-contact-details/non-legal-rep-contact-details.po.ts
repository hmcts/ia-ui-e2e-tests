import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';

export class NonLegalRepContactDetailsPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    emailInput: this.page.locator('input[id="emailAddress"]'),
    phoneNumberInput: this.page.locator('input[id="phoneNumber"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: `What are your non-legal representative's contact details?`,
    }),
    hintParagraph: this.page.locator('main p'),
    emailLabel: this.page.locator('label[for="emailAddress"]'),
    phoneNumberLabel: this.page.locator('label[for="phoneNumber"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'non-legal-rep-contact-details',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.hintParagraph.nth(0)).toHaveText(
        `Please provide an email address and phone number for your non-legal representative. They will receive an email invitation to create an account if they do not already have an account with us.`,
      ),
      expect(this.$static.hintParagraph.nth(0)).toBeVisible(),

      expect(this.$static.hintParagraph.nth(1)).toHaveText(
        `Once your appeal has been submitted, please click the 'Add non-legal representative' link on the right of your appeal page and enter the email address you provided here to verify their account and send them instructions to access your case.`,
      ),
      expect(this.$static.hintParagraph.nth(1)).toBeVisible(),

      expect(this.$static.hintParagraph.nth(2)).toHaveText(
        `Important: Changes made on this page only affect the contact details used for appeal notifications. They do not update your MyHMCTS account details.`,
      ),
      expect(this.$static.hintParagraph.nth(2)).toBeVisible(),

      expect(this.$static.emailLabel).toHaveText('Email address'),
      expect(this.$static.emailLabel).toBeVisible(),

      expect(this.$static.phoneNumberLabel).toHaveText('Phone number'),
      expect(this.$static.phoneNumberLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { nlrEmail: string; nlrPhoneNumber: string }): Promise<void> {
    await this.$inputs.emailInput.fill(options.nlrEmail);
    await expect(this.$inputs.emailInput).toHaveValue(options.nlrEmail);

    await this.$inputs.phoneNumberInput.fill(options.nlrPhoneNumber);
    await expect(this.$inputs.phoneNumberInput).toHaveValue(options.nlrPhoneNumber);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
