import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class HearingRequirementsHealthConditionsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    healthConditionsYesRadio: this.page.locator('input[id="physicalOrMentalHealthIssues_Yes"]'),
    healthConditionsNoRadio: this.page.locator('input[id="physicalOrMentalHealthIssues_No"]'),
    healthConditionsDescription: this.page.locator('textarea[id="physicalOrMentalHealthIssuesDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span.govuk-caption-l', { hasText: 'Submit hearing requirements' }),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Health conditions', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    healthConditionsQuestion: this.page.getByText('Does the appellant have any physical or mental health issues that may impact them on the day?', {
      exact: true,
    }),
    yesLabel: this.page.locator('label[for="physicalOrMentalHealthIssues_Yes"]'),
    noLabel: this.page.locator('label[for="physicalOrMentalHealthIssues_No"]'),
    healthConditionsDescriptionLabel: this.page.locator('label[for="physicalOrMentalHealthIssuesDescription"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsphysicalOrMentalHealthIssues',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.healthConditionsQuestion).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(
    options:
      | { healthConditionsPresent: Extract<YesOrNoType, 'Yes'>; healthConditionsDescription: string }
      | { healthConditionsPresent: Extract<YesOrNoType, 'No'>; healthConditionsDescription?: never },
  ): Promise<void> {
    const radio = options.healthConditionsPresent === 'Yes' ? this.$inputs.healthConditionsYesRadio : this.$inputs.healthConditionsNoRadio;

    await radio.check();
    await expect(radio).toBeChecked();

    if (options.healthConditionsPresent === 'Yes') {
      await expect(this.$static.healthConditionsDescriptionLabel).toHaveText(
        'Explain in detail how any physical or mental health issues may affect them on the day.',
      );
      await expect(this.$static.healthConditionsDescriptionLabel).toBeVisible();
      await this.$inputs.healthConditionsDescription.fill(options.healthConditionsDescription);
      await expect(this.$inputs.healthConditionsDescription).toHaveValue(options.healthConditionsDescription);
    } else {
      await expect(this.$inputs.healthConditionsDescription).toBeHidden();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
