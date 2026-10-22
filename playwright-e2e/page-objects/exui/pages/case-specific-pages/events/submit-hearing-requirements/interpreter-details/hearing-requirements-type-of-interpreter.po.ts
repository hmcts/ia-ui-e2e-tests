import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../../exui-base';
import { InterpreterLanguageCategoryType } from '../../../../../../../exui-event-types';

export class HearingRequirementsTypeOfInterpreterPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    spokenLanguageInterpreter: this.page.locator('input[id="appellantInterpreterLanguageCategory-spokenLanguageInterpreter"]'),
    signLanguageInterpreter: this.page.locator('input[id="appellantInterpreterLanguageCategory-signLanguageInterpreter"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Submit hearing requirements', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    interpreterTypeQuestion: this.page.getByText('What kind of interpreter will the appellant need?', { exact: true }),
    spokenLanguageInterpreterLabel: this.page.locator('label[for="appellantInterpreterLanguageCategory-spokenLanguageInterpreter"]'),
    signLanguageInterpreterLabel: this.page.locator('label[for="appellantInterpreterLanguageCategory-signLanguageInterpreter"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsappellantInterpreterLanguageCategory',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.interpreterTypeQuestion).toBeVisible(),
      expect(this.$static.spokenLanguageInterpreterLabel).toHaveText('Spoken language interpreter'),
      expect(this.$static.spokenLanguageInterpreterLabel).toBeVisible(),
      expect(this.$static.signLanguageInterpreterLabel).toHaveText('Sign language interpreter'),
      expect(this.$static.signLanguageInterpreterLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { interpreterTypes: InterpreterLanguageCategoryType[] }): Promise<void> {
    for (const interpreterType of options.interpreterTypes) {
      const checkbox = this.$inputs[interpreterType];
      await checkbox.check();
      await expect(checkbox).toBeChecked();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
