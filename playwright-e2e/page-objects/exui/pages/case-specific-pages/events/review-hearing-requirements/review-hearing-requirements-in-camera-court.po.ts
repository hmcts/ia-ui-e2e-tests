import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { GrantedOrRefusedType } from '../../../../../../exui-event-types';
import { YesOrNoType } from '../../../../../../citizen-types';

export class ReviewHearingRequirementsInCameraCourtPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly listOfQuestions = {
    doesAppellantNeedInCameraCourt: 'Does the appellant need an in camera court?',
    explainWhyInCameraCourtNeeded: 'Explain in detail why the appellant needs an in camera court.',
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
    tribunalResponseTextarea: this.page.locator('textarea[id="inCameraCourtTribunalResponse"]'),
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
    isInCameraCourtAllowedLabel: this.page.locator('label[for="isInCameraCourtAllowed"]'),
    grantedLabel: this.page.locator('label[for="isInCameraCourtAllowed-Granted"]'),
    refusedLabel: this.page.locator('label[for="isInCameraCourtAllowed-Refused"]'),
    tribunalResponseLabel: this.page.locator('label[for="inCameraCourtTribunalResponse"]'),
    tribunalResponseHint: this.page.locator('label[for="inCameraCourtTribunalResponse"] + span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/reviewHearingRequirements/reviewHearingRequirementsadjustInCameraCourtRequirements',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextAndAnswersOnPage(options: { doesAppellantNeedInCameraCourt: YesOrNoType; detailOfRequest?: string }): Promise<void> {
    const assertionsToRun = [
      expect(this.$static.caseRecordHeading).toBeVisible(),

      expect(this.$static.adjustmentRequestHeading).toBeVisible(),
      expect(this.$questionLocator('doesAppellantNeedInCameraCourt')).toBeVisible(),
      expect(this.$questionValueLocator('doesAppellantNeedInCameraCourt')).toBeVisible(),
      expect(this.$questionValueLocator('doesAppellantNeedInCameraCourt')).toHaveText(options.doesAppellantNeedInCameraCourt),

      expect(this.$static.tribunalResponseHeading).toBeVisible(),

      expect(this.$static.isInCameraCourtAllowedLabel).toHaveText('In camera court decision'),
      expect(this.$static.isInCameraCourtAllowedLabel).toBeVisible(),
      expect(this.$static.grantedLabel).toHaveText('Granted'),
      expect(this.$static.grantedLabel).toBeVisible(),
      expect(this.$static.refusedLabel).toHaveText('Refused'),
      expect(this.$static.refusedLabel).toBeVisible(),

      expect(this.$static.tribunalResponseLabel).toHaveText('In camera court'),
      expect(this.$static.tribunalResponseLabel).toBeVisible(),
      expect(this.$static.tribunalResponseHint).toHaveText(
        'State whether the Tribunal can accommodate this, or explain why this request cannot be fulfilled.',
      ),
      expect(this.$static.tribunalResponseHint).toBeVisible(),
    ];

    if (options.doesAppellantNeedInCameraCourt === 'Yes' && !options.detailOfRequest) {
      throw new Error('detailOfRequest must be provided if doesAppellantNeedInCameraCourt is Yes');
    } else if (options.doesAppellantNeedInCameraCourt === 'Yes' && options.detailOfRequest) {
      assertionsToRun.push(
        /* eslint-disable playwright/missing-playwright-await */
        expect(this.$questionLocator('explainWhyInCameraCourtNeeded')).toBeVisible(),
        expect(this.$questionValueLocator('explainWhyInCameraCourtNeeded')).toBeVisible(),
        expect(this.$questionValueLocator('explainWhyInCameraCourtNeeded')).toHaveText(options.detailOfRequest),
        /* eslint-disable playwright/missing-playwright-await */
      );
    } else {
      assertionsToRun.push(
        expect(this.$questionLocator('explainWhyInCameraCourtNeeded')).toBeHidden(),
        expect(this.$questionValueLocator('explainWhyInCameraCourtNeeded')).toBeHidden(),
      );
    }

    await Promise.all(assertionsToRun);
  }

  public async completePageAndContinue(options: { isInCameraCourtAllowed: GrantedOrRefusedType; description: string }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][id*="${options.isInCameraCourtAllowed}"]`);
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
