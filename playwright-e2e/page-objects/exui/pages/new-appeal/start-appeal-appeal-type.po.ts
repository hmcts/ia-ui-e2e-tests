import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { ExuiAppealType } from '../../../../exui-event-types';

export class StartAppealAppealTypePage extends ExuiBase {
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
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Type of appeal', exact: true }),
    appealTypeAdviceText: this.page.locator('[id="appealTypeTitle"] p'),
    appealTypeLabel: this.page.locator('label[for="appealType"] span'),
    appealTypeOptionLabels: this.page.locator('label[for^="appealType-"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealappealType',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.appealTypeAdviceText).toBeVisible(),
      expect(this.$static.appealTypeAdviceText).toHaveText(
        'Select the appeal type that best fits your case. If you want to raise something relating to another appeal type, you can do this later.',
      ),
      expect(this.$static.appealTypeLabel).toBeVisible(),
      expect(this.$static.appealTypeLabel).toHaveText('Type of appeal'),
      expect(this.$static.appealTypeOptionLabels.nth(0)).toBeVisible(),
      expect(this.$static.appealTypeOptionLabels.nth(0)).toHaveText('Refusal of a human rights claim'),
      expect(this.$static.appealTypeOptionLabels.nth(1)).toBeVisible(),
      expect(this.$static.appealTypeOptionLabels.nth(1)).toHaveText('Refusal of application under the EEA regulations'),
      expect(this.$static.appealTypeOptionLabels.nth(2)).toBeVisible(),
      expect(this.$static.appealTypeOptionLabels.nth(2)).toHaveText('Deprivation of citizenship'),
      expect(this.$static.appealTypeOptionLabels.nth(3)).toBeVisible(),
      expect(this.$static.appealTypeOptionLabels.nth(3)).toHaveText('Refusal of protection claim'),
      expect(this.$static.appealTypeOptionLabels.nth(4)).toBeVisible(),
      expect(this.$static.appealTypeOptionLabels.nth(4)).toHaveText('Revocation of a protection status'),
      expect(this.$static.appealTypeOptionLabels.nth(5)).toBeVisible(),
      expect(this.$static.appealTypeOptionLabels.nth(5)).toHaveText('Refusal of application under the EU Settlement Scheme'),
    ]);
  }

  public async completePageAndContinue(options: { appealType: ExuiAppealType }): Promise<void> {
    const option = this.page.getByRole('radio', { name: options.appealType, exact: true });
    await option.check();
    await expect(option).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
