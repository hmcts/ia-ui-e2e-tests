import { expect, Locator, Page } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class HearingLinkPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Will this hearing need to be linked to other hearings?', level: 1, exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-link',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async completePageAndContinue(options: { willThisHearingBeLinkedToOthers: YesOrNoType }): Promise<void> {
    const locatorToSelect = this.page.getByRole('radio', { name: options.willThisHearingBeLinkedToOthers, exact: true });
    if (!(await locatorToSelect.isChecked())) {
      await locatorToSelect.click();
      await expect(locatorToSelect).toBeChecked();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
