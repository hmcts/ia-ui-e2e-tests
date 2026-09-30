import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';

export class StartAppealOtherAppealsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    appealNumberInputs: this.page.locator('div[id="otherAppeals"] input[type="text"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    addNewButton: this.page.getByRole('button', { name: 'Add new', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Provide the appeal number of any other appeals', exact: true }),
    appealNumberHeading: this.page.getByRole('heading', { level: 2, name: 'Appeal number', exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealotherAppeals',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.appealNumberHeading).toBeVisible(),
      expect(this.$interactive.addNewButton).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { appealNumbers: string | string[] }): Promise<void> {
    const appealNumbers = Array.isArray(options.appealNumbers) ? options.appealNumbers : [options.appealNumbers];

    for (const [index, appealNumber] of appealNumbers.entries()) {
      await this.$interactive.addNewButton.click();

      if (index > 0) {
        await expect(this.page.getByText(`Appeal number ${index + 1}`, { exact: true })).toBeVisible();
      }

      const appealNumberInput = this.$inputs.appealNumberInputs.nth(index);
      await expect(appealNumberInput).toBeVisible();
      await appealNumberInput.fill(appealNumber);
      await expect(appealNumberInput).toHaveValue(appealNumber);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
