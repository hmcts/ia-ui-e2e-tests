import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class DraftHearingRequirementsremoteVideoCallPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    remoteVideoCallYesRadio: this.page.locator('input[id="remoteVideoCall_Yes"]'),
    remoteVideoCallNoRadio: this.page.locator('input[id="remoteVideoCall_No"]'),
    remoteVideoCallDescription: this.page.locator('textarea[id="remoteVideoCallDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span.govuk-caption-l', { hasText: 'Submit hearing requirements' }),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Video hearings', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    paragraph: this.page.locator('#remoteVideoCallTitle p'),
    bullet: this.page.locator('#remoteVideoCallTitle li'),
    remoteVideoCallQuestion: this.page.getByText("Is there anything you'd like the Tribunal to consider when deciding if a video call is suitable?", {
      exact: true,
    }),
    yesLabel: this.page.locator('label[for="remoteVideoCall_Yes"]'),
    noLabel: this.page.locator('label[for="remoteVideoCall_No"]'),
    remoteVideoCallDescriptionLabel: this.page.locator('label[for="remoteVideoCallDescription"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsremoteVideoCall',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.paragraph.nth(0)).toHaveText(
        "There may be some things you'd like the Tribunal to consider when deciding if a video call is suitable. For example, will the appellant and/or any witnesses have:",
      ),
      expect(this.$static.paragraph.nth(0)).toBeVisible(),
      expect(this.$static.bullet.nth(0)).toHaveText('reliable access to a computer or mobile device, and the internet?'),
      expect(this.$static.bullet.nth(0)).toBeVisible(),
      expect(this.$static.bullet.nth(1)).toHaveText('access to a quiet, private room?'),
      expect(this.$static.bullet.nth(1)).toBeVisible(),
      expect(this.$static.bullet.nth(2)).toHaveText('a disability or anything else that would make it difficult to attend by video?'),
      expect(this.$static.bullet.nth(2)).toBeVisible(),
      expect(this.$static.remoteVideoCallQuestion).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(
    options:
      | { remoteVideoCall: Extract<YesOrNoType, 'Yes'>; remoteVideoCallDescription: string }
      | { remoteVideoCall: Extract<YesOrNoType, 'No'>; remoteVideoCallDescription?: never },
  ): Promise<void> {
    const radio = options.remoteVideoCall === 'Yes' ? this.$inputs.remoteVideoCallYesRadio : this.$inputs.remoteVideoCallNoRadio;

    await radio.check();
    await expect(radio).toBeChecked();

    if (options.remoteVideoCall === 'Yes') {
      await expect(this.$static.remoteVideoCallDescriptionLabel).toHaveText('Explain in detail anything you would like the Tribunal to consider');
      await expect(this.$static.remoteVideoCallDescriptionLabel).toBeVisible();
      await this.$inputs.remoteVideoCallDescription.fill(options.remoteVideoCallDescription);
      await expect(this.$inputs.remoteVideoCallDescription).toHaveValue(options.remoteVideoCallDescription);
    } else {
      await expect(this.$inputs.remoteVideoCallDescription).toBeHidden();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
