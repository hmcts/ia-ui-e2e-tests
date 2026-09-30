import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { YesOrNoType } from '../../../../citizen-types';

export class StartAppealOutOfCountryPage extends ExuiBase {
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
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Location', exact: true }),
    appellantInUkQuestionLabel: this.page.locator('div[id="appellantInUk"] span'),
    appellantInUkYesLabel: this.page.locator('label[for="appellantInUk_Yes"]'),
    appellantInUkNoLabel: this.page.locator('label[for="appellantInUk_No"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealoutOfCountry',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.appellantInUkQuestionLabel).toBeVisible(),
      expect(this.$static.appellantInUkQuestionLabel).toHaveText('Is the appellant currently living in the United Kingdom?'),
      expect(this.$static.appellantInUkYesLabel).toBeVisible(),
      expect(this.$static.appellantInUkYesLabel).toHaveText('Yes'),
      expect(this.$static.appellantInUkNoLabel).toBeVisible(),
      expect(this.$static.appellantInUkNoLabel).toHaveText('No'),
    ]);
  }

  public async completePageAndContinue(options: { isAppellantInUk: YesOrNoType }): Promise<void> {
    await this.page.getByRole('radio', { name: options.isAppellantInUk }).check();
    await expect(this.page.getByRole('radio', { name: options.isAppellantInUk })).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
