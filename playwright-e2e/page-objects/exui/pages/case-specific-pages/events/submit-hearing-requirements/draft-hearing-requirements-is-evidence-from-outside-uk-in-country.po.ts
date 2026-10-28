import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class DraftHearingRequirementsisEvidenceFromOutsideUkInCountryPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    evidenceFromOutsideUkYesRadio: this.page.locator('input[id="isEvidenceFromOutsideUkInCountry_Yes"]'),
    evidenceFromOutsideUkNoRadio: this.page.locator('input[id="isEvidenceFromOutsideUkInCountry_No"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    eventCaption: this.page.locator('.govuk-caption-l'),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Oral evidence from outside the UK', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    outsideUkOralEvidenceQuestion: this.page.getByText(
      'Will the appellant or anyone else be giving oral evidence from outside the United Kingdom?',
      { exact: true },
    ),
    outsideUkOralEvidenceHint: this.page.locator('#isEvidenceFromOutsideUkInCountry .form-hint'),
    yesLabel: this.page.locator('label[for="isEvidenceFromOutsideUkInCountry_Yes"]'),
    noLabel: this.page.locator('label[for="isEvidenceFromOutsideUkInCountry_No"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsisEvidenceFromOutsideUkInCountry',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.eventCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.eventCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.outsideUkOralEvidenceQuestion).toBeVisible(),
      expect(this.$static.outsideUkOralEvidenceHint).toHaveText(
        'In certain circumstances an appellant or witness who is outside the United Kingdom may be able to participate in the hearing remotely.',
      ),
      expect(this.$static.outsideUkOralEvidenceHint).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { evidenceFromOutsideUk: YesOrNoType }): Promise<void> {
    const radio = options.evidenceFromOutsideUk === 'Yes' ? this.$inputs.evidenceFromOutsideUkYesRadio : this.$inputs.evidenceFromOutsideUkNoRadio;

    await radio.check();
    await expect(radio).toBeChecked();
    await this.navigationClick(this.$interactive.continueButton);
  }
}
