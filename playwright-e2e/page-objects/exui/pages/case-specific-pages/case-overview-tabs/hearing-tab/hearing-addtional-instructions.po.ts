import { expect, Locator, Page } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class HearingAdditionalInstructionsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    additionalInstructionsTextArea: this.page.getByRole('textbox', { name: 'Additional instructions' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Enter any additional instructions for the hearing', level: 1, exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-additional-instructions',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async completePageAndContinue(options: { additionalInstructions?: string }): Promise<void> {
    if (options.additionalInstructions) {
      await this.$interactive.additionalInstructionsTextArea.fill(options.additionalInstructions);
      await expect(this.$interactive.additionalInstructionsTextArea).toHaveValue(options.additionalInstructions);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
