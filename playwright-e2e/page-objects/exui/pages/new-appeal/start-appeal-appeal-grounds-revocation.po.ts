import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { ExuiAppealGroundsRevocationType } from '../../../../exui-event-types';

export class StartAppealAppealGroundsRevocationPage extends ExuiBase {
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
    appealGroundsAdviceText: this.page.locator('[id="appealGroundsRevocationTitle"] p'),
    selectAtLeastOneOptionHeading: this.page.getByRole('heading', {
      level: 2,
      name: 'Select at least one of the options below',
      exact: true,
    }),
    appealGroundsOptionLabels: this.page.locator('label[for^="appealGroundsRevocation_values-"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealappealGroundsRevocation',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.appealGroundsAdviceText).toBeVisible(),
      expect(this.$static.appealGroundsAdviceText).toHaveText("You'll be able to explain your grounds later."),
      expect(this.$static.selectAtLeastOneOptionHeading).toBeVisible(),
      expect(this.$static.appealGroundsOptionLabels.nth(0)).toBeVisible(),
      expect(this.$static.appealGroundsOptionLabels.nth(0)).toHaveText(
        "Revocation of the appellant's protection status breaches the United Kingdom's obligations in relation to persons eligible for humanitarian protection",
      ),
      expect(this.$static.appealGroundsOptionLabels.nth(1)).toBeVisible(),
      expect(this.$static.appealGroundsOptionLabels.nth(1)).toHaveText(
        "Revocation of the appellant's protection status breaches the United Kingdom's obligations under the Refugee Convention",
      ),
    ]);
  }

  public async completePageAndContinue(options: { groundsForAppeal: ExuiAppealGroundsRevocationType[] }): Promise<void> {
    for (const groundsForAppealOption of options.groundsForAppeal) {
      const appealGroundOption = this.page.getByRole('checkbox', { name: groundsForAppealOption, exact: true });
      await appealGroundOption.check();
      await expect(appealGroundOption).toBeChecked();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
