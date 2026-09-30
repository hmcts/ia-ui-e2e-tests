import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { ExuiAppealGroundsEuRefusalType } from '../../../../exui-event-types';

export class StartAppealAppealGroundsEuRefusalPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'The grounds of your appeal', exact: true }),
    appealGroundsAdviceText: this.page.locator('[id="appealGroundsEuRefusalTitle"] p'),
    groundsHeading: this.page.getByRole('heading', { level: 2, name: 'The grounds of your appeal', exact: true }),
    decisionBreachesOptionLabel: this.page.locator('label[for="appealGroundsEuRefusal_values-appealGroundsEuRefusal"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealappealGroundsEuRefusal',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.appealGroundsAdviceText).toBeVisible(),
      expect(this.$static.appealGroundsAdviceText).toHaveText("You'll be able to explain your grounds in more detail later."),
      expect(this.$static.groundsHeading).toBeVisible(),
      expect(this.$static.decisionBreachesOptionLabel).toBeVisible(),
      expect(this.$static.decisionBreachesOptionLabel).toHaveText("The decision breaches the appellant's rights under the EEA regulations"),
    ]);
  }

  public async completePageAndContinue(options: { groundsForAppeal: ExuiAppealGroundsEuRefusalType }): Promise<void> {
    const appealGroundOption = this.page.getByRole('checkbox', { name: options.groundsForAppeal, exact: true });
    await appealGroundOption.check();
    await expect(appealGroundOption).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
