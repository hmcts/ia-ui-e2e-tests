import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class HearingRequirementsInCameraCourtPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    inCameraCourtYesRadio: this.page.locator('input[id="inCameraCourt_Yes"]'),
    inCameraCourtNoRadio: this.page.locator('input[id="inCameraCourt_No"]'),
    inCameraCourtDescription: this.page.locator('textarea[id="inCameraCourtDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span.govuk-caption-l', { hasText: 'Submit hearing requirements' }),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'In camera court', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    inCameraCourtQuestion: this.page.getByText('Does the appellant need an in camera court?', { exact: true }),
    yesLabel: this.page.locator('label[for="inCameraCourt_Yes"]'),
    noLabel: this.page.locator('label[for="inCameraCourt_No"]'),
    inCameraCourtDescriptionLabel: this.page.locator('label[for="inCameraCourtDescription"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsinCameraCourt',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.inCameraCourtQuestion).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(
    options:
      | { inCameraCourtRequired: Extract<YesOrNoType, 'Yes'>; inCameraCourtDescription: string }
      | { inCameraCourtRequired: Extract<YesOrNoType, 'No'>; inCameraCourtDescription?: never },
  ): Promise<void> {
    const radio = options.inCameraCourtRequired === 'Yes' ? this.$inputs.inCameraCourtYesRadio : this.$inputs.inCameraCourtNoRadio;

    await radio.check();
    await expect(radio).toBeChecked();

    if (options.inCameraCourtRequired === 'Yes') {
      await expect(this.$static.inCameraCourtDescriptionLabel).toHaveText('Explain in detail why the appellant needs an in camera court.');
      await expect(this.$static.inCameraCourtDescriptionLabel).toBeVisible();
      await this.$inputs.inCameraCourtDescription.fill(options.inCameraCourtDescription);
      await expect(this.$inputs.inCameraCourtDescription).toHaveValue(options.inCameraCourtDescription);
    } else {
      await expect(this.$inputs.inCameraCourtDescription).toBeHidden();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
