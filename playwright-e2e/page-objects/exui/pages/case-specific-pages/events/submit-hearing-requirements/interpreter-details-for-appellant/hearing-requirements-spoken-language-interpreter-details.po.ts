import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../../exui-base';
import { LanguagesType } from '../../../../../../../citizen-types';

export class HearingRequirementsSpokenLanguageInterpreterDetailsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    manualLanguageInput: this.page.locator('input[id="appellantInterpreterSpokenLanguage_languageManualEntryDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    spokenLanguageDropdown: this.page.locator('select[id="appellantInterpreterSpokenLanguage_languageRefData"]'),
    enterLanguageManuallyCheckbox: this.page.locator('input[id="appellantInterpreterSpokenLanguage_languageManualEntry-Yes"]'),
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Submit hearing requirements', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    spokenLanguageHeading: this.page.getByRole('heading', {
      level: 2,
      name: 'Tell us which spoken language is needed for the appellant',
      exact: true,
    }),
    spokenLanguageLabel: this.page.locator('label[for="appellantInterpreterSpokenLanguage_languageRefData"]'),
    enterLanguageManuallyLabel: this.page.locator('label[for="appellantInterpreterSpokenLanguage_languageManualEntry-Yes"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsappellantInterpreterSpokenLanguage',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.spokenLanguageHeading).toBeVisible(),
      expect(this.$static.spokenLanguageLabel).toHaveText('Spoken language'),
      expect(this.$static.spokenLanguageLabel).toBeVisible(),
      expect(this.$static.enterLanguageManuallyLabel).toHaveText('Enter the language manually'),
      expect(this.$static.enterLanguageManuallyLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(
    options: { spokenLanguage: LanguagesType; manualLanguage?: never } | { spokenLanguage?: never; manualLanguage: string },
  ): Promise<void> {
    if (options.spokenLanguage) {
      await this.$interactive.spokenLanguageDropdown.selectOption({ label: options.spokenLanguage });
      await expect(this.$interactive.spokenLanguageDropdown.locator('option:checked')).toHaveText(options.spokenLanguage);
    } else {
      await this.$interactive.enterLanguageManuallyCheckbox.check();
      await expect(this.$interactive.enterLanguageManuallyCheckbox).toBeChecked();
      await expect(this.$inputs.manualLanguageInput).toBeVisible();
      await this.$inputs.manualLanguageInput.fill(options.manualLanguage);
      await expect(this.$inputs.manualLanguageInput).toHaveValue(options.manualLanguage);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
