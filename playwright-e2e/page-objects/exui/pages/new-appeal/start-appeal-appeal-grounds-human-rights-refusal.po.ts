import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { ExuiAppealGroundsHumanRightsRefusalType } from '../../../../exui-event-types';

export class StartAppealAppealGroundsHumanRightsRefusalPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Start the appeal', exact: true }),
    appealGroundsAdviceText: this.page.locator('[id="appealGroundsHumanRightsRefusalTitle"] p'),
    groundsHeading: this.page.getByRole('heading', { level: 2, name: 'The grounds of your appeal', exact: true }),
    decisionIsUnlawfulOptionLabel: this.page.locator('label[for="appealGroundsDecisionHumanRightsRefusal_values-humanRightsRefusal"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealappealGroundsHumanRightsRefusal',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.appealGroundsAdviceText).toBeVisible(),
      expect(this.$static.appealGroundsAdviceText).toHaveText("You'll be able to explain your grounds in more detail later."),
      expect(this.$static.groundsHeading).toBeVisible(),
      expect(this.$static.decisionIsUnlawfulOptionLabel).toBeVisible(),
      expect(this.$static.decisionIsUnlawfulOptionLabel).toHaveText('The decision is unlawful under section 6 of the Human Rights Act 1998'),
    ]);
  }

  public async completePageAndContinue(options: { groundsForAppeal: ExuiAppealGroundsHumanRightsRefusalType }): Promise<void> {
    const appealGroundOption = this.page.getByRole('checkbox', { name: options.groundsForAppeal, exact: true });
    await appealGroundOption.check();
    await expect(appealGroundOption).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
