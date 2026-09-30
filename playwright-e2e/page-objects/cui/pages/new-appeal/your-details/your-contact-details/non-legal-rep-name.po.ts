import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';

export class NonLegalRepNamePage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    givenName: this.page.locator('input[name="nlrGivenNames"]'),
    familyName: this.page.locator('input[name="nlrFamilyName"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: `What is your non-legal representative's name?`,
    }),
    givenNameLabel: this.page.locator('label[for="nlrGivenNames"]'),
    familyNameLabel: this.page.locator('label[for="nlrFamilyName"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'non-legal-rep-name',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.givenNameLabel).toHaveText('Given names'),
      expect(this.$static.givenNameLabel).toBeVisible(),

      expect(this.$static.familyNameLabel).toHaveText('Family name'),
      expect(this.$static.familyNameLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { givenNames: string | string[]; familyName: string }): Promise<void> {
    const givenNames = Array.isArray(options.givenNames) ? options.givenNames.join(' ') : options.givenNames;
    const familyName = options.familyName;

    await this.$inputs.givenName.fill(givenNames);
    await expect(this.$inputs.givenName).toHaveValue(givenNames);

    await this.$inputs.familyName.fill(familyName);
    await expect(this.$inputs.familyName).toHaveValue(familyName);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
