import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { YesOrNoType } from '../../../../citizen-types';

export class StartAppealDeportationOrderPage extends ExuiBase {
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
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Deportation order', exact: true }),
    deportationOrderQuestionLabel: this.page.locator('div[id="deportationOrderOptions"] legend span'),
    deportationOrderYesLabel: this.page.locator('label[for="deportationOrderOptions_Yes"]'),
    deportationOrderNoLabel: this.page.locator('label[for="deportationOrderOptions_No"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealdeportationOrderPage',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.deportationOrderQuestionLabel).toBeVisible(),
      expect(this.$static.deportationOrderQuestionLabel).toHaveText('Has a deportation order been made against the appellant?'),
      expect(this.$static.deportationOrderYesLabel).toBeVisible(),
      expect(this.$static.deportationOrderYesLabel).toHaveText('Yes'),
      expect(this.$static.deportationOrderNoLabel).toBeVisible(),
      expect(this.$static.deportationOrderNoLabel).toHaveText('No'),
    ]);
  }

  public async completePageAndContinue(options: { deportationOrder: YesOrNoType }): Promise<void> {
    const deportationOrderOption = this.page.getByRole('radio', { name: options.deportationOrder, exact: true });
    await deportationOrderOption.check();
    await expect(deportationOrderOption).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
