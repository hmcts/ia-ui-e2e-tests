import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';

export class HomeOfficeReferenceNumberPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    referenceNumber: this.page.locator('input[name="homeOfficeRefNumber"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'What is your Home Office reference number?',
    }),
    howToFindReferenceHeading: this.page.getByRole('heading', { level: 2, name: 'reference number' }),
    howToFindRefenceInstructions: this.page.getByRole('heading', { level: 2, name: 'reference number' }).locator('+ ul'),
    enterReferenceLabel: this.page.locator('label[for="homeOfficeRefNumber"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'home-office-reference-number', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.howToFindReferenceHeading).toHaveText('How to find your Office reference number'),
      expect(this.$static.howToFindReferenceHeading).toBeVisible(),

      expect(this.$static.howToFindRefenceInstructions).toBeVisible(),
      expect(this.$static.howToFindRefenceInstructions).toHaveText(
        `
        You should enter the reference number exactly as it appears on the decision letter. This can often be found in the 'How to appeal' section.
        Your UAN reference will be a 16-digit number, for example 1234-1234-1234-1234; you should include all the numbers with the dashes as they appear
        Your GWF reference will be a 9-digit number starting with GWF, for example GWF123456789
        `,
        { useInnerText: true },
      ),

      expect(this.$static.enterReferenceLabel).toHaveText('Enter your Home Office reference number'),
      expect(this.$static.enterReferenceLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(option: { homeOfficeReference: number }): Promise<void> {
    const homeOfficeReference = option.homeOfficeReference.toString();

    await this.$inputs.referenceNumber.fill(homeOfficeReference);
    await expect(this.$inputs.referenceNumber).toHaveValue(homeOfficeReference);
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
