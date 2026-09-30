import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { YesOrNoType } from '../../../../citizen-types';

export class StartAppealNewMattersPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    newMattersInput: this.page.locator('textarea[id="newMatters"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span', { hasText: 'Start the appeal' }).last(),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'New matters', exact: true }),
    newMattersQuestionLabel: this.page.locator('div[id="hasNewMatters"] legend span'),
    newMattersYesLabel: this.page.locator('label[for="hasNewMatters_Yes"]'),
    newMattersNoLabel: this.page.locator('label[for="hasNewMatters_No"]'),
    newMattersExplanationLabel: this.page.locator('label[for="newMatters"] span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealnewMatters',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.newMattersQuestionLabel).toBeVisible(),
      expect(this.$static.newMattersQuestionLabel).toHaveText(
        'Are there any reasons the appellant wishes to remain in the UK or any new grounds on which they should be permitted to stay?',
      ),
      expect(this.$static.newMattersYesLabel).toBeVisible(),
      expect(this.$static.newMattersYesLabel).toHaveText('Yes'),
      expect(this.$static.newMattersNoLabel).toBeVisible(),
      expect(this.$static.newMattersNoLabel).toHaveText('No'),
    ]);
  }

  public async completePageAndContinue(options: { hasNewMatters: YesOrNoType; newMattersExplanation?: string }): Promise<void> {
    const hasNewMattersOption = this.page.getByRole('radio', { name: options.hasNewMatters, exact: true });
    await hasNewMattersOption.check();
    await expect(hasNewMattersOption).toBeChecked();

    if (options.hasNewMatters === 'Yes') {
      if (!options.newMattersExplanation) {
        throw new Error('If hasNewMatters is "Yes", newMattersExplanation must be provided.');
      }

      await expect(this.$static.newMattersExplanationLabel).toBeVisible();
      await expect(this.$static.newMattersExplanationLabel).toHaveText('Explain these new matters and their relevance to the appeal');

      await this.$inputs.newMattersInput.fill(options.newMattersExplanation);
      await expect(this.$inputs.newMattersInput).toHaveValue(options.newMattersExplanation);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
