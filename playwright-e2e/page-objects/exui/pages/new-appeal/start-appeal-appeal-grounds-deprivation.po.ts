import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { ExuiAppealGroundsDeprivationHumanRightsType, ExuiAppealGroundsDeprivationType } from '../../../../exui-event-types';

export class StartAppealAppealGroundsDeprivationPage extends ExuiBase {
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
    appealGroundsAdviceText: this.page.locator('[id="appealGroundsDeprivationTitle"] p'),
    selectAtLeastOneOptionHeading: this.page.getByRole('heading', {
      level: 2,
      name: 'Select at least one of the options below',
      exact: true,
    }),
    appealGroundsOptionLabels: this.page.locator('label[for^="appealGroundsDeprivation_values-"]'),
    humanRightsGroundsHeading: this.page.locator('dl[id="appealGroundsDeprivationHumanRightsTitle"] h2'),
    optionalHumanRightsOptionHeading: this.page.getByRole('heading', {
      level: 2,
      name: 'Check the box if this statement also applies (Optional)',
      exact: true,
    }),
    humanRightsOptionLabel: this.page.locator('label[for="appealGroundsDeprivationHumanRights_values-protectionHumanRights"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealappealGroundsDeprivation',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.appealGroundsAdviceText).toBeVisible(),
      expect(this.$static.appealGroundsAdviceText).toHaveText("You'll be able to explain your grounds in more detail later."),
      expect(this.$static.selectAtLeastOneOptionHeading).toBeVisible(),
      expect(this.$static.appealGroundsOptionLabels.nth(0)).toBeVisible(),
      expect(this.$static.appealGroundsOptionLabels.nth(0)).toHaveText('Deprivation would have a disproportionate effect'),
      expect(this.$static.appealGroundsOptionLabels.nth(1)).toBeVisible(),
      expect(this.$static.appealGroundsOptionLabels.nth(1)).toHaveText(
        'The decision is unlawful because discretion should have been exercised differently',
      ),
      expect(this.$static.humanRightsGroundsHeading).toBeVisible(),
      expect(this.$static.humanRightsGroundsHeading).toHaveText('Human rights grounds'),
      expect(this.$static.optionalHumanRightsOptionHeading).toBeVisible(),
      expect(this.$static.humanRightsOptionLabel).toBeVisible(),
      expect(this.$static.humanRightsOptionLabel).toHaveText(
        'Removing the appellant from the UK would be unlawful under section 6 of the Human Rights Act 1998',
      ),
    ]);
  }

  public async completePageAndContinue(options: {
    groundsForAppeal: ExuiAppealGroundsDeprivationType[];
    humanRightsGroundsForAppeal?: ExuiAppealGroundsDeprivationHumanRightsType;
  }): Promise<void> {
    for (const groundsForAppealOption of options.groundsForAppeal) {
      const appealGroundOption = this.page.getByRole('checkbox', { name: groundsForAppealOption, exact: true });
      await appealGroundOption.check();
      await expect(appealGroundOption).toBeChecked();
    }

    if (options.humanRightsGroundsForAppeal) {
      const humanRightsOption = this.page.getByRole('checkbox', {
        name: options.humanRightsGroundsForAppeal,
        exact: true,
      });
      await humanRightsOption.check();
      await expect(humanRightsOption).toBeChecked();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
