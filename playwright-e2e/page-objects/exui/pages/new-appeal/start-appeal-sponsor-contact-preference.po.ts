import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { SponsorContactPreferenceType } from '../../../../exui-event-types';

export class StartAppealSponsorContactPreferencePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    sponsorEmailInput: this.page.locator('input[id="sponsorEmail"]'),
    sponsorMobileNumberInput: this.page.locator('input[id="sponsorMobileNumber"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: "Sponsor's contact details", exact: true }),
    sponsorContactDetailsGuidanceText: this.page.locator('[id="sponsorContactTitle"] p'),
    sponsorContactDetailsLabel: this.page.locator('label[for="sponsorContactPreference"] span'),
    sponsorContactPreferenceEmailLabel: this.page.locator('label[for="sponsorContactPreference-wantsEmail"]'),
    sponsorContactPreferenceTextMessageLabel: this.page.locator('label[for="sponsorContactPreference-wantsSms"]'),
    sponsorEmailLabel: this.page.locator('label[for="sponsorEmail"] span'),
    spomsorMobileNumberLabel: this.page.locator('label[for="sponsorMobileNumber"] span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealsponsorContactPreference',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.sponsorContactDetailsGuidanceText).toBeVisible(),
      expect(this.$static.sponsorContactDetailsGuidanceText).toHaveText(
        "Please provide an email address or phone number for your client's sponsor, or a person responsible for the sponsor.",
      ),
      expect(this.$static.sponsorContactDetailsLabel).toBeVisible(),
      expect(this.$static.sponsorContactDetailsLabel).toHaveText('Contact details'),
      expect(this.$static.sponsorContactPreferenceEmailLabel).toBeVisible(),
      expect(this.$static.sponsorContactPreferenceEmailLabel).toHaveText('Email'),
      expect(this.$static.sponsorContactPreferenceTextMessageLabel).toBeVisible(),
      expect(this.$static.sponsorContactPreferenceTextMessageLabel).toHaveText('Text message'),
    ]);
  }

  public async completePageAndContinue(options: {
    sponsorContactPreference: SponsorContactPreferenceType;
    sponsorEmail?: string;
    sponsorMobileNumber?: string;
  }): Promise<void> {
    const sponsorContactPreferenceOption = this.page.getByRole('radio', { name: options.sponsorContactPreference, exact: true });
    await sponsorContactPreferenceOption.check();
    await expect(sponsorContactPreferenceOption).toBeChecked();

    switch (options.sponsorContactPreference) {
      case 'Email':
        if (!options.sponsorEmail) {
          throw new Error('sponsorEmail is required when sponsorContactPreference is "Email".');
        }

        await expect(this.$static.sponsorEmailLabel).toBeVisible();
        await expect(this.$static.sponsorEmailLabel).toHaveText('Email address');
        await this.$inputs.sponsorEmailInput.fill(options.sponsorEmail);
        await expect(this.$inputs.sponsorEmailInput).toHaveValue(options.sponsorEmail);
        break;

      case 'Text message':
        if (!options.sponsorMobileNumber) {
          throw new Error('sponsorMobileNumber is required when sponsorContactPreference is "Text message".');
        }

        await expect(this.$static.spomsorMobileNumberLabel).toBeVisible();
        await expect(this.$static.spomsorMobileNumberLabel).toHaveText('Mobile phone number');
        await this.$inputs.sponsorMobileNumberInput.fill(options.sponsorMobileNumber);
        await expect(this.$inputs.sponsorMobileNumberInput).toHaveValue(options.sponsorMobileNumber);
        break;

      default:
        throw new Error(`Unsupported sponsorContactPreference value: ${options.sponsorContactPreference}`);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
