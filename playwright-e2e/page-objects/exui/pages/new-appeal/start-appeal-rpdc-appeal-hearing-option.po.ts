import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { HearingWihtoutFeeDecisionType } from '../../../../exui-event-types';

export class StartAppealRpDcAppealHearingOptionPage extends ExuiBase {
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
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Hearing type', exact: true }),
    appealHearingOptionQuestionLabel: this.page.locator('div[id="rpDcAppealHearingOption"] label[for="rpDcAppealHearingOption"] span'),
    decisionWithHearingLabel: this.page.locator('label[for="rpDcAppealHearingOption-decisionWithHearing"]'),
    decisionWithoutHearingLabel: this.page.locator('label[for="rpDcAppealHearingOption-decisionWithoutHearing"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealrpDCAppealHearingOption',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.appealHearingOptionQuestionLabel).toBeVisible(),
      expect(this.$static.appealHearingOptionQuestionLabel).toHaveText('How does the appellant want the appeal to be decided?'),
      expect(this.$static.decisionWithHearingLabel).toBeVisible(),
      expect(this.$static.decisionWithHearingLabel).toHaveText('Decision with a hearing'),
      expect(this.$static.decisionWithoutHearingLabel).toBeVisible(),
      expect(this.$static.decisionWithoutHearingLabel).toHaveText('Decision without a hearing'),
    ]);
  }

  public async completePageAndContinue(options: { appealHearingOption: HearingWihtoutFeeDecisionType }): Promise<void> {
    const appealHearingOption = this.page.getByRole('radio', { name: options.appealHearingOption, exact: true });
    await appealHearingOption.check();
    await expect(appealHearingOption).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
