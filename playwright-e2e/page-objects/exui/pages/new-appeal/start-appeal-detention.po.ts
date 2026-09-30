import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { YesOrNoType } from '../../../../citizen-types';

export class StartAppealDetentionPage extends ExuiBase {
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
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Detention', exact: true }),
    appellantInDetentionQuestionLabel: this.page.locator('div[id="appellantInDetention"] span'),
    appellantInDetentionYesLabel: this.page.locator('label[for="appellantInDetention_Yes"]'),
    appellantInDetentionNoLabel: this.page.locator('label[for="appellantInDetention_No"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealdetention',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.appellantInDetentionQuestionLabel).toBeVisible(),
      expect(this.$static.appellantInDetentionQuestionLabel).toHaveText('Is the appellant currently in detention?'),
      expect(this.$static.appellantInDetentionYesLabel).toBeVisible(),
      expect(this.$static.appellantInDetentionYesLabel).toHaveText('Yes'),
      expect(this.$static.appellantInDetentionNoLabel).toBeVisible(),
      expect(this.$static.appellantInDetentionNoLabel).toHaveText('No'),
    ]);
  }

  public async completePageAndContinue(options: { isAppellantInDetention: YesOrNoType }): Promise<void> {
    await this.page.getByRole('radio', { name: options.isAppellantInDetention, exact: true }).check();
    await expect(this.page.getByRole('radio', { name: options.isAppellantInDetention, exact: true })).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
