import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class DraftHearingRequirementsPastExperiencesPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    pastExperiencesYesRadio: this.page.locator('input[id="pastExperiences_Yes"]'),
    pastExperiencesNoRadio: this.page.locator('input[id="pastExperiences_No"]'),
    pastExperiencesDescription: this.page.locator('textarea[id="pastExperiencesDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span.govuk-caption-l', { hasText: 'Submit hearing requirements' }),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Past experiences', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    pastExperiencesQuestion: this.page.getByText('Has the appellant had any past experiences that may impact them on the day?', { exact: true }),
    yesLabel: this.page.locator('label[for="pastExperiences_Yes"]'),
    noLabel: this.page.locator('label[for="pastExperiences_No"]'),
    pastExperiencesDescriptionLabel: this.page.locator('label[for="pastExperiencesDescription"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementspastExperiences',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.pastExperiencesQuestion).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(
    options:
      | { pastExperiencesPresent: Extract<YesOrNoType, 'Yes'>; pastExperiencesDescription: string }
      | { pastExperiencesPresent: Extract<YesOrNoType, 'No'>; pastExperiencesDescription?: never },
  ): Promise<void> {
    const radio = options.pastExperiencesPresent === 'Yes' ? this.$inputs.pastExperiencesYesRadio : this.$inputs.pastExperiencesNoRadio;

    await radio.check();
    await expect(radio).toBeChecked();

    if (options.pastExperiencesPresent === 'Yes') {
      await expect(this.$static.pastExperiencesDescriptionLabel).toHaveText('Explain in detail how any past experiences may affect them on the day?');
      await expect(this.$static.pastExperiencesDescriptionLabel).toBeVisible();
      await this.$inputs.pastExperiencesDescription.fill(options.pastExperiencesDescription);
      await expect(this.$inputs.pastExperiencesDescription).toHaveValue(options.pastExperiencesDescription);
    } else {
      await expect(this.$inputs.pastExperiencesDescription).toBeHidden();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
