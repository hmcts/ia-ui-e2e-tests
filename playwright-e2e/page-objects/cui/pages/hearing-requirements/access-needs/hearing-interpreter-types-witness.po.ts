import { Page, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { InterpretorSupportType } from '../../../../../citizen-types';
import { HearingInterpreterTypesPage } from './hearing-interpreter-types.po';

export class HearingInterpreterTypesWitnessPage extends CuiBase {
  private hearingInterpreterTypes: HearingInterpreterTypesPage;
  public readonly $interactive: HearingInterpreterTypesPage['$interactive'];
  public readonly $static: HearingInterpreterTypesPage['$static'];

  constructor(page: Page) {
    super(page);
    this.hearingInterpreterTypes = new HearingInterpreterTypesPage(page);
    this.$interactive = this.hearingInterpreterTypes.$interactive;
    this.$static = this.hearingInterpreterTypes.$static;
  }

  public async verifyUserIsOnPage(): Promise<void> {
    const pageHeading = this.page.getByRole('heading', { name: /What kind of interpreter will .+ need\?/i });
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-interpreter-types?selectedWitnesses', pageHeading: pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.spokenLanguageInterpreterLabel).toHaveText('I need a spoken language interpreter'),
      expect(this.$static.spokenLanguageInterpreterLabel).toBeVisible(),

      expect(this.$static.spokenLanguageInterpreterHintText).toHaveText('For example, an interpreter for Urdu'),
      expect(this.$static.spokenLanguageInterpreterHintText).toBeVisible(),

      expect(this.$static.signLanguageInterpreterLabel).toHaveText('I need a sign language interpreter'),
      expect(this.$static.signLanguageInterpreterLabel).toBeVisible(),

      expect(this.$static.signLanguageInterpreterHintText).toHaveText('For example, British Sign Language (BSL)'),
      expect(this.$static.signLanguageInterpreterHintText).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { typeOfInterpretor: InterpretorSupportType }): Promise<void> {
    switch (options.typeOfInterpretor) {
      case 'Spoken language interpreter':
        await this.$interactive.spokenLanguageInterpreterCheckbox.check();
        await expect(this.$interactive.spokenLanguageInterpreterCheckbox).toBeChecked();
        break;
      case 'Sign language interpreter':
        await this.$interactive.signLanguageInterpreterCheckbox.check();
        await expect(this.$interactive.signLanguageInterpreterCheckbox).toBeChecked();
        break;
      case 'Spoken and sign language interpretor':
        await this.$interactive.spokenLanguageInterpreterCheckbox.check();
        await expect(this.$interactive.spokenLanguageInterpreterCheckbox).toBeChecked();

        await this.$interactive.signLanguageInterpreterCheckbox.check();
        await expect(this.$interactive.signLanguageInterpreterCheckbox).toBeChecked();
        break;
      default:
        throw new Error(`Invalid type of interpretor: ${options.typeOfInterpretor}`);
    }

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
