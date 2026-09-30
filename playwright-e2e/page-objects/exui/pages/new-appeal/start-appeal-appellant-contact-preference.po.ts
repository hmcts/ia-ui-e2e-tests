import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { SponsorContactPreferenceType } from '../../../../exui-event-types';

type CompletePageAndContinueOptions =
  | {
      contactPreference: 'Email';
      emailAddress: string;
    }
  | {
      contactPreference: 'Text message';
      mobilePhoneNumber: string;
    };

export class StartAppealAppellantContactPreferencePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    emailInput: this.page.locator('input[id="email"]'),
    emailRetypeInput: this.page.locator('input[id="emailRetype"]'),
    mobileNumberInput: this.page.locator('input[id="mobileNumber"]'),
    mobileNumberRetypeInput: this.page.locator('input[id="mobileNumberRetype"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: "The appellant's contact preference", exact: true }),
    communicationPreferenceLabel: this.page.locator('label[for="contactPreference"] span'),
    communicationPreferenceEmailLabel: this.page.locator('label[for="contactPreference-wantsEmail"]'),
    communicationPreferenceTextMessageLabel: this.page.locator('label[for="contactPreference-wantsSms"]'),
    guidanceParagraph: this.page.locator('[id="appellantContactPreferenceTitle"] p'),
    guidanceBullet: this.page.locator('[id="appellantContactPreferenceTitle"] li'),
    emailInfoText: this.page.locator('[id="emailInfoText"] p'),
    emailLabel: this.page.locator('label[for="email"] span'),
    emailRetypeLabel: this.page.locator('label[for="emailRetype"] span'),
    mobilePhoneNumberInfoText: this.page.locator('[id="mobilePhoneNumberInfoText"] p'),
    mobileNumberLabel: this.page.locator('label[for="mobileNumber"] span'),
    mobileNumberRetypeLabel: this.page.locator('label[for="mobileNumberRetype"] span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealappellantContactPreference',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.guidanceParagraph.nth(0)).toHaveText('Select the communication method which best suits the appellant.'),
      expect(this.$static.guidanceParagraph.nth(1)).toHaveText('The Tribunal needs this to:'),
      expect(this.$static.guidanceBullet.nth(0)).toHaveText("It must be the appellant's email address"),
      expect(this.$static.guidanceBullet.nth(1)).toHaveText("It must be the appellant's mobile phone number."),
      expect(this.$static.guidanceBullet.nth(2)).toHaveText('provide standard guidance on the appeal process'),
      expect(this.$static.guidanceBullet.nth(3)).toHaveText('update the appellant at key points in the appeal'),
      expect(this.$static.guidanceBullet.nth(4)).toHaveText('send the Hearing Notice and guidance on what to expect at hearing'),
      expect(this.$static.guidanceBullet.nth(5)).toHaveText('contact the appellant if, for any reason, your representation ends'),
      expect(this.$static.communicationPreferenceLabel).toBeVisible(),
      expect(this.$static.communicationPreferenceLabel).toHaveText('Communication Preference'),
      expect(this.$static.communicationPreferenceEmailLabel).toBeVisible(),
      expect(this.$static.communicationPreferenceEmailLabel).toHaveText('Email'),
      expect(this.$static.communicationPreferenceTextMessageLabel).toBeVisible(),
      expect(this.$static.communicationPreferenceTextMessageLabel).toHaveText('Text message'),
    ]);
  }

  public async completePageAndContinue(options: CompletePageAndContinueOptions): Promise<void> {
    await this.page.getByRole('radio', { name: options.contactPreference as SponsorContactPreferenceType, exact: true }).check();
    await expect(this.page.getByRole('radio', { name: options.contactPreference as SponsorContactPreferenceType, exact: true })).toBeChecked();

    if (options.contactPreference === 'Email') {
      await Promise.all([
        expect(this.$static.emailInfoText).toBeVisible(),
        expect(this.$static.emailInfoText).toHaveText("This must be the appellant's email address. Please do not give your own"),
        expect(this.$static.emailLabel).toBeVisible(),
        expect(this.$static.emailLabel).toHaveText("Appellant's email address"),
        expect(this.$static.emailRetypeLabel).toBeVisible(),
        expect(this.$static.emailRetypeLabel).toHaveText("Retype appellant's email address"),
      ]);

      await this.$inputs.emailInput.fill(options.emailAddress);
      await expect(this.$inputs.emailInput).toHaveValue(options.emailAddress);
      await this.$inputs.emailRetypeInput.fill(options.emailAddress);
      await expect(this.$inputs.emailRetypeInput).toHaveValue(options.emailAddress);
    }

    if (options.contactPreference === 'Text message') {
      await Promise.all([
        expect(this.$static.mobilePhoneNumberInfoText).toBeVisible(),
        expect(this.$static.mobilePhoneNumberInfoText).toHaveText("This must be the appellant's mobile phone number. Please do not give your own"),
      ]);

      await this.$inputs.mobileNumberInput.fill(options.mobilePhoneNumber);
      await expect(this.$inputs.mobileNumberInput).toHaveValue(options.mobilePhoneNumber);
      await this.$inputs.mobileNumberRetypeInput.fill(options.mobilePhoneNumber);
      await expect(this.$inputs.mobileNumberRetypeInput).toHaveValue(options.mobilePhoneNumber);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
