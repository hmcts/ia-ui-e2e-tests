import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { GrantedOrRefusedType } from '../../../../../../exui-event-types';
import { YesOrNoType } from '../../../../../../citizen-types';

export class ReviewHearingRequirementsPersonalVulnerabilitiesPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly listOfQuestions = {
    doesAppellantHavePhysicalOrMentalHealthIssues: 'Does the appellant have any physical or mental health issues that may impact them on the day?',
    explainInDetailHowManyPhyscialOrMentalHealthIssues: 'Explain in detail how any physical or mental health issues may affect them on the day.',
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
    tribunalResponseTextarea: this.page.locator('textarea[id="vulnerabilitiesTribunalResponse"]'),
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
    addtionalAdjustmentsParagraph: this.page.locator('[id="additionalAdjustmentsDescription"] p'),
    adjustmentRequestHeading: this.page.getByRole('heading', { level: 2, name: 'Adjustment request', exact: true }),
    tribunalResponseHeading: this.page.getByRole('heading', { level: 2, name: 'Tribunal response', exact: true }),
    isVulnerabiltiesAllowedLabel: this.page.locator('label[for="isVulnerabilitiesAllowed"]'),
    grantedLabel: this.page.locator('label[for="isVulnerabilitiesAllowed-Granted"]'),
    refusedLabel: this.page.locator('label[for="isVulnerabilitiesAllowed-Refused"]'),
    adjustmentLabel: this.page.locator('label[for="vulnerabilitiesTribunalResponse"]'),
    adjustmentHint: this.page.locator('label[for="vulnerabilitiesTribunalResponse"] + span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/reviewHearingRequirements/reviewHearingRequirementsadjustPersonalVulnerabilities',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextAndAnswersOnPage(options: {
    doesAppellantHavePhysicalOrMentalHealthIssues: YesOrNoType;
    detailOfRequest?: string;
  }): Promise<void> {
    const assertionsToRun = [
      expect(this.$static.caseRecordHeading).toBeVisible(),

      expect(this.$static.additionalAdjustmentsHeading).toBeVisible(),
      expect(this.$static.addtionalAdjustmentsParagraph).toHaveText(
        "Check if the appellant has requested any additional adjustments and record your response in the relevant field. Do not enter the reason the appellant made the request. The respondent will be able to see this information and must not be informed of the appellant's personal circumstances.",
      ),
      expect(this.$static.addtionalAdjustmentsParagraph).toBeVisible(),

      expect(this.$static.adjustmentRequestHeading).toBeVisible(),
      expect(this.$questionLocator('doesAppellantHavePhysicalOrMentalHealthIssues')).toBeVisible(),
      expect(this.$questionValueLocator('doesAppellantHavePhysicalOrMentalHealthIssues')).toBeVisible(),
      expect(this.$questionValueLocator('doesAppellantHavePhysicalOrMentalHealthIssues')).toHaveText(
        options.doesAppellantHavePhysicalOrMentalHealthIssues,
      ),

      expect(this.$static.tribunalResponseHeading).toBeVisible(),

      expect(this.$static.isVulnerabiltiesAllowedLabel).toHaveText('Vulnerabilities decision'),
      expect(this.$static.isVulnerabiltiesAllowedLabel).toBeVisible(),
      expect(this.$static.grantedLabel).toHaveText('Granted'),
      expect(this.$static.grantedLabel).toBeVisible(),
      expect(this.$static.refusedLabel).toHaveText('Refused'),
      expect(this.$static.refusedLabel).toBeVisible(),

      expect(this.$static.adjustmentLabel).toHaveText('Adjustments to accommodate vulnerabilities'),
      expect(this.$static.adjustmentLabel).toBeVisible(),
      expect(this.$static.adjustmentHint).toHaveText(
        'State what adjustments the Tribunal will provide, or explain why this request cannot be fulfilled.',
      ),
      expect(this.$static.adjustmentHint).toBeVisible(),
    ];

    if (options.doesAppellantHavePhysicalOrMentalHealthIssues === 'Yes' && !options.detailOfRequest) {
      throw new Error('detailOfRequest must be provided if doesAppellantHavePhysicalOrMentalHealthIssues is Yes');
    } else if (options.doesAppellantHavePhysicalOrMentalHealthIssues === 'Yes' && options.detailOfRequest) {
      assertionsToRun.push(
        /* eslint-disable playwright/missing-playwright-await */
        expect(this.$questionLocator('explainInDetailHowManyPhyscialOrMentalHealthIssues')).toBeVisible(),
        expect(this.$questionValueLocator('explainInDetailHowManyPhyscialOrMentalHealthIssues')).toBeVisible(),
        expect(this.$questionValueLocator('explainInDetailHowManyPhyscialOrMentalHealthIssues')).toHaveText(options.detailOfRequest),
        /* eslint-disable playwright/missing-playwright-await */
      );
    } else {
      assertionsToRun.push(
        expect(this.$questionLocator('explainInDetailHowManyPhyscialOrMentalHealthIssues')).toBeHidden(),
        expect(this.$questionValueLocator('explainInDetailHowManyPhyscialOrMentalHealthIssues')).toBeHidden(),
      );
    }

    await Promise.all(assertionsToRun);
  }

  public async completePageAndContinue(options: { isVulnerabilitiesAllowed: GrantedOrRefusedType; description: string }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][id*="${options.isVulnerabilitiesAllowed}"]`);
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
