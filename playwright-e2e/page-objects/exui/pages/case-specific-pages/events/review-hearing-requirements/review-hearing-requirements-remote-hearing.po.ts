import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { GrantedOrRefusedType } from '../../../../../../exui-event-types';
import { YesOrNoType } from '../../../../../../citizen-types';

export class ReviewHearingRequirementsRemoteHearingPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly listOfQuestions = {
    anythingForTribunalToConsiderQuestion: "Is there anything you'd like the Tribunal to consider when deciding if a video call is suitable?",
    explainInDetailWhatYouLikeTheTribunalToConsiderQuestion: 'Explain in detail anything you would like the Tribunal to consider',
  } as const satisfies Record<string, string | RegExp>;

  private $questionLocator = (questionKey: keyof typeof this.listOfQuestions): Locator => {
    const question = this.listOfQuestions[questionKey];
    return this.page.getByText(question, { exact: !((question as string | RegExp) instanceof RegExp) });
  };

  private $questionValueLocator(questionKey: keyof typeof this.listOfQuestions): Locator {
    const question = this.listOfQuestions[questionKey];
    return this.page.locator('dt[class="case-field__label"]', { hasText: question }).locator('+ dd[class="case-field__value"] span');
  }

  public readonly $inputs = {
    tribunalResponseTextarea: this.page.locator('textarea[id="remoteVideoCallTribunalResponse"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Review hearing requirements', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    additionalAdjustmentsHeading: this.page.getByRole('heading', { level: 2, name: 'Additional adjustments', exact: true }),
    addtionalAdjustmentsParagraph: this.page.locator('[id="remoteHearingAdditionalAdjustmentsDescription"] p'),
    adjustmentRequestHeading: this.page.getByRole('heading', { level: 2, name: 'Adjustment request', exact: true }),
    isRemoteHearingAllowedLabel: this.page.locator('label[for="isRemoteHearingAllowed"]'),
    grantedLabel: this.page.locator('label[for="isRemoteHearingAllowed-Granted"]'),
    refusedLabel: this.page.locator('label[for="isRemoteHearingAllowed-Refused"]'),
    remoteHearingLabel: this.page.locator('label[for="remoteVideoCallTribunalResponse"]'),
    remotehearingHint: this.page.locator('label[for="remoteVideoCallTribunalResponse"] + span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/reviewHearingRequirements/reviewHearingRequirementsadjustRemoteHearing',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextAndAnswersOnPage(options: { anythingForTribunalToConsider: YesOrNoType; detailOfRequest?: string }): Promise<void> {
    const assertionsToRun = [
      expect(this.$static.caseRecordHeading).toBeVisible(),

      expect(this.$static.additionalAdjustmentsHeading).toBeVisible(),
      expect(this.$static.addtionalAdjustmentsParagraph).toHaveText(
        "Check if the appellant has requested any additional adjustments and record your response in the relevant field. Do not enter the reason the appellant made the request. The respondent will be able to see this information and must not be informed of the appellant's personal circumstances.",
      ),
      expect(this.$static.addtionalAdjustmentsParagraph).toBeVisible(),

      expect(this.$static.adjustmentRequestHeading).toBeVisible(),
      expect(this.$questionLocator('anythingForTribunalToConsiderQuestion')).toBeVisible(),
      expect(this.$questionValueLocator('anythingForTribunalToConsiderQuestion')).toBeVisible(),
      expect(this.$questionValueLocator('anythingForTribunalToConsiderQuestion')).toHaveText(options.anythingForTribunalToConsider),

      expect(this.$static.isRemoteHearingAllowedLabel).toHaveText('Remote hearing decision'),
      expect(this.$static.isRemoteHearingAllowedLabel).toBeVisible(),
      expect(this.$static.grantedLabel).toHaveText('Granted'),
      expect(this.$static.grantedLabel).toBeVisible(),
      expect(this.$static.refusedLabel).toHaveText('Refused'),
      expect(this.$static.refusedLabel).toBeVisible(),

      expect(this.$static.remoteHearingLabel).toHaveText('Remote hearing'),
      expect(this.$static.remoteHearingLabel).toBeVisible(),
      expect(this.$static.remotehearingHint).toHaveText(
        'State what adjustments the Tribunal will provide, or explain why this request cannot be fulfilled.',
      ),
      expect(this.$static.remotehearingHint).toBeVisible(),
    ];

    if (options.anythingForTribunalToConsider === 'Yes' && !options.detailOfRequest) {
      throw new Error('detailOfRequest must be provided if anythingForTribunalToConsider is Yes');
    } else if (options.anythingForTribunalToConsider === 'Yes' && options.detailOfRequest) {
      assertionsToRun.push(
        /* eslint-disable playwright/missing-playwright-await */
        expect(this.$questionLocator('explainInDetailWhatYouLikeTheTribunalToConsiderQuestion')).toBeVisible(),
        expect(this.$questionValueLocator('explainInDetailWhatYouLikeTheTribunalToConsiderQuestion')).toBeVisible(),
        expect(this.$questionValueLocator('explainInDetailWhatYouLikeTheTribunalToConsiderQuestion')).toHaveText(options.detailOfRequest),
        /* eslint-disable playwright/missing-playwright-await */
      );
    } else {
      assertionsToRun.push(
        expect(this.$questionLocator('explainInDetailWhatYouLikeTheTribunalToConsiderQuestion')).toBeHidden(),
        expect(this.$questionValueLocator('explainInDetailWhatYouLikeTheTribunalToConsiderQuestion')).toBeHidden(),
      );
    }
    await Promise.all(assertionsToRun);
  }

  public async completePageAndContinue(options: { isRemoteHearingAllowed: GrantedOrRefusedType; description: string }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][id*="${options.isRemoteHearingAllowed}"]`);
    await element.check();
    await expect(element).toBeChecked();

    await this.$inputs.tribunalResponseTextarea.fill(options.description);
    await expect(this.$inputs.tribunalResponseTextarea).toHaveValue(options.description);

    await this.navigationClick(this.$interactive.continueButton);
  }
}
