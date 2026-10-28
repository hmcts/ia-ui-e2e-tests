import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { YesOrNoType } from '../../../../../../citizen-types';

export class HearingRequirementsAdditionalRequestsFinalPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    additionalRequestsYesRadio: this.page.locator('input[id="additionalRequests_Yes"]'),
    additionalRequestsNoRadio: this.page.locator('input[id="additionalRequests_No"]'),
    additionalRequestsDescription: this.page.locator('textarea[id="additionalRequestsDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageCaption: this.page.locator('span.govuk-caption-l', { hasText: 'Submit hearing requirements' }),
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Additional requests', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    additionalRequestsQuestion: this.page.getByText('Is there anything else you would like to request?', { exact: true }),
    yesLabel: this.page.locator('label[for="additionalRequests_Yes"]'),
    noLabel: this.page.locator('label[for="additionalRequests_No"]'),
    additionalRequestsDescriptionLabel: this.page.locator('label[for="additionalRequestsDescription"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/draftHearingRequirements/draftHearingRequirementsadditionalRequests',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.pageCaption).toHaveText('Submit hearing requirements'),
      expect(this.$static.pageCaption).toBeVisible(),
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.additionalRequestsQuestion).toBeVisible(),
      expect(this.$static.yesLabel).toHaveText('Yes'),
      expect(this.$static.yesLabel).toBeVisible(),
      expect(this.$static.noLabel).toHaveText('No'),
      expect(this.$static.noLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(
    options:
      | { additionalRequests: Extract<YesOrNoType, 'Yes'>; additionalRequestsDescription: string }
      | { additionalRequests: Extract<YesOrNoType, 'No'>; additionalRequestsDescription?: never },
  ): Promise<void> {
    const radio = options.additionalRequests === 'Yes' ? this.$inputs.additionalRequestsYesRadio : this.$inputs.additionalRequestsNoRadio;

    await radio.check();
    await expect(radio).toBeChecked();

    if (options.additionalRequests === 'Yes') {
      await expect(this.$static.additionalRequestsDescriptionLabel).toHaveText(
        'Provide details of any additional requests and why they are necessary.',
      );
      await expect(this.$static.additionalRequestsDescriptionLabel).toBeVisible();
      await this.$inputs.additionalRequestsDescription.fill(options.additionalRequestsDescription);
      await expect(this.$inputs.additionalRequestsDescription).toHaveValue(options.additionalRequestsDescription);
    } else {
      await expect(this.$inputs.additionalRequestsDescription).toBeHidden();
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
