import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class DraftHearingRequirementsStepFreeAccessPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    stepFreeAccessYesRadio: this.page.locator('input[id="isHearingRoomNeeded_Yes"]'),
    stepFreeAccessNoRadio: this.page.locator('input[id="isHearingRoomNeeded_No"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span.govuk-caption-l', { hasText: 'Submit hearing requirements' }),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Step-free access', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    stepFreeAccessQuestion: this.page.getByText('Do you need a hearing room with step-free access?', { exact: true }),
    yesLabel: this.page.locator('label[for="isHearingRoomNeeded_Yes"]'),
    noLabel: this.page.locator('label[for="isHearingRoomNeeded_No"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsisHearingRoomNeeded',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.stepFreeAccessQuestion).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { stepFreeAccessRequired: YesOrNoType }): Promise<void> {
    const radio = options.stepFreeAccessRequired === 'Yes' ? this.$inputs.stepFreeAccessYesRadio : this.$inputs.stepFreeAccessNoRadio;

    await radio.check();
    await expect(radio).toBeChecked();
    await this.navigationClick(this.$interactive.continueButton);
  }
}
