import { Locator, Page, expect } from '@playwright/test';
import { ExuiBase } from '../../exui-base';
import { HearingFeeDecisionType } from '../../../../exui-event-types';

export class StartAppealHearingFeeDecisionPage extends ExuiBase {
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
    hearingFeeDecisionQuestionLabel: this.page.locator('div[id="decisionHearingFeeOption"] label[for="decisionHearingFeeOption"] span'),
    decisionWithHearingLabel: this.page.locator('label[for="decisionHearingFeeOption-decisionWithHearing"]'),
    decisionWithoutHearingLabel: this.page.locator('label[for="decisionHearingFeeOption-decisionWithoutHearing"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'startAppeal/startAppealhearingFeeDecision',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.pageCaption).toHaveText('Start the appeal'),
      expect(this.$static.hearingFeeDecisionQuestionLabel).toBeVisible(),
      expect(this.$static.hearingFeeDecisionQuestionLabel).toHaveText('How do you want the appeal to be decided?'),
      expect(this.$static.decisionWithHearingLabel).toBeVisible(),
      expect(this.$static.decisionWithHearingLabel).toHaveText('Decision with a hearing. The fee for this type of appeal is £144'),
      expect(this.$static.decisionWithoutHearingLabel).toBeVisible(),
      expect(this.$static.decisionWithoutHearingLabel).toHaveText('Decision without a hearing. The fee for this type of appeal is £82'),
    ]);
  }

  public async completePageAndContinue(options: { hearingFeeDecision: HearingFeeDecisionType }): Promise<void> {
    const hearingFeeDecisionOption = this.page.getByRole('radio', { name: options.hearingFeeDecision, exact: true });
    await hearingFeeDecisionOption.check();
    await expect(hearingFeeDecisionOption).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
