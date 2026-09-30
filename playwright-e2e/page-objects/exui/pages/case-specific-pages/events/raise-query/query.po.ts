import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { RaiseQueryOptionType } from '../../../../../../exui-event-types';

export class QueryPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Raise a new query', exact: true }),
    queryQuestionHeading: this.page.getByRole('heading', { level: 2, name: 'What do you need help to do?', exact: true }),
    queryOptionLabel: this.page.locator('input[name="qualifyingQuestionOption"] + label'),
    issueNotCoveredLabel: this.page.locator('.qm-qualifying-question__divider'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'query-management/query',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.queryQuestionHeading).toBeVisible(),
      expect(this.$static.queryOptionLabel.nth(0)).toBeVisible(),
      expect(this.$static.queryOptionLabel.nth(0)).toHaveText('How can I obtain access to my case on MyHMCTS?'),
      expect(this.$static.queryOptionLabel.nth(1)).toBeVisible(),
      expect(this.$static.queryOptionLabel.nth(1)).toHaveText('How do I request that a hearing be converted to CVP?'),
      expect(this.$static.queryOptionLabel.nth(2)).toBeVisible(),
      expect(this.$static.queryOptionLabel.nth(2)).toHaveText('What should I do if I have not received my CVP hearing link?'),
      expect(this.$static.queryOptionLabel.nth(3)).toBeVisible(),
      expect(this.$static.queryOptionLabel.nth(3)).toHaveText('Has my B1 form been received?'),
      expect(this.$static.queryOptionLabel.nth(4)).toBeVisible(),
      expect(this.$static.queryOptionLabel.nth(4)).toHaveText('Has my adjournment request been received?'),
      expect(this.$static.queryOptionLabel.nth(5)).toBeVisible(),
      expect(this.$static.queryOptionLabel.nth(5)).toHaveText('Has my hearing bundle been received?'),
      expect(this.$static.queryOptionLabel.nth(6)).toBeVisible(),
      expect(this.$static.queryOptionLabel.nth(6)).toHaveText('Is my hearing scheduled to proceed as planned?'),
      expect(this.$static.queryOptionLabel.nth(7)).toBeVisible(),
      expect(this.$static.queryOptionLabel.nth(7)).toHaveText('How can instructed counsel obtain hearing details?'),
      expect(this.$static.queryOptionLabel.nth(8)).toBeVisible(),
      expect(this.$static.queryOptionLabel.nth(8)).toHaveText('Follow-up on an existing query'),
      expect(this.$static.issueNotCoveredLabel).toBeVisible(),
      expect(this.$static.issueNotCoveredLabel).toHaveText('If your issue is not covered by the options above, raise a query:'),
      expect(this.$static.queryOptionLabel.nth(9)).toBeVisible(),
      expect(this.$static.queryOptionLabel.nth(9)).toHaveText('Raise a new query'),
    ]);
  }

  public async completePageAndContinue(options: { queryOption: RaiseQueryOptionType }): Promise<void> {
    const queryOptionRadio = this.page.getByRole('radio', { name: options.queryOption, exact: true });
    await queryOptionRadio.check();
    await expect(queryOptionRadio).toBeChecked();

    if (options.queryOption === 'Raise a new query') {
      await this.navigationClick(this.$interactive.continueButton);
    } else {
      await expect(async () => {
        if (await queryOptionRadio.isVisible()) {
          this.$interactive.continueButton.click();
        }
        await expect(queryOptionRadio).not.toBeVisible({ timeout: 5_000 });
      }).toPass({ intervals: [1_000], timeout: 30_000 });
    }
  }
}
