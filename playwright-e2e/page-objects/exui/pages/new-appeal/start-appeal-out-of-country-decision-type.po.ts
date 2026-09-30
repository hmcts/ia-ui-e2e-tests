import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { OutOfCountryDecisionType } from '../../../../exui-event-types';

export class StartAppealOutOfCountryDecisionTypePage extends ExuiBase {
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
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Out of country decision', exact: true }),
    outOfCountryDecisionTypeLabel: this.page.locator('label[for="outOfCountryDecisionType"] span'),
    outOfCountryDecisionTypeOptionLabels: this.page.locator('label[for^="outOfCountryDecisionType-"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealoutOfCountryDecisionType',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.outOfCountryDecisionTypeLabel).toBeVisible(),
      expect(this.$static.outOfCountryDecisionTypeLabel).toHaveText('What type of decision are you appealing?'),
      expect(this.$static.outOfCountryDecisionTypeOptionLabels.nth(0)).toBeVisible(),
      expect(this.$static.outOfCountryDecisionTypeOptionLabels.nth(0)).toHaveText(
        'A decision either 1) to refuse a human rights claim made following an application for entry clearance or 2) to refuse a permit to enter the UK under the Immigration (European Economic Area) Regulation 2016',
      ),
      expect(this.$static.outOfCountryDecisionTypeOptionLabels.nth(1)).toBeVisible(),
      expect(this.$static.outOfCountryDecisionTypeOptionLabels.nth(1)).toHaveText(
        'A decision to refuse a protection or human rights claim where your client may only apply after leaving the UK',
      ),
      expect(this.$static.outOfCountryDecisionTypeOptionLabels.nth(2)).toBeVisible(),
      expect(this.$static.outOfCountryDecisionTypeOptionLabels.nth(2)).toHaveText(
        'A decision either 1) to remove your client from the UK under the Immigration (European Economic Area) Regulations 2016, where they are currently outside the UK or 2) to deprive your client of British citizenship, where they are currently outside the UK',
      ),
      expect(this.$static.outOfCountryDecisionTypeOptionLabels.nth(3)).toBeVisible(),
      expect(this.$static.outOfCountryDecisionTypeOptionLabels.nth(3)).toHaveText(
        'A decision to refuse a permit to enter the UK or entry clearance under the immigration rules and/or the EU Settlement Scheme.',
      ),
    ]);
  }

  public async completePageAndContinue(options: { outOfCountryDecisionType: OutOfCountryDecisionType }): Promise<void> {
    const option = this.page.getByRole('radio', { name: options.outOfCountryDecisionType, exact: true });
    await option.check();
    await expect(option).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
