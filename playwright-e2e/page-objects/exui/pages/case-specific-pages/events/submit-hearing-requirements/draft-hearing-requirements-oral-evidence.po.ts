import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class DraftHearingRequirementsOralEvidencePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    appellantGivingOralEvidenceYesRadio: this.page.locator('input[id="isAppellantGivingOralEvidence_Yes"]'),
    appellantGivingOralEvidenceNoRadio: this.page.locator('input[id="isAppellantGivingOralEvidence_No"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    eventCaption: this.page.locator('.govuk-caption-l'),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Oral evidence', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    appellantOralEvidenceQuestion: this.page.getByText('Will the appellant give oral evidence at the hearing?', { exact: true }),
    yesLabel: this.page.locator('label[for="isAppellantGivingOralEvidence_Yes"]'),
    noLabel: this.page.locator('label[for="isAppellantGivingOralEvidence_No"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsoralEvidence',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.eventCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.eventCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.appellantOralEvidenceQuestion).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { appellantGivingOralEvidence: YesOrNoType }): Promise<void> {
    const radio =
      options.appellantGivingOralEvidence === 'Yes' ? this.$inputs.appellantGivingOralEvidenceYesRadio : this.$inputs.appellantGivingOralEvidenceNoRadio;

    await radio.check();
    await expect(radio).toBeChecked();
    await this.navigationClick(this.$interactive.continueButton);
  }
}
