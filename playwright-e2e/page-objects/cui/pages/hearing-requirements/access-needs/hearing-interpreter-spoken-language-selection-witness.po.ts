import { Page, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { LanguagesType } from '../../../../../citizen-types';
import { HearingInterpreterSpokenLanguageSelectionPage } from './hearing-interpreter-spoken-language-selection.po';

export class HearingInterpreterSpokenLanguageSelectionWitnessPage extends CuiBase {
  private hearingInterpreterSpokenLanguageSelection: HearingInterpreterSpokenLanguageSelectionPage;
  public readonly $inputs: HearingInterpreterSpokenLanguageSelectionPage['$inputs'];
  public readonly $interactive: HearingInterpreterSpokenLanguageSelectionPage['$interactive'];
  public readonly $static: HearingInterpreterSpokenLanguageSelectionPage['$static'];

  constructor(page: Page) {
    super(page);
    this.hearingInterpreterSpokenLanguageSelection = new HearingInterpreterSpokenLanguageSelectionPage(page);
    this.$inputs = this.hearingInterpreterSpokenLanguageSelection.$inputs;
    this.$interactive = this.hearingInterpreterSpokenLanguageSelection.$interactive;
    this.$static = this.hearingInterpreterSpokenLanguageSelection.$static;
  }

  public async verifyUserIsOnPage(): Promise<void> {
    const pageHeading = this.page.getByRole('heading', { name: /Which spoken language interpreter does .+ need\?/i });

    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-interpreter-spoken-language-selection?selectedWitnesses',
      pageHeading: pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.selectLanguageLabel).toHaveText('Select language'),
      expect(this.$static.selectLanguageLabel).toBeVisible(),

      expect(this.$static.orText).toBeVisible(),

      expect(this.$static.enterLanguageManuallyLabel).toHaveText('Enter the language manually'),
      expect(this.$static.enterLanguageManuallyLabel).toBeVisible(),

      expect(this.$static.manuallyEnteredLanguageLabel).toBeHidden(),
    ]);
  }

  public async completePageAndContinue(options: {
    languageToInterpretPreference: 'Select language from dropdown' | 'Enter language manualy';
    selectLanguageFromDropdown?: LanguagesType;
    enterLanguageManually?: string;
  }): Promise<void> {
    switch (options.languageToInterpretPreference) {
      case 'Select language from dropdown':
        if (!options.selectLanguageFromDropdown) {
          throw new Error('selectLanguageFromDropdown option must be provided when languageToInterpretPreference is "Select language from dropdown"');
        }
        await this.$interactive.selectLanguageDropdown.selectOption({ label: options.selectLanguageFromDropdown });
        const selectedOption = await this.$interactive.selectLanguageDropdown.locator('option:checked').textContent();
        expect(selectedOption?.trim()).toBe(options.selectLanguageFromDropdown);
        break;
      case 'Enter language manualy':
        if (!options.enterLanguageManually) {
          throw new Error('enterLanguageManually option must be provided when languageToInterpretPreference is "Enter language manualy"');
        }
        await this.$interactive.enterLanguageManuallyCheckbox.check();
        await expect(this.$interactive.enterLanguageManuallyCheckbox).toBeChecked();

        await expect(this.$static.manuallyEnteredLanguageLabel).toHaveText('Enter the details of the language you need to request');
        await expect(this.$static.manuallyEnteredLanguageLabel).toBeVisible();

        await this.$inputs.manuallyEnterLanguageInput.fill(options.enterLanguageManually);
        await expect(this.$inputs.manuallyEnterLanguageInput).toHaveValue(options.enterLanguageManually);
        return;
      default:
        throw new Error(`Invalid languageToInterpretPreference: ${options.languageToInterpretPreference}`);
    }

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
