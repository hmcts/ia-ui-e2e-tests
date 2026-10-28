import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../../exui-base';
import { SignLanguagesType } from '../../../../../../../citizen-types';

export class DraftHearingRequirementsappellantInterpreterSignLanguage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    manualLanguageInput: this.page.locator('input[id="appellantInterpreterSignLanguage_languageManualEntryDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    signLanguageDropdown: this.page.locator('select[id="appellantInterpreterSignLanguage_languageRefData"]'),
    enterLanguageManuallyCheckbox: this.page.locator('input[id="appellantInterpreterSignLanguage_languageManualEntry-Yes"]'),
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Submit hearing requirements', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    signLanguageHeading: this.page.getByRole('heading', {
      level: 2,
      name: 'Tell us which sign language is needed for the appellant',
      exact: true,
    }),
    signLanguageLabel: this.page.locator('label[for="appellantInterpreterSignLanguage_languageRefData"]'),
    enterLanguageManuallyLabel: this.page.locator('label[for="appellantInterpreterSignLanguage_languageManualEntry-Yes"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsappellantInterpreterSignLanguage',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.signLanguageHeading).toBeVisible(),
      expect(this.$static.signLanguageLabel).toHaveText('Sign language'),
      expect(this.$static.signLanguageLabel).toBeVisible(),
      expect(this.$static.enterLanguageManuallyLabel).toHaveText('Enter the language manually'),
      expect(this.$static.enterLanguageManuallyLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(
    options: { signLanguage: SignLanguagesType; manualLanguage?: never } | { signLanguage?: never; manualLanguage: string },
  ): Promise<void> {
    if (options.signLanguage) {
      await this.$interactive.signLanguageDropdown.selectOption({ label: options.signLanguage });
      await expect(this.$interactive.signLanguageDropdown.locator('option:checked')).toHaveText(options.signLanguage);
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
