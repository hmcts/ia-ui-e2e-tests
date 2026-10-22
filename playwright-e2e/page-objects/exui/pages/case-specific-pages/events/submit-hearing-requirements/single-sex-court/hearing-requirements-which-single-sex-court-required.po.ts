import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../../exui-base';
import { AllMaleOrFemaleHearingType } from '../../../../../../../citizen-types';

export class HearingRequirementsWhichSingleSexCourtRequiredPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    allMaleRadio: this.page.locator('input[id="singleSexCourtType-All male"]'),
    allFemaleRadio: this.page.locator('input[id="singleSexCourtType-All female"]'),
    singleSexCourtReason: this.page.locator('textarea[id="singleSexCourtTypeDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Submit hearing requirements', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    courtTypeQuestion: this.page.locator('label[for="singleSexCourtType"]'),
    allMaleLabel: this.page.locator('label[for="singleSexCourtType-All male"]'),
    allFemaleLabel: this.page.locator('label[for="singleSexCourtType-All female"]'),
    singleSexCourtReasonLabel: this.page.locator('label[for="singleSexCourtTypeDescription"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementssingleSexCourtType',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.courtTypeQuestion).toHaveText('What type of court do they need?'),
      expect(this.$static.courtTypeQuestion).toBeVisible(),
      expect(this.$static.allMaleLabel).toHaveText('All male'),
      expect(this.$static.allMaleLabel).toBeVisible(),
      expect(this.$static.allFemaleLabel).toHaveText('All female'),
      expect(this.$static.allFemaleLabel).toBeVisible(),
      expect(this.$static.singleSexCourtReasonLabel).toHaveText('Explain in detail why the appellant needs a single-sex court.'),
      expect(this.$static.singleSexCourtReasonLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { singleSexCourtType: AllMaleOrFemaleHearingType; reason: string }): Promise<void> {
    const radio = options.singleSexCourtType === 'All male' ? this.$inputs.allMaleRadio : this.$inputs.allFemaleRadio;

    await radio.check();
    await expect(radio).toBeChecked();
    await this.$inputs.singleSexCourtReason.fill(options.reason);
    await expect(this.$inputs.singleSexCourtReason).toHaveValue(options.reason);
    await this.navigationClick(this.$interactive.continueButton);
  }
}
