import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class HearingRequirementsInterpreterNeededForWitnessPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    witnessInterpreterRequiredYesRadio: this.page.locator('input[id="isAnyWitnessInterpreterRequired_Yes"]'),
    witnessInterpreterRequiredNoRadio: this.page.locator('input[id="isAnyWitnessInterpreterRequired_No"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span.govuk-caption-l', { hasText: 'Submit hearing requirements' }),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Hearing requirements', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    witnessInterpreterRequiredQuestion: this.page.getByText(
      'Will any of the witnesses require a spoken or sign language interpreter at the hearing?',
      { exact: true },
    ),
    yesLabel: this.page.locator('label[for="isAnyWitnessInterpreterRequired_Yes"]'),
    noLabel: this.page.locator('label[for="isAnyWitnessInterpreterRequired_No"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsisAnyWitnessInterpreterRequired',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.witnessInterpreterRequiredQuestion).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { witnessInterpreterRequired: YesOrNoType }): Promise<void> {
    const radio =
      options.witnessInterpreterRequired === 'Yes'
        ? this.$inputs.witnessInterpreterRequiredYesRadio
        : this.$inputs.witnessInterpreterRequiredNoRadio;

    await radio.check();
    await expect(radio).toBeChecked();
    await this.navigationClick(this.$interactive.continueButton);
  }
}
