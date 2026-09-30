import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { HasOtherAppealsType } from '../../../../exui-event-types';

export class StartAppealHasOtherAppealsPage extends ExuiBase {
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
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Other appeals', exact: true }),
    hasOtherAppealsQuestionLabel: this.page.locator('div[id="hasOtherAppeals"] label[for="hasOtherAppeals"] span'),
    hasOtherAppealsYesLabel: this.page.locator('label[for="hasOtherAppeals-Yes"]'),
    hasOtherAppealsYesWithoutAppealNumberLabel: this.page.locator('label[for="hasOtherAppeals-YesWithoutAppealNumber"]'),
    hasOtherAppealsNoLabel: this.page.locator('label[for="hasOtherAppeals-No"]'),
    hasOtherAppealsNotSureLabel: this.page.locator('label[for="hasOtherAppeals-NotSure"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealhasOtherAppeals',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.hasOtherAppealsQuestionLabel).toBeVisible(),
      expect(this.$static.hasOtherAppealsQuestionLabel).toHaveText('Has the appellant appealed against any other UK immigration decision?'),
      expect(this.$static.hasOtherAppealsYesLabel).toBeVisible(),
      expect(this.$static.hasOtherAppealsYesLabel).toHaveText('Yes'),
      expect(this.$static.hasOtherAppealsYesWithoutAppealNumberLabel).toBeVisible(),
      expect(this.$static.hasOtherAppealsYesWithoutAppealNumberLabel).toHaveText('Yes, but an appeal number was not provided'),
      expect(this.$static.hasOtherAppealsNoLabel).toBeVisible(),
      expect(this.$static.hasOtherAppealsNoLabel).toHaveText('No'),
      expect(this.$static.hasOtherAppealsNotSureLabel).toBeVisible(),
      expect(this.$static.hasOtherAppealsNotSureLabel).toHaveText("I'm not sure"),
    ]);
  }

  public async completePageAndContinue(options: { hasOtherAppeals: HasOtherAppealsType }): Promise<void> {
    const hasOtherAppealsOption = this.page.getByRole('radio', { name: options.hasOtherAppeals, exact: true });
    await hasOtherAppealsOption.check();
    await expect(hasOtherAppealsOption).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
