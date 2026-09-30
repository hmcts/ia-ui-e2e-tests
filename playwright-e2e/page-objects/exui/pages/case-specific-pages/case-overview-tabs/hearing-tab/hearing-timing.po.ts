import { expect, Locator, Page } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class HearingTimingPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Length, date and priority level of hearing', level: 1, exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-timing',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async completePageAndContinue(options: { hearingNeedsSpecificDate: YesOrNoType | 'Choose a date range' }): Promise<void> {
    const locatorToSelect = this.page.getByRole('radio', { name: options.hearingNeedsSpecificDate, exact: true });
    if (!(await locatorToSelect.isChecked())) {
      await locatorToSelect.click();
      await expect(locatorToSelect).toBeChecked();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
