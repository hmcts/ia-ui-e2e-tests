import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';

export class StartAppealSponsorNamePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    sponsorGivenNamesInput: this.page.locator('input[id="sponsorGivenNames"]'),
    sponsorFamilyNameInput: this.page.locator('input[id="sponsorFamilyName"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: "What is the sponsor's name?", exact: true }),
    sponsorGivenNamesLabel: this.page.locator('label[for="sponsorGivenNames"] span'),
    sponsorFamilyNameLabel: this.page.locator('label[for="sponsorFamilyName"] span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealsponsorName',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.sponsorGivenNamesLabel).toBeVisible(),
      expect(this.$static.sponsorGivenNamesLabel).toHaveText('Given names'),
      expect(this.$static.sponsorFamilyNameLabel).toBeVisible(),
      expect(this.$static.sponsorFamilyNameLabel).toHaveText('Family name'),
    ]);
  }

  public async completePageAndContinue(options: { sponsorGivenNames: string; sponsorFamilyName: string }): Promise<void> {
    await this.$inputs.sponsorGivenNamesInput.fill(options.sponsorGivenNames);
    await expect(this.$inputs.sponsorGivenNamesInput).toHaveValue(options.sponsorGivenNames);

    await this.$inputs.sponsorFamilyNameInput.fill(options.sponsorFamilyName);
    await expect(this.$inputs.sponsorFamilyNameInput).toHaveValue(options.sponsorFamilyName);

    await this.navigationClick(this.$interactive.continueButton);
  }
}
