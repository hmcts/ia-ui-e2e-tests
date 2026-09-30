import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { YesOrNoType } from '../../../../citizen-types';

export class StartAppealSponsorPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: "Appellant's sponsor", exact: true }),
    sponsorQuestionLabel: this.page.locator('div[id="hasSponsor"] span'),
    sponsorYesLabel: this.page.locator('label[for="hasSponsor_Yes"]'),
    sponsorNoLabel: this.page.locator('label[for="hasSponsor_No"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealsponsor',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.sponsorQuestionLabel).toBeVisible(),
      expect(this.$static.sponsorQuestionLabel).toHaveText('Does the appellant have a sponsor?'),
      expect(this.$static.sponsorYesLabel).toBeVisible(),
      expect(this.$static.sponsorYesLabel).toHaveText('Yes'),
      expect(this.$static.sponsorNoLabel).toBeVisible(),
      expect(this.$static.sponsorNoLabel).toHaveText('No'),
    ]);
  }

  public async completePageAndContinue(options: { hasSponsor: YesOrNoType }): Promise<void> {
    const sponsorOption = this.page.getByRole('radio', { name: options.hasSponsor, exact: true });
    await sponsorOption.check();
    await expect(sponsorOption).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
