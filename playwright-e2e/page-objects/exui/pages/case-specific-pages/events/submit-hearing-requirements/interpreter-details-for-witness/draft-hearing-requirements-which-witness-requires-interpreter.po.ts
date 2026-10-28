import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../../exui-base';
import { InterpreterLanguageCategoryType } from '../../../../../../../exui-event-types';

export class DraftHearingRequirementswhichWitnessRequiresInterpreterPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    visibleWitnessInterpreterTypeSections: this.page.locator(
      'ccd-field-write[field_id$="InterpreterLanguageCategory"]:not([hidden])',
    ),
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
    instruction: this.page.locator('#whichWitnessRequiresInterpreterLabel p'),
    visibleWitnessInterpreterTypeQuestion: this.$inputs.visibleWitnessInterpreterTypeSections.locator('legend .form-label'),
    spokenLanguageInterpreterLabel: this.$inputs.visibleWitnessInterpreterTypeSections.locator(
      'label[for$="-spokenLanguageInterpreter"]',
    ),
    signLanguageInterpreterLabel: this.$inputs.visibleWitnessInterpreterTypeSections.locator(
      'label[for$="-signLanguageInterpreter"]',
    ),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementswhichWitnessRequiresInterpreter',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.instruction).toHaveText(
        'Select the witnesses that need a spoken or sign language interpreter and the kind of interpreter they need',
      ),
      expect(this.$static.instruction).toBeVisible(),
      expect(this.$static.visibleWitnessInterpreterTypeQuestion.nth(0)).toBeVisible(),
      expect(this.$static.spokenLanguageInterpreterLabel.nth(0)).toHaveText('Spoken language interpreter'),
      expect(this.$static.spokenLanguageInterpreterLabel.nth(0)).toBeVisible(),
      expect(this.$static.signLanguageInterpreterLabel.nth(0)).toHaveText('Sign language interpreter'),
      expect(this.$static.signLanguageInterpreterLabel.nth(0)).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { witnessInterpreterTypes: InterpreterLanguageCategoryType[][] }): Promise<void> {
    for (const [index, interpreterTypes] of options.witnessInterpreterTypes.entries()) {
      const witnessInterpreterTypeSection = this.$inputs.visibleWitnessInterpreterTypeSections.nth(index);
      await expect(witnessInterpreterTypeSection).toBeVisible();

      for (const interpreterType of interpreterTypes) {
        const checkbox = witnessInterpreterTypeSection.locator(`input[value="${interpreterType}"]`);
        await checkbox.check();
        await expect(checkbox).toBeChecked();
      }
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
