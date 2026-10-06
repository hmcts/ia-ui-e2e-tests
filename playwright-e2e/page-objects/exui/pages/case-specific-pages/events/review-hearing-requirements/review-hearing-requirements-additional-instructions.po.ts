import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class ReviewHearingRequirementsAdditionalIntructionsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    addtionalInstructionsTextArea: this.page.locator('textarea[id="additionalInstructionsTribunalResponse"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Review hearing requirements', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    addtionalIntructionsText: this.page.locator('div[id="isAdditionalInstructionAllowed"] span'),
    yesLaabel: this.page.locator('label[for="isAdditionalInstructionAllowed_Yes"]'),
    noLabel: this.page.locator('label[for="isAdditionalInstructionAllowed_No"]'),
    tribunalResponseLabel: this.page.locator('label[for="additionalInstructionsTribunalResponse"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/reviewHearingRequirements/reviewHearingRequirementsadjustAdditionalInstructionsRequirements',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.addtionalIntructionsText).toHaveText('Are there any additional instructions for the hearing?'),
      expect(this.$static.addtionalIntructionsText).toBeVisible(),
      expect(this.$static.yesLaabel).toHaveText('Yes'),
      expect(this.$static.yesLaabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { anyAddtionalIntructions: YesOrNoType; instruction?: string }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][id*="${options.anyAddtionalIntructions}"]`);
    await element.check();
    await expect(element).toBeChecked();

    if (options.anyAddtionalIntructions === 'Yes') {
      if (!options.instruction) {
        throw new Error('Instruction text must be provided when anyAdditionalInstructions is Yes');
      }

      await expect(this.$static.tribunalResponseLabel).toHaveText('Additional Instructions');
      await expect(this.$static.tribunalResponseLabel).toBeVisible();

      await this.$inputs.addtionalInstructionsTextArea.fill(options.instruction);
      await expect(this.$inputs.addtionalInstructionsTextArea).toHaveValue(options.instruction);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
