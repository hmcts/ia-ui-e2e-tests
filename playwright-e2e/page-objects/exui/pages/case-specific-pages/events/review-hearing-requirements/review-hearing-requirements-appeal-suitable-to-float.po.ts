import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class ReviewHearingRequirementsAppealSuitableToFloatPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Review hearing requirements', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    isAppealSuitableToFloatText: this.page.locator('div[id="isAppealSuitableToFloat"] span'),
    yesLaabel: this.page.locator('label[for="isAppealSuitableToFloat_Yes"]'),
    noLabel: this.page.locator('label[for="isAppealSuitableToFloat_No"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/reviewHearingRequirements/reviewHearingRequirementsisAppealSuitableToFloat',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.isAppealSuitableToFloatText).toHaveText('Is the appeal suitable to float?'),
      expect(this.$static.isAppealSuitableToFloatText).toBeVisible(),
      expect(this.$static.yesLaabel).toHaveText('Yes'),
      expect(this.$static.yesLaabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { isAppealSuitableToFloat: YesOrNoType }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][id*="${options.isAppealSuitableToFloat}"]`);
    await element.check();
    await expect(element).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
