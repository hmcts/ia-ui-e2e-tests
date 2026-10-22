import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class HearingRequirementsInterpreterNeededForAppellantPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    interpreterServicesNeededYesRadio: this.page.locator('input[id="isInterpreterServicesNeeded_Yes"]'),
    interpreterServicesNeededNoRadio: this.page.locator('input[id="isInterpreterServicesNeeded_No"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Submit hearing requirements', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    interpreterServicesQuestion: this.page.getByText(
      'Will the appellant need a spoken or sign language interpreter at the hearing?',
      { exact: true },
    ),
    yesLabel: this.page.locator('label[for="isInterpreterServicesNeeded_Yes"]'),
    noLabel: this.page.locator('label[for="isInterpreterServicesNeeded_No"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsisInterpreterServicesNeeded',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.interpreterServicesQuestion).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { interpreterServicesNeeded: YesOrNoType }): Promise<void> {
    const radio =
      options.interpreterServicesNeeded === 'Yes' ? this.$inputs.interpreterServicesNeededYesRadio : this.$inputs.interpreterServicesNeededNoRadio;

    await radio.check();
    await expect(radio).toBeChecked();
    await this.navigationClick(this.$interactive.continueButton);
  }
}
