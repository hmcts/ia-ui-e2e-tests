import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class DraftHearingRequirementsisHearingLoopNeededPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    hearingLoopYesRadio: this.page.locator('input[id="isHearingLoopNeeded_Yes"]'),
    hearingLoopNoRadio: this.page.locator('input[id="isHearingLoopNeeded_No"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span.govuk-caption-l', { hasText: 'Submit hearing requirements' }),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Hearing loop', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    hearingLoopQuestion: this.page.getByText('Do you need a hearing loop?', { exact: true }),
    yesLabel: this.page.locator('label[for="isHearingLoopNeeded_Yes"]'),
    noLabel: this.page.locator('label[for="isHearingLoopNeeded_No"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsisHearingLoopNeeded',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.hearingLoopQuestion).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { hearingLoopRequired: YesOrNoType }): Promise<void> {
    const radio = options.hearingLoopRequired === 'Yes' ? this.$inputs.hearingLoopYesRadio : this.$inputs.hearingLoopNoRadio;

    await radio.check();
    await expect(radio).toBeChecked();
    await this.navigationClick(this.$interactive.continueButton);
  }
}
