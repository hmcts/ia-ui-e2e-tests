import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { GrantedOrRefusedType } from '../../../../../../exui-event-types';
import { YesOrNoType } from '../../../../../../citizen-types';

export class ReviewHearingRequirementsMultimediaEvidencePage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly listOfQuestions = {
    doYouHaveMultimediaEvidence: 'Do you have multimedia evidence?',
    explainWhyUnableToProvideEquipmentToPlayEvidence:
      "You should provide the equipment to play this evidence. If this is not possible, explain why and what equipment you'll need to play it.",
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
    tribunalResponseTextarea: this.page.locator('textarea[id="multimediaTribunalResponse"]'),
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
    isMultimediaAllowedLabel: this.page.locator('label[for="isMultimediaAllowed"]'),
    grantedLabel: this.page.locator('label[for="isMultimediaAllowed-Granted"]'),
    refusedLabel: this.page.locator('label[for="isMultimediaAllowed-Refused"]'),
    multimediaEquipment: this.page.locator('label[for="multimediaTribunalResponse"]'),
    multimediaEquipmentHint: this.page.locator('label[for="multimediaTribunalResponse"] + span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/reviewHearingRequirements/reviewHearingRequirementsadjustMultimediaRequirements',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextAndAnswersOnPage(options: { doYouHaveMultimediaEvidence: YesOrNoType; detailOfRequest?: string }): Promise<void> {
    const assertionsToRun = [
      expect(this.$static.caseRecordHeading).toBeVisible(),

      expect(this.$static.adjustmentRequestHeading).toBeVisible(),
      expect(this.$questionLocator('doYouHaveMultimediaEvidence')).toBeVisible(),
      expect(this.$questionValueLocator('doYouHaveMultimediaEvidence')).toBeVisible(),
      expect(this.$questionValueLocator('doYouHaveMultimediaEvidence')).toHaveText(options.doYouHaveMultimediaEvidence),

      expect(this.$static.tribunalResponseHeading).toBeVisible(),

      expect(this.$static.isMultimediaAllowedLabel).toHaveText('Multimedia decision'),
      expect(this.$static.isMultimediaAllowedLabel).toBeVisible(),
      expect(this.$static.grantedLabel).toHaveText('Granted'),
      expect(this.$static.grantedLabel).toBeVisible(),
      expect(this.$static.refusedLabel).toHaveText('Refused'),
      expect(this.$static.refusedLabel).toBeVisible(),

      expect(this.$static.multimediaEquipment).toHaveText('Multimedia equipment'),
      expect(this.$static.multimediaEquipment).toBeVisible(),
      expect(this.$static.multimediaEquipmentHint).toHaveText(
        'State what adjustments the Tribunal will provide, or explain why this request cannot be fulfilled.',
      ),
      expect(this.$static.multimediaEquipmentHint).toBeVisible(),
    ];

    if (options.doYouHaveMultimediaEvidence === 'Yes' && !options.detailOfRequest) {
      throw new Error('detailOfRequest must be provided if doYouHaveMultimediaEvidence is Yes');
    } else if (options.doYouHaveMultimediaEvidence === 'Yes' && options.detailOfRequest) {
      assertionsToRun.push(
        /* eslint-disable playwright/missing-playwright-await */
        expect(this.$questionLocator('explainWhyUnableToProvideEquipmentToPlayEvidence')).toBeVisible(),
        expect(this.$questionValueLocator('explainWhyUnableToProvideEquipmentToPlayEvidence')).toBeVisible(),
        expect(this.$questionValueLocator('explainWhyUnableToProvideEquipmentToPlayEvidence')).toHaveText(options.detailOfRequest),
        /* eslint-disable playwright/missing-playwright-await */
      );
    } else {
      assertionsToRun.push(
        expect(this.$questionLocator('explainWhyUnableToProvideEquipmentToPlayEvidence')).toBeHidden(),
        expect(this.$questionValueLocator('explainWhyUnableToProvideEquipmentToPlayEvidence')).toBeHidden(),
      );
    }

    await Promise.all(assertionsToRun);
  }

  public async completePageAndContinue(options: { isMultimediaAllowed: GrantedOrRefusedType; description: string }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][id*="${options.isMultimediaAllowed}"]`);
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
