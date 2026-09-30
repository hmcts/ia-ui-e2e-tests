import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { YesOrNoType } from '../../../../citizen-types';

export class StartAppealSponsorAuthorisationPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: "Sponsor's access to information", exact: true }),
    sponsorAuthorisationQuestionLabel: this.page.locator('div[id="sponsorAuthorisation"] legend span'),
    sponsorAuthorisationYesLabel: this.page.locator('label[for="sponsorAuthorisation_Yes"]'),
    sponsorAuthorisationNoLabel: this.page.locator('label[for="sponsorAuthorisation_No"]'),
    sponsorAuthorisationGuidanceLabel: this.page.locator('[id="sponsorAuthorisationLabel"] strong'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealsponsorAuthorisation',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.sponsorAuthorisationQuestionLabel).toBeVisible(),
      expect(this.$static.sponsorAuthorisationQuestionLabel).toHaveText(
        'Does the appellant give authorisation for the sponsor to access information relating to the appeal?',
      ),
      expect(this.$static.sponsorAuthorisationYesLabel).toBeVisible(),
      expect(this.$static.sponsorAuthorisationYesLabel).toHaveText('Yes'),
      expect(this.$static.sponsorAuthorisationNoLabel).toBeVisible(),
      expect(this.$static.sponsorAuthorisationNoLabel).toHaveText('No'),
    ]);
  }

  public async completePageAndContinue(options: { sponsorAuthorisation: YesOrNoType }): Promise<void> {
    const sponsorAuthorisationOption = this.page.getByRole('radio', { name: options.sponsorAuthorisation, exact: true });
    await sponsorAuthorisationOption.check();
    await expect(sponsorAuthorisationOption).toBeChecked();

    if (options.sponsorAuthorisation === 'No') {
      await expect(this.$static.sponsorAuthorisationGuidanceLabel).toBeVisible();
      await expect(this.$static.sponsorAuthorisationGuidanceLabel).toHaveText(
        'The sponsor will not be sent any notices or decisions relating to the appeal other than a Notice of Hearing, if applicable.',
      );
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
