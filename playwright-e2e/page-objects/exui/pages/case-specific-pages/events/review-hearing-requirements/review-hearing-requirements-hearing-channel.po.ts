import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { HearingChannelType } from '../../../../../../exui-event-types';

export class ReviewHearingRequirementsHearingChannelPage extends ExuiBase {
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
    hearingChannelLabel: this.page.locator('label[for="hearingChannel"]'),
    inPersonLabel: this.page.locator('label[for="hearingChannel_INTER"]'),
    notInAttendanceLabel: this.page.locator('label[for="hearingChannel_NA"]'),
    onThePapersLabel: this.page.locator('label[for="hearingChannel_ONPPRS"]'),
    telephoneLabel: this.page.locator('label[for="hearingChannel_TEL"]'),
    videoLabel: this.page.locator('label[for="hearingChannel_VID"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/reviewHearingRequirements/reviewHearingRequirementshearingChannel',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),

      expect(this.$static.hearingChannelLabel).toHaveText('What type of hearing is required?'),
      expect(this.$static.hearingChannelLabel).toBeVisible(),

      expect(this.$static.inPersonLabel).toHaveText('In Person'),
      expect(this.$static.inPersonLabel).toBeVisible(),

      expect(this.$static.notInAttendanceLabel).toHaveText('Not in Attendance'),
      expect(this.$static.notInAttendanceLabel).toBeVisible(),

      expect(this.$static.onThePapersLabel).toHaveText('On the Papers'),
      expect(this.$static.onThePapersLabel).toBeVisible(),

      expect(this.$static.telephoneLabel).toHaveText('Telephone'),
      expect(this.$static.telephoneLabel).toBeVisible(),

      expect(this.$static.videoLabel).toHaveText('Video'),
      expect(this.$static.videoLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { hearingChannel: HearingChannelType }): Promise<void> {
    const element = this.page.getByRole('radio', { name: options.hearingChannel, exact: true });
    await element.check();
    await expect(element).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
