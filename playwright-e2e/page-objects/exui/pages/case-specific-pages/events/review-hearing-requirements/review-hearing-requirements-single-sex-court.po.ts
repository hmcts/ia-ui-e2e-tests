import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { GrantedOrRefusedType } from '../../../../../../exui-event-types';
import { YesOrNoType } from '../../../../../../citizen-types';
import { AllMaleOrFemaleHearingType } from '../../../../../../citizen-types';

export class ReviewHearingRequirementsSingleSexCourtPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly listOfQuestions = {
    doesAppellantNeedSingleSexCourt: 'Does the appellant need a single-sex court?',
    whatTypeOfCourtNeeded: 'What type of court do they need?',
    explainWhySingleSexCourtNeeded: 'Explain in detail why the appellant needs a single-sex court.',
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
    tribunalResponseTextarea: this.page.locator('textarea[id="singleSexCourtTribunalResponse"]'),
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
    isSingleSexCourtAllowedLabel: this.page.locator('label[for="isSingleSexCourtAllowed"]'),
    grantedLabel: this.page.locator('label[for="isSingleSexCourtAllowed-Granted"]'),
    refusedLabel: this.page.locator('label[for="isSingleSexCourtAllowed-Refused"]'),
    tribunalResponseLabel: this.page.locator('label[for="singleSexCourtTribunalResponse"]'),
    tribunalResponseHint: this.page.locator('label[for="singleSexCourtTribunalResponse"] + span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/reviewHearingRequirements/reviewHearingRequirementsadjustSingleSexCourtRequirements',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextAndAnswersOnPage(options: {
    doesAppellantNeedSingleSexCourt: YesOrNoType;
    typeOfCourt: AllMaleOrFemaleHearingType;
    detailOfRequest?: string;
  }): Promise<void> {
    const assertionsToRun = [
      expect(this.$static.caseRecordHeading).toBeVisible(),

      expect(this.$static.adjustmentRequestHeading).toBeVisible(),
      expect(this.$questionLocator('doesAppellantNeedSingleSexCourt')).toBeVisible(),
      expect(this.$questionValueLocator('doesAppellantNeedSingleSexCourt')).toBeVisible(),
      expect(this.$questionValueLocator('doesAppellantNeedSingleSexCourt')).toHaveText(options.doesAppellantNeedSingleSexCourt),

      expect(this.$static.tribunalResponseHeading).toBeVisible(),

      expect(this.$static.isSingleSexCourtAllowedLabel).toHaveText('Single-sex court decision'),
      expect(this.$static.isSingleSexCourtAllowedLabel).toBeVisible(),
      expect(this.$static.grantedLabel).toHaveText('Granted'),
      expect(this.$static.grantedLabel).toBeVisible(),
      expect(this.$static.refusedLabel).toHaveText('Refused'),
      expect(this.$static.refusedLabel).toBeVisible(),

      expect(this.$static.tribunalResponseLabel).toHaveText('Single-sex court'),
      expect(this.$static.tribunalResponseLabel).toBeVisible(),
      expect(this.$static.tribunalResponseHint).toHaveText(
        'State the gender requested and whether the Tribunal can accommodate this. If not, explain why this request cannot be fulfilled.',
      ),
      expect(this.$static.tribunalResponseHint).toBeVisible(),
    ];

    if ((options.doesAppellantNeedSingleSexCourt === 'Yes' && !options.typeOfCourt) || !options.detailOfRequest) {
      throw new Error('typeOfCourt and detailOfRequest must be provided if doesAppellantNeedSingleSexCourt is Yes');
    } else if (options.doesAppellantNeedSingleSexCourt === 'Yes' && options.typeOfCourt && options.detailOfRequest) {
      assertionsToRun.push(
        /* eslint-disable playwright/missing-playwright-await */
        expect(this.$questionLocator('whatTypeOfCourtNeeded')).toBeVisible(),
        expect(this.$questionValueLocator('whatTypeOfCourtNeeded')).toBeVisible(),
        expect(this.$questionValueLocator('whatTypeOfCourtNeeded')).toHaveText(options.typeOfCourt),

        expect(this.$questionLocator('explainWhySingleSexCourtNeeded')).toBeVisible(),
        expect(this.$questionValueLocator('explainWhySingleSexCourtNeeded')).toBeVisible(),
        expect(this.$questionValueLocator('explainWhySingleSexCourtNeeded')).toHaveText(options.detailOfRequest),
        /* eslint-disable playwright/missing-playwright-await */
      );
    } else {
      assertionsToRun.push(
        expect(this.$questionLocator('whatTypeOfCourtNeeded')).toBeHidden(),
        expect(this.$questionValueLocator('whatTypeOfCourtNeeded')).toBeHidden(),

        expect(this.$questionLocator('explainWhySingleSexCourtNeeded')).toBeHidden(),
        expect(this.$questionValueLocator('explainWhySingleSexCourtNeeded')).toBeHidden(),
      );
    }

    await Promise.all(assertionsToRun);
  }

  public async completePageAndContinue(options: { isSingleSexCourtAllowed: GrantedOrRefusedType; description: string }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][id*="${options.isSingleSexCourtAllowed}"]`);
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
