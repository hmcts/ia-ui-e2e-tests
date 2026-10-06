import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { GrantedOrRefusedType } from '../../../../../../exui-event-types';
import { YesOrNoType } from '../../../../../../citizen-types';

export class ReviewHearingRequirementsAddtionalRequirementsPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly listOfQuestions = {
    isThereAnythingElseYouWouldLikeToRequest: 'Is there anything else you would like to request?',
    provideDetailsOfAddtionalRequest: 'Provide details of any additional requests and why they are necessary.',
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
    tribunalResponseTextarea: this.page.locator('textarea[id="additionalTribunalResponse"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Review hearing requirements', exact: true }),
    caseRecordHeading: this.$commonElements.caseRecordHeading,
    adjustmentRequestHeading: this.page.getByRole('heading', { level: 2, name: 'Adjustment request', exact: true }),
    tribunalResponseHeading: this.page.getByRole('heading', { level: 2, name: 'Tribunal response', exact: true }),
    isAdditionalAdjustmentsAllowedLabel: this.page.locator('label[for="isAdditionalAdjustmentsAllowed"]'),
    grantedLabel: this.page.locator('label[for="isAdditionalAdjustmentsAllowed-Granted"]'),
    refusedLabel: this.page.locator('label[for="isAdditionalAdjustmentsAllowed-Refused"]'),
    tribunalResponseLabel: this.page.locator('label[for="additionalTribunalResponse"]'),
    tribunalResponseHint: this.page.locator('label[for="additionalTribunalResponse"] + span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/reviewHearingRequirements/reviewHearingRequirementsadjustAdditionalRequirements',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextAndAnswersOnPage(options: {
    wouldYouLikeToRequestAddtionalRequirements: YesOrNoType;
    detailOfRequest?: string;
  }): Promise<void> {
    const assertionsToRun = [
      expect(this.$static.caseRecordHeading).toBeVisible(),

      expect(this.$static.adjustmentRequestHeading).toBeVisible(),
      expect(this.$questionLocator('isThereAnythingElseYouWouldLikeToRequest')).toBeVisible(),
      expect(this.$questionValueLocator('isThereAnythingElseYouWouldLikeToRequest')).toBeVisible(),
      expect(this.$questionValueLocator('isThereAnythingElseYouWouldLikeToRequest')).toHaveText(options.wouldYouLikeToRequestAddtionalRequirements),

      expect(this.$static.tribunalResponseHeading).toBeVisible(),

      expect(this.$static.isAdditionalAdjustmentsAllowedLabel).toHaveText('Other adjustments decision'),
      expect(this.$static.isAdditionalAdjustmentsAllowedLabel).toBeVisible(),
      expect(this.$static.grantedLabel).toHaveText('Granted'),
      expect(this.$static.grantedLabel).toBeVisible(),
      expect(this.$static.refusedLabel).toHaveText('Refused'),
      expect(this.$static.refusedLabel).toBeVisible(),

      expect(this.$static.tribunalResponseLabel).toHaveText('Other adjustments'),
      expect(this.$static.tribunalResponseLabel).toBeVisible(),
      expect(this.$static.tribunalResponseHint).toHaveText(
        "State what adjustments the Tribunal will provide, or explain why their request's cannot be fulfilled.",
      ),
      expect(this.$static.tribunalResponseHint).toBeVisible(),
    ];

    if (options.wouldYouLikeToRequestAddtionalRequirements === 'Yes' && !options.detailOfRequest) {
      throw new Error('detailOfRequest must be provided if wouldYouLikeToRequestAddtionalRequirements is Yes');
    } else if (options.wouldYouLikeToRequestAddtionalRequirements === 'Yes' && options.detailOfRequest) {
      assertionsToRun.push(
        /* eslint-disable playwright/missing-playwright-await */
        expect(this.$questionLocator('provideDetailsOfAddtionalRequest')).toBeVisible(),
        expect(this.$questionValueLocator('provideDetailsOfAddtionalRequest')).toBeVisible(),
        expect(this.$questionValueLocator('provideDetailsOfAddtionalRequest')).toHaveText(options.detailOfRequest),
        /* eslint-disable playwright/missing-playwright-await */
      );
    } else {
      assertionsToRun.push(
        expect(this.$questionLocator('provideDetailsOfAddtionalRequest')).toBeHidden(),
        expect(this.$questionValueLocator('provideDetailsOfAddtionalRequest')).toBeHidden(),
      );
    }

    await Promise.all(assertionsToRun);
  }

  public async completePageAndContinue(options: { isAdditionalAdjustmentAllowed: GrantedOrRefusedType; description: string }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][id*="${options.isAdditionalAdjustmentAllowed}"]`);
    await element.check();
    await expect(element).toBeChecked();

    await this.$inputs.tribunalResponseTextarea.fill(options.description);
    await expect(this.$inputs.tribunalResponseTextarea).toHaveValue(options.description);

    await this.navigationClick(this.$interactive.continueButton);
  }

  public async continueOntoNextPage(): Promise<void> {
    await this.navigationClick(this.$interactive.continueButton);
  }
}
