import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class HearingRequirementsSingleSexCourtRequiredPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    singleSexCourtYesRadio: this.page.locator('input[id="singleSexCourt_Yes"]'),
    singleSexCourtNoRadio: this.page.locator('input[id="singleSexCourt_No"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span.govuk-caption-l', { hasText: 'Submit hearing requirements' }),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Single-sex court', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    singleSexCourtQuestion: this.page.getByText('Does the appellant need a single-sex court?', { exact: true }),
    yesLabel: this.page.locator('label[for="singleSexCourt_Yes"]'),
    noLabel: this.page.locator('label[for="singleSexCourt_No"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementssingleSexCourt',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.singleSexCourtQuestion).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { singleSexCourtRequired: YesOrNoType }): Promise<void> {
    const radio = options.singleSexCourtRequired === 'Yes' ? this.$inputs.singleSexCourtYesRadio : this.$inputs.singleSexCourtNoRadio;

    await radio.check();
    await expect(radio).toBeChecked();
    await this.navigationClick(this.$interactive.continueButton);
  }
}
