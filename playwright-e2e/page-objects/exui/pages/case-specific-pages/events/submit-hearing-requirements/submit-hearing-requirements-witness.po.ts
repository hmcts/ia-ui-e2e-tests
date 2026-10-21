import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class SubmitHearingRequirementsWitnessPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    witnessesAttendingYesRadio: this.page.locator('input[id="isWitnessesAttending_Yes"]'),
    witnessesAttendingNoRadio: this.page.locator('input[id="isWitnessesAttending_No"]'),
    witnessGivenNamesInput: this.page.locator('input[id="witnessDetails_0_witnessName"]'),
    witnessFamilyNameInput: this.page.locator('input[id="witnessDetails_0_witnessFamilyName"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    addNewWitnessButton: this.page.getByRole('button', { name: 'Add new', exact: true }),
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    eventCaption: this.page.locator('.govuk-caption-l'),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Witnesses', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    witnessesAttendanceQuestion: this.page.getByText('Will any witnesses attend the hearing?', { exact: true }),
    yesLabel: this.page.locator('label[for="isWitnessesAttending_Yes"]'),
    noLabel: this.page.locator('label[for="isWitnessesAttending_No"]'),
    witnessDetailsHeading: this.page.getByRole('heading', { level: 2, name: 'Witness details', exact: true }),
    witnessGivenNamesLabel: this.page.locator('label[for="witnessDetails_0_witnessName"]'),
    witnessFamilyNameLabel: this.page.locator('label[for="witnessDetails_0_witnessFamilyName"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsisWitnessesAttending',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.eventCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.eventCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.witnessesAttendanceQuestion).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(
    options:
      | { witnessesAttending: Extract<YesOrNoType, 'Yes'>; witness?: { givenNames: string; familyName: string } }
      | { witnessesAttending: Extract<YesOrNoType, 'No'> },
  ): Promise<void> {
    const radio = options.witnessesAttending === 'Yes' ? this.$inputs.witnessesAttendingYesRadio : this.$inputs.witnessesAttendingNoRadio;

    await radio.check();
    await expect(radio).toBeChecked();

    if (options.witnessesAttending === 'Yes') {
      await Promise.all([
        expect(this.$static.witnessDetailsHeading).toBeVisible(),
        expect(this.$interactive.addNewWitnessButton).toBeVisible(),
        await this.$interactive.addNewWitnessButton.click(),
        expect(this.$static.witnessGivenNamesLabel).toHaveText('Given names'),
        expect(this.$static.witnessGivenNamesLabel).toBeVisible(),
        expect(this.$static.witnessFamilyNameLabel).toHaveText('Family name'),
        expect(this.$static.witnessFamilyNameLabel).toBeVisible(),
      ]);

      if (options.witness) {
        await this.$inputs.witnessGivenNamesInput.fill(options.witness.givenNames);
        await expect(this.$inputs.witnessGivenNamesInput).toHaveValue(options.witness.givenNames);
        await this.$inputs.witnessFamilyNameInput.fill(options.witness.familyName);
        await expect(this.$inputs.witnessFamilyNameInput).toHaveValue(options.witness.familyName);
      }
    } else {
      await expect(this.$interactive.addNewWitnessButton).toBeHidden();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
