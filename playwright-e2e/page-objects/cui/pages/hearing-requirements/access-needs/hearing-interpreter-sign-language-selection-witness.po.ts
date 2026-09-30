import { Page, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { SignLanguagesType } from '../../../../../citizen-types';
import { HearingInterpreterSignLanguageSelectionPage } from './hearing-interpreter-sign-language-selection.po';

export class HearingInterpreterSignLanguageSelectionWitnessPage extends CuiBase {
  private hearingInterpreterSignLanguageSelection: HearingInterpreterSignLanguageSelectionPage;
  public readonly $inputs: HearingInterpreterSignLanguageSelectionPage['$inputs'];
  public readonly $interactive: HearingInterpreterSignLanguageSelectionPage['$interactive'];
  public readonly $static: HearingInterpreterSignLanguageSelectionPage['$static'];

  constructor(page: Page) {
    super(page);
    this.hearingInterpreterSignLanguageSelection = new HearingInterpreterSignLanguageSelectionPage(page);
    this.$inputs = this.hearingInterpreterSignLanguageSelection.$inputs;
    this.$interactive = this.hearingInterpreterSignLanguageSelection.$interactive;
    this.$static = this.hearingInterpreterSignLanguageSelection.$static;
  }

  public async verifyUserIsOnPage(): Promise<void> {
    const pageHeading = this.page.getByRole('heading', { name: /Which sign language interpreter does .+ need\?/i });

    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-interpreter-sign-language-selection?selectedWitnesses',
      pageHeading: pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.selectSignLanguageLabel).toHaveText('Select sign language'),
      expect(this.$static.selectSignLanguageLabel).toBeVisible(),

      expect(this.$static.orText).toBeVisible(),

      expect(this.$static.enterLanguageManuallyLabel).toHaveText('Enter the language manually'),
      expect(this.$static.enterLanguageManuallyLabel).toBeVisible(),

      expect(this.$static.manuallyEnteredSignLanguageLabel).toBeHidden(),
    ]);
  }

  public async completePageAndContinue(options: {
    languageToInterpretPreference: 'Select sign language from dropdown' | 'Enter sign language manualy';
    selectSignLanguageFromDropdown?: SignLanguagesType;
    enterSignLanguageManually?: string;
  }): Promise<void> {
    switch (options.languageToInterpretPreference) {
      case 'Select sign language from dropdown':
        if (!options.selectSignLanguageFromDropdown) {
          throw new Error(
            'selectSignLanguageFromDropdown option must be provided when languageToInterpretPreference is "Select sign language from dropdown"',
          );
        }
        await this.$interactive.selectSignLanguageDropdown.selectOption({ label: options.selectSignLanguageFromDropdown });
        const selectedOption = await this.$interactive.selectSignLanguageDropdown.locator('option:checked').textContent();
        expect(selectedOption?.trim()).toBe(options.selectSignLanguageFromDropdown);
        break;
      case 'Enter sign language manualy':
        if (!options.enterSignLanguageManually) {
          throw new Error('enterSignLanguageManually option must be provided when languageToInterpretPreference is "Enter sign language manualy"');
        }
        await this.$interactive.enterLanguageManuallyCheckbox.check();
        await expect(this.$interactive.enterLanguageManuallyCheckbox).toBeChecked();

        await expect(this.$static.manuallyEnteredSignLanguageLabel).toHaveText('Enter the details of the language you need to request');
        await expect(this.$static.manuallyEnteredSignLanguageLabel).toBeVisible();

        await this.$inputs.manuallyEnterSignLanguageInput.fill(options.enterSignLanguageManually);
        await expect(this.$inputs.manuallyEnterSignLanguageInput).toHaveValue(options.enterSignLanguageManually);
        return;
      default:
        throw new Error(`Invalid languageToInterpretPreference: ${options.languageToInterpretPreference}`);
    }

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
